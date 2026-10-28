import { authErrorResponse, getAdminSession } from "@/lib/auth";
export async function GET() {
  try { return Response.json({ user: await getAdminSession() }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return authErrorResponse(error); }
}
