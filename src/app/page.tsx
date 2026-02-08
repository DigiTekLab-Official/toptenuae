// src/app/page.tsx
export const runtime = 'nodejs';

import { client } from "@/sanity/lib";
import { HOME_QUERY } from "@/sanity/lib"; // ✅ Query is now imported (saves ~55 lines here)
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/utils/seo-manager";
import JsonLd from "@/components/sanity/JsonLd"; 
import HomeNewsletter from "@/components/HomeNewsletter";
import { cleanText, formatDate, getConciseAlt } from "@/lib/utils/sanity-text";
import { mainImage, listImage, blurImage } from "@/sanity/lib";
import { generateSchema } from "@/lib/schemaGenerator";
import LogoIcon from "@/components/icons/LogoIcon";

// ✅ OPTIMIZED IMPORTS (Tree-Shaking)
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
  Rocket 
} from "@/components/icons";

// =============================================================================
// CONFIGURATION
// =============================================================================
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

  // Fetch hero image for LCP preload
  let heroImageData;
  try {
    heroImageData = await client.fetch(
      `*[_type in ["topTenList", "article"] && isFeaturedOnHome == true] | order(publishedAt desc) [0].mainImage`,
      {},
      { cache: 'force-cache', next: { tags: ['homepage'] } }
    );
  } catch {
    heroImageData = null;
  }

  const heroPreloadUrl = heroImageData ? mainImage(heroImageData) : null;

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
    },
    ...(heroPreloadUrl && {
      other: {
        'link': `<${heroPreloadUrl}>; rel="preload"; as="image"; fetchpriority="high"`
      }
    })
  });
}

