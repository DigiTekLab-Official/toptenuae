// functions/api/sitemap-main.ts
export async function onRequest(context: any) {
  // 1. Setup your Sanity Configuration manually
  // You can hardcode these or use context.env if you set them in Cloudflare Dashboard
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

  // 3. Construct the URL for the Sanity API
  const sanityUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

  try {
    // 4. Perform a raw fetch (No libraries needed)
    const response = await fetch(sanityUrl);
    const json = await response.json();
    const data = json.result;

    // 5. Generate the XML
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

    const finalXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${dynamicRoutes}
</urlset>`;

    // 6. Return the response directly
    return new Response(finalXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    return new Response(`Error generating sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}