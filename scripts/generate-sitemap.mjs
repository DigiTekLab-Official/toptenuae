import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const client = createClient({
  projectId: 'kxdjzy8e',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Ensure we get fresh data
});

const BASE_URL = 'https://toptenuae.com';

// FIX 1: Removed "deal" from this list so they are never fetched.
const query = `*[_type in ["category", "topTenList", "article", "buyerGuide", "howTo", "tool", "holiday", "product", "event"] && defined(slug.current) && coalesce(seo.noIndex, false) != true] {
  _type,
  "slug": slug.current,
  _updatedAt,
  "category": coalesce(categories[0]->slug.current, category->slug.current)
}`;

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

async function generateSitemap() {
  console.log('🚀 Starting SEO-Boosted Sitemap Generation...');

  try {
    // Bounded fetch: a SLOW Sanity response must not hang the CI build.
    const FETCH_TIMEOUT_MS = 15000;
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Sanity fetch timed out after ${FETCH_TIMEOUT_MS}ms`)), FETCH_TIMEOUT_MS);
    });
    let data;
    try {
      data = await Promise.race([client.fetch(query), timeout]);
    } finally {
      clearTimeout(timer);
    }
    console.log(`✅ Fetched ${data.length} items from Sanity.`);

    const STATIC_ROUTES = [
      { url: '', priority: 1.0, changeFrequency: 'daily' },
      { url: '/top-ten', priority: 0.9, changeFrequency: 'daily' },
      { url: '/reviews', priority: 0.9, changeFrequency: 'daily' },
      { url: '/buying-guides', priority: 0.9, changeFrequency: 'weekly' },
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
    const staticRoutePaths = new Set(STATIC_ROUTES.map((route) => route.url));

    // 1. Build Dynamic Routes
    const dynamicRoutes = data.map((item) => {
      let urlPath = '';
      const normalizedSlug = String(item.slug).toLowerCase();

      // Category routing performs an exact slug lookup after middleware
      // lowercases the request. A mixed-case category slug therefore cannot
      // resolve as its own canonical page and must not enter the sitemap.
      if (item._type === 'category' && item.slug !== normalizedSlug) {
        console.warn(`⚠️ Skipped non-canonical category slug: ${item.slug}`);
        return '';
      }

      // FIX 2: Strict Routing Logic
      switch (item._type) {
        case 'category':
          urlPath = `/${normalizedSlug}`;
          if (staticRoutePaths.has(urlPath)) return '';
          break;
        case 'article': 
          // Check for category to route correctly, fallback to reviews
          const cat = item.category || 'reviews';
          if (['how-to-guides', 'guides'].includes(cat)) urlPath = `/how-to-guides/${normalizedSlug}`;
          else if (['travel-tourism', 'travel'].includes(cat)) urlPath = `/travel-tourism/${normalizedSlug}`;
          else urlPath = `/reviews/${normalizedSlug}`;
          break;
          
        case 'product': 
          urlPath = `/reviews/${normalizedSlug}`;
          break;
          
        case 'howTo': 
          urlPath = `/how-to-guides/${normalizedSlug}`;
          break;

        case 'buyerGuide':
          urlPath = `/${item.category || 'reviews'}/${normalizedSlug}`;
          break;
          
        case 'topTenList': 
          urlPath = `/top-ten/${normalizedSlug}`;
          break;
          
        case 'holiday': 
        case 'event':
          urlPath = `/events-holidays/${normalizedSlug}`;
          break;
          
        case 'tool': 
          urlPath = `/finance-tools/${normalizedSlug}`;
          break;

        case 'deal':
          return ''; // Explicitly SKIP deals
          
        default: 
          // FIX 3: Safety Net - If type is unknown, DO NOT generate a root URL.
          // This prevents "https://toptenuae.com/some-random-slug" errors.
          console.warn(`⚠️ Skipped unknown type: ${item._type} (${item.slug})`);
          return ''; 
      }

      return `
  <url>
    <loc>${escapeXml(`${BASE_URL}${urlPath}`)}</loc>
    <lastmod>${new Date(item._updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('');

    // 2. Static routes do not have a reliable content-modified timestamp.
    // Omitting lastmod is more accurate than marking every hub and policy page
    // as changed whenever any unrelated Sanity document is updated.
    const staticXml = STATIC_ROUTES.map(route => `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
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
    // Resilient: a Sanity outage/timeout must NOT block the production deploy.
    // Keep the last-committed public/sitemap.xml as the fallback and continue.
    console.error('⚠️ Sitemap generation failed — keeping last-committed public/sitemap.xml:', error);
    const existing = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml');
    process.exit(fs.existsSync(existing) ? 0 : 1);
  }
}

generateSitemap();
