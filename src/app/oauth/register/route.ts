import { enforceRateLimit, requestIp } from "@/lib/auth";
import { OAuthError, oauthErrorResponse, registerClient } from "@/lib/oauth";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await enforceRateLimit(`oauth:register:${requestIp(request)}`, 20, 3600);
    const text = await request.text();
    if (text.length > 16000) throw new OAuthError("invalid_client_metadata", "Solicitud demasiado grande.");
    let body: unknown;
    try { body = JSON.parse(text); } catch { throw new OAuthError("invalid_client_metadata", "JSON inválido."); }
    return Response.json(await registerClient(body), { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return oauthErrorResponse(error); }
}
