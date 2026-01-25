import { client } from "@/sanity/lib/client";
import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo-manager";
import { generateSchema } from "@/lib/schemaGenerator";
import JsonLd from '@/components/sanity/JsonLd';
import ArticleView from "@/components/views/ArticleView";
import { GENERIC_POST_QUERY } from "@/sanity/lib/queries";

export const revalidate = 3600;
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

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  // ✅ FIX: Added 'holiday' and 'event' to static generation list
  const slugs = await client.fetch(
    `*[_type in ["tool", "article", "topTenList", "howTo", "holiday", "event"] && defined(slug.current)]{
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current, "reviews")
    }`
  );
  return slugs.map((doc: any) => ({
    category: normalizeCategory(doc.category),
    slug: doc.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  
  const data = await client.fetch(
    `*[slug.current == $slug][0]{ 
      title, description, intro, seo, "imageUrl": mainImage.asset->url, 
      "primaryCategory": coalesce(categories[0]->slug.current, category->slug.current)
    }`, { slug }
  );

  if (!data) return { title: "Page Not Found" };
  
  const masterCategory = normalizeCategory(data.primaryCategory || 'reviews');
  return generateSeoMetadata({ ...data, url: `https://toptenuae.com/${masterCategory}/${slug}` }, { category, slug });
}

export default async function Page({ params }: PageProps) {
  const { category, slug } = await params;
  const data = await client.fetch(GENERIC_POST_QUERY, { slug });

  if (!data) notFound();

  // ✅ FIX: Smart Fallback Logic
  // If post is holiday/event, default to 'events-holidays'. Else default to 'reviews'.
  let defaultCat = 'reviews';
  if (data._type === 'holiday' || data._type === 'event') defaultCat = 'events-holidays';
  if (data._type === 'tool') defaultCat = 'finance-tools'; // or similar

  const rawCategory = data.category?.slug || defaultCat;
  const correctCategory = normalizeCategory(rawCategory);

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