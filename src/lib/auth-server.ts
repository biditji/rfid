import "server-only";
import { NextResponse } from "next/server";
import { ApiError } from "./api";
import { SESSION_COOKIE, sealSession, sessionCookieOptions } from "./session-token";
import type { AuthResponse } from "@/types";

/**
 * Turn a successful backend login/registration into a session: the user goes
 * back in the body, the backend token goes into the httpOnly cookie only.
 */
export async function sessionResponse(auth: AuthResponse): Promise<NextResponse> {
  const { token, _id, name, email, role } = auth;
  const user = { _id, name, email, role };

  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, await sealSession({ user, token }), sessionCookieOptions);
  return response;
}

/**
 * The backend's rejection ("Invalid credentials") passed through, or a 502.
 * `action` names what was attempted ("sign-in", "registration") for the log
 * and for the message a visitor sees when the failure isn't theirs to fix.
 */
export function authErrorResponse(error: unknown, action: string): NextResponse {
  if (error instanceof ApiError && error.status && error.status < 500) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  console.error(`[auth] ${action} failed:`, error);
  return NextResponse.json(
    { message: `We couldn't complete ${action} right now. Please try again in a moment.` },
    { status: 502 }
  );
}

export const forbiddenResponse = () =>
  NextResponse.json({ message: "Cross-site request blocked" }, { status: 403 });

/** The request's JSON body with every listed field a non-empty string, or null. */
export async function readCredentials<K extends string>(
  request: Request,
  fields: readonly K[]
): Promise<Record<K, string> | null> {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const values = {} as Record<K, string>;
    for (const field of fields) {
      const value = body?.[field];
      if (typeof value !== "string" || !value.trim()) return null;
      values[field] = value;
    }
    return values;
  } catch {
    return null;
  }
}
