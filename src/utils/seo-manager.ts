// src/utils/seo-manager.ts - 2026 OPTIMIZED (Astro)
import { cleanText } from '@/lib/utils/sanity-text';

// =============================================================================
// CONFIGURATION
// =============================================================================
const SITE_URL = import.meta.env.PUBLIC_BASE_URL || 'https://toptenuae.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/brand/og-default.png`;

// 2026 SEO Best Practices
const MAX_TITLE_LENGTH = 60;
const MAX_DESC_LENGTH = 155;
const MIN_DESC_LENGTH = 50;

// =============================================================================
// HELPERS
// =============================================================================

const truncate = (text: string, limit: number): string => {
  if (!text || text.length <= limit) return text;
  
  const sub = text.substring(0, limit);
  const lastSpace = sub.lastIndexOf(" ");

  if (lastSpace === -1 || lastSpace < limit * 0.5) {
    return sub.trim() + "...";
  }
  
  return sub.substring(0, lastSpace).trim() + "...";
};

const generateFallbackDescription = (data: SanitySeoSource): string => {
  const title = data.title || 'content';
  
  switch (data._type) {
    case 'product':
      return `Expert review of ${title}. Compare prices, features, and ratings for UAE buyers. Unbiased analysis updated for 2026.`;
    
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
    
    case 'news':
      return `Latest news: ${title}. Breaking updates and analysis for UAE residents. Updated ${new Date().toLocaleDateString('en-AE')}.`;
    
    default:
      return `Discover ${title} - Expert reviews and recommendations for UAE. Updated guides with pricing and comparisons.`;
  }
};

const processDescription = (desc: string | undefined, data: SanitySeoSource): string => {
  if (!desc) {
    return generateFallbackDescription(data);
  }

  const cleaned = cleanText(desc);
  
  if (cleaned.length < MIN_DESC_LENGTH) {
    return generateFallbackDescription(data);
  }

  return truncate(cleaned, MAX_DESC_LENGTH);
};

const getOgType = (docType: string): 'website' | 'article' => {
  const articleTypes = [
    'article', 'news', 'topTenList', 'howTo', 
    'charity', 'holiday', 'event', 'product'
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
  url?: string;
  mainImage?: { url: string };
  _type: string;
  _updatedAt?: string;
  _createdAt?: string;
  publishedAt?: string;
  categorySlug?: string;
  
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    noIndex?: boolean;
    noFollow?: boolean;
    ogImage?: { url: string };
  };

  intro?: string | any;
  verdict?: string;
  itemDescription?: string | any;
  imageUrl?: string;
  
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
// MAIN FUNCTION - Enhanced for 2026
// =============================================================================

export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: 'website' | 'article';
  noIndex: boolean;
  keywords: string[];
  jsonLd?: Record<string, unknown>;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
}

export function generateSeoMetadata(
  data: SanitySeoSource, 
  pathContext?: PathContext
): SeoData {
  
  if (!data || !data.title) {
    return {
      title: 'Page Not Found | TopTenUAE',
      description: 'The requested page could not be found.',
      canonical: SITE_URL,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
      noIndex: true,
      keywords: [],
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
    data.seo?.metaDescription ||
    data.description ||
    data.intro ||
    data.verdict ||
    data.itemDescription;

  const description = processDescription(
    typeof rawDescription === 'string' ? rawDescription : undefined,
    data
  );

  // -------------------------------------------------------------------------
  // 3. IMAGE PROCESSING - Enhanced with Dimensions
  // -------------------------------------------------------------------------
  const ogImage = 
    data.seo?.ogImage?.url ||
    data.imageUrl ||
    data.mainImage?.url ||
    DEFAULT_OG_IMAGE;

  // -------------------------------------------------------------------------
  // 4. CANONICAL URL RESOLUTION
  // -------------------------------------------------------------------------
  let canonical: string;
  
  if (data.seo?.canonicalUrl) {
    canonical = data.seo.canonicalUrl;
  }
  else if (data.url) {
    canonical = data.url;
  }
  else if (pathContext?.category && pathContext?.slug) {
    canonical = `${SITE_URL}/${pathContext.category}/${pathContext.slug}`;
  }
  else if (pathContext?.category) {
    canonical = `${SITE_URL}/${pathContext.category}`;
  }
  else if (data.slug?.current) {
    canonical = `${SITE_URL}/${data.slug.current}`;
  }
  else {
    canonical = SITE_URL;
  }

  if (!canonical.startsWith('http')) {
    canonical = `${SITE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`;
  }

  // -------------------------------------------------------------------------
  // 5. ROBOTS & KEYWORDS
  // -------------------------------------------------------------------------
  const noIndex = data.seo?.noIndex || false;

  const autoKeywords: string[] = [];
  if (data._type === 'product' && data.brand) {
    autoKeywords.push(`${data.brand} UAE`, `${data.brand} Dubai`, `${data.brand} price UAE`);
  }
  if (data._type === 'topTenList') {
    autoKeywords.push('best in UAE', 'top 10 UAE', 'Dubai reviews', 'buying guide UAE', 'UAE rankings');
  }
  if (data._type === 'tool') {
    autoKeywords.push('UAE calculator', 'free tool UAE', 'online calculator Dubai');
  }
  if (data._type === 'event' || data._type === 'holiday') {
    autoKeywords.push('UAE events', 'Dubai holidays', 'what\'s on UAE');
  }

  const keywords = [
    ...(data.seo?.keywords || []),
    ...autoKeywords
  ].slice(0, 15);

  // -------------------------------------------------------------------------
  // 6. BUILD SEO DATA OBJECT - Astro compatible
  // -------------------------------------------------------------------------
  return {
    title,
    description,
    canonical,
    ogImage,
    ogType: getOgType(data._type),
    noIndex,
    keywords,
    publishedTime: data.publishedAt || data._createdAt,
    modifiedTime: data._updatedAt || data.publishedAt || data._createdAt,
    author: data.author?.name,
    category: pathContext?.category,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

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

export function validateSeoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith('http')) return false;
    if (!parsed.hostname) return false;
    if (parsed.pathname.includes('//')) return false;
    if (parsed.search) return false;
    return true;
  } catch {
    return false;
  }
}

export function getSiteUrl(): string {
  return SITE_URL;
}

// NEW: Generate product-specific metadata
export function generateProductMetadata(product: any, category?: string): SeoData {
  const price = product.price || product.dealPrice || 'Price unavailable';
  const rating = product.customerRating ? ` - ${product.customerRating}/5 stars` : '';
  
  return generateSeoMetadata({
    title: `${product.title} - Review & Price in UAE`,
    description: `${product.verdict || product.description || 'Expert review'} | Current price: AED ${price}${rating}`,
    _type: 'product',
    mainImage: product.mainImage,
    url: category && product.slug ? `${SITE_URL}/${category}/${product.slug}` : undefined,
    brand: product.brand,
    price: product.price,
    customerRating: product.customerRating,
    publishedAt: product.publishedAt,
    _updatedAt: product._updatedAt,
  }, { category, slug: product.slug });
}

// NEW: Generate category page metadata
export function generateCategoryMetadata(category: any): SeoData {
  return generateSeoMetadata({
    title: `${category.title} - Reviews & Rankings in UAE`,
    description: category.description || `Discover the best ${category.title.toLowerCase()} in UAE. Expert reviews, comparisons, and buying guides updated for 2026.`,
    _type: 'website',
    url: `${SITE_URL}/${category.slug}`,
  });
}