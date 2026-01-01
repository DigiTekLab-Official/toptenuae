// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // ✅ 1. Match the variable name used in sitemap.ts
  const baseUrl = process.env.baseUrl || 'https://toptenuae.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/', // Block Sanity Studio (Admin Panel)
          '/api/',    // Block backend API routes (Security/SEO best practice)
          '/search',  // Block ALL internal search results (Prevents "Spider Traps" and budget waste)
        ],
      },
      // ✅ 2. Optional: Explicitly Allow AI Bots (Strategy: Get featured in AI answers)
      {
        userAgent: ['GPTBot', 'Google-Extended', 'Bingbot'],
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}