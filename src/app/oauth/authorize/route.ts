import { appUrl, assertSameOrigin, requireAdmin } from "@/lib/auth";
import { issueAuthorizationCode, oauthErrorResponse, validateAuthorizationRequest, OAuthError } from "@/lib/oauth";
export async function GET(request: Request) {
  return Response.redirect(`${appUrl()}/admin/authorize${new URL(request.url).search}`, 302);
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await requireAdmin();
    const text = await request.text();
    if (text.length > 16000) throw new OAuthError("invalid_request", "Solicitud demasiado grande.");
    const params = new URLSearchParams(text);
    const auth = await validateAuthorizationRequest(params);
    const destination = new URL(auth.redirectUri);
    if (auth.state) destination.searchParams.set("state", auth.state);
    if (params.get("decision") === "allow") destination.searchParams.set("code", await issueAuthorizationCode(auth, session.email));
    else destination.searchParams.set("error", "access_denied");
    return Response.redirect(destination, 303);
  } catch (error) { return oauthErrorResponse(error); }
}
