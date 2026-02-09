// src/lib/schemaGenerator.ts - 2026 OPTIMIZED
import { cleanText } from '@/lib/utils/sanity-text';

// =============================================================================
// CONFIGURATION
// =============================================================================
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';
const ORGANIZATION_LOGO = `${baseUrl}/icon.png`;
const DEFAULT_IMAGE = `${baseUrl}/images/brand/og-default.png`;

// =============================================================================
// HELPERS
// =============================================================================

const formatIsoDate = (dateStr?: string, isAllDay?: boolean) => {
  if (!dateStr) return undefined;
  return isAllDay ? dateStr.split("T")[0] : dateStr;
};

const getNextYearDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

const getPageId = (category?: string, slug?: string) => {
  if (!category || !slug) return `${baseUrl}/#webpage`;
  return `${baseUrl}/${category}/${slug}#webpage`;
};

// =============================================================================
// 1. ORGANIZATION SCHEMA (Enhanced with More Signals)
// =============================================================================
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'TopTenUAE',
  alternateName: 'Top Ten UAE',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    '@id': `${baseUrl}/#logo`,
    url: ORGANIZATION_LOGO,
    width: 512,
    height: 512,
    caption: 'TopTenUAE Logo'
  },
  image: {
    '@type': 'ImageObject',
    url: DEFAULT_IMAGE,
    width: 1200,
    height: 630
  },
  description: 'Expert reviews, rankings, and smart tools for UAE residents. Your trusted guide to the best products, services, and experiences in the Emirates.',
  foundingDate: '2020',
  areaServed: {
    '@type': 'Country',
    name: 'United Arab Emirates',
    '@id': 'https://www.wikidata.org/wiki/Q878'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    areaServed: 'AE',
    availableLanguage: ['en', 'ar']
  },
  sameAs: [
    // Add your verified social profiles here when available
    // e.g. 'https://twitter.com/toptenuae'
  ]
});

// =============================================================================
// 2. WEBSITE SCHEMA (Homepage Only)
// =============================================================================
export const generateWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  name: 'TopTenUAE',
  alternateName: ['Top Ten UAE', 'TopTen UAE'],
  url: `${baseUrl}/`,
  description: 'Discover trending products, expert reviews, and free UAE tools. Rankings, comparisons, and calculators for smarter decisions.',
  inLanguage: 'en-AE',
  publisher: {
    '@id': `${baseUrl}/#organization`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

// =============================================================================
// 3. HOMEPAGE COLLECTION SCHEMA
// =============================================================================
export const generateHomePageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${baseUrl}/#homepage`,
  url: `${baseUrl}/`,
  name: 'TopTenUAE - The Best of the UAE, Ranked',
  description: 'Discover trending products, expert reviews, and free UAE tools including VAT and gratuity calculators.',
  isPartOf: {
    '@id': `${baseUrl}/#website`
  },
  about: {
    '@type': 'Thing',
    name: 'UAE Product Reviews and Comparisons'
  },
  publisher: {
    '@id': `${baseUrl}/#organization`
  },
  inLanguage: 'en-AE',
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: DEFAULT_IMAGE,
    width: 1200,
    height: 630
  }
});

// =============================================================================
// 4. BREADCRUMB SCHEMA
// =============================================================================
export const generateBreadcrumbSchema = (
  category: string,
  categoryTitle: string,
  slug: string,
  title: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: categoryTitle,
      item: `${baseUrl}/${category}`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: cleanText(title),
      item: `${baseUrl}/${category}/${slug}`,
    },
  ],
});

