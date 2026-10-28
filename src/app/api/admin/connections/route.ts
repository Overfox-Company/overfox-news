import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { listConnections } from "@/lib/oauth";
export async function GET() {
  try { const session = await requireAdmin(); return Response.json({ connections: await listConnections(session.email) }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return authErrorResponse(error); }
}
