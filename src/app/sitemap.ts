// src/app/sitemap.ts

// 1. CRITICAL: Cache the sitemap itself for 24 hours
// This prevents the sitemap from regenerating on every single visit.
export const revalidate = 86400; 

import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// Helper to map old Sanity categories to your new Next.js structure
const normalizeCategory = (slug: string) => {
  const map: Record<string, string> = {
    'travel-tourism': 'events-holidays',
    'health-fitness': 'lifestyle',
    'baby-kid': 'parenting-kids',
    'buyers-guide': 'reviews',
    'deals': 'deals',
    'tech': 'tech',
  };
  return map[slug] || slug;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ensure no trailing slash in base URL
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com').replace(/\/$/, '');
  
  // 2. STABILITY FIX: Use a fixed date for static pages instead of new Date()
  // This prevents Google from thinking your "About Us" page changes every second.
  // Update this date manually only when you make major structural changes.
  const staticLastModified = new Date('2025-01-01');

  // 🔹 1. Static Core Pages
  const staticRoutes = [
    '', // Homepage
    '/ramadan-2026',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/terms-and-conditions',
    '/affiliate-disclosure',
    '/disclaimer',
    '/cookies-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticLastModified,
    changeFrequency: route === '/ramadan-2026' ? 'daily' as const : 'monthly' as const,
    priority: route === '/ramadan-2026' ? 1.0 : (route === '' ? 1.0 : 0.4),
  }));

  // 🔹 2. Category Hub Pages
  const categorySlugs = [
    'tech',
    'reviews',
    'finance-tools',
    'events-holidays',
    'parenting-kids',
    'smart-home',
    'deals',
    'lifestyle',
  ];

  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: staticLastModified, // Kept stable to prevent crawl churn
    changeFrequency: 'daily' as const,
    priority: 0.8, // High priority (Hubs)
  }));

  // 🔹 3. Dynamic Content (Posts, Tools, Deals)
  // We fetch everything but assign different priorities based on value
  const posts = await client.fetch(`
    *[
      _type in ["topTenList", "howTo", "tool", "holiday", "deal", "article", "post", "product"]
      && defined(slug.current)
    ]{
      _type,
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current),
      _updatedAt
    }
  `);

  const postRoutes = posts.map((post: any) => {
    // 1. Get raw category and normalize it
    const rawCategory = post.category || 'reviews';
    const categorySlug = normalizeCategory(rawCategory);

    // 3. PRIORITY TIERING (SEO Best Practice)
    // Give higher priority to your "Money Pages" (Reviews) and lower to Tools/Deals
    let priority = 0.6; // Default
    let freq: 'daily' | 'weekly' | 'monthly' = 'weekly';

    switch (post._type) {
        case 'topTenList': // High Value
            priority = 0.9;
            freq = 'weekly';
            break;
        case 'howTo':      // High Value (Evergreen)
        case 'holiday':    // Seasonal
            priority = 0.7;
            freq = 'monthly';
            break;
        case 'tool':       // Functional
        case 'deal':       // Time-sensitive
            priority = 0.6;
            freq = 'daily';
            break;
        default:
            priority = 0.6;
    }

    return {
      url: `${baseUrl}/${categorySlug}/${post.slug}`,
      lastModified: new Date(post._updatedAt), // Real update time from Sanity
      changeFrequency: freq,
      priority: priority, 
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}