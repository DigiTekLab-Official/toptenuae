// src/components/templates/ComparisonSummaryTable.tsx


import { ExternalLink, ShieldCheck, Star, Minus } from "@/components/icons";
// 🗑️ DELETED: listImage import (We use direct URL from query)

// --- 1. UPDATED INTERFACES ---
interface Product {
  title: string;
  // ✅ UPDATE: Matches the GROQ query structure
  mainImage?: { url: string; alt?: string }; 
  affiliateLink?: string;
  retailer?: string;
  customerRating?: number;
  priceTier?: string;
  keyFeatures?: string[];
  cons?: string[];
  specifications?: { specLabel?: string; specValue?: string }[];
}

interface ListItem {
  _key: string;
  rank: number;
  badgeLabel?: string;
  skipIf?: string;
  product: Product;
}

const findDetail = (product: Product, patterns: RegExp[]) => {
  const details = [
    ...(product.keyFeatures || []),
    ...(product.specifications || []).map((spec) =>
      [spec.specLabel, spec.specValue].filter(Boolean).join(': ')
    ),
  ].filter(Boolean);
  return details.find((detail) => patterns.some((pattern) => pattern.test(detail))) || 'Not stated';
};

const decisionDetails = (product: Product, category?: string) => {
  if (category === 'electric_shaver') {
    return {
      firstLabel: 'Shave style',
      firstValue: findDetail(product, [/foil/i, /rotary/i, /blade/i, /head/i]),
      secondLabel: 'Wet / dry',
      secondValue: findDetail(product, [/wet/i, /dry/i, /waterproof/i, /water resistant/i]),
    };
  }
  if (category === 'beard_trimmer') {
    return {
      firstLabel: 'Length / settings',
      firstValue: findDetail(product, [/length/i, /setting/i, /comb/i]),
      secondLabel: 'Runtime / wet use',
      secondValue: findDetail(product, [/runtime/i, /battery/i, /minute/i, /waterproof/i, /shower/i]),
    };
  }
  if (category === 'air_fryer') {
    return {
      firstLabel: 'Capacity',
      firstValue: findDetail(product, [/capacity/i, /\d+(?:\.\d+)?\s*l\b/i]),
      secondLabel: 'Basket / key feature',
      secondValue: findDetail(product, [/basket/i, /drawer/i, /dual/i, /window/i, /heating/i]),
    };
  }
  if (category === 'laptop') {
    return {
      firstLabel: 'Processor',
      firstValue: findDetail(product, [/processor/i, /intel core/i, /ryzen/i, /apple m\d/i, /snapdragon/i]),
      secondLabel: 'Memory / storage',
      secondValue: findDetail(product, [/\bram\b/i, /memory/i, /storage/i, /\bssd\b/i]),
    };
  }
  return {
    firstLabel: 'Key feature',
    firstValue: product.keyFeatures?.[0] || 'Not stated',
    secondLabel: 'Also consider',
    secondValue: product.keyFeatures?.[1] || 'Not stated',
  };
};

