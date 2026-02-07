// src/app/robots.ts
import { MetadataRoute } from 'next';

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
      // ... your other bots ...
    ],
    sitemap: 'https://toptenuae.com/api/sitemap-main',
  };
}