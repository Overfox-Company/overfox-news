import { randomBytes, randomUUID, createHash } from "node:crypto";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { appUrl, AuthError, hashSecret } from "@/lib/auth";

export const OAUTH_SCOPES = ["news:read", "news:write"];
const ACCESS_SECONDS = 3600;
const REFRESH_SECONDS = 60 * 60 * 24 * 30;
export function resourceUrl() { return `${appUrl()}/mcp`; }
export class OAuthError extends Error {
  constructor(public code: string, message: string, public status = 400) { super(message); }
}
export interface OAuthClient {
  _id: string; clientName: string; redirectUris: string[]; createdAt: Date;
}
interface AuthorizationCode {
  _id: string; clientId: string; redirectUri: string; challenge: string; resource: string; scope: string; email: string; expiresAt: Date;
}
export interface OAuthConnection {
  _id: string; clientId: string; clientName: string; email: string; resource: string; scope: string;
  accessHash: string; refreshHash: string; createdAt: Date; lastUsedAt: Date | null;
  accessExpiresAt: Date; expiresAt: Date; revokedAt: Date | null;
}
export function isAllowedRedirectUri(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.username || url.password || url.hash || value.length > 2048) return false;
    if (url.protocol === "https:") return true;
    return url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  } catch { return false; }
}
export function normalizeScope(scope: string | null | undefined) {
  const scopes = [...new Set((scope || OAUTH_SCOPES.join(" ")).trim().split(/\s+/))];
  if (!scopes.length || scopes.some(value => !OAUTH_SCOPES.includes(value))) throw new OAuthError("invalid_scope", "Solo se permiten los permisos news:read y news:write.");
  return scopes.sort().join(" ");
}
export function pkceChallenge(verifier: string) { return createHash("sha256").update(verifier).digest("base64url"); }
const clientRegistrationSchema = z.object({
  client_name: z.string().trim().min(1).max(100).default("Agente MCP"),
  redirect_uris: z.array(z.string().refine(isAllowedRedirectUri)).min(1).max(8),
  token_endpoint_auth_method: z.literal("none").optional(),
  grant_types: z.array(z.enum(["authorization_code", "refresh_token"])).optional(),
  response_types: z.array(z.literal("code")).optional(),
});
export async function registerClient(body: unknown) {
  const result = clientRegistrationSchema.safeParse(body);
  if (!result.success) throw new OAuthError("invalid_client_metadata", "Registra un cliente público con redirecciones HTTPS o HTTP de loopback.");
  const client: OAuthClient = { _id: randomUUID(), clientName: result.data.client_name, redirectUris: [...new Set(result.data.redirect_uris)], createdAt: new Date() };
  await (await getDb()).collection<OAuthClient>("oauth_clients").insertOne(client);
  return {
    client_id: client._id, client_id_issued_at: Math.floor(client.createdAt.getTime() / 1000),
    client_name: client.clientName, redirect_uris: client.redirectUris,
    grant_types: ["authorization_code", "refresh_token"], response_types: ["code"], token_endpoint_auth_method: "none",
  };
}
export interface AuthorizationRequest {
  client: OAuthClient; clientId: string; redirectUri: string; challenge: string; state: string; resource: string; scope: string;
}
export async function validateAuthorizationRequest(params: URLSearchParams): Promise<AuthorizationRequest> {
  const clientId = params.get("client_id") || "";
  const redirectUri = params.get("redirect_uri") || "";
  if (clientId.length > 100 || !redirectUri) throw new OAuthError("invalid_request", "Solicitud de autorización incompleta.");
  const client = await (await getDb()).collection<OAuthClient>("oauth_clients").findOne({ _id: clientId });
  if (!client || !client.redirectUris.includes(redirectUri) || !isAllowedRedirectUri(redirectUri)) throw new OAuthError("invalid_request", "Cliente o URL de retorno no válidos.");
  if (params.get("response_type") !== "code") throw new OAuthError("unsupported_response_type", "Se requiere el flujo authorization_code.");
  if (params.get("code_challenge_method") !== "S256") throw new OAuthError("invalid_request", "Se requiere PKCE S256.");
  const challenge = params.get("code_challenge") || "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(challenge)) throw new OAuthError("invalid_request", "El desafío PKCE no es válido.");
  const resource = params.get("resource") || resourceUrl();
  if (resource !== resourceUrl()) throw new OAuthError("invalid_target", "El recurso no corresponde a Overfox News.");
  const state = params.get("state") || "";
  if (state.length > 2048) throw new OAuthError("invalid_request", "El estado de autorización es demasiado largo.");
  return { client, clientId, redirectUri, challenge, resource, state, scope: normalizeScope(params.get("scope")) };
}
export async function issueAuthorizationCode(auth: AuthorizationRequest, email: string) {
  const code = randomBytes(32).toString("base64url");
  const collection = (await getDb()).collection<AuthorizationCode>("oauth_codes");
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await collection.insertOne({ _id: hashSecret(code), clientId: auth.clientId, redirectUri: auth.redirectUri, challenge: auth.challenge, resource: auth.resource, scope: auth.scope, email, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
  return code;
}
function freshTokens() {
  return { access: `ofn_a_${randomBytes(40).toString("base64url")}`, refresh: `ofn_r_${randomBytes(40).toString("base64url")}` };
}
function tokenResponse(tokens: ReturnType<typeof freshTokens>, scope: string) {
  return { access_token: tokens.access, token_type: "Bearer", expires_in: ACCESS_SECONDS, refresh_token: tokens.refresh, scope };
}
export async function exchangeAuthorizationCode(params: URLSearchParams) {
  const code = params.get("code") || "";
  const verifier = params.get("code_verifier") || "";
  const resource = params.get("resource") || resourceUrl();
  if (resource !== resourceUrl()) throw new OAuthError("invalid_target", "Recurso inválido.");
  if (!/^[A-Za-z0-9._~-]{43,128}$/.test(verifier) || code.length > 256) throw new OAuthError("invalid_grant", "Código o verificador no válidos.");
  const db = await getDb();
  // All grant bindings are checked in the atomic consume; a bad verifier cannot destroy a valid code.
  const grant = await db.collection<AuthorizationCode>("oauth_codes").findOneAndDelete({
    _id: hashSecret(code), clientId: params.get("client_id") || "", redirectUri: params.get("redirect_uri") || "",
    challenge: pkceChallenge(verifier), resource, expiresAt: { $gt: new Date() },
  });
  if (!grant) throw new OAuthError("invalid_grant", "El código expiró, fue utilizado o no corresponde a este cliente.");
  const client = await db.collection<OAuthClient>("oauth_clients").findOne({ _id: grant.clientId });
  if (!client) throw new OAuthError("invalid_client", "Cliente no válido.");
  const tokens = freshTokens(); const now = new Date();
  const collection = db.collection<OAuthConnection>("oauth_connections");
  await collection.createIndex({ accessHash: 1 }, { unique: true });
  await collection.createIndex({ refreshHash: 1 }, { unique: true });
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await collection.insertOne({ _id: randomUUID(), clientId: grant.clientId, clientName: client.clientName, email: grant.email, resource: grant.resource, scope: grant.scope,
    accessHash: hashSecret(tokens.access), refreshHash: hashSecret(tokens.refresh), createdAt: now, lastUsedAt: null,
    accessExpiresAt: new Date(now.getTime() + ACCESS_SECONDS * 1000), expiresAt: new Date(now.getTime() + REFRESH_SECONDS * 1000), revokedAt: null,
  });
  return tokenResponse(tokens, grant.scope);
}
export async function refreshAccessToken(params: URLSearchParams) {
  const refresh = params.get("refresh_token") || "";
  if (!refresh.startsWith("ofn_r_") || refresh.length > 256) throw new OAuthError("invalid_grant", "Token de renovación inválido.");
  const resource = params.get("resource") || resourceUrl();
  if (resource !== resourceUrl()) throw new OAuthError("invalid_target", "Recurso inválido.");
  const tokens = freshTokens(); const now = new Date();
  const collection = (await getDb()).collection<OAuthConnection>("oauth_connections");
  const existing = await collection.findOne({ refreshHash: hashSecret(refresh), clientId: params.get("client_id") || "", resource, revokedAt: null, expiresAt: { $gt: now } });
  if (!existing) throw new OAuthError("invalid_grant", "La conexión expiró, fue revocada o el token ya fue renovado.");
  const requestedScope = params.get("scope");
  const scope = requestedScope ? normalizeScope(requestedScope) : existing.scope;
  if (scope.split(" ").some(value => !existing.scope.split(" ").includes(value))) throw new OAuthError("invalid_scope", "No puedes ampliar los permisos durante la renovación.");
  // Compare-and-swap rotates both tokens; concurrent or replayed refreshes cannot win twice.
  const updated = await collection.findOneAndUpdate({ _id: existing._id, refreshHash: hashSecret(refresh), revokedAt: null, expiresAt: { $gt: now } }, {
    $set: { accessHash: hashSecret(tokens.access), refreshHash: hashSecret(tokens.refresh), accessExpiresAt: new Date(now.getTime() + ACCESS_SECONDS * 1000), lastUsedAt: now, scope },
  }, { returnDocument: "after" });
  if (!updated) throw new OAuthError("invalid_grant", "El token de renovación ya fue utilizado.");
  return tokenResponse(tokens, scope);
}
export async function validateAccessToken(token: string) {
  if (!token.startsWith("ofn_a_") || token.length > 256) return null;
  const now = new Date();
  return (await getDb()).collection<OAuthConnection>("oauth_connections").findOneAndUpdate({ accessHash: hashSecret(token), resource: resourceUrl(), revokedAt: null, accessExpiresAt: { $gt: now }, expiresAt: { $gt: now } }, { $set: { lastUsedAt: now } }, { returnDocument: "after" });
}
export async function revokeToken(token: string, clientId: string) {
  if (token.length > 256) return;
  await (await getDb()).collection<OAuthConnection>("oauth_connections").updateMany({ clientId, $or: [{ accessHash: hashSecret(token) }, { refreshHash: hashSecret(token) }] }, { $set: { revokedAt: new Date() } });
}
export async function listConnections(email: string) {
  const connections = await (await getDb()).collection<OAuthConnection>("oauth_connections").find({ email, revokedAt: null, expiresAt: { $gt: new Date() } }, { projection: { _id: 1, clientName: 1, scope: 1, createdAt: 1, lastUsedAt: 1, expiresAt: 1 } }).sort({ createdAt: -1 }).limit(100).toArray();
  return connections.map(connection => ({ id: connection._id, clientName: connection.clientName, scope: connection.scope, createdAt: connection.createdAt.toISOString(), lastUsedAt: connection.lastUsedAt?.toISOString() || null, expiresAt: connection.expiresAt.toISOString() }));
}
export async function revokeConnection(id: string, email: string) {
  return (await getDb()).collection<OAuthConnection>("oauth_connections").updateOne({ _id: id, email }, { $set: { revokedAt: new Date() } });
}
export function oauthErrorResponse(error: unknown) {
  if (error instanceof OAuthError) return Response.json({ error: error.code, error_description: error.message }, { status: error.status, headers: { "Cache-Control": "no-store" } });
  if (error instanceof AuthError) return Response.json({ error: error.status === 429 ? "temporarily_unavailable" : "access_denied", error_description: error.message }, { status: error.status });
  console.error("OAuth operation failed", error instanceof Error ? error.name : "unknown");
  return Response.json({ error: "server_error", error_description: "No se pudo completar la autorización." }, { status: 503 });
}
