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
  process.env.NEXT_PUBLIC_SITE_URL || "https://indiarfidshop.com"
);

/**
 * Razorpay's public key id, the fallback for checkout when the backend doesn't
 * send one with the order. The key id is meant to be public; the secret lives
 * only in the backend's environment.
 */
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || "";

/**
 * Tawk.to live-chat embed URL, or null when chat isn't configured.
 *
 * Both ids are in the widget's "Direct Chat Link" in the Tawk dashboard:
 * https://tawk.to/chat/<property id>/<widget id>. The widget id is "default"
 * for a property's first widget. The ids are interpolated into an inline
 * script, so anything but plain id characters disables chat rather than risk
 * a typo (or a bad env value) becoming script.
 */
export const TAWK_EMBED_URL = (() => {
  const property = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim();
  const widget = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim() || "default";
  const plainId = /^[A-Za-z0-9_-]+$/;
  return property && plainId.test(property) && plainId.test(widget)
    ? `https://embed.tawk.to/${property}/${widget}`
    : null;
})();
