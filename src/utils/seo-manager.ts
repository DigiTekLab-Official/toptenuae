// src/utils/seo-manager.ts
import { Metadata } from 'next';

// --- CONFIGURATION ---
const SITE_URL = process.env.baseUrl || 'https://toptenuae.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/brand/og-default.jpg`;

/**
 * Interface representing the data coming from Sanity
 * MATCHES: 'seo' object in Sanity Schema + Manual Overrides
 */
export interface SanitySeoSource {
  title: string;
  description?: string;
  slug?: { current: string };
  url?: string; // ✅ ADDED THIS TO FIX THE ERROR
  mainImage?: { url: string };
  _type: string;
  _updatedAt?: string;
  publishedAt?: string;
  
  // The Custom SEO Object from Sanity
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    noIndex?: boolean;
    ogImage?: { url: string };
  };

  // Specific fields for Fallbacks
  intro?: string;          
  verdict?: string;        
  itemDescription?: any;   
  imageUrl?: string;       
}

/**
 * Helper to determine OpenGraph Type
 */
function getOgType(docType: string): 'website' | 'article' | 'book' | 'profile' {
  switch (docType) {
    case 'article':
    case 'news':
    case 'topTenList':
    case 'howTo':
      return 'article';
    default:
      return 'website'; 
  }
}

/**
 * THE FACTORY: Generates Next.js Metadata Object
 */
export function generateSeoMetadata(
  data: SanitySeoSource, 
  pathContext?: { category?: string; slug?: string }
): Metadata {
  
  if (!data) return { title: 'Page Not Found' };

  // 1. Resolve Title
  const title = data.seo?.metaTitle || data.title || 'TopTenUAE';

  // 2. Resolve Description (Cascade Priority)
  const description = 
    data.seo?.metaDescription || 
    data.description || 
    data.intro || 
    data.verdict || 
    "Discover the best products, deals, and government tools in the UAE.";

  // 3. Resolve Image
  const ogImage = 
    data.seo?.ogImage?.url || 
    data.imageUrl || 
    data.mainImage?.url || 
    DEFAULT_OG_IMAGE;

  // 4. Resolve Canonical URL
  let canonical = data.url || data.seo?.canonicalUrl; // ✅ Check 'url' first for homepage
  
  if (!canonical && pathContext?.category && pathContext?.slug) {
    canonical = `${SITE_URL}/${pathContext.category}/${pathContext.slug}`;
  } else if (!canonical && data.slug?.current) {
    canonical = `${SITE_URL}/${data.slug.current}`;
  }

  // 5. Robots Control
  const noIndex = data.seo?.noIndex || false;

  return {
    metadataBase: new URL(SITE_URL),
    title: title,
    description: description,
    keywords: data.seo?.keywords,
    applicationName: 'TopTenUAE',
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
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
      siteName: 'TopTenUAE',
      locale: 'en_AE',
      type: getOgType(data._type),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(data.publishedAt && { publishedTime: data.publishedAt }),
      ...(data._updatedAt && { modifiedTime: data._updatedAt }),
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
  };
}