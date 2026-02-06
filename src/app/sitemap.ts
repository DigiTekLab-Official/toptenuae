import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// GOOGLE SITEMAP PROTOCOL COMPLIANCE (2026):
// 1. Structure: Compliant with <urlset> namespace standard.
// 2. Optimization: Removed <priority> and <changefreq> (Ignored by Google).
// 3. Encoding: UTF-8 enforced by Next.js.

export const revalidate = 3600;

const BASE_URL = 'https://toptenuae.com';
const CURRENT_DATE = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/top-ten`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/how-to-guides`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/reviews`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/deals`, lastModified: CURRENT_DATE }, // ✅ Main Deals page stays
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
    // ✅ FIX: Removed "deal" from the list below.
    // This ensures NO individual /deals/slug pages are generated in the sitemap.
    const posts = await client.fetch(`
      *[
        _type in ["topTenList", "article", "howTo", "tool", "holiday", "product", "event"]
        && defined(slug.current)
        && (seo.noIndex != true)
      ]{
        _type,
        "slug": slug.current,
        _updatedAt,
        "category": coalesce(categories[0]->slug.current, category->slug.current)
      }
    `);

    // 3. Generate Dynamic Routes
    const postRoutes = posts.map((post: any) => {
      const category = post.category || '';
      let folder = '/reviews'; // Default Fallback

      // A. Finance Tools
      if (post._type === 'tool' || ['finance-tools', 'tools'].includes(category)) {
        folder = '/finance-tools';
      }
      
      // B. How-To Guides
      else if (
        post._type === 'howTo' || 
        ['how-to-guides', 'guides', 'how-to', 'education'].includes(category)
      ) {
        folder = '/how-to-guides';
      }

      // C. Events & Holidays
      else if (
        post._type === 'holiday' || 
        post._type === 'event' || 
        ['events-holidays', 'events', 'holidays', 'ramadan'].includes(category)
      ) {
        folder = '/events-holidays';
      }

      // D. Travel
      else if (['travel-tourism', 'travel', 'tourism'].includes(category)) {
        folder = '/travel-tourism';
      }

      // E. Deals (REMOVED) - We do not want individual deal pages indexed.
      
      // F. Top Ten Lists
      else if (post._type === 'topTenList') {
        folder = '/top-ten';
      }

      return {
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