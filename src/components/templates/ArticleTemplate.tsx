// src/components/templates/ArticleTemplate.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Star, ShoppingCart, ExternalLink, Info } from "@/components/icons";
// ✅ IMPORT PORTABLE TEXT (Crucial for fixing missing content)
import PortableText from "@/components/sanity/PortableText";

export default function ArticleTemplate({ data }: { data: any }) {
  // 1. Safe Checks
  const hasPrice = data.price || (data.priceRange && data.priceRange !== "0");
  const hasAffiliateLink = !!data.affiliateLink;
  // If it's a "Guide", we usually don't want the Price Box unless explicitly set
  const showProductBox = (hasPrice || hasAffiliateLink) && data._type !== 'howTo';

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* 1. INTRO / EXCERPT */}
      {data.intro && (
        <div className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed mb-10 border-l-4 border-[#4b0082] pl-6">
           <PortableText value={data.intro} />
        </div>
      )}

      {/* 2. PRODUCT / PRICE BOX (Only show if it's actually a product/review) */}
      {showProductBox && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-2">
               <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                 Best Price Found
               </span>
               {data.rating && (
                 <div className="flex items-center text-amber-500">
                   <Star className="w-4 h-4 fill-current" />
                   <span className="ml-1 text-sm font-bold text-slate-700">{data.rating}/5</span>
                 </div>
               )}
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-1">Check price</h3>
             <p className="text-sm text-slate-500">Secure transaction via Amazon. We may earn a commission.</p>
          </div>
          
          <div className="w-full md:w-auto">
            {data.affiliateLink ? (
              <a 
                href={data.affiliateLink} 
                target="_blank" 
                rel="nofollow noopener"
                className="flex items-center justify-center gap-2 bg-[#4b0082] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#3a006b] transition-all shadow-lg hover:shadow-xl w-full md:w-auto"
              >
                <ShoppingCart className="w-5 h-5" />
                Check Price
              </a>
            ) : (
               <span className="text-slate-400 font-medium text-sm">Not currently available</span>
            )}
          </div>
        </div>
      )}

      {/* 3. MAIN BODY CONTENT (The Missing Part) */}
      <article className="prose prose-lg prose-slate max-w-none 
        prose-headings:font-bold prose-headings:text-slate-900 
        prose-a:text-[#4b0082] prose-a:font-bold hover:prose-a:text-amber-500 
        prose-img:rounded-2xl prose-img:shadow-md">
        
        {data.body ? (
          // ✅ THIS IS THE FIX: Using PortableText instead of {data.body}
          <PortableText value={data.body} />
        ) : (
          <div className="p-8 bg-slate-50 rounded-xl text-center text-slate-500">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Content is being updated for this guide.</p>
          </div>
        )}

      </article>

      {/* 4. CLOSING / VERDICT */}
      {data.closingContent && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Verdict</h3>
          <div className="prose prose-lg text-slate-700">
            <PortableText value={data.closingContent} />
          </div>
        </div>
      )}

    </div>
  );
}