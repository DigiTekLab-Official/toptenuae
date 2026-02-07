// scripts/generate-sitemap.mjs
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const client = createClient({
  projectId: 'kxdjzy8e',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const BASE_URL = 'https://toptenuae.com';

const query = `*[_type in ["article", "product", "howTo", "topTenList"] && defined(slug.current)] {
  _type,
  "slug": slug.current,
  _updatedAt,
  "category": category->slug.current
}`;

async function generateSitemap() {
  console.log('🚀 Starting SEO-Boosted Sitemap Generation...');

  try {
    const data = await client.fetch(query);
    console.log(`✅ Fetched ${data.length} items from Sanity.`);

    // 1. Calculate the latest global update date for Static Category pages
    const latestUpdate = data.reduce((latest, item) => {
      const itemDate = new Date(item._updatedAt);
      return itemDate > latest ? itemDate : latest;
    }, new Date(0)).toISOString();

    // 2. Build Dynamic Routes
    const dynamicRoutes = data.map((item) => {
      let urlPath = '';
      switch (item._type) {
        case 'article': urlPath = `/${item.category || 'reviews'}/${item.slug}`; break;
        case 'product': urlPath = `/reviews/${item.slug}`; break;
        case 'howTo': urlPath = `/how-to-guides/${item.slug}`; break;
        case 'topTenList': urlPath = `/top-ten/${item.slug}`; break;
        case 'holiday': urlPath = `/events-holidays/${item.slug}`; break;
        case 'tool': urlPath = `/finance-tools/${item.slug}`; break;
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

    // 3. SEO-Boosted Static Routes
    // We use 'latestUpdate' so Google knows these index pages have new content inside them.
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

    const staticXml = STATIC_ROUTES.map(route => `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${latestUpdate}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

    const finalXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${dynamicRoutes}
</urlset>`;

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicDir = path.resolve(__dirname, '../public');
    
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), finalXml);
    
    console.log('🎉 SEO-Optimized sitemap.xml generated.');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

generateSitemap();