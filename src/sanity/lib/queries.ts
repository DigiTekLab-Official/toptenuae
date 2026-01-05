// src/sanity/lib/queries.ts
import { groq } from 'next-sanity'

// 1. GLOBAL SITE SETTINGS (New)
// Fetches branding, SEO defaults, and contact info for layout.tsx
export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    title,
    description,
    "logoMain": logoMain.asset->url,
    "logoIcon": logoIcon.asset->url,
    "logoBimi": logoBimi.asset->url,
    "ogImage": ogImage.asset->url,
    socialLinks[] {
      platform,
      url
    },
    contactEmail
  }
`

// 2. SINGLE PRODUCT PAGE
export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] {
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
    customerRating,
    reviewCount,
    verdict,
    mainImage { asset, alt },
    itemDescription, 
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, description)
  }
`

// 3. TOP 10 LIST QUERY (Updated with SEO & Related Content)
export const TOP_TEN_LIST_QUERY = groq`
  *[_type == "topTenList" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    publishedAt,
    "updatedAt": _updatedAt, 
    
    // --- SEO METADATA ---
    // Fetches custom SEO title if set (e.g., "Tested & Ranked"), otherwise falls back to main title
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, intro),
    "socialShareImage": seo.shareGraphic.asset->url,

    // --- MAIN CONTENT ---
    intro,
    body,
    closingContent,       
    showAffiliateDisclosure,
    mainImage { asset, alt },
    faqs[] { _key, question, answer },
    
    // --- LIST ITEMS (For Schema & Display) ---
    listItems[] | order(rank asc) {
      _key,
      rank,
      badgeLabel,
      whySelected,
      customVerdict,
      product->{
        title,
        brand,
        "slug": slug.current,
        priceTier,
        retailer,
        price,        
        currency,
        availability, 
        affiliateLink,            
        customerRating,
        reviewCount,
        verdict,
        keyFeatures,
        pros,
        cons,
        itemDescription,
        mainImage { asset, alt }
      }
    },

    // --- RELATED CONTENT (Topic Clusters) ---
    // 1. Related Lists: Finds other Top 10 lists in the same category
    "relatedLists": *[
      _type == "topTenList" 
      && _id != ^._id 
      && count((categories[]->slug.current)[@ in ^.categories[]->slug.current]) > 0
    ] | order(publishedAt desc)[0...3] {
      title,
      "slug": slug.current,
      intro,
      mainImage { asset, alt }
    },

    // 2. Related Products: Finds high-rated products (>4.5 stars) in the same category
    "relatedProducts": *[
      _type == "product" 
      && count((categories[]->slug.current)[@ in ^.categories[]->slug.current]) > 0
      && customerRating >= 4.5
    ] | order(reviewCount desc)[0...4] {
      title,
      brand,
      "slug": slug.current,
      price,
      currency,
      customerRating,
      mainImage { asset, alt }
    }
  }
`

// 4. DEALS QUERY (Optimized with Smart Fallbacks)
export const ALL_DEALS_QUERY = groq`
  *[_type == "deal" && isActive == true] | order(featured desc, _createdAt desc) {
    _id,
    _createdAt,
    "title": coalesce(title, product->title),
    description,
    "image": coalesce(image.asset->url, product->mainImage.asset->url),
    "affiliateLink": coalesce(affiliateLink, product->affiliateLink),
    originalPrice,
    dealPrice,
    discountPercentage,
    category,
    dealEndDate,
    isPrimeExclusive,
    "rating": coalesce(rating, product->customerRating),
    "reviewCount": coalesce(reviewCount, product->reviewCount),
    featured,
    couponCode, 
    couponNote 
  }
`