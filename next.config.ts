// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // -----------------------------------------------------------------------------
  // GENERAL CONFIG
  // -----------------------------------------------------------------------------
  trailingSlash: false,

  // -----------------------------------------------------------------------------
  // IMAGE OPTIMIZATION (Cloudflare Pages Fix)
  // -----------------------------------------------------------------------------
  images: {
    // ✅ CRITICAL FIX: Cloudflare Pages does not support Next.js Image Optimization API.
    // We set 'unoptimized: true' to force the browser to load images directly from Sanity's CDN.
    unoptimized: true,
    
    dangerouslyAllowSVG: true,

    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "toptenuae.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // -----------------------------------------------------------------------------
  // SECURITY HEADERS
  // -----------------------------------------------------------------------------
  async headers() {
    // 1. Define CSP: Whitelist Sanity, Google, and your image domains
    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://cdn.sanity.io https://placehold.co https://toptenuae.com https://lh3.googleusercontent.com https://*.google.com;
      font-src 'self' data:;
      connect-src 'self' https://*.api.sanity.io https://www.google-analytics.com;
      frame-ancestors 'self';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: "/:path*",
        headers: [
          // Standard Security Headers
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },

          // ✅ NEW: Fixes "Ensure proper origin isolation with COOP"
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },

          // ✅ NEW: Fixes "Ensure CSP is effective against XSS attacks"
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
        ],
      },
      // ✅ FIX: RSC Prefetch - Prevent caching 404s
      // When Next.js prefetches pages on hover, it requests /?_rsc=xxxxx payloads.
      {
        source: "/:path*",
        has: [
          {
            type: "query",
            key: "_rsc",
          },
        ],
        headers: [
          {
            key: "Cache-Control",
            value: "no-store", // Prevents Cloudflare from caching broken prefetch attempts
          },
        ],
      },
    ];
  },

  // -----------------------------------------------------------------------------
  // TRAFFIC REDIRECTS (Old WP URLs → New Cluster URLs)
  // -----------------------------------------------------------------------------
  async redirects() {
    return [
      // ✅ 0. ZOMBIE CLEANUP (Fixes "Not Found" & "Crawled-Not Indexed" for AMP)
      // This automatically fixes /best-electric-shaver-uae/amp/ errors
      {
        source: '/:path*/amp',
        destination: '/:path*',
        permanent: true,
      },

      // -----------------------------------------------------------
      // 1. CATEGORY FIXES (Old -> New)
      // -----------------------------------------------------------
      { source: "/category/deals", destination: "/deals", permanent: true },
      { source: "/category/finance-tools", destination: "/finance-tools", permanent: true },
      { source: "/category/reviews", destination: "/reviews", permanent: true },
      { source: "/category/smart-home", destination: "/smart-home", permanent: true },
      { source: "/category/tech", destination: "/tech", permanent: true },
      { source: "/category/parenting-kids", destination: "/parenting-kids", permanent: true },
      { source: "/category/events-holidays", destination: "/events-holidays", permanent: true },
      { source: "/category/lifestyle", destination: "/lifestyle", permanent: true },
      // New from GSC Logs:
      { source: "/category/travel-tourism", destination: "/events-holidays", permanent: true },
      { source: "/category/health-fitness", destination: "/lifestyle", permanent: true },
      { source: "/category/baby-kid", destination: "/parenting-kids", permanent: true },

      // -----------------------------------------------------------
      // 2. TECH ARTICLES
      // -----------------------------------------------------------
      { source: "/samsung-galaxy-s26-ultra-specs-uae-price", destination: "/tech/samsung-galaxy-s26-ultra-specs-uae-price", permanent: true },
      { source: "/quantum-computing-strategy-uae-2026", destination: "/tech/quantum-computing-strategy-uae-2026", permanent: true },
      { source: "/deepseek-ai-startup-disrupting-big-tech-with-innovation", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/how-to-use-deepseek-ai-data-extraction-analysis", destination: "/tech/how-to-use-deepseek-ai-data-extraction-analysis", permanent: true },
      { source: "/deepseek-ai-revolutionary-data-retrieval-method", destination: "/tech/deepseek-ai-revolutionary-data-retrieval-method", permanent: true },
      { source: "/state-of-ai-december-2025-uae-report", destination: "/tech/state-of-ai-december-2025-uae-report", permanent: true },
      { source: "/new-year-tech-upgrades-uae-2026", destination: "/tech/new-year-tech-upgrades-uae-2026", permanent: true },
      { source: "/quantum-computing-guide-uae", destination: "/tech/quantum-computing-guide-uae", permanent: true },
      // New from GSC Logs:
      { source: "/understanding-deep-seek-ai", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/understanding-deep-seek", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },

      // -----------------------------------------------------------
      // 3. REVIEWS
      // -----------------------------------------------------------
      { source: "/best-electric-shaver-uae", destination: "/reviews/best-electric-shaver-uae", permanent: true },
      { source: "/best-beard-trimmers-uae", destination: "/reviews/best-beard-trimmers-uae", permanent: true },
      { source: "/best-wireless-earbuds-uae", destination: "/reviews/best-wireless-earbuds-uae", permanent: true },
      { source: "/best-baby-skincare-uae", destination: "/reviews/best-baby-skincare-uae", permanent: true },
      { source: "/best-air-fryers-uae-2026", destination: "/reviews/best-air-fryers-uae-2026", permanent: true },

      // -----------------------------------------------------------
      // 4. FINANCE TOOLS
      // -----------------------------------------------------------
      { source: "/gratuity-calculator-uae", destination: "/finance-tools/gratuity-calculator-uae", permanent: true },
      { source: "/uae-vat-calculator", destination: "/finance-tools/uae-vat-calculator", permanent: true },
      { source: "/zakat-calculator", destination: "/finance-tools/zakat-calculator", permanent: true },
      { source: "/how-to-pay-zakat-in-uae-online", destination: "/lifestyle/how-to-pay-zakat-in-uae-online", permanent: true },

      // -----------------------------------------------------------
      // 5. EVENTS & HOLIDAYS
      // -----------------------------------------------------------
      { source: "/uae-holidays-2026", destination: "/events-holidays/uae-holidays-2026", permanent: true },
      { source: "/eid-al-fitr-uae-prayer-timings-free-events", destination: "/events-holidays/eid-al-fitr-uae-prayer-timings-free-events", permanent: true },
      { source: "/eid-holidays-uae-2026-best-places-to-visit", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      // New from GSC Logs:
      { source: "/uae-holidays-2025", destination: "/events-holidays/uae-holidays-2026", permanent: true },
      { source: "/uae-eid-holidays-dates-events-travel-tips", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/best-places-visit-uae-eid-holidays", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },

      // -----------------------------------------------------------
      // 6. PARENTING & KIDS
      // -----------------------------------------------------------
      { source: "/where-to-donate-used-toys-uae", destination: "/parenting-kids/where-to-donate-used-toys-uae", permanent: true },
      // New from GSC Logs (Consolidating "Best X" posts to the main category if the post doesn't exist yet)
      { source: "/best-baby-monitor", destination: "/parenting-kids", permanent: true },
      { source: "/best-baby-monitors-uae", destination: "/parenting-kids", permanent: true },
      { source: "/best-baby-toys", destination: "/parenting-kids", permanent: true },
      { source: "/best-educational-toys-in-uae", destination: "/parenting-kids", permanent: true },
      { source: "/best-diaper-bags-in-uae", destination: "/parenting-kids", permanent: true },
      { source: "/10-best-baby-skin-care-products-in-the-uae-for-2025", destination: "/reviews/best-baby-skincare-uae", permanent: true },
      { source: "/best-baby-skincare-products-uae", destination: "/reviews/best-baby-skincare-uae", permanent: true },
      { source: "/best-baby-skincare-products-2025-uae", destination: "/reviews/best-baby-skincare-uae", permanent: true },
      { source: "/best-baby-white-noise-machines", destination: "/parenting-kids", permanent: true },
      // -----------------------------------------------------------
      // 7. SMART HOME
      // -----------------------------------------------------------
      { source: "/how-to-clean-washing-machine", destination: "/smart-home/how-to-clean-washing-machine", permanent: true },

      // -----------------------------------------------------------
      // 8. LEGAL & MISC
      // -----------------------------------------------------------
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/terms-conditions", destination: "/terms-and-conditions", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },

      // -----------------------------------------------------------
      // 9. DEALS & EXPIRED CONTENT (New from GSC Logs)
      // -----------------------------------------------------------
      { source: "/ramadan-deals-uae", destination: "/deals", permanent: true },
      { source: "/ramadan-shopping-guide", destination: "/deals", permanent: true },
      { source: "/best-budget-buys-uae-amazon-deals-march-2025", destination: "/deals", permanent: true },
      { source: "/charity-organizations-uae-donations", destination: "/lifestyle/charity-organizations-uae-donations", permanent: true },
    ];
  },
};
export default nextConfig;