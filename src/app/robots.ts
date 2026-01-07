import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.baseUrl || 'https://toptenuae.com';

  // 1. Consolidated Block List (Security, Admin & Junk)
  // We added blocks for feeds and query parameters to save crawl budget.
  const sharedDisallow = [
    '/studio',        // Sanity Studio
    '/api/',          // API Routes
    '/search',        // Internal Search (infinite loops)
    '/admin',         // Admin areas
    '/private',       // Protected content
    '/webmail',       // Block subfolder access if it exists
    '/feed/',         // Block RSS feeds (duplicate content)
    '/rss/',          // Block RSS
    '/comments/feed/',// Block comment feeds
    '/*?',            // CRITICAL: Block all query parameters (filtering/sorting) to prevent duplicate URLs
  ];

  return {
    rules: [
      // ---------------------------------------------------------------------------
      // RULE 1: The "Open Door" (Google, Bing, Yahoo, DuckDuckGo)
      // ---------------------------------------------------------------------------
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
      },

      // ---------------------------------------------------------------------------
      // RULE 2: The "AI VIP List" (Explicitly Authorized)
      // ---------------------------------------------------------------------------
      
      // --- OpenAI (ChatGPT) ---
      {
        userAgent: 'GPTBot',           // For Training Models (GPT-5, etc.)
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'ChatGPT-User',     // CRITICAL: For Live Browsing/Citations
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'OAI-SearchBot',    // SearchGPT Prototype
        allow: '/',
        disallow: sharedDisallow,
      },

      // --- Google (Gemini) ---
      {
        userAgent: 'Google-Extended',  // For Gemini Training/Grounding
        allow: '/',
        disallow: sharedDisallow,
      },

      // --- Apple (Siri & Intelligence) ---
      {
        userAgent: 'Applebot',         // Standard Siri Search
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'Applebot-Extended',// Apple Intelligence Training
        allow: '/',
        disallow: sharedDisallow,
      },

      // --- The "Answer Engines" (High Referral Traffic) ---
      {
        userAgent: 'PerplexityBot',    // Perplexity AI
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'ClaudeBot',        // Anthropic (Claude)
        allow: '/',
        disallow: sharedDisallow,
      },
      
      // --- Emerging & Base Crawlers ---
      {
        userAgent: 'DeepSeekBot',      // DeepSeek AI (Rising popularity)
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: 'CCBot',            // Common Crawl (Used by xAI, Meta, etc.)
        allow: '/',
        disallow: sharedDisallow,
      },
    ],

    // Sitemap is vital for all bots to find your new URLs
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}