import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Info, DollarSign, Heart, ShoppingBag, CheckCircle, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | Top Ten UAE",
  description: "Transparency is our policy. Learn how TopTenUAE is funded through affiliate commissions.",
};

export default function AffiliateDisclosurePage() {
const lastUpdated = "December 27, 2025";

  return (
    <div className="bg-white font-sans text-gray-700">
      
      {/* 1. HERO SECTION (Your Preferred Layout) */}
      <section className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-white/20">
             <ShieldCheck className="w-4 h-4 text-yellow-400" /> 100% Transparent
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Affiliate <span className="text-yellow-400">Disclosure</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 leading-relaxed font-medium max-w-2xl mx-auto">
            TopTenUAE is reader-supported. We believe in total transparency about how we make money and how we keep our content free for you.
          </p>
        </div>
        <p className="mt-4 text-sm text-indigo-200 font-medium">
             Last Updated: {lastUpdated}
          </p>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
      </section>

      {/* 2. THE AMAZON STATEMENT (Mandatory) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100 shadow-sm">
          <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-600" /> Amazon Associates Disclosure
          </h2>
          <p className="text-amber-900 leading-relaxed font-medium">
            <strong>TopTenUAE.com</strong> is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.ae, Amazon.com, and other Amazon marketplaces.
          </p>
          <p className="text-amber-800 text-sm mt-4">
            As an Amazon Associate, we earn from qualifying purchases.
          </p>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Visual Guide) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Affiliate Links Work</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            When you see a link on our website that says <strong>"Check Price"</strong> or <strong>"View on Amazon"</strong>, it is likely an affiliate link. Here is what happens when you click it:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center relative">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1. You Click & Buy</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              You click a link on TopTenUAE to visit a retailer (like Amazon.ae) and purchase a product you like.
            </p>
            {/* Arrow for desktop */}
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300">
               ➔
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center relative">
             <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">2. We Earn a Commission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The retailer pays us a small percentage of the sale as a "Referral Fee" for sending them a customer.
            </p>
             {/* Arrow for desktop */}
             <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300">
               ➔
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
             <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">3. No Cost to You</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>The price remains the same for you.</strong> You never pay extra. The commission comes entirely from the retailer's pocket.
            </p>
          </div>
        </div>

        {/* --- [INJECTED OLD DATA]: Visual Price Comparison --- */}
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 border border-gray-200">
           <h3 className="text-center font-bold text-gray-900 mb-6">Does this affect the price? (Real Example)</h3>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center opacity-75">
                 <h4 className="font-bold text-gray-700 mb-2">Direct Purchase</h4>
                 <h5 className="text-xl font-bold text-gray-800">You pay 100 AED</h5>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-green-500 text-center relative shadow-sm">
                 <div className="absolute top-0 right-0 bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-bl-lg">OUR LINK</div>
                 <h4 className="font-bold text-green-700 mb-2">Affiliate Link</h4>
                 <h5 className="text-xl font-bold text-gray-900">You pay 100 AED</h5>
                 <p className="text-sm text-green-600 font-bold mt-1">(The Exact Same!)</p>
              </div>
           </div>
        </div>

      </section>

      {/* --- [INJECTED OLD DATA]: Trusted Retailers --- */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
         <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Other Trusted Partners</h2>
         <p className="text-center text-gray-600 mb-8">In addition to Amazon, we partner with these trusted UAE retailers:</p>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center font-bold text-gray-700 shadow-sm">Noon.com</div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center font-bold text-gray-700 shadow-sm">Mumzworld</div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center font-bold text-gray-700 shadow-sm">Bloomingdale’s</div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center font-bold text-gray-700 shadow-sm">Others</div>
         </div>
      </section>

      {/* 4. EDITORIAL INTEGRITY */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Does this affect our reviews?</h2>
          <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
            <p>
              <strong>Absolutely not.</strong>
            </p>
            <p>
              Our editorial team operates independently from our affiliate team. We choose products based on:
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 list-none pl-0 my-6">
              {[
                "Quality and Performance",
                "Verified User Reviews",
                "Availability in UAE",
                "Value for Money"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <p>
              If a product is bad, we will tell you it is bad—even if it has a high commission rate. Our reputation as a trusted source in the UAE is worth more than any quick sale.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CONTACT */}
      <section className="py-16 px-4 text-center">
        <p className="text-gray-600 mb-6">
          If you have any questions about our affiliate relationships, please don't hesitate to ask.
        </p>
        <Link 
          href="/contact-us" 
          className="inline-block bg-[#DDD6FF] border-2 border-gray-200 text-gray-900 font-bold py-3 px-8 rounded-full hover:border-primary hover:text-primary transition-colors"
        >
          Contact Our Team
        </Link>
      </section>

    </div>
  );
}