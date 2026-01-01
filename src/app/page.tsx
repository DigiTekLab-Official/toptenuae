// src/app/page.tsx

import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo-manager";
import JsonLd from "@/components/JsonLd"; 
import HomeNewsletter from "@/components/HomeNewsletter";

// Icons
import { 
  ArrowRight, 
  Flame, 
  Zap, 
  Clock, 
  Calculator, 
  Percent, 
  Coins, 
  CreditCard, 
  PieChart 
} from "lucide-react";

// --- CONFIGURATION ---
const SELECTED_CATEGORIES = ["tech", "reviews", "events-holidays", "parenting-kids", "finance-tools"]; 
export const revalidate = 60;

// --- SEO ---
export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    title: "TopTenUAE: Best Reviews, Deals & Government Tools 2026",
    description: "Your trusted guide for the best products, government services, and financial tools in Dubai and UAE. Calculate VAT, Gratuity, and find top deals.",
    url: "https://toptenuae.com",
    _type: "website",
    imageUrl: "https://toptenuae.com/images/brand/og-home.jpg" 
  });
}

// --- HELPER ---
const getToolConfig = (slug: string) => {
  if (slug.includes("vat")) return { icon: Percent, ctaLabel: "Calculate VAT", iconColor: "text-blue-600", iconBg: "bg-blue-50" };
  if (slug.includes("zakat")) return { icon: Coins, ctaLabel: "Calculate Zakat", iconColor: "text-amber-600", iconBg: "bg-amber-50" };
  if (slug.includes("gratuity")) return { icon: PieChart, ctaLabel: "Check Gratuity", iconColor: "text-emerald-600", iconBg: "bg-emerald-50" };
  if (slug.includes("loan") || slug.includes("emi")) return { icon: CreditCard, ctaLabel: "Calculate EMI", iconColor: "text-purple-600", iconBg: "bg-purple-50" };
  return { icon: Calculator, ctaLabel: "Use Tool", iconColor: "text-primary", iconBg: "bg-primary/10" };
};

// --- QUERY ---
const HOME_QUERY = `
{
  "heroPost": *[_type == "topTenList"] | order(publishedAt desc)[0] {
    title,
    "slug": slug.current,
    "categorySlug": category->slug.current, 
    "categoryTitle": category->title,
    "imageUrl": mainImage.asset->url,
    intro,
    publishedAt
  },
  "sections": *[_type == "category" && slug.current in ${JSON.stringify(SELECTED_CATEGORIES)}] {
    title,
    "slug": slug.current,
    "posts": *[_type in ["holiday", "topTenList", "howTo", "tool", "charity"] && references(^._id)] | order(publishedAt desc)[0...4] {
      title,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      publishedAt,
      _type
    }
  }
}`;

const formatDate = (date: string) => 
  new Date(date).toLocaleDateString("en-AE", { month: "long", day: "numeric", year: "numeric" });

export default async function Home() {
  const data = await client.fetch(HOME_QUERY);
  const { heroPost, sections } = data;

  if (!heroPost) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500">Loading content...</p>
      </div>
    );
  }

  const sortedSections = SELECTED_CATEGORIES
    .map(slug => sections?.find((s: any) => s.slug === slug))
    .filter(Boolean);

  const heroDescription = 
    heroPost.intro?.[0]?.children?.[0]?.text || 
    "Read our latest comprehensive review for the UAE market.";

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "TopTenUAE",
        "url": "https://toptenuae.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://toptenuae.com/images/brand/logoIcon.svg"
        },
        "sameAs": ["https://facebook.com/toptenuae", "https://x.com/toptenuae"]
      },
      {
        "@type": "WebSite",
        "name": "TopTenUAE",
        "url": "https://toptenuae.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://toptenuae.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <main className="font-sans">
      
      <JsonLd data={homeSchema} />
      
      {/* 1. HERO SECTION (Full width bg, contained content) */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroPost.imageUrl && (
            <Image 
              src={heroPost.imageUrl}
              alt=""
              fill
              className="object-cover opacity-40 blur-sm scale-105"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        {/* ✅ FIXED: Added max-w-7xl to constrain content */}
        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10 max-w-7xl">
          <div className="max-w-3xl">
            {heroPost.categoryTitle && (
              <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {heroPost.categoryTitle}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-shadow-sm">
              {heroPost.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 line-clamp-2 max-w-2xl leading-relaxed">
              {heroDescription}
            </p>
            <Link 
              href={`/${heroPost.categorySlug}/${heroPost.slug}`}
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-105 shadow-lg"
            >
              Read Full Review <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC CATEGORY SECTIONS */}
      {sortedSections && sortedSections.map((section: any) => (
        section.posts && section.posts.length > 0 && (
          // ✅ FIXED: Added max-w-7xl to align with other pages
          <section key={section.slug} className="container mx-auto px-4 py-12 border-b last:border-0 border-gray-100 max-w-7xl">
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                 <div className="bg-amber-100 p-2 rounded-lg">
                   <Flame className="w-5 h-5 text-amber-600" />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900">{section.title}</h2>
              </div>
              <Link href={`/${section.slug}`} className="text-sm font-bold text-primary hover:text-primary-700 hidden sm:block">
                View All {section.title} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.posts.map((post: any) => {
                
                const isTool = post._type === "tool";
                const postLink = `/${section.slug}/${post.slug}`;

                if (isTool) {
                   const config = getToolConfig(post.slug);
                   const ToolIcon = config.icon;
                   
                   return (
                    <Link key={post.slug} href={postLink} className="group relative block h-full">
                      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-300 hover:border-primary/30 transition-all h-full flex flex-col overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#4b0082]/5 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 group-hover:bg-[#4b0082]/10"></div>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${config.iconBg}`}>
                          <ToolIcon className={`w-7 h-7 transition-colors duration-300 ${config.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-auto group-hover:text-[#4b0082] transition-colors">
                          {post.title}
                        </h3>
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-slate-500 font-bold text-sm group-hover:text-[#4b0082] transition-colors">
                          {config.ctaLabel} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                   );
                }

                return (
                  <Link key={post.slug} href={postLink} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Zap className="w-10 h-10 opacity-20" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                        <Clock className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <span className="mt-auto inline-flex items-center text-base font-bold text-primary group-hover:translate-x-1 transition-transform">
                        Read <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                );

              })}
            </div>
            
            <div className="mt-6 text-center sm:hidden">
                <Link href={`/${section.slug}`} className="inline-block w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-lg hover:bg-gray-100">
                    View All {section.title}
                </Link>
            </div>

          </section>
        )
      ))}

      {/* 3. NEWSLETTER BANNER (Full width bg, contained content) */}
      <section className="bg-primary/5 border-y border-primary/10 py-16">
        {/* ✅ FIXED: Added max-w-7xl */}
        <div className="container mx-auto px-4 text-center max-w-7xl">
           <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
             Don't Miss the Best UAE Deals
           </h2>
           <p className="text-gray-600 max-w-xl mx-auto mb-8">
             Join 15,000+ subscribers getting our weekly "Top 10" digests and exclusive tech discounts delivered to their inbox.
           </p>
           <HomeNewsletter />

           <p className="text-sm text-gray-500 mt-4">
             Unsubscribe at any time. No spam, guaranteed.
           </p>
        </div>
      </section>

    </main>
  );
}