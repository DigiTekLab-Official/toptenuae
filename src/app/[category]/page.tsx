// src/app/[category]/page.tsx

export const runtime = 'edge';

import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import { 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  Percent, 
  Coins, 
  Car, 
  Plane, 
  TrendingUp, 
  HeartHandshake,
  LayoutGrid
} from "lucide-react"; 

// --- CONFIGURATION ---
export const revalidate = 60; // Incremental Static Regeneration: Update cache every 60 seconds

// --- QUERY: Get Category Data + All Posts inside it ---
const categoryQuery = `*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  description,
  "slug": slug.current,
  "seo": seo { metaTitle, metaDescription, keywords },
  
  // Fetch items belonging to this category
  "items": *[
    _type in ["topTenList", "howTo", "tool", "holiday", "charity", "deal", "event"] && 
    (
      references(^._id) ||           
      category._ref == ^._id ||      
      ^._id in categories[]._ref     
    )
  ] | order(publishedAt desc) {
    _type,
    title,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    publishedAt,
    "rawExcerpt": coalesce(intro, description, itemDescription, body[0...1])
  }
}`;

interface PageProps {
  params: Promise<{ category: string }>;
}

// --- SEO: Dynamic Metadata Generation ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  
  // Lightweight query for just SEO tags
  const seoData = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{ title, description, seo }`, 
    { slug: category }
  );

  if (!seoData) return { title: "Category Not Found" };

  const metaTitle = seoData.seo?.metaTitle || `${seoData.title} | TopTenUAE`;
  const metaDesc = seoData.seo?.metaDescription || seoData.description || `Browse the best ${seoData.title} in the UAE.`;
  const ogImage = 'https://toptenuae.com/og-default.jpg'; // Fallback image

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: seoData.seo?.keywords,
    alternates: {
      canonical: `https://toptenuae.com/${category}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: 'website',
      url: `https://toptenuae.com/${category}`,
      siteName: 'TopTenUAE',
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: 'en_AE',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [ogImage],
    }
  };
}

// --- HELPER: Design Config for Finance Tools ---
const getToolConfig = (slug: string) => {
  if (slug.includes('vat')) {
    return { 
      icon: Percent, 
      iconColor: 'text-[#4b0082] group-hover:text-white',
      iconBg: 'bg-blue-50 group-hover:bg-[#4b0082]',
      ctaLabel: 'Calculate VAT'
    };
  }
  if (slug.includes('zakat')) {
    return { 
      icon: HeartHandshake, 
      iconColor: 'text-indigo-500 group-hover:text-white',
      iconBg: 'bg-indigo-50 group-hover:bg-indigo-500',
      ctaLabel: 'Calculate Zakat'
    };
  }
  if (slug.includes('gratuity')) {
    return { 
      icon: Coins, 
      iconColor: 'text-amber-500 group-hover:text-white',
      iconBg: 'bg-amber-50 group-hover:bg-amber-500',
      ctaLabel: 'Calculate Benefits'
    };
  }
  if (slug.includes('loan') || slug.includes('car')) {
    return { 
      icon: Car, 
      iconColor: 'text-sky-500 group-hover:text-white',
      iconBg: 'bg-sky-50 group-hover:bg-sky-600',
      ctaLabel: 'Estimate EMI'
    };
  }
  if (slug.includes('visa') || slug.includes('freelance')) {
    return { 
      icon: Plane, 
      iconColor: 'text-violet-500 group-hover:text-white',
      iconBg: 'bg-violet-50 group-hover:bg-violet-500',
      ctaLabel: 'Compare Costs'
    };
  }
  if (slug.includes('roi')) {
    return { 
      icon: TrendingUp, 
      iconColor: 'text-emerald-500 group-hover:text-white',
      iconBg: 'bg-emerald-50 group-hover:bg-emerald-500',
      ctaLabel: 'Check ROI'
    };
  }
  return { 
    icon: Calculator, 
    iconColor: 'text-purple-600 group-hover:text-white',
    iconBg: 'bg-purple-50 group-hover:bg-purple-600',
    ctaLabel: 'Calculate Now'
  };
};

// --- HELPER: Converts Sanity Portable Text to Plain Text ---
function safeExcerpt(value: any) {
  if (!value) return "No description available.";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((block: any) => 
        block._type === 'block' && block.children 
          ? block.children.map((child: any) => child.text).join("") 
          : ""
      )
      .join(" ");
  }
  return "";
}

