import { NextResponse } from "next/server";
import { adminCookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieOptions().name, "", { path: "/", maxAge: 0 });
  return res;
}
