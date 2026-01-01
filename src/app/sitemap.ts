// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_baseUrl || 'https://toptenuae.com').replace(/\/$/, '');

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
  // Fetch slug AND category to build the correct NEW URL: /category/slug
  const posts = await client.fetch(`
    *[_type in ["topTenList", "howTo", "tool", "holiday", "deal", "article"] && defined(slug.current)] {
      "slug": slug.current,
      "category": category->slug.current,
      _updatedAt
    }
  `);

  const postRoutes = posts.map((post: any) => {
    // If a post doesn't have a category in Sanity, we skip it to avoid broken links
    if (!post.category) return null;

    return {
      url: `${baseUrl}/${post.category}/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  }).filter((route: any) => route !== null);

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}