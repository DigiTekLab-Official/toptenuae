// src/lib/schemaGenerator.ts — 2026 FINAL
// Critical fixes from review:  ✓ Fix #2 step.instruction  ✓ Fix #3 PortableText  ✓ Fix #4 schemaType
// Post-review fixes:            ✓ Gap A 'faqpage' dispatcher  ✓ Gap B author Person  ✓ Gap C HowTo rich fields

import { cleanText } from '@/lib/utils/sanity-text';

// =============================================================================
// CONFIGURATION
// =============================================================================
const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'https://toptenuae.com';
const ORGANIZATION_LOGO = `${baseUrl}/icon.png`;
const DEFAULT_IMAGE = `${baseUrl}/images/brand/og-default.png`;

// =============================================================================
// HELPERS
// =============================================================================

const formatIsoDate = (dateStr?: string, isAllDay?: boolean) => {
  if (!dateStr) return undefined;
  return isAllDay ? dateStr.split('T')[0] : dateStr;
};

const getPageId = (category?: string, slug?: string) => {
  if (!category || !slug) return `${baseUrl}/#webpage`;
  return `${baseUrl}/${category}/${slug}#webpage`;
};

const buildAuthorNode = (author?: { name?: string; url?: string }) => {
  const name = cleanText(author?.name || '').trim();
  const normalizedName = name.toLowerCase();
  const isOrganization =
    !name ||
    normalizedName === 'toptenuae' ||
    normalizedName === 'top ten uae' ||
    normalizedName.includes('team');

  if (isOrganization) {
    return { '@id': `${baseUrl}/#organization` };
  }

  return {
    '@type': 'Person',
    name,
    ...(author?.url ? { url: author.url } : {}),
  };
};

// =============================================================================
// 1. ORGANIZATION SCHEMA
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
    caption: 'TopTenUAE Logo',
  },
  image: {
    '@type': 'ImageObject',
    url: DEFAULT_IMAGE,
    width: 1200,
    height: 630,
  },
  description:
    'Expert reviews, rankings, and smart tools for UAE residents. Your trusted guide to the best products, services, and experiences in the Emirates.',
  foundingDate: '2020',
  areaServed: {
    '@type': 'Country',
    name: 'United Arab Emirates',
    '@id': 'https://www.wikidata.org/wiki/Q878',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    areaServed: 'AE',
    availableLanguage: ['en', 'ar'],
  },
  sameAs: [],
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
  description:
    'Discover trending products, expert reviews, and free UAE tools. Rankings, comparisons, and calculators for smarter decisions.',
  inLanguage: 'en-AE',
  publisher: { '@id': `${baseUrl}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
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
  description:
    'Discover trending products, expert reviews, and free UAE tools including VAT and gratuity calculators.',
  isPartOf: { '@id': `${baseUrl}/#website` },
  about: { '@type': 'Thing', name: 'UAE Product Reviews and Comparisons' },
  publisher: { '@id': `${baseUrl}/#organization` },
  inLanguage: 'en-AE',
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: DEFAULT_IMAGE,
    width: 1200,
    height: 630,
  },
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
  '@id': `${baseUrl}/${category}/${slug}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
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
// 5. FEATURED CONTENT ITEM LIST
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
      name: post.title,
    })),
  };
};

// =============================================================================
// 6. PRODUCT SCHEMA
// Product reviews are editorial Articles about a Thing, not merchant Product
// entities. Amazon.ae customer averages remain visible and attributed in the UI.
// =============================================================================
export const generateProductSchema = (
  data: any,
  category?: string,
  slug?: string
) => {
  const pageUrl =
    category && slug ? `${baseUrl}/${category}/${slug}` : baseUrl;
  const webpageId = `${pageUrl}#webpage`;
  const articleId = `${pageUrl}#article`;

  const images = data.mainImage?.url
    ? [data.mainImage.url]
    : data.images?.map((img: any) => img.url).filter(Boolean) || [DEFAULT_IMAGE];

  const description = cleanText(
    data.seoDescription ||
      data.verdict ||
      data.itemDescription ||
      data.intro ||
      data.description ||
      ''
  );

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': webpageId,
      mainEntity: { '@id': articleId },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': articleId,
      headline: cleanText(data.title || data.itemName),
      description,
      image: images,
      inLanguage: 'en-AE',
      datePublished: data.originalPublishedAt || data._createdAt,
      dateModified: data.lastReviewedAt || data._updatedAt,
      author: buildAuthorNode(data.author),
      publisher: { '@id': `${baseUrl}/#organization` },
      mainEntityOfPage: { '@id': webpageId },
      about: {
        '@type': 'Thing',
        name: cleanText(data.title || data.itemName),
        image: images[0],
      },
    },
  ];
};

