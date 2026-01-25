// src/app/page.tsx - ADDED UPCOMING SECTION
export const revalidate = 86400; 
export const runtime = 'nodejs';

import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo-manager";
import JsonLd from "@/components/sanity/JsonLd"; 
import HomeNewsletter from "@/components/HomeNewsletter";
import { cleanText } from "@/lib/utils/sanity-text";
import { mainImage, listImage, blurImage } from "@/sanity/lib/image";
import { generateSchema } from "@/lib/schemaGenerator";
import LogoIcon from "@/components/icons/LogoIcon";

import { 
  ArrowRight, 
  Zap, 
  Clock, 
  Calculator, 
  Percent, 
  Coins, 
  CreditCard, 
  PieChart,
  ShoppingBag,
  Sparkles,
  BookOpen,
  Calendar,
  Baby,
  Trophy,
  Rocket // New Icon for Upcoming
} from "lucide-react";

// Standard Categories (Upcoming is handled separately to sit on top)
const SELECTED_CATEGORIES = [
  "tech", "top-ten", "reviews", "how-to-guides",
  "events-holidays", "parenting-kids", "finance-tools"
]; 

// =============================================================================
// METADATA
// =============================================================================
export async function generateMetadata(): Promise<Metadata> {
  const title = "The Best of the UAE, Ranked & Smart Tools";
  const description = "Discover trending products, expert reviews, and free UAE tools including VAT and gratuity calculators. Your trusted guide to smarter choices in the Emirates.";

  return generateSeoMetadata({
    title: title,
    description: description,
    url: "https://toptenuae.com",
    _type: "website",
    imageUrl: "https://toptenuae.com/images/brand/og-home.png",
    seo: {
      metaTitle: title,
      metaDescription: description,
      keywords: [
        "UAE reviews", "product rankings", "best in UAE", "Dubai shopping guide",
        "VAT calculator", "gratuity calculator", "top 10 UAE", "UAE deals"
      ]
    }
  });
}

// =============================================================================
// TOOL CONFIGURATION
// =============================================================================
const getToolConfig = (slug: string) => {
  if (slug.includes("vat")) return { 
    icon: Percent, 
    ctaLabel: "Calculate VAT", 
    iconColor: "text-blue-600", 
    iconBg: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600"
  };
  if (slug.includes("zakat")) return { 
    icon: Coins, 
    ctaLabel: "Calculate Zakat", 
    iconColor: "text-amber-600", 
    iconBg: "bg-amber-50",
    gradient: "from-amber-500 to-amber-600"
  };
  if (slug.includes("gratuity")) return { 
    icon: PieChart, 
    ctaLabel: "Check Gratuity", 
    iconColor: "text-emerald-600", 
    iconBg: "bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-600"
  };
  if (slug.includes("loan") || slug.includes("emi")) return { 
    icon: CreditCard, 
    ctaLabel: "Calculate EMI", 
    iconColor: "text-purple-600", 
    iconBg: "bg-purple-50",
    gradient: "from-purple-500 to-purple-600"
  };
  return { 
    icon: Calculator, 
    ctaLabel: "Use Tool", 
    iconColor: "text-primary", 
    iconBg: "bg-primary/10",
    gradient: "from-[#4b0082] to-purple-600"
  };
};

// =============================================================================
// CATEGORY ICON MAP
// =============================================================================
const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'upcoming': return Rocket; // New Icon
    case 'tech': return Zap;
    case 'top-ten': return Trophy;
    case 'reviews': return Sparkles;
    case 'how-to-guides': return BookOpen;
    case 'events-holidays': return Calendar;
    case 'parenting-kids': return Baby;
    default: return Sparkles;
  }
};

