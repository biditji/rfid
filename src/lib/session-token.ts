import { EncryptJWT, jwtDecrypt } from "jose";
import type { User } from "@/types";

/**
 * The session cookie's format: an encrypted JWT (JWE, `dir` + A256GCM) holding
 * the signed-in user and the backend's bearer token.
 *
 * Encrypted rather than merely signed because it carries the backend token and
 * the user's email. The cookie is httpOnly, so page JavaScript can't read it;
 * encryption additionally keeps it opaque in logs and devtools.
 *
 * Deliberately free of `next/headers` so `proxy.ts` and route handlers, which
 * read cookies off the request, can share it.
 */

export const SESSION_COOKIE = "session";

/** Matches the backend token's `expiresIn: '30d'`; the session can't outlive it. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type SessionPayload = {
  user: User;
  /** The backend's JWT. Only ever read server-side, to call the API as this user. */
  token: string;
};

export function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set to at least 32 characters. Generate one with: openssl rand -base64 32"
    );
  }
  return secret;
}

/** A256GCM needs exactly 32 bytes; hashing lets the secret be any string. */
async function keyFrom(secret: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return new Uint8Array(digest);
}

export async function sealSession(
  payload: SessionPayload,
  secret: string = sessionSecret()
): Promise<string> {
  return new EncryptJWT({ user: payload.user, token: payload.token })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .encrypt(await keyFrom(secret));
}

const isUser = (value: unknown): value is User => {
  const user = value as Partial<User> | null;
  return (
    typeof user?._id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string"
  );
};

/**
 * The session in a cookie value, or null if it is missing, expired, tampered
 * with, or sealed under a different secret.
 */
export async function openSession(
  sealed: string | undefined,
  secret: string = sessionSecret()
): Promise<SessionPayload | null> {
  if (!sealed) return null;

  try {
    const { payload } = await jwtDecrypt(sealed, await keyFrom(secret), {
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: ["A256GCM"],
    });
    if (!isUser(payload.user) || typeof payload.token !== "string") return null;
    const { _id, name, email, role } = payload.user;
    return { user: { _id, name, email, role }, token: payload.token };
  } catch {
    return null;
  }
}

/** Cookie attributes for the session: invisible to JS, first-party only. */
export const sessionCookieOptions = {
  httpOnly: true,
  // Browsers reject Secure cookies over plain http, which `next dev` uses.
  secure: process.env.NODE_ENV === "production",
  // Lax keeps the cookie off cross-site POSTs (the CSRF vector) while still
  // sending it when someone follows a link to the site.
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
