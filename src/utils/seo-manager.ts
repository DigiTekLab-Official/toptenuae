// src/utils/seo-manager.ts
import { Metadata } from 'next';
import { cleanText } from '@/lib/utils/sanity-text';

// =============================================================================
// CONFIGURATION
// =============================================================================
// Prioritize public env var for client-side compatibility, fallback to server var
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.baseUrl || 'https://toptenuae.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/brand/og-default.png`;
const SITE_NAME = 'TopTenUAE';

// SEO Best Practices (2026 Standards)
const MAX_TITLE_LENGTH = 60;        // Google displays ~60 chars
const MAX_DESC_LENGTH = 155;        // Google displays ~155 chars
const MIN_DESC_LENGTH = 50;         // Minimum for quality

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Truncate text at word boundary without creating empty strings
 */
const truncate = (text: string, limit: number): string => {
  if (!text || text.length <= limit) return text;
  
  // Find last complete word before limit
  const sub = text.substring(0, limit);
  const lastSpace = sub.lastIndexOf(" ");

  // If no space found or very close to limit, just cut hard to avoid returning "..."
  if (lastSpace === -1 || lastSpace < limit * 0.5) {
    return sub.trim() + "...";
  }
  
  return sub.substring(0, lastSpace).trim() + "...";
};

/**
 * Generate fallback description based on content type
 * (Prevents "Missing Meta Description" errors in Ahrefs/Semrush)
 */
const generateFallbackDescription = (data: SanitySeoSource): string => {
  const title = data.title || 'content';
  
  switch (data._type) {
    case 'product':
      return `Expert review of ${title}. Compare prices, features, and ratings. Read our unbiased analysis for UAE buyers.`;
    
    case 'topTenList':
      return `Discover the top 10 ${title.toLowerCase()} in UAE. Expert reviews, price comparisons, and buying guides updated for 2026.`;
    
    case 'tool':
      return `Free online ${title.toLowerCase()}. Instant results, no registration required. UAE-specific calculations and formulas.`;
    
    case 'holiday':
    case 'event':
      return `Complete guide to ${title} in UAE. Dates, timings, best deals, and expert recommendations for 2026.`;
    
    case 'howTo':
      return `Step-by-step guide: ${title}. Easy instructions for UAE residents with practical tips and expert advice.`;
    
    case 'deal':
      return `Limited time deal: ${title}. Save up to 70% on verified UAE offers. Price comparison included.`;
    
    default:
      return `Discover ${title} - Expert reviews and recommendations for UAE. Updated guides with pricing and comparisons.`;
  }
};

/**
 * Validate and clean description
 */
const processDescription = (desc: string | undefined, data: SanitySeoSource): string => {
  if (!desc) {
    return generateFallbackDescription(data);
  }

  // Clean and truncate
  const cleaned = cleanText(desc);
  
  // If too short after cleaning (e.g., just "Review"), use fallback
  if (cleaned.length < MIN_DESC_LENGTH) {
    return generateFallbackDescription(data);
  }

  return truncate(cleaned, MAX_DESC_LENGTH);
};

/**
 * Determine OpenGraph type based on content
 */
const getOgType = (docType: string): 'website' | 'article' => {
  const articleTypes = [
    'article', 'news', 'topTenList', 'howTo', 
    'charity', 'holiday', 'event'
  ];
  
  return articleTypes.includes(docType) ? 'article' : 'website';
};

// =============================================================================
// TYPES
// =============================================================================

export interface SanitySeoSource {
  title: string;
  description?: string;
  slug?: { current: string };
  url?: string;               // Master URL (passed from page.tsx)
  mainImage?: { url: string };
  _type: string;
  _updatedAt?: string;
  _createdAt?: string;
  publishedAt?: string;
  categorySlug?: string;
  
  // SEO override fields (from Sanity)
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    noIndex?: boolean;
    noFollow?: boolean;
    ogImage?: { url: string };
  };

  // Content fallbacks (in priority order)
  intro?: string | any;         // Rich text or string
  verdict?: string;             // Product verdict
  itemDescription?: string | any; // Product description
  imageUrl?: string;            // Direct image URL
  
  // Additional metadata
  author?: { name: string };
  brand?: string;
  price?: number;
  customerRating?: number;
}

