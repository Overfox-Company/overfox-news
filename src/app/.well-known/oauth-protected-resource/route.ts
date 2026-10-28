import { appUrl } from "@/lib/auth";
import { OAUTH_SCOPES, resourceUrl } from "@/lib/oauth";
export async function GET() {
  return Response.json({ resource: resourceUrl(), resource_name: "Overfox News", authorization_servers: [appUrl()], scopes_supported: OAUTH_SCOPES, bearer_methods_supported: ["header"] }, { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } });
}
