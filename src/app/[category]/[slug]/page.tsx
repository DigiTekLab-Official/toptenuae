// src/app/[category]/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { cache } from 'react';
import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo-manager";
import { generateSchema } from "@/lib/schemaGenerator";
import JsonLd from '@/components/sanity/JsonLd';
import ArticleView from "@/components/views/ArticleView";
import { GENERIC_POST_QUERY } from "@/sanity/lib/queries";

// Cloudflare Pages: Fully static generation (no ISR)
export const dynamicParams = true;

// Helper: Normalize Categories
const normalizeCategory = (categorySlug: string) => {
  const map: Record<string, string> = {
    'travel-tourism': 'events-holidays',
    'health-fitness': 'lifestyle',
    'baby-kid': 'parenting-kids',
    'buyers-guide': 'reviews',
    'tech': 'tech',
  };
  return map[categorySlug] || categorySlug;
};

// ✅ OPTIMIZATION: Cached fetch function
// This ensures that even though we call this in generateMetadata AND Page,
// Sanity is only queried ONCE per request.
const getPostData = cache(async (slug: string) => {
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
    
    // If category is not set, use type-based defaults
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
          category = 'reviews'; // Only fallback to reviews if needed
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
  
  // ✅ USE CACHED FETCH
  const data = await getPostData(slug);

  if (!data) return { title: "Page Not Found" };
  
  // Extract category for canonical URL
  const primaryCat = data.categories?.[0]?.slug?.current || data.category?.slug?.current;
  const masterCategory = normalizeCategory(primaryCat || 'reviews');
  
  // Construct image URL if available (Safe check for mainImage)
  const imageUrl = data.mainImage?.asset?.url || null;

  return generateSeoMetadata({ 
    ...data, 
    imageUrl, // Explicitly pass image if your util expects it flattened
    url: `https://toptenuae.com/${masterCategory}/${slug}` 
  }, { category, slug });
}

export default async function Page({ params }: PageProps) {
  const { category, slug } = await params;
  
  // ✅ USE CACHED FETCH (Deduplicated)
  const data = await getPostData(slug);

  if (!data) notFound();

  // Smart Fallback Logic
  let defaultCat = 'reviews';
  if (data._type === 'holiday' || data._type === 'event') defaultCat = 'events-holidays';
  if (data._type === 'tool') defaultCat = 'finance-tools';
  if (data._type === 'howTo') defaultCat = 'how-to-guides';

  // Determine correct category
  const rawCategory = data.category?.slug?.current || 
                      data.categories?.[0]?.slug?.current || 
                      defaultCat;
                      
  const correctCategory = normalizeCategory(rawCategory);

  // Redirect if URL category doesn't match canonical category
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