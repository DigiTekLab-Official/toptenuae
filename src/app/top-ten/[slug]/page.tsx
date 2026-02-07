import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { generateSeoMetadata } from "@/utils/seo-manager";
import { generateSchema } from "@/lib/schemaGenerator";
import JsonLd from "@/components/sanity/JsonLd";
import { TOP_TEN_LIST_QUERY } from "@/sanity/lib/queries";
import ArticleView from "@/components/views/ArticleView";

export const dynamicParams = true; 

// ----------------------------
// TYPES
// ----------------------------
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ✅ FIX: Updated interface to match the new Query output
interface TopTenListData {
  title: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  socialShareImage?: string;
  intro?: any[];
  body?: any[];
  closingContent?: any[];
  showAffiliateDisclosure?: boolean;
  
  // ✅ CHANGED: From { asset: any } to { url: string }
  mainImage?: { url: string; alt?: string };
  
  faqs?: Array<{ _key: string; question: string; answer: string }>;
  listItems?: any[];
  relatedLists?: any[];
  relatedProducts?: any[];
  _type?: string;
  _updatedAt?: string;
  _createdAt?: string;
}

// ----------------------------
// STATIC PARAMS GENERATION
// ----------------------------
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const lists = await client.fetch<Array<{ slug: string }>>(
      `*[_type == "topTenList" && defined(slug.current)]{
        "slug": slug.current
      }[0...100]` 
    );

    return lists.map((l) => ({
      slug: l.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for top-ten:", error);
    return [];
  }
}

// ----------------------------
// METADATA GENERATION
// ----------------------------
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Page Not Found | TopTenUAE",
      robots: { index: false, follow: false },
    };
  }

  try {
    const data = await client.fetch<TopTenListData | null>(
      TOP_TEN_LIST_QUERY,
      { slug },
      { cache: "force-cache" }
    );

    if (!data) {
      return {
        title: "Page Not Found | TopTenUAE",
        robots: { index: false, follow: false },
      };
    }

    const canonicalUrl = `https://toptenuae.com/top-ten/${slug}`;

    // Transform mainImage to match expected format
    const transformedData = {
      ...data,
      url: canonicalUrl,
      slug: { current: slug },
      _type: data._type || "article",
      // ✅ FIX: Explicitly ensure mainImage matches the shape required by generateSeoMetadata
      mainImage: data.mainImage ? { url: data.mainImage.url, alt: data.mainImage.alt } : undefined,
    };

    return generateSeoMetadata(transformedData, { category: "top-ten", slug });
  } catch (error) {
    console.error("Error generating metadata for top-ten:", error);
    return {
      title: "Error | TopTenUAE",
      robots: { index: false, follow: false },
    };
  }
}

// ----------------------------
// PAGE COMPONENT
// ----------------------------
export default async function TopTenPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) notFound();

  let data: TopTenListData | null = null;

  try {
    data = await client.fetch<TopTenListData | null>(
      TOP_TEN_LIST_QUERY,
      { slug },
      { cache: "force-cache" }
    );
  } catch (error) {
    console.error(`Error fetching top-ten list [${slug}]:`, error);
    notFound();
  }

  if (!data) notFound();

  // Generate structured data
  const transformedSchemaData = {
    ...data,
    slug: { current: slug },
    _type: data._type || "article",
  };

  const schemaData = generateSchema(
    transformedSchemaData,
    "top-ten", 
    slug
  );

  // Transform data for view
  const transformedData = {
    ...data,
    listItems: data.listItems || [],
    relatedLists: data.relatedLists || [],
    relatedProducts: data.relatedProducts || [],
  };

  return (
    <>
      <JsonLd data={schemaData} />
      <ArticleView data={transformedData} category="top-ten" slug={slug} />
    </>
  );
}