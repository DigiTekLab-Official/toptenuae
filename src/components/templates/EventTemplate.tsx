// src/components/templates/EventTemplate.tsx
"use client";

import React from "react";
import Image from "next/image";
import { discoverImage } from "@/sanity/lib/image";
import { generateEventSchema } from "@/lib/schemaGenerator";
import { Calendar, MapPin, Ticket } from "lucide-react";
import PortableText from "@/components/PortableText";
import FAQAccordion from "@/components/FAQAccordion";

export interface EventSanityData {
  title: string;
  description: string;
  mainImage?: any;
  category?: { title: string; slug: string };
  startDate: string;
  endDate?: string;
  isAllDay?: boolean;
  status: 'scheduled' | 'cancelled' | 'postponed' | 'rescheduled';
  previousStartDate?: string;
  locationName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  ticketPrice?: number;
  currency?: string;
  ticketUrl?: string;
  isTicketAvailable?: boolean;
  organizerName?: string;
  organizerUrl?: string;
  intro?: any;
  body?: any;
  faqs?: any[];
}

export default function EventTemplate({ data }: { data: EventSanityData }) {
  const heroImageUrl = data.mainImage ? discoverImage(data.mainImage) : null;
  const jsonLd = generateEventSchema(data, heroImageUrl);

  // --- LOGIC ---
  const hasVenue = !!data.locationName;
  // Strict Ticket Check: Only show if URL exists OR Price is explicitly not null
  const hasTickets = !!data.ticketUrl || (data.ticketPrice !== null && data.ticketPrice !== undefined);
  
  // 🟢 SMART HIDE: 
  // If it's an "All Day" event starting on Jan 1st, it's likely a "Yearly List". 
  // In that case, we HIDE the specific date block to avoid confusion.
  const isYearlyList = data.isAllDay && new Date(data.startDate).getMonth() === 0 && new Date(data.startDate).getDate() === 1;
  const showKeyDetails = !isYearlyList && (!!data.startDate || hasVenue);

  return (
    <div className="max-w-4xl mx-auto"> 
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Header Image */}
      {heroImageUrl && (
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md mb-8">
          <Image
            src={heroImageUrl}
            alt={data.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
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

      {/* 3. Key Details Grid (HIDDEN for Yearly Lists) */}
      {showKeyDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
          
          {/* Date & Time */}
          {data.startDate && (
            <div className="flex items-start gap-3">
              <Calendar className="w-6 h-6 text-primary mt-1" />
              <div>
                <h2 className="font-bold text-gray-900">Date & Time</h2>
                <p className="text-gray-700">
                  {new Date(data.startDate).toLocaleDateString("en-GB", { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                  
                  {/* Only show time if "All Day" is explicitly FALSE */}
                  {data.isAllDay === false && (
                    <>
                      <br />
                      <span className="text-sm font-medium text-gray-500">
                        {new Date(data.startDate).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          {hasVenue && (
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-bold text-gray-900">Venue</h3>
                <p className="font-semibold text-gray-800">{data.locationName}</p>
                {data.address && (
                  <p className="text-sm text-gray-600">
                    {[data.address.street, data.address.city, data.address.state].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Ticket Section */}
      {hasTickets && (
        <div className="bg-white border-2 border-primary/10 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {(data.ticketPrice === 0 || data.ticketPrice === null) 
                  ? "Free Entry" 
                  : `Tickets: AED ${data.ticketPrice}`}
              </h3>
              <p className="text-sm text-gray-500">
                {data.isTicketAvailable === false ? "Currently Sold Out" : "Available Now"}
              </p>
            </div>
          </div>
          
          {data.ticketUrl && (
            <a 
              href={data.ticketUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full md:w-auto text-center"
            >
              Get Tickets
            </a>
          )}
        </div>
      )}

      {/* 5. ARTICLE CONTENT */}
      <div className="prose prose-lg prose-headings:text-primary prose-a:text-primary max-w-none text-gray-700 leading-relaxed">
        {data.intro && (
          <div className="mb-8 font-medium text-gray-800  bg-gray-50/50 p-4 rounded-r-lg">
            <PortableText value={data.intro} />
          </div>
        )}
        {data.body && <PortableText value={data.body} />}
      </div>

      {/* 6. FAQ SECTION */}
      {data.faqs && data.faqs.length > 0 && <FAQAccordion faqs={data.faqs} />}
        
     
    </div>
  );
}