// src/components/templates/ProductTemplate.tsx
import Image from 'next/image';
import { 
  CheckCircle2, 
  XCircle, 
  ShoppingCart, 
  ExternalLink, 
  Star, 
  ShieldCheck,
  Zap,
  Tag,
  Info
} from 'lucide-react';
import PortableText from '@/components/PortableText';
import PriceWidget from '@/components/tools/PriceWidget';
import LogoIcon from '@/components/icons/LogoIcon';

interface ProductTemplateProps {
  data: any;
}

export default function ProductTemplate({ data }: ProductTemplateProps) {
  const {
    title,
    mainImage,
    affiliateLink,
    retailer,
    price,
    currency = 'AED',
    priceTier,
    customerRating,
    ratingCount,
    realComplaint,
    verdict,
    keyFeatures,
    pros,
    cons,
    itemDescription,
    brand
  } = data;

  const displayCurrency = currency || 'AED';
  const displayPrice = price ? price.toLocaleString() : null;

  return (
    <article className="font-sans bg-slate-50 min-h-screen pb-20">
      
      {/* --- 1. HERO HEADER --- */}
      <div className="bg-[#4b0082] relative overflow-hidden text-white pt-12 pb-32 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          {brand && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-bold uppercase tracking-widest">{brand}</span>
            </div>
          )}
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 max-w-4xl tracking-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-purple-100 font-medium">
             {customerRating && (
               <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                 <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                 <span className="text-white font-bold">{customerRating}</span>
                 <span className="text-sm opacity-70">/ 5</span>
                 {ratingCount && <span className="text-sm opacity-70 border-l border-white/20 pl-2 ml-1">{ratingCount} Reviews</span>}
               </div>
             )}
             {priceTier && (
               <div className="flex items-center gap-1 px-3 py-1.5">
                  <Tag className="w-4 h-4 text-amber-300" />
                  <span>{priceTier} Tier</span>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* --- 2. MAIN CONTENT GRID --- */}
      <div className="container mx-auto max-w-7xl px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Image & Review (Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Product Image Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
               <div className="relative w-full h-[300px] md:h-[500px] p-8">
                {mainImage?.url ? (
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt || title}
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">
                    <ShoppingCart size={64} />
                  </div>
                )}
               </div>
               <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-400 to-orange-500 text-white px-6 py-2 rounded-bl-3xl font-bold shadow-lg">
                 Editor's Review
               </div>
            </div>

            {/* Verdict Box */}
            {verdict && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-l-8 border-l-[#4b0082] border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <LogoIcon className="w-8 h-8 text-[#4b0082]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">The Bottom Line</h3>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                  {verdict}
                </p>
              </div>
            )}

            {/* Pros & Cons Grid */}
            {(pros?.length > 0 || cons?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pros?.length > 0 && (
                  <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" /> The Good
                    </h3>
                    <ul className="space-y-3">
                      {pros.map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-900/80 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cons?.length > 0 && (
                  <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100">
                    <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-500" /> The Bad
                    </h3>
                    <ul className="space-y-3">
                      {cons.map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-rose-900/80 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Detailed Content */}
            {itemDescription && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                 <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">In-Depth Review</h2>
                 <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-purple-600">
                   <PortableText value={itemDescription} />
                 </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. BUY BOX */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 sticky top-8">
              <div className="text-center mb-6">
                {/* ✅ UPDATED LABEL: Approx. Price */}
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Approx. Price
                </span>
                <div className="flex items-center justify-center gap-1 mt-1">
                   <span className="text-lg font-medium text-slate-500 mb-1">{displayCurrency}</span>
                   <span className="text-4xl font-black text-slate-900 tracking-tight">
                     {displayPrice || '---'}
                   </span>
                </div>
                {price && (
                    <div className="inline-block bg-green-100 text-green-800 text-[13px] font-bold px-2 py-0.5 rounded-full mt-2">
                        In Stock
                    </div>
                )}
              </div>

              {affiliateLink && (
                <a
                  href={affiliateLink}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="group flex items-center justify-center gap-2 w-full bg-[#FF9900] hover:bg-[#e68a00] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 hover:shadow-xl text-lg mb-4"
                >
                  Check Price on Amazon
                  <ExternalLink className="w-5 h-5 opacity-80" />
                </a>
              )}
              
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500 leading-relaxed text-center border border-slate-100">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                We check prices daily. As an Amazon Associate, we earn from qualifying purchases.
              </div>
            </div>

            {/* 2. KEY SPECS WIDGET */}
            {keyFeatures?.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Zap className="w-5 h-5 text-purple-600" /> Key Specs
                </h3>
                <ul className="space-y-3">
                  {keyFeatures.map((feature: string, i: number) => (
                    <li key={i} className="text-sm text-slate-600 font-medium flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. REAL COMPLAINT */}
            {realComplaint && (
              <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
                 <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <Info className="w-4 h-4" /> Real User Feedback
                 </h3>
                 <p className="text-red-800/90 text-sm italic leading-relaxed">
                   "{realComplaint}"
                 </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* --- 3. BOTTOM CTA BAR --- */}
      {affiliateLink && price && (
        <div className="container mx-auto max-w-4xl mt-16 px-4">
           <PriceWidget 
             title={title}
             price={price}
             currency={displayCurrency}
             merchant={retailer === 'Noon' ? 'Noon' : 'Amazon'}
             link={affiliateLink}
             badge="Ready to Buy?"
           />
        </div>
      )}
      
    </article>
  );
}