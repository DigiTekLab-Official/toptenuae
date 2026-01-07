import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// Helper to map old Sanity categories to your new Next.js structure
// This ensures the sitemap points to the FINAL URL, not a redirect.
const normalizeCategory = (slug: string) => {
  const map: Record<string, string> = {
    'travel-tourism': 'events-holidays',
    'health-fitness': 'lifestyle',
    'baby-kid': 'parenting-kids',
    'buyers-guide': 'reviews',
    'deals': 'deals', // ensure these exist
    'tech': 'tech',
  };
  return map[slug] || slug;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ensure no trailing slash in base URL
  const baseUrl = (process.env.baseUrl || 'https://toptenuae.com').replace(/\/$/, '');

  // 🔹 1. Static Core Pages
  // FIX: Removed logic for adding trailing slashes to match trailingSlash: false
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
    url: `${baseUrl}${route}`, // ✅ No slash at end
    lastModified: new Date(),
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
    url: `${baseUrl}/${slug}`, // ✅ No slash at end
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8, // High priority (Hubs)
  }));

  // 🔹 3. Dynamic Content (Posts, Tools, Deals)
  // Fetching all content types
  const posts = await client.fetch(`
    *[
      _type in ["topTenList", "howTo", "tool", "holiday", "deal", "article", "post", "product"]
      && defined(slug.current)
    ]{
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current),
      _updatedAt
    }
  `);

  const postRoutes = posts.map((post: any) => {
    // 1. Get raw category from Sanity
    const rawCategory = post.category || 'reviews';
    
    // 2. Normalize it (fix old categories like 'travel-tourism' -> 'events-holidays')
    const categorySlug = normalizeCategory(rawCategory);

    return {
      url: `${baseUrl}/${categorySlug}/${post.slug}`, // ✅ No slash at end
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9, 
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}