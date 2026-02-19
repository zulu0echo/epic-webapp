import { NextResponse } from "next/server";
import { getAdminToken, verifyAdminToken, adminCookieOptions } from "@/lib/auth";

const ADMIN_SECRET = process.env.EPIC_ADMIN_SECRET ?? "epictest123";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = body?.password ?? "";
  if (password !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const token = getAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieOptions().name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
