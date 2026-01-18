// src/app/page.tsx

// ✅ CLOUDFLARE FIX: Must use 'edge' runtime to match RootLayout and Cloudflare environment
export const runtime = 'edge';
export const revalidate = 86400; 

import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/utils/seo-manager";
import JsonLd from "@/components/sanity/JsonLd"; 
import HomeNewsletter from "@/components/HomeNewsletter";
import { cleanText } from "@/lib/utils/sanity-text";
import { mainImage, listImage } from "@/sanity/lib/image";
import { 
  generateOrganizationSchema, 
  generateWebSiteSchema,
  generateHomePageSchema
} from "@/lib/schemaGenerator";

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

const SELECTED_CATEGORIES = ["tech", "reviews", "events-holidays", "parenting-kids", "finance-tools"]; 

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    title: "The Best of the UAE, Ranked & Smart Tools",
    description: "Discover trending products, smart deals, and useful tools for UAE life — from tech and reviews to VAT & gratuity calculators.",
    url: "https://toptenuae.com",
    _type: "website",
    imageUrl: "https://toptenuae.com/images/brand/og-home.png"
  });
}

const getToolConfig = (slug: string) => {
  if (slug.includes("vat")) return { icon: Percent, ctaLabel: "Calculate VAT", iconColor: "text-blue-600", iconBg: "bg-blue-50" };
  if (slug.includes("zakat")) return { icon: Coins, ctaLabel: "Calculate Zakat", iconColor: "text-amber-600", iconBg: "bg-amber-50" };
  if (slug.includes("gratuity")) return { icon: PieChart, ctaLabel: "Check Gratuity", iconColor: "text-emerald-600", iconBg: "bg-emerald-50" };
  if (slug.includes("loan") || slug.includes("emi")) return { icon: CreditCard, ctaLabel: "Calculate EMI", iconColor: "text-purple-600", iconBg: "bg-purple-50" };
  return { icon: Calculator, ctaLabel: "Use Tool", iconColor: "text-primary", iconBg: "bg-primary/10" };
};

const HOME_QUERY = `
{
  "heroPost": *[_type in ["topTenList", "howTo", "article", "news"] && defined(slug.current)] | order(publishedAt desc)[0] {
    title,
    "slug": slug.current,
    "categorySlug": coalesce(categories[0]->slug.current, category->slug.current, "general"), 
    "categoryTitle": coalesce(categories[0]->title, category->title, "Featured"),
    mainImage, 
    intro,
    publishedAt
  },
  "sections": *[_type == "category" && slug.current in ${JSON.stringify(SELECTED_CATEGORIES)}] {
    title,
    "slug": slug.current,
    "posts": *[_type in ["holiday", "topTenList", "howTo", "tool", "charity"] && references(^._id)] | order(publishedAt desc)[0...4] {
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      _type
    }
  }
}`;

const formatDate = (date: string) => {
  const d = new Date(date);
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
};

export default async function Home() {
  let data;
  try {
    data = await client.fetch(HOME_QUERY);
  } catch (error) {
    console.error("Sanity Fetch Error on Home:", error);
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Content Connection Error</h2>
        <p className="text-gray-600">We're updating our UAE guides. Please refresh in a moment.</p>
      </div>
    );
  }

  const { heroPost, sections } = data || {};

  if (!heroPost) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-600">Initializing TopTenUAE engine...</p>
      </div>
    );
  }

  const sortedSections = SELECTED_CATEGORIES
    .map(slug => sections?.find((s: any) => s.slug === slug))
    .filter(Boolean);

  const heroDescription = 
    cleanText(heroPost?.intro) || 
    "Read our latest comprehensive review for the UAE market.";
    
  const heroImageUrl = heroPost.mainImage ? mainImage(heroPost.mainImage) : null;

  return (
    <>
      <JsonLd
        data={[
          generateOrganizationSchema(),
          generateWebSiteSchema(),
          generateHomePageSchema()
        ]}
      />
      <main className="font-sans">
      
      <h1 className="sr-only">
        TopTenUAE - The Best of the UAE, Ranked, Reviewed & Smart Tools
      </h1>
   
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImageUrl && (
            <Image 
              src={heroImageUrl}
              alt={heroPost.title}
              fill
              className="object-cover opacity-40 blur-sm scale-105"
              priority
              fetchPriority="high"
              quality={85}
              sizes="100vw"
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10 max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
               <span className="text-amber-400 font-bold tracking-widest uppercase text-xs md:text-sm">
                 The Best of the UAE, Ranked
               </span>
               <span className="w-8 h-[1px] bg-amber-400/50"></span>
            </div>
            {heroPost.categoryTitle && (
              <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {heroPost.categoryTitle}
              </span>
            )}
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-shadow-sm">
              {heroPost.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-200 mb-8 line-clamp-2 max-w-2xl leading-relaxed">
              {heroDescription}
            </p>
            <Link 
              href={`/${heroPost.categorySlug}/${heroPost.slug}`}
              prefetch={false}
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
          <section key={section.slug} className="container mx-auto px-4 py-12 border-b last:border-0 border-gray-100 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                 <div className="bg-amber-100 p-2 rounded-lg">
                   <Flame className="w-5 h-5 text-amber-600" />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900">{section.title}</h2>
              </div>
              <Link href={`/${section.slug}`} prefetch={false} className="text-sm font-bold text-primary hover:text-primary-700 hidden sm:block">
                View All {section.title} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.posts.map((post: any, idx: number) => {
                const isTool = post._type === "tool";
                const postLink = `/${section.slug}/${post.slug}`;
                
                // ✅ OPTIMIZED: Use listImage (640px) from Sanity
                const cardImageUrl = post.mainImage ? listImage(post.mainImage) : null;

                if (isTool) {
                   const config = getToolConfig(post.slug);
                   const ToolIcon = config.icon;
                   return (
                    <Link key={post.slug} href={postLink} prefetch={false} className="group relative block h-full">
                      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-300 hover:border-primary/30 transition-all h-full flex flex-col overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary/5 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${config.iconBg}`}>
                          <ToolIcon className={`w-7 h-7 transition-colors duration-300 ${config.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-auto group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-slate-500 font-bold text-sm group-hover:text-primary transition-colors">
                          {config.ctaLabel} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                   );
                }

                return (
                  <Link key={post.slug} href={postLink} prefetch={false} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                      {cardImageUrl ? (
                        <Image
                          src={cardImageUrl}
                          alt={post.title}
                          fill
                          loading={idx < 2 ? "eager" : "lazy"}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          quality={80}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Zap className="w-10 h-10 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-wider mb-2">
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
          </section>
        )
      ))}

      {/* 3. NEWSLETTER BANNER */}
      <section className="bg-primary/5 border-y border-primary/10 py-16 text-slate-800">
        <div className="container mx-auto px-4 text-center max-w-7xl">
           <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
             Join the TopTenUAE Community
           </h2>
           <p className="text-gray-600 max-w-xl mx-auto mb-8">
             Get the best of the UAE, ranked and delivered to your inbox. Smarter choices start here.
           </p>
           <HomeNewsletter />
           <p className="text-sm text-gray-700 mt-4">Unsubscribe at any time. No spam, guaranteed.</p>
        </div>
      </section>
      </main>
    </>
  );
}