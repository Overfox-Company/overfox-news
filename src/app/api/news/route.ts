import { NextResponse } from "next/server";
import { assertSameOrigin, requireAdmin } from "@/lib/auth";
import { createArticle, getNews } from "@/lib/news";
import { newsErrorResponse, readNewsBody } from "./errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const result = await getNews({ q: params.get("q") || undefined, category: params.get("category") || undefined, date: params.get("date") || undefined, page: Number(params.get("page")) || 1, limit: Number(params.get("limit")) || 12 });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return newsErrorResponse(error); }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdmin();
    const article = await createArticle(await readNewsBody(request));
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) { return newsErrorResponse(error); }
}
