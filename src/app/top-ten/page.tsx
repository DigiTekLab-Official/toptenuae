// src/app/top-ten/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, ArrowRight, Package, Smartphone, Baby, Home, 
  Scissors, Activity, Watch, Plane, Coffee, MapPin, 
  Car, CheckCircle2, Trophy
} from 'lucide-react';
import { client } from '@/sanity/lib/client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Top 10 Lists & Buying Guides UAE | Best of UAE Ranked',
  description: "Discover the best products and services in the UAE. Unbiased Top 10 lists for Tech, Home, Parenting, and more, updated for 2026.",
};

// --- CONFIG ---
const SECTIONS_CONFIG: Record<string, any> = {
  'tech': { title: "Tech & Gadgets", icon: Smartphone, color: "text-blue-600", bg: "bg-blue-50" },
  'home-kitchen': { title: "Home & Kitchen", icon: Home, color: "text-emerald-600", bg: "bg-emerald-50" },
  'parenting': { title: "Parenting & Baby", icon: Baby, color: "text-pink-600", bg: "bg-pink-50" },
  'health': { title: "Health & Fitness", icon: Activity, color: "text-teal-600", bg: "bg-teal-50" },
  'beauty': { title: "Beauty & Grooming", icon: Scissors, color: "text-purple-600", bg: "bg-purple-50" },
  'travel': { title: "Travel & Hotels", icon: Plane, color: "text-sky-600", bg: "bg-sky-50" },
  'lifestyle': { title: "Lifestyle & Places", icon: MapPin, color: "text-indigo-600", bg: "bg-indigo-50" },
};

// --- DATA FETCHING ---
async function getData() {
  // 1. Fetch 8 Featured Buying Guides
  const featured = await client.fetch(`
    *[_type == "topTenList" && isFeaturedReview == true] | order(_updatedAt desc) [0...8] {
      _id, title, "slug": slug.current,
      "categorySlug": coalesce(category->slug.current, categories[0]->slug.current, "top-10s"),
      "imageUrl": mainImage.asset->url
    }
  `);

  // 2. Fetch All Lists (Grouped by Section)
  const lists = await client.fetch(`
    *[_type == "topTenList"] | order(_createdAt desc) {
      _id, title, "slug": slug.current,
      "categorySlug": coalesce(category->slug.current, categories[0]->slug.current),
      "section": reviewSection,
      "imageUrl": mainImage.asset->url
    }
  `);

  const grouped: Record<string, any[]> = {};
  Object.keys(SECTIONS_CONFIG).forEach(key => grouped[key] = []);

  lists.forEach((item: any) => {
    if (grouped[item.section]) {
      grouped[item.section].push(item);
    }
  });

  return { featured, grouped };
}

export default async function TopTenPage() {
  const { featured, grouped } = await getData();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* HERO SECTION */}
      <div className="bg-[#4b0082] text-white py-16 px-4 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pattern-grid-lg" />
         <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
               <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-amber-300 text-sm font-bold uppercase tracking-wider">
                 <Trophy className="w-4 h-4" /> Official Rankings 2026
               </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
               Featured Buying Guides
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
               We research, test, and rank the top products in the UAE so you don't have to.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* SECTION 1: Featured Grid */}
        <section>
          <div className="flex items-center gap-3 mb-8">
             <div className="bg-amber-100 p-2 rounded-lg"><Star className="w-6 h-6 text-amber-600" /></div>
             <h2 className="text-2xl font-bold text-gray-900">Editor's Top Picks</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((post: any) => (
              <Link key={post._id} href={`/top-10s/${post.slug}`} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
                <div className="h-48 relative bg-gray-100">
                  {post.imageUrl ? (
                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="w-10 h-10" /></div>}
                  <div className="absolute top-2 left-2">
                     <span className="bg-[#4b0082] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">TOP 10</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-[#4b0082] leading-snug mb-3">{post.title}</h3>
                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center text-[#4b0082] text-xs font-bold uppercase tracking-wide">
                    View Ranking <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 2: Categories (Thumbnails for EVERYTHING) */}
        {Object.entries(SECTIONS_CONFIG).map(([key, config]) => {
          const items = grouped[key] || [];
          if (items.length === 0) return null;
          const Icon = config.icon;

          return (
            <section key={key} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className={`${config.bg} p-3 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${config.color}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
                  <p className="text-gray-500 text-sm">Latest rankings in this category</p>
                </div>
              </div>

              {/* CARD GRID FOR CATEGORY */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {items.slice(0, 8).map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/top-10s/${item.slug}`}
                    className="group flex flex-col bg-white border border-gray-200 hover:border-[#4b0082]/30 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full"
                  >
                    <div className="h-40 relative bg-gray-100 shrink-0 border-b border-gray-100">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 z-10">
                         <span className="inline-flex items-center bg-[#4b0082]/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm tracking-wide">
                            TOP 10
                         </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#4b0082] line-clamp-2 leading-snug mb-3">
                        {item.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Guide</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#4b0082] transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {items.length > 8 && (
                 <div className="mt-8 text-center">
                    <Link href={`/${key}`} className="inline-block border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-6 rounded-full text-sm transition-all">
                       View All {config.title} →
                    </Link>
                 </div>
              )}
            </section>
          );
        })}

      </div>
    </div>
  );
}