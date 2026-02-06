import { client } from "@/sanity/lib/client";
import { cache } from 'react';
import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo-manager";
import { generateSchema } from "@/lib/schemaGenerator";
import JsonLd from '@/components/sanity/JsonLd';
import ArticleView from "@/components/views/ArticleView";
import { GENERIC_POST_QUERY, TOP_TEN_LIST_QUERY } from "@/sanity/lib/queries";
import { groq } from 'next-sanity';

// Cloudflare Pages: Fully static generation (no ISR)
export const dynamicParams = true;

// =============================================================================
// ✅ NEW: Dedicated Query for How-To / News Articles
// =============================================================================
const HOW_TO_QUERY = groq`
  *[_type == "howTo" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    intro,
    body,
    // Fetch the new FAQ section we just added
    faqs, 
    // Schema has 'howToSteps', fetch them if they exist
    howToSteps,
    // Schema uses Capital 'Author', map it to lowercase 'author' for the View
    "author": Author->{ name, image, bio },
    mainImage { 
      alt,
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    },
    // Map categories correctly
    "categories": categories[]->{ "slug": slug.current, title },
    // Get SEO metadata
    seo { metaTitle, metaDescription, shareImage }
  }
`;

// Helper: Normalize Categories
const normalizeCategory = (categorySlug: string) => {
  const map: Record<string, string> = {
    'travel-tourism': 'events-holidays',
    'health-fitness': 'lifestyle',
    'baby-kid': 'parenting-kids',
    'buyers-guide': 'reviews',
  };
  return map[categorySlug] || categorySlug;
};

// Validated Category Cache
const getCategoryValidation = cache(async () => {
  try {
    const categories = await client.fetch(groq`
      *[_type == "category"]{ "slug": slug.current }
    `);
    return new Set(categories.map((c: any) => c.slug));
  } catch {
    return new Set();
  }
});

// ✅ UPDATED: Fetch function with explicit 'howTo' support
const getPostData = cache(async (slug: string) => {
  // 1. Detect the document type first
  const docType = await client.fetch(
    groq`*[slug.current == $slug][0]._type`,
    { slug }
  );
  
  // 2. Route to the correct query
  if (docType === 'topTenList') {
    return await client.fetch(TOP_TEN_LIST_QUERY, { slug });
  }
  
  // ✅ FIX: Explicitly handle the new 'howTo' type
  if (docType === 'howTo') {
    return await client.fetch(HOW_TO_QUERY, { slug });
  }
  
  // Fallback for standard 'article' or 'tool'
  return await client.fetch(GENERIC_POST_QUERY, { slug });
});

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type in ["tool", "article", "topTenList", "howTo", "holiday", "event"] && defined(slug.current)]{
      _type,
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current)
    }`
  );
  return slugs.map((doc: any) => {
    let category = doc.category;
    
    // Fallback logic if no category is assigned in Sanity
    if (!category) {
      switch(doc._type) {
        case 'howTo':
          category = 'how-to-guides';
          break;
        case 'holiday':
        case 'event':
          category = 'events-holidays';
          break;
        case 'tool':
          category = 'finance-tools';
          break;
        default:
          category = 'reviews';
      }
    }
    
    return {
      category: normalizeCategory(category),
      slug: doc.slug,
    };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const data = await getPostData(slug);

  if (!data) return { title: "Page Not Found" };
  
  const primaryCat = data.categories?.[0]?.slug?.current || data.category?.slug?.current;
  const masterCategory = normalizeCategory(primaryCat || 'reviews');
  const imageUrl = data.mainImage?.url || data.mainImage?.asset?.url || null;

  return generateSeoMetadata({ 
    ...data, 
    imageUrl, 
    url: `https://toptenuae.com/${masterCategory}/${slug}` 
  }, { category, slug });
}

export default async function Page({ params }: PageProps) {
  const { category, slug } = await params;
  const data = await getPostData(slug);

  if (!data) notFound();

  // Validate category
  const validCategories = await getCategoryValidation();
  
  // Logic to determine the "Canonical" category
  let defaultCat = 'reviews';
  if (data._type === 'holiday' || data._type === 'event') defaultCat = 'events-holidays';
  if (data._type === 'tool') defaultCat = 'finance-tools';
  if (data._type === 'howTo') defaultCat = 'how-to-guides';

  const rawCategory = data.category?.slug?.current || 
                      data.categories?.[0]?.slug?.current || 
                      defaultCat;
                      
  const correctCategory = normalizeCategory(rawCategory);

  // If the user manually went to /tech/samsung... and the post is in 'tech', this passes.
  if (validCategories.size > 0 && !validCategories.has(correctCategory)) {
    // If the category doesn't exist at all in Sanity, 404
    notFound();
  }

  // Redirect /upcoming/slug -> /tech/slug (if Tech is the primary category)
  if (correctCategory !== category) {
    permanentRedirect(`/${correctCategory}/${slug}`);
  }

  const schemaData = generateSchema(data);

  return (
    <>
      <JsonLd data={schemaData} />
      <ArticleView data={data} category={category} slug={slug} />
    </>
  );
}