// src/app/sitemap.xml/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

// =====================================================================
// FORCE EDGE RUNTIME & DYNAMIC GENERATION
// =====================================================================
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// =====================================================================
// CONFIGURATION
// =====================================================================
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';

// Static Routes
const STATIC_ROUTES = [
  { url: '', priority: 1.0, changeFrequency: 'daily' },
  { url: '/top-ten', priority: 0.9, changeFrequency: 'daily' },
  { url: '/reviews', priority: 0.9, changeFrequency: 'daily' },
  { url: '/how-to-guides', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/deals', priority: 0.9, changeFrequency: 'hourly' }, 
  { url: '/finance-tools', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/events-holidays', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/travel-tourism', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/ramadan-2026', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/about-us', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/contact-us', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/terms-and-conditions', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/affiliate-disclosure', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/cookies-policy', priority: 0.3, changeFrequency: 'yearly' },
];

// =====================================================================
// SITEMAP GENERATION
// =====================================================================
export async function GET(request: NextRequest) {
  const fallbackDate = new Date().toISOString();
  
  let dynamicUrls: Array<{
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }> = [];

  // =====================================================================
  // FETCH DYNAMIC CONTENT FROM SANITY
  // =====================================================================
  try {
    const query = groq`*[_type in ["article", "product", "deal", "howTo", "topTenList"] && defined(slug.current)] {
      _type,
      "slug": slug.current,
      _updatedAt,
      "category": category->slug.current
    }`;

    const data = await client.fetch(query);

    if (Array.isArray(data)) {
      dynamicUrls = data.map((item: any) => {
        let path = '';

        switch (item._type) {
          case 'article':
            path = `/${item.category || 'reviews'}/${item.slug}`;
            break;
          case 'product':
            path = `/reviews/${item.slug}`;
            break;
          case 'deal':
            path = `/deals/${item.slug}`;
            break;
          case 'howTo':
            path = `/how-to-guides/${item.slug}`;
            break;
          case 'topTenList':
            path = `/top-ten/${item.slug}`;
            break;
          default:
            path = `/${item.slug}`;
        }

        return {
          loc: `${BASE_URL}${path}`,
          lastmod: new Date(item._updatedAt || fallbackDate).toISOString(),
          changefreq: item._type === 'deal' ? 'daily' : 'weekly',
          priority: item._type === 'topTenList' ? 0.8 : 0.7,
        };
      });
    }
  } catch (error) {
    console.error('❌ Sitemap: Failed to fetch Sanity data', error);
    // Continue with static routes only
  }

  // =====================================================================
  // GENERATE XML
  // =====================================================================
  const staticUrls = STATIC_ROUTES.map((route) => ({
    loc: `${BASE_URL}${route.url}`,
    lastmod: fallbackDate,
    changefreq: route.changeFrequency,
    priority: route.priority,
  }));

  const allUrls = [...staticUrls, ...dynamicUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // =====================================================================
  // RETURN XML RESPONSE
  // =====================================================================
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

// =====================================================================
// XML ESCAPING UTILITY
// =====================================================================
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return char;
    }
  });
}
