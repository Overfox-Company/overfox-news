import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSameOrigin, AuthError, authErrorResponse, createAdminSession, enforceRateLimit, requestIp, SESSION_COOKIE, sessionCookieOptions, timingSafeStringEqual, verifyPassword } from "@/lib/auth";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit(`login:ip:${requestIp(request)}`, 10, 900);
    const parsed = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(256) }).safeParse(await request.json());
    if (!parsed.success) throw new AuthError("Correo o contraseña incorrectos.", 400);
    const email = parsed.data.email.toLowerCase();
    await enforceRateLimit(`login:email:${email}`, 15, 900);
    const expectedEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const stored = process.env.ADMIN_PASSWORD_HASH;
    if (!expectedEmail || !stored) throw new AuthError("El acceso de administración todavía no está configurado.", 503);
    const validPassword = await verifyPassword(parsed.data.password, stored);
    if (!timingSafeStringEqual(email, expectedEmail) || !validPassword) throw new AuthError("Correo o contraseña incorrectos.");
    const token = await createAdminSession(email);
    const response = NextResponse.json({ user: { email } }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) { return authErrorResponse(error); }
}
