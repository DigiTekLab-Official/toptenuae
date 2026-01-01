'use client';

import Image from 'next/image';
import { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import { Deal } from '@/types/sanity';
import { ArrowRight, ShoppingCart, Copy, Check } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // --- 1. FIX: Resolve the Category Name safely ---
  const categoryLabel = typeof deal.category === 'object' && deal.category !== null
    ? deal.category.title || 'Deal'  // If object, grab the title
    : (deal.category as string) || 'Deal'; // If string, use it directly

  const discount = deal.discountPercentage ||
    (typeof deal.originalPrice === 'number' && typeof deal.dealPrice === 'number' && deal.originalPrice > 0
      ? Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100)
      : 0);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (deal.couponCode) {
      navigator.clipboard.writeText(deal.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="group relative block h-full">
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-300 hover:border-[#4b0082]/30 transition-all duration-300 h-full flex flex-col overflow-hidden">
        
        {/* Corner Decoration: Discount */}
        {discount > 0 && (
          <div className="absolute top-0 right-0 z-10">
            <div className="bg-[#4b0082]/10 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 flex items-end justify-start pb-5 pl-5">
               <span className="text-[#4b0082] font-black text-lg">-{discount}%</span>
            </div>
          </div>
        )}

        {/* Image Area */}
        <div className="relative h-48 w-full mb-6 flex items-center justify-center p-4 bg-slate-50 rounded-xl group-hover:bg-purple-50 transition-colors duration-300">
          {deal.image && !imageError ? (
            <div className="relative w-full h-full">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <ShoppingCart className="w-12 h-12 text-slate-300" />
          )}
          
          {deal.isPrimeExclusive && (
            <div className="absolute top-2 left-2 bg-[#00A8E1] text-white text-[10px] font-bold py-1 px-2 rounded shadow-sm">
              Prime Only
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col">
          <div className="mb-2">
             {/* --- 2. USE THE FIXED LABEL HERE --- */}
             <span className="text-[11px] font-bold uppercase tracking-wider text-[#4b0082] bg-purple-50 px-2 py-1 rounded-md">
              {categoryLabel}
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#4b0082] transition-colors line-clamp-2" title={deal.title}>
            {deal.title}
          </h2>

          {/* Price */}
          <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {typeof deal.dealPrice === 'number'
                  ? <>
                      AED {Math.floor(deal.dealPrice)}
                      <span className="text-sm align-top">.{deal.dealPrice.toFixed(2).split('.')[1]}</span>
                    </>
                  : 'AED --'}
              </span>
              {typeof deal.originalPrice === 'number' && typeof deal.dealPrice === 'number' && deal.originalPrice > deal.dealPrice && (
                <span className="text-sm text-slate-400 line-through decoration-slate-400">
                  AED {Math.floor(deal.originalPrice)}
                </span>
              )}
            </div>

            {deal.dealEndDate && (
               <div className="mt-2 text-xs text-slate-500 flex items-center gap-1 bg-slate-50 py-1 px-2 rounded w-fit">
                 <span>⏳ Ends in:</span>
                 <CountdownTimer endDate={deal.dealEndDate} />
               </div>
            )}
          </div>
        </div>
        
        {/* Coupon Code Section */}
        {deal.couponCode && (
          <div className="mt-4 mb-2">
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 border-dashed rounded-lg p-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                  Use Code:
                </span>
                <span className="text-sm font-black text-amber-900 font-mono">
                  {deal.couponCode}
                </span>
                {deal.couponNote && (
                  <span className="text-[9px] text-amber-700">
                    {deal.couponNote}
                  </span>
                )}
              </div>
              <button 
                onClick={handleCopy}
                className="bg-white p-2 rounded-md shadow-sm border border-amber-200 hover:bg-amber-100 transition-colors"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-amber-600" />}
              </button>
            </div>
          </div>
        )}

        {/* CTA Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <a
            href={deal.affiliateLink as string} // Explicit cast for safety
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="flex items-center justify-between w-full text-slate-600 font-bold text-sm group-hover:text-[#4b0082] transition-colors"
          >
            <span>View Deal on Amazon</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
}