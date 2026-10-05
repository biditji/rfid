import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Private / non-SEO areas
          "/admin",
          "/api/",
          "/cart",
          "/checkout",
          "/account",
          "/login",
          // Duplicate-content URL variations (search, sort, quote-form prefills)
          "/*?*search=",
          "/*?*sort=",
          "/contact?",
        ],
      },
    ],
    // /_next/ stays crawlable: Google needs the JS, CSS and images to render pages.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
