"use client";

import React, { useState } from "react";
import Image from "next/image";
import { listImage } from "@/sanity/lib/image"; 
import PortableText from "@/components/PortableText";
import LogoIcon from "@/components/icons/LogoIcon"; 
import { 
  CheckCircle2, XCircle, Info, Star, ChevronDown, ChevronUp, 
  ExternalLink, Shield, Tag, BatteryMedium, Wifi, Zap, Monitor, 
  Camera, Headphones, Droplets, Clock, Box, Award, Layers, Truck
} from "lucide-react";

// --- 1. HELPER FUNCTION: ICONS ---
const getFeatureIcon = (feature: string) => {
  if (!feature) return <Star className="w-4 h-4 text-amber-400" />;
  const lowerFeature = feature.toLowerCase();
  
  // ... (Keep your existing icon logic here) ...
  if (lowerFeature.includes("battery") || lowerFeature.includes("charging")) return <BatteryMedium className="w-4 h-4 text-emerald-600" />;
  // ... (Shortened for brevity, keep your original full list) ...
  
  return <Star className="w-4 h-4 text-amber-400" />;
};

// --- 2. HELPER FUNCTION: PRICING ---
// ✅ FIX: Removed "Approx." text. Now it just formats the number.
const getPriceLabel = (price: number | undefined, currency: string = 'AED') => {
  if (!price || isNaN(price)) return "Check Price";
  return `${currency} ${price.toLocaleString()}`; // e.g. "AED 1,655"
};

interface ProductCardProps {
  item: any; 
  index?: number;
}

export default function ProductCard({ item, index = 0 }: ProductCardProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const product = item.product || {};
  const imageUrl = product.mainImage ? listImage(product.mainImage) : null;
  const displayName = product.title || "Product Name Unavailable";
  const finalVerdict = item.customVerdict || product.verdict; 

  // SEO SCHEMA
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": displayName,
    "image": imageUrl || "",
    "description": finalVerdict || `Review of ${displayName}`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": product.currency || "AED",
      "availability": product.availability || "https://schema.org/InStock",
      "url": product.affiliateLink,
      ...(product.price ? { "price": product.price } : {}) 
    }
  };

  const brandColorClass = "text-[#4b0082]";
  const brandBgClass = "bg-[#4b0082]";
  const brandBorderClass = "border-[#4b0082]";
  const brandLightBgClass = "bg-[#ECE4FD]"; 

  return (
    <article id={`item-${item.rank}`} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden scroll-mt-32 mb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="p-5 md:p-6 pb-0">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <span className={`flex-shrink-0 ${brandLightBgClass} ${brandColorClass} text-xl font-black px-3 py-1 rounded-lg border-2 ${brandBorderClass} shadow-sm`}>#{item.rank}</span>
            <div>
               <h2 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight mt-1">{displayName}</h2>
               {product.heroFeature && (
                 <p className={`text-sm font-medium ${brandColorClass} mt-1 flex items-center gap-1`}>
                   <Star className={`w-3 h-3 fill-current`} /> Best For: {product.heroFeature}
                 </p>
               )}
            </div>
          </div>
          {product.affiliateLink && (
            <a href={product.affiliateLink} target="_blank" rel="nofollow noopener" className="hidden md:flex items-center gap-1 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap">
              Check Price <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* BADGE */}
        {item.badgeLabel && (
          <div className="mb-6 flex">
            <div className={`relative ${brandBgClass} text-white px-5 py-1.5 rounded-lg shadow-lg overflow-hidden border-t border-white/20 border-b border-black/20`}>
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
              <div className={`relative flex items-center gap-2 font-black tracking-wide uppercase text-sm`}>
                <LogoIcon className="w-5 h-5" /> <span className="drop-shadow-sm">{item.badgeLabel}</span>
              </div>
            </div>
          </div>
        )}

        {/* IMAGE */}
        {imageUrl && (
          <div className="mb-6 flex justify-center">
            <div className="relative h-72 md:h-80 w-full max-w-[320px] overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm">
              <Image src={imageUrl} alt={displayName} fill className="object-contain p-3 hover:scale-105 transition-transform duration-500" priority={index === 0} sizes="(max-width: 768px) 100vw, 400px" />
            </div>
          </div>
        )}

        {/* VERDICT */}
        {finalVerdict && (
          <div className={`mb-6 ${brandLightBgClass} border-l-4 ${brandBorderClass} p-4 md:p-5 rounded-r-xl shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <Info className={`w-4 h-4 ${brandColorClass}`} />
              <h3 className={`text-sm font-black ${brandColorClass} uppercase tracking-wider`}>The Verdict</h3>
            </div>
            <p className="text-gray-900 leading-relaxed font-medium text-sm md:text-base">{finalVerdict}</p>
          </div>
        )}

        {/* DESCRIPTION & SPECS (Keep your existing code here) ... */}
        {/* ... */}
        {/* ... */}

      </div>

      {/* --- FOOTER CTA (Pricing Fixed) --- */}
      {product.affiliateLink && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 p-5">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5 w-full sm:w-auto text-center sm:text-left">
                  {/* ✅ FIX: Changed label to "Approx. Price:" */}
                  <span className="text-[14px] font-black text-gray-800 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-1">
                    <Tag className="w-4 h-4" />
                    {product.price ? "Approx. Price:" : "Price Level:"}
                  </span>
                  {/* ✅ FIX: Value is now clean "AED 1,655" */}
                  <span className="text-2xl font-black text-emerald-700 tracking-tight">
                    {getPriceLabel(product.price, product.currency)}
                  </span>
              </div>
              
              <div className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 duration-200">
                 <a href={product.affiliateLink} target="_blank" rel="nofollow noopener" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg shadow-sm text-center transition-colors">
                    Check Price on {product.retailer || 'Amazon'} <ExternalLink className="w-4 h-4" />
                 </a>
                 {product.retailer && (
                    <div className="text-center mt-1 text-[13px] text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3 text-gray-400" /> via {product.retailer}
                    </div>
                  )}
              </div>
           </div>
        </div>
      )}
    </article>
  );
}