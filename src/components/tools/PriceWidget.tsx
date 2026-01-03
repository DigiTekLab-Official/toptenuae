'use client';

import { ExternalLink } from 'lucide-react';

interface PriceWidgetProps {
  title?: string;
  // ✅ FIX: Allow null/undefined to prevent TypeScript errors with loose Sanity data
  price: number | null | undefined; 
  currency?: string;
  merchant?: 'Amazon' | 'Noon' | 'General';
  link: string;
  badge?: string; 
}

export default function PriceWidget({ 
  title, 
  price, 
  currency = 'AED', 
  merchant = 'Amazon', 
  link,
  badge 
}: PriceWidgetProps) {

  // ✅ SAFETY CHECK: Only call toLocaleString if price is strictly a number
  const safePrice = (typeof price === 'number') ? price.toLocaleString() : '---';  
  
  const isAmazon = merchant === 'Amazon';
  const themeColor = isAmazon ? 'text-orange-600' : 'text-yellow-600';
  const buttonBg = isAmazon ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-400 hover:bg-yellow-500';
  const buttonText = isAmazon ? 'text-white' : 'text-slate-900';

  return (
    <div className="my-8 not-prose">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-slate-300 transition-colors">
        
        {/* Left: Product Context */}
        <div className="flex-grow p-4 sm:p-5 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-slate-100 bg-slate-50/50">
          {badge && (
            <span className="inline-block text-[13px] font-bold uppercase tracking-wider text-[#4b0082] bg-purple-50 px-2 py-0.5 rounded-md w-fit mb-2">
              {badge}
            </span>
          )}
          <h4 className="font-bold text-slate-800 text-base leading-tight">
            {title || "Check latest price & availability"}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 font-medium">
             <span className={themeColor}>{merchant}</span>
             <span>•</span>
             <span>Official Retailer</span>
          </div>
        </div>

        {/* Right: Price & CTA */}
        <div className="p-4 sm:p-5 flex items-center justify-between sm:justify-end gap-4 sm:gap-6 min-w-[200px]">
          <div className="text-right">
            <span className="block text-2xl font-black text-slate-900 whitespace-nowrap">
              {currency} {safePrice}
            </span>
          </div>

          <a 
            href={link} 
            target="_blank" 
            rel="nofollow sponsored noopener noreferrer"
            className={`${buttonBg} ${buttonText} px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-transform hover:-translate-y-0.5 whitespace-nowrap`}
          >
            <span>Buy Now</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}