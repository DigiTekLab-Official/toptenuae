// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

const BASE_URL = 'https://toptenuae.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch all your dynamic content
  const query = groq`*[_type in ["article", "product", "deal", "howTo", "topTenList"] && defined(slug.current)] {
    _type,
    "slug": slug.current,
    _updatedAt,
    "category": category->slug.current
  }`;

  const data = await client.fetch(query);

  const dynamicRoutes = data.map((item: any) => {
    let path = '';
    switch (item._type) {
      case 'article': path = `/${item.category || 'reviews'}/${item.slug}`; break;
      case 'product': path = `/reviews/${item.slug}`; break;
      case 'deal': path = `/deals/${item.slug}`; break;
      case 'howTo': path = `/how-to-guides/${item.slug}`; break;
      case 'topTenList': path = `/top-ten/${item.slug}`; break;
      default: path = `/${item.slug}`;
    }

    return {
      url: `${BASE_URL}${path}`,
      lastModified: item._updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  // 2. Define your static routes
  const staticRoutes = [
    '',
    '/top-ten',
    '/reviews',
    '/how-to-guides',
    '/deals',
    '/finance-tools',
    '/events-holidays',
    '/travel-tourism',
    '/ramadan-2026',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 1.0,
  }));

  // 3. Combine them
  return [...staticRoutes, ...dynamicRoutes];
}