// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // -----------------------------------------------------------------------------
  // GENERAL CONFIG
  // -----------------------------------------------------------------------------
  trailingSlash: false, 

  // -----------------------------------------------------------------------------
  // IMAGE OPTIMIZATION
  // -----------------------------------------------------------------------------
  images: {
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
  // SECURITY HEADERS (CSP)
  // -----------------------------------------------------------------------------
  async headers() {
    // ✅ CSP FIXED: Whitelists Clarity, GTM, Sanity, and Cloudflare
    const ContentSecurityPolicy = `
      default-src 'self';
      
      script-src 'self' 'unsafe-eval' 'unsafe-inline' 
        https://www.googletagmanager.com 
        https://challenges.cloudflare.com 
        https://static.cloudflareinsights.com 
        https://www.clarity.ms 
        https://c.bing.com
        https://c.clarity.ms;
      
      style-src 'self' 'unsafe-inline';
      
      img-src 'self' blob: data: 
        https://cdn.sanity.io 
        https://placehold.co 
        https://toptenuae.com 
        https://lh3.googleusercontent.com 
        https://*.google.com 
        https://www.clarity.ms 
        https://c.bing.com
        https://c.clarity.ms
        https://www.google-analytics.com;
      
      font-src 'self' data:;
      
      connect-src 'self' 
        https://*.api.sanity.io 
        https://www.google-analytics.com 
        https://www.clarity.ms 
        https://c.bing.com 
        https://c.clarity.ms
        https://challenges.cloudflare.com 
        https://cloudflareinsights.com
        https://www.googletagmanager.com; 
      
      frame-src 'self' 
        https://challenges.cloudflare.com;
        
      frame-ancestors 'self';
    `.replace(/\s{2,}/g, ' ').trim();

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
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
        ],
      },
      // ✅ FIX: RSC Prefetch - Prevent caching 404s
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
            value: "no-store, must-revalidate", 
          },
        ],
      },
    ];
  },

  // -----------------------------------------------------------------------------
  // TRAFFIC REDIRECTS (Optimized for 2026 GSC Report)
  // -----------------------------------------------------------------------------
  async redirects() {
    return [
      // --- 1. CLEANUP & UTILITIES ---
      { source: '/:path*/amp', destination: '/:path*', permanent: true },
      { source: '/:path*/feed', destination: '/:path*', permanent: true }, // Blocks RSS feed indexing
      
      // --- 2. FIX: Redirect Errors (Loops detected in GSC) ---
      // These ensure traffic goes to the final destination, avoiding loops.
      { source: "/zakat-calculator", destination: "/finance-tools/zakat-calculator", permanent: true },
      { source: "/reviews/sihoo-m18-ergonomic-chair-deal", destination: "/reviews", permanent: true }, 

      // --- 3. FIX: 404 Recovery (Recovering Lost Traffic) ---
      { source: "/best-diaper-bags-uae", destination: "/parenting-kids", permanent: true },
      { source: "/best-diaper-bags-in-uae", destination: "/parenting-kids", permanent: true },
      { source: "/best-baby-white-noise-machines", destination: "/parenting-kids", permanent: true },
      { source: "/nasa-astronaut-don-pettit-burj-khalifa-image-from-space", destination: "/tech", permanent: true },
      
      // --- 4. CATEGORY MIGRATIONS ---
      { source: "/category/deals", destination: "/deals", permanent: true },
      { source: "/category/finance-tools", destination: "/finance-tools", permanent: true },
      { source: "/category/reviews", destination: "/reviews", permanent: true },
      { source: "/category/smart-home", destination: "/smart-home", permanent: true },
      { source: "/category/tech", destination: "/tech", permanent: true },
      { source: "/category/parenting-kids", destination: "/parenting-kids", permanent: true },
      { source: "/category/events-holidays", destination: "/events-holidays", permanent: true },
      { source: "/category/lifestyle", destination: "/lifestyle", permanent: true },
      { source: "/category/travel-tourism", destination: "/events-holidays", permanent: true },
      { source: "/category/health-fitness", destination: "/lifestyle", permanent: true },
      { source: "/category/baby-kid", destination: "/parenting-kids", permanent: true },
      { source: "/category/buyers-guide", destination: "/reviews", permanent: true },
      { source: "/category/uncategorized", destination: "/", permanent: true },

      // --- 5. PAGE LEVEL REDIRECTS (Specific URL Fixes) ---
      
      // TECH SECTION
      { source: "/samsung-galaxy-s26-ultra-specs-uae-price", destination: "/tech/samsung-galaxy-s26-ultra-specs-uae-price", permanent: true },
      { source: "/quantum-computing-strategy-uae-2026", destination: "/tech/quantum-computing-strategy-uae-2026", permanent: true },
      { source: "/quantum-computing-guide-uae", destination: "/tech/quantum-computing-guide-uae", permanent: true },
      { source: "/deepseek-ai-startup-disrupting-big-tech-with-innovation", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/how-to-use-deepseek-ai-data-extraction-analysis", destination: "/tech/how-to-use-deepseek-ai-data-extraction-analysis", permanent: true },
      { source: "/deepseek-ai-revolutionary-data-retrieval-method", destination: "/tech/deepseek-ai-revolutionary-data-retrieval-method", permanent: true },
      { source: "/state-of-ai-december-2025-uae-report", destination: "/tech/state-of-ai-december-2025-uae-report", permanent: true },
      { source: "/understanding-deep-seek-ai", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/understanding-deep-seek", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },

      // REVIEWS SECTION
      // ✅ FIX: "New Year Tech" was wrongly going to /tech/ in your old code. Fixed to /reviews/.
      { source: "/new-year-tech-upgrades-uae-2026", destination: "/reviews/new-year-tech-upgrades-uae-2026", permanent: true },
      { source: "/best-electric-shaver-uae", destination: "/reviews/best-electric-shaver-uae", permanent: true },
      { source: "/best-beard-trimmers-uae", destination: "/reviews/best-beard-trimmers-uae", permanent: true },
      { source: "/best-wireless-earbuds-uae", destination: "/reviews/best-wireless-earbuds-uae", permanent: true },
      { source: "/best-air-fryers-uae-2026", destination: "/reviews/best-air-fryers-uae-2026", permanent: true },

      // PARENTING SECTION
      // ✅ FIX: "Baby Skincare" was wrongly going to /reviews/ in your old code. Fixed to /parenting-kids/.
      { source: "/best-baby-skincare-uae", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/10-best-baby-skin-care-products-in-the-uae-for-2025", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/best-baby-skincare-products-uae", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/best-baby-skincare-products-2025-uae", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      
      { source: "/where-to-donate-used-toys-uae", destination: "/parenting-kids/where-to-donate-used-toys-uae", permanent: true },
      
      // ✅ FIX: Added missing "best-educational-toys-uae" (found in GSC)
      { source: "/best-educational-toys-uae", destination: "/parenting-kids", permanent: true }, 
      { source: "/best-educational-toys-in-uae", destination: "/parenting-kids", permanent: true },
      
      // Catch-all parenting fallbacks
      { source: "/best-baby-monitor", destination: "/parenting-kids", permanent: true },
      { source: "/best-baby-monitors-uae", destination: "/parenting-kids", permanent: true },
      { source: "/best-baby-toys", destination: "/parenting-kids", permanent: true },
      { source: "/best-diaper-bags-in-uae", destination: "/parenting-kids", permanent: true },

      // EVENTS & HOLIDAYS
      { source: "/uae-holidays-2026", destination: "/events-holidays/uae-holidays-2026", permanent: true },
      { source: "/eid-al-fitr-uae-prayer-timings-free-events", destination: "/events-holidays/eid-al-fitr-uae-prayer-timings-free-events", permanent: true },
      { source: "/eid-holidays-uae-2026-best-places-to-visit", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/best-places-visit-uae-eid-holidays", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/uae-holidays-2025", destination: "/events-holidays/uae-holidays-2026", permanent: true },
      { source: "/uae-eid-holidays-dates-events-travel-tips", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      
      // ✅ FIX: "Ramadan" redirects now point to the Article (for content queries) or Hub (if preferred)
      // Consolidated to the detailed article for better user experience on "deals/guide" queries
      { source: "/events-holidays/ramadan-2026", destination: "/events-holidays/ramadan-2026-uae", permanent: true },
      { source: "/ramadan-deals-uae", destination: "/events-holidays/ramadan-2026-uae", permanent: true },
      { source: "/ramadan-shopping-guide", destination: "/events-holidays/ramadan-2026-uae", permanent: true },

      // FINANCE & LIFESTYLE
      { source: "/gratuity-calculator-uae", destination: "/finance-tools/gratuity-calculator-uae", permanent: true },
      { source: "/uae-vat-calculator", destination: "/finance-tools/uae-vat-calculator", permanent: true },
      { source: "/how-to-pay-zakat-in-uae-online", destination: "/lifestyle/how-to-pay-zakat-in-uae-online", permanent: true },
      { source: "/charity-organizations-uae-donations", destination: "/lifestyle/charity-organizations-uae-donations", permanent: true },

      // SMART HOME
      { source: "/how-to-clean-washing-machine", destination: "/smart-home/how-to-clean-washing-machine", permanent: true },

      // CORE PAGES
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/terms-conditions", destination: "/terms-and-conditions", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/best-budget-buys-uae-amazon-deals-march-2025", destination: "/deals", permanent: true },
    ];
  },
};

export default nextConfig;