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
  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/top-ten`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/how-to-guides`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/reviews`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/deals`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/finance-tools`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/events-holidays`, lastModified: CURRENT_DATE },
    { url: `${BASE_URL}/travel-tourism`, lastModified: CURRENT_DATE },
    
    // ✅ SUPER PAGE: This is your main Ramadan landing page
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
    // ✅ FIX 1: Exclude the old 'ramadan-2026-uae' slug to prevent duplicate/redirected URLs
    // ✅ FIX 2: Added strict active check for deals
    const posts = await client.fetch(`
      *[
        _type in ["topTenList", "howTo", "tool", "holiday", "deal", "product", "event"]
        && defined(slug.current)
        && (seo.noIndex != true)
        && !(_type == "deal" && isActive == false)
        && slug.current != "ramadan-2026-uae" 
      ]{
        _type,
        "slug": slug.current,
        _updatedAt,
        "category": categories[0]->slug.current
      }
    `);

    // 3. Generate Dynamic Routes
    const postRoutes = posts.map((post: any) => {
      let folder = '/reviews'; // Default fallback

      // --- AUTOMATED LOGIC ---
      
      // 1. Strict Schema Types
      if (post._type === 'deal') {
        folder = '/deals';
      }
      else if (post._type === 'product') {
        folder = '/reviews';
      }
      
      // 2. Category Logic
      else if (['how-to-guides', 'guides'].includes(post.category)) {
        folder = '/how-to-guides';
      } else if (['top-ten', 'top-lists'].includes(post.category)) {
        folder = '/top-ten';
      } else if (['deals', 'hot-deals', 'offers'].includes(post.category)) {
        folder = '/deals';
      } else if (['reviews', 'product-reviews', 'buyers-guide'].includes(post.category)) {
        folder = '/reviews';
      } 
      
      // ✅ RE-ADDED: Travel Logic (Critical for Visa/Hotels posts)
      else if (['travel-tourism', 'travel', 'tourism'].includes(post.category)) {
        // If it's a "Top 10" list (e.g. Airlines), keep in Top Ten.
        // Otherwise (e.g. Visa Rules), put in Travel.
        if (post._type === 'topTenList') {
          folder = '/top-ten';
        } else {
          folder = '/travel-tourism';
        }
      }

      // 3. Fallback by Type
      else {
        switch (post._type) {
          case 'topTenList': folder = '/top-ten'; break;
          case 'howTo': folder = '/how-to-guides'; break;
          case 'holiday':
          case 'event': folder = '/events-holidays'; break;
          case 'tool': folder = '/finance-tools'; break;
          case 'deal': folder = '/deals'; break;
          case 'product': folder = '/reviews'; break; 
        }
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