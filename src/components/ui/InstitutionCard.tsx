// src/components/ui/InstitutionCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import LogoIcon from "@/components/icons/LogoIcon";
import { 
  MapPin, GraduationCap, Coins, AlertTriangle, 
  ExternalLink, Globe, Info, Award, CheckCircle2 
} from "@/components/icons";

// ✅ 1. Update Interface
interface SchoolData {
  title: string;
  location?: string;
  address?: string;
  curriculum?: string;
  feeRange?: string;   
  rating?: string | number;   
  verdict?: string;
  mainImage?: any; // ✅ ALLOWS SANITY OBJECT
  realityCheck?: string[];
  website?: string;
}

interface InstitutionCardProps {
  item: {
    rank: number;
    badgeLabel?: string;
    whySelected?: string;
    customVerdict?: string;
    product: SchoolData; 
  };
}

export default function InstitutionCard({ item }: InstitutionCardProps) {
  const school = item.product || {};
  const verdictText = item.customVerdict || school.verdict;

  // SEO Friendly Alt Text
  const seoAltText = `${school.title} campus in ${school.location || "Dubai"} - ${school.curriculum || "School"} Review`;

  return (
    <article
      id={`item-${item.rank}`}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden scroll-mt-32 mb-10"
    >
      <div className="p-6 md:p-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
          <div className="flex-shrink-0 bg-purple-100 text-purple-800 font-black text-xl px-4 py-2 rounded-lg border border-purple-200 shadow-sm text-center min-w-[60px]">
            #{item.rank}
          </div>
          
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {school.title}
            </h2>
            {/* Short location for subtitle (keeps header clean) */}
            {(school.location || school.address) && (
              <div className="flex items-center gap-1.5 text-gray-500 mt-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-purple-500" />
                {school.location || "Dubai, UAE"}
              </div>
            )}
          </div>
        </div>

        {/* --- BADGE (EMBOSSED 3D LOOK) --- */}
        {item.badgeLabel && (
          <div className="mb-6 flex">
            {/* ✅ UPDATED: bg-primary */}
            <div className="relative bg-primary text-white px-5 py-1.5 rounded-lg shadow-lg overflow-hidden border-t border-white/20 border-b border-black/20">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
              <div className="relative flex items-center gap-2 font-black tracking-wide uppercase text-sm">
                <LogoIcon className="w-5 h-5" /> 
                <span className="drop-shadow-sm">{item.badgeLabel}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* --- IMAGE (OPTIMIZED) --- */}
        {school.mainImage && (
          <div className="relative w-full h-64 md:h-[350px] mb-8 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
            <Image
              // ✅ Handle both transformed (with url) and raw Sanity objects
              src={
                typeof school.mainImage === 'string' 
                  ? school.mainImage 
                  : school.mainImage.url 
                    ? school.mainImage.url 
                    : urlForImage(school.mainImage).width(800).height(500).url()
              }
              alt={seoAltText}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority={item.rank === 1}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* --- VERDICT --- */}
        {verdictText && (
          <div className="mb-6 bg-primary-50 border-l-4 border-primary p-4 md:p-5 rounded-r-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-black text-primary uppercase tracking-wider">The Verdict</h3>
              </div>
              <p className="text-gray-900 leading-relaxed font-medium text-sm md:text-base">
                {verdictText}
              </p>
          </div>
        )}

        {/* --- STATS STACK --- */}
        <div className="flex flex-col gap-3 mb-8">
          
          {/* Row 1: Curriculum */}
          <div className="flex items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
            <div className="w-12 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0 mr-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Curriculum</p>
              <p className="font-bold text-gray-900">{school.curriculum || "N/A"}</p>
            </div>
          </div>

          {/* Row 2: Fees */}
          <div className="flex items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-amber-200 transition-colors">
            <div className="w-12 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0 mr-4">
              <Coins className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Annual Fees</p>
              <p className="font-bold text-gray-900">{school.feeRange || "Check Website"}</p>
            </div>
          </div>

          {/* Row 3: KHDA Rating */}
          {school.rating && (
            <div className="flex items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-green-200 transition-colors">
              <div className="w-12 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 flex-shrink-0 mr-4">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">KHDA Rating</p>
                <div className="flex items-center gap-2">
                   <p className="font-bold text-gray-900">{school.rating}</p>
                   {school.rating === 'Outstanding' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </div>
              </div>
            </div>
          )}

          {/* Row 4: FULL ADDRESS */}
          {(school.address || school.location) && (
            <div className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-purple-200 transition-colors">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0 mr-4 mt-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                <p className="font-bold text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">
                  {school.address || school.location}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* --- WHY SELECTED --- */}
        {item.whySelected && typeof item.whySelected === 'string' && (
          <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
             <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
               <Info className="w-4 h-4" /> Why Selected
             </h4>
             <p className="text-slate-800 font-semibold leading-relaxed">
               {item.whySelected}
             </p>
          </div>
        )}

        {/* --- REALITY CHECK --- */}
        {school.realityCheck && school.realityCheck.length > 0 && (
          <div className="mb-8 p-5 bg-rose-50 rounded-xl border border-rose-100">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="font-black text-rose-900 text-sm uppercase tracking-widest">
                The Reality Check
              </h3>
            </div>
            <ul className="space-y-2.5">
              {school.realityCheck.map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-800 leading-snug font-medium">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- FOOTER BUTTON --- */}
        {school.website && (
          <div className="pt-6 border-t border-gray-100 flex justify-center md:justify-start">
            <a 
              href={school.website}
              target="_blank"
              rel="nofollow noopener"
              className="flex items-center justify-center w-full md:w-auto px-8 py-3.5 gap-2 text-base font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Globe className="w-4 h-4" /> Visit Official Website <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        )}

      </div>
    </article>
  );
}