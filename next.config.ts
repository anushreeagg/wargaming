import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // No remote patterns needed — all portraits are now local files in /public/images/
    remotePatterns: [],
  },
};

export default nextConfig;
