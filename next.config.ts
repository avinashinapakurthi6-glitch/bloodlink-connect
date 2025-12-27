import type { NextConfig } from "next";
import path from "node:path";

// Loader path from orchids-visual-edits - use direct resolve to get the actual file
const loaderPath = require.resolve('orchids-visual-edits/loader.js');

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
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [loaderPath]
      }
    }
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
// Orchids restart: 1766847988034
