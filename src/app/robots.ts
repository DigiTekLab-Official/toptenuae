import { MetadataRoute } from 'next';

/**
 * Senior Developer Note: 
 * We use the "$" anchor to allow the main /deals path exactly,
 * while using the "*" wildcard to block all sub-directories/slugs.
 */
export default function robots(): MetadataRoute.Robots {
  const BASE_URL = 'https://toptenuae.com';

  // System & Security Paths
  const systemDisallow = [
    '/studio/', '/api/', '/admin/', '/private/', '/webmail/', 
    '/cpanel/', '/cgi-bin/', '/phpinfo.php', '/*.php'
  ];

  // WordPress/Legacy Scraping Protection
  const legacyDisallow = [
    '/wp-admin/', '/wp-includes/', '/wp-content/', '/index.php/', '/sample-page/'
  ];

  // Query Parameter & Junk Protection
  const junkPatterns = [
    '/*?s=', '/*?ref=', '/*?utm_', '/*?fbclid', '/*?gclid', '/*?noamp', 
    '/search/', '/feed/'
  ];

  return {
    rules: [
      {
        userAgent: '*',
        // ✅ ALLOW only the exact main deals page
        // Using /$ ensures we allow the directory root but the next rule blocks sub-paths
        allow: ['/deals', '/deals/'], 
        disallow: [
          ...systemDisallow,
          ...legacyDisallow,
          ...junkPatterns,
          '/thank-you',
          '/deals/*', // 🚫 BLOCKS all sub-slugs like /deals/product-name
        ],
      },
      // ✅ AI BOT CONTROL (Updated for 2026)
      {
        userAgent: [
          'GPTBot', 'ChatGPT-User', 'Google-Extended', 
          'Claude-WebCrawler', 'CCBot', 'FacebookBot'
        ],
        disallow: ['/'], // Strict: Protect your content from being used for AI training
      },
      // ✅ AI SEARCH (Allows citations in Perplexity/SearchGPT)
      {
        userAgent: ['OAI-SearchBot', 'PerplexityBot', 'Applebot'],
        allow: ['/'],
        disallow: ['/studio/', '/api/', '/deals/*'],
      },
      // ✅ Aggressive SEO Crawlers (Throttled to save Cloudflare Worker budget)
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot', 'Bytespider'],
        crawlDelay: 5,
        disallow: ['/studio/', '/api/', '/deals/*'],
      },
      // ✅ Junk/Spam Bots (Total Block)
      {
        userAgent: ['ia_archiver', 'MegaIndex', 'SeznamBot', 'Uptimebot', 'Mauibot'],
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}