// =============================================================================
// DATA QUERY
// =============================================================================
const HOME_QUERY = `
{
  "heroPost": *[_type in ["topTenList", "howTo", "article", "news"] && defined(slug.current)] | order(publishedAt desc)[0] {
    title,
    "slug": slug.current,
    "categorySlug": coalesce(categories[0]->slug.current, category->slug.current, "general"), 
    "categoryTitle": coalesce(categories[0]->title, category->title, "Featured"),
    mainImage {
      asset->{
        _id,
        url,
        metadata { dimensions, lqip }
      },
      alt,
      hotspot,
      crop
    }, 
    intro,
    publishedAt,
    _type
  },
  
  // ✅ UPDATE: Now accepts 'howTo' and 'topTenList' in Upcoming section too
  // ✅ CHECK: Matches category slug 'upcoming'
  "upcomingPosts": *[
    _type in ["article", "news", "product", "howTo", "topTenList"] && (
      subCategory->slug.current == "upcoming" || 
      "upcoming" in displayCategories[]->slug.current ||
      "upcoming" in categories[]->slug.current ||
      category->slug.current == "upcoming"
    )
  ] | order(publishedAt desc)[0...4] {
    title,
    "slug": slug.current,
    "categorySlug": "upcoming", 
    mainImage {
      asset->{
        _id,
        url,
        metadata { dimensions, lqip }
      },
      alt
    },
    publishedAt,
    _type,
    intro
  },

  "sections": *[_type == "category" && slug.current in ${JSON.stringify(SELECTED_CATEGORIES)}] | order(orderRank) {
    title,
    "slug": slug.current,
    description,
    "posts": *[_type in ["holiday", "topTenList", "howTo", "tool", "product", "article", "news"] && references(^._id)] | order(publishedAt desc)[0...4] {
      title,
      "slug": slug.current,
      mainImage {
        asset->{
          _id,
          url,
          metadata { dimensions, lqip }
        },
        alt
      },
      publishedAt,
      _type,
      intro
    }
  }
}`;

// =============================================================================
// HELPERS
// =============================================================================
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-AE", { 
    year: 'numeric', 
    month: 'long', 
    day: '2-digit',
    timeZone: 'Asia/Dubai'
  });
};

