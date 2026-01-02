// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.baseUrl || 'https://toptenuae.com').replace(/\/$/, '');

  // 1. Static Routes (Core Pages)
  const staticRoutes = [
    '', // Homepage
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/terms-and-conditions',
    '/affiliate-disclosure',
    '/disclaimer',
    '/cookies-policy',
    '/thank-you',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'monthly' as const,
    priority: route === '' ? 1.0 : 0.5,
  }));

  // 2. Categories (The Hubs)
  const categorySlugs = [
    'tech', 
    'reviews', 
    'finance-tools', 
    'events-holidays', 
    'parenting-kids', 
    'smart-home', 
    'deals', 
    'lifestyle'
  ];

  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 3. Dynamic Posts (Articles, Tools, Deals)
  // ✅ FIX 1: Added "post" to the list of types to ensure we catch standard blog posts
  // ✅ FIX 2: Changed "category" to "categories[0]" to match your schema (Arrays)
  const posts = await client.fetch(`
    *[_type in ["topTenList", "howTo", "tool", "holiday", "deal", "article", "post"] && defined(slug.current)] {
      "slug": slug.current,
      "category": categories[0]->slug.current,
      _updatedAt
    }
  `);

  const postRoutes = posts.map((post: any) => {
    // Safety Check: If category is missing, fallback to 'reviews' or log it
    // This prevents pages from disappearing if they have no category assigned
    const categorySlug = post.category || 'reviews'; 

    return {
      url: `${baseUrl}/${categorySlug}/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}