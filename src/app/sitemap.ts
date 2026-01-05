// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ensure no trailing slash in base URL to avoid double slashes at the start
  const baseUrl = (process.env.baseUrl || 'https://toptenuae.com').replace(/\/$/, '');

  // 🔹 1. Static Core Pages
  // STRATEGY: I removed '/thank-you' because we do NOT want Google to index that page.
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
    // ✅ Note: It will automatically get the trailing slash: /ramadan-2026/
    url: `${baseUrl}${route}/`, 
    lastModified: new Date(),
    changeFrequency: route === '/ramadan-2026' ? 'daily' as const : 'monthly' as const,
    priority: route === '/ramadan-2026' ? 1.0 : (route === '' ? 1.0 : 0.4), // 🌟 Give it max priority
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
    // ✅ FIX: Added trailing slash
    url: `${baseUrl}/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8, // High priority (Hubs)
  }));

  // 🔹 3. Dynamic Content (Posts, Tools, Deals)
  const posts = await client.fetch(`
    *[
      _type in ["topTenList", "howTo", "tool", "holiday", "deal", "article", "post"]
      && defined(slug.current)
    ]{
      "slug": slug.current,
      "category": categories[0]->slug.current,
      _updatedAt
    }
  `);

  const postRoutes = posts.map((post: any) => {
    // STRATEGY: "reviews" is a better fallback keyword than "uncategorized".
    // It keeps the URL looking authoritative even if a category is missing.
    const categorySlug = post.category || 'reviews';

    return {
      // ✅ FIX: Added trailing slash
      url: `${baseUrl}/${categorySlug}/${post.slug}/`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Very High priority (This is your money content)
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}