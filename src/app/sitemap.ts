// src/app/sitemap.ts
export const revalidate = 86400; // Cache sitemap for 24 hours

import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// -----------------------------------------------------------------------------
// HELPERS & CONFIG
// -----------------------------------------------------------------------------

const BASE_URL = 'https://toptenuae.com';

// 1. Map old Sanity categories to Next.js structure
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

// 2. ⚠️ MANUAL OVERRIDES (CRITICAL FIX)
// These are posts that exist in Sanity as 'reviews' or other categories
// but MUST be forced to a specific URL to match your next.config.ts Redirects.
// This fixes the "Redirect Error" and "Discovered - Not Indexed" issues.
const manualOverrides: Record<string, string> = {
  // Parenting Fixes
  'best-baby-monitors-uae': 'parenting-kids',
  'best-baby-skincare-uae': 'parenting-kids',
  '10-best-baby-skin-care-products-in-the-uae-for-2025': 'parenting-kids',
  'where-to-donate-used-toys-uae': 'parenting-kids',
  'best-educational-toys-uae': 'parenting-kids',
  'best-diaper-bags-uae': 'parenting-kids',
  'best-baby-white-noise-machines': 'parenting-kids',
  
  // Tech/Reviews Fixes
  'samsung-galaxy-s26-ultra-specs-uae-price': 'tech',
  'quantum-computing-guide-uae': 'tech',
  
  // Holiday Fixes
  'uae-holidays-2026': 'events-holidays',
  'eid-al-fitr-uae-prayer-timings-free-events': 'events-holidays',
  'ramadan-2026-uae': 'events-holidays',
};

// 3. ⚠️ DEAD DEALS (Exclude these from Sitemap)
// These URLs are broken or redirected to home, so we hide them from Google.
const deadDealSlugs = [
  'lattafa-khamrah-perfume-deal',
  'evvoli-air-fryer-4l-super-saver-deal',
  'samsung-galaxy-s25-ultra-deal-jan-2026',
  'magic-bullet-blender-deal',
  'coodoo-100pcs-magnetic-tiles-deal',
  'sihoo-m18-ergonomic-chair-deal',
];

// -----------------------------------------------------------------------------
// SITEMAP GENERATION
// -----------------------------------------------------------------------------
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // ✅ FIX: Use current date for static routes so Google sees them as fresh
  const staticLastModified = new Date(); 

  // 1️⃣ Static Core Pages
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
    url: `${BASE_URL}${route}`,
    lastModified: staticLastModified,
    changeFrequency: route === '/ramadan-2026' ? 'daily' as const : 'monthly' as const,
    priority: route === '/ramadan-2026' ? 1.0 : route === '' ? 1.0 : 0.4,
  }));

  // 2️⃣ Category Hub Pages
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
    url: `${BASE_URL}/${slug}`,
    lastModified: staticLastModified,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 3️⃣ Dynamic Content
  // Fetch everything including 'event' and 'charity'
  const posts = await client.fetch(`
    *[
      _type in ["topTenList", "howTo", "tool", "holiday", "deal", "article", "post", "product", "event", "charity"]
      && defined(slug.current)
    ]{
      _type,
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current),
      _updatedAt
    }
  `);

  // Filter out Dead Deals
  const filteredPosts = posts.filter((post: any) => {
    return !deadDealSlugs.includes(post.slug);
  });

  const postRoutes = filteredPosts.map((post: any) => {
    
    // --- CATEGORY LOGIC START ---
    const rawCategory = post.category || 'reviews';
    let finalCategory = normalizeCategory(rawCategory);

    // ✅ APPLY MANUAL OVERRIDES
    // If this post is in our "Problem List", force the correct category
    if (manualOverrides[post.slug]) {
      finalCategory = manualOverrides[post.slug];
    }
    // --- CATEGORY LOGIC END ---

    let priority = 0.6;
    let freq: 'daily' | 'weekly' | 'monthly' = 'weekly';

    switch (post._type) {
      case 'topTenList':
        priority = 0.9;
        freq = 'weekly';
        break;
      case 'howTo':
      case 'holiday':
      case 'event': 
        priority = 0.7;
        freq = 'monthly';
        break;
      case 'tool':
      case 'deal':
        priority = 0.6;
        freq = 'daily';
        break;
      default:
        priority = 0.6;
    }

    // Boost priority for recently updated posts
    const updatedDate = new Date(post._updatedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (updatedDate > thirtyDaysAgo) {
      priority = Math.min(priority + 0.1, 1.0);
    }

    return {
      url: `${BASE_URL}/${finalCategory}/${post.slug}`,
      lastModified: updatedDate,
      changeFrequency: freq,
      priority: priority,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}