// =============================================================================
// 5. FEATURED CONTENT ITEM LIST (NEW - For Homepage)
// =============================================================================
export const generateFeaturedContentSchema = (posts: any[]) => {
  if (!posts || posts.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured UAE Reviews and Guides',
    description: 'Top-rated content from TopTenUAE',
    numberOfItems: posts.length,
    itemListElement: posts.map((post, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${baseUrl}/${post.categorySlug}/${post.slug}`,
      name: post.title
    }))
  };
};

// =============================================================================
// 6. PRODUCT SCHEMA (Enhanced with Review)
// =============================================================================
export const generateProductSchema = (data: any, category?: string, slug?: string) => {
  const priceValue = data.price || data.dealPrice || data.livePrice || data.priceEstimate || 0;
  const cleanPrice = typeof priceValue === 'string'
    ? priceValue.replace(/[^0-9.]/g, "")
    : priceValue;

  const pageUrl = category && slug
    ? `${baseUrl}/${category}/${slug}`
    : baseUrl;

  const images = data.mainImage?.url
    ? [data.mainImage.url]
    : data.images?.map((img: any) => img.url).filter(Boolean) || [DEFAULT_IMAGE];

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${pageUrl}#product`,
    name: cleanText(data.title || data.itemName),
    image: images,
    description: cleanText(data.verdict || data.itemDescription || data.intro || data.description || ''),
    brand: data.brand ? {
      '@type': 'Brand',
      name: cleanText(data.brand)
    } : undefined,
    sku: data.sku || undefined,
    mpn: data.mpn || undefined,
    offers: {
      '@type': 'Offer',
      price: cleanPrice,
      priceCurrency: data.currency || 'AED',
      availability: data.availability || 'https://schema.org/InStock',
      url: data.affiliateLink || pageUrl,
      priceValidUntil: data.priceValidUntil || getNextYearDate(),
      seller: {
        '@type': 'Organization',
        name: data.retailer || 'Various UAE Retailers'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug)
    }
  };

  // Add Aggregate Rating if available
  if (data.customerRating && data.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.customerRating,
      reviewCount: data.reviewCount,
      bestRating: 5,
      worstRating: 1
    };
  }

  // Add Review if verdict exists
  if (data.verdict && data.customerRating) {
    schema.review = {
      '@type': 'Review',
      author: {
        '@type': 'Organization',
        name: 'TopTenUAE Editorial Team',
        '@id': `${baseUrl}/#organization`
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: data.customerRating,
        bestRating: 5
      },
      reviewBody: cleanText(data.verdict),
      datePublished: data.publishedAt || data._createdAt
    };
  }

  return schema;
};

// =============================================================================
// 7. TOP TEN LIST SCHEMA (Carousel-Compliant for Google)
// =============================================================================
export const generateTopTenListSchema = (data: any, category?: string, slug?: string) => {
  if (!data.listItems || data.listItems.length === 0) return null;

  const pageUrl = category && slug ? `${baseUrl}/${category}/${slug}` : baseUrl;

  // ✅ FILTER: Remove items where the product reference is broken (null)
  const validItems = data.listItems.filter((item: any) => item.product && item.product.title);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageUrl}#toplist`,
    name: cleanText(data.seo?.metaTitle || data.title),
    description: cleanText(data.seo?.metaDescription || data.intro || data.description || ''),
    url: pageUrl,
    numberOfItems: validItems.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: validItems.map((item: any, index: number) => {
      const product = item.product;
      
      // Generate product URL
      const productSlug = product.slug?.current || product.slug;
      const productUrl = productSlug 
        ? `${baseUrl}/${category || 'reviews'}/${productSlug}` 
        : `${pageUrl}#rank-${index + 1}`;

      // ✅ SIMPLIFIED ListItem (Carousel-compliant)
      // Google prefers minimal ListItem with URL, not nested full Product
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: productUrl,
        name: cleanText(product.title || item.itemName || `Rank #${index + 1}`)
      };
    })
  };
};

