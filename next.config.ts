import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${process.env.NEXT_URL}/api/image/**`)],
    domains: [process.env.NEXT_DOMAIN],
  },
};

export default nextConfig;
