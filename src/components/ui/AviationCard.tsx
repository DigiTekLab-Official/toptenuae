// src/components/ui/AviationCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import LogoIcon from "@/components/icons/LogoIcon";
import { 
  MapPin, Tag, Globe, ExternalLink, Info, 
  Shield
} from "@/components/icons";

interface AviationData {
  title: string;
  code?: string;      
  country?: string;
  rating?: number | string; 
  verdict?: string;
  mainImage?: { url: string };
  website?: string;
  entityType?: 'airline' | 'airport';
}

interface AviationCardProps {
  item: {
    rank: number;
    badgeLabel?: string;
    whySelected?: string;
    customVerdict?: string;
    product: AviationData; 
  };
}

export default function AviationCard({ item }: AviationCardProps) {
  const entity = item.product || {};
  const imageUrl = entity.mainImage?.url || null;
  const verdictText = (typeof (item.customVerdict || entity.verdict || item.whySelected) === 'string') ? (item.customVerdict || entity.verdict || item.whySelected) : null;
  const isAirport = entity.entityType === 'airport';

  // Labels
  const labels = {
    code: isAirport ? "Code" : "IATA",
    location: "Home Base",
    rating: isAirport ? "Skytrax" : "Safety Score"
  };
  
  // ✅ SEO FIX: Robust Alt Text Generation
  const imageAltText = entity.title 
    ? `${entity.title} ${isAirport ? 'Airport' : 'Airline'} Official Logo`
    : "Aviation Entity Logo";
    
  return (
    <article
      id={`item-${item.rank}`}
      className="bg-white border border-gray-200 rounded-2xl shadow-base hover:shadow-lg transition-all duration-300 overflow-hidden scroll-mt-32 mb-8"
    >
      {/* --- 1. HEADER ROW --- */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-4">
        <div className="flex-shrink-0 bg-[#0F172A] text-white font-black text-xl w-10 h-10 rounded-lg flex items-center justify-center shadow-base">
          #{item.rank}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 leading-none">
            {entity.title}
          </h2>
          <div className="md:hidden flex items-center gap-1.5 text-gray-500 mt-1.5 text-xs font-medium">
             <MapPin className="w-3 h-3" /> {entity.country}
          </div>
        </div>
        {/* Desktop Rating Badge */}
        <div className="hidden md:flex flex-col items-end">
             <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 text-base font-bold">
               <Shield className="w-4 h-4" />
               <span>{entity.rating ? `${entity.rating}/7` : "7/7"}</span>
             </div>
        </div>
      </div>

      {/* --- 2. SPLIT BODY --- */}
      <div className="flex flex-col md:flex-row">
        
        {/* LEFT COL: Logo Area */}
        <div className="w-full md:w-64 bg-white md:border-r border-slate-100 p-6 flex flex-col items-center justify-start relative min-h-[200px]">
           
           {/* ✅ BADGE: EMBOSSED 3D LOOK */}
           {item.badgeLabel && (
             <div className="absolute top-4 left-4 z-10 flex">
                <div className="relative bg-primary text-white px-4 py-1.5 rounded-lg shadow-lg overflow-hidden border-t border-white/20 border-b border-black/20">
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                  <div className="relative flex items-center gap-2 font-black tracking-wide uppercase text-xs">
                    <LogoIcon className="w-4 h-4" /> 
                    <span className="drop-shadow-base">{item.badgeLabel}</span>
                  </div>
                </div>
             </div>
           )}
           
           {imageUrl ? (
             <div className="relative w-full h-32 md:h-40 mt-10">
               <Image
                 src={imageUrl}
                 alt={entity.title}
                 fill
                 className="object-contain"
                 sizes="(max-width: 768px) 100vw, 300px"
               />
             </div>
           ) : (
             <span className="text-slate-300 text-base mt-8">No Logo</span>
           )}
        </div>

        {/* RIGHT COL: Data & Review */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between gap-6">
           
           {/* A. Editor's Verdict */}
           <div>
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
               <Info className="w-3 h-3" /> Editor's Verdict
             </h3>
             <p className="text-slate-700 leading-relaxed font-medium text-base md:text-base">
               {verdictText}
             </p>
           </div>

           {/* B. Stats Grid */}
           <div className="grid grid-cols-2 md:grid-cols-[1fr_2fr_1fr] gap-3">
              
              {/* Stat 1: IATA (Blue Border) */}
              <div className="bg-white p-2.5 rounded-xl border border-blue-600 flex items-center gap-3 shadow-base">
                 <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
                    <Tag className="w-4 h-4" />
                 </div>
                 <div className="min-w-0"> 
                    <div className="text-[12px] uppercase font-bold text-slate-400">{labels.code}</div>
                    <div className="text-base font-bold text-slate-900 truncate">{entity.code || "N/A"}</div>
                 </div>
              </div>

              {/* Stat 2: Country (Blue Border) */}
              <div className="bg-white p-2.5 rounded-xl border border-blue-600 flex items-center gap-3 shadow-base">
                 <div className="bg-amber-50 p-1.5 rounded-md text-amber-600">
                    <Globe className="w-4 h-4" />
                 </div>
                 <div className="min-w-0"> 
                    <div className="text-[12px] uppercase font-bold text-slate-400">{labels.location}</div>
                    <div className="text-base font-bold text-slate-900 truncate">
                      {entity.country || "Global"}
                    </div>
                 </div>
              </div>

               {/* Stat 3: Rating (Mobile Only) */}
               <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-3 md:hidden">
                 <div className="bg-white p-1.5 rounded-md shadow-base text-green-600">
                    <Shield className="w-4 h-4" />
                 </div>
                 <div>
                    <div className="text-[12px] uppercase font-bold text-slate-400">{labels.rating}</div>
                    <div className="text-base font-bold text-slate-900">{entity.rating || "7"}/7</div>
                 </div>
              </div>

              {/* ACTION BUTTON - Single unified link */}
              {entity.website ? (
                <a 
                  href={entity.website} 
                  target="_blank" 
                  rel="nofollow noopener"
                  className="col-span-2 md:col-span-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all shadow-base hover:shadow hover:-translate-y-0.5 py-3 md:h-full"
                >
                  <span className="md:hidden">Visit Official Website</span>
                  <span className="hidden md:inline">Visit Site</span>
                  <ExternalLink className="w-4 h-4 md:w-3 md:h-3" />
                </a>
              ) : (
                <div className="col-span-2 md:col-span-1 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center">
                  No Link
                </div>
              )}
           </div>
        </div>
      </div>
    </article>
  );
}