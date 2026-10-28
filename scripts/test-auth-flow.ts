/** Local integration check. Run only against the local development database/server. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { getDb, closeDb } from "../src/lib/db";

async function main() {
const base = process.env.APP_URL || "http://localhost:3001";
assert(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Integration tests require a local server");
const uri = new URL(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
assert(["localhost", "127.0.0.1", "[::1]"].includes(uri.hostname), "Integration tests require local MongoDB");
const secrets = await readFile(".secrets/admin-access.txt", "utf8");
const email = secrets.split("\n").find(line => line.startsWith("Administrador:"))?.split(":").slice(1).join(":").trim();
const password = secrets.split("\n").find(line => line.startsWith("Contraseña inicial:"))?.split(":").slice(1).join(":").trim();
assert(email && password, "Local test credentials are required");
const marker = randomUUID();
const redirectUri = "http://127.0.0.1:8123/callback";
let clientId = ""; let articleId = ""; let cookie = "";
const jsonHeaders = { "Content-Type": "application/json", Origin: base };
async function form(path: string, values: Record<string, string>, authenticated = false) {
  return fetch(`${base}${path}`, { method: "POST", redirect: "manual", headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: base, ...(authenticated ? { Cookie: cookie } : {}) }, body: new URLSearchParams(values) });
}
async function rpc(token: string, method: string, params: Record<string, unknown> = {}) {
  return fetch(`${base}/mcp`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", Authorization: `Bearer ${token}`, "MCP-Protocol-Version": "2025-03-26" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
}
async function getGrant(scope: string) {
  const verifier = randomBytes(48).toString("base64url");
  const codeChallenge = createHash("sha256").update(verifier).digest("base64url");
  const values = { client_id: clientId, redirect_uri: redirectUri, response_type: "code", code_challenge: codeChallenge, code_challenge_method: "S256", resource: `${base}/mcp`, scope, state: marker };
  const unauthorized = await form("/oauth/authorize", { ...values, decision: "allow" });
  assert(unauthorized.status === 401, "Consent must require an admin session");
  const page = await fetch(`${base}/admin/authorize?${new URLSearchParams(values)}`, { headers: { Cookie: cookie }, redirect: "manual" });
  assert(page.status === 200 && (await page.text()).includes("Integration agent"), "Consent page must identify the requesting client");
  const consent = await form("/oauth/authorize", { ...values, decision: "allow" }, true);
  assert(consent.status === 303, "Consent must return an authorization code");
  const location = new URL(consent.headers.get("location") || "https://invalid.test");
  assert(location.searchParams.get("state") === marker, "State must roundtrip");
  const code = location.searchParams.get("code"); assert(code, "Code must exist");
  const grant = { grant_type: "authorization_code", client_id: clientId, redirect_uri: redirectUri, resource: `${base}/mcp`, code, code_verifier: verifier };
  const wrong = await form("/oauth/token", { ...grant, code_verifier: "x".repeat(43) });
  assert(wrong.status === 400, "Wrong PKCE verifier must fail");
  const exchange = await form("/oauth/token", grant);
  assert(exchange.status === 200, "Valid PKCE exchange must succeed after a bad verifier");
  const tokens = await exchange.json();
  assert(typeof tokens.access_token === "string" && typeof tokens.refresh_token === "string", "Token pair must exist");
  const replay = await form("/oauth/token", grant);
  assert(replay.status === 400, "Authorization code replay must fail");
  return tokens as { access_token: string; refresh_token: string };
}
try {
  const forbidden = await fetch(`${base}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://evil.test" }, body: JSON.stringify({ email, password }) });
  assert(forbidden.status === 403, "Cross-origin login must fail");
  const login = await fetch(`${base}/api/auth/login`, { method: "POST", headers: jsonHeaders, body: JSON.stringify({ email, password }) });
  assert(login.status === 200, "Administrator login must succeed");
  cookie = login.headers.get("set-cookie")?.split(";")[0] || "";
  assert(cookie.startsWith("overfox_admin="), "Admin session cookie must exist");
  const me = await fetch(`${base}/api/auth/me`, { headers: { Cookie: cookie } });
  assert((await me.json()).user?.email === email, "Session must authenticate");
  console.log("PASS admin login, session and CSRF rejection");

  const metadata = await fetch(`${base}/.well-known/oauth-protected-resource/mcp`);
  assert(metadata.status === 200 && (await metadata.json()).resource === `${base}/mcp`, "Protected resource metadata must bind this server");
  const unauthorizedMcp = await fetch(`${base}/mcp`);
  assert(unauthorizedMcp.status === 401 && unauthorizedMcp.headers.has("www-authenticate"), "MCP must advertise OAuth when unauthenticated");
  const registration = await fetch(`${base}/oauth/register`, { method: "POST", headers: jsonHeaders, body: JSON.stringify({ client_name: `Integration agent ${marker}`, redirect_uris: [redirectUri], token_endpoint_auth_method: "none" }) });
  assert(registration.status === 201, "Public client registration must succeed");
  clientId = (await registration.json()).client_id;
  const writeTokens = await getGrant("news:read news:write");
  console.log("PASS OAuth discovery, consent, PKCE binding and single-use codes");

  const initialize = await rpc(writeTokens.access_token, "initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "integration", version: "1" } });
  assert(initialize.status === 200 && (await initialize.json()).result?.serverInfo?.name === "overfox-news", "MCP initialization must succeed");
  const listedTools = await rpc(writeTokens.access_token, "tools/list");
  assert((await listedTools.json()).result?.tools?.some((tool: { name: string }) => tool.name === "publish_news"), "Write grant must expose publication tool");
  const article = { title: `Integration test ${marker}`, description: "Noticia temporal para verificar el flujo completo de publicación del MCP.", content: "Contenido temporal de una prueba automatizada de publicación. Se elimina al finalizar la verificación.", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475", sourceUrl: `https://example.com/test/${marker}`, sourceName: "Integration test", company: "Overfox", category: "Pruebas", tags: ["test"], publishedAt: new Date().toISOString(), featured: false };
  const published = await rpc(writeTokens.access_token, "tools/call", { name: "publish_news", arguments: article });
  const publishedBody = await published.json();
  assert(!publishedBody.result?.isError, "MCP publication must succeed");
  const record = JSON.parse(publishedBody.result.content[0].text);
  articleId = record.id;
  assert(articleId && record.slug, "Publication must return persisted identifiers");
  const detail = await fetch(`${base}/noticias/${record.slug}`);
  assert(detail.status === 200 && (await detail.text()).includes(article.title), "Public detail must display the MCP article without a session");
  const updated = await rpc(writeTokens.access_token, "tools/call", { name: "update_news", arguments: { id: articleId, changes: { company: "Overfox QA" } } });
  assert(!(await updated.json()).result?.isError, "MCP update must succeed");
  console.log("PASS MCP initialization, tools, publication, public detail and update");

  const readTokens = await getGrant("news:read");
  const readTools = await rpc(readTokens.access_token, "tools/list");
  assert(!(await readTools.json()).result?.tools?.some((tool: { name: string }) => tool.name === "publish_news"), "Read grant cannot expose write tools");
  const badWrite = await rpc(readTokens.access_token, "tools/call", { name: "publish_news", arguments: article });
  const badWriteBody = await badWrite.json();
  assert(badWriteBody.error || badWriteBody.result?.isError, "Read grant cannot invoke a write tool");
  const refreshValues = { grant_type: "refresh_token", client_id: clientId, resource: `${base}/mcp`, refresh_token: writeTokens.refresh_token };
  const refreshed = await form("/oauth/token", refreshValues);
  assert(refreshed.status === 200, "Refresh must succeed");
  const renewed = await refreshed.json();
  assert((await form("/oauth/token", refreshValues)).status === 400, "Old refresh token replay must fail");
  assert((await rpc(writeTokens.access_token, "tools/list")).status === 401, "Old access token must be invalid after rotation");
  assert((await rpc(renewed.access_token, "tools/list")).status === 200, "New access token must work");
  const connections = await fetch(`${base}/api/admin/connections`, { headers: { Cookie: cookie } });
  const list = (await connections.json()).connections.filter((connection: { clientName: string }) => connection.clientName === `Integration agent ${marker}`);
  assert(list.length === 2, "Admin must see authorized connections");
  for (const connection of list) {
    const revoked = await fetch(`${base}/api/admin/connections/${connection.id}`, { method: "DELETE", headers: { Origin: base, Cookie: cookie } });
    assert(revoked.status === 200, "Admin revocation must succeed");
  }
  assert((await rpc(renewed.access_token, "tools/list")).status === 401, "Revoked access token must fail");
  assert((await form("/oauth/token", { ...refreshValues, refresh_token: renewed.refresh_token })).status === 400, "Revoked refresh token must fail");
  console.log("PASS scope enforcement, refresh rotation and admin revocation");
} finally {
  if (articleId) await fetch(`${base}/api/news/${articleId}`, { method: "DELETE", headers: { Origin: base, Cookie: cookie } });
  if (cookie) await fetch(`${base}/api/auth/logout`, { method: "POST", headers: { Origin: base, Cookie: cookie } });
  const db = await getDb();
  if (clientId) {
    await db.collection("oauth_clients").deleteMany({ _id: clientId as never });
    await db.collection("oauth_codes").deleteMany({ clientId });
    await db.collection("oauth_connections").deleteMany({ clientId });
  }
  await db.collection("news").deleteMany({ sourceUrl: `https://example.com/test/${marker}` });
  await closeDb();
}
console.log("PASS test data removed and session closed");

}
main().catch(error => { console.error(error instanceof Error ? error.message : "Integration check failed"); process.exitCode = 1; });
