import { cookies } from "next/headers";
import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getDb } from "@/lib/db";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE = "overfox_admin";
const SESSION_SECONDS = 60 * 60 * 12;
export class AuthError extends Error {
  constructor(message = "Inicia sesión para continuar.", public status = 401) { super(message); }
}
export function appUrl() {
  const configured = process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (!configured && process.env.NODE_ENV === "production") throw new Error("APP_URL is required in production");
  return new URL(configured || "http://localhost:3000").origin;
}
function secret() {
  const value = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("NEXTAUTH_SECRET must have at least 32 characters");
  return value;
}
export function hashSecret(value: string) { return createHash("sha256").update(value).digest("hex"); }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }
export function timingSafeStringEqual(a: string, b: string) {
  const aa = Buffer.from(a); const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  // Cookie-authenticated writes are only accepted from our own browser origin.
  if (!origin || origin !== new URL(request.url).origin || origin !== appUrl()) {
    throw new AuthError("Origen de la solicitud no permitido.", 403);
  }
}
export async function hashPassword(password: string) {
  const salt = randomBytes(24).toString("hex");
  const key = await scrypt(password, salt, 64) as Buffer;
  return `scrypt:${salt}:${key.toString("hex")}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [kind, salt, expected] = stored.split(":");
  if (kind !== "scrypt" || !/^[a-f\d]{48}$/.test(salt || "") || !/^[a-f\d]{128}$/.test(expected || "")) return false;
  const actual = await scrypt(password, salt, 64) as Buffer;
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
interface AdminSessionDoc { _id: string; email: string; credentialVersion: string; expiresAt: Date; }
function credentialVersion() { return hashSecret(`${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD_HASH}`); }
export async function createAdminSession(email: string) {
  const id = randomBytes(32).toString("base64url");
  const db = await getDb();
  const collection = db.collection<AdminSessionDoc>("admin_sessions");
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await collection.insertOne({ _id: hashSecret(id), email, credentialVersion: credentialVersion(), expiresAt: new Date(Date.now() + SESSION_SECONDS * 1000) });
  return `${id}.${sign(id)}`;
}
export async function getAdminSession() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return null;
  const [id, signature, extra] = value.split(".");
  if (!id || !signature || extra || !timingSafeStringEqual(sign(id), signature)) return null;
  const doc = await (await getDb()).collection<AdminSessionDoc>("admin_sessions").findOne({ _id: hashSecret(id), expiresAt: { $gt: new Date() }, credentialVersion: credentialVersion() });
  return doc ? { email: doc.email } : null;
}
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new AuthError();
  return session;
}
export async function destroyAdminSession() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (value) await (await getDb()).collection<AdminSessionDoc>("admin_sessions").deleteOne({ _id: hashSecret(value.split(".")[0]) });
}
export function sessionCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: SESSION_SECONDS };
}
interface RateLimitDoc { _id: string; count: number; expiresAt: Date; }
export async function enforceRateLimit(key: string, limit: number, windowSeconds: number) {
  const collection = (await getDb()).collection<RateLimitDoc>("rate_limits");
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  const window = Math.floor(Date.now() / (windowSeconds * 1000));
  const id = hashSecret(`${key}:${window}`);
  const row = await collection.findOneAndUpdate({ _id: id }, {
    $inc: { count: 1 },
    $setOnInsert: { expiresAt: new Date((window + 1) * windowSeconds * 1000) },
  }, { upsert: true, returnDocument: "after" });
  if (!row || row.count > limit) throw new AuthError("Demasiados intentos. Espera unos minutos e inténtalo de nuevo.", 429);
}
export function requestIp(request: Request) {
  // Vercel overwrites this header; local requests share one bucket.
  return process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown" : "local";
}
export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) return Response.json({ error: error.message }, { status: error.status, headers: { "Cache-Control": "no-store" } });
  console.error("Authentication operation failed", error instanceof Error ? error.name : "unknown");
  return Response.json({ error: "No se pudo completar la operación. Inténtalo de nuevo." }, { status: 503 });
}
