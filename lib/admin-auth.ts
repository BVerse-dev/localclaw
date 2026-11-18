import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

// Admin sessions: the cookie holds a signed, expiring token — never the password.
// Format: <expiresAtMs>.<hex HMAC-SHA256(secret, "lc_admin:<expiresAtMs>")>
// Rotating ADMIN_PASSWORD (or ADMIN_SESSION_SECRET) invalidates every session.

export const ADMIN_COOKIE = "lc_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24; // 24 hours

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(`lc_admin:${payload}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Constant-time password check. */
export function checkAdminPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string") return false;
  // hash both sides so lengths match and timing doesn't leak the length
  const h = (s: string) => createHmac("sha256", "lc_pw").update(s).digest("hex");
  return safeEqual(h(input), h(expected));
}

export function createAdminToken(): string | null {
  const key = secret();
  if (!key) return null;
  const exp = String(Date.now() + ADMIN_SESSION_SECONDS * 1000);
  return `${exp}.${sign(exp, key)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  const key = secret();
  if (!key || !token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp, key));
}

export function isAdminRequest(req: NextRequest): boolean {
  return verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
}