// =============================================================================
// 7. TOP TEN LIST SCHEMA
// =============================================================================
export const generateTopTenListSchema = (
  data: any,
  category?: string,
  slug?: string
) => {
  if (!data.listItems || data.listItems.length === 0) return null;

  const pageUrl =
    category && slug ? `${baseUrl}/${category}/${slug}` : baseUrl;
  const validItems = data.listItems.filter(
    (item: any) => item.product && item.product.title
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageUrl}#toplist`,
    name: cleanText(data.seo?.metaTitle || data.title),
    description: cleanText(
      data.seo?.metaDescription || data.intro || data.description || ''
    ),
    url: pageUrl,
    numberOfItems: validItems.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug),
    },
    itemListElement: validItems.map((item: any, index: number) => {
      const product = item.product;
      const productSlug = product.slug?.current || product.slug;
      const productUrl = productSlug
        ? `${baseUrl}/${category || 'reviews'}/${productSlug}`
        : `${pageUrl}#rank-${index + 1}`;

      const listItem: any = {
        '@type': 'ListItem',
        position: index + 1,
        url: productUrl,
        item: {
          '@type': 'Product',
          name: cleanText(
            product.title || item.itemName || `Rank #${index + 1}`
          ),
          url: productUrl,
          description: cleanText(
            item.customVerdict ||
              product.verdict ||
              product.itemDescription ||
              ''
          ),
          image: product.mainImage?.url
            ? [product.mainImage.url]
            : [DEFAULT_IMAGE],
          brand: product.brand
            ? { '@type': 'Brand', name: cleanText(product.brand) }
            : undefined,
        },
      };

      return listItem;
    }),
  };
};

// =============================================================================
// 8. TOOL SCHEMA
// =============================================================================
export const generateToolSchema = (
  data: any,
  category?: string,
  slug?: string
) => {
  const toolSlug = slug || data.slug?.current || data.slug || '';
  const categorySlug = category || data.category?.slug || 'finance-tools';
  const fullUrl = `${baseUrl}/${categorySlug}/${toolSlug}`;

  let features = [
    'Free Online Tool',
    'Instant Calculation',
    'Mobile Friendly',
    'No Registration Required',
  ];
  let appCategory = 'FinanceApplication';

  if (toolSlug.includes('vat')) {
    features = [
      'Add VAT to price (5% UAE rate)',
      'Remove VAT (Reverse calculation)',
      'VAT inclusive & exclusive formulas',
      'Instant VAT calculation',
    ];
  } else if (toolSlug.includes('gratuity')) {
    features = [
      'UAE Labor Law compliant',
      'Limited & Unlimited contract calculation',
      'Resignation & Termination scenarios',
      'End of Service Benefits',
    ];
  } else if (toolSlug.includes('zakat')) {
    features = [
      'Gold & Silver Nisab calculation',
      'Cash & assets 2.5% Zakat rate',
      'Islamic Shariah compliant',
      'Live gold prices (Dubai)',
    ];
  } else if (toolSlug.includes('loan') || toolSlug.includes('emi')) {
    features = [
      'Monthly EMI calculation',
      'Amortization schedule',
      'Interest breakdown',
      'UAE bank rates comparison',
    ];
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
    author: { '@type': 'Organization', '@id': `${baseUrl}/#organization` },
    publisher: { '@type': 'Organization', '@id': `${baseUrl}/#organization` },
    featureList: features,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
    },
    image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug),
    },
  };
};

