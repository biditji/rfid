import { cache } from "react";
import { connection } from "next/server";
import {
  fetchProducts,
  fetchProductsResult,
  fetchProductBySlug,
  fetchCategoriesResult,
} from "./api";
import { stripHtml, truncate } from "./utils";

/**
 * Per-request memoization. `generateMetadata` and the page body both need the
 * same product, and the home page feeds several sections from one product list —
 * without this each of those is a separate round trip to a backend whose
 * /products endpoint can take 20s+ to answer.
 */
export const getProducts = cache(fetchProducts);
const getProductsResult = cache(fetchProductsResult);
export const getProductBySlug = cache(fetchProductBySlug);
const getCategoriesResult = cache(fetchCategoriesResult);

/**
 * Categories for the public listing. Like `getProductCards`, a failed fetch
 * drops the route out of prerendering rather than caching an empty page.
 */
export async function getCategories(): Promise<any[]> {
  const { categories, ok } = await getCategoriesResult();
  if (!ok) await connection();
  return categories;
}

/**
 * The shape a product card actually renders.
 *
 * The raw /products response is ~94 KB for 30 products, ~40 KB of which is
 * rich-text HTML descriptions. Handing that straight to a client component
 * ships it twice (once in the RSC payload, once in the hydration data) for
 * fields the cards never read. Projecting first cuts it by ~65%.
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

export function toProductCard(product: any): ProductCard {
  const plain = stripHtml(product?.description ?? "");

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
    excerpt: truncate(plain, 200),
    searchText: [product.name, product.sku, product.productTags, plain.slice(0, 600)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
    createdAt: product.createdAt,
  };
}

/** Fetch the catalog once and return it in the trimmed card shape. */
export async function getProductCards(): Promise<ProductCard[]> {
  const { products, ok } = await getProductsResult();

  if (!ok) {
    // The backend didn't answer. Opt this render out of prerendering so the
    // failure is never frozen into a static page — otherwise a build (or
    // revalidation) that happens to land on one of the backend's 30s stalls
    // would serve "No products available" to everyone until the next
    // revalidation window elapsed. Rendering per request means the very next
    // visitor retries and, once the backend responds, the cache refills.
    await connection();
  }

  return products.map(toProductCard);
}
