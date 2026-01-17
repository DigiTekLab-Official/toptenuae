// src/app/reviews/page.tsx
// 🎯 FINAL FIX: 
// 1. Fixed Product Image Zoom (Now uses object-contain + padding)
// 2. Reduced Section Gaps (space-y-8)
// 3. Updated Badge Text ("TOP 10 LIST")

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp, Star, ArrowRight, Package, Smartphone,
  Baby, Home, Scissors, MapPin, CheckCircle2, ShieldCheck,
  Plane, Activity, Watch, Car, Coffee, Sparkles
} from 'lucide-react';
import { client } from '@/sanity/lib/client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Best Buys & Product Reviews UAE',
  description: "Expert verified reviews for Electronics, Home, Parenting, and Lifestyle in the UAE.",
};

// --- CONFIG: MATCHING YOUR SANITY SCHEMA EXACTLY ---
const SECTIONS_CONFIG: Record<string, any> = {
  'tech': {
    title: "Tech, Gadgets & Gaming",
    icon: Smartphone,
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  'home-kitchen': {
    title: "Home, Kitchen & Appliances",
    icon: Home,
    color: "text-emerald-600",
    bg: "bg-emerald-100"
  },
  'health': {
    title: "Health, Fitness & Wellness",
    icon: Activity,
    color: "text-teal-600",
    bg: "bg-teal-100"
  },
  'beauty': {
    title: "Beauty, Grooming & Personal Care",
    icon: Scissors,
    color: "text-slate-600",
    bg: "bg-slate-100"
  },
  'parenting': {
    title: "Parenting, Baby & Education",
    icon: Baby,
    color: "text-pink-500",
    bg: "bg-pink-100"
  },
  'fashion': {
    title: "Fashion, Watches & Accessories",
    icon: Watch,
    color: "text-violet-600",
    bg: "bg-violet-100"
  },
  'travel': {
    title: "Travel, Hotels & Experiences",
    icon: Plane,
    color: "text-sky-600",
    bg: "bg-sky-100"
  },
  'food': {
    title: "Food, Restaurants & Cafés",
    icon: Coffee,
    color: "text-amber-600",
    bg: "bg-amber-100"
  },
  'lifestyle': {
    title: "Lifestyle & Places To Do",
    icon: MapPin,
    color: "text-indigo-600",
    bg: "bg-indigo-100"
  },
  'automotive': {
    title: "Automotive & Accessories",
    icon: Car,
    color: "text-slate-600",
    bg: "bg-slate-100"
  }
};

// --- DATA FETCHING ---
async function getData() {
  // 1. Fetch 9 Featured Guides
  const featured = await client.fetch(`
    *[_type == "topTenList" && isFeaturedReview == true] | order(_updatedAt desc) [0...9] {
      _id, title, "slug": slug.current,
      // ⚡ FIX: Added '@' before '->'
      "categorySlug": coalesce(
         category->slug.current, 
         categories[@->slug.current != "reviews"][0]->slug.current, 
         categories[0]->slug.current, 
         "reviews"
      ),
      "imageUrl": mainImage.asset->url,
      _updatedAt
    }
  `);

  // 2. Fetch All Reviews
  const items = await client.fetch(`
    *[(_type == "product" || _type == "topTenList") && defined(slug.current) && defined(reviewSection)] 
    | order(_createdAt desc) {
      _id, title, _type, rating,
      "slug": slug.current,
      // ⚡ FIX: Added '@' before '->' here too
      "categorySlug": coalesce(
         category->slug.current, 
         categories[@->slug.current != "reviews"][0]->slug.current, 
         categories[0]->slug.current, 
         "reviews"
      ),
      "section": reviewSection,
      "imageUrl": coalesce(mainImage.asset->url, image.asset->url)
    }
  `);

  // 3. Initialize Groups (No Change)
  const grouped: Record<string, any[]> = {};
  Object.keys(SECTIONS_CONFIG).forEach(key => {
    grouped[key] = [];
  });
  
  // 4. Smart Sorting (Balanced Diet)
  const tempBuckets: Record<string, { lists: any[], products: any[] }> = {};
  Object.keys(SECTIONS_CONFIG).forEach(key => tempBuckets[key] = { lists: [], products: [] });

  items.forEach((item: any) => {
    if (tempBuckets[item.section]) {
      if (item._type === 'topTenList') {
        tempBuckets[item.section].lists.push(item);
      } else {
        tempBuckets[item.section].products.push(item);
      }
    }
  });

  // Merge: 4 Lists + 4 Products
  Object.keys(SECTIONS_CONFIG).forEach(key => {
    const bucket = tempBuckets[key];
    grouped[key] = [...bucket.lists.slice(0, 4), ...bucket.products.slice(0, 4)];
  });

  return { featured, grouped };
}

async function getStats() {
  return await client.fetch(`{ "total": count(*[_type == "product"]) }`);
}

// --- MAIN PAGE ---
export default async function ReviewsPage() {
  const [{ featured, grouped }, stats] = await Promise.all([getData(), getStats()]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* HERO SECTION */}
      <div className="bg-[#4b0082] text-white py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-amber-300 text-base font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-5 h-5" />
              Expert Verified Reviews
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Unbiased Product Reviews
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Real tests. Real opinions. No marketing fluff. We help you choose the best electronics and appliances for life in the UAE.
          </p>

          <div className="flex justify-center gap-4 sm:gap-12 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px] border border-white/10">
              <div className="text-3xl font-black text-white mb-1">{stats.total}</div>
              <div className="text-[12px] text-indigo-200 uppercase tracking-widest font-bold">Products Tested</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px] border border-white/10">
              <div className="text-3xl font-black text-white mb-1">100%</div>
              <div className="text-[12px] text-green-300 uppercase tracking-widest font-bold">Unbiased</div>
            </div>
          </div>
        </div>
      </div>

      {/* GAP REDUCED: space-y-8 */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">

        {/* 1. FEATURED BUYING GUIDES (9 Posts) */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-amber-100 p-2 rounded-lg"><Star className="w-6 h-6 text-amber-600" /></div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Buying Guides</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((post: any) => (
                <Link key={post._id} href={`/${post.categorySlug}/${post.slug}`} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
                  <div className="h-52 relative bg-gray-100">
                    {/* Featured Image is ALWAYS object-cover (Lifestyle) */}
                    {post.imageUrl ? (
                      <Image src={post.imageUrl} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="w-12 h-12" /></div>}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 backdrop-blur-sm text-[#4b0082] text-[12px] font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Editor's Pick
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#4b0082] leading-tight mb-4">{post.title}</h3>
                    <div className="mt-auto flex items-center text-[#4b0082] text-sm font-bold">
                      Read Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2. DYNAMIC SECTIONS */}
        {Object.entries(SECTIONS_CONFIG).map(([key, config]) => {
          const items = grouped[key] || [];
          if (items.length === 0) return null;
          const Icon = config.icon;

          return (
            <section key={key} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                <Icon className="w-64 h-64" />
              </div>

              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className={`${config.bg} p-3 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${config.color}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
                  <p className="text-gray-500 text-sm">Latest reviews in this category</p>
                </div>
              </div>

              {/* VIEW ALL LINK - Sends them to the main category archive */}
              <Link 
                href={`/${key}`} // e.g. /tech, /home-kitchen
                className="hidden md:flex items-center text-sm font-bold text-gray-400 hover:text-[#4b0082] transition-colors mt-4"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              {/* Sub-Category Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {items.slice(0, 8).map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/${item.categorySlug}/${item.slug}`}
                    className="group flex flex-col bg-white border border-gray-200 hover:border-[#4b0082]/30 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full"
                  >
                    {/* IMAGE CONTAINER */}
                    <div className="h-40 relative bg-white shrink-0 border-b border-gray-100">

                      {/* 1. The Image with CONDITIONAL CLASS */}
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt=""
                          fill
                          // 👇 THIS IS THE FIX: Conditional Styling
                          // If Product: object-contain + p-4 (Prevents zoom/crop)
                          // If Guide: object-cover (Full bleed)
                          className={`transition-transform duration-500 group-hover:scale-105 ${
                            item._type === 'product' 
                              ? 'object-contain p-4' 
                              : 'object-cover'
                          }`}
                        />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="w-8 h-8" />
                          </div>
                      )}

                      {/* 2. THE BADGE */}
                      <div className="absolute top-2 left-2 z-10">
                        {item._type === 'product' ? (
                          // SINGLE PRODUCT BADGE
                          <span className="inline-flex items-center bg-blue-600/90 backdrop-blur-md px-2 py-1 rounded text-[12px] font-bold text-white shadow-sm border border-white/20 tracking-wide">
                            <Star className="w-3 h-3 mr-1 fill-white" /> REVIEW
                          </span>
                        ) : (
                          // BUYING GUIDE BADGE
                          <span className="inline-flex items-center bg-[#4b0082]/90 backdrop-blur-md px-2 py-1 rounded text-[12px] font-bold text-white shadow-sm border border-white/20 tracking-wide">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> TOP 10 LIST
                          </span>
                        )}
                      </div>

                      {/* 3. Rating */}
                      {item.rating && (
                        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-amber-600 flex items-center gap-1 shadow-sm border border-gray-100">
                          <Star className="w-3 h-3 fill-amber-500" /> {item.rating}/5
                        </div>
                      )}
                    </div>

                    {/* TEXT CONTAINER */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#4b0082] line-clamp-2 leading-snug mb-3">
                        {item.title}
                      </h3>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-[12px] font-medium text-gray-600 uppercase tracking-wider">
                          {item._type === 'product' ? 'Product Test' : 'Comparison'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#4b0082] transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

      </div>
    </div>
  );
}