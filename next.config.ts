// next.config.ts
import type { NextConfig } from "next";
import { validateEnv } from "./src/lib/validateEnv";

// ✅ Validate environment variables at build time
validateEnv('build');

const nextConfig: NextConfig = {
  // ============================================================================
  // 0. OUTPUT MODE - REQUIRED FOR OPENNEXT/CLOUDFLARE
  // ============================================================================
  output: 'standalone',

  // ============================================================================
  // 1. PERFORMANCE & SEO BASICS
  // ============================================================================
  productionBrowserSourceMaps: false, 
  
  // ⚠️ CRITICAL SEO SETTING: 
  // GSC has indexed slashes, but your sitemap has none. 
  // We set this to false, and let Middleware/Redirects strip the slashes.
  trailingSlash: false, 
  
  reactStrictMode: true, 
  poweredByHeader: false, 

  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  compress: true,

  // ============================================================================
  // 2. IMAGES (Sanity CDN)
  // ============================================================================
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512, 640, 750],
    minimumCacheTTL: 31536000,
  },

  // ============================================================================
  // 3. EXPERIMENTAL
  // ============================================================================
  experimental: {
    optimizePackageImports: ["lucide-react", "@sanity/client", "@sanity/image-url", "next/image"],
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['toptenuae.com', 'www.toptenuae.com'],
    },
  },

  // ============================================================================
  // 4. TURBOPACK (Disabled for production builds due to Cloudflare compatibility)
  // ============================================================================
  // turbopack: {
  //   resolveAlias: {},
  // },

  // ============================================================================
  // 5. HEADERS (Security & Caching)
  // ============================================================================
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "_rsc" }],
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },

  // ============================================================================
  // 6. REDIRECTS ENGINE (THE SEO FIX)
  // ============================================================================
  async redirects() {
    return [
      // ------------------------------------------------------------------------
      // A. CATEGORY MIGRATIONS (Old WordPress/GSC Categories -> New Structure)
      // ------------------------------------------------------------------------
      { source: '/tech/:slug*', destination: '/how-to-guides/:slug*', permanent: true }, // General Tech moved to How-To
      { source: '/parenting-kids/:slug*', destination: '/top-ten/:slug*', permanent: true }, // Most parenting content is now Top Ten lists
      { source: '/lifestyle/:slug*', destination: '/how-to-guides/:slug*', permanent: true },
      { source: '/smart-home/:slug*', destination: '/how-to-guides/:slug*', permanent: true },
      { source: '/category/how-to-guides', destination: '/how-to-guides', permanent: true },
      { source: '/category/buyers-guide', destination: '/reviews', permanent: true },
      { source: '/category/education', destination: '/how-to-guides', permanent: true },
      
      // ------------------------------------------------------------------------
      // B. LIST CONTENT MOVES (Moved from /reviews/ to /top-ten/)
      // ------------------------------------------------------------------------
      { source: '/reviews/best-electric-shaver-uae', destination: '/top-ten/best-electric-shaver-uae', permanent: true },
      { source: '/reviews/best-wireless-earbuds-uae', destination: '/top-ten/best-wireless-earbuds-uae', permanent: true },
      { source: '/reviews/best-beard-trimmers-uae', destination: '/top-ten/best-beard-trimmers-uae', permanent: true },
      { source: '/reviews/best-air-fryers-uae-2026', destination: '/top-ten/best-air-fryers-uae-2026', permanent: true },
      { source: '/reviews/new-year-tech-upgrades-uae-2026', destination: '/top-ten/new-year-tech-upgrades-uae-2026', permanent: true },
      { source: '/reviews/top-10-schools-dubai-2026-khda-fees-reviews', destination: '/top-ten/top-10-schools-dubai-2026-khda-fees-reviews', permanent: true },
      
      // Also catch the /parenting-kids/ versions of these lists
      { source: '/parenting-kids/best-baby-skincare-uae', destination: '/top-ten/best-baby-skincare-uae', permanent: true },
      { source: '/parenting-kids/best-baby-monitors-uae', destination: '/top-ten/best-baby-monitors-uae', permanent: true },
      { source: '/parenting-kids/top-10-schools-dubai-2026-khda-fees-reviews', destination: '/top-ten/top-10-schools-dubai-2026-khda-fees-reviews', permanent: true },

      // ------------------------------------------------------------------------
      // C. SPECIFIC CONTENT CORRECTIONS (Based on GSC Errors)
      // ------------------------------------------------------------------------
      
      // DeepSeek Consolidation (All old URLS -> One Guide)
      { source: '/tech/deepseek-ai-revolutionary-data-retrieval-method', destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },
      { source: '/deepseek-ai-revolutionary-data-retrieval-method', destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },
      { source: '/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation', destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },
      { source: '/tech/how-to-use-deepseek-ai-data-extraction-analysis', destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },

      // Article Moves
      { source: '/tech/state-of-ai-december-2025-uae-report', destination: '/how-to-guides/state-of-ai-december-2025-uae-report', permanent: true },
      { source: '/tech/quantum-computing-guide-uae', destination: '/how-to-guides/quantum-computing-guide-uae', permanent: true },
      { source: '/tech/quantum-computing-strategy-uae-2026', destination: '/how-to-guides/quantum-computing-strategy-uae-2026', permanent: true },
      { source: '/tech/gmail-gemini-ai-features-2026', destination: '/how-to-guides/gmail-gemini-ai-features-2026', permanent: true },
      { source: '/tech/samsung-galaxy-s26-ultra-specs-uae-price', destination: '/how-to-guides/samsung-galaxy-s26-ultra-specs-uae-price', permanent: true },
      
      // Travel Safety
      { source: '/travel-tourism/world-safest-airlines-2026', destination: '/top-ten/world-safest-airlines-2026', permanent: true },

      // Lifestyle / Donation
      { source: '/parenting-kids/where-to-donate-used-toys-uae', destination: '/how-to-guides/where-to-donate-used-toys-uae', permanent: true },
      { source: '/lifestyle/charity-organizations-uae-donations', destination: '/how-to-guides/charity-organizations-uae-donations', permanent: true },
      { source: '/lifestyle/how-to-pay-zakat-in-uae-online', destination: '/how-to-guides/how-to-pay-zakat-in-uae-online', permanent: true },

      // Holidays
      { source: '/events-holidays/ramadan-2026-uae', destination: '/ramadan-2026', permanent: true }, // Moved to root
      { source: '/best-places-visit-uae-eid-holidays', destination: '/events-holidays/eid-holidays-uae-2026-best-places-to-visit', permanent: true },
      { source: '/eid-al-fitr-uae-prayer-timings-free-events', destination: '/events-holidays/eid-al-fitr-uae-prayer-timings-free-events', permanent: true },

      // ------------------------------------------------------------------------
      // D. REVIEW SLUG CLEANUP (Removing "-review" suffix)
      // ------------------------------------------------------------------------
      { source: '/reviews/apple-airpods-pro-3-review', destination: '/reviews/apple-airpods-pro-3', permanent: true },
      { source: '/reviews/black-and-decker-digital-air-fryer-window-review', destination: '/reviews/black-and-decker-digital-air-fryer-window', permanent: true },
      { source: '/reviews/olov-for-man-grooming-kit-review', destination: '/reviews/olov-for-man-grooming-kit-trimmer', permanent: true },
      { source: '/reviews/ps5-slim-digital-ea-sports-fc-26-bundle', destination: '/reviews/ps5-slim-digital-ea-sports-fc-26-bundle-console', permanent: true },
      
      // ------------------------------------------------------------------------
      // E. BABY MONITOR & CAMERA CLEANUP
      // ------------------------------------------------------------------------
      { source: '/reviews/ezviz-c6n-security-camera', destination: '/reviews/ezviz-c6n--baby-monitor', permanent: true },
      { source: '/reviews/reolink-e1-pro-2k-camera', destination: '/reviews/reolink-e1-pro-2k-camera-baby-monitor', permanent: true },
    ];
  },
};

export default nextConfig;