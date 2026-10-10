import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { buildCategoryTree, categoryOptions } from "@/lib/categories";
import { getCategories, getProductIndex } from "@/lib/products";

/**
 * When the site's own pages last changed: the layout and the about, contact
 * and policy copy, all of which live in this repo. Bump it when you edit them.
 * Catalog pages take the later of this and their newest product edit.
 */
const PAGES_UPDATED = "2026-10-10";

/** The newest of the timestamps, never older than PAGES_UPDATED, as YYYY-MM-DD. */
const newest = (dates: (string | undefined)[]) =>
  dates.reduce<string>((max, date) => (date && date > max ? date : max), PAGES_UPDATED).slice(0, 10);

/**
 * Built from the live catalog, so it lists exactly the pages that exist: every
 * live product, and every category with a live product in its subtree — the
 * same categories, in the same order, as the /products filter. It used to read
 * the old mock data file and advertised slugs that all 404'd. Refreshes on the
 * catalog's revalidation window.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProductIndex(), getCategories()]);
  const catalogUpdated = newest(products.map((p) => p.updatedAt));

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: catalogUpdated, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: catalogUpdated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: catalogUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: PAGES_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: PAGES_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: PAGES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: PAGES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const liveNames = products.flatMap((p) => (p.categoryName ? [p.categoryName] : []));
  const categoryPages = categoryOptions(buildCategoryTree(categories), liveNames).flatMap(
    ({ param, names }): MetadataRoute.Sitemap =>
      param
        ? [
            {
              url: `${SITE_URL}/products?category=${encodeURIComponent(param)}`,
              lastModified: newest(
                products.filter((p) => p.categoryName && names.includes(p.categoryName)).map((p) => p.updatedAt)
              ),
              changeFrequency: "weekly",
              priority: 0.8,
            },
          ]
        : []
  );

  const productPages: MetadataRoute.Sitemap = products.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/products/${slug}`,
    ...(updatedAt ? { lastModified: updatedAt.slice(0, 10) } : {}),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
