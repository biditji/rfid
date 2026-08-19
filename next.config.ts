import type { NextConfig } from "next";

// Origin of the Express backend, WITHOUT the trailing /api.
// This must be HTTPS in production: the browser loads product images straight
// from here, and a page served over HTTPS blocks any http:// subresource as
// mixed content (which is why product images/data silently vanished on the
// deployed site while working on localhost).
const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "https://backend.indiarfidshop.com"
).replace(/\/$/, "");

const backendUrl = new URL(BACKEND_ORIGIN);

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
};

export default nextConfig;
