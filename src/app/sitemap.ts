// src/app/sitemap.ts
export const revalidate = 86400; // Cache sitemap for 24 hours

import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// -----------------------------------------------------------------------------
// HELPERS & CONFIG
// -----------------------------------------------------------------------------
const BASE_URL = 'https://toptenuae.com';

// 1. Map old Sanity categories to Next.js structure
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

// 2. ⚠️ MANUAL OVERRIDES (CRITICAL FIX)
const manualOverrides: Record<string, string> = {
  // Parenting Fixes (HIGHEST PRIORITY - Fixes "Redirect Error")
  'best-baby-monitors-uae': 'parenting-kids',
  'best-baby-skincare-uae': 'parenting-kids',
  '10-best-baby-skin-care-products-in-the-uae-for-2025': 'parenting-kids',
  'where-to-donate-used-toys-uae': 'parenting-kids',
  'best-educational-toys-uae': 'parenting-kids',
  'best-diaper-bags-uae': 'parenting-kids',
  'best-baby-white-noise-machines': 'parenting-kids',
  'top-10-schools-dubai-2026-khda-fees-reviews': 'parenting-kids',
  
  // Tech/Reviews Fixes
  'samsung-galaxy-s26-ultra-specs-uae-price': 'tech',
  'quantum-computing-guide-uae': 'tech',
  'quantum-computing-strategy-uae-2026': 'tech',
  'gmail-gemini-ai-features-2026': 'tech',
  'deepseek-ai-startup-disrupting-big-tech-with-innovation': 'tech',
  'deepseek-ai-revolutionary-data-retrieval-method': 'tech',
  'how-to-use-deepseek-ai-data-extraction-analysis': 'tech',
  'state-of-ai-december-2025-uae-report': 'tech',
  
  // Holiday Fixes
  'uae-holidays-2026': 'events-holidays',
  'eid-al-fitr-uae-prayer-timings-free-events': 'events-holidays',
  'eid-holidays-uae-2026-best-places-to-visit': 'events-holidays',
  'ramadan-2026-uae': 'events-holidays',
  'world-safest-airlines-2026': 'events-holidays',
  
  // Lifestyle/Finance
  'how-to-pay-zakat-in-uae-online': 'lifestyle',
  'charity-organizations-uae-donations': 'lifestyle',
  
  // Smart Home
  'how-to-clean-washing-machine': 'smart-home',
};

// 3. ⚠️ DEAD DEALS - COMPLETELY EXCLUDE FROM SITEMAP
const deadDealSlugs = [
  'lattafa-khamrah-perfume-deal',
  'evvoli-air-fryer-4l-super-saver-deal',
  'samsung-galaxy-s25-ultra-deal-jan-2026',
  'magic-bullet-blender-deal',
  'coodoo-100pcs-magnetic-tiles-deal',
  'sihoo-m18-ergonomic-chair-deal',
];

// 4. ⚠️ LEGACY/BROKEN CONTENT - EXCLUDE FROM SITEMAP
const excludedSlugs = [
  'best-baby-skincare-products-uae', // Redirects to best-baby-skincare-uae
  'understanding-deep-seek-ai', // Redirects to deepseek article
  'understanding-deep-seek', // Redirects to deepseek article
  'nasa-astronaut-don-pettit-burj-khalifa-image-from-space', // Deleted
  'best-budget-buys-uae-amazon-deals-march-2025', // Expired deal
  'ramadan-shopping-guide', // Redirects to ramadan-2026-uae
  'best-baby-toys', // Redirect to category
  'best-diaper-bags-in-uae', // Redirect to category
  'best-beauty-personal-care-products-uae', // 404
  'best-beauty-products-uae', // 404
  'best-eid-holiday-travel-destinations-uae', // 404
];

