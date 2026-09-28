import { ApiError } from "./api";
import type { User } from "@/types";

/**
 * Browser-side calls to this app's own /api/auth routes. The session itself is
 * an httpOnly cookie those routes set and clear; nothing here ever sees a token.
 */

async function postAuth(path: string, body: unknown, fallback: string): Promise<User> {
  const res = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.user) throw new ApiError(data?.message || fallback, res.status);
  return data.user as User;
}

export const signIn = (email: string, password: string) =>
  postAuth("login", { email, password }, "Login failed");

export const signUp = (name: string, email: string, password: string) =>
  postAuth("register", { name, email, password }, "Registration failed");

export async function signOut(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

/** The signed-in user, or null. */
export async function fetchSessionUser(): Promise<User | null> {
  const res = await fetch("/api/auth/session", { cache: "no-store" });
  if (!res.ok) throw new ApiError("Session check failed", res.status);
  return ((await res.json()) as { user: User | null }).user;
}

/**
 * Tokens used to live in localStorage, readable by any script on the page.
 * Wipe the leftover from browsers that signed in before the cookie session.
 */
export function clearLegacyToken() {
  try {
    window.localStorage.removeItem("rfid_token");
  } catch {
    // Storage blocked (private mode, disabled cookies): nothing to clear.
  }
}
