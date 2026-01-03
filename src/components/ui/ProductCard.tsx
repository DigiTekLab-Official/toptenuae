"use client";

import React from "react";
import Image from "next/image";
import { listImage } from "@/sanity/lib/image"; 
import LogoIcon from "@/components/icons/LogoIcon"; 
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  Star, 
  ExternalLink, 
  Shield,
  Tag,
  BatteryMedium,
  Wifi,
  Zap,
  Monitor,
  Camera,
  Headphones,
  Droplets,
  Clock,
  Box,
  Award,
  Layers,
  Truck
} from "lucide-react";

// --- 1. HELPER FUNCTION: ICONS ---
const getFeatureIcon = (feature: string) => {
  if (!feature) return <Star className="w-4 h-4 text-amber-400" />;
  const lowerFeature = feature.toLowerCase();
  
  if (lowerFeature.includes("battery") || lowerFeature.includes("charging")) return <BatteryMedium className="w-4 h-4 text-emerald-600" />;
  if (lowerFeature.includes("wifi") || lowerFeature.includes("wireless") || lowerFeature.includes("bluetooth")) return <Wifi className="w-4 h-4 text-blue-600" />;
  if (lowerFeature.includes("fast") || lowerFeature.includes("speed") || lowerFeature.includes("processor")) return <Zap className="w-4 h-4 text-yellow-500" />;
  if (lowerFeature.includes("display") || lowerFeature.includes("screen") || lowerFeature.includes("oled")) return <Monitor className="w-4 h-4 text-indigo-500" />;
  if (lowerFeature.includes("camera") || lowerFeature.includes("lens")) return <Camera className="w-4 h-4 text-rose-500" />;
  if (lowerFeature.includes("sound") || lowerFeature.includes("audio")) return <Headphones className="w-4 h-4 text-pink-500" />;
  if (lowerFeature.includes("water") || lowerFeature.includes("proof")) return <Droplets className="w-4 h-4 text-cyan-600" />;
  if (lowerFeature.includes("warranty") || lowerFeature.includes("guarantee")) return <Shield className="w-4 h-4 text-green-600" />;
  if (lowerFeature.includes("year") || lowerFeature.includes("life")) return <Clock className="w-4 h-4 text-orange-600" />;
  if (lowerFeature.includes("dimension") || lowerFeature.includes("weight")) return <Box className="w-4 h-4 text-slate-500" />;
  if (lowerFeature.includes("quality") || lowerFeature.includes("premium")) return <Award className="w-4 h-4 text-amber-500" />;
  if (lowerFeature.includes("pieces") || lowerFeature.includes("set")) return <Layers className="w-4 h-4 text-purple-500" />;
  if (lowerFeature.includes("shipping") || lowerFeature.includes("delivery")) return <Truck className="w-4 h-4 text-slate-600" />;
  
  return <Star className="w-4 h-4 text-amber-400" />;
};

// --- 2. HELPER FUNCTION: PRICING ---
const getPriceLabel = (price: number | undefined, currency: string = 'AED') => {
  if (!price || isNaN(price)) return "Check Price";
  return `${currency} ${price.toLocaleString()}`; 
};

interface ProductCardProps {
  item: any; 
  index?: number;
}

