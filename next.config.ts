import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'https://backend.indiarfidshop.com/:path*',
      },
    ];
  },
};

export default nextConfig;
