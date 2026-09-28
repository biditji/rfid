import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getProductIndex } from "@/lib/products";

/**
 * Built from the live catalog, so it lists exactly the product pages that
 * exist. It used to read the old mock data file and advertised slugs that all
 * 404'd. Refreshes on the product data's revalidation window.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const productPages: MetadataRoute.Sitemap = (await getProductIndex()).map(
    ({ slug, updatedAt }) => ({
      url: `${SITE_URL}/products/${slug}`,
      ...(updatedAt ? { lastModified: new Date(updatedAt) } : {}),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [...staticPages, ...productPages];
}
