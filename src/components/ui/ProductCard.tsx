// src/components/ui/ProductCard.tsx
import { useState, useEffect } from "react";

import LogoIcon from "@/components/icons/LogoIcon"; 
import { 
  CheckCircle2, XCircle, Info, Star, ExternalLink, Shield, Tag,
  BatteryMedium, Wifi, Zap, Monitor, Camera, Headphones, Droplets,
  Clock, Box, Award, Layers, Truck, Settings
} from "@/components/icons";
import { listImage } from "@/sanity/lib/image";

// ✅ IMPORT GENERATED TYPES
import type { Product } from "@/sanity.types";

// --- 1. CONFIGURATION: ICONS ---
const ICON_CONFIG = [
  { keys: ["battery", "charging"], Icon: BatteryMedium, color: "text-emerald-600" },
  { keys: ["wifi", "wireless", "bluetooth"], Icon: Wifi, color: "text-blue-600" },
  { keys: ["fast", "speed", "processor"], Icon: Zap, color: "text-yellow-500" },
  { keys: ["display", "screen", "oled"], Icon: Monitor, color: "text-indigo-500" },
  { keys: ["camera", "lens"], Icon: Camera, color: "text-rose-500" },
  { keys: ["sound", "audio"], Icon: Headphones, color: "text-pink-500" },
  { keys: ["water", "proof"], Icon: Droplets, color: "text-cyan-600" },
  { keys: ["warranty", "guarantee"], Icon: Shield, color: "text-green-600" },
  { keys: ["year", "life"], Icon: Clock, color: "text-orange-600" },
  { keys: ["dimension", "weight"], Icon: Box, color: "text-slate-500" },
  { keys: ["quality", "premium"], Icon: Award, color: "text-amber-500" },
  { keys: ["pieces", "set"], Icon: Layers, color: "text-purple-500" },
  { keys: ["shipping", "delivery"], Icon: Truck, color: "text-slate-600" },
];

const getFeatureIcon = (feature: string) => {
  if (!feature) return <Star className="w-4 h-4 text-amber-400" />;
  const lowerFeature = feature.toLowerCase();

  const match = ICON_CONFIG.find(conf => 
    conf.keys.some(key => lowerFeature.includes(key))
  );

  if (match) {
    const { Icon, color } = match;
    return <Icon className={`w-4 h-4 ${color}`} />;
  }
  
  return <Star className="w-4 h-4 text-amber-400" />;
};

const firstDecisionSentence = (value?: string) => {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  const sentenceEnd = normalized.search(/[.!?](?=\s+[A-Z])/);
  return sentenceEnd >= 0 ? normalized.slice(0, sentenceEnd + 1) : normalized;
};

// --- 2. TYPES ---
interface Specification {
  _key: string; // <-- Add this line to satisfy Sanity's array requirements
  specLabel?: string;
  specValue?: string;
}

// Updated to include our new Sanity schema fields
interface ExtendedProduct extends Product {
  heroFeature?: string;
  specifications?: Specification[];
  asin?: string;
  fallbackPrice?: string;
  fallbackImageUrl?: string;
  siteStripeLink?: string;
}

interface ProductCardProps {
  item: {
    rank: number;
    badgeLabel?: string;
    customVerdict?: string;
    whySelected?: string;
    skipIf?: string;
    product?: ExtendedProduct;
  };
  index?: number;
  category?: string;
}

