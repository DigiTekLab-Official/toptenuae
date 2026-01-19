// src/app/sitemap.ts
export const revalidate = 3600; // Revalidate every hour for fresh content

import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// =============================================================================
// CONFIGURATION
// =============================================================================
const BASE_URL = 'https://toptenuae.com';
const CURRENT_DATE = new Date();

// 1. Category normalization (Maps Sanity Categories -> URL Structure)
const normalizeCategory = (slug: string): string => {
  const map: Record<string, string> = {
    'travel-tourism': 'events-holidays',
    'health-fitness': 'lifestyle',
    'baby-kid': 'parenting-kids',
    'buyers-guide': 'reviews',
    'deals': 'deals',
    'tech': 'tech',
    'public-holidays-events': 'events-holidays',
    'how-to-guides': 'smart-home',
  };
  return map[slug] || slug;
};

// 2. Manual URL corrections (CRITICAL: Matches your next.config.ts redirects)
const manualOverrides: Record<string, string> = {
  // Parenting & Kids
  'best-baby-monitors-uae': 'parenting-kids',
  'best-baby-skincare-uae': 'parenting-kids',
  'where-to-donate-used-toys-uae': 'parenting-kids',
  'best-educational-toys-uae': 'parenting-kids',
  'top-10-schools-dubai-2026-khda-fees-reviews': 'parenting-kids',
  
  // Tech
  'samsung-galaxy-s26-ultra-specs-uae-price': 'tech',
  'quantum-computing-guide-uae': 'tech',
  
  // Lifestyle
  'how-to-pay-zakat-in-uae-online': 'lifestyle',
  'charity-organizations-uae-donations': 'lifestyle',
  
  // Smart Home
  'how-to-clean-washing-machine': 'smart-home',

  // Events
  'ramadan-2026-uae': 'events-holidays',
};

// 3. Excluded slugs (Prevents 404s and Dead Links in Sitemap)
const excludedSlugs = new Set([
  'best-baby-skincare-products-uae', // Redirected
  'understanding-deep-seek-ai', // Redirected
  'understanding-deep-seek', // Redirected
  'nasa-astronaut-don-pettit-burj-khalifa-image-from-space', // Irrelevant
  'best-budget-buys-uae-amazon-deals-march-2025', // Old
  'ramadan-shopping-guide', // Redirected
  'lattafa-khamrah-perfume-deal', // Dead deal
  'evvoli-air-fryer-4l-super-saver-deal', // Dead deal
  'samsung-galaxy-s25-ultra-deal-jan-2026', // Dead deal
  'magic-bullet-blender-deal', // Dead deal
  'coodoo-100pcs-magnetic-tiles-deal', // Dead deal
  'sihoo-m18-ergonomic-chair-deal', // Dead deal
]);

