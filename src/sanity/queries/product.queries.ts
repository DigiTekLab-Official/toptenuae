// src/sanity/queries/product.queries.ts
import groq from 'groq';

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
    // SEO Data
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, itemDescription, ""),
    "seoImage": coalesce(seo.openGraphImage.asset->url, mainImage.asset->url),
    "category": category->{title, "slug": slug.current},
    "categories": categories[]->{ "slug": slug.current, title }
  }
`;

// Backward compatibility alias
export const PRODUCT_BY_SLUG_QUERY = PRODUCT_BY_SLUG;

// Related content for a product page: lists that feature it + sibling products
// in the same category. Powers RelatedContent (internal-link signal for crawl).
export const RELATED_FOR_PRODUCT = groq`{
  "lists": *[_type == "topTenList" && references($id)] | order(publishedAt desc)[0...3]{
    title,
    "slug": slug.current,
    mainImage { asset->{ url } }
  },
  "products": *[_type == "product" && _id != $id && count((categories[]->slug.current)[@ in $cats]) > 0]
    | order(publishedAt desc)[0...8]{
      title,
      "slug": slug.current,
      brand,
      price,
      currency,
      mainImage { asset->{ url } }
    }
}`;

export const ALL_PRODUCTS = groq`
  *[_type == "product"] | order(publishedAt desc)[0...100]{
    _id,
    title,
    "slug": slug.current,
    brand,
    price,
    currency,
    mainImage { "url": asset->url, alt },
    customerRating,
    reviewCount,
    "category": category->title,
    publishedAt
  }
`;

export const PRODUCTS_BY_CATEGORY = groq`
  *[_type == "product" && category->slug.current == $categorySlug] 
    | order(publishedAt desc)[0...50]{
      _id,
      title,
      "slug": slug.current,
      brand,
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