// --- MAIN PAGE COMPONENT ---
export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  // Fetch Data
  const data = await client.fetch(categoryQuery, { slug: category });

  if (!data) return notFound();

  // ✅ FIX 1: Robust Category Slug with null-safety
  const categorySlug = data.slug || category;
  
  // ✅ FIX 2: Validation - log warning if slug is missing
  if (!categorySlug || categorySlug === 'null' || categorySlug === 'undefined') {
    console.error(`[Category Page] Invalid category slug: ${categorySlug}`);
    return notFound();
  }

  // --- SEO: Generate Collection Schema ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": data.title,
    "description": data.description || `Collection of ${data.title}`,
    "url": `https://toptenuae.com/${categorySlug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": data.items?.map((item: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://toptenuae.com/${categorySlug}/${item.slug}`,
        "name": item.title
      })) || []
    }
  };

  // ---------------------------------------------------------------------------
  // 🎨 OPTION A: SPECIAL DESIGN FOR FINANCE (The Hub Layout)
  // ---------------------------------------------------------------------------
  if (data.slug === 'finance' || data.slug === 'finance-tools') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-20">
        
        {/* Inject Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* 1. SPECIAL HERO SECTION (Matches Old Hub Design) */}
        <div className="bg-[#4b0082] text-white py-12 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Calculator className="w-3 h-3" />
                Premium Tools
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              {data.title}
            </h1>
            
            <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {data.description || "Plan your life in the Emirates with our free, accurate tools. From VAT to Gratuity, we've got the math covered."}
            </p>
          </div>
        </div>

        {/* 2. SPECIAL CALCULATOR GRID (Matches Old Hub Design) */}
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {data.items && data.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.items.map((item: any) => {
                // ✅ FIX 3: Skip items with invalid slugs
                if (!item.slug || item.slug === 'null' || item.slug === 'undefined') {
                  console.warn(`[Category Page] Skipping item with invalid slug:`, item);
                  return null;
                }
                
                const config = getToolConfig(item.slug);
                const ToolIcon = config.icon;

                return (
                  <Link 
                    key={item.slug} 
                    href={`/${categorySlug}/${item.slug}`} 
                    prefetch={false}
                    className="group relative block h-full"
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-300 hover:border-[#4b0082]/30 transition-all h-full flex flex-col overflow-hidden">
                      
                      {/* Corner Decoration */}
                      <div className="absolute top-0 right-0 bg-[#4b0082]/5 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 group-hover:bg-[#4b0082]/10"></div>
                      
                      {/* Dynamic Icon */}
                      <div className={`${config.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300`}>
                        <ToolIcon className={`w-7 h-7 ${config.iconColor} transition-colors duration-300`} />
                      </div>

                      <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#4b0082] transition-colors">
                        {item.title}
                      </h2>
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                        {safeExcerpt(item.rawExcerpt)}
                      </p>
                      
                      <div className="mt-auto pt-2 border-t border-slate-100 flex items-center text-[#4b0082] font-bold text-sm">
                        {config.ctaLabel} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900">No calculators found</h3>
               <p className="text-gray-500 text-sm mt-1">Check back later for updates.</p>
            </div>
          )}
        </div>
        
        <div className="bg-white py-16 border-t border-slate-300">
          <div className="container mx-auto px-4 max-w-4xl text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why use our UAE Financial Tools?</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Navigating finances in a new country can be challenging. Whether you are calculating the <strong>5% VAT</strong> on a purchase, planning your <strong>End of Service Gratuity</strong>, or calculating <strong>Zakat</strong> obligations, TopTenUAE provides independent, accurate, and free calculators tailored to UAE laws and standards.
              </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 🎨 OPTION B: STANDARD CATEGORY DESIGN (For Tech, Reviews, Family, etc.)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. HERO SECTION (UNIFIED THEME) */}
      <div className="bg-[#4b0082] text-white py-16 px-4 text-center relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              Category Archive
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">
            {data.title}
          </h1>
          
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            {data.description || `Explore our latest articles, guides, and reviews in ${data.title}.`}
          </p>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Grid */}
          <main className="flex-1">
            {data.items && data.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.items.map((post: any) => {
                  // ✅ FIX 3: Skip items with invalid slugs
                  if (!post.slug || post.slug === 'null' || post.slug === 'undefined') {
                    console.warn(`[Category Page] Skipping post with invalid slug:`, post);
                    return null;
                  }
                  
                  return (
                    <Link 
                      key={post.slug} 
                      href={`/${categorySlug}/${post.slug}`} 
                      prefetch={false}
                      className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full"
                    >
                      {/* Image Section */}
                      <div className="h-52 relative bg-gray-100 shrink-0">
                        {post.imageUrl ? (
                          <Image 
                            src={post.imageUrl} 
                            alt={post.title} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        ) : (
                         <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                           <span className="text-sm uppercase tracking-widest font-bold">TopTenUAE</span>
                         </div>
                        )} 
                        
                        {/* ✅ FIXED: Type Badge was outside the image container in previous version if logic was wrong. 
                            It is now correctly placed inside the relative container. */}
                        <div className="absolute top-3 left-3">
                           <span className="bg-white/90 backdrop-blur-md text-[#4b0082] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                             {post._type === 'topTenList' ? 'Review' : post._type}
                           </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex flex-col flex-1">
                        <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#4b0082] transition-colors leading-tight">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-5 flex-1 leading-relaxed">
                          {safeExcerpt(post.rawExcerpt)}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400">
                            {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-sm font-bold text-[#4b0082] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read More <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Coming Soon</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                  We are currently curating high-quality content for this category. Check back shortly!
                </p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
             <Sidebar currentSlug="" categorySlug={categorySlug} />
          </aside>
        </div>
      </div>
    </div>
  );
}