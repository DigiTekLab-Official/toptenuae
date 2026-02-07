// src/sanity/queries/category.queries.ts --- QUERIES FOR CATEGORIES ---
import { groq } from 'next-sanity';

// =============================================================================
// CATEGORY QUERIES
// =============================================================================

export const ALL_CATEGORIES = groq`
  *[_type == "category" && defined(slug.current)] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    mainImage { "url": asset->url, alt }
  }
`;

export const CATEGORY_BY_SLUG = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    mainImage { "url": asset->url, alt },
    seo { metaTitle, metaDescription }
  }
`;

export const CATEGORY_POSTS = groq`
  *[_type in ["article", "product", "topTenList", "howTo"] 
    && references(*[_type == "category" && slug.current == $category]._id)]
    | order(publishedAt desc)[0...50]{
      _id,
      _type,
      title,
      "slug": slug.current,
      mainImage { "url": asset->url, alt },
      publishedAt
    }
`;

export const CATEGORY_PRODUCTS = groq`
  *[_type == "product" && category->slug.current == $slug]
    | order(publishedAt desc)[0...50]{
      _id,
      title,
      "slug": slug.current,
      price,
      currency,
      mainImage { "url": asset->url, alt },
      customerRating,
      intro,
      reviewCount
    }
`;