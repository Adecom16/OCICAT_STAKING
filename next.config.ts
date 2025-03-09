import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    domains: ["img.youtube.com"], 
  },
 
  eslint: {
    ignoreDuringBuilds: true, 
  },
};
export default nextConfig;