// =============================================================================
// 9. EVENT SCHEMA
// =============================================================================
export const generateEventSchema = (
  data: any,
  category?: string,
  slug?: string
) => {
  const eventUrl =
    category && slug ? `${baseUrl}/${category}/${slug}` : baseUrl;

  const statusMap: Record<string, string> = {
    scheduled: 'https://schema.org/EventScheduled',
    cancelled: 'https://schema.org/EventCancelled',
    postponed: 'https://schema.org/EventPostponed',
    rescheduled: 'https://schema.org/EventRescheduled',
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
    eventStatus:
      statusMap[data.status] || 'https://schema.org/EventScheduled',
    eventAttendanceMode:
      data.attendanceMode ||
      'https://schema.org/MixedEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: data.locationName || 'United Arab Emirates',
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address?.street,
        addressLocality: data.address?.city || 'Dubai',
        addressRegion: data.address?.state,
        addressCountry: 'AE',
      },
    },
    organizer: { '@id': `${baseUrl}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug),
    },
  };

  if (data.ticketPrice !== undefined || data.ticketUrl) {
    schema.offers = {
      '@type': 'Offer',
      url: data.ticketUrl || eventUrl,
      price: data.ticketPrice || 0,
      priceCurrency: data.currency || 'AED',
      availability:
        data.isTicketAvailable === false
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
      validFrom:
        data.ticketSaleDate || data.publishedAt || new Date().toISOString(),
    };
  }

  return schema;
};

// =============================================================================
// 10. ARTICLE SCHEMA
// Fix #4 applied: Sanity schemaType selector takes priority over _type.
// GAP B FIX: When data.author.name is a real person, emit @type: Person so
// Google does not flag a type mismatch in Search Console.
// =============================================================================
export const generateArticleSchema = (
  data: any,
  category?: string,
  slug?: string
) => {
  const articleUrl =
    category && slug ? `${baseUrl}/${category}/${slug}` : baseUrl;
  const headline = cleanText(data.title) || 'TopTenUAE Article';
  const images = data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE];

  // Fix #4: Sanity radio button wins; _type fallback preserved
  const schemaType =
    data.schemaType === 'NewsArticle'
      ? 'NewsArticle'
      : data._type === 'news'
        ? 'NewsArticle'
        : 'Article';

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${articleUrl}#article`,
    headline,
    description: cleanText(
      data.seoDescription || data.intro || data.description || ''
    ),
    image: images,
    datePublished: data.publishedAt || data._createdAt,
    dateModified: data._updatedAt || data.publishedAt || data._createdAt,
    author: buildAuthorNode(data.author),
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'TopTenUAE',
      logo: { '@type': 'ImageObject', '@id': `${baseUrl}/#logo` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug),
    },
    inLanguage: 'en-AE',
  };
};

// =============================================================================
// 11. HOW-TO SCHEMA
// Fix #2 applied: step.instruction is read first, matching the Sanity schema.
// GAP C FIX: estimatedCost and totalTime emitted when present in Sanity data,
// enabling the rich-result fields Google surfaces in How-to snippets.
// =============================================================================
export const generateHowToSchema = (
  data: any,
  category?: string,
  slug?: string
) => {
  const howToUrl =
    category && slug ? `${baseUrl}/${category}/${slug}` : baseUrl;

  const images = data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE];

  // Support both howToSteps (Sanity field name) and steps (generic fallback)
  const stepsSource = Array.isArray(data.howToSteps)
    ? data.howToSteps
    : Array.isArray(data.steps)
      ? data.steps
      : [];

  const steps =
    stepsSource.length > 0
      ? stepsSource.map((step: any, index: number) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: cleanText(step.title || `Step ${index + 1}`),
          // Fix #2: step.instruction is the correct Sanity field name
          text: cleanText(
            step.instruction || step.description || step.text || ''
          ),
          url: `${howToUrl}#step-${index + 1}`,
          ...(step.image?.url ? { image: step.image.url } : {}),
        }))
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${howToUrl}#howto`,
    name: cleanText(data.title),
    description: cleanText(data.intro || data.description || ''),
    image: images,
    // GAP C FIX: emit rich-result fields when present in Sanity data
    ...(data.totalTime ? { totalTime: data.totalTime } : {}),
    ...(data.estimatedCost
      ? {
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: data.estimatedCost.currency || 'AED',
            value: data.estimatedCost.value,
          },
        }
      : {}),
    ...(steps ? { step: steps } : {}),
    publisher: { '@id': `${baseUrl}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageId(category, slug),
    },
  };
};

// =============================================================================
// 12. FAQ SCHEMA
// Fix #3 applied: PortableText block array is walked correctly so answers
// never produce "[object Object]" in structured data output.
// =============================================================================
export const generateFAQSchema = (faqs: any[]) => {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  const extractPortableText = (content: any): string => {
    if (!Array.isArray(content)) return cleanText(content || '');
    return cleanText(
      content
        .map((block: any) =>
          Array.isArray(block.children)
            ? block.children.map((child: any) => child.text || '').join('')
            : ''
        )
        .join(' ')
    );
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
      .filter((faq) => faq?.question)
      .map((faq) => ({
        '@type': 'Question',
        name: cleanText(faq.question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: extractPortableText(faq.answer),
        },
      })),
  };
};

// =============================================================================
// 13. DEAL / OFFER SCHEMA
// =============================================================================
export const generateDealSchema = (
  data: any,
  category?: string,
  slug?: string
) => {
  const dealUrl =
    category && slug
      ? `${baseUrl}/${category}/${slug}`
      : data.affiliateLink || baseUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': `${dealUrl}#offer`,
    name: cleanText(data.title),
    description: cleanText(data.description || ''),
    price: data.dealPrice || data.price,
    priceCurrency: data.currency || 'AED',
    url: data.affiliateLink || dealUrl,
    availability: 'https://schema.org/InStock',
    image: data.mainImage?.url ? [data.mainImage.url] : [DEFAULT_IMAGE],
    seller: {
      '@type': 'Organization',
      name: data.retailer || 'Various UAE Retailers',
    },
    ...(data.dealEndDate ? { priceValidUntil: data.dealEndDate } : {}),
  };
};

