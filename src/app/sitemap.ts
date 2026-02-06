import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

// =====================================================================
// CONSTANTS & CONFIG
// =====================================================================
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';

// 1. Static Routes (Core Pages)
const STATIC_ROUTES = [
  { url: '', priority: 1.0, changeFrequency: 'daily' },
  { url: '/top-ten', priority: 0.9, changeFrequency: 'daily' },
  { url: '/reviews', priority: 0.9, changeFrequency: 'daily' },
  { url: '/how-to-guides', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/deals', priority: 0.9, changeFrequency: 'hourly' }, // Deals update often
  { url: '/finance-tools', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/events-holidays', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/travel-tourism', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/ramadan-2026', priority: 0.8, changeFrequency: 'weekly' },
  // Legal & Info Pages (Lower Priority)
  { url: '/about-us', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/contact-us', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/terms-and-conditions', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/affiliate-disclosure', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/cookies-policy', priority: 0.3, changeFrequency: 'yearly' },
];

// =====================================================================
// DATA FETCHING
// =====================================================================
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use current date as fallback, but prefer actual article dates
  const fallbackDate = new Date();

  // Fetch all dynamic slugs from Sanity
  // We fetch _updatedAt to give Google precise modification times
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
    const data = await client.fetch(query);

    dynamicRoutes = data.map((item: any) => {
      let path = '';

      // Logic to match your App Router structure
      switch (item._type) {
        case 'article':
          // Articles live under their category or default to 'reviews' if missing
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
        priority: item._type === 'topTenList' ? 0.8 : 0.7, // Top Ten lists are high value
      };
    });

  } catch (error) {
    console.error('❌ Sitemap Error: Failed to fetch Sanity paths', error);
    // Continue with just static routes if Sanity fails
  }

  // =====================================================================
  // MERGE STATIC & DYNAMIC
  // =====================================================================
  const staticMap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: fallbackDate,
    changeFrequency: route.changeFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always' | 'hourly' | 'never',
    priority: route.priority,
  }));

  return [...staticMap, ...dynamicRoutes];
}