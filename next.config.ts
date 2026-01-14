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
    qualities: [75, 85],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "toptenuae.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // Note: Security Headers removed (handled in middleware.ts)

  // -----------------------------------------------------------------------------
  // REDIRECTS 
  // -----------------------------------------------------------------------------
  async redirects() {
    return [
      // Utilities
      { source: '/:path*/amp', destination: '/:path*', permanent: true },
      { source: '/:path*/feed', destination: '/:path*', permanent: true },

      // Category Migrations
      { source: "/category/deals", destination: "/deals", permanent: true },
      { source: "/category/finance-tools", destination: "/finance-tools", permanent: true },
      { source: "/category/reviews", destination: "/reviews", permanent: true },
      { source: "/category/smart-home", destination: "/smart-home", permanent: true },
      { source: "/category/tech", destination: "/tech", permanent: true },
      { source: "/category/parenting-kids", destination: "/parenting-kids", permanent: true },
      { source: "/category/events-holidays", destination: "/events-holidays", permanent: true },
      { source: "/category/lifestyle", destination: "/lifestyle", permanent: true },

      // Merged Categories
      { source: "/category/travel-tourism", destination: "/events-holidays", permanent: true },
      { source: "/category/health-fitness", destination: "/lifestyle", permanent: true },
      { source: "/category/baby-kid", destination: "/parenting-kids", permanent: true },
      { source: "/category/buyers-guide", destination: "/reviews", permanent: true },
      { source: "/category/uncategorized", destination: "/", permanent: true },

      // Article Redirects (Tech)
      { source: "/samsung-galaxy-s26-ultra-specs-uae-price", destination: "/tech/samsung-galaxy-s26-ultra-specs-uae-price", permanent: true },
      { source: "/quantum-computing-strategy-uae-2026", destination: "/tech/quantum-computing-strategy-uae-2026", permanent: true },
      { source: "/quantum-computing-guide-uae", destination: "/tech/quantum-computing-guide-uae", permanent: true },
      { source: "/deepseek-ai-startup-disrupting-big-tech-with-innovation", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/how-to-use-deepseek-ai-data-extraction-analysis", destination: "/tech/how-to-use-deepseek-ai-data-extraction-analysis", permanent: true },
      { source: "/deepseek-ai-revolutionary-data-retrieval-method", destination: "/tech/deepseek-ai-revolutionary-data-retrieval-method", permanent: true },
      { source: "/state-of-ai-december-2025-uae-report", destination: "/tech/state-of-ai-december-2025-uae-report", permanent: true },
      { source: "/understanding-deep-seek-ai", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/understanding-deep-seek", destination: "/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation", permanent: true },
      { source: "/nasa-astronaut-don-pettit-burj-khalifa-image-from-space", destination: "/tech", permanent: true },

      // Article Redirects (Reviews)
      { source: "/new-year-tech-upgrades-uae-2026", destination: "/reviews/new-year-tech-upgrades-uae-2026", permanent: true },
      { source: "/best-electric-shaver-uae", destination: "/reviews/best-electric-shaver-uae", permanent: true },
      { source: "/best-beard-trimmers-uae", destination: "/reviews/best-beard-trimmers-uae", permanent: true },
      { source: "/best-wireless-earbuds-uae", destination: "/reviews/best-wireless-earbuds-uae", permanent: true },
      { source: "/best-air-fryers-uae-2026", destination: "/reviews/best-air-fryers-uae-2026", permanent: true },
      { source: "/reviews/sihoo-m18-ergonomic-chair-deal", destination: "/reviews", permanent: true },

      // Article Redirects (Parenting)
      { source: "/best-baby-skincare-uae", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/10-best-baby-skin-care-products-in-the-uae-for-2025", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/best-baby-skincare-products-uae", destination: "/parenting-kids/best-baby-skincare-uae", permanent: true },
      { source: "/best-baby-monitors-uae", destination: "/parenting-kids/best-baby-monitors-uae", permanent: true },
      { source: "/where-to-donate-used-toys-uae", destination: "/parenting-kids/where-to-donate-used-toys-uae", permanent: true },

      // Article Redirects (Holidays)
      { source: "/uae-holidays-2026", destination: "/events-holidays/uae-holidays-2026", permanent: true },
      { source: "/uae-holidays-2025", destination: "/events-holidays/uae-holidays-2026", permanent: true },
      { source: "/eid-al-fitr-uae-prayer-timings-free-events", destination: "/events-holidays/eid-al-fitr-uae-prayer-timings-free-events", permanent: true },
      { source: "/eid-holidays-uae-2026-best-places-to-visit", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/best-places-visit-uae-eid-holidays", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/uae-eid-holidays-dates-events-travel-tips", destination: "/events-holidays/eid-holidays-uae-2026-best-places-to-visit", permanent: true },
      { source: "/events-holidays/ramadan-2026", destination: "/events-holidays/ramadan-2026-uae", permanent: true },
      { source: "/ramadan-2026", destination: "/events-holidays/ramadan-2026-uae", permanent: true },
      { source: "/ramadan-deals-uae", destination: "/events-holidays/ramadan-2026-uae", permanent: true },
      { source: "/ramadan-shopping-guide", destination: "/events-holidays/ramadan-2026-uae", permanent: true },

      // Article Redirects (Finance/Core)
      { source: "/gratuity-calculator-uae", destination: "/finance-tools/gratuity-calculator-uae", permanent: true },
      { source: "/uae-vat-calculator", destination: "/finance-tools/uae-vat-calculator", permanent: true },
      { source: "/zakat-calculator", destination: "/finance-tools/zakat-calculator", permanent: true },
      { source: "/how-to-pay-zakat-in-uae-online", destination: "/lifestyle/how-to-pay-zakat-in-uae-online", permanent: true },
      { source: "/charity-organizations-uae-donations", destination: "/lifestyle/charity-organizations-uae-donations", permanent: true },
      { source: "/how-to-clean-washing-machine", destination: "/smart-home/how-to-clean-washing-machine", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/terms-conditions", destination: "/terms-and-conditions", permanent: true },
      { source: "/best-budget-buys-uae-amazon-deals-march-2025", destination: "/deals", permanent: true },

      // Fallbacks
      { source: "/best-diaper-bags-uae", destination: "/parenting-kids", permanent: true },
      { source: "/best-diaper-bags-in-uae", destination: "/parenting-kids", permanent: true },
      { source: "/best-baby-white-noise-machines", destination: "/parenting-kids", permanent: true },
      { source: "/best-baby-toys", destination: "/parenting-kids", permanent: true },
      { source: "/best-educational-toys-uae", destination: "/parenting-kids", permanent: true },
      { source: "/best-educational-toys-in-uae", destination: "/parenting-kids", permanent: true },
    ];
  },
};

export default nextConfig;