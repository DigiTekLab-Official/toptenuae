import { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import type { Deal } from '@/types/sanity'; 
import { ShoppingCart, Copy, Check, ExternalLink, FileText } from 'lucide-react';

interface DealCardProps {
  deal: Deal & { reviewSlug?: string }; 
}

export default function DealCard({ deal }: DealCardProps) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // =========================================================================
  // 0. SAFETY FIX: Handle Union Type (string | AffiliateLink)
  // =========================================================================
  // We check if it is a string. If it's an object, we fallback to '#' 
  // (or you can access a property like .href if your schema requires it).
  const safeAffiliateLink = typeof deal.affiliateLink === 'string' 
    ? deal.affiliateLink 
    : '#';

  // =========================================================================
  // 1. SMART LINK LOGIC
  // =========================================================================
  const hasReview = Boolean(deal.reviewSlug);
  
  // Main clickable areas (Image/Title) should go to Review if available (SEO Best Practice),
  // otherwise straight to Amazon.
  const mainLinkUrl = hasReview 
    ? `/reviews/${deal.reviewSlug}` 
    : safeAffiliateLink;

  const mainLinkTarget = hasReview ? undefined : '_blank';
  const mainLinkRel = hasReview ? undefined : 'nofollow sponsored noopener noreferrer';

  // =========================================================================
  // 2. DATA PREPARATION
  // =========================================================================
  const categoryLabel = typeof deal.category === 'object' && deal.category !== null
    ? deal.category.title || 'Deal'
    : (deal.category as string) || 'Deal';

  const discount = deal.discountPercentage ||
    (typeof deal.originalPrice === 'number' && typeof deal.dealPrice === 'number' && deal.originalPrice > 0
      ? Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100)
      : 0);

  // =========================================================================
  // 3. EVENT HANDLERS
  // =========================================================================
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (deal.couponCode) {
      navigator.clipboard.writeText(deal.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // =========================================================================
  // 4. BUTTON TEXT LOGIC (For the External Link)
  // =========================================================================
  const getAffiliateLabel = () => {
    // Use the safe string variable we created at the top
    const lowerUrl = safeAffiliateLink.toLowerCase();

    if (lowerUrl.includes('amazon') || lowerUrl.includes('amzn')) return 'View on Amazon';
    if (lowerUrl.includes('noon')) return 'View on Noon';
    if (lowerUrl.includes('sharaf')) return 'View on Sharaf DG';
    if (lowerUrl.includes('carrefour')) return 'View on Carrefour';
    if (lowerUrl.includes('ticket') || lowerUrl.includes('booking')) return 'Book Now';

    return 'View Offer'; // Fallback
  };

  const affiliateLabel = getAffiliateLabel();

  // Helper to wrap content in the correct link type for Image/Title
  const LinkWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <a href={mainLinkUrl} target={mainLinkTarget} rel={mainLinkRel} className={className}>{children}</a>;
  };

  return (
    <article className="group relative block h-full">
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl border border-slate-300 hover:border-[#4b0082]/30 transition-all duration-300 h-full flex flex-col overflow-hidden">
        
        {/* Corner Decoration: Discount */}
        {discount > 0 && (
          <div className="absolute top-0 right-0 z-10 pointer-events-none">
            <div className="bg-[#4b0082]/10 w-20 h-20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 flex items-end justify-start pb-4 pl-4">
               <span className="text-[#4b0082] font-black text-sm">-{discount}%</span>
            </div>
          </div>
        )}

        {/* RAMADAN BADGE */}
        {deal.tags?.includes('ramadan-2026') && (
           <div className="absolute top-0 left-0 z-20 pointer-events-none">
             <div className="bg-green-700 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg shadow-sm flex items-center gap-1">
               🌙 RAMADAN
             </div>
           </div>
        )}

        {/* CLICKABLE IMAGE AREA */}
        <LinkWrapper className="block">
          <div className="relative h-40 w-full mb-4 flex items-center justify-center p-2 bg-slate-50 rounded-xl group-hover:bg-purple-50 transition-colors duration-300">
            {deal.image && !imageError ? (
              <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
            ) : (
              <ShoppingCart className="w-10 h-10 text-slate-300" />
            )}
            
            {deal.isPrimeExclusive && (
              <div className="absolute bottom-2 left-2 bg-[#00A8E1] text-white text-[10px] font-bold py-1 px-2 rounded shadow-sm">
                Prime Only
              </div>
            )}
          </div>
        </LinkWrapper>

        {/* CONTENT */}
        <div className="grow flex flex-col">
          <div className="mb-2">
             <span className="text-[10px] font-bold uppercase tracking-wider text-[#4b0082] bg-purple-50 px-2 py-1 rounded-md">
              {categoryLabel}
            </span>
          </div>

          {/* Clickable Title */}
          <LinkWrapper className="block mb-2">
            <h2 className="text-base font-bold text-slate-900 group-hover:text-[#4b0082] transition-colors line-clamp-2 leading-tight">
              {deal.title}
            </h2>
          </LinkWrapper>

          {/* Price Block */}
          <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                {typeof deal.dealPrice === 'number'
                  ? <>
                      AED {Math.floor(deal.dealPrice)}
                      <span className="text-xs align-top">.{deal.dealPrice.toFixed(2).split('.')[1] || '00'}</span>
                    </>
                  : 'AED --'}
              </span>
              {typeof deal.originalPrice === 'number' && typeof deal.dealPrice === 'number' && deal.originalPrice > deal.dealPrice && (
                <span className="text-xs text-slate-400 line-through decoration-slate-400">
                  AED {Math.floor(deal.originalPrice)}
                </span>
              )}
            </div>

            {deal.dealEndDate && (
               <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1 bg-slate-50 py-1 px-2 rounded w-fit">
                 <span>⏳ Ends in:</span>
                 <CountdownTimer endDate={deal.dealEndDate} />
               </div>
            )}

            {deal._updatedAt && (
               <div className="mt-2 text-[10px] text-slate-400">
                 Last updated: {new Date(deal._updatedAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
               </div>
            )}
          </div>
        </div>
        
        {/* COUPON CODE SECTION */}
        {deal.couponCode && (
          <div className="mt-3 mb-1">
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 border-dashed rounded-lg p-1.5 px-2">
              <div className="flex flex-col">
                <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wider">
                  Code:
                </span>
                <span className="text-xs font-black text-amber-900 font-mono">
                  {deal.couponCode}
                </span>
              </div>
              <button 
                onClick={handleCopy}
                className="bg-white p-1.5 rounded-md shadow-sm border border-amber-200 hover:bg-amber-100 transition-colors z-30 relative"
                title="Copy Code"
              >
                {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-amber-600" />}
              </button>
            </div>
          </div>
        )}

        {/* CTA FOOTER - DUAL BUTTONS LOGIC */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
          
          {/* 1. Primary Action: BUY (Amazon/Noon) */}
          <a
            href={safeAffiliateLink}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#4b0082] hover:bg-[#3a006b] text-white text-sm font-bold py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            {affiliateLabel}
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* 2. Secondary Action: READ REVIEW (Only if review exists) */}
          {hasReview && (
            <a
              href={`/reviews/${deal.reviewSlug}`}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg transition-colors"
            >
              <FileText className="w-3 h-3" />
              Read Full Review
            </a>
          )}

        </div>
      </div>
    </article>
  );
}