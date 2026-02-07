import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const commonDisallow = [
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
    '/deals/*' // ✅ Added to block individual deal posts
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: commonDisallow,
      },
      {
        userAgent: 'Bingbot',
        disallow: ['/studio/', '/api/', '/search/', '/deals/*'],
      },
      {
        userAgent: 'Slurp',
        disallow: ['/studio/', '/api/', '/deals/*'],
      },
      // AI Bots
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'Google-Extended',
          'Applebot',
          'PerplexityBot',
          'ClaudeBot'
        ],
        disallow: ['/studio/', '/api/', '/deals/*'],
      },
      // Throttled Bots (Aggressive crawlers)
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'BLEXBot',
          'Bytespider'
        ],
        crawlDelay: 10,
        disallow: ['/studio/', '/api/', '/deals/*'],
      },
      // Blocked Bots (Junk/Spam)
      {
        userAgent: [
          'ia_archiver',
          'MegaIndex',
          'SeznamBot',
          'Uptimebot',
          'Mauibot',
          'LieBaoFast',
          'PC6spider'
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://toptenuae.com/sitemap.xml',
  };
}