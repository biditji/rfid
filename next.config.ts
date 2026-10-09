import type { NextConfig } from "next";

// Origin of the Express backend, WITHOUT the trailing /api.
// This must be HTTPS in production: the browser loads product images straight
// from here, and a page served over HTTPS blocks any http:// subresource as
// mixed content (which is why product images/data silently vanished on the
// deployed site while working on localhost).
//
// Mirrors BACKEND_ORIGIN in src/lib/config.ts — keep the two in step. It's
// derived here rather than imported because Node's native TypeScript loader,
// which evaluates this file, resolves relative imports differently across
// Node versions.
const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "https://backend.indiarfidshop.com"
).replace(/\/$/, "");

const backendUrl = new URL(BACKEND_ORIGIN);

/**
 * Category slugs that were saved with a typo, mapped to the spelling they were
 * renamed to in the admin panel. Both URLs were public and indexed, so the old
 * one answers with a permanent redirect instead of a dead end.
 *
 * Rename the categories in the admin panel before deploying this. The new
 * laundry URL only resolves, and the new tags URL is only canonical, once the
 * stored name and slug match it.
 */
const RENAMED_CATEGORY_SLUGS: Record<string, string> = {
  "raid-tags": "rfid-tags",
  "rfid-laundary-tags": "rfid-laundry-tags",
};

const nextConfig: NextConfig = {
  images: {
    // Product photos on the backend are unoptimized ~500 KB PNGs. Routing them
    // through the Image Optimizer resizes + re-encodes them to WebP (typically
    // 20-40 KB at card size) and caches the result.
    remotePatterns: [
      {
        protocol: backendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrl.hostname,
        port: backendUrl.port,
        pathname: "/uploads/**",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24, // 1 day
  },

  experimental: {
    // Keep already-rendered route segments in the client cache for a short
    // while, so bouncing between /products and a product page is instant
    // instead of re-hitting a backend that can take 20s+ to answer.
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },

  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: `${BACKEND_ORIGIN}/:path*`,
      },
    ];
  },

  async redirects() {
    return Object.entries(RENAMED_CATEGORY_SLUGS).map(([from, to]) => ({
      source: "/products",
      has: [{ type: "query" as const, key: "category", value: from }],
      // The destination's own `category` wins over the one on the incoming URL;
      // any other filter in the query string (sort, search) is carried over.
      destination: `/products?category=${to}`,
      // `permanent: true` would send a 308. Both mean "moved for good" to
      // search engines; a 301 is what the SEO audit asks for.
      statusCode: 301,
    }));
  },
};

export default nextConfig;
