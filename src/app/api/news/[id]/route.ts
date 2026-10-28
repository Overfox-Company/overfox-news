import { NextResponse } from "next/server";
import { assertSameOrigin, requireAdmin } from "@/lib/auth";
import { deleteArticle, getArticleById, updateArticle } from "@/lib/news";
import { newsErrorResponse, readNewsBody } from "../errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    const article = await getArticleById((await context.params).id);
    return article ? NextResponse.json({ article }) : NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
  } catch (error) { return newsErrorResponse(error); }
}

export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdmin();
    const article = await updateArticle((await context.params).id, await readNewsBody(request));
    return NextResponse.json({ article });
  } catch (error) { return newsErrorResponse(error); }
}

export async function DELETE(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    await requireAdmin();
    await deleteArticle((await context.params).id);
    return new Response(null, { status: 204 });
  } catch (error) { return newsErrorResponse(error); }
}
