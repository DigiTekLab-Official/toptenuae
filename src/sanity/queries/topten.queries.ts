import { groq } from 'next-sanity';

// =============================================================================
// TOP TEN LIST QUERIES
// =============================================================================

export const TOP_TEN_BY_SLUG = groq`
  *[_type == "topTenList" && slug.current == $slug][0] {
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    "updatedAt": _updatedAt, 
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": "",
    mainImage { "url": asset->url, alt },
    intro,
    "body": body[],
    closingContent,
    showAffiliateDisclosure,
    faqs[] { _key, question, answer },
    listItems[] | order(rank asc) {
      _key, rank, badgeLabel, whySelected, customVerdict,
      product->{
        _type, title, brand, "slug": slug.current,
        priceTier, retailer, price, currency, availability, 
        affiliateLink, customerRating, reviewCount, verdict,
        location, address, curriculum, feeRange, realityCheck, website,
        "rating": coalesce(rating, customerRating),
        entityType, code, country,
        mainImage { "url": asset->url, alt },
        heroFeature, keyFeatures[], pros[], cons[],
        specifications[] { specLabel, specValue }
      }
    }
  }
`;

// Backward compatibility alias
export const TOP_TEN_LIST_QUERY = TOP_TEN_BY_SLUG;

export const ALL_TOP_TEN_LISTS = groq`
  *[_type == "topTenList"] | order(publishedAt desc)[0...100]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage { "url": asset->url, alt },
    intro
  }
`;

export const TOP_TEN_LISTS_BY_CATEGORY = groq`
  *[_type == "topTenList" && category->slug.current == $categorySlug]
    | order(publishedAt desc)[0...50]{
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      mainImage { "url": asset->url, alt },
      intro
    }
`;