export default function ComparisonSummaryTable({ items, category }: { items: ListItem[]; category?: string }) {
  if (!items || items.length === 0) return null;
  const quickItems = items.slice(0, 6);
  const labels = decisionDetails({ title: '' }, category);

  return (
    <div className="my-12 font-sans">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
           <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
           <h2 className="text-xl font-bold text-gray-900">Quick picks: compare before you buy</h2>
           <p className="text-sm text-gray-500">The strongest use case and main compromise for each leading option.</p>
        </div>
      </div>

      {/* ========================
          DESKTOP VIEW (Hidden on Mobile)
          ======================== */}
      <div className="hidden md:block overflow-hidden border border-gray-200 shadow-sm rounded-lg">
        <table className="w-full text-left border-collapse">
          {/* ✅ UPDATED: Used bg-primary instead of #4b0082 */}
          <thead className="bg-primary text-white text-sm uppercase tracking-wider">
            <tr>
              <th className="px-3 py-4 font-bold">Product</th>
              <th className="px-3 py-4 font-bold">Best for</th>
              <th className="px-3 py-4 font-bold">{labels.firstLabel}</th>
              <th className="px-3 py-4 font-bold">{labels.secondLabel}</th>
              <th className="px-3 py-4 font-bold">Price tier</th>
              <th className="px-3 py-4 font-bold">Main compromise</th>
              <th className="px-3 py-4 font-bold text-center">Amazon.ae</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {quickItems.map((item) => {
              const product = item.product || {};
              // ✅ FIX: Use direct URL
              const imageUrl = product.mainImage?.url || null;
              const title = product.title || "Product Name Unavailable";
              const details = decisionDetails(product, category);

              return (
                <tr key={item._key || item.rank} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-3 py-4 font-bold text-gray-900 leading-snug">
                    <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white flex items-center justify-center">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt="" 
                          className="absolute inset-0 w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 text-center">No Image</span>
                      )}
                    </div>
                    <span><span className="text-primary">#{item.rank}</span> {title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                     {item.badgeLabel ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary border border-primary-100">
                        {item.badgeLabel}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">-</span>
                    )}
                  </td>
                  
                  <td className="px-3 py-4 text-sm text-gray-700">{details.firstValue}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{details.secondValue}</td>
                  <td className="px-3 py-4 text-sm font-semibold text-gray-700">{product.priceTier || 'Not stated'}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{item.skipIf || product.cons?.[0] || 'Not stated'}</td>

                  <td className="px-3 py-4 text-center">
                    {product.affiliateLink ? (
                      <a 
                        href={product.affiliateLink} 
                        data-affiliate-product={title}
                        data-affiliate-cta="comparison_table"
                        data-affiliate-category={category}
                        data-affiliate-position={item.rank}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        // Amazon Yellow (#FFD814) replaced with Tailwind standard 'bg-yellow-400'
                        className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm px-4 py-2 rounded-lg shadow-sm transition-transform active:scale-95 whitespace-nowrap"
                      >
                        Check price <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic flex justify-center gap-1"><Minus className="w-3 h-3"/> Unavailable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================
          MOBILE CARD VIEW (Visible only on Mobile)
          ======================== */}
      <div className="md:hidden space-y-4">
        {quickItems.map((item) => {
          const product = item.product || {};
          // ✅ FIX: Use direct URL
          const imageUrl = product.mainImage?.url || null;
          const title = product.title || "Product Name Unavailable";
          const details = decisionDetails(product, category);

          return (
            <div 
              key={item._key || item.rank} 
              // ✅ UPDATED: Border primary
              className="bg-white border border-gray-200 border-l-4 border-l-primary rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-start gap-3">
                 {/* ✅ UPDATED: bg-primary */}
                 <span className="bg-primary text-white font-black text-sm w-8 h-8 flex items-center justify-center rounded-lg shadow-sm shrink-0">
                    #{item.rank}
                 </span>
                 <h4 className="font-bold text-gray-900 leading-tight">
                    {title}
                 </h4>
              </div>

              <div className="p-4 flex items-center gap-4">
                 <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                   {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-contain p-2"
                      />
                   ) : (
                      <span className="text-xs text-gray-400 text-center">No Image</span>
                   )}
                 </div>
                 
                 <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between items-start">
                        {item.badgeLabel && (
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-0.5">Award</span>
                            <span className="text-xs font-bold text-primary bg-primary-50 px-2 py-1 rounded-md w-fit">
                            {item.badgeLabel}
                            </span>
                        </div>
                        )}
                        {/* Mobile Rating */}
                        {product.customerRating && (
                             <div className="flex flex-col items-end">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-0.5">Rating</span>
                                <span className="text-sm font-bold text-gray-900 flex items-center">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1"/> {product.customerRating}
                                </span>
                             </div>
                        )}
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                      <div><dt className="font-bold text-gray-900">{details.firstLabel}</dt><dd>{details.firstValue}</dd></div>
                      <div><dt className="font-bold text-gray-900">{details.secondLabel}</dt><dd>{details.secondValue}</dd></div>
                      <div><dt className="font-bold text-gray-900">Price tier</dt><dd>{product.priceTier || 'Not stated'}</dd></div>
                      <div><dt className="font-bold text-gray-900">Main compromise</dt><dd>{item.skipIf || product.cons?.[0] || 'Not stated'}</dd></div>
                    </dl>
                    
                    {product.affiliateLink && (
                       <a 
                          href={product.affiliateLink}
                          data-affiliate-product={title}
                          data-affiliate-cta="comparison_table"
                          data-affiliate-category={category}
                          data-affiliate-position={item.rank}
                          target="_blank"
                          rel="nofollow sponsored noopener"
                          className="mt-1 w-full flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold text-sm py-2 rounded-lg shadow-sm hover:bg-yellow-500"
                       >
                          Check latest price on Amazon.ae <ExternalLink className="w-3 h-3" />
                       </a>
                    )}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
