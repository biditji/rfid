import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { SESSION_COOKIE, openSession } from "@/lib/session-token";
import { API_URL } from "@/lib/config";

const SECRET = "test-secret-that-is-at-least-32-characters-long";

beforeAll(() => {
  process.env.SESSION_SECRET = SECRET;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const loginRequest = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

function backendAnswers(status: number, body: unknown) {
  const fetchMock = vi.fn(
    async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const sessionCookieFrom = (response: Response) =>
  response.headers.getSetCookie().find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));

describe("POST /api/auth/login", () => {
  const credentials = { email: "buyer@example.com", password: "hunter22" };
  const backendUser = { _id: "u1", name: "Buyer", email: "buyer@example.com", role: "customer", token: "backend-jwt" };

  it("signs in: sets an httpOnly session cookie and keeps the backend token out of the body", async () => {
    const fetchMock = backendAnswers(200, backendUser);

    const response = await POST(loginRequest(credentials));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/auth/login`, expect.objectContaining({ method: "POST" }));
    expect(body).toEqual({ user: { _id: "u1", name: "Buyer", email: "buyer@example.com", role: "customer" } });
    expect(JSON.stringify(body)).not.toContain("backend-jwt");

    const cookie = sessionCookieFrom(response)!;
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=lax/i);
    expect(cookie).not.toContain("backend-jwt");

    // The cookie is what proxy.ts and the /api/backend route later open.
    const sealed = cookie.split(";")[0].slice(SESSION_COOKIE.length + 1);
    expect(await openSession(sealed)).toEqual({ user: body.user, token: "backend-jwt" });
  });

  it("passes the backend's rejection through and sets no cookie", async () => {
    backendAnswers(401, { message: "Invalid credentials" });

    const response = await POST(loginRequest(credentials));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ message: "Invalid credentials" });
    expect(sessionCookieFrom(response)).toBeUndefined();
  });

  it("explains a backend outage instead of saying nothing useful", async () => {
    backendAnswers(500, { message: "Server Error" });

    const response = await POST(loginRequest(credentials));
    const { message } = await response.json();

    expect(response.status).toBe(502);
    expect(message).toMatch(/couldn't complete sign-in/i);
    expect(sessionCookieFrom(response)).toBeUndefined();
  });

  it("reports an unreachable backend the same way", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    const response = await POST(loginRequest(credentials));

    expect(response.status).toBe(502);
  });

  it("refuses a cross-site form post", async () => {
    const fetchMock = backendAnswers(200, backendUser);

    const response = await POST(loginRequest(credentials, { origin: "https://evil.example", host: "localhost:3000" }));

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a request with no password before it reaches the backend", async () => {
    const fetchMock = backendAnswers(200, backendUser);

    const response = await POST(loginRequest({ email: "buyer@example.com" }));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
