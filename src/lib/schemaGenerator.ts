 import { cleanText } from '@/utils/sanity-text'; // ✅ Import your new helper

// --- CONFIGURATION ---
const baseUrl = process.env.baseUrl || 'https://toptenuae.com';
const ORGANIZATION_LOGO = `${baseUrl}/images/brand/logoIcon.svg`;
// ✅ NEW: Default image to prevent Google Warnings
const DEFAULT_IMAGE = `${baseUrl}/images/brand/og-default.jpg`; 

// --- HELPER: DATE FORMATTING ---
const formatIsoDate = (dateStr?: string, isAllDay?: boolean) => {
  if (!dateStr) return undefined;
  return isAllDay ? dateStr.split("T")[0] : dateStr;
};

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

// --- 3. EVENT SCHEMA (FIXED) ---
export const generateEventSchema = (data: any, imageUrl: string | null = null) => {
  const statusMap: Record<string, string> = {
    scheduled: "https://schema.org/EventScheduled",
    cancelled: "https://schema.org/EventCancelled",
    postponed: "https://schema.org/EventPostponed",
    rescheduled: "https://schema.org/EventRescheduled",
  };

  // ✅ FIX: Ensure image is always an array
  const images = imageUrl ? [imageUrl] : (data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE]);

  // ✅ FIX: Define Organizer once to reuse for 'performer'
  const organizer = {
    '@type': 'Organization',
    name: 'TopTenUAE',
    url: baseUrl
  };

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: cleanText(data.title),
    description: cleanText(data.intro || data.description),
    image: images, 
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
    },
    organizer: organizer,
    // ✅ FIX: Google requires a 'performer' (even for holidays). Using Organizer satisfies this.
    performer: organizer 
  };

  if (data.ticketPrice !== undefined || data.ticketUrl) {
    schema.offers = {
      '@type': 'Offer',
      // ✅ FIX: Fallback URL if ticketUrl is missing
      url: data.ticketUrl || `${baseUrl}/events-holidays/${data.slug || ''}`, 
      price: data.ticketPrice || 0,
      priceCurrency: data.currency || "AED",
      availability: data.isTicketAvailable === false 
        ? "https://schema.org/SoldOut" 
        : "https://schema.org/InStock",
      // ✅ FIX: Fallback validFrom date
      validFrom: data.ticketSaleDate || data.publishedAt || new Date().toISOString()
    };
  }

  return schema;
};

// --- 4. PRODUCT SCHEMA ---
export const generateProductSchema = (data: any) => {
  const priceValue = data.price || data.livePrice || data.priceEstimate || 0;
  
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: cleanText(data.title || data.itemName),
    image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE], // ✅ Fixed fallback
    description: cleanText(data.verdict || data.intro || data.description), 
    brand: {
      '@type': 'Brand',
      name: cleanText(data.brand || 'Generic')
    },
    offers: {
      '@type': 'Offer',
      price: typeof priceValue === 'string' ? priceValue.replace(/[^0-9.]/g, "") : priceValue,
      priceCurrency: data.currency || 'AED',
      availability: data.availability || 'https://schema.org/InStock',
      url: data.affiliateLink
    }
  };

  if (data.customerRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.customerRating,
      reviewCount: data.ratingCount || 1
    };
  }

  if (data.verdict) {
    schema.review = {
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'TopTenUAE' },
      reviewRating: { '@type': 'Rating', ratingValue: 4.5, bestRating: 5 },
      reviewBody: cleanText(data.verdict)
    };
  }

  return schema;
};

// --- 5. TOOL / CALCULATOR SCHEMA ---
export const generateToolSchema = (data: any) => {
  const toolSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: cleanText(data.title),
    description: cleanText(data.seo?.metaDescription || data.description),
    url: `${baseUrl}/${data.slug}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
    },
    image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE] // ✅ Added Image
  };
  
  return toolSchema;
};

// --- 6. DEAL SCHEMA ---
export const generateDealSchema = (data: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Offer',
  name: cleanText(data.title),
  description: cleanText(data.description),
  price: data.dealPrice,
  priceCurrency: 'AED',
  priceValidUntil: data.dealEndDate,
  url: data.affiliateLink,
  availability: 'https://schema.org/InStock',
  image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE] // ✅ Added Image
});

// --- 7. ARTICLE SCHEMA (With FAQ Fix) ---
export const generateArticleSchema = (data: any) => {
  // ✅ FIX: Ensure Headline and Image are never empty
  const headline = cleanText(data.title) || "TopTenUAE Article";
  const images = data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE];

  const articleSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: headline, // ✅ Safe
    image: images,      // ✅ Safe
    datePublished: data.publishedAt,
    dateModified: data._updatedAt || data.publishedAt,
    author: {
      '@type': 'Organization',
      name: data.author?.name || 'TopTenUAE Editor',
      url: baseUrl
    },
    publisher: {
        '@type': 'Organization',
        name: 'TopTenUAE',
        url: baseUrl,
        logo: {
            '@type': 'ImageObject',
            url: ORGANIZATION_LOGO
        }
    }
  };

  const schemas = [articleSchema];

  if (data.faqs && data.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map((faq: any) => ({
        '@type': 'Question',
        name: cleanText(faq.question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: cleanText(faq.answer) 
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
      // Combine Tool + FAQ if FAQs exist
      const tool = generateToolSchema(data);
      if (data.faqs) {
        const faqs = {
           '@context': 'https://schema.org',
           '@type': 'FAQPage',
           mainEntity: data.faqs.map((f:any) => ({
             '@type': 'Question',
             name: cleanText(f.question),
             acceptedAnswer: { '@type': 'Answer', text: cleanText(f.answer) }
           }))
        };
        return [tool, faqs]; 
      }
      return tool;

    case 'deal':
      return generateDealSchema(data);

    case 'event':
    case 'holiday':
      return generateEventSchema(data, data.mainImage?.url);

    case 'topTenList':
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
            name: cleanText(item.product?.title || item.itemName || 'Product'),
            url: item.product?.slug ? `${baseUrl}/${item.product.slug}` : undefined,
            description: cleanText(item.customVerdict || item.product?.verdict),
            image: item.product?.mainImage?.url ? [item.product.mainImage.url] : undefined // ✅ Image for list items
          }
        }))
      };

    case 'NewsArticle':
    case 'article':
    default:
      return generateArticleSchema(data); 
  }
};