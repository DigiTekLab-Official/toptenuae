import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Mail, ArrowRight, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You! | Top Ten UAE",
  description: "Subscription confirmed.",
  robots: {
    index: false,   // ⛔ Tells Google: "Don't list this in search results"
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. HERO SECTION (Consistent with Subscribe Page) */}
      <section className="bg-primary text-white pt-20 pb-32 px-4 text-center rounded-b-[3rem] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-green-500/20 text-green-500 border border-green-500/30 text-xs font-bold uppercase tracking-wider mb-6">
            <CheckCircle className="w-4 h-4" /> Success
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            You are <span className="text-yellow-400">Officially In!</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-50 max-w-2xl mx-auto pb-10 font-medium leading-relaxed">
            Welcome to the inner circle. You've just taken the first step towards smarter shopping in the UAE.
          </p>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <circle cx="0" cy="0" r="40" fill="white" />
             <circle cx="100" cy="100" r="40" fill="white" />
           </svg>
        </div>
      </section>

      {/* 2. FLOATING CONTENT CARD */}
      <div className="max-w-2xl mx-auto px-4 -mt-24 pb-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8 md:p-12 text-center">
          
          {/* Animated Icon */}
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-300">
            <CheckCircle className="w-12 h-12" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Subscribing!
          </h2>
          <p className="text-gray-600 mb-10 max-w-lg mx-auto">
            We are thrilled to have you. We've sent a little welcome gift to your inbox.
          </p>

          {/* Next Steps Box */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 md:p-8 text-left mb-10 mx-auto max-w-xl">
            <h3 className="font-bold text-blue-900 mb-6 flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5" /> What happens next?
            </h3>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900">Check your inbox</p>
                  <p className="text-base text-gray-600">We've sent a confirmation email to verify your address.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mark as "Safe"</p>
                  <p className="text-base text-gray-600">Move us to your Primary tab so you don't miss the deals.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center gap-4">
            <Link 
              href="/" 
              className="group relative inline-flex items-center gap-2 bg-primary text-white font-bold py-4 px-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1"
            >
              Start Browsing Deals <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="text-base text-gray-700">
              Did not receive email? Check your Spam/Junk folder.<a href="/subscribe" className="underline hover:text-gray-600 pl-2">Try again</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}