// src/lib/schemaGenerator.ts
import { cleanText } from '@/utils/sanity-text';

// --- CONFIGURATION ---
const baseUrl = process.env.baseUrl || 'https://toptenuae.com';
const ORGANIZATION_LOGO = `${baseUrl}/images/brand/logoIcon.svg`;
const DEFAULT_IMAGE = `${baseUrl}/images/brand/og-default.png`;

// --- HELPER: DATES ---
const formatIsoDate = (dateStr?: string, isAllDay?: boolean) => {
  if (!dateStr) return undefined;
  return isAllDay ? dateStr.split("T")[0] : dateStr;
};

// Helper: Get Next Year for Price Validity
const getNextYearDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

// --- 1. GLOBAL ORGANIZATION SCHEMA ---
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'TopTenUAE',
  url: baseUrl,
  inLanguage: 'en-AE',
  // ✅ OPTIMIZATION: Google prefers a single ImageObject for the logo
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/images/brand/logoIcon.svg`,
    width: 512,
    height: 512
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
  '@id': `${baseUrl}/#website`,
  name: 'TopTenUAE',
  alternateName: ['Top Ten UAE', 'TopTen UAE', 'toptenuae.com'],
  url: `${baseUrl}/`,
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

// --- 2.5 HOMEPAGE COLLECTION SCHEMA (ADDED) ---
export const generateHomePageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${baseUrl}/#homepage`,
  url: `${baseUrl}/`,
  name: 'TopTenUAE – Trending Tech, Reviews & Smart UAE Tools',
  description: 'Discover trending products, expert reviews, and free UAE tools including VAT and gratuity calculators.',
  isPartOf: {
    '@id': `${baseUrl}/#website`
  },
  about: {
    '@type': 'Thing',
    name: 'UAE Technology, Reviews & Online Tools'
  },
  publisher: {
    '@id': `${baseUrl}/#organization`
  },
  inLanguage: 'en-AE'
});

// --- 3. EVENT SCHEMA ---
export const generateEventSchema = (data: any, imageUrl: string | null = null) => {
  const statusMap: Record<string, string> = {
    scheduled: "https://schema.org/EventScheduled",
    cancelled: "https://schema.org/EventCancelled",
    postponed: "https://schema.org/EventPostponed",
    rescheduled: "https://schema.org/EventRescheduled",
  };

  const images = imageUrl ? [imageUrl] : (data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE]);
  const organizer = { '@type': 'Organization', name: 'TopTenUAE', url: baseUrl };

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
    performer: organizer
  };

  if (data.ticketPrice !== undefined || data.ticketUrl) {
    schema.offers = {
      '@type': 'Offer',
      url: data.ticketUrl || `${baseUrl}/events-holidays/${data.slug || ''}`,
      price: data.ticketPrice || 0,
      priceCurrency: data.currency || "AED",
      availability: data.isTicketAvailable === false ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
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
    image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE],
    description: cleanText(data.verdict || data.intro || data.description),
    brand: { '@type': 'Brand', name: cleanText(data.brand || 'Generic') },
    offers: {
      '@type': 'Offer',
      price: typeof priceValue === 'string' ? priceValue.replace(/[^0-9.]/g, "") : priceValue,
      priceCurrency: data.currency || 'AED',
      availability: data.availability || 'https://schema.org/InStock',
      url: data.affiliateLink,
      priceValidUntil: data.priceValidUntil || getNextYearDate(),
      // ⚠️ SAFETY: Shipping/Returns removed because TopTenUAE is an Affiliate/Publisher.
    }
  };

  if (data.customerRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.customerRating,
      reviewCount: data.reviewCount || 1
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
  const slug = data.slug?.current || data.slug || '';

  // 1. DYNAMIC FEATURE LIST (Matches User Intent)
  let features = ['Free Online Tool', 'Instant Calculation', 'Mobile Friendly'];

  if (slug.includes('vat')) {
    features = [
      'Add VAT to price',
      'Remove VAT (Reverse calculation)',
      'UAE VAT compliant (5%)',
      'Instant VAT calculation',
      'VAT inclusive & exclusive formulas'
    ];
  } else if (slug.includes('gratuity')) {
    features = [
      'UAE Labor Law compliant',
      'Limited & Unlimited contract logic',
      'Resignation & Termination calculation',
      'End of Service Benefits calculator'
    ];
  } else if (slug.includes('zakat')) {
    features = [
      'Gold & Silver Nisab',
      'Cash & assets calculation',
      'Islamic Zakat rules',
      '2.5% Zakat rate'
    ];
  }

  const categorySlug = data.category?.slug || 'finance-tools';
  const fullUrl = `${baseUrl}/${categorySlug}/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: cleanText(data.title),
    description: cleanText(data.seo?.metaDescription || data.description),
    url: fullUrl,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web, Android, iOS',
    isAccessibleForFree: true,

    author: {
      '@type': 'Organization',
      name: 'TopTenUAE',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'TopTenUAE',
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION_LOGO
      }
    },

    featureList: features,

    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED'
    },

    image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE]
  };
};

// --- 6. DEAL SCHEMA ---
export const generateDealSchema = (data: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Offer',
  name: cleanText(data.title),
  description: cleanText(data.description),
  price: data.dealPrice,
  priceCurrency: 'AED',
  priceValidUntil: data.dealEndDate || getNextYearDate(),
  url: data.affiliateLink,
  availability: 'https://schema.org/InStock',
  image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE]
});

// --- 7. HOW-TO SCHEMA ---
export const generateHowToSchema = (data: any) => {
  const images = data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE];

  const steps = data.steps && Array.isArray(data.steps)
    ? data.steps.map((step: any, index: number) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: cleanText(step.title || `Step ${index + 1}`),
      text: cleanText(step.description || step.text || "Follow instructions"),
      url: `${baseUrl}/${data.slug}#step-${index + 1}`
    }))
    : [
      {
        '@type': 'HowToStep',
        position: 1,
        name: "Read Full Guide",
        text: cleanText(data.intro || data.description || "Follow the detailed steps in the guide."),
        url: `${baseUrl}/${data.slug}`
      }
    ];

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: cleanText(data.title),
    description: cleanText(data.intro || data.description),
    image: images,
    totalTime: data.totalTime || "PT10M",
    step: steps
  };
};

