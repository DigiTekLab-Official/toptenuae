// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.baseUrl || 'https://toptenuae.com';

  // Shared blocked paths (SEO + Security)
  const sharedDisallow = [
    '/studio',
    '/studio/',
    '/api/',
    '/search',
    '/search/',
    // Add if present:
    // '/preview',
    // '/draft',
  ];

  return {
    rules: [
      // Default rule for all bots (Google, Bing, etc.)
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
      },

      // AI & Apple Bots (explicitly allowed, but still restricted)
      {
        userAgent: ['GPTBot', 'Google-Extended', 'Applebot'],
        allow: '/',
        disallow: sharedDisallow,
      },
    ],

    // Sitemap location
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
