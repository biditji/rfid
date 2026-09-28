import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SESSION_COOKIE, sealSession } from "./session-token";

const SECRET = "test-secret-that-is-at-least-32-characters-long";

const { revalidateTag, cookieJar } = vi.hoisted(() => ({
  revalidateTag: vi.fn(),
  cookieJar: new Map<string, string>(),
}));

vi.mock("next/cache", () => ({ revalidateTag }));
// Only the cookie store is faked; session decryption and the admin check are real.
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieJar.has(name) ? { name, value: cookieJar.get(name)! } : undefined),
  }),
}));

import { revalidateCategories, revalidateProducts } from "./revalidate";

async function signInAs(role: string | null) {
  cookieJar.clear();
  if (!role) return;
  const sealed = await sealSession(
    { user: { _id: "u1", name: "N", email: "n@example.com", role }, token: "t" },
    SECRET
  );
  cookieJar.set(SESSION_COOKIE, sealed);
}

beforeAll(() => {
  process.env.SESSION_SECRET = SECRET;
});

beforeEach(() => {
  revalidateTag.mockClear();
});

describe("cache revalidation actions", () => {
  it("flush the storefront cache for an admin", async () => {
    await signInAs("admin");
    await revalidateProducts();
    await revalidateCategories();
    expect(revalidateTag.mock.calls).toEqual([
      ["products", "max"],
      ["categories", "max"],
      ["products", "max"],
    ]);
  });

  it.each([
    ["a signed-out visitor", null],
    ["a customer", "customer"],
  ])("refuse %s", async (_label, role) => {
    await signInAs(role);
    await expect(revalidateProducts()).rejects.toThrow("Admin access required");
    await expect(revalidateCategories()).rejects.toThrow("Admin access required");
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("refuse a forged session cookie", async () => {
    cookieJar.set(SESSION_COOKIE, "forged.cookie.value.from.attacker");
    await expect(revalidateProducts()).rejects.toThrow("Admin access required");
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
