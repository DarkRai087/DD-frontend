import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.formula1.com",
      },
      {
        protocol: "https",
        hostname: "media.formula1.com",
      },
      {
        protocol: "https",
        hostname: "cdn-1.motorsport.com",
      },
      {
        protocol: "https",
        hostname: "cdn-9.motorsport.com",
      },
      {
        protocol: "https",
        hostname: "s.yimg.com",
      },
      {
        protocol: "https",
        hostname: "i.dailymail.co.uk",
      },
      {
        protocol: "https",
        hostname: "static.toiimg.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
