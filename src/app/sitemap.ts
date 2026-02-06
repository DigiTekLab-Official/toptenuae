// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

// ✅ FORCE DYNAMIC: Tells Next.js to generate this on every request (Worker)
// instead of looking for a static file that might be missing.
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; 

const BASE_URL = 'https://toptenuae.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all dynamic content
    const query = groq`*[_type in ["article", "product", "deal", "howTo", "topTenList"] && defined(slug.current)] {
      _type,
      "slug": slug.current,
      _updatedAt,
      "category": category->slug.current
    }`;

    const data = await client.fetch(query);

    const dynamicRoutes: MetadataRoute.Sitemap = data.map((item: any) => {
      let path = '';
      switch (item._type) {
        case 'article': 
          path = `/${item.category || 'reviews'}/${item.slug}`; 
          break;
        case 'product': 
          path = `/reviews/${item.slug}`; 
          break;
        case 'deal': 
          path = `/deals/${item.slug}`; 
          break;
        case 'howTo': 
          path = `/how-to-guides/${item.slug}`; 
          break;
        case 'topTenList': 
          path = `/top-ten/${item.slug}`; 
          break;
        default: 
          path = `/${item.slug}`;
      }

      return {
        url: `${BASE_URL}${path}`,
        lastModified: new Date(item._updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      { route: '', priority: 1.0, changeFrequency: 'daily' as const },
      { route: '/top-ten', priority: 0.9, changeFrequency: 'daily' as const },
      { route: '/reviews', priority: 0.9, changeFrequency: 'daily' as const },
      { route: '/how-to-guides', priority: 0.9, changeFrequency: 'weekly' as const },
      { route: '/deals', priority: 0.9, changeFrequency: 'daily' as const },
      { route: '/finance-tools', priority: 0.7, changeFrequency: 'weekly' as const },
      { route: '/events-holidays', priority: 0.7, changeFrequency: 'weekly' as const },
      { route: '/travel-tourism', priority: 0.7, changeFrequency: 'weekly' as const },
      { route: '/ramadan-2026', priority: 0.8, changeFrequency: 'weekly' as const },
      { route: '/about-us', priority: 0.5, changeFrequency: 'monthly' as const },
      { route: '/contact-us', priority: 0.5, changeFrequency: 'monthly' as const },
      { route: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
    ].map((item) => ({
      url: `${BASE_URL}${item.route}`,
      lastModified: new Date(),
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // Return at least the homepage if fetch fails
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ];
  }
}