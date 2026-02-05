// next.config.ts
import type { NextConfig } from "next";
import { validateEnv } from "./src/lib/validateEnv";

// ✅ Validate environment variables at build time
validateEnv('build');

const nextConfig: NextConfig = {
  // ============================================================================
  // 0. OUTPUT MODE - REQUIRED FOR OPENNEXT
  // ============================================================================
  output: 'standalone',

  // ============================================================================
  // 1. PERFORMANCE & STRUCTURE
  // ============================================================================

  productionBrowserSourceMaps: false, 
  // ⚠️ CRITICAL SEO FIX: GSC has indexed URLs WITHOUT slashes. 
  // We must match that. Do not change to true.
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
  // 1.5. COMPRESSION & BUILD OPTIMIZATION
  // ============================================================================
  
  compress: true,  // ✅ Enable Gzip/Brotli compression

  // ============================================================================
  // 2. IMAGES – OPTIMIZED FOR PERFORMANCE (Cloudflare-compatible)
  // ============================================================================

  images: {
    // ✅ FIX: Set to TRUE for Cloudflare Workers.
    // This forces the browser to load images directly from Sanity's CDN
    // instead of trying to process them through the Cloudflare Worker.
    // Without this, /_next/image requests timeout/fail on Edge workers.
    unoptimized: true,
    
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    
    // Remote patterns for external images
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "toptenuae.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
    ],
    
    // ✅ Expanded device sizes for better responsive coverage
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512, 640, 750],
    
    // Cache 1 year for versioned assets
    minimumCacheTTL: 31536000,
  },

  // ============================================================================
  // 3. EXPERIMENTAL FEATURES (2026)
  // ============================================================================

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@sanity/client",
      "@sanity/image-url",
      "next/image"
    ],
    optimizeCss: true,  // ✅ CHANGED: Enable critical CSS extraction
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['toptenuae.com', 'www.toptenuae.com'],
    },
  },

  // ============================================================================
  // 4. TURBOPACK
  // ============================================================================
  
  turbopack: {
    resolveAlias: {},
  },

  // ============================================================================
  // 5. SECURITY & PERFORMANCE HEADERS
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
          { key: "Link", value: "<https://cdn.sanity.io>; rel=preconnect; crossorigin, <https://www.googletagmanager.com>; rel=preconnect" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
        ],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "_rsc" }],
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
          { key: "Vary", value: "RSC, Next-Router-State-Tree, Next-Router-Prefetch" },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|ttf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ============================================================================
  // 6. MIGRATION REDIRECT ENGINE (UPDATED JAN 24 2026)
  // ============================================================================

  async redirects() {
    return [
      // 1. Force Remove Trailing Slashes (The "Slash Cleaner")
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
      // ========================================================================
      // A. SECURITY PATHS (Return 410 Gone via /410 page)
      // ========================================================================
      { source: '/thank-you', destination: '/410', permanent: false },
      { source: '/webmail/:path*', destination: '/410', permanent: false },
      { source: '/cpanel/:path*', destination: '/410', permanent: false },
      { source: '/cgi-bin/:path*', destination: '/410', permanent: false },
      { source: '/phpinfo.php', destination: '/410', permanent: false },
      { source: '/wp-admin/:path*', destination: '/410', permanent: false },
      { source: '/wp-content/:path*', destination: '/410', permanent: false },
      { source: '/wp-includes/:path*', destination: '/410', permanent: false },

      // ========================================================================
      // B. CATEGORY MIGRATIONS
      // ========================================================================
      { source: '/tech', destination: '/reviews', permanent: true },
      { source: '/parenting-kids', destination: '/reviews', permanent: true },
      { source: '/lifestyle', destination: '/how-to-guides', permanent: true },
      { source: '/category/how-to-guides', destination: '/how-to-guides', permanent: true },
      { source: '/category/buyers-guide', destination: '/reviews', permanent: true },
      { source: '/category/education', destination: '/how-to-guides', permanent: true },
      { source: '/category/public-holidays-events', destination: '/events-holidays', permanent: true },

      // ========================================================================
      // C. DEEPSEEK CONTENT CONSOLIDATION
      // ========================================================================
      { 
        source: '/how-to-guides/deepseek-ai-revolutionary-data-retrieval-method', 
        destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', 
        permanent: true 
      },
      { 
        source: '/how-to-guides/deepseek-ai-startup-disrupting-big-tech-with-innovation', 
        destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', 
        permanent: true 
      },
      { 
        source: '/tech/deepseek-ai-revolutionary-data-retrieval-method', 
        destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', 
        permanent: true 
      },
      { 
        source: '/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation', 
        destination: '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis', 
        permanent: true 
      },

      // ========================================================================
      // D. PRODUCT URL CLEANUP (Old "-review" -> New "-noun")
      // ========================================================================
      
      // 1. Audio (Headphones/Earbuds) - GSC Cleanups
      { source: '/reviews/jbl-tune-770nc', destination: '/reviews/jbl-tune-770nc-wireless-headphone', permanent: true },
      { source: '/reviews/apple-airpods-max-usb-c', destination: '/reviews/apple-airpods-max-usb-c-wireless-headphone', permanent: true },
      { source: '/reviews/apple-airpods-pro-3-review', destination: '/reviews/apple-airpods-pro-3', permanent: true },
      
      // 2. Tech & Console - GSC Cleanups
      { source: '/reviews/ps5-slim-digital-ea-sports-fc-26-bundle', destination: '/reviews/ps5-slim-digital-ea-sports-fc-26-bundle-console', permanent: true },
      
      // 3. Baby Monitors & Security
      { source: '/reviews/tp-link-tapo-c200-monitor', destination: '/reviews/tp-link-tapo-c200-baby-monitor', permanent: true },
      { source: '/reviews/hellobaby-monitor-hb6550', destination: '/reviews/hellobaby-hb6550-baby-monitor', permanent: true },
      { source: '/reviews/imou-1080p-security-camera-dk2', destination: '/reviews/imou-1080p-security-camera-dk2--baby-monitor', permanent: true },
      { source: '/reviews/reolink-e1-pro-2k-camera', destination: '/reviews/reolink-e1-pro-2k-camera-baby-monitor', permanent: true },
      { source: '/reviews/ezviz-c6n-security-camera', destination: '/reviews/ezviz-c6n--baby-monitor', permanent: true },
      { source: '/reviews/yi-security-home-camera', destination: '/reviews/yi-security-home-camera-baby-monitor', permanent: true },
      { source: '/reviews/eufy-baby-monitor-e21-4k', destination: '/reviews/eufy-e21-4k-baby-monitor', permanent: true },
      { source: '/reviews/lollipop-baby-camera-turquoise', destination: '/reviews/lollipop-turquoise-baby-monitor', permanent: true },

      // 4. Shavers & Grooming
      { source: '/reviews/kemei-2299-professional-trimmer-review', destination: '/reviews/kemei-2299-professional-trimmer', permanent: true },
      { source: '/reviews/philips-multigroom-series-3000-mg3720', destination: '/reviews/philips-multigroom-series-3000-mg3720-trimmer', permanent: true },
      { source: '/reviews/braun-series-5-51-b1000s-review', destination: '/reviews/braun-series-5-51-b1000s-shaver', permanent: true },
      { source: '/reviews/philips-series-7000-mg7920-review', destination: '/reviews/philips-series-7000-mg7920-trimmer', permanent: true },
      { source: '/reviews/braun-series-9-pro-plus-review', destination: '/reviews/braun-series-9-pro-plus-shaver', permanent: true },
      { source: '/reviews/panasonic-er2051-trimmer-review', destination: '/reviews/panasonic-er2051-trimmer', permanent: true },
      { source: '/reviews/philips-norelco-shaver-9800-senseiq', destination: '/reviews/philips-norelco-9800-senseiq-shaver', permanent: true },
      { source: '/reviews/pritech-3-in-1-grooming-set', destination: '/reviews/pritech-3-in-1-grooming-set-shaver', permanent: true },
      { source: '/reviews/philips-oneblade-pro-qp6542-review', destination: '/reviews/philips-oneblade-pro-qp6542-trimmer', permanent: true },
      { source: '/reviews/wahl-travel-shaver-3615-1027-review', destination: '/reviews/wahl-travel-shaver-3615-1027', permanent: true },
      { source: '/reviews/panasonic-es-sa40-pro-curve-review', destination: '/reviews/panasonic-es-sa40-pro-curve-shaver', permanent: true },
      { source: '/reviews/olov-for-man-grooming-kit-review', destination: '/reviews/olov-for-man-grooming-kit-trimmer', permanent: true },
      { source: '/reviews/skull-shaver-pitbull-gold-pro-review', destination: '/reviews/skull-shaver-pitbull-gold-pro', permanent: true },

      // 5. General Cleanup
      { source: '/reviews/ugreen-clipbuds-open-ear-review', destination: '/reviews/ugreen-clipbuds-open-earbuds', permanent: true },
      { source: '/reviews/sony-wh-ch720n', destination: '/reviews/sony-wh-ch720n-wireless-headphone', permanent: true },
      { source: '/reviews/sony-wh-1000xm6-headphones', destination: '/reviews/sony-wh-1000xm6-wireless-headphone', permanent: true },
      { source: '/reviews/sony-wf-1000xm5-earbuds-review', destination: '/reviews/sony-wf-1000xm5-earbuds', permanent: true },
      { source: '/reviews/xiaomi-redmi-buds-6-play-review', destination: '/reviews/xiaomi-redmi-buds-6-play-earbuds', permanent: true },
      { source: '/reviews/soundcore-anker-p20i-earbuds-review', destination: '/reviews/soundcore-anker-p20i-earbuds', permanent: true },
      { source: '/reviews/bose-quietcomfort-ultra-headphones', destination: '/reviews/bose-quietcomfort-ultra-wireless-headphone', permanent: true },
      { source: '/reviews/marshall-major-v-bluetooth', destination: '/reviews/marshall-major-v-bluetooth-headphone', permanent: true },
      { source: '/reviews/soundcore-space-q45', destination: '/reviews/soundcore-space-q45-wireless-headphone', permanent: true },
      { source: '/reviews/jbl-tune-780nc', destination: '/reviews/jbl-tune-780nc-wireless-headphone', permanent: true },
      { source: '/reviews/sennheiser-momentum-4-wireless', destination: '/reviews/sennheiser-momentum-4-wireless-headphone', permanent: true },
      { source: '/reviews/huawei-freebuds-se-3-review', destination: '/reviews/huawei-freebuds-se-3-earbuds', permanent: true },
      { source: '/reviews/samsung-galaxy-buds3-pro-review', destination: '/reviews/samsung-galaxy-buds3-pro-earbuds', permanent: true },
      { source: '/reviews/soundcore-life-q30', destination: '/reviews/soundcore-life-q30-wireless-headphone', permanent: true },

      // 6. Kitchen & Home
      { source: '/reviews/philips-dual-basket-airfryer-3000-review', destination: '/reviews/philips-dual-basket-air-fryer-3000', permanent: true },

      // 7. Baby Care
      { source: '/reviews/mustela-vitamin-barrier-cream-123-review', destination: '/reviews/mustela-vitamin-barrier-cream-123', permanent: true },
      { source: '/reviews/sebamed-baby-body-lotion-ph5-5-review', destination: '/reviews/sebamed-ph5-5-baby-body-lotion', permanent: true },

      // 8. Deals
      { source: '/deals/magic-bullet-blender-deal', destination: '/deals/magic-bullet-MB4-0612)-blender', permanent: true },
      { source: '/deals/lattafa-khamrah-perfume-deal', destination: '/deals/lattafa-khamrah-perfume', permanent: true },
      { source: '/deals/sihoo-m18-ergonomic-chair-deal', destination: '/deals/sihoo-m18-ergonomic-chair', permanent: true },
      { source: '/deals/coodoo-100pcs-magnetic-tiles-deal', destination: '/deals/coodoo-100pcs-magnetic-tiles-game', permanent: true },

      // ========================================================================
      // E. GENERAL SEO CLEANUP (GSC Jan 24 Fixes)
      // ========================================================================
      
      { source: '/tech/samsung-galaxy-s26-ultra-specs-uae-price', destination: '/reviews/samsung-galaxy-s26-ultra-specs-uae-price', permanent: true },
      { source: '/tech/state-of-ai-december-2025-uae-report', destination: '/how-to-guides/state-of-ai-december-2025-uae-report', permanent: true },
      { source: '/tech/quantum-computing-guide-uae', destination: '/how-to-guides/quantum-computing-guide-uae', permanent: true },
      { source: '/tech/quantum-computing-strategy-uae-2026', destination: '/how-to-guides/quantum-computing-strategy-uae-2026', permanent: true },
      { source: '/tech/gmail-gemini-ai-features-2026', destination: '/how-to-guides/gmail-gemini-ai-features-2026', permanent: true },
      
      { source: '/smart-home/how-to-clean-washing-machine', destination: '/how-to-guides/how-to-clean-washing-machine', permanent: true },
      
      { source: '/travel-tourism/world-safest-airlines-2026', destination: '/top-ten/world-safest-airlines-2026', permanent: true },
      { source: '/reviews/best-wireless-earbuds-uae', destination: '/top-ten/best-wireless-earbuds-uae', permanent: true },
      { source: '/reviews/best-beard-trimmers-uae', destination: '/top-ten/best-beard-trimmers-uae', permanent: true },
      { source: '/reviews/best-electric-shaver-uae', destination: '/top-ten/best-electric-shaver-uae', permanent: true },
      { source: '/reviews/best-air-fryers-uae-2026', destination: '/top-ten/best-air-fryers-uae-2026', permanent: true },
      { source: '/reviews/new-year-tech-upgrades-uae-2026', destination: '/top-ten/new-year-tech-upgrades-uae-2026', permanent: true },
      
      { source: '/parenting-kids/best-baby-skincare-uae', destination: '/top-ten/best-baby-skincare-uae', permanent: true },
      { source: '/parenting-kids/best-baby-monitors-uae', destination: '/top-ten/best-baby-monitors-uae', permanent: true },
      { source: '/parenting-kids/top-10-schools-dubai-2026-khda-fees-reviews', destination: '/top-ten/top-10-schools-dubai-2026-khda-fees-reviews', permanent: true },
      { source: '/parenting-kids/where-to-donate-used-toys-uae', destination: '/how-to-guides/where-to-donate-used-toys-uae', permanent: true },
      
      { source: '/lifestyle/charity-organizations-uae-donations', destination: '/how-to-guides/charity-organizations-uae-donations', permanent: true },
      { source: '/lifestyle/how-to-pay-zakat-in-uae-online', destination: '/how-to-guides/how-to-pay-zakat-in-uae-online', permanent: true },
      { source: '/events-holidays/ramadan-2026-uae', destination: '/ramadan-2026', permanent: true },
      { source: '/best-places-visit-uae-eid-holidays', destination: '/events-holidays/eid-holidays-uae-2026-best-places-to-visit', permanent: true },
      { source: '/eid-al-fitr-uae-prayer-timings-free-events', destination: '/events-holidays/eid-al-fitr-uae-prayer-timings-free-events', permanent: true },
      
      { source: '/best-baby-monitors-uae', destination: '/top-ten/best-baby-monitors-uae', permanent: true },
      { source: '/best-electric-shaver-uae', destination: '/top-ten/best-electric-shaver-uae', permanent: true },
      { source: '/best-baby-skincare-uae', destination: '/top-ten/best-baby-skincare-uae', permanent: true },
      { source: '/deepseek-ai-revolutionary-data-retrieval-method', destination: '/how-to-guides/deepseek-ai-revolutionary-data-retrieval-method', permanent: true },
    ];
  },
};

export default nextConfig;