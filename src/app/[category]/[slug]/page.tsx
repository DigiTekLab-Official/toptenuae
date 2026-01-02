// src/app/[category]/[slug]/page.tsx

// ⚠️ Commented out 'edge' to prevent timeouts with complex queries/ISR
// export const runtime = 'edge';

import { client } from "@/sanity/lib/client";
import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { generateSeoMetadata } from "@/utils/seo-manager"; // ✅ Use your new Manager

// Dynamic Components
import ClientToolRenderer from "@/components/tools/ClientToolRenderer"; 

// Icons
import {
  Calculator, Percent, ArrowRight, Coins, HeartHandshake, Car, Plane, TrendingUp
} from "lucide-react";

// Templates
import TopTenTemplate from "@/components/templates/TopTenTemplate";
import ArticleTemplate from "@/components/templates/ArticleTemplate";
import EventTemplate from "@/components/templates/EventTemplate";
import ProductTemplate from "@/components/templates/ProductTemplate";

// Components
import Breadcrumb from "@/components/Breadcrumb";
import Sidebar from "@/components/Sidebar";
import JsonLd from '@/components/JsonLd';
import PortableText from "@/components/PortableText";
import RelatedTools from "@/components/tools/RelatedTools";
import FAQAccordion from "@/components/FAQAccordion"; 

// --- CONFIGURATION ---
export const revalidate = 60; 

// --- UTILS ---
const safeJsonLdString = (value: unknown) => {
  if (!value) return '';
  return String(value).replace(/[\u2028\u2029"<>&]/g, ''); 
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-AE", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai",
  }).format(new Date(dateString));
};

const getToolConfig = (slug: string) => {
  if (!slug) return { icon: Calculator, iconColor: '', iconBg: '', ctaLabel: 'View' };
  if (slug.includes('vat')) return { icon: Percent, iconColor: 'text-[#4b0082] group-hover:text-white', iconBg: 'bg-blue-50 group-hover:bg-[#4b0082]', ctaLabel: 'Calculate VAT' };
  if (slug.includes('zakat')) return { icon: HeartHandshake, iconColor: 'text-indigo-500 group-hover:text-white', iconBg: 'bg-indigo-50 group-hover:bg-indigo-500', ctaLabel: 'Calculate Zakat' };
  if (slug.includes('gratuity')) return { icon: Coins, iconColor: 'text-amber-500 group-hover:text-white', iconBg: 'bg-amber-50 group-hover:bg-amber-500', ctaLabel: 'Calculate Benefits' };
  if (slug.includes('loan') || slug.includes('car')) return { icon: Car, iconColor: 'text-sky-500 group-hover:text-white', iconBg: 'bg-sky-50 group-hover:bg-sky-600', ctaLabel: 'Estimate EMI' };
  if (slug.includes('visa') || slug.includes('freelance')) return { icon: Plane, iconColor: 'text-violet-500 group-hover:text-white', iconBg: 'bg-violet-50 group-hover:bg-violet-500', ctaLabel: 'Compare Costs' };
  if (slug.includes('roi')) return { icon: TrendingUp, iconColor: 'text-emerald-500 group-hover:text-white', iconBg: 'bg-emerald-50 group-hover:bg-emerald-500', ctaLabel: 'Check ROI' };
  return { icon: Calculator, iconColor: 'text-purple-600 group-hover:text-white', iconBg: 'bg-purple-50 group-hover:bg-purple-600', ctaLabel: 'Calculate Now' };
};

