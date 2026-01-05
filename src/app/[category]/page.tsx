// src/app/[category]/page.tsx
export const runtime = 'edge';
export const revalidate = 60; 


import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import { generateSeoMetadata } from "@/utils/seo-manager"; 
import { cleanText } from "@/utils/sanity-text"; // ✅ NEW: Import helper

import { 
  Sparkles, ArrowRight, Calculator, Percent, Coins, 
  Car, Plane, TrendingUp, HeartHandshake, LayoutGrid
} from "lucide-react"; 



// --- QUERY ---
const categoryQuery = `*[_type == "category" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  description,
  "slug": slug.current,
  "seo": seo { metaTitle, metaDescription, keywords, canonicalUrl, noIndex, ogImage },
  "items": *[
    _type in ["topTenList", "howTo", "tool", "holiday", "charity", "deal", "event"] && 
    (references(^._id) || category._ref == ^._id || ^._id in categories[]._ref)
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

// --- SEO GENERATION ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const data = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{ 
      title, description, _type, "slug": slug.current, seo 
    }`, 
    { slug: category }
  );

  if (!data) return { title: "Category Not Found" };
  return generateSeoMetadata(data, { category });
}

// --- HELPERS ---
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

// 🗑️ DELETED: safeExcerpt (Replaced by cleanText)

// --- MAIN PAGE ---
export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const data = await client.fetch(categoryQuery, { slug: category });

  if (!data) return notFound();
  
  const categorySlug = data.slug || category;
  if (!categorySlug || categorySlug === 'null') return notFound();

  // JSON-LD for CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": cleanText(data.title), // ✅ Safe
    "description": cleanText(data.description) || `Collection of ${data.title}`, // ✅ Safe
    "url": `https://toptenuae.com/${categorySlug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": data.items?.map((item: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://toptenuae.com/${categorySlug}/${item.slug}`,
        "name": cleanText(item.title) // ✅ Safe
      })) || []
    }
  };

  const isFinance = data.slug === 'finance' || data.slug === 'finance-tools';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-[#4b0082] text-white py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" /></svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {isFinance ? <Calculator className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              {isFinance ? "Premium Tools" : "Category Archive"}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{data.title}</h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {cleanText(data.description) || `Explore the best content in ${data.title}.`} {/* ✅ Safe */}
          </p>
        </div>
      </div>

      <div className={`container mx-auto px-4 py-16 ${isFinance ? 'max-w-6xl' : 'max-w-7xl'}`}>
        {isFinance ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items?.map((item: any) => {
               if (!item.slug) return null;
               const config = getToolConfig(item.slug);
               const ToolIcon = config.icon;
               return (
                 <Link key={item.slug} href={`/${categorySlug}/${item.slug}`} className="group relative block h-full">
                   <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-300 hover:border-[#4b0082]/30 transition-all h-full flex flex-col overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#4b0082]/5 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 group-hover:bg-[#4b0082]/10"></div>
                      <div className={`${config.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300`}>
                        <ToolIcon className={`w-7 h-7 ${config.iconColor} transition-colors duration-300`} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#4b0082] transition-colors">{item.title}</h2>
                      {/* ✅ UPDATED: Uses cleanText now */}
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{cleanText(item.rawExcerpt)}</p>
                      <div className="mt-auto pt-2 border-t border-slate-100 flex items-center text-[#4b0082] font-bold text-sm">
                        {config.ctaLabel} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                   </div>
                 </Link>
               );
            })}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <main className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.items?.map((post: any) => {
                  if (!post.slug) return null;
                  return (
                    <Link key={post.slug} href={`/${categorySlug}/${post.slug}`} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
                      <div className="h-52 relative bg-gray-100 shrink-0">
                        {post.imageUrl ? (
                          <Image src={post.imageUrl} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">TOP TEN UAE</div>
                        )}
                        <div className="absolute top-3 left-3">
                           <span className="bg-white/90 backdrop-blur-md text-[#4b0082] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                             {post._type === 'topTenList' ? 'Review' : post._type}
                           </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#4b0082] transition-colors leading-tight">{post.title}</h2>
                        {/* ✅ UPDATED: Uses cleanText now */}
                        <p className="text-gray-600 text-sm line-clamp-3 mb-5 flex-1 leading-relaxed">{cleanText(post.rawExcerpt)}</p>
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
                          <span className="text-sm font-bold text-[#4b0082] flex items-center gap-1 group-hover:translate-x-1 transition-transform">Read <ArrowRight className="w-4 h-4" /></span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </main>
            <aside className="w-full lg:w-80 shrink-0 space-y-8">
               <Sidebar currentSlug="" categorySlug={categorySlug} />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}