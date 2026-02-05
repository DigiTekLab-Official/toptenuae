// src/components/templates/ComparisonSummaryTable.tsx
"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, ShieldCheck, Star, Minus } from "@/components/icons";
// 🗑️ DELETED: listImage import (We use direct URL from query)

// --- 1. UPDATED INTERFACES ---
interface Product {
  title: string;
  // ✅ UPDATE: Matches the GROQ query structure
  mainImage?: { url: string; alt?: string }; 
  affiliateLink?: string;
  retailer?: string;
  customerRating?: number;
}

interface ListItem {
  _key: string;
  rank: number;
  badgeLabel?: string; 
  product: Product;
}

export default function ComparisonSummaryTable({ items }: { items: ListItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-12 font-sans">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
           <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
           <h3 className="text-xl font-bold text-gray-900">The Final Verdict: 2026 Comparison</h3>
           <p className="text-sm text-gray-500">A quick recap of all top-rated products.</p>
        </div>
      </div>

      {/* ========================
          DESKTOP VIEW (Hidden on Mobile)
          ======================== */}
      <div className="hidden md:block overflow-hidden border border-gray-200 shadow-sm rounded-lg">
        <table className="w-full text-left border-collapse">
          {/* ✅ UPDATED: Used bg-primary instead of #4b0082 */}
          <thead className="bg-primary text-white text-sm uppercase tracking-wider">
            <tr>
              <th className="px-3 py-4 font-bold w-[8%] text-center">Rank</th>
              <th className="px-3 py-4 font-bold w-[15%]">Image</th>
              <th className="px-3 py-4 font-bold w-[30%]">Product Name</th>
              <th className="px-3 py-4 font-bold w-[20%]">Award</th>
              <th className="px-3 py-4 font-bold w-[12%] text-center">Rating</th>
              <th className="px-3 py-4 font-bold w-[15%] text-center">Check Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.map((item) => {
              const product = item.product || {};
              // ✅ FIX: Use direct URL
              const imageUrl = product.mainImage?.url || null;
              const title = product.title || "Product Name Unavailable";

              return (
                <tr key={item._key || item.rank} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-4 text-center font-black text-xl text-gray-400 group-hover:text-primary">
                    #{item.rank}
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-200 bg-white flex items-center justify-center">
                      {imageUrl ? (
                        <Image 
                          src={imageUrl} 
                          alt="" 
                          fill 
                          className="object-contain p-1"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 text-center">No Image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 leading-snug">
                    {title}
                  </td>
                  <td className="px-4 py-4">
                     {item.badgeLabel ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary border border-primary-100">
                        {item.badgeLabel}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">-</span>
                    )}
                  </td>
                  
                  {/* RATING COLUMN */}
                  <td className="px-4 py-4 text-center">
                    {product.customerRating ? (
                      <div className="flex items-center justify-center gap-1 font-bold text-gray-700">
                        <span className="text-amber-500 fill-amber-500 text-lg">★</span>
                        {product.customerRating}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {product.affiliateLink ? (
                      <a 
                        href={product.affiliateLink} 
                        target="_blank"
                        rel="nofollow noopener"
                        // Amazon Yellow (#FFD814) replaced with Tailwind standard 'bg-yellow-400'
                        className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm px-4 py-2 rounded-lg shadow-sm transition-transform active:scale-95 whitespace-nowrap"
                      >
                        Check <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic flex justify-center gap-1"><Minus className="w-3 h-3"/> Unavailable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================
          MOBILE CARD VIEW (Visible only on Mobile)
          ======================== */}
      <div className="md:hidden space-y-4">
        {items.map((item) => {
          const product = item.product || {};
          // ✅ FIX: Use direct URL
          const imageUrl = product.mainImage?.url || null;
          const title = product.title || "Product Name Unavailable";

          return (
            <div 
              key={item._key || item.rank} 
              // ✅ UPDATED: Border primary
              className="bg-white border border-gray-200 border-l-4 border-l-primary rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-start gap-3">
                 {/* ✅ UPDATED: bg-primary */}
                 <span className="bg-primary text-white font-black text-sm w-8 h-8 flex items-center justify-center rounded-lg shadow-sm shrink-0">
                    #{item.rank}
                 </span>
                 <h4 className="font-bold text-gray-900 leading-tight">
                    {title}
                 </h4>
              </div>

              <div className="p-4 flex items-center gap-4">
                 <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                   {imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt="" 
                        fill 
                        className="object-contain p-2"
                      />
                   ) : (
                      <span className="text-xs text-gray-400 text-center">No Image</span>
                   )}
                 </div>
                 
                 <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between items-start">
                        {item.badgeLabel && (
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-0.5">Award</span>
                            <span className="text-xs font-bold text-primary bg-primary-50 px-2 py-1 rounded-md w-fit">
                            {item.badgeLabel}
                            </span>
                        </div>
                        )}
                        {/* Mobile Rating */}
                        {product.customerRating && (
                             <div className="flex flex-col items-end">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-0.5">Rating</span>
                                <span className="text-sm font-bold text-gray-900 flex items-center">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1"/> {product.customerRating}
                                </span>
                             </div>
                        )}
                    </div>
                    
                    {product.affiliateLink && (
                       <a 
                          href={product.affiliateLink}
                          target="_blank"
                          rel="nofollow noopener"
                          className="mt-1 w-full flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold text-sm py-2 rounded-lg shadow-sm hover:bg-yellow-500"
                       >
                          Check Price <ExternalLink className="w-3 h-3" />
                       </a>
                    )}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}