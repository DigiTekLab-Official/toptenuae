// next.config.ts
import type { NextConfig } from "next";
import { validateEnv } from "./src/lib/validateEnv";
import { withSentryConfig } from "@sentry/nextjs";

validateEnv('build');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

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

  experimental: {
    optimizePackageImports: ["lucide-react", "@sanity/client", "@sanity/image-url", "next/image"],
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

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
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
          { key: 'X-Robots-Tag', value: 'all' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // ---------------------------------------------------------
      // 1. SPECIFIC REDIRECTS (EXCEPTIONS) - MUST BE FIRST
      // ---------------------------------------------------------
      
      // ✅ NOTE: Domain redirects (http/www) are handled in Middleware. Do not add them here.

      // --- Your #1 Ranking Page (Protected) ---
      // The {/}? syntax matches both "/page" and "/page/"
      { source: '/parenting-kids/where-to-donate-used-toys-uae{/}?', destination: '/how-to-guides/where-to-donate-used-toys-uae', permanent: true },
      { source: '/where-to-donate-used-toys-uae{/}?', destination: '/how-to-guides/where-to-donate-used-toys-uae', permanent: true },

      // --- Lifestyle & Finance ---
      { source: '/lifestyle/charity-organizations-uae-donations{/}?', destination: '/how-to-guides/charity-organizations-uae-donations', permanent: true },
      { source: '/lifestyle/how-to-pay-zakat-in-uae-online{/}?', destination: '/how-to-guides/how-to-pay-zakat-in-uae-online', permanent: true },
      { source: '/how-to-pay-zakat-in-uae-online{/}?', destination: '/how-to-guides/how-to-pay-zakat-in-uae-online', permanent: true },
      { source: '/finance-tools/how-to-pay-zakat-in-uae-online{/}?', destination: '/how-to-guides/how-to-pay-zakat-in-uae-online', permanent: true },
      { source: '/zakat-calculator{/}?', destination: '/finance-tools/zakat-calculator', permanent: true },

      // --- Tech / AI / DeepSeek ---
      { source: '/tech/deepseek-ai-revolutionary-data-retrieval-method{/}?', destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },
      { source: '/deepseek-ai-revolutionary-data-retrieval-method{/}?', destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },
      { source: '/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation{/}?', destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },
      { source: '/tech/how-to-use-deepseek-ai-data-extraction-analysis{/}?', destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },
      { source: '/how-to-use-deepseek-ai-data-extraction-analysis{/}?', destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },
      // Consolidation to main hub
      { source: '/how-to-guides/deepseek-ai-revolutionary-data-retrieval-method', destination: '/how-to-guides', permanent: true },
      { source: '/deepseek-ai-startup-disrupting-big-tech-with-innovation{/}?', destination: '/how-to-guides', permanent: true },
      { source: '/deepseek-ai-startup-disrupting-big-tech-with-innovation/amp{/}?', destination: '/how-to-guides', permanent: true },
      { source: '/understanding-deep-seek-ai{/}?', destination: '/how-to-guides', permanent: true },

      // --- Other Tech ---
      { source: '/tech/state-of-ai-december-2025-uae-report', destination: '/how-to-guides/state-of-ai-december-2025-uae-report', permanent: true },
      { source: '/tech/quantum-computing-guide-uae', destination: '/how-to-guides/quantum-computing-guide-uae', permanent: true },
      { source: '/tech/quantum-computing-strategy-uae-2026', destination: '/how-to-guides/quantum-computing-strategy-uae-2026', permanent: true },
      { source: '/tech/gmail-gemini-ai-features-2026{/}?', destination: '/how-to-guides/gmail-gemini-ai-features-2026', permanent: true },
      { source: '/tech/samsung-galaxy-s26-ultra-specs-uae-price{/}?', destination: '/how-to-guides/samsung-galaxy-s26-ultra-specs-uae-price', permanent: true },

      // --- Review Consolidations (Fixing Cannibalization) ---
      { source: '/reviews/best-electric-shaver-uae{/}?', destination: '/top-ten/best-electric-shaver-uae', permanent: true },
      { source: '/best-electric-shaver-uae{/}?', destination: '/top-ten/best-electric-shaver-uae', permanent: true },
      { source: '/reviews/best-wireless-earbuds-uae{/}?', destination: '/top-ten/best-wireless-earbuds-uae', permanent: true },
      { source: '/best-wireless-earbuds-uae{/}?', destination: '/top-ten/best-wireless-earbuds-uae', permanent: true },
      { source: '/reviews/best-beard-trimmers-uae{/}?', destination: '/top-ten/best-beard-trimmers-uae', permanent: true },
      { source: '/best-beard-trimmers-uae{/}?', destination: '/top-ten/best-beard-trimmers-uae', permanent: true },
      { source: '/reviews/best-air-fryers-uae-2026', destination: '/top-ten/best-air-fryers-uae-2026', permanent: true },
      { source: '/reviews/new-year-tech-upgrades-uae-2026{/}?', destination: '/top-ten/new-year-tech-upgrades-uae-2026', permanent: true },
      { source: '/reviews/top-10-schools-dubai-2026-khda-fees-reviews', destination: '/top-ten/top-10-schools-dubai-2026-khda-fees-reviews', permanent: true },

      // --- Baby / Parenting Consolidations ---
      { source: '/best-baby-skincare-products-uae{/}?', destination: '/top-ten/best-baby-skincare-uae', permanent: true },
      { source: '/10-best-baby-skin-care-products-in-the-uae-for-2025{/}?', destination: '/top-ten/best-baby-skincare-uae', permanent: true },
      { source: '/best-baby-skincare-uae{/}?', destination: '/top-ten/best-baby-skincare-uae', permanent: true },
      { source: '/parenting-kids/best-baby-skincare-uae{/}?', destination: '/top-ten/best-baby-skincare-uae', permanent: true },
      { source: '/parenting-kids/best-baby-monitors-uae', destination: '/top-ten/best-baby-monitors-uae', permanent: true },
      { source: '/best-baby-monitors-uae{/}?', destination: '/top-ten/best-baby-monitors-uae', permanent: true },
      { source: '/parenting-kids/top-10-schools-dubai-2026-khda-fees-reviews', destination: '/top-ten/top-10-schools-dubai-2026-khda-fees-reviews', permanent: true },

      // --- Travel & Events ---
      { source: '/travel-tourism/world-safest-airlines-2026{/}?', destination: '/top-ten/world-safest-airlines-2026', permanent: true },
      { source: '/events-holidays/ramadan-2026-uae', destination: '/ramadan-2026', permanent: true }, 
      { source: '/best-places-visit-uae-eid-holidays{/}?', destination: '/events-holidays/eid-holidays-uae-2026-best-places-to-visit', permanent: true },
      { source: '/uae-eid-holidays-dates-events-travel-tips{/}?', destination: '/events-holidays', permanent: true },
      { source: '/eid-al-fitr-uae-prayer-timings-free-events', destination: '/events-holidays/eid-al-fitr-uae-prayer-timings-free-events', permanent: true },
      { source: '/uae-holidays-2025{/}?', destination: '/events-holidays/uae-holidays-2026', permanent: true },
      { source: '/free-eid-events-festive-activities-uae{/}?', destination: '/events-holidays', permanent: true },

      // --- Product Review Specifics ---
      { source: '/reviews/apple-airpods-pro-3-review', destination: '/reviews/apple-airpods-pro-3', permanent: true },
      { source: '/reviews/black-and-decker-digital-air-fryer-window-review', destination: '/reviews/black-and-decker-digital-air-fryer-window', permanent: true },
      { source: '/reviews/olov-for-man-grooming-kit-review', destination: '/reviews/olov-for-man-grooming-kit-trimmer', permanent: true },
      { source: '/reviews/ps5-slim-digital-ea-sports-fc-26-bundle', destination: '/reviews/ps5-slim-digital-ea-sports-fc-26-bundle-console', permanent: true },
      { source: '/reviews/ezviz-c6n-security-camera', destination: '/reviews/ezviz-c6n--baby-monitor', permanent: true },
      { source: '/reviews/reolink-e1-pro-2k-camera', destination: '/reviews/reolink-e1-pro-2k-camera-baby-monitor', permanent: true },
      { source: '/reviews/samsung-galaxy-s25-ultra-deal-jan-2026', destination: '/reviews/samsung-galaxy-s25-ultra-5g-uae-smartphone', permanent: true },
      { source: '/reviews/sony-ps5-slim-review', destination: '/reviews/ps5-slim-digital-ea-sports-fc-26-bundle-console', permanent: true },
      { source: '/top-ten/huawei-freebuds-se-3-earbuds', destination: '/reviews/huawei-freebuds-se-3-earbuds', permanent: true },
      
      // Deals
      { source: '/reviews/evvoli-air-fryer-4l-super-saver-deal', destination: '/deals', permanent: true },
      { source: '/reviews/lattafa-khamrah-perfume-deal', destination: '/deals', permanent: true },
      { source: '/reviews/coodoo-100pcs-magnetic-tiles-deal', destination: '/deals', permanent: true },
      { source: '/reviews/magic-bullet-blender-deal{/}?', destination: '/deals', permanent: true },
      { source: '/reviews/sihoo-m18-ergonomic-chair-deal{/}?', destination: '/deals', permanent: true },

      // --- Misc ---
      { source: '/charity-organizations-uae-donations{/}?', destination: '/how-to-guides/charity-organizations-uae-donations', permanent: true },
      { source: '/how-to-clean-washing-machine{/}?', destination: '/how-to-guides/how-to-clean-washing-machine', permanent: true },

      // ---------------------------------------------------------
      // 2. WILDCARD CATEGORY REDIRECTS (THE CATCH-ALLS) - MUST BE LAST
      // ---------------------------------------------------------
      // These run only if NONE of the above matched
      { source: '/tech', destination: '/how-to-guides', permanent: true }, 
      { source: '/tech/:slug*', destination: '/how-to-guides/:slug*', permanent: true }, 
      { source: '/parenting-kids/:slug*', destination: '/top-ten/:slug*', permanent: true }, 
      { source: '/lifestyle/:slug*', destination: '/how-to-guides/:slug*', permanent: true },
      { source: '/smart-home/:slug*', destination: '/how-to-guides/:slug*', permanent: true },
      
      // Category Bases
      { source: '/category/how-to-guides', destination: '/how-to-guides', permanent: true },
      { source: '/category/buyers-guide', destination: '/reviews', permanent: true },
      { source: '/category/education', destination: '/how-to-guides', permanent: true },
      { source: '/category/public-holidays-events{/}?', destination: '/events-holidays', permanent: true },
      { source: '/category/travel-tourism{/}?', destination: '/travel-tourism', permanent: true },
    
       // Static Pages
      { source: '/about{/}?', destination: '/about-us', permanent: true },
      { source: '/about-us/', destination: '/about-us', permanent: true }, // Cleanup
      { source: '/contact-us/', destination: '/contact-us', permanent: true }, // Cleanup
      { source: '/terms-and-conditions/amp{/}?', destination: '/terms-and-conditions', permanent: true },
      { source: '/affiliate-disclosure/amp{/}?', destination: '/affiliate-disclosure', permanent: true },
      { source: '/cookie-policy{/}?', destination: '/cookies-policy', permanent: true },
    ];
  },
};

// Sentry Configuration
const sentryOptions = {
  org: "digiteklab",
  project: "toptenuae",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  tunnelRoute: "/monitoring",
};

export default withSentryConfig(nextConfig, sentryOptions);