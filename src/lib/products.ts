import { cache } from "react";
import { connection } from "next/server";
import { fetchProductsResult, fetchProductBySlug, fetchCategoriesResult } from "./api";
import { stripHtml, truncate } from "./utils";
import { buildCategoryTree, storefrontCategories, type CategorySummary } from "./categories";
import type { Category, Product } from "@/types";

/**
 * The storefront's read model. Everything here serves public pages only, so it
 * hides products and categories an admin has disabled; the admin panel reads
 * through `./api` directly and sees everything.
 *
 * Reads are memoized per request: `generateMetadata` and the page body both
 * need the same product, and the home page feeds several sections from one
 * product list — without this each of those is a separate round trip to a
 * backend that can take tens of seconds to answer against a cold worker.
 */
const getLiveProductsResult = cache((limit?: number) =>
  fetchProductsResult({ limit, activeOnly: true })
);

const getLiveCategoriesResult = cache(() => fetchCategoriesResult({ status: "true" }));

/** A live product by slug, or null when it doesn't exist or has been disabled. */
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const product = await fetchProductBySlug(slug);
  return product?.status === false ? null : product;
});

/**
 * Categories for the public listing. Like `getProductCards`, a failed fetch
 * drops the route out of prerendering rather than caching an empty page.
 */
export async function getCategories(): Promise<Category[]> {
  const { categories, ok } = await getLiveCategoriesResult();
  if (!ok) await connection();
  return categories;
}

/** Top-level categories with live products, for the home page's pills and cards. */
export async function getStorefrontCategories(): Promise<CategorySummary[]> {
  return storefrontCategories(buildCategoryTree(await getCategories()));
}

/**
 * The shape a product card actually renders.
 *
 * The full /products response is ~95 KB for 30 products, most of it rich-text
 * `description` and `specifications` that no card renders. Mapping to this
 * shape on the server keeps all of that out of the client payload.
 */
export type ProductCard = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  categoryName: string | null;
  image: string | null;
  excerpt: string;
  /** Pre-lowercased haystack for client-side search. */
  searchText: string;
  createdAt?: string;
};

export function toProductCard(product: Product): ProductCard {
  const excerpt = truncate(stripHtml(product.description ?? ""), 200);

  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock ?? 0,
    sku: product.sku,
    categoryName: product.category?.name ?? null,
    image: product.images?.[0] ?? null,
    excerpt,
    searchText: [product.name, product.sku, product.productTags, excerpt]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
    createdAt: product.createdAt,
  };
}

export type ProductCardsResult = {
  cards: ProductCard[];
  /**
   * False when the backend didn't answer. Callers must render an error state
   * rather than an empty grid — "the shop has no products" and "we couldn't
   * reach the shop" are different things to tell a visitor.
   */
  ok: boolean;
};

/**
 * Fetch the live catalog in the trimmed card shape.
 *
 * @param limit Rows to request. The home page renders 13 cards; asking for
 *   exactly that instead of the whole catalog cuts the response by ~60%.
 */
export async function getProductCards(limit?: number): Promise<ProductCardsResult> {
  const { products, ok } = await getLiveProductsResult(limit);

  if (!ok) {
    // The backend didn't answer. Opt this render out of prerendering so the
    // failure is never frozen into a static page — otherwise a build (or
    // revalidation) that happens to land on one of the backend's stalls would
    // serve an error to everyone until the next revalidation window elapsed.
    // Rendering per request means the very next visitor retries and, once the
    // backend responds, the cache refills.
    await connection();
  }

  return { cards: products.map(toProductCard), ok };
}

/**
 * Slug and last-modified time of every live product, for
 * `generateStaticParams` and the sitemap.
 *
 * Deliberately does *not* go through `getProductCards`: that calls
 * `connection()` when the backend is unreachable, and `generateStaticParams`
 * runs at build time with no incoming request, where `connection()` is an
 * error. A failed fetch here simply means nothing is prebuilt and the product
 * pages render on demand instead — which is the correct fallback.
 */
export async function getProductIndex(): Promise<{ slug: string; updatedAt?: string }[]> {
  const { products } = await getLiveProductsResult();
  return products
    .filter((product) => typeof product.slug === "string" && product.slug.length > 0)
    .map((product) => ({ slug: product.slug, updatedAt: product.updatedAt }));
}
