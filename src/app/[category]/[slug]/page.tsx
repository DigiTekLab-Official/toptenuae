// src/app/[category]/[slug]/page.tsx

export const runtime = 'nodejs'; 
export const revalidate = 3600; 
export const dynamicParams = true;

import { client } from "@/sanity/lib/client";
import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
// Ensure this path matches where you saved the SEO manager
import { generateSeoMetadata } from "@/utils/seo-manager"; 
import { generateSchema } from "@/lib/schemaGenerator"; 
import JsonLd from '@/components/sanity/JsonLd';

// IMPORT VIEWS
import ToolView from "@/components/views/ToolView";
import ProductView from "@/components/views/ProductView";
import ArticleView from "@/components/views/ArticleView";

// =============================================================================
// LOGIC SYNCHRONIZATION (Must Match Sitemap & Next Config)
// =============================================================================

// 1. Manual Overrides (Critical for Migration Fixes)
const manualOverrides: Record<string, string> = {
  'best-baby-monitors-uae': 'parenting-kids',
  'best-baby-skincare-uae': 'parenting-kids',
  'where-to-donate-used-toys-uae': 'parenting-kids',
  'best-educational-toys-uae': 'parenting-kids',
  'top-10-schools-dubai-2026-khda-fees-reviews': 'parenting-kids',
  'samsung-galaxy-s26-ultra-specs-uae-price': 'tech',
  'quantum-computing-guide-uae': 'tech',
  'how-to-pay-zakat-in-uae-online': 'lifestyle',
  'charity-organizations-uae-donations': 'lifestyle',
  'how-to-clean-washing-machine': 'smart-home',
  'ramadan-2026-uae': 'events-holidays',
};

// 2. Normalize Categories
const normalizeCategory = (categorySlug: string, postSlug?: string) => {
  // A. Check specific post overrides first
  if (postSlug && manualOverrides[postSlug]) {
    return manualOverrides[postSlug];
  }

  // B. Standard Category Mapping
  const map: Record<string, string> = {
    'travel-tourism': 'events-holidays',
    'health-fitness': 'lifestyle',
    'baby-kid': 'parenting-kids',
    'buyers-guide': 'reviews',
    'deals': 'deals',
    'tech': 'tech',
    'public-holidays-events': 'events-holidays',
    'how-to-guides': 'smart-home',
  };
  
  return map[categorySlug] || categorySlug;
};

// =============================================================================
// DATA QUERY
// =============================================================================
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
    _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current, "category": coalesce(categories[0]->slug.current, category->slug.current) } } 
  },
  
  author->{name, "slug": slug.current}, 
  intro,
  
  "introContent": select( 
    _type != "topTenList" && _type != "tool" => intro[] { 
      ..., 
      _type == "image" => { ..., asset, alt, caption, display }, 
      _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current, "category": coalesce(categories[0]->slug.current, category->slug.current) } }, 
      _type == "navigationGrid" => { _type, title, items[] { label, description, "imageUrl": image.asset->url, "targetSlug": targetPost->slug.current } } 
    }, 
    null 
  ),
  
  body[] { 
    ..., 
    _type == "image" => { ..., asset, alt, caption, display }, 
    _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current, "category": coalesce(categories[0]->slug.current, category->slug.current) } }, 
    _type == "navigationGrid" => { _type, title, items[] { label, description, "imageUrl": image.asset->url, "targetSlug": targetPost->slug.current } }, 
    _type == "table" => { ... } 
  },
  
  closingContent[] { 
    ..., 
    _type == "image" => { ..., asset, alt, caption }, 
    _type == "table" => { ... }, 
    _type == "relatedLink" => { _type, label, preText, targetPost->{ title, "slug": slug.current, "category": coalesce(categories[0]->slug.current, category->slug.current) } } 
  },  
  
  "mainImage": coalesce(image, mainImage, product->mainImage) { ..., "url": asset->url, alt },
  "category": coalesce(categories[0], category)->{ "title": title, "slug": slug.current, "menuLabel": menuLabel },
  "publishedAt": _createdAt, "_updatedAt": _updatedAt, 
  faqs[] { _key, question, answer },
  startDate, endDate, locationName, address, ticketPrice,
  
  listItems[] { 
    _key, rank, badgeLabel, whySelected, customVerdict, 
    product->{ 
      _type, title, "slug": slug.current, 
      "mainImage": mainImage { asset, alt, "url": asset->url }, 
      affiliateLink, retailer, priceTier, price, currency, availability, 
      realComplaint, customerRating, reviewCount, verdict, keyFeatures, 
      pros, cons, itemDescription,
      location, address, curriculum, rating, feeRange, realityCheck, website,
      entityType, code, country
    } 
  },

  "relatedLists": *[
    _type == "topTenList" 
    && _id != ^._id 
    && count((categories[]->slug.current)[@ in ^.categories[]->slug.current]) > 0
  ] | order(publishedAt desc)[0...3] {
    title, "slug": slug.current,
    "category": coalesce(categories[0]->slug.current, "reviews"),
    intro, "mainImage": mainImage { asset, alt, "url": asset->url }
  },

  "relatedProducts": *[
    _type == "product" 
    && count((categories[]->slug.current)[@ in ^.categories[]->slug.current]) > 0
    && customerRating >= 4.5
  ] | order(reviewCount desc)[0...4] {
    title, brand, "slug": slug.current,
    "category": coalesce(categories[0]->slug.current, "products"),
    price, currency, customerRating, "mainImage": mainImage { asset, alt, "url": asset->url }
  }
}`;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// =============================================================================
// STATIC PARAMS GENERATION
// =============================================================================
export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type in ["tool", "product", "article", "deal", "topTenList", "holiday", "event", "howTo", "charity"] && defined(slug.current)]{
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current, "reviews")
    }`
  );

  return slugs.map((doc: any) => ({
    category: normalizeCategory(doc.category, doc.slug), 
    slug: doc.slug,
  }));
}

// =============================================================================
// METADATA GENERATION
// =============================================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  
  const data = await client.fetch(
    `*[slug.current == $slug][0]{ 
      title, description, intro, verdict, itemDescription,
      seo, "imageUrl": mainImage.asset->url, 
      _type, "slug": slug.current, dealPrice, price, linkedProduct->{mainImage},
      "primaryCategory": coalesce(categories[0]->slug.current, category->slug.current)
    }`,
    { slug }
  );

  if (!data) {
    return { 
      title: "Page Not Found | TopTenUAE",
      description: "The requested content could not be found."
    };
  }

  // Determine the ONE true canonical category
  const masterCategory = normalizeCategory(data.primaryCategory || 'reviews', slug);
  const masterUrl = `https://toptenuae.com/${masterCategory}/${slug}`;

  // Pass strict canonical to SEO manager
  return generateSeoMetadata({ ...data, url: masterUrl }, { category, slug });
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================
export default async function Page({ params }: PageProps) {
  const { category, slug } = await params;
  
  const data = await client.fetch(QUERY, { slug });

  if (!data) notFound();

  // --- THE GUARD: STRICT REDIRECT LOGIC ---
  const rawCategory = data.category?.slug || 'reviews';
  // Check override/normalization using the Post Slug
  const correctCategory = normalizeCategory(rawCategory, slug);

  // If user is at /reviews/baby-monitor but should be at /parenting-kids/baby-monitor
  if (correctCategory !== category) {
    permanentRedirect(`/${correctCategory}/${slug}`);
  }

  const schemaData = generateSchema(data);

  return (
    <>
      <JsonLd data={schemaData} />
      
      {/* Tool Breadcrumb Schema Injection */}
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

      {/* Render View Based on Type */}
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