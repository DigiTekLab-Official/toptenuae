// src/lib/schemaGenerator.ts
import { cleanText } from '@/utils/sanity-text'; // ✅ Import your new helper

// --- CONFIGURATION ---
const baseUrl = process.env.baseUrl || 'https://toptenuae.com';
const ORGANIZATION_LOGO = `${baseUrl}/images/brand/logoIcon.svg`;

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
    name: cleanText(data.title),
    description: cleanText(data.intro || data.description), // ✅ Safe
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

// --- 4. PRODUCT SCHEMA ---
export const generateProductSchema = (data: any) => {
  const priceValue = data.price || data.livePrice || data.priceEstimate || 0;
  
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: cleanText(data.title || data.itemName),
    image: data.mainImage?.url ? [data.mainImage.url] : undefined,
    description: cleanText(data.verdict || data.intro || data.description), // ✅ Safe
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
      reviewBody: cleanText(data.verdict) // ✅ Safe
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
    description: cleanText(data.seo?.metaDescription || data.description), // ✅ Safe
    url: `${baseUrl}/${data.slug}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
    },
  };
  
  return toolSchema;
};

// --- 6. DEAL SCHEMA ---
export const generateDealSchema = (data: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Offer',
  name: cleanText(data.title),
  description: cleanText(data.description), // ✅ Safe
  price: data.dealPrice,
  priceCurrency: 'AED',
  priceValidUntil: data.dealEndDate,
  url: data.affiliateLink,
  availability: 'https://schema.org/InStock'
});

// --- 7. ARTICLE SCHEMA (With FAQ Fix) ---
export const generateArticleSchema = (data: any) => {
  const articleSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: cleanText(data.title),
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

  const schemas = [articleSchema];

  // ✅ THIS FIXES YOUR GOOGLE ERROR
  if (data.faqs && data.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map((faq: any) => ({
        '@type': 'Question',
        name: cleanText(faq.question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: cleanText(faq.answer) // ✅ Convert Blocks to String!
        }
      }))
    });
  }

  return schemas;
};

// --- 8. MASTER DISPATCHER ---
export function generateSchema(data: any) {
  if (!data) return generateOrganizationSchema();

  // If you pass "category/slug", normalize it or use logic as needed
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
        return [tool, faqs]; // Return array
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
            description: cleanText(item.customVerdict || item.product?.verdict)
          }
        }))
      };

    case 'NewsArticle':
    case 'article':
    default:
      return generateArticleSchema(data); 
  }
};