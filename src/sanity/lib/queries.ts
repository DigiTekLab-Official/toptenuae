// src/sanity/lib/queries.ts
import { groq } from 'next-sanity'

// 1. SINGLE PRODUCT PAGE
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
    // ✅ FIX: Matched field name to your schema (was ratingCount)
    reviewCount,
    verdict,
    mainImage { asset, alt },
    itemDescription, 
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, title)
  }
`

// 2. TOP 10 LIST QUERY
export const TOP_TEN_LIST_QUERY = groq`
  *[_type == "topTenList" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    publishedAt,
    intro,
    body,
    closingContent,       
    showAffiliateDisclosure,
    mainImage { asset, alt },
    faqs[] { _key, question, answer },
    listItems[] {
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
    }
  }
`

// 3. DEALS QUERY (✅ UPDATED: Smart Fallback Logic)
export const ALL_DEALS_QUERY = groq`
  *[_type == "deal" && isActive == true] | order(featured desc, _createdAt desc) {
    _id,
    _createdAt,
    
    // Logic: Use Deal Title if filled, otherwise fetch Linked Product Title
    "title": coalesce(title, product->title),
    
    description,
    
    // Logic: Use Deal Image if filled, otherwise Linked Product Image
    // We fetch the asset URL directly to keep it a simple string for your frontend
    "image": coalesce(image.asset->url, product->mainImage.asset->url),
    
    // Logic: Use Deal Link if filled, otherwise Linked Product Link
    "affiliateLink": coalesce(affiliateLink, product->affiliateLink),
    
    originalPrice,
    dealPrice,
    discountPercentage,
    category,
    dealEndDate,
    isPrimeExclusive,
    
    // Logic: Fetch ratings from Product if missing on Deal
    "rating": coalesce(rating, product->customerRating),
    "reviewCount": coalesce(reviewCount, product->reviewCount),
    
    featured,
    couponCode, 
    couponNote 
  }
`