"use server";

import { revalidateTag } from "next/cache";
import { requireAdmin } from "./session";

/**
 * Public product pages are cached for 5 minutes so visitors never wait on the
 * backend's slow /products endpoint. These actions let the admin panel punch
 * through that window, so an edit is live on the storefront immediately rather
 * than whenever the cache next expires.
 *
 * Server Actions are public POST endpoints, so each one checks for an admin
 * session itself. Unguarded, anyone could flush the cache on a loop and push
 * every visitor back onto the slow, cold-starting backend.
 */
// `"max"` marks the tag stale with stale-while-revalidate semantics: the next
// visitor is served the cached page instantly and the refresh happens behind
// them. That matters here — the bare one-argument form is deprecated in Next 16
// and expires the entry outright, which would put the next visitor back on the
// blocking path through the slow backend.
export async function revalidateProducts() {
  await requireAdmin();
  revalidateTag("products", "max");
}

export async function revalidateCategories() {
  await requireAdmin();
  // Category names are denormalised onto products, so a category change can
  // change what product cards render too.
  revalidateTag("categories", "max");
  revalidateTag("products", "max");
}
