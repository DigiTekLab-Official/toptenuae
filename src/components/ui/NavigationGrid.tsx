import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CornerDownRight } from 'lucide-react';

interface GridItem {
  label: string;
  description?: string;
  imageUrl?: string;
  targetSlug?: string; // e.g. "samsung-galaxy-s24"
}

interface NavigationGridProps {
  title?: string;
  items: GridItem[];
}

const NavigationGrid: React.FC<NavigationGridProps> = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-8 bg-slate-800 border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
        <div className="bg-slate-200 p-1.5 rounded-md">
           <CornerDownRight className="w-5 h-5 text-slate-700" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
          {title || "Quick Navigation"}
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, idx) => {
          // Determine Link: If it's an internal slug, link to it. Otherwise #hash
          const href = item.targetSlug ? `/${item.targetSlug}` : `#`;

          return (
            <Link 
              key={idx} 
              href={href}
              className="group flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              {/* Optional Thumbnail */}
              {item.imageUrl ? (
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.label} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                // Fallback Icon if no image
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {idx + 1}
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate w-full leading-tight">
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-xs text-slate-500 line-clamp-2 leading-snug mt-0.5">
                    {item.description}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationGrid;