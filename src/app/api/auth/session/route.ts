import type { NextRequest } from "next/server";
import { SESSION_COOKIE, openSession } from "@/lib/session-token";

/**
 * Who is signed in, for the client-side AuthContext. Answered from the cookie
 * alone — no backend round trip — so it's instant even when the backend is
 * cold-starting. The backend still validates the token on every real call.
 */
export async function GET(request: NextRequest) {
  const session = await openSession(request.cookies.get(SESSION_COOKIE)?.value);
  return Response.json(
    { user: session?.user ?? null },
    { headers: { "Cache-Control": "no-store" } }
  );
}
