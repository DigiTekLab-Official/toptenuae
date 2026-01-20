// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================================================
  // 1. PERFORMANCE & STRUCTURE
  // ============================================================================

  productionBrowserSourceMaps: false,
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // ============================================================================
  // 2. IMAGES – OPTIMIZED FOR CLOUDFLARE PAGES
  // ============================================================================

  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    qualities: [75, 80, 85],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "toptenuae.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },

  // ============================================================================
  // 3. PERFORMANCE: EXPERIMENTAL FEATURES
  // ============================================================================

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@sanity/client",
      "@sanity/image-url",
    ],
    optimizeCss: true,
  },

  // ============================================================================
  // 4. CRITICAL FIX: TURBOPACK CONFIG (Next.js 16+)
  // ============================================================================
  
  turbopack: {
    resolveAlias: {},
    rules: {},
  },

  // ============================================================================
  // 5. SECURITY & PERFORMANCE: HEADERS
  // ============================================================================

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-site",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
          {
            key: "Link",
            value: "<https://cdn.sanity.io>; rel=preconnect; crossorigin, <https://www.googletagmanager.com>; rel=preconnect",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "_rsc" }],
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate",
          },
          {
            key: "Vary",
            value: "RSC, Next-Router-State-Tree, Next-Router-Prefetch",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/css/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/chunks/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // ============================================================================
  // 6. REDIRECT ENGINE (COMPLETE FIX FOR GSC ISSUES)
  // ============================================================================

  async redirects() {
    return [
      // ========================================================================
      // A. CRITICAL FIX: DUPLICATE URL PATTERN BUG
      // ========================================================================
      // Catches the concatenated URL bug from GSC errors
      {
        source: '/best-electric-shaver-uae/https://toptenuae.com/best-electric-shaver-uae',
        destination: '/reviews/best-electric-shaver-uae',
        permanent: true,
      },
      {
        source: '/:path*/https://toptenuae.com/:slug*',
        destination: '/:path*/:slug*',
        permanent: true,
      },

      // ========================================================================
      // B. WEBMAIL & SECURITY PATHS (Return 410 Gone)
      // ========================================================================
      {
        source: '/webmail/:path*',
        destination: '/410',
        permanent: false,
      },
      {
        source: '/cpanel/:path*',
        destination: '/410',
        permanent: false,
      },
      {
        source: '/cgi-bin/:path*',
        destination: '/410',
        permanent: false,
      },
      {
        source: '/phpinfo.php',
        destination: '/410',
        permanent: false,
      },
      {
        source: '/:path*.php',
        destination: '/410',
        permanent: false,
      },

      // ========================================================================
      // C. AMP & FEED CLEANUP
      // ========================================================================
      { source: "/:path*/amp", destination: "/:path*", permanent: true },
      { source: "/:path*/feed", destination: "/:path*", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: true },

      // ========================================================================
      // D. CATEGORY MIGRATIONS (Fix: category/how-to-guides issue)
      // ========================================================================
      // Specific category redirects BEFORE the wildcard
      { source: "/category/how-to-guides/:slug*", destination: "/smart-home/:slug*", permanent: true },
      { source: "/category/how-to-guides{/}?", destination: "/smart-home", permanent: true },
      
      { source: "/category/deals{/}?", destination: "/deals", permanent: true },
      { source: "/category/finance-tools{/}?", destination: "/finance-tools", permanent: true },
      { source: "/category/reviews{/}?", destination: "/reviews", permanent: true },
      { source: "/category/smart-home{/}?", destination: "/smart-home", permanent: true },
      { source: "/category/tech{/}?", destination: "/tech", permanent: true },
      { source: "/category/parenting-kids{/}?", destination: "/parenting-kids", permanent: true },
      { source: "/category/events-holidays{/}?", destination: "/events-holidays", permanent: true },
      { source: "/category/lifestyle{/}?", destination: "/lifestyle", permanent: true },
      { source: "/category/travel-tourism{/}?", destination: "/events-holidays", permanent: true },
      { source: "/category/health-fitness{/}?", destination: "/lifestyle", permanent: true },
      { source: "/category/baby-kid{/}?", destination: "/parenting-kids", permanent: true },
      { source: "/category/buyers-guide{/}?", destination: "/reviews", permanent: true },
      { source: "/category/education{/}?", destination: "/parenting-kids", permanent: true },
      { source: "/category/public-holidays-events{/}?", destination: "/events-holidays", permanent: true },
      { source: "/category/uncategorized{/}?", destination: "/", permanent: true },
      
      // Wildcard for any remaining category paths
      { source: "/category/:slug*", destination: "/:slug*", permanent: true },

      // ========================================================================
      // E. AUTHOR PAGES (Block these from indexing)
      // ========================================================================
      { source: "/author/:path*", destination: "/", permanent: true },
      { source: "/index.php/author/:path*", destination: "/", permanent: true },

      // ========================================================================
      // F. SAMPLE/TEST PAGES
      // ========================================================================
      { source: "/sample-page", destination: "/", permanent: true },
      { source: "/index.php/sample-page", destination: "/", permanent: true },

      // ========================================================================
      // G. TECH ARTICLES
      // ========================================================================
      { source: "/samsung-galaxy-s26-ultra-specs-uae-price{/}?", destination: "/tech/samsung-galaxy-s26-ultra-specs-uae-price", permanent: true },
      { source: "/quantum-computing-strategy-uae-2026{/}?", destination: "/tech/quantum-computing-strategy-uae-2026", permanent: true },
      { source: "/quantum-computing-guide-uae{/}?", destination: "/tech/quantum-computing-guide-uae", permanent: true },
      { source: "/deepseek-ai-startup-disrupting-big-tech-with-innovation{/}?", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/how-to-use-deepseek-ai-data-extraction-analysis{/}?", destination: "/tech/how-to-use-deepseek-ai-data-extraction-analysis", permanent: true },
      { source: "/deepseek-ai-revolutionary-data-retrieval-method{/}?", destination: "/tech/deepseek-ai-revolutionary-data-retrieval-method", permanent: true },
      { source: "/state-of-ai-december-2025-uae-report{/}?", destination: "/tech/state-of-ai-december-2025-uae-report", permanent: true },
      { source: "/gmail-gemini-ai-features-2026{/}?", destination: "/tech/gmail-gemini-ai-features-2026", permanent: true },
      { source: "/understanding-deep-seek-ai{/}?", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/understanding-deep-seek{/}?", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/nasa-astronaut-don-pettit-burj-khalifa-image-from-space{/}?", destination: "/tech", permanent: true },

      // ========================================================================
      // H. REVIEWS (Fix GSC 404s)
      // ========================================================================
      { source: "/new-year-tech-upgrades-uae-2026{/}?", destination: "/reviews/new-year-tech-upgrades-uae-2026", permanent: true },
      { source: "/best-electric-shaver-uae{/}?", destination: "/reviews/best-electric-shaver-uae", permanent: true },
      { source: "/best-beard-trimmers-uae{/}?", destination: "/reviews/best-beard-trimmers-uae", permanent: true },
      { source: "/best-wireless-earbuds-uae{/}?", destination: "/reviews/best-wireless-earbuds-uae", permanent: true },
      { source: "/best-air-fryers-uae-2026{/}?", destination: "/reviews/best-air-fryers-uae-2026", permanent: true },
      
      // Fix: Wrong category paths from GSC
      { source: "/reviews/best-baby-skincare-uae{/}?", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/reviews/best-baby-monitors-uae{/}?", destination: "/parenting-kids/best-baby-monitors-uae", permanent: true },
      
      // Beauty products redirect
      { source: "/best-beauty-personal-care-products-uae{/}?", destination: "/lifestyle", permanent: true },

      // Dead deals → Category
      { source: "/reviews/lattafa-khamrah-perfume-deal", destination: "/deals", permanent: true },
      { source: "/reviews/evvoli-air-fryer-4l-super-saver-deal", destination: "/deals", permanent: true },
      { source: "/reviews/samsung-galaxy-s25-ultra-deal-jan-2026", destination: "/deals", permanent: true },
      { source: "/reviews/magic-bullet-blender-deal", destination: "/deals", permanent: true },
      { source: "/reviews/coodoo-100pcs-magnetic-tiles-deal", destination: "/deals", permanent: true },
      { source: "/reviews/sihoo-m18-ergonomic-chair-deal", destination: "/deals", permanent: true },

      // ========================================================================
      // I. PARENTING & KIDS
      // ========================================================================
      { source: "/best-baby-skincare-uae{/}?", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/best-baby-monitors-uae{/}?", destination: "/parenting-kids/best-baby-monitors-uae", permanent: true },
      { source: "/where-to-donate-used-toys-uae{/}?", destination: "/parenting-kids/where-to-donate-used-toys-uae", permanent: true },
      { source: "/10-best-baby-skin-care-products-in-the-uae-for-2025{/}?", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/best-baby-skincare-products-uae{/}?", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/best-diaper-bags-uae{/}?", destination: "/parenting-kids", permanent: true },
      { source: "/best-diaper-bags-in-uae{/}?", destination: "/parenting-kids", permanent: true },
      { source: "/best-baby-white-noise-machines{/}?", destination: "/parenting-kids", permanent: true },
      { source: "/best-baby-toys{/}?", destination: "/parenting-kids", permanent: true },
      { source: "/best-educational-toys-uae{/}?", destination: "/parenting-kids", permanent: true },
      { source: "/best-educational-toys-in-uae{/}?", destination: "/parenting-kids", permanent: true },
      { source: "/best-potty-training-seats-and-chairs{/}?", destination: "/parenting-kids", permanent: true },

      // ========================================================================
      // J. EVENTS & HOLIDAYS (Fix GSC 404s)
      // ========================================================================
      { source: "/uae-holidays-2026{/}?", destination: "/events-holidays/uae-holidays-2026", permanent: true },
      { source: "/uae-holidays-2025{/}?", destination: "/events-holidays/uae-holidays-2026", permanent: true },
      { source: "/eid-al-fitr-uae-prayer-timings-free-events{/}?", destination: "/events-holidays/eid-al-fitr-uae-prayer-timings-free-events", permanent: true },
      { source: "/free-eid-events-festive-activities-uae{/}?", destination: "/events-holidays/eid-al-fitr-uae-prayer-timings-free-events", permanent: true },
      { source: "/eid-holidays-uae-2026-best-places-to-visit{/}?", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/best-places-visit-uae-eid-holidays{/}?", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/uae-eid-holidays-dates-events-travel-tips{/}?", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/best-eid-holiday-travel-destinations-uae{/}?", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/ramadan-2026{/}?", destination: "/events-holidays/ramadan-2026-uae", permanent: true },
      { source: "/events-holidays/ramadan-2026{/}?", destination: "/events-holidays/ramadan-2026-uae", permanent: true },
      { source: "/ramadan-deals-uae{/}?", destination: "/events-holidays/ramadan-2026-uae", permanent: true },
      { source: "/ramadan-shopping-guide{/}?", destination: "/events-holidays/ramadan-2026-uae", permanent: true },

      // ========================================================================
      // K. FINANCE, LIFESTYLE & CORE
      // ========================================================================
      { source: "/gratuity-calculator-uae{/}?", destination: "/finance-tools/gratuity-calculator-uae", permanent: true },
      { source: "/uae-vat-calculator{/}?", destination: "/finance-tools/uae-vat-calculator", permanent: true },
      { source: "/zakat-calculator{/}?", destination: "/finance-tools/zakat-calculator", permanent: true },
      { source: "/how-to-pay-zakat-in-uae-online{/}?", destination: "/lifestyle/how-to-pay-zakat-in-uae-online", permanent: true },
      { source: "/charity-organizations-uae-donations{/}?", destination: "/lifestyle/charity-organizations-uae-donations", permanent: true },
      { source: "/how-to-clean-washing-machine{/}?", destination: "/smart-home/how-to-clean-washing-machine", permanent: true },
      { source: "/best-beauty-products-uae{/}?", destination: "/lifestyle", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/terms-conditions", destination: "/terms-and-conditions", permanent: true },
      { source: "/best-budget-buys-uae-amazon-deals-march-2025{/}?", destination: "/deals", permanent: true },
    ];
  },
};

export default nextConfig;