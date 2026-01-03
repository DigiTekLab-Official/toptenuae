// src/app/[category]/[slug]/page.tsx

// ✅ REQUIRED: Cloudflare needs this for dynamic routes
export const runtime = 'edge';

import { client } from "@/sanity/lib/client";
import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo-manager"; 
import { generateSchema } from "@/lib/schemaGenerator"; 
import JsonLd from '@/components/JsonLd';

// IMPORT THE NEW VIEWS
import ToolView from "@/components/views/ToolView";
import ProductView from "@/components/views/ProductView";
import ArticleView from "@/components/views/ArticleView";

// --- CONFIGURATION ---
export const revalidate = 61; 

// --- QUERY ---
const QUERY = `*[slug.current == $slug][0]{
  "slug": slug.current, _id, _type, title, description, seo, showAffiliateDisclosure,
  brand, affiliateLink, retailer, price, currency, availability,
  priceTier, customerRating, reviewCount, realComplaint, verdict, 
  keyFeatures, pros, cons, itemDescription,
  dealPrice, originalPrice, discountPercentage, couponCode, couponNote, dealEndDate, isPrimeExclusive,
  "linkedProduct": product->{ title, brand, mainImage{asset, alt}, affiliateLink, retailer },
  componentId, heroBadge, heroTitleSuffix, heroTags,
  relatedTools[]->{ title, "slug": slug.current, componentId },
  content[] { ..., _type == "image" => { ..., asset, alt, caption, display }, _type == "table" => { ... }, _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current } } },
  author->{name, "slug": slug.current}, 
  intro,
  "introContent": select( _type != "topTenList" && _type != "tool" => intro[] { ..., _type == "image" => { ..., asset, alt, caption, display }, _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current } }, _type == "navigationGrid" => { _type, title, items[] { label, description, "imageUrl": image.asset->url, "targetSlug": targetPost->slug.current } } }, null ),
  body[] { ..., _type == "image" => { ..., asset, alt, caption, display }, _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current } }, _type == "navigationGrid" => { _type, title, items[] { label, description, "imageUrl": image.asset->url, "targetSlug": targetPost->slug.current } }, _type == "table" => { ... } },
  closingContent[] { ..., _type == "image" => { ..., asset, alt, caption }, _type == "table" => { ... }, _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current } } },  
  "mainImage": coalesce(mainImage, product->mainImage) { ..., "url": asset->url, alt },
  "category": coalesce(categories[0], category)->{ "title": title, "slug": slug.current, "menuLabel": menuLabel },
  "publishedAt": _createdAt, "_updatedAt": _updatedAt, 
  faqs[] { _key, question, answer },
  startDate, endDate, locationName, address, ticketPrice,
  listItems[] { 
    _key, rank, badgeLabel, whySelected, customVerdict, 
    product->{ title, "slug": slug.current, mainImage { asset, alt, "url": asset->url }, affiliateLink, retailer, priceTier, price, currency, availability, realComplaint, customerRating, reviewCount, verdict, keyFeatures, pros, cons, itemDescription } 
  }
}`;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// --- SEO: Metadata Generation ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  
  // ✅ UPDATED QUERY: Fetch "categorySlug" to fix canonical tags
  const data = await client.fetch(
    `*[slug.current == $slug][0]{ 
      title, 
      description, 
      seo, 
      "imageUrl": mainImage.asset->url, 
      _type,
      "slug": slug,
      dealPrice, 
      price, 
      linkedProduct->{mainImage},
      "categorySlug": coalesce(categories[0]->slug.current, category->slug.current)
    }`,
    { slug }
  );

  if (!data) return { title: "Page Not Found" };
  
  // Pass the data (including the new categorySlug) to the manager
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
  if (data.category && data.category.slug && data.category.slug !== category && category !== 'deals' && category !== 'reviews') {
    permanentRedirect(`/${data.category.slug}/${slug}`);
  }

  // ✅ GLOBAL SCHEMA GENERATION
  const schemaData = generateSchema(data);

  // --- RENDER STRATEGY ---
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
                { "@type": "ListItem", "position": 2, "name": data.category?.title || "Tools", "item": `https://toptenuae.com/${category}` },
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