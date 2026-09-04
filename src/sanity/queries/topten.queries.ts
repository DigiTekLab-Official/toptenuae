// src/sanity/queries/topten.queries.ts
import groq from 'groq';

// =============================================================================
// TOP TEN LIST QUERIES
// =============================================================================

export const TOP_TEN_BY_SLUG = groq`
  *[_type == "topTenList" && slug.current == $slug][0] {
    _type,
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    publishedAt,
    originalPublishedAt,
    lastReviewedAt,
    "updatedAt": _updatedAt, 
    "seoTitle": coalesce(seo.metaTitle, title),
    
    // ✅ FIX 1: Actually fetch the description (fallback to intro if empty)
    "seoDescription": coalesce(seo.metaDescription, intro, ""),
    
    mainImage { "url": asset->url, alt },
    seo,
    author->{name, "slug": slug.current, role, bio, expertise, credentials, socialLinks, profileUrl, image{"url": asset->url, alt}},
    reviewedBy->{name, "slug": slug.current, role, bio, expertise, credentials, profileUrl},
    intro,
    "body": body[],
    closingContent,
    keyTakeaways,
    whoItsFor,
    whoShouldAvoid,
    methodology,
    uaeContext,
    sources[]{title, publisher, url, accessedAt},
    affiliateDisclosure,
    relatedBuyerGuide->{
      title,
      "slug": slug.current,
      "category": categories[0]->slug.current
    },
    relatedContent[]->{_id, _type, title, "slug": slug.current, "categorySlug": coalesce(categories[0]->slug.current, category->slug.current), intro, verdict, mainImage{"url": asset->url, alt}},
    showAffiliateDisclosure,
    faqs[] { _key, question, answer },
    "sidebarPosts": *[
      _type in ["topTenList", "howTo", "post"] &&
      slug.current != $slug
    ] | order(publishedAt desc)[0...5] {
      _type,
      title,
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current),
      publishedAt,
      "imageUrl": mainImage.asset->url
    },
    
    listItems[] | order(rank asc) {
      _key, rank, badgeLabel, whySelected, skipIf, customVerdict,
      product->{
        _type, title, brand,
        "slug": slug.current, // ✅ PERFECT: This enables the Schema URL fix
        priceTier, price, currency, availability, availabilityStatus, availabilityCheckedAt,
        affiliateLink,
        lastPriceCheckedAt,
        uaeCommerce,
        
        // ✅ FIX 2: Added 'reviewCount' to satisfy Schema requirements
        customerRating, reviewCount, verdict,
        
        location, curriculum, feeRange, realityCheck, website,
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
