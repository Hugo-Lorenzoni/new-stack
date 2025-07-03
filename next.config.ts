import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("http://localhost:3000/**")],
    domains: ["localhost"],
  },
  allowedDevOrigins: ["http://localhost:3000"],
};

export default nextConfig;