// =============================================================================
// HELPER: TOOL CONFIGURATION
// =============================================================================
const getToolConfig = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("vat")) return { 
    icon: Percent, 
    ctaLabel: "Calculate VAT", 
    iconColor: "text-blue-600", 
    iconBg: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600"
  };
  if (s.includes("zakat")) return { 
    icon: Coins, 
    ctaLabel: "Calculate Zakat", 
    iconColor: "text-amber-600", 
    iconBg: "bg-amber-50",
    gradient: "from-amber-500 to-amber-600"
  };
  if (s.includes("gratuity")) return { 
    icon: PieChart, 
    ctaLabel: "Check Gratuity", 
    iconColor: "text-emerald-600", 
    iconBg: "bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-600"
  };
  if (s.includes("loan") || s.includes("emi")) return { 
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
// HELPER: CATEGORY ICON MAP
// =============================================================================
const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'upcoming': return Rocket;
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
// MAIN PAGE COMPONENT
// =============================================================================
export default async function Home() {
  // 1. Safe Data Fetching
  let data;
  try {
    // ✅ Use Centralized Query with Parameters
    data = await client.fetch(HOME_QUERY, { 
      categories: SELECTED_CATEGORIES 
    }, {
      cache: 'force-cache',
      next: { 
        tags: ['homepage']
      }
    });
  } catch (error) {
    console.error("🔥 Sanity Fetch Critical Error:", error);
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
           <LogoIcon className="w-12 h-12 text-primary mx-auto mb-4" />
           <h2 className="text-2xl font-black mb-2 text-slate-900">System Upgrade</h2>
           <p className="text-slate-600">We are currently updating our content database. Please check back in a few minutes.</p>
        </div>
      </div>
    );
  }

  // 2. Data Validation
  const { heroPost, sections, upcomingPosts } = data || {};

  if (!heroPost) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-slate-500 font-medium">Initializing TopTenUAE...</p>
      </div>
    );
  }

  // 3. Process Logic
  const sortedSections = SELECTED_CATEGORIES
    .map(slug => sections?.find((s: any) => s.slug === slug))
    .filter(Boolean);

  const heroDescription = cleanText(heroPost?.intro) || 
    "Expert reviews and comprehensive rankings for the UAE market.";
    
  const heroImageUrl = heroPost.mainImage ? mainImage(heroPost.mainImage) : null;
  const heroBlurUrl = heroPost.mainImage ? blurImage(heroPost.mainImage) : undefined;

  // 4. Schema Generation
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

  const allSchemas = generateSchema({ 
    ...heroPost, 
    featuredPosts 
  });

  return (
    <>
      <JsonLd data={allSchemas} />

      <main className="font-sans bg-white w-full">
      
        <h1 className="sr-only">
          TopTenUAE - The Best of the UAE, Ranked, Reviewed & Smart Tools
        </h1>
   
        {/* ===================================================================== */}
        {/* 1. HERO SECTION - MAGAZINE LAYOUT                                    */}
        {/* ===================================================================== */}
        <section 
          className="relative w-full bg-slate-900 text-white overflow-hidden"
          style={{ minHeight: '550px' }} 
          aria-labelledby="hero-title"
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            {heroImageUrl && (
              <Image 
                src={heroImageUrl}
                alt="" 
                fill
                style={{ objectFit: 'cover' }}
                className="opacity-30"
                priority={true}
                fetchPriority="high"
                decoding="sync"
                quality={75}
                sizes="100vw"
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/95 to-slate-900/40" />
          </div>

          <div className="container mx-auto px-4 py-12 lg:py-20 relative z-20 max-w-7xl w-full h-full flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-80px)] content-stretch">
              
              {/* LEFT COLUMN: Main Feature */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-400 text-slate-900 p-1.5 rounded-lg">
                    <LogoIcon className="w-5 h-5" />
                  </div>
                  <span className="text-amber-400 font-bold tracking-widest uppercase text-xs md:text-sm">
                    Featured Review
                  </span>
                </div>

                <h2 id="hero-title" className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight text-white">
                  {heroPost.title}
                </h2>

                <p className="text-lg md:text-xl text-slate-300 mb-10 line-clamp-3 max-w-2xl leading-relaxed border-l-4 border-amber-400 pl-6">
                  {heroDescription}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link 
                    href={`/${heroPost.categorySlug}/${heroPost.slug}`}
                    prefetch={false}
                    className="inline-flex items-center gap-3 bg-white text-slate-900 font-bold px-8 py-4 rounded-full hover:bg-amber-400 hover:text-slate-900 transition-all transform hover:-translate-y-1 shadow-xl shadow-white/5 group"
                    aria-label={`Read full review: ${heroPost.title}`}
                  >
                    Read Review 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: Trending Sidebar */}
              <div className="lg:col-span-4 hidden lg:block">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Trending Now
                  </h3>
                  
                  <div className="space-y-6">
                    <Link href="/upcoming" className="group block">
                      <span className="text-xs font-bold text-rose-400 mb-1 block uppercase">Tech Leaks</span>
                      <h4 className="text-white font-bold leading-snug group-hover:text-amber-400 transition-colors">
                        Samsung Galaxy S26 Ultra: Confirmed Specs & UAE Release Date
                      </h4>
                    </Link>

                    <Link href="/how-to-guides" className="group block border-t border-white/10 pt-4">
                      <span className="text-xs font-bold text-emerald-400 mb-1 block uppercase">Smart Living</span>
                      <h4 className="text-white font-bold leading-snug group-hover:text-amber-400 transition-colors">
                        Where to Donate Used Touys in UAE 2026 Guide
                      </h4>
                    </Link>

                    <Link href="/deals" className="group block border-t border-white/10 pt-4">
                      <span className="text-xs font-bold text-amber-400 mb-1 block uppercase">Deal Alert 🔥</span>
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
        {/* 2. NEW SECTION: UPCOMING & LEAKS                                    */}
        {/* ===================================================================== */}
        {upcomingPosts && upcomingPosts.length > 0 && (
          <section className="container mx-auto px-4 py-16 border-b border-gray-100 max-w-7xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-xl bg-[#4b0082]/10 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-[#4b0082]" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Upcoming Releases & Leaks
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  What's coming next? Rumors, leaks, and confirmed launches.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingPosts.map((post: any) => {
                const cardImageUrl = post.mainImage ? listImage(post.mainImage) : null;
                const cardBlurUrl = post.mainImage ? blurImage(post.mainImage) : undefined;
                
                return (
                  <Link 
                    key={post.slug} 
                    href={`/upcoming/${post.slug}`}
                    prefetch={false} 
                    className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden bg-gray-100 aspect-16/10">
                      {cardImageUrl && (
                        <Image
                          src={cardImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      )}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Coming Soon
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-primary line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <div className="mt-3 flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                         Read Rumor <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
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
                className="container mx-auto px-4 py-16 border-b last:border-0 border-gray-100 max-w-7xl"
                aria-labelledby={`section-${section.slug}`}
              >
                <div className="flex items-end justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                       <SectionIcon className="w-6 h-6 text-[#4b0082]" strokeWidth={2.5} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 id={`section-${section.slug}`} className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                        {section.title}
                      </h2>
                      {section.description && (
                        <p className="text-sm font-medium text-gray-500 mt-1 max-w-md line-clamp-1">{cleanText(section.description)}</p>
                      )}
                    </div>
                  </div>
                  <Link 
                    href={`/${section.slug}`} 
                    prefetch={false} 
                    className="text-xs font-bold text-primary hover:text-primary-700 hidden sm:flex items-center gap-1 transition-colors uppercase tracking-wider bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10"
                  >
                    View All <ArrowRight className="w-3 h-3" aria-hidden="true" />
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

                    // --- TOOL CARD VARIANT ---
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
                            {/* Decorative Gradient Background */}
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -mr-8 -mt-8 bg-linear-to-br ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                            
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${config.iconBg} group-hover:scale-110 relative z-10`}>
                              <ToolIcon className={`w-7 h-7 transition-colors duration-300 ${config.iconColor}`} />
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors relative z-10 leading-tight">
                              {post.title}
                            </h3>
                            
                            <p className="text-sm text-slate-500 mb-auto line-clamp-2 relative z-10">
                               Free tool for UAE residents.
                            </p>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-slate-700 font-bold text-xs uppercase tracking-wider group-hover:text-primary transition-colors relative z-10">
                              {config.ctaLabel} <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </article>
                        </Link>
                      );
                    }

                    // --- STANDARD / PRODUCT CARD VARIANT ---
                    return (
                      <Link 
                        key={post.slug} 
                        href={postLink} 
                        prefetch={false} 
                        className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                      >
                        <article className="flex flex-col h-full">
                          <div 
                            className={`relative overflow-hidden ${isProduct ? 'bg-white p-6' : 'bg-gray-100'}`}
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
                                    : "object-cover group-hover:scale-105"
                                }`}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                quality={80}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                <Zap className="w-10 h-10 opacity-20" />
                              </div>
                            )}
                            
                            {!isProduct && (
                              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                          </div>

                          <div className="p-5 flex flex-col flex-1">
                            {isProduct ? (
                               <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-2 text-emerald-600 bg-emerald-50 self-start px-2 py-0.5 rounded-full">
                                 <ShoppingBag className="w-3 h-3" /> Best Buy
                               </div>
                            ) : (
                              <time 
                                className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-2"
                                dateTime={post.publishedAt}
                              >
                                <Clock className="w-3 h-3" />
                                {formatDate(post.publishedAt)}
                              </time>
                            )}
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                              {post.title}
                            </h3>
                            
                            <span className="mt-auto inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform">
                              {isProduct ? "Check Price" : "Read More"} <ArrowRight className="w-3 h-3 ml-1" />
                            </span>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-10 text-center sm:hidden">
                  <Link 
                    href={`/${section.slug}`} 
                    prefetch={false}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary border border-primary/20 px-6 py-3 rounded-full hover:bg-primary hover:text-white transition-all"
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
          className="bg-linear-to-br from-[#4b0082]/5 via-purple-50 to-[#4b0082]/5 border-y border-[#4b0082]/10 text-slate-800"
          style={{ minHeight: '350px' }}
          aria-labelledby="newsletter-title"
        >
          <div className="container mx-auto px-4 py-20 text-center max-w-7xl">
            <div className="max-w-2xl mx-auto">
              <span className="inline-block text-primary font-bold tracking-widest uppercase text-xs mb-3">
                Join the Community
              </span>
              <h2 id="newsletter-title" className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                Join 10,000+ UAE Readers
              </h2>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Get the best of the UAE, ranked and delivered to your inbox. Smarter choices start here.
              </p>
              
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-purple-900/5">
                 <HomeNewsletter />
              </div>

              <p className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-2 font-medium">
                <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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