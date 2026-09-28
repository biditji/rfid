import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, openSession } from "@/lib/session-token";

/**
 * Server-side gate for account and admin pages: signed-out visitors are sent
 * to the login page, and non-admins never receive the admin UI at all.
 *
 * This is the optimistic check — it trusts the session cookie. The backend
 * still verifies the token on every API call, and admin Server Actions call
 * `requireAdmin()` themselves.
 */
export async function proxy(request: NextRequest) {
  const session = await openSession(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname, search } = request.nextUrl;

  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/admin") && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*"],
};
