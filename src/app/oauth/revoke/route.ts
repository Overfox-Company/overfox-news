import { enforceRateLimit, requestIp } from "@/lib/auth";
import { oauthErrorResponse, revokeToken, OAuthError } from "@/lib/oauth";
export async function POST(request: Request) {
  try {
    await enforceRateLimit(`oauth:revoke:${requestIp(request)}`, 120, 900);
    const text = await request.text();
    if (text.length > 16000) throw new OAuthError("invalid_request", "Solicitud demasiado grande.");
    const params = new URLSearchParams(text);
    await revokeToken(params.get("token") || "", params.get("client_id") || "");
    return new Response(null, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return oauthErrorResponse(error); }
}