// --- QUERY ---
const QUERY = `*[slug.current == $slug][0]{
  _id, _type, title, description, seo, showAffiliateDisclosure,
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
  
  // Lightweight query for SEO
  const data = await client.fetch(
    `*[slug.current == $slug][0]{ 
      title, description, seo, "imageUrl": mainImage.asset->url, _type,
      dealPrice, price, linkedProduct->{mainImage} 
    }`,
    { slug }
  );

  if (!data) return { title: "Page Not Found" };

  // ✅ USES YOUR MANAGER (Cleaner & consistent)
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

  // ---------------------------------------------------------------------------
  // 1. RENDER STRATEGY: TOOL
  // ---------------------------------------------------------------------------
  if (data._type === "tool") {
    const toolSchema = {
      "@context": "https://schema.org", "@type": "SoftwareApplication",
      "name": safeJsonLdString(data.title), "description": safeJsonLdString(data.description),
      "applicationCategory": "FinanceApplication", "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "AED" },
      "url": `https://toptenuae.com/${category}/${slug}`
    };
    const faqSchema = data.faqs ? {
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": data.faqs.map((f: any) => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } }))
    } : null;
    const breadcrumbSchema = {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://toptenuae.com" },
        { "@type": "ListItem", "position": 2, "name": data.category?.title || "Tools", "item": `https://toptenuae.com/${category}` },
        { "@type": "ListItem", "position": 3, "name": data.title, "item": `https://toptenuae.com/${category}/${slug}` }
      ]
    };

    return (
      <main className="min-h-screen bg-slate-50 font-sans">
        <JsonLd data={toolSchema} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        {/* HERO */}
        <section className="bg-[#4b0082] relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-0 right-0 w-1/2 h-full bg-white/10 blur-3xl rounded-full translate-x-1/3"></div>
          <div aria-hidden="true" className="absolute bottom-0 left-0 w-1/3 h-full bg-amber-500/20 blur-3xl rounded-full -translate-x-1/3"></div>
          <div className="container mx-auto px-4 pt-12 pb-24 lg:pt-10 lg:pb-14 relative z-10">
            <div className="mb-4">
              <Breadcrumb categoryName={data.category?.menuLabel || "Tools"} categorySlug={data.category?.slug || "tools"} postTitle={data.title} postSlug={slug} isDarkBackground={true} />
            </div>
            <div className="flex flex-col-reverse md:flex-col lg:flex-row items-start gap-12 lg:gap-16">
              <div className="flex-1 text-center lg:text-left mt-4 text-white">
                {data.heroBadge && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-sm font-semibold uppercase tracking-wide">{data.heroBadge}</span>
                  </div>
                )}
                <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
                  {data.title} <br />
                  {data.heroTitleSuffix && <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">{data.heroTitleSuffix}</span>}
                </h1>
                <div className="text-lg text-purple-100 mb-8 leading-relaxed opacity-90 max-w-2xl mx-auto lg:mx-0">{data.intro || data.description}</div>
              </div>
              <div className="w-full max-w-lg shrink-0 mx-auto lg:mx-0"><ClientToolRenderer id={data.componentId} /></div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-6xl mx-auto px-4 py-16 relative z-20">
          <div id="tool-portal-root" className="mb-12 font-sans"></div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 lg:p-12">
            {data.content && <div className="prose prose-slate prose-lg max-w-none font-sans mb-12"><PortableText value={data.content} /></div>}
            {data.faqs && <div className="mt-12 pt-8 border-t border-gray-100"><FAQAccordion faqs={data.faqs} /></div>}
            <div className="mt-16 pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Explore Other Tools</h3>
              {data.relatedTools?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.relatedTools.map((tool: any) => {
                    if (!tool.slug) return null;
                    const config = getToolConfig(tool.slug);
                    const ToolIcon = config.icon;
                    return (
                      <Link key={tool.slug} href={`/${category}/${tool.slug}`} className="group relative block h-full focus:outline-none focus:ring-2 focus:ring-[#4b0082] rounded-2xl">
                        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-300 hover:border-[#4b0082]/30 transition-all h-full flex flex-col overflow-hidden">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${config.iconBg}`}>
                            <ToolIcon className={`w-7 h-7 transition-colors duration-300 ${config.iconColor}`} />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-auto group-hover:text-[#4b0082] transition-colors">{tool.title}</h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : <RelatedTools currentTool={slug.includes('zakat') ? 'zakat' : slug.includes('vat') ? 'vat' : 'gratuity'} />}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. RENDER STRATEGY: PRODUCT & DEALS
  // ---------------------------------------------------------------------------
  if (data._type === "product" || data._type === "deal") {
    const displayPrice = data._type === 'deal' ? data.dealPrice : data.price;
    const displayCurrency = data.currency || "AED";
    const displayAffiliate = data._type === 'deal' ? (data.affiliateLink || data.linkedProduct?.affiliateLink) : data.affiliateLink;
    const displayTitle = data.title || data.linkedProduct?.title;
    
    const productSchema = {
      "@context": "https://schema.org/", "@type": "Product",
      "name": safeJsonLdString(displayTitle),
      "image": data.mainImage?.url ? [data.mainImage.url] : [],
      "description": safeJsonLdString(data.description || data.verdict || displayTitle),
      "brand": { "@type": "Brand", "name": safeJsonLdString(data.brand || data.linkedProduct?.brand || "Brand") },
      "offers": {
        "@type": "Offer", "url": displayAffiliate, "priceCurrency": displayCurrency, "price": displayPrice,
        "availability": data.availability || "https://schema.org/InStock",
        "priceValidUntil": data.dealEndDate,
        "seller": { "@type": "Organization", "name": safeJsonLdString(data.retailer || "Amazon.ae") }
      },
      ...(data.customerRating && { "aggregateRating": { "@type": "AggregateRating", "ratingValue": data.customerRating, "reviewCount": data.reviewCount || "1" } })
    };

    return (
      <>
        <JsonLd data={productSchema} />
        <ProductTemplate data={{ ...data, title: displayTitle, price: displayPrice, affiliateLink: displayAffiliate }} />
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. RENDER STRATEGY: ARTICLES / LISTS / EVENTS
  // ---------------------------------------------------------------------------
  const templateData = { ...data, category: data.category || undefined, listItems: data.listItems };
  const schemaData = {
    ...data,
    schemaType: (data._type === 'event' || data._type === 'holiday') ? 'event' : data._type,
    url: `https://toptenuae.com/${category}/${slug}`, 
    products: data.listItems?.map((item: any) => ({
      name: safeJsonLdString(item.product?.title || "Product"),
      slug: item.product?.affiliateLink,
      image: { url: item.product?.mainImage?.url },
      ...item
    }))
  };

  const displayDate = data._updatedAt || data.publishedAt;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <JsonLd data={schemaData} />
      <Breadcrumb categoryName={data.category?.menuLabel || data.category?.title || category} categorySlug={data.category?.slug || category} postTitle={data.title} postSlug={slug} />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-5">
        <main className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <header className="border-b border-gray-100 pb-6">
            
            {/* 🗑️ "TOP 10 REVIEW" BADGE REMOVED FROM HERE */}
            
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tight">{data.title}</h1>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              {data.author && <div className="flex items-center gap-2"><span className="font-semibold text-gray-900">By {data.author.name}</span><span className="text-gray-300">•</span></div>}
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-900">Last Updated:</span><time dateTime={displayDate}>{formatDate(displayDate)}</time></div>
            </div>
            {/* ✅ OPTIMIZED IMAGE SECTION */}
            {data.mainImage?.url && (data._type === "article" || data._type === "news") && (
               <div className="mt-6 relative w-full h-[auto] aspect-video rounded-xl overflow-hidden bg-gray-100">
                 <Image 
                   src={data.mainImage.url} 
                   alt={data.mainImage.alt || data.title}
                   fill
                   className="object-cover"
                   priority={true}
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 850px"
                   quality={85}
                 />
               </div>
            )}
          </header>
          {data._type === "topTenList" ? <TopTenTemplate data={templateData} /> :
            (data._type === "event" || data._type === "holiday") ? <EventTemplate data={templateData} /> :
              <ArticleTemplate data={templateData} />}
        </main>
        <Sidebar currentSlug={slug} categorySlug={data.category?.slug} />
      </div>
    </div>
  );
}