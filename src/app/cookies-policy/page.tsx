import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, Settings, Shield, Globe, ExternalLink, Mail, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookies Policy | Top Ten UAE",
  description: "Learn how TopTenUAE uses cookies to improve user experience and analyze site traffic.",
};

export default function CookiesPolicyPage() {
  // ✅ DATE ADDED: Set this to today's date
  const lastUpdated = "December 27, 2025";

  return (
    <div className="bg-white font-sans text-gray-700">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-white/20">
             <Cookie className="w-4 h-4 text-yellow-400" /> Digital Tracking Policy
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Cookies <span className="text-yellow-400">Policy</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 leading-relaxed font-medium max-w-2xl mx-auto">
            This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use.
          </p>
          {/* ✅ DATE DISPLAY ADDED HERE */}
          <p className="mt-4 text-sm text-indigo-200 font-medium">
             Last Updated: {lastUpdated}
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
      </section>

      {/* 2. CONTENT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
          
          {/* DEFINITION BOX */}
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 mb-12 not-prose">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600" /> What are Cookies?
            </h2>
            <p className="text-lg text-blue-800 leading-relaxed font-medium">
              Cookies are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">The Type of Cookies We Use</h3>
          <p className="text-gray-600 mb-8">We use both session and persistent Cookies for the purposes set out below:</p>

          <div className="space-y-6 my-8 not-prose">
            {/* Necessary */}
            <div className="flex gap-5 items-start bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:border-green-200 transition-colors">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                 <Shield className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-lg font-bold text-gray-900">Necessary / Essential Cookies</h4>
                 <p className="text-gray-600 mt-2 leading-relaxed">
                   These Cookies are essential to provide You with services available through the Website. Without these Cookies, the services You have asked for cannot be provided.
                 </p>
               </div>
            </div>

            {/* Functional */}
            <div className="flex gap-5 items-start bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:border-indigo-200 transition-colors">
               <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                 <Settings className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-lg font-bold text-gray-900">Functionality Cookies</h4>
                 <p className="text-gray-600 mt-2 leading-relaxed">
                   These allow us to remember choices You make (like login details or language preference). The purpose of these Cookies is to provide You with a more personal experience.
                 </p>
               </div>
            </div>

            {/* Tracking */}
            <div className="flex gap-5 items-start bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:border-amber-200 transition-colors">
               <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                 <Cookie className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-lg font-bold text-gray-900">Tracking & Performance Cookies</h4>
                 <p className="text-gray-600 mt-2 leading-relaxed">
                   Used by third-parties like Google Analytics and Amazon. These track information about traffic to the Website and how users use the Website. The information gathered may identify you as an individual visitor.
                 </p>
               </div>
            </div>
          </div>

          {/* ORGANIZED CHOICES SECTION */}
          <div className="mt-16 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Choices Regarding Cookies</h2>
            <p className="text-gray-600 mb-6">
              If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete the Cookies saved in your browser associated with this website.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="nofollow" className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-gray-50 transition-all group">
                 <img className="w-6 h-6" src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" alt="Google Chrome browser logo" />
                 <div className="font-bold text-gray-900 group-hover:text-primary">Manage on Chrome</div>
                 <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover:text-primary" />
              </a>
              <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="nofollow" className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-gray-50 transition-all group">
                 <img className="w-6 h-6" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg" alt="Safari browser logo" />
                 <div className="font-bold text-gray-900 group-hover:text-primary">Manage on Safari</div>
                 <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover:text-primary" />
              </a>
            </div>
          </div>

          {/* CONTACT SECTION */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center not-prose mt-12">
             <h3 className="text-xl font-bold text-gray-900 mb-4">Have questions about this policy?</h3>
             <Link href="/contact-us" className="inline-flex items-center gap-2 bg-white border border-gray-300 px-8 py-3 rounded-full font-bold text-gray-700 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md">
               <Mail className="w-4 h-4" /> Contact Us
             </Link>
          </div>

        </div>
      </section>
    </div>
  );
}