import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Use public env var for consistency
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';

  // =============================================================================
  // CRITICAL CONFIGURATION
  // =============================================================================
  
  const sharedDisallow = [
    // 1. SECURITY & ADMIN (Keep these blocked)
    '/studio',
    '/api/',
    '/admin',
    '/private',
    '/webmail/',
    '/cpanel/',
    '/wp-admin/',      // Block WP admin, but ALLOW other WP paths to let redirects work
    '/wp-includes/',
    '/wp-content/',
    
    // 2. QUERY PARAMETERS (Prevent Duplicate Content)
    // We allow Google to crawl the main URL, but block variations that dilutes SEO
    '/*?s=',          // Block internal search results
    '/*?ref=',        // Block referral parameters
    '/*?utm_',        // Block marketing tracking
    '/*?fbclid',      // Block Facebook tracking
    '/*?gclid',       // Block Google Ads tracking
    
    // 3. INTERNAL SEARCH
    '/search',
  ];

  // NOTE: I removed '/category/', '/feed/', and '/amp/' from Disallow.
  // WHY? Because we want Google to crawl them ONE TIME, hit your 301 Redirects,
  // and update its index to the new clean URLs.

  return {
    rules: [
      // =========================================================================
      // MAIN RULE: Standard Search Engines (Google, Bing)
      // =========================================================================
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
      },

      // =========================================================================
      // AI BOTS - STRATEGY: MAXIMIZE VISIBILITY
      // =========================================================================
      // We explicitly ALLOW these bots because we want TopTenUAE to appear 
      // in ChatGPT answers and Perplexity summaries.
      {
        userAgent: [
          'GPTBot',           // ChatGPT Training
          'ChatGPT-User',     // ChatGPT Live Browsing (Critical for answers)
          'OAI-SearchBot',    // SearchGPT
          'Google-Extended',  // Gemini
          'Applebot',         // Siri / Apple Intelligence
          'PerplexityBot',    // Perplexity AI
          'ClaudeBot',        // Claude AI
        ],
        allow: '/',
        disallow: sharedDisallow,
      },

      // =========================================================================
      // AGGRESSIVE CRAWLERS - STRATEGY: PROTECT SERVER
      // =========================================================================
      // These bots often hammer sites. We slow them down.
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'BLEXBot',
          'Bytespider',       // Often aggressive
        ],
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 10,       // Force them to wait 10 seconds between requests
      },

      // =========================================================================
      // BAD BOTS - STRATEGY: BLOCK COMPLETELY
      // =========================================================================
      {
        userAgent: [
          'ia_archiver',
          'MegaIndex',
          'SeznamBot',
          'Uptimebot',
          'Mauibot',
          'LieBaoFast',
          'PC6spider',
        ],
        disallow: '/',
      },
    ],

    // SITEMAP LOCATION
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}