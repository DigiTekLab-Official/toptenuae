// src/app/api/sitemap-main/route.ts
import { NextResponse } from 'next/server';

// ✅ SAFE CONFIGURATION
// We use Edge runtime because 'fetch' is native and fast.
export const runtime = 'edge'; 
export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Setup Configuration Manually (No environment variable dependency issues)
  const PROJECT_ID = 'kxdjzy8e'; 
  const DATASET = 'production';
  const API_VERSION = '2024-01-01';
  const BASE_URL = 'https://toptenuae.com';

  // 2. The GROQ Query
  const query = `*[_type in ["article", "product", "deal", "howTo", "topTenList"] && defined(slug.current)] {
    _type,
    "slug": slug.current,
    _updatedAt,
    "category": category->slug.current
  }`;

  // 3. Construct the URL
  const sanityUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

  try {
    console.log("Fetching sitemap data from Sanity...");
    
    // 4. Perform Raw Fetch (No client library = No crashes)
    const response = await fetch(sanityUrl);
    
    if (!response.ok) {
      throw new Error(`Sanity API Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const data = json.result;

    // 5. Generate XML
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
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error: any) {
    console.error("Sitemap Error:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}