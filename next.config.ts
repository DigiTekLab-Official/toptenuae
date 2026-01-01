// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,

  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '**' },
      { protocol: 'https', hostname: 'toptenuae.com', pathname: '**' },
    ],
  },

  // ✅ 1. SECURITY HEADERS (Your "Wordfence" Replacement)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN' // Prevents iframe clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Prevents mime-type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()' // Blocks access to sensitive hardware
          }
        ]
      }
    ];
  },

  // ✅ 2. TRAFFIC REDIRECTS (Old WP URLs -> New Cluster URLs)
  async redirects() {
    return [
      // ==============================================================================
      // 1. REVIEWS (Old Root -> /reviews/)
      // ==============================================================================
      { source: '/best-beard-trimmers-uae', destination: '/reviews/best-beard-trimmers-uae', permanent: true },
      { source: '/best-electric-shaver-uae', destination: '/reviews/best-electric-shaver-uae', permanent: true },
      { source: '/best-wireless-earbuds-uae', destination: '/reviews/best-wireless-earbuds-uae', permanent: true },
      { source: '/best-beauty-products-uae', destination: '/reviews/best-beauty-products-uae', permanent: true },
      { source: '/best-diaper-bags-uae', destination: '/reviews/best-diaper-bags-uae', permanent: true },
      { source: '/best-baby-monitors-uae', destination: '/reviews/best-baby-monitors-uae', permanent: true },
      { source: '/best-baby-skincare-uae', destination: '/reviews/best-baby-skincare-uae', permanent: true },
      { source: '/best-educational-toys-uae', destination: '/reviews/best-educational-toys-uae', permanent: true },

      // ==============================================================================
      // 2. FINANCE & TOOLS (Old Root -> /finance-tools/)
      // ==============================================================================
      { source: '/zakat-calculator', destination: '/finance-tools/zakat-calculator', permanent: true },
      { source: '/gratuity-calculator-uae', destination: '/finance-tools/gratuity-calculator-uae', permanent: true },
      // Added from previous context just in case
      { source: '/uae-vat-calculator', destination: '/finance-tools/uae-vat-calculator', permanent: true },
      { source: '/how-to-pay-zakat-in-uae-online', destination: '/finance-tools/how-to-pay-zakat-in-uae-online', permanent: true },


      // ==============================================================================
      // 3. EVENTS & HOLIDAYS (Old Root -> /events-holidays/)
      // ==============================================================================
      { source: '/eid-al-fitr-uae-prayer-timings-free-events', destination: '/events-holidays/eid-al-fitr-uae-prayer-timings-free-events', permanent: true },
      { source: '/uae-eid-holidays-dates-events-travel-tips', destination: '/events-holidays/uae-eid-holidays-dates-events-travel-tips', permanent: true },
      { source: '/free-eid-events-festive-activities-uae', destination: '/events-holidays/free-eid-events-festive-activities-uae', permanent: true },
      { source: '/best-eid-holiday-travel-destinations-uae', destination: '/events-holidays/best-eid-holiday-travel-destinations-uae', permanent: true },
      { source: '/best-places-visit-uae-eid-holidays', destination: '/events-holidays/best-places-visit-uae-eid-holidays', permanent: true },
      { source: '/uae-holidays-2025', destination: '/events-holidays/uae-holidays-2025', permanent: true }, 

      // ==============================================================================
      // 4. TECH & AI (Old Root -> /tech/)
      // ==============================================================================
      { source: '/how-to-use-deepseek-ai-data-extraction-analysis', destination: '/tech/how-to-use-deepseek-ai-data-extraction-analysis', permanent: true },
      { source: '/deepseek-ai-revolutionary-data-retrieval-method', destination: '/tech/deepseek-ai-revolutionary-data-retrieval-method', permanent: true },
      { source: '/deepseek-ai-startup-disrupting-big-tech-with-innovation', destination: '/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation', permanent: true },
      { source: '/nasa-astronaut-don-pettit-burj-khalifa-image-from-space', destination: '/tech', permanent: true },

      // ==============================================================================
      // 5. PARENTING & CHARITY (Old Root -> /parenting-kids/)
      // ==============================================================================
      { source: '/where-to-donate-used-toys-uae', destination: '/parenting-kids/where-to-donate-used-toys-uae', permanent: true },
      { source: '/charity-organizations-uae-donations', destination: '/parenting-kids/charity-organizations-uae-donations', permanent: true },

      // ==============================================================================
      // 6. SMART HOME / HOW-TO (Old Root -> /smart-home/)
      // ==============================================================================
      { source: '/how-to-clean-washing-machine', destination: '/smart-home/how-to-clean-washing-machine', permanent: true },

      // ==============================================================================
      // 7. DEALS (Old Root -> /deals/)
      // ==============================================================================
      { source: '/trending-now', destination: '/deals', permanent: true },
      { source: '/ramadan-deals-uae', destination: '/deals/ramadan-deals-uae', permanent: true },

      // ==============================================================================
      // 8. CATEGORY STRUCTURE CLEANUP (Old /category/ -> New Root)
      // ==============================================================================
      { source: '/category/how-to-guides', destination: '/smart-home', permanent: true },
      { source: '/category/buyers-guide', destination: '/reviews', permanent: true },
      { source: '/category/education', destination: '/parenting-kids', permanent: true },
      { source: '/category/travel-tourism', destination: '/events-holidays', permanent: true },
      { source: '/category/public-holidays-events', destination: '/events-holidays', permanent: true },
      
      // Standardize the rest
      { source: '/category/tech', destination: '/tech', permanent: true },
      { source: '/category/finance-tools', destination: '/finance-tools', permanent: true },
      { source: '/category/reviews', destination: '/reviews', permanent: true },
      { source: '/category/smart-home', destination: '/smart-home', permanent: true },
      { source: '/category/parenting-kids', destination: '/parenting-kids', permanent: true },

      // ==============================================================================
      // 9. LEGACY PAGES
      // ==============================================================================
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/terms-conditions', destination: '/terms-and-conditions', permanent: true },
    ];
  },
};

export default nextConfig;