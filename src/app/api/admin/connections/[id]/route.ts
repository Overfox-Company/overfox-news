import { assertSameOrigin, authErrorResponse, requireAdmin } from "@/lib/auth";
import { revokeConnection } from "@/lib/oauth";
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const session = await requireAdmin();
    const { id } = await params;
    const result = await revokeConnection(id, session.email);
    return Response.json({ ok: result.matchedCount > 0 }, { status: result.matchedCount ? 200 : 404 });
  } catch (error) { return authErrorResponse(error); }
}
