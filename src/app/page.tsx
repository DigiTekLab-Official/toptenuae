export const runtime = 'edge'; 
export const revalidate = 60; 

import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo-manager";
import JsonLd from "@/components/JsonLd"; 
import HomeNewsletter from "@/components/HomeNewsletter";
import CategorySection from "@/components/home/CategorySection";

import { 
  ArrowRight, 
  Flame, 
  Zap, 
  Calculator, 
  Percent, 
  Coins, 
  CreditCard, 
  PieChart,
  Clock
} from "lucide-react";

// --- SEO ---
export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    title: "TopTenUAE – Best Reviews, Deals & Free Finance Calculators (2026)",
    description: "Compare the best products in the UAE and find verified deals. Access free finance calculators for VAT, Gratuity, and Salary.",
    url: "https://toptenuae.com",
    _type: "website",
    imageUrl: "https://toptenuae.com/images/brand/og-home.jpg"
  });
}

// --- HELPER: Tools Icon Config ---
const getToolConfig = (slug: string) => {
  if (slug.includes("vat")) return { icon: Percent, ctaLabel: "Calculate VAT", iconColor: "text-blue-600", iconBg: "bg-blue-50" };
  if (slug.includes("zakat")) return { icon: Coins, ctaLabel: "Calculate Zakat", iconColor: "text-amber-600", iconBg: "bg-amber-50" };
  if (slug.includes("gratuity")) return { icon: PieChart, ctaLabel: "Check Gratuity", iconColor: "text-emerald-600", iconBg: "bg-emerald-50" };
  if (slug.includes("loan") || slug.includes("emi")) return { icon: CreditCard, ctaLabel: "Calculate EMI", iconColor: "text-purple-600", iconBg: "bg-purple-50" };
  return { icon: Calculator, ctaLabel: "Use Tool", iconColor: "text-primary", iconBg: "bg-primary/10" };
};

const formatDate = (date: string) => 
  new Date(date).toLocaleDateString("en-AE", { month: "long", day: "numeric", year: "numeric" });

// --- QUERY ---
const HOMEPAGE_QUERY = `{
  "featured": *[_type in ["topTenList", "howTo", "article"] && defined(slug.current)] | order(featured desc, publishedAt desc)[0]{
    _id, title, "slug": slug.current, intro, "imageUrl": mainImage.asset->url,
    "category": coalesce(categories[0]->title, category->title, "General"),
    "categorySlug": coalesce(categories[0]->slug.current, category->slug.current, "general"),
    publishedAt
  },
  
  "tech": *[_type == "article" && "tech" in categories[]->slug.current && defined(slug.current)] | order(publishedAt desc)[0...4]{
    _id, title, "slug": slug.current, intro, "imageUrl": mainImage.asset->url, publishedAt
  },

  "reviews": *[_type == "topTenList" && defined(slug.current)] | order(publishedAt desc)[0...4]{
    _id, title, "slug": slug.current, intro, "imageUrl": mainImage.asset->url, publishedAt
  },

  "holidays": *[_type == "event" || "events-holidays" in categories[]->slug.current] | order(startDate desc, publishedAt desc)[0...4]{
    _id, title, "slug": slug.current, intro, "imageUrl": mainImage.asset->url, publishedAt
  },

  "parenting": *[_type == "article" && "parenting-kids" in categories[]->slug.current] | order(publishedAt desc)[0...4]{
    _id, title, "slug": slug.current, intro, "imageUrl": mainImage.asset->url, publishedAt
  },

  "finance": *[_type == "tool"] | order(publishedAt desc)[0...4]{
    _id, _type, title, "slug": slug.current, intro, "imageUrl": mainImage.asset->url, publishedAt
  },

  "latest": *[_type in ["topTenList", "howTo", "article"] && defined(slug.current)] | order(publishedAt desc)[0...4]{
    _id, _type, title, "slug": slug.current, intro, "imageUrl": mainImage.asset->url,
    "category": coalesce(categories[0]->title, category->title, "General"),
    "categorySlug": coalesce(categories[0]->slug.current, category->slug.current, "general"),
    publishedAt
  }
}`;

