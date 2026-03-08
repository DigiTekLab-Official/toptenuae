// src/components/templates/EventTemplate.tsx


import { Calendar, MapPin, Ticket } from "@/components/icons";
import PortableText from "@/components/sanity/PortableText";
import FAQAccordion from "@/components/FAQAccordion";
import { formatDate, formatTime } from "@/lib/utils/sanity-text";

// 1. ROBUST INTERFACES
export interface EventSanityData {
  title: string;
  mainImage?: { 
    url: string; 
    alt?: string 
  };
  category?: { 
    title: string; 
    slug: string 
  };
  startDate?: string;
  endDate?: string;
  isAllDay?: boolean;
  status?: 'scheduled' | 'cancelled' | 'postponed' | 'rescheduled';
  locationName?: string;
  // Address can be simple string or object from Sanity Geopoint schema
  address?: string | { street?: string; city?: string; country?: string }; 
  ticketPrice?: string | number;
  ticketUrl?: string;
  intro?: any;
  body?: any;
  faqs?: any[];
}

export default function EventTemplate({ data }: { data: EventSanityData }) {
  // Safe Image Extraction
  const heroImageUrl = data.mainImage?.url || null;
  const imageAlt = data.mainImage?.alt || data.title;

  // --- LOGIC ---
  const hasVenue = !!data.locationName || !!data.address;
  
  // Safe Ticket Check: Ensure price isn't null/undefined, but allow 0 (Free)
  const hasTickets = !!data.ticketUrl || (data.ticketPrice !== undefined && data.ticketPrice !== null && data.ticketPrice !== "");

  // "Yearly List" Logic: Hide specific details for generic "2026 Events" lists
  const isYearlyList = !!(
    data.isAllDay && 
    data.startDate && 
    new Date(data.startDate).getMonth() === 0 && 
    new Date(data.startDate).getDate() === 1
  );

  const showKeyDetails = !isYearlyList && (!!data.startDate || hasVenue);

  const getAddressString = (addr: any) => {
    if (!addr) return null;
    if (typeof addr === 'string') return addr;
    // Handle Sanity object structure gracefully
    return [addr.street, addr.city, addr.country].filter(Boolean).join(", ");
  };

  return (
    <div className="max-w-4xl mx-auto font-sans"> 
      
      {/* 1. Header Image */}
      {heroImageUrl ? (
        <div className="relative w-full aspect-video md:aspect-21/9 rounded-xl overflow-hidden shadow-sm mb-8 bg-gray-100 border border-gray-100">
          <img
            src={heroImageUrl}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          {/* Date Badge (Only for specific events) */}
          {data.startDate && !isYearlyList && (
             <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm border border-gray-100 text-center min-w-15">
               <span className="block text-xs font-bold text-red-600 uppercase tracking-wider">
                 {new Date(data.startDate).toLocaleDateString('en-US', { month: 'short' })}
               </span>
               <span className="block text-xl font-black text-slate-900 leading-none mt-0.5">
                 {new Date(data.startDate).getDate()}
               </span>
             </div>
          )}
        </div>
      ) : (
        // Fallback for events without images
        <div className="w-full h-48 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl mb-8 flex items-center justify-center border border-indigo-100/50">
           <Calendar className="w-12 h-12 text-indigo-200" />
        </div>
      )}

      {/* 2. Event Meta Tags */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        {data.category?.title && (
          <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
            {data.category.title}
          </span>
        )}
        
        {data.status && data.status !== 'scheduled' && (
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
            ${data.status === 'cancelled' 
              ? 'bg-red-50 text-red-700 border-red-100' 
              : 'bg-orange-50 text-orange-800 border-orange-100'}
          `}>
            {data.status}
          </span>
        )}
      </div>

      {/* 3. Key Details Grid */}
      {showKeyDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/60 mb-8">
          
          {/* Date & Time */}
          {data.startDate && (
            <div className="flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-sm border border-gray-100 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">Date & Time</h2>
                <p className="text-gray-900 font-semibold leading-tight">
                  {formatDate(data.startDate)}
                </p>
                {!data.isAllDay && (
                  <p className="text-sm text-gray-500 mt-1">
                    Starts at {formatTime(data.startDate)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          {hasVenue && (
            <div className="flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl text-red-500 shadow-sm border border-gray-100 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">Location</h3>
                {data.locationName && (
                  <p className="font-semibold text-gray-900 leading-tight mb-0.5">{data.locationName}</p>
                )}
                {data.address && (
                  <p className="text-sm text-gray-500 leading-snug">
                    {getAddressString(data.address)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Ticket Section */}
      {hasTickets && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 transition-colors hover:border-blue-200">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {(data.ticketPrice === 0 || data.ticketPrice === "0" || data.ticketPrice === "Free") 
                  ? "Free Entry" 
                  : `Tickets: ${data.ticketPrice} AED`}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Official booking required
              </p>
            </div>
          </div>
          
          {data.ticketUrl && (
            <a 
              href={data.ticketUrl}
              target="_blank" 
              rel="nofollow noopener"
              className="w-full sm:w-auto inline-flex justify-center items-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
            >
              Get Tickets
            </a>
          )}
        </div>
      )}

      {/* 5. ARTICLE CONTENT */}
      <article className="prose prose-lg prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-a:font-semibold prose-img:rounded-xl max-w-none">
        {data.intro && (
          <div className="mb-10 text-xl font-medium text-slate-800 leading-relaxed border-l-4 border-blue-500 pl-6 py-1">
            {(() => {
              const introContent = data.intro;
              const normalizedIntro = Array.isArray(introContent) ? introContent : (introContent ? [introContent] : []);
              return <PortableText value={normalizedIntro} />;
            })()}
          </div>
        )}
        
        {data.body ? (
          (() => {
            const bodyContent = data.body;
            const normalizedBody = Array.isArray(bodyContent) ? bodyContent : (bodyContent ? [bodyContent] : []);
            return <PortableText value={normalizedBody} />;
          })()
        ) : (
          !data.intro && <p className="text-gray-500 italic">Details regarding this event will be updated soon.</p>
        )}
      </article>

      {/* 6. FAQ SECTION */}
      {data.faqs && data.faqs.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Frequently Asked Questions
          </h2>
          <FAQAccordion faqs={data.faqs} />
        </div>
      )}
     
    </div>
  );
}