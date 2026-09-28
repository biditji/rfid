import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/config";
import { forbiddenResponse } from "@/lib/auth-server";
import { isSameOrigin } from "@/lib/same-origin";
import { SESSION_COOKIE, openSession } from "@/lib/session-token";

type Context = { params: Promise<{ path: string[] }> };

/**
 * The browser's only way to make authenticated backend calls.
 *
 * The backend token lives in the httpOnly session cookie, where page scripts
 * (and so any injected script) can't read it. This handler unseals the cookie
 * server-side, attaches the token as a bearer header and forwards the request
 * to the Express API unchanged. The backend remains the authority on what the
 * token may do.
 */
async function forward(request: NextRequest, { params }: Context): Promise<Response> {
  if (!isSameOrigin(request)) return forbiddenResponse();

  const { path } = await params;
  // `..` would normalise out of /api on the backend host once in a URL.
  if (path.some((segment) => segment === "." || segment === "..")) {
    return Response.json({ message: "Invalid path" }, { status: 400 });
  }

  const session = await openSession(request.cookies.get(SESSION_COOKIE)?.value);

  const headers = new Headers({ Accept: request.headers.get("accept") ?? "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  if (session) headers.set("Authorization", `Bearer ${session.token}`);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const target = `${API_URL}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      // Buffered rather than streamed: uploads are capped at 10 images by the
      // backend, and a buffered body works on every Node fetch without `duplex`.
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: "manual",
    });
  } catch (error) {
    console.error(`[backend proxy] ${request.method} /${path.join("/")} failed:`, error);
    return Response.json(
      { message: "The store backend is unreachable right now. Please try again." },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export { forward as GET, forward as POST, forward as PUT, forward as DELETE };
