// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.baseUrl || 'https://toptenuae.com';

  // =============================================================================
  // CRITICAL GSC FIXES - Block Problem URLs Causing Indexing Issues
  // =============================================================================
  
  const sharedDisallow = [
    // 1. STUDIO & ADMIN (Security)
    '/studio',
    '/api/',
    '/admin',
    '/private',
    
    // 2. WEBMAIL & CPANEL (Fixes "Page with redirect" & "Not found" errors)
    '/webmail/',
    '/cpanel/',
    '/cgi-bin/',
    '/docs/',
    '/protected/',
    '/blocked/',
    
    // 3. WORDPRESS LEGACY (Cleanup old paths)
    '/wp-admin/',
    '/wp-includes/',
    '/wp-content/',
    '/author/',
    '/index.php/',
    
    // 4. OLD CATEGORY STRUCTURE (Already migrated, prevent re-indexing)
    '/category/',
    
    // 5. AMP & FEED URLs (Fixes "Page with redirect" errors)
    '/*/amp',
    '/*/amp/',
    '/*/feed',
    '/*/feed/',
    '/feed/',
    '/rss/',
    '/comments/feed/',
    
    // 6. QUERY PARAMETERS (Fixes duplicate content issues)
    '/*?s=',          // Search queries
    '/*?noamp=',      // AMP parameter
    '/*?amp=',        // AMP parameter
    '/*?m=',          // Mobile parameter
    '/*?feed=',       // Feed parameter
    '/*?cat=',        // Category parameter
    '/*?ref=',        // Referral parameter
    
    // 7. INTERNAL SEARCH (Prevents crawl budget waste)
    '/search',
    '/?s=',
  ];

  return {
    rules: [
      // =========================================================================
      // MAIN RULE: All Search Engines + AI Bots
      // =========================================================================
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
        // CRITICAL: Add crawl-delay to prevent overwhelming server
        crawlDelay: 1,
      },

      // =========================================================================
      // AI BOTS - Explicit Authorization
      // =========================================================================
      
      // --- OpenAI (ChatGPT) ---
      {
        userAgent: [
          'GPTBot',           // Training Models
          'ChatGPT-User',     // Live Browsing
          'OAI-SearchBot',    // SearchGPT
        ],
        allow: '/',
        disallow: sharedDisallow,
      },

      // --- Google (Gemini) ---
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: sharedDisallow,
      },

      // --- Apple (Siri & Intelligence) ---
      {
        userAgent: [
          'Applebot',
          'Applebot-Extended',
        ],
        allow: '/',
        disallow: sharedDisallow,
      },

      // --- Answer Engines ---
      {
        userAgent: [
          'PerplexityBot',
          'ClaudeBot',
          'DeepSeekBot',
        ],
        allow: '/',
        disallow: sharedDisallow,
      },

      // --- Base Crawlers ---
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: sharedDisallow,
      },

      // =========================================================================
      // AGGRESSIVE CRAWLERS - Rate Limit (Fixes server load issues)
      // =========================================================================
      {
        userAgent: [
          'AhrefsBot',        // SEO tool (very aggressive)
          'SemrushBot',       // SEO tool
          'DotBot',           // Moz crawler
          'MJ12bot',          // Majestic crawler
          'BLEXBot',          // Webmeup crawler
        ],
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 10,      // Slow them down significantly
      },

      // =========================================================================
      // BAD BOTS - Complete Block (Spam/scraping bots)
      // =========================================================================
      {
        userAgent: [
          'ia_archiver',      // Alexa crawler (deprecated, causes issues)
          'MegaIndex',        // Russian scraper
          'SeznamBot',        // Czech scraper
          'JobboerseBot',     // Scraper
          'EmailCollector',   // Spam bot
          'EmailSiphon',      // Spam bot
          'WebBandit',        // Scraper
          'Offline Explorer', // Offline copier
          'HTTrack',          // Offline copier
          'Teleport',         // Offline copier
          'WebCopier',        // Offline copier
        ],
        disallow: '/',       // Block everything
      },
    ],

    // SITEMAP - Critical for GSC crawling
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}