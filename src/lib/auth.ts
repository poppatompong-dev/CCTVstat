import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "cctvstat_session";
const MAX_AGE = 60 * 60 * 10;

function sessionSecret() {
  return process.env.SESSION_SECRET || process.env.APP_PASSWORD || "";
}

function sessionValue() {
  const secret = sessionSecret();
  if (!secret) return "";
  return createHash("sha256").update(`cctvstat:${secret}`).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function isAuthenticated() {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value ?? "";
  const expected = sessionValue();
  return Boolean(value && expected && safeEqual(value, expected));
}

export async function requireAuth() {
  if (!(await isAuthenticated())) redirect("/login");
}

export async function setAuthCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export function verifyPassword(input: string) {
  const configured = process.env.APP_PASSWORD;
  if (!configured) return { ok: false, reason: "ยังไม่ได้ตั้งค่า APP_PASSWORD" };
  return {
    ok: safeEqual(input, configured),
    reason: "รหัสผ่านไม่ถูกต้อง",
  };
}
