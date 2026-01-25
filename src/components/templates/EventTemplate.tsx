"use client";

import React from "react";
import Image from "next/image";
import { Calendar, MapPin, Ticket } from "lucide-react";
import PortableText from "@/components/sanity/PortableText";
import FAQAccordion from "@/components/FAQAccordion";

// ✅ UPDATED INTERFACE: Matches your new 'GENERIC_POST_QUERY'
export interface EventSanityData {
  title: string;
  // ✅ FIX: Image is now a resolved object from the query
  mainImage?: { url: string; alt?: string };
  category?: { title: string; slug: string };
  startDate?: string;
  endDate?: string;
  isAllDay?: boolean;
  status?: 'scheduled' | 'cancelled' | 'postponed' | 'rescheduled';
  locationName?: string;
  address?: string; // Query returns string or object depending on schema, safe to handle both
  ticketPrice?: string | number; // Query might return formatted string
  ticketUrl?: string;
  intro?: any;
  body?: any;
  faqs?: any[];
}

export default function EventTemplate({ data }: { data: EventSanityData }) {
  // ✅ FIX: Use the URL directly. No need for 'discoverImage' helper anymore.
  const heroImageUrl = data.mainImage?.url || null;
  const imageAlt = data.mainImage?.alt || data.title;

  // --- LOGIC ---
  const hasVenue = !!data.locationName || !!data.address;
  // Safe check for tickets
  const hasTickets = !!data.ticketUrl || (data.ticketPrice !== null && data.ticketPrice !== undefined && data.ticketPrice !== "");
  
  // Logic to hide details for yearly generic lists (optional, kept from your code)
  const isYearlyList = data.isAllDay && data.startDate && new Date(data.startDate).getMonth() === 0 && new Date(data.startDate).getDate() === 1;
  const showKeyDetails = !isYearlyList && (!!data.startDate || hasVenue);

  // Format Date Helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-AE", { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleTimeString("en-AE", { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' });
  };

  return (
    <div className="max-w-4xl mx-auto"> 
      
      {/* 1. Header Image */}
      {heroImageUrl ? (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden shadow-md mb-8 bg-gray-100">
          <Image
            src={heroImageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 850px"
          />
          {/* Optional: Date Badge */}
          {data.startDate && !isYearlyList && (
             <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-sm border border-gray-100 text-center min-w-[60px]">
               <span className="block text-xs font-bold text-red-600 uppercase tracking-wider">
                 {new Date(data.startDate).toLocaleDateString('en-US', { month: 'short' })}
               </span>
               <span className="block text-xl font-black text-slate-900 leading-none">
                 {new Date(data.startDate).getDate()}
               </span>
             </div>
          )}
        </div>
      ) : (
        // Fallback for events without images
        <div className="w-full h-48 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-8 flex items-center justify-center">
           <Calendar className="w-12 h-12 text-indigo-200" />
        </div>
      )}

      {/* 2. Event Title & Status */}
      <div className="mb-6">
        {data.category?.title && (
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            {data.category.title}
          </span>
        )}
        {data.status && data.status !== 'scheduled' && (
          <span className={`
            inline-block px-3 py-1 rounded-full text-sm font-bold uppercase mb-3 ml-2
            ${data.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-800'}
          `}>
            {data.status}
          </span>
        )}
      </div>

      {/* 3. Key Details Grid */}
      {showKeyDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
          
          {/* Date & Time */}
          {data.startDate && (
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Date & Time</h2>
                <p className="text-gray-900 font-medium">
                  {formatDate(data.startDate)}
                </p>
                {data.isAllDay === false && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    Starts at {formatTime(data.startDate)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          {hasVenue && (
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-lg text-red-500 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Location</h3>
                {data.locationName && <p className="font-semibold text-gray-900">{data.locationName}</p>}
                {data.address && (
                  <p className="text-sm text-gray-600 leading-snug mt-0.5">
                    {typeof data.address === 'string' 
                      ? data.address 
                      : Object.values(data.address).filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Ticket Section */}
      {hasTickets && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-10 hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {(data.ticketPrice === 0 || data.ticketPrice === "0" || data.ticketPrice === null) 
                  ? "Free Entry" 
                  : `Tickets: ${data.ticketPrice} AED`}
              </h3>
              <p className="text-sm text-gray-500">
                Official booking required
              </p>
            </div>
          </div>
          
          {data.ticketUrl && (
            <a 
              href={data.ticketUrl}
              target="_blank" 
              rel="nofollow noopener"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full md:w-auto text-center shadow-md"
            >
              Get Tickets
            </a>
          )}
        </div>
      )}

      {/* 5. ARTICLE CONTENT */}
      <div className="prose prose-lg prose-headings:text-slate-900 prose-a:text-blue-600 max-w-none text-gray-700 leading-relaxed">
        {data.intro && (
          <div className="mb-8 text-xl font-medium text-slate-800 leading-relaxed border-l-4 border-blue-500 pl-4">
            <PortableText value={data.intro} />
          </div>
        )}
        {data.body && <PortableText value={data.body} />}
      </div>

      {/* 6. FAQ SECTION */}
      {data.faqs && data.faqs.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <FAQAccordion faqs={data.faqs} />
        </div>
      )}
     
    </div>
  );
}