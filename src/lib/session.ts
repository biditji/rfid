import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SESSION_COOKIE, openSession, type SessionPayload } from "./session-token";

/**
 * The current request's session, for Server Components and Server Actions.
 * Memoized per request, so several checks in one render decrypt it once.
 */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  return openSession(cookieStore.get(SESSION_COOKIE)?.value);
});

export class UnauthorizedError extends Error {
  constructor(message = "Admin access required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Throws unless the caller is a signed-in admin.
 *
 * Every Server Action that needs admin rights must call this itself. Server
 * Actions are public POST endpoints, and `proxy.ts` is only an optimistic
 * first check — a matcher change can silently stop it covering an action.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (session?.user.role !== "admin") throw new UnauthorizedError();
  return session;
}
