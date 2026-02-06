// next.config.ts
import type { NextConfig } from "next";
import { validateEnv } from "./src/lib/validateEnv";

validateEnv('build');

const nextConfig: NextConfig = {
  output: 'standalone',
  productionBrowserSourceMaps: false, 
  trailingSlash: false, 
  reactStrictMode: true, 
  compress: true,

  images: {
    loader: 'custom',
    loaderFile: './src/sanity/lib/image.ts',
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "toptenuae.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
    ],
  },

  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "@sanity/client", "@sanity/image-url", "next/image"],
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['toptenuae.com', 'www.toptenuae.com'],
    },
  },
};

export default nextConfig;