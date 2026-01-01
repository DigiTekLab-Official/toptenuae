import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ShieldCheck, TrendingUp, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Top Ten UAE",
  description: "Learn how TopTenUAE curates the best product recommendations for UAE residents through data-driven analysis and local expertise.",
  openGraph: {
    images: ['/about-og.webp'],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
            Shopping in the UAE, <br />
            <span className="text-yellow-400">Simplified.</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 leading-relaxed font-medium">
            We analyze thousands of products on Amazon.ae so you don't have to. 
            TopTenUAE is your shortcut to the best deals, gadgets, and essentials in the Emirates.
          </p>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
      </section>

      {/* 2. THE PROBLEM & SOLUTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why We Started TopTenUAE
            </h2>
            <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Finding the right product in the UAE can be overwhelming. Between fake reviews, confusing specs, and endless options on Amazon.ae and Noon, it’s hard to know what’s actually worth your Dirhams.
            </p>
            <p className="text-gray-600 font-medium leading-relaxed">
              We built TopTenUAE to cut through the noise. We don't just list random products; we analyze verified purchase data, cross-reference local availability, and read the fine print to bring you unbiased top 10 lists.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" /> Our Promise
            </h3>
            <ul className="space-y-4">
              {[
                "100% Unbiased Selection",
                "UAE-Specific Availability",
                "Data-Backed Rankings",
                "Transparent Affiliate Disclosures"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. HOW WE WORK (Trust Signals) */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Choose Our Top 10</h2>
            <p className="text-gray-600">
              We rely on data, not sponsorship. Here is our 3-step vetting process for every list we publish.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Market Analysis</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We scan Amazon.ae for best-sellers, analyzing sales velocity and "movers and shakers" to see what UAE residents are actually buying.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Sentiment Filtering</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We filter out products with suspicious reviews. We look for verified purchase patterns and detailed user feedback to ensure quality.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. The Value Check</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A product might be good, but is it good <em>value</em>? We compare prices across retailers to ensure our top picks justify their price tag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AFFILIATE DISCLOSURE (Compliance) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transparency & Trust</h2>
        <div className="prose prose-lg mx-auto text-gray-600">
          <p>
            TopTenUAE is a reader-supported publication. When you buy through links on our site, 
            we may earn an affiliate commission from Amazon.ae or other retailers.
          </p>
          <p className="font-bold text-gray-900">
            This comes at no extra cost to you.
          </p>
          <p>
            This funding allows us to keep the site ad-minimal and free from sponsored content bias. 
            We do not accept payment to rank products higher. Our "Verdict" is always our own.
          </p>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="bg-primary py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Ready to find the best?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-block bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors shadow-lg"
          >
            Browse Top Picks
          </Link>
          <Link 
            href="/contact-us" 
            className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* JSON-LD Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Top Ten UAE",
            "url": "https://toptenuae.com",
            "logo": "https://toptenuae.com/logo.png",
            "description": "Expert-curated top 10 product lists and buying guides for the UAE market.",
            "sameAs": [
              "https://facebook.com/toptenuae",
              "https://twitter.com/toptenuae" 
            ]
          })
        }}
      />
    </div>
  );
}