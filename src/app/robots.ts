// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';

  const sharedDisallow = [
    // 1. SECURITY & ADMIN
    '/studio/',
    '/api/',
    '/admin/',
    '/private/',
    '/webmail/',
    '/cpanel/',
    '/cgi-bin/',
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
    '/search/',
    '/thank-you',
    '/phpinfo.php',
    '/*.php',
    '/author/',
    '/feed/',
    '/index.php/',
    '/sample-page/',
  ];

  return {
    rules: [
      // =========================================================================
      // MAIN RULE: Standard Search Engines (Google, DuckDuckGo, etc.)
      // =========================================================================
      {
        userAgent: '*',
        disallow: sharedDisallow,
      },

      // =========================================================================
      // MICROSOFT ECOSYSTEM (Bing + Copilot + Yahoo)
      // Blocking Bingbot kills your traffic from Microsoft Copilot.
      // =========================================================================
      {
        userAgent: 'Bingbot',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Slurp', // Yahoo
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Microsoft-Werbe-Robot', // Microsoft Ads/Services
        disallow: sharedDisallow,
      },

      // =========================================================================
      // AI BOTS - Explicit Permissions
      // =========================================================================
      {
        userAgent: 'GPTBot',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'OAI-SearchBot',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Google-Extended',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Applebot', // Powers Siri & Apple Intelligence
        disallow: sharedDisallow,
      },
      {
        userAgent: 'PerplexityBot',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'ClaudeBot',
        disallow: sharedDisallow,
      },

      // =========================================================================
      // AGGRESSIVE CRAWLERS - Throttled Access
      // =========================================================================
      {
        userAgent: 'AhrefsBot',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'SemrushBot',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'DotBot',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'MJ12bot',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'BLEXBot',
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      {
        userAgent: 'Bytespider', // ByteDance (TikTok/Douyin) Crawler
        disallow: sharedDisallow,
        crawlDelay: 10,
      },

      // =========================================================================
      // BAD BOTS - Blocked Completely
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