// src/app/[category]/[slug]/page.tsx

// 1. FORCE NODE.JS RUNTIME (The Fix)
// This ensures Sanity fetches complete and HTML is fully generated for Bing.
export const runtime = 'nodejs'; 

// 2. KEEP YOUR EXISTING SETTINGS
export const revalidate = 3600; 
export const dynamicParams = true;

import { client } from "@/sanity/lib/client";
import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo-manager"; 
import { generateSchema } from "@/lib/schemaGenerator"; 
import JsonLd from '@/components/JsonLd';

// IMPORT VIEWS
import ToolView from "@/components/views/ToolView";
import ProductView from "@/components/views/ProductView";
import ArticleView from "@/components/views/ArticleView";

// --- HELPER: Normalize Old Categories (Matches Sitemap Logic) ---
const normalizeCategory = (slug: string) => {
  const map: Record<string, string> = {
    'travel-tourism': 'events-holidays',
    'health-fitness': 'lifestyle',
    'baby-kid': 'parenting-kids',
    'buyers-guide': 'reviews',
    'deals': 'deals',
    'tech': 'tech',
  };
  return map[slug] || slug;
};

// --- UPDATED MASTER QUERY ---
const QUERY = `*[slug.current == $slug][0]{
  "slug": slug.current, _id, _type, title, description, seo, showAffiliateDisclosure,
  brand, affiliateLink, retailer, price, currency, availability,
  priceTier, customerRating, reviewCount, realComplaint, verdict, 
  keyFeatures, pros, cons, itemDescription,
  dealPrice, originalPrice, discountPercentage, couponCode, couponNote, dealEndDate, isPrimeExclusive,
  
  "seoTitle": coalesce(seo.metaTitle, title),
  "seoDescription": coalesce(seo.metaDescription, intro, description),
  "socialShareImage": seo.shareGraphic.asset->url,

  "linkedProduct": product->{ title, brand, mainImage{asset, alt}, affiliateLink, retailer },
  componentId, heroBadge, heroTitleSuffix, heroTags,
  relatedTools[]->{ title, "slug": slug.current, componentId },
  
  content[] { 
    ..., 
    _type == "image" => { ..., asset, alt, caption, display }, 
    _type == "table" => { ... }, 
    _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current } } 
  },
  
  author->{name, "slug": slug.current}, 
  intro,
  
  "introContent": select( 
    _type != "topTenList" && _type != "tool" => intro[] { 
      ..., 
      _type == "image" => { ..., asset, alt, caption, display }, 
      _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current } }, 
      _type == "navigationGrid" => { _type, title, items[] { label, description, "imageUrl": image.asset->url, "targetSlug": targetPost->slug.current } } 
    }, 
    null 
  ),
  
  body[] { 
    ..., 
    _type == "image" => { ..., asset, alt, caption, display }, 
    _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current } }, 
    _type == "navigationGrid" => { _type, title, items[] { label, description, "imageUrl": image.asset->url, "targetSlug": targetPost->slug.current } }, 
    _type == "table" => { ... } 
  },
  
  closingContent[] { 
    ..., 
    _type == "image" => { ..., asset, alt, caption }, 
    _type == "table" => { ... }, 
    _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current } } 
  },  
  
  "mainImage": coalesce(image, mainImage, product->mainImage) { ..., "url": asset->url, alt },
  "category": coalesce(categories[0], category)->{ "title": title, "slug": slug.current, "menuLabel": menuLabel },
  "publishedAt": _createdAt, "_updatedAt": _updatedAt, 
  faqs[] { _key, question, answer },
  startDate, endDate, locationName, address, ticketPrice,
  
  listItems[] { 
    _key, rank, badgeLabel, whySelected, customVerdict, 
    product->{ title, "slug": slug.current, mainImage { asset, alt, "url": asset->url }, affiliateLink, retailer, priceTier, price, currency, availability, realComplaint, customerRating, reviewCount, verdict, keyFeatures, pros, cons, itemDescription } 
  },

  "relatedLists": *[
    _type == "topTenList" 
    && _id != ^._id 
    && count((categories[]->slug.current)[@ in ^.categories[]->slug.current]) > 0
  ] | order(publishedAt desc)[0...3] {
    title,
    "slug": slug.current,
    "category": coalesce(categories[0]->slug.current, "reviews"),
    intro,
    mainImage { asset, alt }
  },

  "relatedProducts": *[
    _type == "product" 
    && count((categories[]->slug.current)[@ in ^.categories[]->slug.current]) > 0
    && customerRating >= 4.5
  ] | order(reviewCount desc)[0...4] {
    title,
    brand,
    "slug": slug.current,
    "category": coalesce(categories[0]->slug.current, "products"),
    price,
    currency,
    customerRating,
    mainImage { asset, alt }
  }
}`;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// 2. CRITICAL FIX: Add 'holiday', 'event', 'howTo', 'charity' to static params
// Previously, these types were missing, so Next.js didn't know they existed.
export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type in ["tool", "product", "article", "deal", "topTenList", "holiday", "event", "howTo", "charity"] && defined(slug.current)]{
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current, "reviews")
    }`
  );

  return slugs.map((doc: any) => ({
    category: normalizeCategory(doc.category), // Normalize here too
    slug: doc.slug,
  }));
}

// --- SEO: Metadata Generation ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  
  const data = await client.fetch(
    `*[slug.current == $slug][0]{ 
      title, description, seo, "imageUrl": mainImage.asset->url, 
      _type, "slug": slug.current, dealPrice, price, linkedProduct->{mainImage},
      "categorySlug": coalesce(categories[0]->slug.current, category->slug.current)
    }`,
    { slug }
  );

  if (!data) return { title: "Page Not Found" };
  return generateSeoMetadata(data, { category, slug });
}

// --- MAIN PAGE COMPONENT ---
export default async function Page({ params }: PageProps) {
  const { category, slug } = await params;
  const data = await client.fetch(QUERY, { slug });

  if (!data) notFound();

  // 🛑 SEO GUARD: Redirects
  if (data._type === 'product' && category !== 'products' && category !== 'reviews') {
     // Optional: permanentRedirect(`/reviews/${slug}`); 
  }
  if (data._type === 'deal' && category !== 'deals') permanentRedirect(`/deals/${slug}`);
  
  // 3. FIX: Normalize the database category before checking mismatch
  // If Sanity says 'travel-tourism', we convert it to 'events-holidays'
  // This prevents the page from redirecting you endlessly or 404ing.
  const rawCategory = data.category?.slug || 'reviews';
  const correctCategory = normalizeCategory(rawCategory);

  if (correctCategory !== category && category !== 'deals' && category !== 'reviews') {
    // Only redirect if the NORMALIZED category doesn't match the URL
    permanentRedirect(`/${correctCategory}/${slug}`);
  }

  const schemaData = generateSchema(data);

  return (
    <>
      <JsonLd data={schemaData} />
      
      {data._type === "tool" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org", "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://toptenuae.com" },
                { "@type": "ListItem", "position": 2, "name": data.category?.title === "Finance Tools" ? "Finance Tools" : (data.category?.title || "Calculators"), "item": `https://toptenuae.com/${category}` },
                { "@type": "ListItem", "position": 3, "name": data.title, "item": `https://toptenuae.com/${category}/${slug}` }
              ]
            })
          }}
        />
      )}

      {data._type === "tool" ? (
        <ToolView data={data} category={category} slug={slug} />
      ) : data._type === "product" || data._type === "deal" ? (
        <ProductView data={data} />
      ) : (
        <ArticleView data={data} category={category} slug={slug} />
      )}
    </>
  );
}