import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

// =====================================================================
// 1. CONFIGURATION
// =====================================================================
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';

// 2. Static Routes
const STATIC_ROUTES = [
  { url: '', priority: 1.0, changeFrequency: 'daily' },
  { url: '/top-ten', priority: 0.9, changeFrequency: 'daily' },
  { url: '/reviews', priority: 0.9, changeFrequency: 'daily' },
  { url: '/how-to-guides', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/deals', priority: 0.9, changeFrequency: 'hourly' }, 
  { url: '/finance-tools', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/events-holidays', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/travel-tourism', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/ramadan-2026', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/about-us', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/contact-us', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/terms-and-conditions', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/affiliate-disclosure', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/cookies-policy', priority: 0.3, changeFrequency: 'yearly' },
];

// =====================================================================
// 3. SITEMAP GENERATION
// =====================================================================
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fallbackDate = new Date();

  const query = groq`{
    "articles": *[_type in ["article", "product", "deal", "howTo", "topTenList"] && defined(slug.current)] {
      _type,
      "slug": slug.current,
      _updatedAt,
      "category": category->slug.current
    }
  }`;

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const response = await client.fetch(query);
    
    // ✅ SAFETY CHECK: Extract the array correctly
    // Sometimes the query returns { articles: [...] } instead of just [...]
    const data = Array.isArray(response) ? response : (response.articles || []);

    if (Array.isArray(data)) {
      dynamicRoutes = data.map((item: any) => {
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
          lastModified: new Date(item._updatedAt || fallbackDate),
          changeFrequency: item._type === 'deal' ? 'daily' : 'weekly',
          priority: item._type === 'topTenList' ? 0.8 : 0.7,
        };
      });
    } else {
        console.error('❌ Sitemap Error: Data is not an array:', data);
    }

  } catch (error) {
    console.error('❌ Sitemap Error: Failed to fetch Sanity paths', error);
  }

  const staticMap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: fallbackDate,
    changeFrequency: route.changeFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'hourly',
    priority: route.priority,
  }));

  return [...staticMap, ...dynamicRoutes];
}