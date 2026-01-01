import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp, ShieldCheck } from "lucide-react";

// Fetches the 5 most recent posts
const SIDEBAR_QUERY = `
  *[_type in ["topTenList", "howTo", "post"] && slug.current != $currentSlug]
  | order(publishedAt desc)[0...5] {
    title,
    "slug": slug.current,
    publishedAt,
    "imageUrl": mainImage.asset->url
  }
`;

interface SidebarProps {
  currentSlug: string;
  categorySlug?: string;
}

export default async function Sidebar({ currentSlug, categorySlug }: SidebarProps) {
  const recentPosts = await client.fetch(SIDEBAR_QUERY, { currentSlug });

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-8 mt-8 lg:mt-0">
      
      {/* WIDGET 1: TRUST SIGNAL (Keep at Top!) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-center gap-4 mb-4 relative z-10">
           <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
              <ShieldCheck className="w-7 h-7 text-primary" />
           </div>
           <div>
              <h3 className="font-bold text-gray-900 leading-tight">Editorial Team</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Expert Reviewers</p>
           </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 relative z-10">
          We research, test, and review the best products in the UAE so you don't have to. 
          <span className="font-semibold text-gray-900"> Unbiased & Independent.</span>
        </p>
      </div>

      {/* WIDGET 2: TRENDING POSTS (Sticky) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
          <TrendingUp className="w-5 h-5 text-[#4b0082]" />
          <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Trending Now</h3>
        </div>
        
        <div className="flex flex-col gap-6">
          {recentPosts.map((post: any) => (
            <Link key={post.slug} href={`/${post.slug}`} className="group flex gap-4 items-start">
              
              {/* ✅ UPDATED: Rectangular Thumbnail (Youtube Style) */}
              <div className="relative w-24 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                {post.imageUrl ? (
                  <Image 
                    src={post.imageUrl} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="100px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <TrendingUp className="w-6 h-6 opacity-20" />
                  </div>
                )}
              </div>
              
              {/* Text */}
              <div className="flex flex-col py-0.5">
                <h4 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1.5">
                  {post.title}
                </h4>
                {post.publishedAt && (
                   <div className="flex items-center gap-1.5 text-[12px] text-gray-500 uppercase tracking-wider font-bold">
                      <Clock className="w-4 h-4" />
                      {new Date(post.publishedAt).toLocaleDateString("en-AE", { month: 'short', day: 'numeric', year: 'numeric' })}
                   </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

    </aside>
  );
}