// =============================================================================
// 8. TOOL SCHEMA (Enhanced with Features)
// =============================================================================
export const generateToolSchema = (data: any, category?: string, slug?: string) => {
  const toolSlug = slug || data.slug?.current || data.slug || '';
  const categorySlug = category || data.category?.slug || 'finance-tools';
  const fullUrl = `${baseUrl}/${categorySlug}/${toolSlug}`;

  let features = ['Free Online Tool', 'Instant Calculation', 'Mobile Friendly', 'No Registration Required'];
  let appCategory = 'FinanceApplication';

  if (toolSlug.includes('vat')) {
    features = ['Add VAT to price (5% UAE rate)', 'Remove VAT (Reverse calculation)', 'VAT inclusive & exclusive formulas', 'Instant VAT calculation'];
    appCategory = 'FinanceApplication';
  } else if (toolSlug.includes('gratuity')) {
    features = ['UAE Labor Law compliant', 'Limited & Unlimited contract calculation', 'Resignation & Termination scenarios', 'End of Service Benefits'];
    appCategory = 'FinanceApplication';
  } else if (toolSlug.includes('zakat')) {
    features = ['Gold & Silver Nisab calculation', 'Cash & assets 2.5% Zakat rate', 'Islamic Shariah compliant', 'Live gold prices (Dubai)'];
    appCategory = 'FinanceApplication';
  } else if (toolSlug.includes('loan') || toolSlug.includes('emi')) {
    features = ['Monthly EMI calculation', 'Amortization schedule', 'Interest breakdown', 'UAE bank rates comparison'];
    appCategory = 'FinanceApplication';
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${fullUrl}#tool`,
    name: cleanText(data.title),
    description: cleanText(data.seo?.metaDescription || data.description || ''),
    url: fullUrl,
    applicationCategory: appCategory,
    operatingSystem: 'Web Browser, Android, iOS',
    isAccessibleForFree: true,
    author: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`
    },
    featureList: features,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock'
    },
    image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug)
    }
  };
};

// =============================================================================
// 9. EVENT SCHEMA (Enhanced)
// =============================================================================
export const generateEventSchema = (data: any, category?: string, slug?: string) => {
  const eventUrl = category && slug ? `${baseUrl}/${category}/${slug}` : baseUrl;

  const statusMap: Record<string, string> = {
    scheduled: "https://schema.org/EventScheduled",
    cancelled: "https://schema.org/EventCancelled",
    postponed: "https://schema.org/EventPostponed",
    rescheduled: "https://schema.org/EventRescheduled",
  };

  const images = data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE];

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${eventUrl}#event`,
    name: cleanText(data.title),
    description: cleanText(data.intro || data.description || ''),
    image: images,
    startDate: formatIsoDate(data.startDate || data.date, data.isAllDay),
    endDate: formatIsoDate(data.endDate, data.isAllDay),
    eventStatus: statusMap[data.status] || "https://schema.org/EventScheduled",
    eventAttendanceMode: data.attendanceMode || "https://schema.org/MixedEventAttendanceMode",
    location: {
      '@type': 'Place',
      name: data.locationName || 'United Arab Emirates',
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address?.street,
        addressLocality: data.address?.city || 'Dubai',
        addressRegion: data.address?.state,
        addressCountry: 'AE'
      }
    },
    organizer: {
      '@id': `${baseUrl}/#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug)
    }
  };

  if (data.ticketPrice !== undefined || data.ticketUrl) {
    schema.offers = {
      '@type': 'Offer',
      url: data.ticketUrl || eventUrl,
      price: data.ticketPrice || 0,
      priceCurrency: data.currency || "AED",
      availability: data.isTicketAvailable === false
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      validFrom: data.ticketSaleDate || data.publishedAt || new Date().toISOString()
    };
  }

  return schema;
};

// =============================================================================
// 10. ARTICLE SCHEMA (Enhanced)
// =============================================================================
export const generateArticleSchema = (data: any, category?: string, slug?: string) => {
  const articleUrl = category && slug ? `${baseUrl}/${category}/${slug}` : baseUrl;
  const headline = cleanText(data.title) || "TopTenUAE Article";
  const images = data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE];

  const schemaType = (data._type === 'news') ? 'NewsArticle' : 'Article';

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${articleUrl}#article`,
    headline: headline,
    description: cleanText(data.seoDescription || data.intro || data.description || ''),
    image: images,
    datePublished: data.publishedAt || data._createdAt,
    dateModified: data._updatedAt || data.publishedAt || data._createdAt,
    author: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: data.author?.name || 'TopTenUAE Editorial Team'
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'TopTenUAE',
      logo: {
        '@type': 'ImageObject',
        '@id': `${baseUrl}/#logo`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug)
    },
    inLanguage: 'en-AE'
  };
};

