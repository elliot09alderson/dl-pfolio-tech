import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.ytimg.com" },
      { hostname: "*.fbcdn.net" },
      { hostname: "*.cdninstagram.com" },
    ],
  },
};

export default nextConfig;
