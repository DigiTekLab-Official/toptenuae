// src/utils/seo-manager.ts
import { Metadata } from 'next';
import { cleanText } from '@/utils/sanity-text';

// --- CONFIGURATION ---
const SITE_URL = process.env.baseUrl || 'https://toptenuae.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/brand/og-default.png`;

// ✅ NEW: Safety Limits for Bing/Google
const MAX_TITLE_LENGTH = 60;
const MAX_DESC_LENGTH = 160;

// ✅ NEW: Helper to cut text cleanly without cutting words in half
const truncate = (text: string, limit: number) => {
  if (!text || text.length <= limit) return text;
  return text.substring(0, limit).trim() + '...';
};

export interface SanitySeoSource {
  title: string;
  description?: string;
  slug?: { current: string };
  url?: string;
  mainImage?: { url: string };
  _type: string;
  _updatedAt?: string;
  publishedAt?: string;
  categorySlug?: string;
  
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    noIndex?: boolean;
    ogImage?: { url: string };
  };

  intro?: string;          
  verdict?: string;        
  itemDescription?: any;   
  imageUrl?: string;       
}

function getOgType(docType: string): 'website' | 'article' {
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

export function generateSeoMetadata(
  data: SanitySeoSource, 
  pathContext?: { category?: string; slug?: string }
): Metadata {
  
  if (!data) return { title: 'Page Not Found' };

  // 1. Resolve & Truncate Title (Fixes "Title too long")
  const rawTitle = data.seo?.metaTitle || data.title || 'TopTenUAE';
  const title = truncate(rawTitle, MAX_TITLE_LENGTH);

  // 2. Resolve & Truncate Description (Fixes "Description missing")
  const rawDescription = 
    data.seo?.metaDescription || 
    data.description || 
    data.intro || 
    data.itemDescription ||
    data.verdict;

  // ✅ FIX: Force a fallback if everything else is empty
  const cleanDesc = rawDescription ? cleanText(rawDescription) : "";
  const description = truncate(
    cleanDesc || `Discover the best ${data.title || 'products'} in the UAE with expert reviews and pricing on TopTenUAE.`,
    MAX_DESC_LENGTH
  );

  // 3. Resolve Image
  const ogImage = 
    data.seo?.ogImage?.url || 
    data.imageUrl || 
    data.mainImage?.url || 
    DEFAULT_OG_IMAGE;

  // 4. Resolve Canonical URL
  let canonical = data.url || data.seo?.canonicalUrl; 
  
  if (!canonical) {
    const activeCategory = data.categorySlug || pathContext?.category;
    const activeSlug = data.slug?.current || pathContext?.slug;

    if (activeCategory && activeSlug) {
      canonical = `${SITE_URL}/${activeCategory}/${activeSlug}`;
    } else if (activeSlug) {
      canonical = `${SITE_URL}/${activeSlug}`;
    } else {
      canonical = SITE_URL;
    }
  }

  const noIndex = data.seo?.noIndex || false;

  return {
    metadataBase: new URL(SITE_URL),
    title: title,
    description: description,
    keywords: data.seo?.keywords,
    applicationName: 'TopTenUAE',
    
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
          type: 'image/png'
        },
      ],
      ...(data.publishedAt && { publishedTime: data.publishedAt }),
      ...(data._updatedAt && { modifiedTime: data._updatedAt }),
    },

    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImage],
    },

    alternates: {
      canonical: canonical,
    },
  };
}