export default function ProductCard({ item, index = 0, category }: ProductCardProps) {
  const [liveData, setLiveData] = useState<any>(null);
  
  const product = item.product;

  // ✅ PA API FALLBACK LOGIC
  useEffect(() => {
    // Attempt to fetch live Amazon data via your own internal API route
    // to keep your PA API credentials secure on the server.
    const fetchAmazonData = async () => {
      if (!product?.asin) return;
      
      try {
        const response = await fetch(`/api/amazon?asin=${product.asin}`);
        if (response.ok) {
          const data = await response.json();
          setLiveData(data);
        } else {
          console.warn(`PA API fallback triggered for ASIN: ${product.asin}`);
        }
      } catch (error) {
        console.warn(`PA API fetch failed for ASIN: ${product.asin}. Using Sanity data.`);
      }
    };

    fetchAmazonData();
  }, [product?.asin]);
  
  // ✅ THE CASCADE: Prefer Live Data -> Fall back to Sanity SiteStripe Data
  let sanityImageUrl: string | null = null;
  if (product?.mainImage) {
    if ((product.mainImage as any).url) {
      sanityImageUrl = (product.mainImage as any).url;
    } else {
      sanityImageUrl = listImage(product.mainImage) || null;
    }
  }

  // Price intentionally not displayed: no live PA-API source, Sanity price is stale.
  const priceTier = (product as any)?.priceTier as string | undefined;
  const displayImage = liveData?.imageUrl || product?.fallbackImageUrl || sanityImageUrl;
  const targetLink = liveData?.detailPageURL || product?.siteStripeLink || (product as any)?.affiliateLink || '#';
  const isUnavailable = (product as any)?.availabilityStatus === 'unavailable';
  const availabilityCheckedAt = (product as any)?.availabilityCheckedAt || 'date not recorded';
  const availabilityMessage = `Currently unavailable on Amazon.ae — checked ${availabilityCheckedAt}`;
  
  const displayName = product?.title || "Product Name Unavailable";
  const productSlug = (product as any)?.slug as string | undefined;
  const finalVerdict = item.customVerdict || product?.verdict;
  
  // Safe access for arrays
  const specifications = product?.specifications || [];
  const keyFeatures = product?.keyFeatures || [];
  const pros = product?.pros || [];
  const cons = product?.cons || [];
  const whyBuy = firstDecisionSentence(item.whySelected);
  const skipIf = firstDecisionSentence(item.skipIf) || cons[0]?.trim();

  return (
    <article
      id={`item-${item.rank}`}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden scroll-mt-32 mb-6"
    >
      <div className="p-5 md:p-6 pb-0">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <span className="shrink-0 bg-primary-50 text-primary text-xl font-black px-3 py-1 rounded-lg border-2 border-primary-100 shadow-sm">
              #{item.rank}
            </span>
            <div>
               <h2 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight mt-1">
                 {displayName}
               </h2>
               {product?.heroFeature && (
                 <p className="text-sm font-medium text-primary mt-1 flex items-center gap-1">
                   <Star className="w-3 h-3 fill-current" /> Best For: {product.heroFeature}
                 </p>
               )}
            </div>
          </div>
        </div>

        {/* --- BADGE --- */}
        <div className="mb-6 flex h-[40px]">
          {item.badgeLabel && (
            <div className="relative bg-primary text-white px-5 py-1.5 rounded-lg shadow-lg overflow-hidden border-y border-white/20">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/30 to-transparent pointer-events-none"></div>
              <div className="relative flex items-center gap-2 font-black tracking-wide uppercase text-sm">
                <LogoIcon className="w-5 h-5" /> 
                <span className="drop-shadow-sm">{item.badgeLabel}</span>
              </div>
            </div>
          )}
        </div>

        {/* --- MAIN IMAGE --- */}
        {displayImage && (
          <div className="mb-6 flex justify-center">
            <div 
              className="relative w-full max-w-[320px] overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm"
              style={{ aspectRatio: '1' }}
            >
              <img
                src={displayImage}
                alt={displayName}
                className="absolute inset-0 w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-500"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          </div>
        )}

        {/* --- VERDICT --- */}
        {finalVerdict && (
          <div className="mb-6 bg-primary-50 border-l-4 border-primary p-4 md:p-5 rounded-r-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black text-primary uppercase tracking-wider">The Verdict</h3>
            </div>
            <p className="text-gray-900 leading-relaxed font-medium text-sm md:text-base">
              {finalVerdict}
            </p>
          </div>
        )}

        {/* --- KEY FEATURES --- */}
        {keyFeatures.length > 0 && (
          <div className="mb-6 bg-linear-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100">
             <div className="flex items-center gap-3 mb-3 text-gray-900 pb-2 border-b border-amber-200/50">
              <div className="bg-linear-to-br from-yellow-400 to-amber-500 p-1 rounded-md shadow-sm">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-sm text-amber-700">Highlights</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {keyFeatures.map((feat: string, i: number) => (
                <li key={i} className="flex items-center gap-2 py-1.5 px-2.5 bg-white/70 rounded-md border border-white/50 shadow-sm text-sm font-medium text-gray-700">
                  <span className="shrink-0">{getFeatureIcon(feat)}</span>
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* --- TECH SPECS --- */}
        {specifications.length > 0 && (
          <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
             <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
               <Settings className="w-5 h-5 text-slate-900" />
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Tech Specs</h3>
             </div>
             <table className="w-full text-sm">
               <tbody className="divide-y divide-slate-100">
                 {specifications.map((spec, i: number) => (
                   <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                     <td className="px-4 py-2 text-slate-500 font-medium w-1/3 border-r border-slate-100">{spec.specLabel}</td>
                     <td className="px-4 py-2 text-slate-900 font-semibold">{spec.specValue}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {/* --- PROS & CONS --- */}
        {(pros.length > 0 || cons.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {pros.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <h3 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4" /> The Good
                </h3>
                <ul className="space-y-1">
                  {pros.map((pro: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-800 leading-snug">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className={i < 2 ? "font-semibold" : ""}>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                <h3 className="font-bold text-rose-900 text-sm mb-2 flex items-center gap-2">
                   <XCircle className="w-4 h-4" /> Watch Out
                </h3>
                <ul className="space-y-1">
                  {cons.map((con: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-800 leading-snug">
                       <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                       <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* --- PURCHASE DECISION --- */}
        {(whyBuy || skipIf) && (
          <div className="mb-4 grid gap-3 md:grid-cols-2">
            {whyBuy && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="text-sm font-bold text-emerald-900">Why buy this one</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-800">{whyBuy}</p>
              </div>
            )}
            {skipIf && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <h3 className="text-sm font-bold text-rose-900">Skip if</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-800">{skipIf}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- EDITORIAL REVIEW LINK --- */}
      {productSlug && (
        <div className="px-5 md:px-6 pb-2">
          <a
            href={`/reviews/${productSlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Read our full {displayName} review
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      )}

      {/* --- FOOTER CTA --- */}
      {isUnavailable ? (
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border-t border-amber-200 p-5 text-center">
          <p className="font-semibold text-gray-800">{availabilityMessage}</p>
        </div>
      ) : targetLink && targetLink !== '#' && (
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border-t border-amber-200 p-5">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5 w-full sm:w-auto text-center sm:text-left">
                  <span className="text-[14px] font-black text-gray-800 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-1">
                    <Tag className="w-4 h-4" />
                    Price Level:
                  </span>
                  <span className="text-2xl font-black text-emerald-700 tracking-tight">
                    {priceTier ? `${priceTier} Tier` : 'Check price on Amazon.ae'}
                  </span>
              </div>
              
              <div className="flex flex-col items-center sm:items-end w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-95 duration-200">
                 <a 
                    href={targetLink}
                    data-affiliate-product={displayName}
                    data-affiliate-cta="product_card"
                    data-affiliate-category={category}
                    data-affiliate-position={item.rank}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg shadow-sm text-center transition-colors"
                 >
                    Check latest price on {(product as any)?.retailer || 'Amazon.ae'} <ExternalLink className="w-4 h-4" />
                 </a>
                 {/* ✅ COMPLIANCE: Micro-disclosure required by Amazon's manual review process */}
                 <div className="mt-2 text-[10px] text-gray-500 font-medium">
                   As an Amazon Associate I earn from qualifying purchases.
                 </div>
              </div>
           </div>
        </div>
      )}
    </article>
  );
}
