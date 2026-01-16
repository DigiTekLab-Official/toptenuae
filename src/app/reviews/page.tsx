// src/app/reviews/page.tsx
// 🎯 FULLY DYNAMIC - Fixes 404 Links
// Now links correctly to /category/slug instead of /reviews/slug

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Package,
  Headphones,
  Scissors,
  Baby,
  Video,
  ChefHat,
  Smartphone,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { client } from '@/sanity/lib/client';

// ============================================================================
// CONFIGURATION
// ============================================================================

export const revalidate = 3600; // ISR: Revalidate every hour

// ============================================================================
// SEO METADATA
// ============================================================================

export const metadata: Metadata = {
  title: 'Best Buys & Product Reviews UAE',
  description: "Don't buy blindly. We cut through the marketing hype to find products that are actually worth your money in the UAE market. From testing the best beard trimmers to finding air fryers that save energy.",
  keywords: ['Best Electronics', 'Home Appliances', 'Buyer Guides', 'Price Comparison', 'Grooming', 'UAE Reviews'],
  openGraph: {
    title: 'Best Buys & Product Reviews UAE',
    description: "Don't buy blindly. We cut through the marketing hype to find products worth your money in the UAE market.",
    type: 'website',
    url: 'https://toptenuae.com/reviews',
  },
  alternates: {
    canonical: 'https://toptenuae.com/reviews',
  },
};

// ============================================================================
// PRODUCT CATEGORIZATION LOGIC
// ============================================================================

const PRODUCT_CATEGORIES = [
  {
    key: 'audio',
    title: "Audio & Headphones",
    description: "Premium earbuds, headphones, and audio accessories",
    Icon: Headphones,
    keywords: ['earbuds', 'headphones', 'airpods', 'buds', 'audio', 'speaker', 'soundbar', 'sony', 'bose']
  },
  {
    key: 'grooming',
    title: "Electric Shavers & Trimmers",
    description: "Professional grooming tools and beard care",
    Icon: Scissors,
    keywords: ['shaver', 'trimmer', 'grooming', 'beard', 'razor', 'clipper', 'oneblade', 'braun', 'philips']
  },
  {
    key: 'baby-care',
    title: "Baby Care & Skincare",
    description: "Safe and gentle products for infants",
    Icon: Baby,
    keywords: ['baby', 'diaper', 'ointment', 'balm', 'lotion', 'oil', 'cream', 'mustela', 'sebamed']
  },
  {
    key: 'baby-monitors',
    title: "Baby Monitors & Security",
    description: "Keep your little ones safe with smart monitoring",
    Icon: Video,
    keywords: ['monitor', 'camera', 'security', 'surveillance', 'cctv', 'nanit', 'eufy']
  },
  {
    key: 'kitchen',
    title: "Kitchen Appliances",
    description: "Healthy cooking made easy",
    Icon: ChefHat,
    keywords: ['air fryer', 'fryer', 'blender', 'cooker', 'kitchen', 'nutricook', 'ninja']
  },
  {
    key: 'tech',
    title: "Smartphones & Tech",
    description: "Latest mobile technology and gadgets",
    Icon: Smartphone,
    keywords: ['samsung', 'iphone', 'phone', 'watch', 'galaxy', 'ps5', 'gimbal', 'dji', 'deepseek']
  },
];

function categorizeProduct(title: string): string {
  const titleLower = title.toLowerCase();
  for (const category of PRODUCT_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (titleLower.includes(keyword)) {
        return category.key;
      }
    }
  }
  return 'other';
}

// ============================================================================
// DATA FETCHING
// ============================================================================

async function getAllReviews() {
  // ✅ FIX: Fetch 'categorySlug' so we can build the correct URL
  const products = await client.fetch(`
    *[_type == "product" && defined(slug.current)] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      "categorySlug": category->slug.current,
      rating,
      _createdAt,
      "imageUrl": mainImage.asset->url
    }
  `);

  const categorized: Record<string, any[]> = {};
  PRODUCT_CATEGORIES.forEach(cat => categorized[cat.key] = []);
  categorized['other'] = [];

  products.forEach((product: any) => {
    const categoryKey = categorizeProduct(product.title);
    if (categorized[categoryKey]) {
        categorized[categoryKey].push(product);
    } else {
        categorized['other'].push(product);
    }
  });

  return { products, categorized };
}

async function getTopLists() {
  // ✅ FIX: Fetch 'categorySlug' here too
  return await client.fetch(`
    *[_type == "topTenList" && defined(slug.current) && 
      !(title match "Airline*") && 
      !(title match "Quantum*") && 
      !(title match "State of AI*") &&
      !(category->slug.current match "news") &&
      !(category->slug.current match "travel")
    ] | order(_updatedAt desc) [0...6] {
      _id,
      title,
      "slug": slug.current,
      "categorySlug": category->slug.current,
      _updatedAt,
      "imageUrl": mainImage.asset->url
    }
  `);
}

