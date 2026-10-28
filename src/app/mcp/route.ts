import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { appUrl, enforceRateLimit } from "@/lib/auth";
import { createNewsMcpServer } from "@/lib/mcp";
import { resourceUrl, validateAccessToken } from "@/lib/oauth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
function unauthorized() {
  return Response.json({ error: "unauthorized", message: "Conecta el agente e inicia sesión en el panel para autorizarlo." }, {
    status: 401, headers: { "WWW-Authenticate": `Bearer resource_metadata="${appUrl()}/.well-known/oauth-protected-resource/mcp", scope="news:read news:write"`, "Cache-Control": "no-store" },
  });
}
async function handle(request: Request) {
  // Browser origins are validated; non-browser agents normally omit Origin.
  const origin = request.headers.get("origin");
  if (origin && origin !== appUrl()) return Response.json({ error: "Origen no permitido" }, { status: 403 });
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return unauthorized();
  try {
    const token = authorization.slice(7);
    const connection = await validateAccessToken(token);
    if (!connection) return unauthorized();
    await enforceRateLimit(`mcp:${connection._id}`, 180, 60);
    if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
    if (Number(request.headers.get("content-length")) > 131072) return Response.json({ error: "Solicitud demasiado grande" }, { status: 413 });
    const body = await request.text();
    if (Buffer.byteLength(body) > 131072) return Response.json({ error: "Solicitud demasiado grande" }, { status: 413 });
    let parsedBody: unknown;
    try { parsedBody = JSON.parse(body); } catch { return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400 }); }
    const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    const server = createNewsMcpServer(connection);
    await server.connect(transport);
    try {
      const response = await transport.handleRequest(request, { parsedBody, authInfo: { token, clientId: connection.clientId, scopes: connection.scope.split(" "), expiresAt: Math.floor(connection.accessExpiresAt.getTime() / 1000), resource: new URL(resourceUrl()) } });
      response.headers.set("Cache-Control", "no-store");
      return response;
    } finally { await server.close(); }
  } catch (error) {
    const status = error && typeof error === "object" && "status" in error && error.status === 429 ? 429 : 503;
    console.error("MCP request failed", error instanceof Error ? error.name : "unknown");
    return Response.json({ error: status === 429 ? "Demasiadas solicitudes" : "Servicio temporalmente no disponible" }, { status });
  }
}
export const POST = handle;
export const GET = handle;
export const DELETE = handle;
