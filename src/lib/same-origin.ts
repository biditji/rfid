/**
 * CSRF guard for cookie-authenticated route handlers.
 *
 * The session cookie is SameSite=Lax, which already keeps it off cross-site
 * POSTs. This is the second layer: browsers attach `Origin` (and
 * `Sec-Fetch-Site`) to every POST/PUT/DELETE, so a request another site
 * forged is recognisable and refused. Server Actions get the same check from
 * Next.js automatically; route handlers don't.
 *
 * A request with neither header isn't from a browser, so it can't be riding a
 * victim's cookies — it's allowed through.
 */
export function isSameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
