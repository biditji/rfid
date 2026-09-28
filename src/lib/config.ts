/**
 * Every external URL the app depends on, resolved from the environment in one
 * place.
 *
 * These used to be re-derived in six files with two different fallbacks: the
 * product API defaulted to production while login, register and the session
 * check defaulted to http://localhost:5000. A deploy missing the env var then
 * served the catalog fine but silently broke sign-in.
 *
 * Kept free of Next.js and React imports so `next.config.ts` can import it too.
 */

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");

/** Express API base, including the `/api` prefix. */
export const API_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || "https://backend.indiarfidshop.com/api"
);

/**
 * Backend origin without `/api` — where uploaded images are served from.
 *
 * Must be HTTPS in production: the browser loads product images straight from
 * here, and an HTTPS page blocks any http:// subresource as mixed content.
 */
export const BACKEND_ORIGIN = trimTrailingSlash(
  process.env.NEXT_PUBLIC_SERVER_URL || API_URL.replace(/\/api$/, "")
);

/** Public URL of this storefront, for canonical URLs, the sitemap and robots.txt. */
export const SITE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "https://rfidhub.com"
);
