// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// GOOGLE SITEMAP PROTOCOL COMPLIANCE (2026):
// 1. Structure: Compliant with <urlset> namespace standard.
// 2. Optimization: Removed <priority> and <changefreq> (Ignored by Google).
// 3. Encoding: UTF-8 enforced by Next.js.
// 4. Escaping: URLs are auto-escaped by Next.js internals.

export const revalidate = 3600;

const BASE_URL = 'https://toptenuae.com';
const CURRENT_DATE = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages (NO TRAILING SLASHES)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: CURRENT_DATE }, // Root is exception
    { url: `${BASE_URL}/top-ten`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/how-to-guides`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/reviews`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/deals`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/finance-tools`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/events-holidays`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/travel-tourism`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/ramadan-2026`, lastModified: CURRENT_DATE },
    
    // Core & Legal Pages
    { url: `${BASE_URL}/about-us`, lastModified: new Date('2025-01-15') },
    { url: `${BASE_URL}/contact-us`, lastModified: new Date('2025-01-15') },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date('2025-01-29') },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date('2025-12-27') },
    { url: `${BASE_URL}/affiliate-disclosure`, lastModified: new Date('2025-01-15') },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date('2025-01-15') },
    { url: `${BASE_URL}/cookies-policy`, lastModified: new Date('2025-12-27') },
  ];

  try {
    // 2. Fetch Dynamic Data
    const posts = await client.fetch(`
      *[
        _type in ["topTenList", "article", "howTo", "tool", "holiday", "deal", "product", "event"]
        && defined(slug.current)
        && (seo.noIndex != true)
        && !(_type == "deal" && isActive == false)
        && slug.current != "ramadan-2026-uae" 
      ]{
        _type,
        "slug": slug.current,
        _updatedAt,
        "category": coalesce(categories[0]->slug.current, category->slug.current)
      }
    `);

    // 3. Generate Dynamic Routes (NO TRAILING SLASHES)
    const postRoutes = posts.map((post: any) => {
      let folder = '/reviews'; // Default fallback

      // --- SIMPLIFIED TYPE-FIRST LOGIC ---
      switch (post._type) {
        case 'tool':
          folder = '/finance-tools';
          break;
        case 'topTenList':
          folder = '/top-ten';
          break;
        case 'howTo':
          folder = '/how-to-guides';
          break;
        case 'article':
          if (['how-to-guides', 'guides'].includes(post.category)) {
            folder = '/how-to-guides';
          } else if (['travel-tourism', 'travel', 'tourism'].includes(post.category)) {
            folder = '/travel-tourism';
          } else if (['events-holidays', 'events', 'holidays'].includes(post.category)) {
            folder = '/events-holidays';
          } else {
            folder = '/reviews';
          }
          break;
        case 'holiday':
        case 'event':
          folder = '/events-holidays';
          break;
        case 'deal':
          folder = '/deals';
          break;
        case 'product':
          folder = '/reviews';
          break;
        default:
          if (['travel-tourism', 'travel', 'tourism'].includes(post.category)) {
            folder = '/travel-tourism';
          } else if (['events-holidays', 'events', 'holidays'].includes(post.category)) {
            folder = '/events-holidays';
          } else {
            folder = '/reviews';
          }
      }

      return {
        // ✅ CORRECT: No trailing slash
        url: `${BASE_URL}${folder}/${post.slug}`,
        lastModified: new Date(post._updatedAt),
      };
    });

    return [...staticRoutes, ...postRoutes];
    
  } catch (error) {
    console.error("⚠️ Sitemap Error:", error);
    return staticRoutes;
  }
}