export default function ProductCard({ item, index = 0 }: ProductCardProps) {
  const product = item.product || {};
  const imageUrl = product.mainImage ? listImage(product.mainImage) : null;
  const displayName = product.title || "Product Name Unavailable";
  const finalVerdict = item.customVerdict || product.verdict; 

  // 🛑 REMOVED LOCAL SCHEMA (jsonLd) TO FIX GOOGLE DUPLICATE ERROR
  // The Schema is now handled globally in page.tsx

  // Define Brand Colors
  const brandColorClass = "text-[#4b0082]";
  const brandBgClass = "bg-[#4b0082]";
  const brandBorderClass = "border-[#4b0082]";
  const brandLightBgClass = "bg-[#ECE4FD]"; 

  return (
    <article
      id={`item-${item.rank}`}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden scroll-mt-32 mb-8"
    >
      <div className="p-5 md:p-6 pb-0">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <span className={`flex-shrink-0 ${brandLightBgClass} ${brandColorClass} text-xl font-black px-3 py-1 rounded-lg border-2 ${brandBorderClass} shadow-sm`}>
              #{item.rank}
            </span>
            <div>
               <h2 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight mt-1">
                 {displayName}
               </h2>
               {product.heroFeature && (
                 <p className={`text-sm font-medium ${brandColorClass} mt-1 flex items-center gap-1`}>
                   <Star className={`w-3 h-3 fill-current`} /> Best For: {product.heroFeature}
                 </p>
               )}
            </div>
          </div>
          
          {/* DESKTOP CTA */}
          {product.affiliateLink && (
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="nofollow noopener"
              className="hidden md:flex items-center gap-1 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              Check Price <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* --- BADGE (EMBOSSED 3D LOOK) --- */}
        {item.badgeLabel && (
          <div className="mb-6 flex">
            <div className={`relative ${brandBgClass} text-white px-5 py-1.5 rounded-lg shadow-lg overflow-hidden border-t border-white/20 border-b border-black/20`}>
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
              <div className={`relative flex items-center gap-2 font-black tracking-wide uppercase text-sm`}>
                <LogoIcon className="w-5 h-5" /> 
                <span className="drop-shadow-sm">{item.badgeLabel}</span>
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN IMAGE --- */}
        {imageUrl && (
          <div className="mb-6 flex justify-center">
            <div className="relative h-72 md:h-80 w-full max-w-[320px] overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm">
              <Image
                src={imageUrl}
                alt={displayName}
                fill
                className="object-contain p-3 hover:scale-105 transition-transform duration-500"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
        )}

        {/* --- VERDICT --- */}
        {finalVerdict && (
          <div className={`mb-6 ${brandLightBgClass} border-l-4 ${brandBorderClass} p-4 md:p-5 rounded-r-xl shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <Info className={`w-4 h-4 ${brandColorClass}`} />
              <h3 className={`text-sm font-black ${brandColorClass} uppercase tracking-wider`}>The Verdict</h3>
            </div>
            <p className="text-gray-900 leading-relaxed font-medium text-sm md:text-base">
              {finalVerdict}
            </p>
          </div>
        )}

        {/* --- KEY FEATURES --- */}
        {product.keyFeatures && product.keyFeatures.length > 0 && (
          <div className="mb-6 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100">
             <div className="flex items-center gap-3 mb-3 text-gray-900 pb-2 border-b border-amber-200/50">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-1 rounded-md shadow-sm">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-sm text-amber-700">Key Specs</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {product.keyFeatures.map((feat: string, i: number) => (
                <li key={i} className="flex items-center gap-2 py-1.5 px-2.5 bg-white/70 rounded-md border border-white/50 shadow-sm text-sm font-medium text-gray-700">
                  <span className="flex-shrink-0">{getFeatureIcon(feat)}</span>
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- PROS & CONS --- */}
        {(product.pros?.length || product.cons?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {product.pros && product.pros.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <h3 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4" /> The Good
                </h3>
                <ul className="space-y-1">
                  {product.pros.map((pro: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-800 leading-snug">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className={i < 2 ? "font-semibold" : ""}>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.cons && product.cons.length > 0 && (
              <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                <h3 className="font-bold text-rose-900 text-sm mb-2 flex items-center gap-2">
                   <XCircle className="w-4 h-4" /> Watch Out
                </h3>
                <ul className="space-y-1">
                  {product.cons.map((con: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-800 leading-snug">
                       <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                       <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* --- WHY WE PICKED THIS --- */}
        {item.whySelected && (
          <div className="mb-4 p-4 bg-slate-100 rounded-xl border border-slate-300 border-l-4 border-l-slate-600">
            <div className="flex items-center gap-2 mb-1">
              <Info className={`w-3 h-3 ${brandColorClass}`} />
              <h3 className={`text-sm font-bold ${brandColorClass} uppercase tracking-widest`}>Why we picked this</h3>
            </div>
            <p className="text-sm text-slate-900 font-semibold leading-relaxed italic">"{item.whySelected}"</p>
          </div>
        )}
      </div>

      {/* --- FOOTER CTA --- */}
      {product.affiliateLink && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 p-5">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5 w-full sm:w-auto text-center sm:text-left">
                  <span className="text-[14px] font-black text-gray-800 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-1">
                    <Tag className="w-4 h-4" />
                    {product.price ? "Approx. Price:" : "Price Level:"}
                  </span>
                  <span className="text-2xl font-black text-emerald-700 tracking-tight">
                    {getPriceLabel(product.price, product.currency)}
                  </span>
              </div>
              
              <div className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 duration-200">
                 <a 
                    href={product.affiliateLink}
                    target="_blank"
                    rel="nofollow noopener"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg shadow-sm text-center transition-colors"
                 >
                    Check Price on {product.retailer || 'Amazon'} <ExternalLink className="w-4 h-4" />
                 </a>
                 {product.retailer && (
                    <div className="text-center mt-1 text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
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