// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';

  // =============================================================================
  // CRITICAL: Each User-Agent needs its own rule object
  // Multiple user-agents in one array causes parsing errors
  // =============================================================================
  
  const sharedDisallow = [
    // 1. SECURITY & ADMIN
    '/studio',
    '/studio/*',
    '/api/',
    '/api/*',
    '/admin',
    '/admin/*',
    '/private',
    '/private/*',
    '/webmail/',
    '/webmail/*',
    '/cpanel/',
    '/cpanel/*',
    '/cgi-bin/*',
    '/wp-admin/',
    '/wp-includes/',
    '/wp-content/',
    
    // 2. QUERY PARAMETERS
    '/*?s=',
    '/*?ref=',
    '/*?utm_',
    '/*?fbclid',
    '/*?gclid',
    
    // 3. UTILITY PAGES
    '/search',
    '/search/*',
    '/thank-you',
    '/phpinfo.php',
    '/*.php$',
    '/author/*',
    '/feed/',
    '/feed/*',
    '/index.php/*',
    '/sample-page/',
  ];

  return {
    rules: [
      // =========================================================================
      // MAIN RULE: Standard Search Engines
      // =========================================================================
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
      },

      // =========================================================================
      // AI BOTS - SEPARATE RULES (CRITICAL FIX)
      // Each AI bot gets its own rule to prevent parsing errors
      // =========================================================================
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: sharedDisallow,
      },

      // =========================================================================
      // AGGRESSIVE CRAWLERS - SEPARATE RULES WITH DELAY
      // =========================================================================
      {
        userAgent: 'AhrefsBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'SemrushBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'DotBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'MJ12bot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'BLEXBot',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },

      // =========================================================================
      // BAD BOTS - BLOCK COMPLETELY
      // =========================================================================
      {
        userAgent: 'ia_archiver',
        disallow: '/',
      },
      {
        userAgent: 'MegaIndex',
        disallow: '/',
      },
      {
        userAgent: 'SeznamBot',
        disallow: '/',
      },
      {
        userAgent: 'Uptimebot',
        disallow: '/',
      },
      {
        userAgent: 'Mauibot',
        disallow: '/',
      },
      {
        userAgent: 'LieBaoFast',
        disallow: '/',
      },
      {
        userAgent: 'PC6spider',
        disallow: '/',
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}