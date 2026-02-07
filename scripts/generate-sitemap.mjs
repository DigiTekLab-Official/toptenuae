// scripts/generate-sitemap.mjs
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Configuration (Hardcoded for safety during build)
const client = createClient({
  projectId: 'kxdjzy8e',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Fetch fresh data
});

const BASE_URL = 'https://toptenuae.com';

// 2. The Query
const query = `*[_type in ["article", "product", "deal", "howTo", "topTenList"] && defined(slug.current)] {
  _type,
  "slug": slug.current,
  _updatedAt,
  "category": category->slug.current
}`;

async function generateSitemap() {
  console.log('🚀 Starting Static Sitemap Generation...');

  try {
    // 3. Fetch Data
    const data = await client.fetch(query);
    console.log(`✅ Fetched ${data.length} items from Sanity.`);

    // 4. Build XML Paths
    const dynamicRoutes = data.map((item) => {
      let urlPath = '';
      switch (item._type) {
        case 'article': urlPath = `/${item.category || 'reviews'}/${item.slug}`; break;
        case 'product': urlPath = `/reviews/${item.slug}`; break;
        case 'deal': urlPath = `/deals/${item.slug}`; break;
        case 'howTo': urlPath = `/how-to-guides/${item.slug}`; break;
        case 'topTenList': urlPath = `/top-ten/${item.slug}`; break;
        default: urlPath = `/${item.slug}`;
      }
      return `
  <url>
    <loc>${BASE_URL}${urlPath}</loc>
    <lastmod>${new Date(item._updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('');

    const staticRoutes = [
      '', '/top-ten', '/reviews', '/how-to-guides', '/deals', 
      '/finance-tools', '/events-holidays', '/travel-tourism', 
      '/ramadan-2026', '/about-us', '/contact-us', '/privacy-policy'
    ];

    const staticXml = staticRoutes.map(route => `
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

    // 5. Write to File
    // Resolve the path to the "public" directory
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicDir = path.resolve(__dirname, '../public');
    
    // Ensure public dir exists
    if (!fs.existsSync(publicDir)){
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), finalXml);
    console.log('🎉 sitemap.xml generated successfully in /public');

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1); // Fail the build if sitemap fails
  }
}

generateSitemap();