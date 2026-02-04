// src/sanity/lib/queries.ts
import { groq } from 'next-sanity'

// =============================================================================
// 1. GLOBAL SITE SETTINGS
// =============================================================================
export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    _type,
    title,
    description,
    "logoMain": logoMain.asset->url,
    "logoIcon": logoIcon.asset->url,
    "logoBimi": logoBimi.asset->url,
    "ogImage": ogImage.asset->url,
    socialLinks[] { platform, url },
    contactEmail
  }
`

// =============================================================================
// 2. SINGLE PRODUCT PAGE
// =============================================================================
export const PRODUCT_BY_SLUG_QUERY = groq`
  *[slug.current == $slug][0] {
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
    // ✅ NEW: Fetch Tech Specs
    specifications[] { specLabel, specValue },
    customerRating,
    reviewCount,
    verdict,
    mainImage { "url": asset->url, alt },
    itemDescription, 
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, description)
  }
`

// =============================================================================
// 3. TOP 10 LIST QUERY
// =============================================================================
export const TOP_TEN_LIST_QUERY = groq`
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
        // ✅ NEW: Fetch Tech Specs
        specifications[] { specLabel, specValue }
      }
    }
  }
`

// =============================================================================
// 4. DEALS QUERY
// =============================================================================
export const ALL_DEALS_QUERY = groq`
  *[_type == "deal" && isActive == true] | order(featured desc, _createdAt desc) {
    _type, _id, _createdAt,
    "title": coalesce(title, product->title),
    description,
    "image": coalesce(image.asset->url, product->mainImage.asset->url),
    "affiliateLink": coalesce(affiliateLink, product->affiliateLink),
    originalPrice, dealPrice, discountPercentage, category,
    dealEndDate, isPrimeExclusive, featured, couponCode, couponNote,
    "rating": coalesce(rating, product->customerRating),
    "reviewCount": coalesce(reviewCount, product->reviewCount)
  }
`

// =============================================================================
// 5. REVIEWS HUB QUERY
// =============================================================================
export const REVIEWS_HUB_QUERY = groq`{
  "featured": *[_type == "product" && isFeaturedReview == true] | order(_updatedAt desc) [0...8] {
    _id, title, "rating": customerRating, "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
  },
  "reviews": *[_type == "product"] | order(_createdAt desc) {
    _id, title, "rating": customerRating, "slug": slug.current,
    "section": reviewSection,
    "subCategoryTitle": subCategory->menuLabel,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
  }
}`

// =============================================================================
// 6. GENERIC POST QUERY
// =============================================================================
export const GENERIC_POST_QUERY = groq`
  *[slug.current == $slug][0]{
    _type,
    "slug": slug.current, _id, title, description,
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": "",
    "mainImage": coalesce(mainImage, image, coverImage, product->mainImage) { "url": asset->url, alt },
    "category": coalesce(categories[0], category)->{ "title": title, "slug": slug.current, "menuLabel": menuLabel },
    "publishedAt": _createdAt, "_updatedAt": _updatedAt,
    "intro": intro,
    "body": body,
    "content": content,
    "procedure": procedure,
    "closingContent": closingContent,
    faqs[] { _key, question, answer },
    startDate, endDate, locationName, address, ticketPrice
  }
`

// =============================================================================
// 7. CATEGORY PAGE QUERY
// =============================================================================
export const CATEGORY_PAGE_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0]{
    title, 
    description, 
    "slug": slug.current,
    "seo": seo { metaTitle, metaDescription },
    "mainImage": coalesce(
      mainImage, 
      image,
      *[references(^._id)][0].mainImage
    ) { "url": asset->url, alt },
    "items": *[
      _type in ["topTenList", "howTo", "tool", "holiday", "deal", "article"] &&
      (references(^._id) || category._ref == ^._id || categories[]._ref == ^._id)
    ] | order(publishedAt desc) {
      _type, title, "slug": slug.current, publishedAt,
      "mainImage": coalesce(mainImage, image, product->mainImage) { "url": asset->url, alt },
      "rawExcerpt": coalesce(description, "", "")
    }
  }
`