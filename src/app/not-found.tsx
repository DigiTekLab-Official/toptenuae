// src/app/not-found.tsx
import Link from "next/link";
import { Home, AlertCircle, Search, Tag, Calculator, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl w-full">
        
        {/* Error Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-[#4b0082]/10 text-[#4b0082] rounded-full flex items-center justify-center mx-auto animate-pulse">
            <AlertCircle className="w-12 h-12" />
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-[#4b0082]/5 rounded-full mx-auto animate-ping"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-7xl md:text-8xl font-black text-[#4b0082] mb-3 opacity-90">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-10 leading-relaxed text-lg max-w-lg mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Try searching for what you need or explore our popular sections.
        </p>

        {/* Search Box - SEO FIX: Added descriptive aria-label */}
        <form action="/search" method="GET" className="relative mb-10 max-w-md mx-auto">
          <input 
            type="text" 
            name="q"
            placeholder="Search reviews, deals, calculators..."
            aria-label="Search TopTenUAE for reviews, deals, and calculators"
            className="w-full py-4 px-6 pr-14 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4b0082] focus:border-transparent shadow-sm text-base"
          />
          <button 
            type="submit" 
            aria-label="Submit search query"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#4b0082] text-white p-2.5 rounded-full hover:bg-[#3d0066] transition-all"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Action Buttons - SEO FIX: More descriptive text */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-[#4b0082] text-white font-bold py-3 px-8 rounded-full hover:bg-[#3d0066] transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" /> 
            Back to Homepage
          </Link>
          
          <Link 
            href="/deals" 
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-50 hover:border-[#4b0082] hover:text-[#4b0082] transition-all"
          >
            <Tag className="w-5 h-5" /> 
            Browse Deals
          </Link>

          <Link 
            href="/finance-tools" 
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-50 hover:border-[#4b0082] hover:text-[#4b0082] transition-all"
          >
            <Calculator className="w-5 h-5" /> 
            Financial Tools
          </Link>
        </div>

        {/* Popular Categories - SEO IMPROVEMENT */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-6 font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Explore Popular Categories
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link 
              href="/tech" 
              className="text-sm px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-[#4b0082] hover:text-[#4b0082] hover:bg-[#4b0082]/5 transition-all font-medium shadow-sm"
            >
              Tech Reviews
            </Link>
            <Link 
              href="/reviews" 
              className="text-sm px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-[#4b0082] hover:text-[#4b0082] hover:bg-[#4b0082]/5 transition-all font-medium shadow-sm"
            >
              Product Reviews
            </Link>
            <Link 
              href="/smart-home" 
              className="text-sm px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-[#4b0082] hover:text-[#4b0082] hover:bg-[#4b0082]/5 transition-all font-medium shadow-sm"
            >
              Smart Home
            </Link>
            <Link 
              href="/events-holidays" 
              className="text-sm px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-[#4b0082] hover:text-[#4b0082] hover:bg-[#4b0082]/5 transition-all font-medium shadow-sm"
            >
              UAE Events
            </Link>
            <Link 
              href="/parenting-kids" 
              className="text-sm px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-[#4b0082] hover:text-[#4b0082] hover:bg-[#4b0082]/5 transition-all font-medium shadow-sm"
            >
              Parenting
            </Link>
            <Link 
              href="/lifestyle" 
              className="text-sm px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-[#4b0082] hover:text-[#4b0082] hover:bg-[#4b0082]/5 transition-all font-medium shadow-sm"
            >
              Lifestyle
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-400 mt-8">
          Need help? <Link href="/contact-us" className="text-[#4b0082] hover:underline font-medium">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}