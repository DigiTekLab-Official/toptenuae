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

  experimental: {
    optimizePackageImports: ["lucide-react", "@sanity/client", "@sanity/image-url", "next/image"],
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['toptenuae.com', 'www.toptenuae.com'],
    },
  },

  // ✅ NO REWRITES NEEDED ANYMORE
};

export default nextConfig;