import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // This is the Supabase auth cookie name
  const token = req.cookies.get("sb-access-token")?.value;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup"];

  // If the requested path is public, allow next:
  const pathname = req.nextUrl.pathname;
  for (const route of publicRoutes) {
    if (pathname.startsWith(route)) {
      return NextResponse.next();
    }
  }

  // If we have a token, user is authenticated => allow access
  if (token) {
    return NextResponse.next();
  }

  // Otherwise redirect them to login
  return NextResponse.redirect(new URL("/login", req.url));
}