const getConciseAlt = (altText: string | undefined, title: string): string => {
  if (altText && altText.length > 0) {
    return altText.length > 120 ? altText.substring(0, 117) + '...' : altText;
  }
  return title.length > 120 ? title.substring(0, 117) + '...' : title;
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================
export default async function Home() {
  // Fetch data
  let data;
  try {
    data = await client.fetch(HOME_QUERY, {}, {
      cache: 'force-cache',
      next: { 
        revalidate: 86400,
        tags: ['homepage']
      }
    });
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold mb-2 text-gray-900">Content Temporarily Unavailable</h2>
        <p className="text-gray-600">We're updating our UAE guides. Please refresh in a moment.</p>
      </div>
    );
  }

  const { heroPost, sections, upcomingPosts } = data || {};

  if (!heroPost) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-600">Loading TopTenUAE content...</p>
      </div>
    );
  }

  // Sort sections
  const sortedSections = SELECTED_CATEGORIES
    .map(slug => sections?.find((s: any) => s.slug === slug))
    .filter(Boolean);

  // Process hero data
  const heroDescription = cleanText(heroPost?.intro) || 
    "Expert reviews and comprehensive rankings for the UAE market.";
  const heroImageUrl = heroPost.mainImage ? mainImage(heroPost.mainImage) : null;
  const heroBlurUrl = heroPost.mainImage ? blurImage(heroPost.mainImage) : undefined;

  // Collect featured posts for schema
  const featuredPosts = [
    ...(upcomingPosts || []),
    ...sortedSections.flatMap((section: any) => 
      section?.posts?.slice(0, 2).map((post: any) => ({
        title: post.title,
        slug: post.slug,
        categorySlug: section.slug
      })) || []
    )
  ];

  // Generate all schemas
  const allSchemas = generateSchema({ 
    ...heroPost, 
    featuredPosts 
  });

  return (
    <>
      <JsonLd data={allSchemas} />

      <main className="font-sans">
      
        <h1 className="sr-only">
          TopTenUAE - The Best of the UAE, Ranked, Reviewed & Smart Tools
        </h1>
   
        {/* ===================================================================== */}
        {/* 1. HERO SECTION - MAGAZINE LAYOUT                                    */}
        {/* ===================================================================== */}
        <section 
          className="relative bg-slate-900 text-white overflow-hidden"
          style={{ minHeight: '500px' }} 
          aria-labelledby="hero-title"
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            {heroImageUrl && (
              <Image 
                src={heroImageUrl}
                alt="" 
                fill
                className="object-cover opacity-20 blur-sm scale-105" 
                priority
                quality={75}
                sizes="100vw"
                placeholder={heroBlurUrl ? "blur" : "empty"}
                blurDataURL={heroBlurUrl}
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40" />
          </div>

          <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10 max-w-7xl h-full flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* LEFT COLUMN: Main Feature */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-6">
                  <LogoIcon className="w-6 h-6 text-amber-400" />
                  <span className="text-amber-400 font-bold tracking-widest uppercase text-sm md:text-sm">
                    Featured Review
                  </span>
                </div>

                <h2 id="hero-title" className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
                  {heroPost.title}
                </h2>

                <p className="text-lg text-slate-300 mb-8 line-clamp-3 max-w-2xl leading-relaxed border-l-4 border-primary pl-4">
                  {heroDescription}
                </p>

                <Link 
                  href={`/${heroPost.categorySlug}/${heroPost.slug}`}
                  prefetch={false}
                  className="inline-flex items-center gap-3 bg-white text-slate-900 font-bold px-8 py-4 rounded-full hover:bg-amber-400 hover:text-slate-900 transition-all transform hover:scale-105 shadow-xl group"
                  aria-label="Read full review" 
                >
                  Read Review 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>

              {/* RIGHT COLUMN: Trending Sidebar */}
              <div className="lg:col-span-4 hidden lg:block">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Trending Now
                  </h3>
                  
                  <div className="space-y-6">
                    {/* ✅ UPDATED LINK: Points to specific Upcoming section or category */}
                    <Link href="/upcoming" className="group block">
                      <span className="text-sm font-bold text-rose-400 mb-1 block">Tech Leaks</span>
                      <h4 className="text-white font-bold leading-snug group-hover:text-amber-400 transition-colors">
                        Samsung Galaxy S26 Ultra: Confirmed Specs & UAE Release Date
                      </h4>
                    </Link>

                    <Link href="/how-to-guides" className="group block border-t border-white/10 pt-4">
                      <span className="text-sm font-bold text-emerald-400 mb-1 block">Smart Living</span>
                      <h4 className="text-white font-bold leading-snug group-hover:text-amber-400 transition-colors">
                        How to Calculate Your Gratuity Correctly in 2026
                      </h4>
                    </Link>

                    <Link href="/deals" className="group block border-t border-white/10 pt-4">
                      <span className="text-sm font-bold text-amber-400 mb-1 block">Deal Alert 🔥</span>
                      <h4 className="text-white font-bold leading-snug group-hover:text-amber-400 transition-colors">
                        Price Drop: Sony WH-1000XM5 hits lowest price in Dubai
                      </h4>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 2. NEW SECTION: UPCOMING & LEAKS (Sit on Top)                        */}
        {/* ===================================================================== */}
        {upcomingPosts && upcomingPosts.length > 0 && (
          <section className="container mx-auto px-4 py-12 border-b border-gray-100 max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
              <Rocket className="w-8 h-8 text-[#4b0082]" strokeWidth={2.5} />
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                  Upcoming Releases & Leaks
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  What's coming next? Rumors, leaks, and confirmed launches.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {upcomingPosts.map((post: any) => {
                const cardImageUrl = post.mainImage ? listImage(post.mainImage) : null;
                const cardBlurUrl = post.mainImage ? blurImage(post.mainImage) : undefined;
                
                return (
                  <Link 
                    key={post.slug} 
                    href={`/upcoming/${post.slug}`} // Or dynamic based on post type
                    prefetch={false} 
                    className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden bg-gray-100 aspect-video">
                      {cardImageUrl && (
                        <Image
                          src={cardImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, 25vw"
                          placeholder={cardBlurUrl ? "blur" : "empty"}
                          blurDataURL={cardBlurUrl}
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-primary text-white text-[12px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Coming Soon
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-primary line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ===================================================================== */}
        {/* 3. STANDARD CATEGORY SECTIONS                                        */}
        {/* ===================================================================== */}
        {sortedSections?.map((section: any) => {
          const SectionIcon = getCategoryIcon(section.slug);
          
          return (
            section?.posts && section.posts.length > 0 && (
              <section 
                key={section.slug} 
                className="container mx-auto px-4 py-12 lg:py-16 border-b last:border-0 border-gray-100 max-w-7xl"
                aria-labelledby={`section-${section.slug}`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <SectionIcon className="w-8 h-8 text-[#4b0082]" strokeWidth={2.5} aria-hidden="true" />
                    <div>
                      <h2 id={`section-${section.slug}`} className="text-2xl md:text-3xl font-black text-gray-900">
                        {section.title}
                      </h2>
                      {section.description && (
                        <p className="text-sm text-gray-600 mt-1">{cleanText(section.description)}</p>
                      )}
                    </div>
                  </div>
                  <Link 
                    href={`/${section.slug}`} 
                    prefetch={false} 
                    className="text-sm font-bold text-primary hover:text-primary-700 hidden sm:flex items-center gap-1 transition-colors"
                  >
                    View All <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.posts.map((post: any, idx: number) => {
                    const isTool = post._type === "tool";
                    const isProduct = post._type === "product"; 
                    const postLink = `/${section.slug}/${post.slug}`;
                    
                    const cardImageUrl = post.mainImage ? listImage(post.mainImage) : null;
                    const cardBlurUrl = post.mainImage ? blurImage(post.mainImage) : undefined;
                    const conciseAlt = getConciseAlt(post.mainImage?.alt, post.title);

                    if (isTool) {
                      const config = getToolConfig(post.slug);
                      const ToolIcon = config.icon;
                      return (
                        <Link 
                          key={post.slug} 
                          href={postLink} 
                          prefetch={false} 
                          className="group relative block h-full"
                        >
                          <article className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200 hover:border-primary/30 transition-all h-full flex flex-col overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 bg-gradient-to-br ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${config.iconBg} group-hover:shadow-md relative z-10`}>
                              <ToolIcon className={`w-7 h-7 transition-colors duration-300 ${config.iconColor}`} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-auto group-hover:text-primary transition-colors relative z-10">
                              {post.title}
                            </h3>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-slate-600 font-bold text-sm group-hover:text-primary transition-colors relative z-10">
                              {config.ctaLabel} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </article>
                        </Link>
                      );
                    }

                    return (
                      <Link 
                        key={post.slug} 
                        href={postLink} 
                        prefetch={false} 
                        className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                      >
                        <article className="flex flex-col h-full">
                          <div 
                            className={`relative overflow-hidden ${isProduct ? 'bg-white' : 'bg-gray-100'}`}
                            style={{ aspectRatio: '16/9', minHeight: '200px' }}
                          >
                            {cardImageUrl ? (
                              <Image
                                src={cardImageUrl}
                                alt={conciseAlt} 
                                fill
                                loading={idx < 4 ? "eager" : "lazy"}
                                className={`transition-transform duration-700 ${
                                  isProduct 
                                    ? "object-contain p-4 group-hover:scale-105" 
                                    : "object-cover group-hover:scale-110"
                                }`}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                quality={80}
                                placeholder={cardBlurUrl ? "blur" : "empty"}
                                blurDataURL={cardBlurUrl}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Zap className="w-12 h-12 opacity-20" />
                              </div>
                            )}
                            {!isProduct && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                          </div>

                          <div className="p-5 flex flex-col flex-1">
                            {isProduct ? (
                               <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 text-emerald-600">
                                 <ShoppingBag className="w-3 h-3" /> Best Buy
                               </div>
                            ) : (
                              <time 
                                className="flex items-center gap-2 text-sm text-gray-600 font-bold uppercase tracking-wider mb-2"
                                dateTime={post.publishedAt}
                              >
                                <Clock className="w-3 h-3" />
                                {formatDate(post.publishedAt)}
                              </time>
                            )}
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                              {post.title}
                            </h3>
                            <span className="mt-auto inline-flex items-center text-base font-bold text-primary group-hover:translate-x-1 transition-transform">
                              {isProduct ? "Check Price" : "Read More"} <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-8 text-center sm:hidden">
                  <Link 
                    href={`/${section.slug}`} 
                    prefetch={false}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-700 transition-colors"
                  >
                    View All {section.title} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            )
          );
        })}

        {/* ===================================================================== */}
        {/* 4. NEWSLETTER SECTION                                                */}
        {/* ===================================================================== */}
        <section 
          className="bg-gradient-to-br from-primary/5 via-purple-50 to-primary/5 border-y border-primary/10 text-slate-800"
          style={{ minHeight: '320px' }}
          aria-labelledby="newsletter-title"
        >
          <div className="container mx-auto px-4 py-16 text-center max-w-7xl">
            <div className="max-w-2xl mx-auto">
              <h2 id="newsletter-title" className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                Join 10,000+ UAE Readers
              </h2>
              <p className="text-gray-700 mb-8 text-lg">
                Get the best of the UAE, ranked and delivered to your inbox. Smarter choices start here.
              </p>
              <HomeNewsletter />
              <p className="text-sm text-gray-600 mt-4 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Unsubscribe anytime. No spam, guaranteed.
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}