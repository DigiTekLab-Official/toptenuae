// src/app/reviews/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, Package, Smartphone, Home, Baby, 
  Scissors, Microscope, Activity, ChevronRight
} from 'lucide-react';
import { client } from '@/sanity/lib/client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Expert Product Reviews UAE | Real Tests & Verdicts',
  description: "Unbiased reviews of the latest electronics, appliances, and baby gear in the UAE market.",
};

// --- CONFIG ---
const SECTIONS_CONFIG: Record<string, any> = {
  'tech': { title: "Tech, Gadgets & Gaming", icon: Smartphone, color: "text-blue-600", bg: "bg-blue-50" },
  'home-kitchen': { title: "Home & Appliances", icon: Home, color: "text-emerald-600", bg: "bg-emerald-50" },
  'parenting': { title: "Parenting & Kids", icon: Baby, color: "text-pink-600", bg: "bg-pink-50" },
  'beauty': { title: "Grooming & Care", icon: Scissors, color: "text-purple-600", bg: "bg-purple-50" },
  'health': { title: "Health & Fitness", icon: Activity, color: "text-teal-600", bg: "bg-teal-50" },
};

// --- DATA FETCHING ---
async function getData() {
  // 1. Fetch 8 Featured Products (Big Grid)
  const featured = await client.fetch(`
    *[_type == "product" && isFeaturedReview == true] | order(_updatedAt desc) [0...8] {
      _id, title, rating, "slug": slug.current,
      "categorySlug": coalesce(category->slug.current, categories[0]->slug.current, "reviews"),
      "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
    }
  `);

  // 2. Fetch All Reviews with Sub-Category Data
  const reviews = await client.fetch(`
    *[_type == "product"] | order(_createdAt desc) {
      _id, title, rating, "slug": slug.current,
      "categorySlug": coalesce(category->slug.current, categories[0]->slug.current),
      "section": reviewSection,
      "subCategoryTitle": subCategory->menuLabel, 
      "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
    }
  `);

  // 3. Advanced Grouping: Section -> SubCategory -> Products
  const grouped: Record<string, Record<string, any[]>> = {};

  Object.keys(SECTIONS_CONFIG).forEach(key => {
    grouped[key] = {}; 
  });

  reviews.forEach((item: any) => {
    if (grouped[item.section]) {
      const subCat = item.subCategoryTitle || 'General Reviews';
      if (!grouped[item.section][subCat]) {
        grouped[item.section][subCat] = [];
      }
      grouped[item.section][subCat].push(item);
    }
  });

  return { featured, grouped };
}

export default async function ReviewsPage() {
  const { featured, grouped } = await getData();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* ================================================================== */}
      {/* 1. HERO SECTION (UPDATED: Brand Purple Style)                      */}
      {/* ================================================================== */}
      <section className="relative bg-[#4b0082] text-white overflow-hidden py-4 lg:py-12">
        {/* Background Pattern/Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-amber-400/20 text-amber-300 font-bold text-sm tracking-widest uppercase mb-4 border border-amber-400/30">
            100% Independent Testing
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Expert Product Reviews <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
              UAE Buying Guides
            </span>
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Real tests, hands-on photos, and unbiased verdicts. We buy and test electronics, appliances, and gear so you don't waste your money.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* SECTION 1: Featured Grid */}
        <section>
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-100 p-2 rounded-lg"><Microscope className="w-6 h-6 text-blue-600" /></div>
             <h2 className="text-2xl font-bold text-gray-900">Latest Tested Products</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product: any) => (
              <Link key={product._id} href={`/reviews/${product.slug}`} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full hover:-translate-y-1">
                <div className="h-40 relative bg-white p-6 flex items-center justify-center border-b border-gray-50">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.title} width={150} height={150} className="object-contain max-h-full transition-transform duration-500 group-hover:scale-110" />
                  ) : <Package className="w-12 h-12 text-gray-300" />}
                  {product.rating && (
                     <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {product.rating}
                     </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-700 leading-snug mb-2 line-clamp-2">{product.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 2: CATEGORY WISE LISTS (COMPACT VIEW) */}
        {Object.entries(SECTIONS_CONFIG).map(([sectionKey, config]) => {
          // Get all sub-categories for this section
          const subCategories = grouped[sectionKey] || {};
          const subCatKeys = Object.keys(subCategories);
          
          if (subCatKeys.length === 0) return null;
          const Icon = config.icon;

          return (
            <section key={sectionKey} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
               {/* Main Category Header */}
               <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className={`${config.bg} p-3 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${config.color}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
                  <p className="text-gray-500 text-sm">Browse by category</p>
                </div>
              </div>

              {/* Sub-Category Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                {subCatKeys.map((subCatTitle) => (
                  <div key={subCatTitle}>
                    
                    {/* Sub-Category Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      {subCatTitle}
                    </h3>

                    {/* Compact Product List */}
                    <div className="space-y-3">
                      {subCategories[subCatTitle].map((item: any) => (
                        <Link 
                          key={item._id} 
                          href={`/reviews/${item.slug}`}
                          className="group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-100"
                        >
                          {/* Tiny Thumbnail (48x48px) */}
                          <div className="relative w-12 h-12 bg-white rounded border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center p-1">
                            {item.imageUrl ? (
                              <Image 
                                src={item.imageUrl} 
                                alt="" 
                                width={48} 
                                height={48} 
                                className="object-contain w-full h-full group-hover:scale-110 transition-transform" 
                              />
                            ) : (
                              <Package className="w-5 h-5 text-gray-300" />
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-700 group-hover:text-blue-700 leading-snug line-clamp-2">
                              {item.title}
                            </h4>
                            {item.rating && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-[10px] font-bold text-gray-500">{item.rating}/5</span>
                              </div>
                            )}
                          </div>
                          
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

      </div>
    </div>
  );
}