// -----------------------------------------------------------------------------
// SITEMAP GENERATION
// -----------------------------------------------------------------------------
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // ✅ Use current date for static routes (ensures Google sees them as fresh)
  const now = new Date();
  
  // 1️⃣ Static Core Pages
  const staticRoutes = [
    { path: '', priority: 1.0, freq: 'daily' as const },
    { path: '/ramadan-2026', priority: 0.9, freq: 'daily' as const },
    { path: '/about-us', priority: 0.4, freq: 'monthly' as const },
    { path: '/contact-us', priority: 0.4, freq: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.3, freq: 'yearly' as const },
    { path: '/terms-and-conditions', priority: 0.3, freq: 'yearly' as const },
    { path: '/affiliate-disclosure', priority: 0.3, freq: 'yearly' as const },
    { path: '/disclaimer', priority: 0.3, freq: 'yearly' as const },
    { path: '/cookies-policy', priority: 0.3, freq: 'yearly' as const },
  ].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.freq,
    priority: route.priority,
  }));

  // 2️⃣ Category Hub Pages (CRITICAL for product review crawling)
  const categorySlugs = [
    { slug: 'tech', priority: 0.9 },
    { slug: 'reviews', priority: 0.9 }, // Boost priority - helps Google crawl child pages
    { slug: 'parenting-kids', priority: 0.8 },
    { slug: 'events-holidays', priority: 0.8 },
    { slug: 'finance-tools', priority: 0.7 },
    { slug: 'smart-home', priority: 0.7 },
    { slug: 'lifestyle', priority: 0.7 },
    { slug: 'deals', priority: 0.7 },
  ];

  const categoryRoutes = categorySlugs.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: cat.priority,
  }));

  // 3️⃣ Dynamic Content from Sanity
  const posts = await client.fetch(`
    *[
      _type in ["topTenList", "howTo", "tool", "holiday", "deal", "article", "post", "product", "event", "charity"]
      && defined(slug.current)
    ]{
      _type,
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current),
      _updatedAt,
      _createdAt
    }
  `);

  // 4️⃣ Filter out Dead Deals & Excluded Content
  const filteredPosts = posts.filter((post: any) => {
    return !deadDealSlugs.includes(post.slug) && !excludedSlugs.includes(post.slug);
  });

  // 5️⃣ Generate Post Routes
  const postRoutes = filteredPosts.map((post: any) => {
    
    // --- CATEGORY LOGIC ---
    const rawCategory = post.category || 'reviews';
    let finalCategory = normalizeCategory(rawCategory);
    
    // Apply manual overrides (fixes redirect errors)
    if (manualOverrides[post.slug]) {
      finalCategory = manualOverrides[post.slug];
    }

    // --- PRIORITY & FREQUENCY LOGIC ---
    let priority = 0.6;
    let freq: 'daily' | 'weekly' | 'monthly' = 'weekly';

    switch (post._type) {
      case 'topTenList':
        priority = 0.85; // Boost - these are pillar content
        freq = 'weekly';
        break;
      case 'howTo':
      case 'holiday':
      case 'event':
        priority = 0.75;
        freq = 'monthly';
        break;
      case 'tool':
        priority = 0.7;
        freq = 'monthly';
        break;
      case 'deal':
        priority = 0.6;
        freq = 'daily';
        break;
      case 'product': // Individual product reviews
        priority = 0.7; // Boost from 0.6 to help Google discover them
        freq = 'monthly';
        break;
      default:
        priority = 0.6;
        freq = 'weekly';
    }

    // --- FRESHNESS BOOST ---
    // Posts updated in last 30 days get priority boost
    const updatedDate = new Date(post._updatedAt);
    const createdDate = new Date(post._createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (updatedDate > thirtyDaysAgo) {
      priority = Math.min(priority + 0.1, 1.0);
    }

    // --- NEW CONTENT BOOST ---
    // Brand new content (< 7 days old) gets maximum priority
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    if (createdDate > sevenDaysAgo) {
      priority = Math.min(priority + 0.15, 1.0);
    }

    return {
      url: `${BASE_URL}/${finalCategory}/${post.slug}`,
      lastModified: updatedDate,
      changeFrequency: freq,
      priority: priority,
    };
  });

  // 6️⃣ SORT BY PRIORITY (High priority URLs first)
  // This helps Google discover important pages faster
  const sortedPostRoutes = postRoutes.sort((a: MetadataRoute.Sitemap[number], b: MetadataRoute.Sitemap[number]) => {
    if (b.priority !== a.priority) {
      return (b.priority ?? 0.5) - (a.priority ?? 0.5);
    }
    // If same priority, newest first
    return new Date(b.lastModified ?? 0).getTime() - new Date(a.lastModified ?? 0).getTime();
  });

  return [...staticRoutes, ...categoryRoutes, ...sortedPostRoutes];
}