export interface PathContext {
  category?: string;
  slug?: string;
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

export function generateSeoMetadata(
  data: SanitySeoSource, 
  pathContext?: PathContext
): Metadata {
  
  // Handle missing data (Prevent 500 errors)
  if (!data || !data.title) {
    return {
      title: 'Page Not Found | TopTenUAE',
      description: 'The requested page could not be found.',
      robots: { index: false, follow: false }
    };
  }

  // -------------------------------------------------------------------------
  // 1. TITLE PROCESSING
  // -------------------------------------------------------------------------
  const rawTitle = data.seo?.metaTitle || data.title;
  const title = truncate(rawTitle, MAX_TITLE_LENGTH);

  // -------------------------------------------------------------------------
  // 2. DESCRIPTION PROCESSING
  // -------------------------------------------------------------------------
  const rawDescription = 
    data.seo?.metaDescription ||   // 1. Manual SEO override
    data.description ||            // 2. Sanity description field
    data.intro ||                  // 3. Article intro
    data.verdict ||                // 4. Product verdict
    data.itemDescription;          // 5. Product description

  const description = processDescription(
    typeof rawDescription === 'string' ? rawDescription : undefined,
    data
  );

  // -------------------------------------------------------------------------
  // 3. IMAGE PROCESSING
  // -------------------------------------------------------------------------
  const ogImage = 
    data.seo?.ogImage?.url ||      // 1. Manual SEO override
    data.imageUrl ||               // 2. Direct URL
    data.mainImage?.url ||         // 3. Sanity image
    DEFAULT_OG_IMAGE;              // 4. Site default

  // -------------------------------------------------------------------------
  // 4. CANONICAL URL RESOLUTION (CRITICAL FOR MIGRATION)
  // -------------------------------------------------------------------------
  let canonical: string;
  
  // Priority 1: Manual override in Sanity
  if (data.seo?.canonicalUrl) {
    canonical = data.seo.canonicalUrl;
  }
  // Priority 2: Master URL passed from page.tsx (RECOMMENDED)
  else if (data.url) {
    canonical = data.url;
  }
  // Priority 3: Auto-construct from path context
  else if (pathContext?.category && pathContext?.slug) {
    canonical = `${SITE_URL}/${pathContext.category}/${pathContext.slug}`;
  }
  // Priority 4: Category page
  else if (pathContext?.category) {
    canonical = `${SITE_URL}/${pathContext.category}`;
  }
  // Priority 5: Slug only
  else if (data.slug?.current) {
    canonical = `${SITE_URL}/${data.slug.current}`;
  }
  // Fallback: Homepage
  else {
    canonical = SITE_URL;
  }

  // Ensure canonical is absolute and normalized
  if (!canonical.startsWith('http')) {
    canonical = `${SITE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`;
  }

  // -------------------------------------------------------------------------
  // 5. ROBOTS & KEYWORDS
  // -------------------------------------------------------------------------
  const noIndex = data.seo?.noIndex || false;
  const noFollow = data.seo?.noFollow || false;

  // Auto-generate keywords if none provided
  const autoKeywords: string[] = [];
  if (data._type === 'product' && data.brand) {
    autoKeywords.push(`${data.brand} UAE`, `${data.brand} Dubai`, 'UAE reviews');
  }
  if (data._type === 'topTenList') {
    autoKeywords.push('best in UAE', 'top 10 UAE', 'Dubai reviews', 'buying guide UAE');
  }
  if (data._type === 'tool') {
    autoKeywords.push('UAE calculator', 'free tool UAE', 'online calculator');
  }

  const keywords = [
    ...(data.seo?.keywords || []),
    ...autoKeywords
  ].slice(0, 15); // Cap at 15 keywords

  // -------------------------------------------------------------------------
  // 6. BUILD METADATA OBJECT
  // -------------------------------------------------------------------------
  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: title,
    description: description,
    keywords: keywords.length > 0 ? keywords : undefined,
    applicationName: SITE_NAME,
    
    // Robots configuration
    robots: {
      index: !noIndex,
      follow: !noFollow,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // OpenGraph
    openGraph: {
      title: title,
      description: description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_AE',
      type: getOgType(data._type),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png'
        },
      ],
      ...(getOgType(data._type) === 'article' && {
        publishedTime: data.publishedAt || data._createdAt,
        modifiedTime: data._updatedAt || data.publishedAt || data._createdAt,
        authors: data.author?.name ? [data.author.name] : undefined,
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImage],
    },

    // Canonical
    alternates: {
      canonical: canonical,
    },

    // Extra Metadata
    ...(data.author?.name && {
      authors: [{ name: data.author.name }],
    }),
    ...(pathContext?.category && {
      category: pathContext.category,
    }),
  };

  return metadata;
}

// =============================================================================
// UTILITY FUNCTIONS (Export for use in components)
// =============================================================================

/**
 * Generate structured data breadcrumb (for JSON-LD)
 */
export function generateBreadcrumbData(
  category: string,
  categoryName: string,
  slug: string,
  title: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: `${SITE_URL}/${category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${SITE_URL}/${category}/${slug}`,
      },
    ],
  };
}

/**
 * Validate URL structure for SEO
 */
export function validateSeoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith('http')) return false;
    if (!parsed.hostname) return false;
    if (parsed.pathname.includes('//')) return false;
    if (parsed.search) return false; // Canonicals shouldn't have params
    return true;
  } catch {
    return false;
  }
}

export function getSiteUrl(): string {
  return SITE_URL;
}