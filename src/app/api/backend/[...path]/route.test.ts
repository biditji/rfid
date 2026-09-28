import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { SESSION_COOKIE, sealSession } from "@/lib/session-token";
import { API_URL } from "@/lib/config";

const SECRET = "test-secret-that-is-at-least-32-characters-long";

beforeAll(() => {
  process.env.SESSION_SECRET = SECRET;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function captureUpstream(status = 200) {
  const calls: { url: string; init: RequestInit }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ ok: true }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    })
  );
  return calls;
}

const context = (...path: string[]) => ({ params: Promise.resolve({ path }) });

async function sessionCookie() {
  const sealed = await sealSession(
    { user: { _id: "u1", name: "N", email: "n@example.com", role: "admin" }, token: "backend-jwt" },
    SECRET
  );
  return `${SESSION_COOKIE}=${sealed}`;
}

describe("backend proxy route", () => {
  it("attaches the session's bearer token server-side and forwards the query", async () => {
    const calls = captureUpstream();
    const request = new NextRequest("http://localhost:3000/api/backend/orders?page=2", {
      headers: { cookie: await sessionCookie() },
    });

    const response = await GET(request, context("orders"));

    expect(response.status).toBe(200);
    expect(calls[0].url).toBe(`${API_URL}/orders?page=2`);
    expect(new Headers(calls[0].init.headers).get("authorization")).toBe("Bearer backend-jwt");
  });

  it("forwards anonymously when there is no session, leaving the backend to refuse", async () => {
    const calls = captureUpstream(401);
    const response = await GET(new NextRequest("http://localhost:3000/api/backend/cart"), context("cart"));
    expect(response.status).toBe(401);
    expect(new Headers(calls[0].init.headers).get("authorization")).toBeNull();
  });

  it("passes the request body through", async () => {
    const calls = captureUpstream();
    const request = new NextRequest("http://localhost:3000/api/backend/cart/add", {
      method: "POST",
      headers: { cookie: await sessionCookie(), "content-type": "application/json", host: "localhost:3000", origin: "http://localhost:3000" },
      body: JSON.stringify({ productId: "p1", quantity: 2 }),
    });

    await POST(request, context("cart", "add"));

    expect(new TextDecoder().decode(calls[0].init.body as ArrayBuffer)).toBe('{"productId":"p1","quantity":2}');
    expect(new Headers(calls[0].init.headers).get("content-type")).toBe("application/json");
  });

  it("refuses cross-site writes (CSRF)", async () => {
    const calls = captureUpstream();
    const request = new NextRequest("http://localhost:3000/api/backend/orders", {
      method: "POST",
      headers: { cookie: await sessionCookie(), host: "localhost:3000", origin: "https://evil.example" },
      body: "{}",
    });

    expect((await POST(request, context("orders"))).status).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it("refuses path traversal out of the API prefix", async () => {
    const calls = captureUpstream();
    const response = await GET(new NextRequest("http://localhost:3000/api/backend/x"), context("..", "uploads"));
    expect(response.status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it("answers 502 with a readable message when the backend is down", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("fetch failed"); }));
    const response = await GET(new NextRequest("http://localhost:3000/api/backend/cart"), context("cart"));
    expect(response.status).toBe(502);
    expect((await response.json()).message).toMatch(/unreachable/);
  });
});
