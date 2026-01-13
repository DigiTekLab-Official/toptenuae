// src/app/sitemap.ts
export const revalidate = 86400; // Cache sitemap for 24 hours

import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

// Map old Sanity categories to Next.js structure
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

// Normalize static URLs (remove trailing slash)
const normalizeStaticRoute = (base: string, route: string) =>
  `${base}${route.replace(/\/$/, '')}`;

// ⚠️ LIST OF DEAD DEALS (Update this manually when you add redirects)
// This is safer than importing next.config.ts which can crash builds.
const redirectedSlugs = [
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
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com').replace(/\/$/, '');
  
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
    url: normalizeStaticRoute(baseUrl, route),
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
    url: `${baseUrl}/${slug}`,
    lastModified: staticLastModified,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 3️⃣ Dynamic Content
  // ✅ FIX: Added 'event' and 'charity' back (missing in your draft)
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

  // Filter out posts that have redirects (Safe Logic)
  const filteredPosts = posts.filter((post: any) => {
    return !redirectedSlugs.includes(post.slug);
  });

  const postRoutes = filteredPosts.map((post: any) => {
    const rawCategory = post.category || 'reviews';
    const categorySlug = normalizeCategory(rawCategory);

    let priority = 0.6;
    let freq: 'daily' | 'weekly' | 'monthly' = 'weekly';

    switch (post._type) {
      case 'topTenList':
        priority = 0.9;
        freq = 'weekly';
        break;
      case 'howTo':
      case 'holiday':
      case 'event': // Added event logic
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
      url: `${baseUrl}/${categorySlug}/${post.slug}`,
      lastModified: updatedDate,
      changeFrequency: freq,
      priority: priority,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}