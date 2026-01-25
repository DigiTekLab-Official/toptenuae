import { client } from "@/sanity/lib/client";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

import { generateSeoMetadata } from "@/utils/seo-manager";
import { generateSchema } from "@/lib/schemaGenerator";
import JsonLd from "@/components/sanity/JsonLd";
import ProductView from "@/components/views/ProductView";
import { PRODUCT_BY_SLUG_QUERY } from "@/sanity/lib/queries";

// Next.js 15 - Static Generation Config
export const revalidate = 3600; 
export const dynamicParams = true; 

// ----------------------------
// TYPES
// ----------------------------
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface ProductData {
  _id: string;
  _type?: string; 
  title: string;
  brand?: string;
  slug: string;
  price?: number;
  currency?: string;
  availability?: string;
  priceTier?: string;
  retailer?: string;
  affiliateLink?: string;
  pros?: string[];
  cons?: string[];
  keyFeatures?: string[];
  customerRating?: number;
  reviewCount?: number;
  verdict?: string;
  mainImage?: { url: string; alt?: string }; 
  itemDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  _updatedAt?: string;
  _createdAt?: string;
  publishedAt?: string;
}

// ----------------------------
// STATIC PARAMS GENERATION
// ----------------------------
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const products = await client.fetch<Array<{ slug: string }>>(
      `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }[0...100]`
    );
    return products.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.error("Error generating static params for reviews:", error);
    return [];
  }
}

// ----------------------------
// METADATA GENERATION
// ----------------------------
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) return { title: "Not Found", robots: { index: false } };

  try {
    const data = await client.fetch<ProductData | null>(
      PRODUCT_BY_SLUG_QUERY,
      { slug },
      { cache: "force-cache", next: { revalidate: 3600 } }
    );

    if (!data) return { title: "Not Found", robots: { index: false } };

    // ✅ FIX 1: Ensure Canonical URL matches your new clean structure
    const canonicalUrl = `https://toptenuae.com/reviews/${slug}`;

    const transformedData = {
      ...data,
      url: canonicalUrl,
      slug: { current: slug },
      _type: data._type || "product",
    };

    return generateSeoMetadata(transformedData, { category: "reviews", slug });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: "Error", robots: { index: false } };
  }
}

// ----------------------------
// PAGE COMPONENT
// ----------------------------
export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) notFound();

  let data: ProductData | null = null;

  try {
    data = await client.fetch<ProductData | null>(
      PRODUCT_BY_SLUG_QUERY,
      { slug },
      { cache: "force-cache", next: { revalidate: 3600 } }
    );
  } catch (error) {
    console.error(`Error fetching product review [${slug}]:`, error);
    notFound();
  }

  if (!data) notFound();

  // Smart Redirection Logic
  if (data._type === 'topTenList') {
    permanentRedirect(`/top-ten/${slug}`);
  }
  if (data._type === 'holiday' || data._type === 'event' || data._type === 'article') {
    permanentRedirect(`/events-holidays/${slug}`);
  }

  // ✅ FIX 2: FORCE "REVIEW" SUFFIX FOR H1
  // We create a new object 'viewData' to pass to the UI component.
  // This changes the Title on the page (H1) without changing the data sent to Schema/Google.
  const viewData = {
    ...data,
    title: data.title.toLowerCase().endsWith('review') 
      ? data.title 
      : `${data.title} Review`
  };

  // Prepare Schema Data (Keep original title for Schema accuracy)
  const schemaData = generateSchema(
    {
      ...data, // Use original data here so Product Schema name remains "Braun Series 5..."
      slug: { current: slug },
      _type: data._type || "product",
    },
    "reviews", 
    slug
  );

  return (
    <>
      <JsonLd data={schemaData} />
      {/* Pass the modified viewData with the "Review" suffix to the frontend */}
      <ProductView data={viewData} />
    </>
  );
}