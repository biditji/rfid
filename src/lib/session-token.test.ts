import { describe, expect, it } from "vitest";
import { EncryptJWT } from "jose";
import { openSession, sealSession, sessionSecret } from "./session-token";

const SECRET = "test-secret-that-is-at-least-32-characters-long";
const user = { _id: "u1", name: "Asha", email: "asha@example.com", role: "admin" };

describe("session token", () => {
  it("round-trips the user and backend token", async () => {
    const sealed = await sealSession({ user, token: "backend-jwt" }, SECRET);
    expect(await openSession(sealed, SECRET)).toEqual({ user, token: "backend-jwt" });
  });

  it("is opaque: neither the token nor the email appears in the cookie value", async () => {
    const sealed = await sealSession({ user, token: "backend-jwt" }, SECRET);
    const decodedParts = sealed.split(".").map((part) => Buffer.from(part, "base64url").toString());
    expect(decodedParts.join("")).not.toContain("backend-jwt");
    expect(decodedParts.join("")).not.toContain("asha@example.com");
  });

  it("rejects a session sealed under a different secret", async () => {
    const sealed = await sealSession({ user, token: "t" }, SECRET);
    expect(await openSession(sealed, `${SECRET}-rotated`)).toBeNull();
  });

  it("rejects a tampered cookie", async () => {
    const sealed = await sealSession({ user, token: "t" }, SECRET);
    const parts = sealed.split(".");
    parts[3] = parts[3].slice(0, -2) + (parts[3].endsWith("A") ? "BB" : "AA");
    expect(await openSession(parts.join("."), SECRET)).toBeNull();
  });

  it("rejects an expired session", async () => {
    const key = new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(SECRET))
    );
    const expired = await new EncryptJWT({ user, token: "t" })
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .encrypt(key);
    expect(await openSession(expired, SECRET)).toBeNull();
  });

  it("returns null for a missing or garbage cookie", async () => {
    expect(await openSession(undefined, SECRET)).toBeNull();
    expect(await openSession("not-a-jwe", SECRET)).toBeNull();
  });

  it("refuses to run without a strong SESSION_SECRET", () => {
    const original = process.env.SESSION_SECRET;
    try {
      delete process.env.SESSION_SECRET;
      expect(() => sessionSecret()).toThrow(/SESSION_SECRET/);
      process.env.SESSION_SECRET = "too-short";
      expect(() => sessionSecret()).toThrow(/32 characters/);
    } finally {
      if (original === undefined) delete process.env.SESSION_SECRET;
      else process.env.SESSION_SECRET = original;
    }
  });
});