// =============================================================================
// 14. MASTER SCHEMA DISPATCHER
// GAP A FIX: Added 'faqpage' to the switch so howTo documents where the Sanity
// editor selects schemaType = "FAQPage" correctly route to generateFAQSchema
// instead of falling through to the article default.
// =============================================================================
export function generateSchema(
  data: any,
  category?: string,
  slug?: string
) {
  if (!data) return [generateOrganizationSchema()];

  const schemas: any[] = [];

  // Always add Organization
  schemas.push(generateOrganizationSchema());

  // Homepage only
  if (!category && !slug) {
    schemas.push(generateWebSiteSchema());
    schemas.push(generateHomePageSchema());
    if (data.featuredPosts?.length > 0) {
      const featuredSchema = generateFeaturedContentSchema(data.featuredPosts);
      if (featuredSchema) schemas.push(featuredSchema);
    }
    return schemas;
  }

  // Breadcrumb for all content pages
  if (category && slug) {
    const categoryTitle =
      data.category?.title ||
      category.charAt(0).toUpperCase() +
        category.slice(1).replace(/-/g, ' ');
    schemas.push(
      generateBreadcrumbSchema(category, categoryTitle, slug, data.title)
    );
  }

  // Route by content type.
  // GAP A FIX: toLowerCase() normalises Sanity schemaType values
  // ('HowTo' → 'howto', 'FAQPage' → 'faqpage', 'NewsArticle' → 'newsarticle')
  // so each case string must be the lowercased form of the Sanity value.
  const rawType = data.schemaType || data._type;
  const targetType = rawType ? rawType.toLowerCase() : 'article';

  switch (targetType) {
    case 'product': {
      schemas.push(...generateProductSchema(data, category, slug));
      break;
    }

    case 'toptenlist': {
      // One ItemList per page. The gated server builder (284-348) types every
      // item as Product; aviation/institution lists rely on TopTenTemplate's
      // inline ItemList for correct Airline/Airport/School typing, so skip the
      // server one there (also removes its latent wrong-typed Product list).
      // Product lists keep the server ItemList with lightweight Product nodes.
      const firstItemType = data.listItems?.[0]?.product?._type;
      const isTypedList =
        firstItemType === 'aviationEntity' || firstItemType === 'institution';
      if (!isTypedList) {
        const listSchema = generateTopTenListSchema(data, category, slug);
        if (listSchema) schemas.push(listSchema);
      }
      break;
    }

    case 'tool': {
      schemas.push(generateToolSchema(data, category, slug));
      break;
    }

    case 'event':
    case 'holiday': {
      schemas.push(generateEventSchema(data, category, slug));
      // Also emit an Article alongside the Event: the Event type carries only the
      // event date (startDate/endDate), NOT publish/modified dates, so Google had
      // no freshness signal for these dated posts. @type follows the doc's
      // schemaType (default 'Article'; opt into 'NewsArticle' on genuine dated
      // announcements). The #event and #article @ids are distinct and both
      // reference the same WebPage, so there is no collision.
      schemas.push(generateArticleSchema(data, category, slug));
      break;
    }

    case 'howto': {
      schemas.push(generateHowToSchema(data, category, slug));
      break;
    }

    // GAP A FIX: 'faqpage' was never handled — FAQPage documents fell through
    // to the article default and never generated a FAQPage schema.
    case 'faqpage': {
      const faqPageSchema = generateFAQSchema(data.faqs || []);
      if (faqPageSchema) schemas.push(faqPageSchema);
      break;
    }

    case 'deal': {
      schemas.push(generateDealSchema(data, category, slug));
      break;
    }

    case 'newsarticle':
    case 'article':
    case 'news':
    case 'charity':
    default: {
      schemas.push(generateArticleSchema(data, category, slug));
      break;
    }
  }

  // Always append inline FAQ schema when faqs exist on any content type,
  // except FAQPage documents which already generated the full FAQ schema above.
  if (targetType !== 'faqpage' && data.faqs && data.faqs.length > 0) {
    const faqSchema = generateFAQSchema(data.faqs);
    if (faqSchema) schemas.push(faqSchema);
  }

  return schemas;
}
