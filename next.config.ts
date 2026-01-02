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
    // This fixes the "404 Failed to load resource" errors in your console.
    unoptimized: true,
    
    dangerouslyAllowSVG: true,

    remotePatterns: [
      { 
        protocol: "https", 
        hostname: "cdn.sanity.io" 
      },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "toptenuae.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // -----------------------------------------------------------------------------
  // SECURITY HEADERS
  // -----------------------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // ✅ FIX: RSC Prefetch Caching for Cloudflare Pages
      // When Next.js prefetches pages on hover, it requests /?_rsc=xxxxx payloads.
      // These need proper Cache-Control headers to work with Cloudflare's edge network.
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
            value: "public, max-age=31536000, immutable",
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
      // -----------------------------------------------------------
      // 1. CATEGORY & STRUCTURE FIXES (Old -> New)
      // -----------------------------------------------------------
      { source: "/category/deals", destination: "/deals", permanent: true },
      { source: "/category/finance-tools", destination: "/finance-tools", permanent: true },
      { source: "/category/reviews", destination: "/reviews", permanent: true },
      { source: "/category/smart-home", destination: "/smart-home", permanent: true },
      { source: "/category/tech", destination: "/tech", permanent: true },
      { source: "/category/parenting-kids", destination: "/parenting-kids", permanent: true },
      { source: "/category/events-holidays", destination: "/events-holidays", permanent: true },
      { source: "/category/lifestyle", destination: "/lifestyle", permanent: true },

      // -----------------------------------------------------------
      // 2. TECH ARTICLES (Map old flat URLs to /tech/)
      // -----------------------------------------------------------
      { source: "/samsung-galaxy-s26-ultra-specs-uae-price", destination: "/tech/samsung-galaxy-s26-ultra-specs-uae-price", permanent: true },
      { source: "/quantum-computing-strategy-uae-2026", destination: "/tech/quantum-computing-strategy-uae-2026", permanent: true },
      { source: "/deepseek-ai-startup-disrupting-big-tech-with-innovation", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/how-to-use-deepseek-ai-data-extraction-analysis", destination: "/tech/how-to-use-deepseek-ai-data-extraction-analysis", permanent: true },
      { source: "/deepseek-ai-revolutionary-data-retrieval-method", destination: "/tech/deepseek-ai-revolutionary-data-retrieval-method", permanent: true },
      { source: "/state-of-ai-december-2025-uae-report", destination: "/tech/state-of-ai-december-2025-uae-report", permanent: true },
      { source: "/new-year-tech-upgrades-uae-2026", destination: "/tech/new-year-tech-upgrades-uae-2026", permanent: true },
      { source: "/quantum-computing-guide-uae", destination: "/tech/quantum-computing-guide-uae", permanent: true },

      // -----------------------------------------------------------
      // 3. REVIEWS (Map old flat URLs to /reviews/)
      // -----------------------------------------------------------
      { source: "/best-electric-shaver-uae", destination: "/reviews/best-electric-shaver-uae", permanent: true },
      { source: "/best-beard-trimmers-uae", destination: "/reviews/best-beard-trimmers-uae", permanent: true },
      { source: "/best-wireless-earbuds-uae", destination: "/reviews/best-wireless-earbuds-uae", permanent: true },
      { source: "/best-baby-skincare-uae", destination: "/reviews/best-baby-skincare-uae", permanent: true },
      { source: "/best-air-fryers-uae-2026", destination: "/reviews/best-air-fryers-uae-2026", permanent: true },

      // -----------------------------------------------------------
      // 4. FINANCE TOOLS (Map old flat URLs to /finance-tools/)
      // -----------------------------------------------------------
      { source: "/gratuity-calculator-uae", destination: "/finance-tools/gratuity-calculator-uae", permanent: true },
      { source: "/uae-vat-calculator", destination: "/finance-tools/uae-vat-calculator", permanent: true },
      { source: "/zakat-calculator", destination: "/finance-tools/zakat-calculator", permanent: true },
      { source: "/how-to-pay-zakat-in-uae-online", destination: "/finance-tools/how-to-pay-zakat-in-uae-online", permanent: true },

      // -----------------------------------------------------------
      // 5. EVENTS & HOLIDAYS (Map old flat URLs to /events-holidays/)
      // -----------------------------------------------------------
      { source: "/uae-holidays-2026", destination: "/events-holidays/uae-holidays-2026", permanent: true },
      { source: "/eid-al-fitr-uae-prayer-timings-free-events", destination: "/events-holidays/eid-al-fitr-uae-prayer-timings-free-events", permanent: true },
      { source: "/eid-holidays-uae-2026-best-places-to-visit", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },

      // -----------------------------------------------------------
      // 6. PARENTING & KIDS (Map old flat URLs to /parenting-kids/)
      // -----------------------------------------------------------
      { source: "/where-to-donate-used-toys-uae", destination: "/parenting-kids/where-to-donate-used-toys-uae", permanent: true },
      { source: "/charity-organizations-uae-donations", destination: "/parenting-kids/charity-organizations-uae-donations", permanent: true },

      // -----------------------------------------------------------
      // 7. SMART HOME (Map old flat URLs to /smart-home/)
      // -----------------------------------------------------------
      { source: "/how-to-clean-washing-machine", destination: "/smart-home/how-to-clean-washing-machine", permanent: true },

      // -----------------------------------------------------------
      // 8. LEGAL & MISC
      // -----------------------------------------------------------
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/terms-conditions", destination: "/terms-and-conditions", permanent: true },
    ];
  },
};

export default nextConfig;