// --- 8. ARTICLE SCHEMA ---
export const generateArticleSchema = (data: any) => {
  const headline = cleanText(data.title) || "TopTenUAE Article";
  const images = data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE];

  // ✅ OPTIMIZATION: Use correct type based on Sanity data
  const schemaType = (data._type === 'news') ? 'NewsArticle' : 'Article';

  const articleSchema: any = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: headline,
    image: images,
    datePublished: data.publishedAt,
    dateModified: data._updatedAt || data.publishedAt,
    author: { '@type': 'Organization', name: data.author?.name || 'TopTenUAE Editor', url: baseUrl },
    publisher: { '@type': 'Organization', name: 'TopTenUAE', url: baseUrl, logo: { '@type': 'ImageObject', url: ORGANIZATION_LOGO } }
  };

  const schemas = [articleSchema];

  if (data.faqs && data.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map((faq: any) => ({
        '@type': 'Question',
        name: cleanText(faq.question),
        acceptedAnswer: { '@type': 'Answer', text: cleanText(faq.answer) }
      }))
    });
  }
  return schemas;
};

// --- 9. MASTER DISPATCHER ---
export function generateSchema(data: any) {
  if (!data) return generateOrganizationSchema();

  const rawType = data.schemaType || data._type;
  // ✅ CLEANUP: Normalized to lowercase
  const targetType = rawType ? rawType.toLowerCase() : 'article';

  switch (targetType) {
    case 'product':
      return generateProductSchema(data);

    case 'tool':
      const tool = generateToolSchema(data);
      if (data.faqs) {
        const faqs = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.faqs.map((f: any) => ({
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

    case 'toptenlist':
    case 'topTenList': // Falls through safely
      return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: cleanText(data.seo?.metaTitle || data.title),
        description: cleanText(data.seo?.metaDescription || data.intro),
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: data.listItems?.length || 0,
        itemListElement: data.listItems?.map((item: any, index: number) => {
          const product = item.product || {};
          const priceValue = product.price || product.livePrice || 0;

          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: cleanText(item.product?.title || item.itemName || 'Product'),
              url: product.slug ? `${baseUrl}/${product.slug}` : undefined,
              description: cleanText(item.customVerdict || product.verdict),
              image: product.mainImage?.url ? [product.mainImage.url] : [DEFAULT_IMAGE],

              offers: {
                '@type': 'Offer',
                price: typeof priceValue === 'string' ? priceValue.replace(/[^0-9.]/g, "") : priceValue,
                priceCurrency: product.currency || 'AED',
                availability: product.availability || 'https://schema.org/InStock',
                url: product.affiliateLink,
                priceValidUntil: product.priceValidUntil || getNextYearDate(),
                // ⚠️ SAFETY: Shipping/Returns removed for lists as well.
              },

              aggregateRating: product.customerRating ? {
                '@type': 'AggregateRating',
                ratingValue: product.customerRating,
                reviewCount: product.reviewCount || 1
              } : undefined
            }
          };
        })
      };

    case 'howto':
    case 'howTo':
      const howTo = generateHowToSchema(data);
      if (data.faqs) {
        const faqs = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.faqs.map((f: any) => ({
            '@type': 'Question',
            name: cleanText(f.question),
            acceptedAnswer: { '@type': 'Answer', text: cleanText(f.answer) }
          }))
        };
        return [howTo, faqs];
      }
      return howTo;

    case 'newsarticle':
    case 'article':
    case 'news': // Added explicit case
    default:
      return generateArticleSchema(data);
  }
};