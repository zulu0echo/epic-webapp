import { cookies } from "next/headers";

const COOKIE_NAME = "epic_admin";
const ADMIN_SECRET = process.env.EPIC_ADMIN_SECRET ?? "epictest123";

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  if (typeof Buffer !== "undefined") return Buffer.from(padded, "base64").toString("utf8");
  return atob(padded);
}

export function getAdminToken(): string {
  const payload = JSON.stringify({ t: Date.now(), secret: ADMIN_SECRET });
  return Buffer.from(payload).toString("base64url");
}

export function verifyAdminToken(token: string, secret?: string): boolean {
  try {
    const s = secret ?? process.env.EPIC_ADMIN_SECRET ?? "epictest123";
    const decoded = JSON.parse(base64UrlDecode(token));
    return decoded?.secret === s && typeof decoded?.t === "number";
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  return !!token && verifyAdminToken(token);
}

export function adminCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}
