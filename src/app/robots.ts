import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.baseUrl || 'https://toptenuae.com';

  // 1. Consolidated Block List (Security & Admin)
  // Removed duplicates like '/studio/' vs '/studio' as crawlers handle both.
  const sharedDisallow = [
    '/studio',        // Sanity Studio
    '/api/',          // API Routes
    '/search',        // Internal Search to prevent infinite loops
    '/admin',         // Admin areas
    '/private',       // Protected content
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
      // We list these separately to ensure they know they are welcome.
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