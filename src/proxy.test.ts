import { beforeAll, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";
import { SESSION_COOKIE, sealSession } from "./lib/session-token";

const SECRET = "test-secret-that-is-at-least-32-characters-long";

beforeAll(() => {
  process.env.SESSION_SECRET = SECRET;
});

async function requestAs(path: string, role?: string) {
  const headers = new Headers();
  if (role) {
    const sealed = await sealSession(
      { user: { _id: "u1", name: "N", email: "n@example.com", role }, token: "t" },
      SECRET
    );
    headers.set("cookie", `${SESSION_COOKIE}=${sealed}`);
  }
  return proxy(new NextRequest(`http://localhost:3000${path}`, { headers }));
}

describe("proxy", () => {
  it("sends signed-out visitors to login, remembering where they were going", async () => {
    const response = await requestAs("/admin/products?page=2");
    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("redirect")).toBe("/admin/products?page=2");
  });

  it("keeps customers out of the admin area", async () => {
    const response = await requestAs("/admin", "customer");
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/");
  });

  it("lets admins through", async () => {
    const response = await requestAs("/admin/orders", "admin");
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("lets any signed-in user see their own account pages", async () => {
    const response = await requestAs("/orders", "customer");
    expect(response.headers.get("location")).toBeNull();
  });

  it("treats a forged cookie as signed out", async () => {
    const response = proxy(
      new NextRequest("http://localhost:3000/admin", {
        headers: { cookie: `${SESSION_COOKIE}=forged.value.here.not.valid` },
      })
    );
    expect(new URL((await response).headers.get("location")!).pathname).toBe("/login");
  });
});
