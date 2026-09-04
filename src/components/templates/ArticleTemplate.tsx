// src/components/templates/ArticleTemplate.tsx


import { Star, ShoppingCart, Info } from "@/components/icons";
// ✅ IMPORT PORTABLE TEXT (Crucial for fixing missing content)
import PortableText from "@/components/sanity/PortableText";
import EditorialTrust from "@/components/EditorialTrust";

export default function ArticleTemplate({ data }: { data: any }) {
  // 1. Safe Checks
  const hasPrice = data.price || (data.priceRange && data.priceRange !== "0");
  const hasAffiliateLink = !!data.affiliateLink;
  // If it's a "Guide", we usually don't want the Price Box unless explicitly set
  const showProductBox = (hasPrice || hasAffiliateLink) && data._type !== 'howTo';
  const isToyDonationGuide = data.slug === 'where-to-donate-used-toys-uae';
  const hasEditorialTrustData = Boolean(
    data.lastReviewedAt ||
    data.methodology?.length ||
    data.testingMethodology?.length ||
    data.sources?.length
  );

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* 1. INTRO / EXCERPT */}
      {data.intro && (
        <section className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed mb-10 border-l-4 border-[#4b0082] pl-6" aria-labelledby={data._type === 'buyerGuide' ? 'buyer-guide-quick-answer' : undefined}>
          {data._type === 'buyerGuide' && (
            <h2 id="buyer-guide-quick-answer" className="mb-2 text-sm font-black uppercase tracking-wider text-primary">Quick answer</h2>
          )}
           <PortableText value={data.intro} />
        </section>
      )}

      {isToyDonationGuide && (
        <section className="mb-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 md:p-6" aria-labelledby="toy-donation-quick-answer">
          <h2 id="toy-donation-quick-answer" className="text-xl font-black text-emerald-950">Where to donate toys: quick answer</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Start with an organisation that currently lists toys among its accepted items. Confirm the handover method and availability before travelling because collection points and campaign dates can change.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <a href="https://www.toyswithwings.org/donate-a-toy" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-emerald-200 bg-white p-4 hover:border-emerald-400">
              <strong className="block text-slate-900">Toys With Wings</strong>
              <span className="mt-1 block text-sm text-slate-600">Check its current selected donation location or campaign instructions before drop-off.</span>
            </a>
            <a href="https://dubaicharity.org/en/inkind-donations" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-emerald-200 bg-white p-4 hover:border-emerald-400">
              <strong className="block text-slate-900">Dubai Charity Association</strong>
              <span className="mt-1 block text-sm text-slate-600">Its in-kind channel lists toys and provides a collection request route.</span>
            </a>
            <a href="https://www.sahemnational.ae/sahem-faq/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-emerald-200 bg-white p-4 hover:border-emerald-400">
              <strong className="block text-slate-900">Sahem National</strong>
              <span className="mt-1 block text-sm text-slate-600">Its published pickup service includes toys; confirm your area and quantity in the app.</span>
            </a>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-800">
            Donate clean, safe and complete toys. Remove leaking batteries, pack loose pieces together and ask before including soft toys, large ride-ons or damaged items.
          </p>
        </section>
      )}

      {/* 2. PRODUCT / PRICE BOX (Only show if it's actually a product/review) */}
      {showProductBox && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-2">
               <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                 Best Price Found
               </span>
               {data.rating && (
                 <div className="flex items-center text-amber-500">
                   <Star className="w-4 h-4 fill-current" />
                   <span className="ml-1 text-sm font-bold text-slate-700">{data.rating}/5</span>
                 </div>
               )}
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-1">Check price</h3>
             <p className="text-sm text-slate-500">Secure transaction via Amazon. We may earn a commission.</p>
          </div>
          
          <div className="w-full md:w-auto">
            {data.affiliateLink ? (
              <a 
                href={data.affiliateLink} 
                data-affiliate-product={data.title}
                data-affiliate-cta="article_cta"
                target="_blank" 
                rel="nofollow sponsored noopener"
                className="flex items-center justify-center gap-2 bg-[#4b0082] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#3a006b] transition-all shadow-lg hover:shadow-xl w-full md:w-auto"
              >
                <ShoppingCart className="w-5 h-5" />
                Check latest price on Amazon.ae
              </a>
            ) : (
               <span className="text-slate-400 font-medium text-sm">Not currently available</span>
            )}
          </div>
        </div>
      )}

      {/* 3. MAIN BODY CONTENT (The Missing Part) */}
      <article className="prose prose-lg prose-slate max-w-none 
        prose-headings:font-bold prose-headings:text-slate-900 
        prose-a:text-[#4b0082] prose-a:font-bold hover:prose-a:text-amber-500 
        prose-img:rounded-2xl prose-img:shadow-md">
        
        {data.body ? (
          // ✅ THIS IS THE FIX: Using PortableText instead of {data.body}
          <PortableText value={data.body} />
        ) : (
          <div className="p-8 bg-slate-50 rounded-xl text-center text-slate-500">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Content is being updated for this guide.</p>
          </div>
        )}

      </article>

      {hasEditorialTrustData && (
        <div className="mt-10 space-y-6">
          <EditorialTrust data={data} />
        </div>
      )}

      {/* 4. CLOSING / VERDICT */}
      {data.closingContent && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Verdict</h3>
          <div className="prose prose-lg text-slate-700">
            <PortableText value={data.closingContent} />
          </div>
        </div>
      )}

      {/* FAQs are rendered by ArticleView via <FAQAccordion> (static import) so
          they appear in the server HTML for FAQPage schema compliance. */}

    </div>
  );
}
