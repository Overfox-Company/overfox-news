import { enforceRateLimit, requestIp } from "@/lib/auth";
import { exchangeAuthorizationCode, refreshAccessToken, OAuthError, oauthErrorResponse } from "@/lib/oauth";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await enforceRateLimit(`oauth:token:${requestIp(request)}`, 120, 900);
    if (!request.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) throw new OAuthError("invalid_request", "Usa application/x-www-form-urlencoded.");
    const text = await request.text();
    if (text.length > 16000) throw new OAuthError("invalid_request", "Solicitud demasiado grande.");
    const params = new URLSearchParams(text);
    const grant = params.get("grant_type");
    if (grant !== "authorization_code" && grant !== "refresh_token") throw new OAuthError("unsupported_grant_type", "Tipo de autorización no soportado.");
    const token = grant === "authorization_code" ? await exchangeAuthorizationCode(params) : await refreshAccessToken(params);
    return Response.json(token, { headers: { "Cache-Control": "no-store", Pragma: "no-cache" } });
  } catch (error) { return oauthErrorResponse(error); }
}
