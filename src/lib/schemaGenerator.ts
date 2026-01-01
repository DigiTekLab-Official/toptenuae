// src/lib/schemaGenerator.ts

// --- CONFIGURATION ---
const baseUrl = process.env.NEXT_PUBLIC_baseUrl || 'https://toptenuae.com';
const ORGANIZATION_LOGO = `${baseUrl}/images/brand/logoIcon.svg`;

// --- HELPER: DATE FORMATTING ---
const formatIsoDate = (dateStr?: string, isAllDay?: boolean) => {
  if (!dateStr) return undefined;
  return isAllDay ? dateStr.split("T")[0] : dateStr;
};

// --- HELPER: SAFE STRING ---
const safeString = (str: any) => (str ? String(str).trim() : "");

// --- 1. GLOBAL ORGANIZATION SCHEMA ---
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TopTenUAE',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: ORGANIZATION_LOGO,
    width: '512',
    height: '512'
  },
  sameAs: [
    'https://facebook.com/toptenuae',
    'https://twitter.com/toptenuae'
  ]
});

// --- 2. WEBSITE SCHEMA ---
export const generateWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TopTenUAE',
  alternateName: ['Top Ten UAE', 'TopTen UAE', 'toptenuae.com'],
  url: `${baseUrl}/`,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

// --- 3. EVENT SCHEMA ---
export const generateEventSchema = (data: any, imageUrl: string | null = null) => {
  const statusMap: Record<string, string> = {
    scheduled: "https://schema.org/EventScheduled",
    cancelled: "https://schema.org/EventCancelled",
    postponed: "https://schema.org/EventPostponed",
    rescheduled: "https://schema.org/EventRescheduled",
  };

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.title,
    description: data.intro || data.description,
    image: imageUrl ? [imageUrl] : (data.mainImage?.url ? [data.mainImage.url] : []),
    startDate: formatIsoDate(data.startDate || data.date, data.isAllDay),
    endDate: formatIsoDate(data.endDate, data.isAllDay),
    eventStatus: statusMap[data.status] || "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      '@type': 'Place',
      name: data.locationName || 'UAE Venue',
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address?.street,
        addressLocality: data.address?.city || 'Dubai',
        addressRegion: data.address?.state,
        addressCountry: 'AE'
      }
    }
  };

  if (data.ticketPrice !== undefined || data.ticketUrl) {
    schema.offers = {
      '@type': 'Offer',
      url: data.ticketUrl,
      price: data.ticketPrice || 0,
      priceCurrency: data.currency || "AED",
      availability: data.isTicketAvailable === false 
        ? "https://schema.org/SoldOut" 
        : "https://schema.org/InStock",
      validFrom: data.ticketSaleDate
    };
  }

  return schema;
};

// --- 4. PRODUCT SCHEMA (Updated for 'price' field) ---
export const generateProductSchema = (data: any) => {
  // Fix: Check for 'price' (new) or 'livePrice' (old)
  const priceValue = data.price || data.livePrice || data.priceEstimate || 0;
  
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title || data.itemName,
    image: data.mainImage?.url ? [data.mainImage.url] : undefined,
    description: data.verdict || data.intro || data.description,
    brand: {
      '@type': 'Brand',
      name: data.brand || 'Generic'
    },
    offers: {
      '@type': 'Offer',
      price: typeof priceValue === 'string' ? priceValue.replace(/[^0-9.]/g, "") : priceValue,
      priceCurrency: data.currency || 'AED',
      availability: data.availability || 'https://schema.org/InStock',
      url: data.affiliateLink
    }
  };

  // Aggregate Rating (New)
  if (data.customerRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.customerRating,
      reviewCount: data.ratingCount || 1
    };
  }

  // Editorial Review
  if (data.verdict) {
    schema.review = {
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'TopTenUAE' },
      reviewRating: { '@type': 'Rating', ratingValue: 4.5, bestRating: 5 },
      reviewBody: data.verdict
    };
  }

  return schema;
};

// --- 5. TOOL / CALCULATOR SCHEMA (Updated to SoftwareApplication) ---
export const generateToolSchema = (data: any) => {
  const toolSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.title,
    description: data.seo?.metaDescription || data.description,
    url: `${baseUrl}/${data.slug}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
    },
  };

  // If FAQs exist, we merge FAQPage schema into this (Advanced Graph)
  // Note: Google prefers separate nodes, but for simple tools, this object is primary.
  // The Page component usually handles the separate FAQPage injection.
  
  return toolSchema;
};

// --- 6. DEAL SCHEMA (New) ---
export const generateDealSchema = (data: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Offer',
  name: data.title,
  description: data.description,
  price: data.dealPrice,
  priceCurrency: 'AED',
  priceValidUntil: data.dealEndDate,
  url: data.affiliateLink,
  availability: 'https://schema.org/InStock'
});

// --- 7. ARTICLE SCHEMA (With FAQ Support) ---
export const generateArticleSchema = (data: any) => {
  const articleSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: data.title,
    image: data.mainImage?.url ? [data.mainImage.url] : [],
    datePublished: data.publishedAt,
    dateModified: data._updatedAt || data.publishedAt,
    author: {
      '@type': 'Organization',
      name: data.author?.name || 'TopTenUAE Editor',
      url: baseUrl
    },
    publisher: generateOrganizationSchema()
  };

  // Return Array to allow multiple schemas (Article + FAQ)
  const schemas = [articleSchema];

  if (data.faqs && data.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map((faq: any) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  }

  return schemas;
};

// --- 8. MASTER DISPATCHER ---
export function generateSchema(data: any) {
  if (!data) return generateOrganizationSchema();

  const targetType = data.schemaType || data._type;

  switch (targetType) {
    case 'product': 
      return generateProductSchema(data);

    case 'tool':
      return generateToolSchema(data);

    case 'deal':
      return generateDealSchema(data);

    case 'event':
    case 'holiday':
      return generateEventSchema(data, data.mainImage?.url);

    case 'topTenList':
      // Updated to match your List structure (product->)
      return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: data.listItems?.length || 0,
        itemListElement: data.listItems?.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: item.product?.title || item.itemName || 'Product',
            url: item.product?.slug ? `${baseUrl}/${item.product.slug}` : undefined,
            description: item.customVerdict || item.product?.verdict
          }
        }))
      };

    case 'NewsArticle':
    case 'article':
    default:
      // Return the primary article schema (index 0)
      // Note: If you want both Article + FAQ, you should handle array returns in your Page component
      return generateArticleSchema(data)[0]; 
  }
};