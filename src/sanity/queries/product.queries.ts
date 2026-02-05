import { groq } from 'next-sanity';

// =============================================================================
// PRODUCT QUERIES
// =============================================================================

export const PRODUCT_BY_SLUG = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _type,
    _id,
    title,
    brand,
    "slug": slug.current,
    price,
    currency,
    availability,
    priceTier,
    retailer,
    affiliateLink,
    pros,
    cons,
    keyFeatures,
    specifications[] { specLabel, specValue },
    customerRating,
    reviewCount,
    verdict,
    mainImage { "url": asset->url, alt },
    itemDescription, 
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, description)
  }
`;

// Backward compatibility alias
export const PRODUCT_BY_SLUG_QUERY = PRODUCT_BY_SLUG;

export const ALL_PRODUCTS = groq`
  *[_type == "product"] | order(publishedAt desc)[0...100]{
    _id,
    title,
    "slug": slug.current,
    price,
    currency,
    mainImage { "url": asset->url, alt },
    customerRating,
    reviewCount,
    publishedAt
  }
`;

export const PRODUCTS_BY_CATEGORY = groq`
  *[_type == "product" && category->slug.current == $categorySlug] 
    | order(publishedAt desc)[0...50]{
      _id,
      title,
      "slug": slug.current,
      price,
      currency,
      mainImage { "url": asset->url, alt },
      customerRating,
      reviewCount,
      publishedAt
    }
`;

export const PRODUCT_SEARCH = groq`
  *[_type == "product" && (title match $searchTerm || brand match $searchTerm)]
    | order(publishedAt desc)[0...50]{
      _id,
      title,
      "slug": slug.current,
      brand,
      price,
      currency,
      mainImage { "url": asset->url, alt },
      customerRating,
      reviewCount
    }
`;
