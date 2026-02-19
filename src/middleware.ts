import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "epic_admin";
const ADMIN_SECRET = process.env.EPIC_ADMIN_SECRET ?? "epictest123";

function decodeToken(token: string): { t: number; secret: string } | null {
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as { t: number; secret: string };
  } catch {
    return null;
  }
}

function isProtected(pathname: string) {
  return pathname === "/rolodex" || pathname.startsWith("/rolodex/") || pathname === "/crm" || pathname.startsWith("/crm/");
}

export function middleware(request: NextRequest) {
  if (!isProtected(request.nextUrl.pathname)) return NextResponse.next();
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const decoded = token ? decodeToken(token) : null;
  if (!decoded || decoded.secret !== ADMIN_SECRET) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/rolodex", "/rolodex/:path*", "/crm", "/crm/:path*"],
};
