// src/app/robots.ts
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
    '/category/',
    '/tag/',
    '/author/',
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
      {
        userAgent: 'Microsoft-Werbe-Robot',
        disallow: sharedDisallow,
      },
      // AI Bots - Allowed
      { userAgent: 'GPTBot', disallow: sharedDisallow },
      { userAgent: 'ChatGPT-User', disallow: sharedDisallow },
      { userAgent: 'OAI-SearchBot', disallow: sharedDisallow },
      { userAgent: 'Google-Extended', disallow: sharedDisallow },
      { userAgent: 'Applebot', disallow: sharedDisallow },
      { userAgent: 'PerplexityBot', disallow: sharedDisallow },
      { userAgent: 'ClaudeBot', disallow: sharedDisallow },
      // Throttled Bots
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot', 'BLEXBot', 'Bytespider'],
        disallow: sharedDisallow,
        crawlDelay: 10,
      },
      // Blocked Bots
      {
        userAgent: ['ia_archiver', 'MegaIndex', 'SeznamBot', 'Uptimebot', 'Mauibot', 'LieBaoFast', 'PC6spider'],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}