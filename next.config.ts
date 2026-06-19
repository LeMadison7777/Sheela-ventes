import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http", // ou "https" selon votre configuration
        hostname: "le-madison-777.vercel.app",
      },
    ],
  },
};

export default nextConfig;