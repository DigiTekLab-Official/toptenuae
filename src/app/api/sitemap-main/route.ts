// src/app/api/sitemap-main/route.ts
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const BASE_URL = 'https://toptenuae.com';

export async function GET() {
  try {
    const query = groq`*[_type in ["article", "product", "deal", "howTo", "topTenList"] && defined(slug.current)] {
      _type,
      "slug": slug.current,
      _updatedAt,
      "category": category->slug.current
    }`;

    const data = await client.fetch(query);

    const dynamicRoutes = data.map((item: any) => {
      let path = '';
      switch (item._type) {
        case 'article': path = `/${item.category || 'reviews'}/${item.slug}`; break;
        case 'product': path = `/reviews/${item.slug}`; break;
        case 'deal': path = `/deals/${item.slug}`; break;
        case 'howTo': path = `/how-to-guides/${item.slug}`; break;
        case 'topTenList': path = `/top-ten/${item.slug}`; break;
        default: path = `/${item.slug}`;
      }
      return `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${new Date(item._updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('');

    const staticRoutesList = [
      '', '/top-ten', '/reviews', '/how-to-guides', '/deals', 
      '/finance-tools', '/events-holidays', '/travel-tourism', 
      '/ramadan-2026', '/about-us', '/contact-us', '/privacy-policy'
    ];

    const staticXml = staticRoutesList.map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${dynamicRoutes}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}