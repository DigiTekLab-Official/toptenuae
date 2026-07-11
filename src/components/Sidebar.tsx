// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";


import { Clock, TrendingUp, ShieldCheck } from "@/components/icons";

// Query remains the same...
const SIDEBAR_QUERY = `
  *[_type in ["topTenList", "howTo", "post"] && slug.current != $currentSlug]
  | order(publishedAt desc)[0...5] {
    title,
    "slug": slug.current,
    "category": categories[0]->slug.current, 
    publishedAt,
    "imageUrl": mainImage.asset->url
  }
`;

interface SidebarProps {
  currentSlug: string;
  categorySlug?: string;
}

export default function Sidebar({ currentSlug }: SidebarProps) {
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    client.fetch(SIDEBAR_QUERY, { currentSlug }).then(setRecentPosts).catch(() => {});
  }, [currentSlug]);

  return (
    // FIX: 
    // 1. 'w-full': Full width on mobile/tablet (stacks at bottom)
    // 2. 'lg:w-80': Fixed width ONLY on Large Screens (1024px+)
    // 3. 'shrink-0': Prevents it from shrinking if content is wide
    <aside className="w-full lg:w-80 shrink-0 space-y-8 mt-12 lg:mt-0">
      
      {/* WIDGET 1: TRUST SIGNAL */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-center gap-4 mb-4 relative z-10">
           <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
              <ShieldCheck className="w-7 h-7 text-[#4b0082]" />
           </div>
           <div>
              <h3>How we rank</h3>
              <p className="text-xs uppercase tracking-wider">Research-based</p>
           </div>
        </div>
        <p>
          We compare products sold in the UAE using verified Amazon.ae customer reviews, manufacturer specifications, and local warranty and availability. We don't test in a lab.
        </p>
      </div>

      {/* WIDGET 2: TRENDING POSTS */}
      {/* Sticky only on Desktop (lg) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
          <TrendingUp className="w-5 h-5 text-[#4b0082]" />
          <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Trending Now</h3>
        </div>
        
        <div className="flex flex-col gap-6">
          {recentPosts.map((post: any) => {
            const categoryPrefix = post.category ? post.category : 'reviews';
            const postUrl = `/${categoryPrefix}/${post.slug}`;

            return (
              <a key={post.slug} 
              href={postUrl} 
              className="group flex gap-4 items-start">
                <div className="relative w-24 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                  {post.imageUrl ? (
                    <img 
                      src={post.imageUrl} 
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <TrendingUp className="w-6 h-6 opacity-20" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col py-0.5">
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#4b0082] transition-colors line-clamp-2 leading-snug mb-1.5">
                    {post.title}
                  </h4>
                  {post.publishedAt && (
                     <div className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider font-bold">
                        <Clock className="w-4 h-4" />
                        <time suppressHydrationWarning>
                          {new Date(post.publishedAt).toLocaleDateString("en-AE", { 
                            timeZone: "Asia/Dubai",
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </time>
                     </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
