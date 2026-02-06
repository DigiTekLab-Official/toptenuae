import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { NextResponse } from 'next/server';

// ✅ FORCE DYNAMIC: Always run on the server (Edge/Worker)
export const runtime = 'edge'; 
export const dynamic = 'force-dynamic'; 

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';

const STATIC_ROUTES = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/top-ten', priority: '0.9', changefreq: 'daily' },
  { url: '/reviews', priority: '0.9', changefreq: 'daily' },
  { url: '/how-to-guides', priority: '0.9', changefreq: 'weekly' },
  { url: '/deals', priority: '0.9', changefreq: 'hourly' },
  { url: '/finance-tools', priority: '0.8', changefreq: 'monthly' },
  { url: '/events-holidays', priority: '0.8', changefreq: 'weekly' },
  { url: '/travel-tourism', priority: '0.8', changefreq: 'weekly' },
  { url: '/ramadan-2026', priority: '0.8', changefreq: 'weekly' },
  { url: '/about-us', priority: '0.5', changefreq: 'yearly' },
  { url: '/contact-us', priority: '0.5', changefreq: 'yearly' },
  { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly' },
  { url: '/affiliate-disclosure', priority: '0.3', changefreq: 'yearly' },
  { url: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
  { url: '/cookies-policy', priority: '0.3', changefreq: 'yearly' },
];

const SITEMAP_HEADERS: Record<string, string> = {
  'Content-Type': 'application/xml; charset=utf-8',
  // Prevent Cloudflare (and other CDNs) from caching a bad/stale response.
  // If you want caching later, increase s-maxage, but purge any old cache first.
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0',
  'CDN-Cache-Control': 'no-store, max-age=0',
  'Surrogate-Control': 'no-store',
};

export async function GET() {
  const fallbackDate = new Date().toISOString();

  // 1. Fetch Data (Renamed variable to avoid conflicts)
  const sitemapQuery = groq`{
    "articles": *[_type in ["article", "product", "deal", "howTo", "topTenList"] && defined(slug.current)] {
      _type,
      "slug": slug.current,
      _updatedAt,
      "category": category->slug.current
    }
  }`;

  let dynamicRoutes = '';

  try {
    // Use the unique query name here
    const response = await client.fetch(sitemapQuery);
    
    // Handle cases where response might be wrapped or just an array
    const data = Array.isArray(response) ? response : (response.articles || []);

    if (Array.isArray(data)) {
      dynamicRoutes = data.map((item: any) => {
        let path = '';
        // Map Sanity types to your URL structure
        switch (item._type) {
          case 'article': path = `/${item.category || 'reviews'}/${item.slug}`; break;
          case 'product': path = `/reviews/${item.slug}`; break;
          case 'deal': path = `/deals/${item.slug}`; break;
          case 'howTo': path = `/how-to-guides/${item.slug}`; break;
          case 'topTenList': path = `/top-ten/${item.slug}`; break;
          default: path = `/${item.slug}`;
        }
        
        const lastmod = item._updatedAt ? new Date(item._updatedAt).toISOString() : fallbackDate;
        const priority = item._type === 'topTenList' ? '0.9' : '0.8';
        const changefreq = item._type === 'deal' ? 'daily' : 'weekly';

        return `
  <url>
    <loc>${BASE_URL}${escapeXml(path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      }).join('');
    }
  } catch (error) {
    console.error('Sitemap Generation Error:', error);
  }

  // 2. Generate Static XML
  const staticXml = STATIC_ROUTES.map(route => `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${fallbackDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

  // 3. Construct Final XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${dynamicRoutes}
</urlset>`;

  // 4. Return with correct Headers
  return new NextResponse(xml, {
    status: 200,
    headers: SITEMAP_HEADERS,
  });
}

export async function HEAD() {
  // Some CDNs can behave differently for HEAD vs GET.
  // Explicitly returning the same headers ensures `curl -I` doesn't fall back.
  return new NextResponse(null, {
    status: 200,
    headers: SITEMAP_HEADERS,
  });
}

// Helper to prevent XML errors with special characters like '&'
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