// =============================================================================
// 11. HOW-TO SCHEMA
// =============================================================================
export const generateHowToSchema = (data: any, category?: string, slug?: string) => {
  const howToUrl = category && slug ? `${baseUrl}/${category}/${slug}` : baseUrl;
  const images = data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE];

  const steps = data.steps && Array.isArray(data.steps)
    ? data.steps.map((step: any, index: number) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: cleanText(step.title || `Step ${index + 1}`),
      text: cleanText(step.description || step.text || "Follow instructions"),
      url: `${howToUrl}#step-${index + 1}`,
      image: step.image?.url || undefined
    }))
    : [{
      '@type': 'HowToStep',
      position: 1,
      name: "Read Full Guide",
      text: cleanText(data.intro || data.description || "Follow the detailed steps in the guide."),
      url: howToUrl
    }];

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${howToUrl}#howto`,
    name: cleanText(data.title),
    description: cleanText(data.intro || data.description || ''),
    image: images,
    totalTime: data.totalTime || "PT15M",
    estimatedCost: data.estimatedCost || {
      '@type': 'MonetaryAmount',
      currency: 'AED',
      value: '0'
    },
    step: steps,
    publisher: {
      '@id': `${baseUrl}/#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug)
    }
  };
};

// =============================================================================
// 12. FAQ SCHEMA
// =============================================================================
export const generateFAQSchema = (faqs: any[]) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: any) => ({
      '@type': 'Question',
      name: cleanText(faq.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: cleanText(faq.answer)
      }
    }))
  };
};

// =============================================================================
// 13. DEAL/OFFER SCHEMA
// =============================================================================
export const generateDealSchema = (data: any, category?: string, slug?: string) => {
  const dealUrl = category && slug ? `${baseUrl}/${category}/${slug}` : data.affiliateLink || baseUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': `${dealUrl}#offer`,
    name: cleanText(data.title),
    description: cleanText(data.description || ''),
    price: data.dealPrice || data.price,
    priceCurrency: data.currency || 'AED',
    priceValidUntil: data.dealEndDate || getNextYearDate(),
    url: data.affiliateLink || dealUrl,
    availability: 'https://schema.org/InStock',
    image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE],
    seller: {
      '@type': 'Organization',
      name: data.retailer || 'Various UAE Retailers'
    }
  };
};

// =============================================================================
// 14. MASTER SCHEMA GENERATOR
// =============================================================================
export function generateSchema(data: any, category?: string, slug?: string) {
  if (!data) return [generateOrganizationSchema()];

  const schemas: any[] = [];

  // 1. ALWAYS ADD ORGANIZATION
  schemas.push(generateOrganizationSchema());

  // 2. HOMEPAGE ONLY: Add Website & Homepage schemas
  if (!category && !slug) {
    schemas.push(generateWebSiteSchema());
    schemas.push(generateHomePageSchema());

    // Add Featured Content if available
    if (data.featuredPosts && data.featuredPosts.length > 0) {
      const featuredSchema = generateFeaturedContentSchema(data.featuredPosts);
      if (featuredSchema) schemas.push(featuredSchema);
    }
  }

  // 3. ADD BREADCRUMB (if deep link)
  if (category && slug) {
    const categoryTitle = data.category?.title || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    schemas.push(generateBreadcrumbSchema(category, categoryTitle, slug, data.title));
  }

  // 4. DETECT CONTENT TYPE & ADD SPECIFIC SCHEMA
  const rawType = data.schemaType || data._type;
  const targetType = rawType ? rawType.toLowerCase() : 'article';

  switch (targetType) {
    case 'product':
      schemas.push(generateProductSchema(data, category, slug));
      break;

    case 'toptenlist':
      const listSchema = generateTopTenListSchema(data, category, slug);
      if (listSchema) schemas.push(listSchema);
      break;

    case 'tool':
      schemas.push(generateToolSchema(data, category, slug));
      break;

    case 'event':
    case 'holiday':
      schemas.push(generateEventSchema(data, category, slug));
      break;

    case 'howto':
      schemas.push(generateHowToSchema(data, category, slug));
      break;

    case 'deal':
      schemas.push(generateDealSchema(data, category, slug));
      break;

    case 'newsarticle':
    case 'article':
    case 'news':
    case 'charity':
    default:
      if (category || slug) {
        schemas.push(generateArticleSchema(data, category, slug));
      }
      break;
  }

  // 5. ADD FAQ SCHEMA (if present)
  if (data.faqs && data.faqs.length > 0) {
    const faqSchema = generateFAQSchema(data.faqs);
    if (faqSchema) schemas.push(faqSchema);
  }

  return schemas;
}