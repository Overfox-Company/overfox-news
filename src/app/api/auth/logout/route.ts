import { NextResponse } from "next/server";
import { assertSameOrigin, authErrorResponse, destroyAdminSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await destroyAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
    return response;
  } catch (error) { return authErrorResponse(error); }
}
