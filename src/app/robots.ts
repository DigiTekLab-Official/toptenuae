// src/app/robots.ts
import { MetadataRoute } from 'next';

// ✅ FORCE DYNAMIC: Ensures this runs as a Worker
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/admin/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'anthropic-ai'],
        disallow: ['/studio/', '/api/', '/admin/'],
      },
    ],
    sitemap: 'https://toptenuae.com/sitemap.xml',
  };
}