import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';

  const sharedDisallow = [
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
    
    // ✅ CRITICAL FIX: Removed /category/, /tag/, and /author/
    // We MUST allow bots to crawl these paths so they can hit the 
    // 301 Redirects defined in next.config.ts. 
    // If we block them here, the redirects will never be seen by Google.
    
    '/*?s=',
    '/*?ref=',
    '/*?utm_',
    '/*?fbclid',
    '/*?gclid',
    '/*?noamp',
    '/search/',
    '/thank-you',
    '/phpinfo.php',
    '/*.php',
    '/feed/',
    '/index.php/',
    '/sample-page/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/', // Explicitly allow root
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Bingbot',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Slurp',
        disallow: sharedDisallow,
      },
      // AI Bots - Allowed (but restricted from private/admin areas)
      { userAgent: 'GPTBot', disallow: sharedDisallow },
      { userAgent: 'ChatGPT-User', disallow: sharedDisallow },
      { userAgent: 'OAI-SearchBot', disallow: sharedDisallow },
      { userAgent: 'Google-Extended', disallow: sharedDisallow },
      { userAgent: 'Applebot', disallow: sharedDisallow },
      { userAgent: 'PerplexityBot', disallow: sharedDisallow },
      { userAgent: 'ClaudeBot', disallow: sharedDisallow },
      
      // Throttled Bots (Aggressive crawlers)
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot', 'BLEXBot', 'Bytespider'],
        disallow: sharedDisallow,
        // Note: crawlDelay is not officially in standard robots.txt spec for Google, 
        // but is respected by some bots like Bing/Yandex.
        crawlDelay: 10, 
      },
      
      // Blocked Bots (Junk/Spam)
      {
        userAgent: ['ia_archiver', 'MegaIndex', 'SeznamBot', 'Uptimebot', 'Mauibot', 'LieBaoFast', 'PC6spider'],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}