async function getReviewStats() {
  return await client.fetch(`
    {
      "totalProducts": count(*[_type == "product" && defined(slug.current)]),
      "recentReviews": count(*[_type == "product" && _createdAt > dateTime(now()) - 60*60*24*30])
    }
  `);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default async function ReviewsPage() {
  const [{ products, categorized }, topLists, stats] = await Promise.all([
    getAllReviews(),
    getTopLists(),
    getReviewStats(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Product Reviews UAE",
            "url": "https://toptenuae.com/reviews",
            "numberOfItems": products.length,
          })
        }}
      />

      {/* HERO SECTION */}
      <div className="bg-[#4b0082] text-white py-12 px-4 text-center relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-400 text-[#4b0082] text-xs font-black uppercase tracking-wider mb-6 shadow-md">
            <ShieldCheck className="w-4 h-4" /> Expert Verified Reviews
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
            Unbiased Product Reviews
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-8 font-medium">
            Real tests. Real opinions. No marketing fluff. We help you choose the best electronics and appliances for life in the UAE.
          </p>

          <div className="flex justify-center gap-4 sm:gap-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
              <div className="text-3xl font-black text-white mb-1">{stats.totalProducts}</div>
              <div className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold">Products Tested</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
              <div className="text-3xl font-black text-white mb-1">{stats.recentReviews}</div>
              <div className="text-[10px] text-green-300 uppercase tracking-widest font-bold">New This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* 1. Featured Buying Guides */}
        {topLists.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Buying Guides</h2>
                <p className="text-sm text-gray-500">Curated top 10 lists and comparisons</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topLists.map((list: any) => {
                // ✅ FIX: Use correct category slug or fallback to 'reviews'
                const href = `/${list.categorySlug || 'reviews'}/${list.slug}`;
                
                return (
                  <Link
                    key={list._id}
                    href={href}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                  >
                    {/* Thumbnail Image */}
                    <div className="h-48 relative bg-gray-100 shrink-0 overflow-hidden">
                      {list.imageUrl ? (
                        <Image 
                          src={list.imageUrl} 
                          alt={list.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/95 backdrop-blur-sm text-[#4b0082] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Buying Guide
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#4b0082] transition-colors mb-3 line-clamp-2 leading-tight">
                        {list.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1.5" />
                          {new Date(list._updatedAt).toLocaleDateString()}
                        </div>
                        <span className="text-sm font-bold text-[#4b0082] flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          Read <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Browse by Category */}
        <div className="space-y-16">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-purple-100 p-2 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
             <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
          </div>

          {PRODUCT_CATEGORIES.map((category) => {
            const items = categorized[category.key] || [];
            if (items.length === 0) return null;
            
            const IconComponent = category.Icon;

            return (
              <div key={category.key} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                  <IconComponent className="w-64 h-64" />
                </div>

                <div className="flex items-start md:items-center gap-4 mb-8 relative z-10">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <IconComponent className="w-8 h-8 text-[#4b0082]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-gray-500">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
                  {items.map((product: any) => {
                    // ✅ FIX: Use correct category slug or fallback to 'reviews'
                    const href = `/${product.categorySlug || 'reviews'}/${product.slug}`;

                    return (
                      <Link
                        key={product._id}
                        href={href}
                        className="group flex flex-col bg-white border border-gray-200 hover:border-[#4b0082]/30 rounded-xl p-4 transition-all hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#4b0082] line-clamp-2 leading-snug">
                            {product.title}
                          </h4>
                          {product.imageUrl && (
                             <div className="w-10 h-10 shrink-0 relative rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                                <Image src={product.imageUrl} alt="" fill className="object-cover" />
                             </div>
                          )}
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
                           {product.rating ? (
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold text-amber-700">{product.rating}</span>
                            </div>
                          ) : <span></span>}
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#4b0082] transform group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Uncategorized "Other" Section */}
          {categorized['other'].length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <Package className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">More Reviews</h3>
                  <p className="text-gray-500">Other tested products</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categorized['other'].map((product: any) => {
                  // ✅ FIX: Use correct category slug or fallback to 'reviews'
                  const href = `/${product.categorySlug || 'reviews'}/${product.slug}`;

                  return (
                    <Link
                      key={product._id}
                      href={href}
                      className="group block bg-gray-50 hover:bg-white border border-transparent hover:border-blue-200 rounded-lg p-4 transition-all hover:shadow-md"
                    >
                      <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
                        {product.title}
                      </h4>
                      <div className="flex justify-end">
                         <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}