// =============================================================================
// PRIORITY CALCULATION (GOOGLE-FRIENDLY)
// =============================================================================
function calculatePriority(post: any): number {
  let priority = 0.6;

  // 1. Content Type Boost
  switch (post._type) {
    case 'topTenList':
      priority = 0.9; // Pillar content (High Value)
      break;
    case 'tool':
      priority = 0.85; // Interactive Tools (High Engagement)
      break;
    case 'holiday':
    case 'event':
      priority = 0.8; // Seasonal relevance
      break;
    case 'product':
      priority = 0.75; // Individual reviews
      break;
    case 'howTo':
      priority = 0.7;
      break;
    case 'deal':
      priority = 0.65; // Time-sensitive
      break;
  }

  // 2. Freshness Boost (Google loves fresh content)
  const updatedDate = new Date(post._updatedAt);
  const daysSinceUpdate = Math.floor(
    (CURRENT_DATE.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceUpdate < 7) priority += 0.1; // Boost very fresh content
  else if (daysSinceUpdate < 30) priority += 0.05;

  // 3. Engagement Boost (if available)
  if (post.reviewCount && post.reviewCount > 100) priority += 0.05;
  if (post.customerRating && post.customerRating >= 4.5) priority += 0.03;

  // Cap at 1.0
  return Math.min(priority, 1.0);
}

// =============================================================================
// CHANGE FREQUENCY LOGIC
// =============================================================================
function getChangeFrequency(post: any): 'daily' | 'weekly' | 'monthly' {
  switch (post._type) {
    case 'deal':
      return 'daily'; // Deals change often
    case 'holiday':
    case 'event':
    case 'topTenList':
      return 'weekly'; // Pillar content updates regularly
    default:
      return 'monthly'; // Static articles
  }
}

// =============================================================================
// MAIN SITEMAP GENERATION
// =============================================================================
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // -------------------------------------------------------------------------
  // A. STATIC CORE PAGES (Your Structure)
  // -------------------------------------------------------------------------
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: CURRENT_DATE,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // High Priority Landing Pages
    {
      url: `${BASE_URL}/ramadan-2026`,
      lastModified: CURRENT_DATE,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/tech`,
      lastModified: CURRENT_DATE,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: CURRENT_DATE,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/parenting-kids`,
      lastModified: CURRENT_DATE,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/events-holidays`,
      lastModified: CURRENT_DATE,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Tools & Category Hubs
    {
      url: `${BASE_URL}/finance-tools`,
      lastModified: CURRENT_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/smart-home`,
      lastModified: CURRENT_DATE,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/lifestyle`,
      lastModified: CURRENT_DATE,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/deals`,
      lastModified: CURRENT_DATE,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    // Legal & Utility Pages (Low Priority)
    {
      url: `${BASE_URL}/about-us`,
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contact-us`,
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date('2025-01-29'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: new Date('2025-12-27'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/affiliate-disclosure`,
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: new Date('2025-01-30'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/cookies-policy`,
      lastModified: new Date('2025-12-27'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // -------------------------------------------------------------------------
  // B. FETCH DYNAMIC CONTENT FROM SANITY
  // -------------------------------------------------------------------------
  // NOTE: seo.noIndex check included in query to filter at source
  const posts = await client.fetch(`
    *[
      _type in ["topTenList", "howTo", "tool", "holiday", "deal", "article", "post", "product", "event", "charity"]
      && defined(slug.current)
      && (seo.noIndex != true)
    ]{
      _type,
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current),
      _updatedAt,
      _createdAt,
      reviewCount,
      customerRating
    }
  `);

  // -------------------------------------------------------------------------
  // C. PROCESS & GENERATE URLS
  // -------------------------------------------------------------------------
  const validPosts = posts.filter(
    (post: any) => post.slug && !excludedSlugs.has(post.slug)
  );

  const postRoutes: MetadataRoute.Sitemap = validPosts.map((post: any) => {
    // 1. Determine Category
    const rawCategory = post.category || 'reviews';
    let finalCategory = normalizeCategory(rawCategory);

    // 2. Apply Manual Override if Exists
    if (manualOverrides[post.slug]) {
      finalCategory = manualOverrides[post.slug];
    }

    // 3. Determine Last Modified Date
    const updatedDate = new Date(post._updatedAt);
    const createdDate = new Date(post._createdAt);
    const lastMod = updatedDate > createdDate ? updatedDate : createdDate;

    return {
      url: `${BASE_URL}/${finalCategory}/${post.slug}`,
      lastModified: lastMod,
      changeFrequency: getChangeFrequency(post),
      priority: calculatePriority(post),
    };
  });

  // -------------------------------------------------------------------------
  // D. SORTING (Boost High Priority + Recent Content)
  // -------------------------------------------------------------------------
  const sortedPostRoutes = postRoutes.sort((a, b) => {
    // Sort by Priority Descending (Highest first)
    if ((b.priority ?? 0) !== (a.priority ?? 0)) {
      return (b.priority ?? 0) - (a.priority ?? 0);
    }
    // Then by Date Descending (Newest first)
    return (
      new Date(b.lastModified ?? 0).getTime() -
      new Date(a.lastModified ?? 0).getTime()
    );
  });

  // -------------------------------------------------------------------------
  // E. FINAL OUTPUT
  // -------------------------------------------------------------------------
  return [...staticRoutes, ...sortedPostRoutes];
}