export default async function Home() {
  let data;
  try {
    data = await client.fetch(HOMEPAGE_QUERY);
  } catch (error) {
    console.error("🔥 Sanity Fetch Error:", error);
    return null; 
  }

  const { featured, tech, reviews, holidays, parenting, finance, latest } = data || {};

  if (!featured) return <div className="min-h-screen flex items-center justify-center p-10 text-gray-500">Updating Content...</div>;

  const heroDescription = (Array.isArray(featured.intro) ? featured.intro[0]?.children?.[0]?.text : featured.intro) || "Read our latest comprehensive review for the UAE market.";

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "name": "TopTenUAE", "url": "https://toptenuae.com", "logo": { "@type": "ImageObject", "url": "https://toptenuae.com/images/brand/logoIcon.svg" } },
      { "@type": "WebSite", "name": "TopTenUAE", "url": "https://toptenuae.com" }
    ]
  };

  return (
    <main className="font-sans">
      <JsonLd data={homeSchema} />
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {featured.imageUrl && (
            <Image 
              src={featured.imageUrl}
              alt={featured.title}
              fill
              className="object-cover opacity-40 blur-sm scale-105"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10 max-w-7xl">
          <div className="max-w-3xl">
            {featured.category && (
              <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {featured.category}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-shadow-sm">
              {featured.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 line-clamp-2 max-w-2xl leading-relaxed">
              {heroDescription}
            </p>
            <Link 
              href={`/${featured.categorySlug || 'general'}/${featured.slug}`}
              prefetch={false}
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-105 shadow-lg"
            >
              Read Full Review <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LATEST UPDATES (GRID) */}
      <section className="container mx-auto px-4 py-12 max-w-7xl">
         <div className="flex items-center gap-2 mb-6">
            <div className="bg-amber-100 p-2 rounded-lg"><Flame className="w-5 h-5 text-amber-600" /></div>
            <h2 className="text-2xl font-black text-gray-900">Latest Updates</h2>
         </div>
         {latest && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {latest.map((post: any) => (
                <Link key={post._id} href={`/${post.categorySlug || 'general'}/${post.slug}`} prefetch={false} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                  <div className="relative h-48 bg-gray-100">
                    {post.imageUrl ? <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform" /> : <div className="flex items-center justify-center h-full text-gray-300"><Zap className="w-8 h-8"/></div>}
                    
                    {/* ✅ BADGE ON IMAGE */}
                    <span className="absolute top-0 left-0 bg-primary text-white text-[10px] font-bold uppercase px-3 py-1 shadow-sm">
                       {post.category || 'New'}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                      <Clock className="w-3 h-3" />
                      {post.publishedAt ? formatDate(post.publishedAt) : "Recently"}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary line-clamp-2 mb-3 leading-tight">{post.title}</h3>
                    
                    {/* ✅ READ MORE LINK */}
                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center text-primary font-bold text-sm">
                       Read More <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
             ))}
           </div>
         )}
      </section>

      {/* 3. TECH SECTION */}
      {tech && tech.length > 0 && (
        <CategorySection title="Tech & AI" slug="tech" posts={tech} color="bg-blue-600" />
      )}

      {/* 4. REVIEWS SECTION */}
      {reviews && reviews.length > 0 && (
        <CategorySection title="Top 10 Reviews" slug="reviews" posts={reviews} color="bg-purple-600" />
      )}

      {/* 5. HOLIDAYS SECTION */}
      {holidays && holidays.length > 0 && (
        <CategorySection title="Events & Holidays" slug="events-holidays" posts={holidays} color="bg-emerald-500" />
      )}

      {/* 6. PARENTING SECTION */}
      {parenting && parenting.length > 0 && (
        <CategorySection title="Parenting & Kids" slug="parenting-kids" posts={parenting} color="bg-pink-500" />
      )}

      {/* 7. FINANCE TOOLS SECTION (Restored Custom Design) */}
      {finance && finance.length > 0 && (
        <section className="container mx-auto px-4 py-12 border-t border-gray-100 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>Finance Tools</span>
              <span className="h-1 w-12 mt-1 bg-amber-500"></span>
            </h2>
            <Link href="/finance-tools" prefetch={false} className="text-sm font-bold text-gray-500 hover:text-primary">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {finance.map((tool: any) => {
                 const config = getToolConfig(tool.slug);
                 const ToolIcon = config.icon;
                 return (
                  <Link key={tool._id} href={`/finance-tools/${tool.slug}`} prefetch={false} className="group relative block h-full">
                    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-300 hover:border-primary/30 transition-all h-full flex flex-col items-center text-center">
                       {/* ✅ DESIGN RESTORED: Centered Icon + Calculator Design */}
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${config.iconBg}`}>
                         <ToolIcon className={`w-8 h-8 ${config.iconColor}`} />
                       </div>
                       
                       <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                       <p className="text-sm text-gray-500 line-clamp-2 mb-6">Free updated calculator for UAE residents.</p>

                       <div className="mt-auto inline-flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:scale-105 transition-transform bg-primary/5 px-4 py-2 rounded-lg">
                         {config.ctaLabel} <ArrowRight className="w-4 h-4 ml-2" />
                       </div>
                    </div>
                  </Link>
                 )
             })}
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="bg-primary/5 border-y border-primary/10 py-16 mt-8">
        <div className="container mx-auto px-4 text-center max-w-7xl">
           <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Don't Miss the Best UAE Deals</h2>
           <HomeNewsletter />
        </div>
      </section>
    </main>
  );
}