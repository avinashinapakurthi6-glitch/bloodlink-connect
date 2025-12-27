import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: [
    '3000-b5419df7-e530-43ea-a738-bd215b20ab69.proxy.daytona.works',
    '*.proxy.daytona.works',
    '*.orchids.page',
    'localhost:3000'
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        '3000-b5419df7-e530-43ea-a738-bd215b20ab69.proxy.daytona.works',
        '*.proxy.daytona.works'
      ]
    }
  }
} as NextConfig;

export default nextConfig;
