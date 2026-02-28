import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  const auth = req.cookies.get("auth");

  const rotaLogin =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/api/login");

  // libera login
  if (rotaLogin) {
    return NextResponse.next();
  }

  // 🔒 SEM LOGIN = BLOQUEIA TUDO
  if (!auth) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api/public).*)",
  ],
};