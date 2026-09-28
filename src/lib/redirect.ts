/**
 * The in-app path to return to after signing in, taken from `?redirect=`.
 *
 * Only same-site paths are honoured: `//evil.com` and `/\evil.com` are
 * protocol-relative URLs to another host, and following one would make the
 * login page an open redirect usable in phishing links.
 */
export function safeRedirectPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}

/** `?redirect=` from the current URL, validated. Browser-only. */
export function redirectFromLocation(fallback = "/"): string {
  return safeRedirectPath(new URLSearchParams(window.location.search).get("redirect"), fallback);
}
