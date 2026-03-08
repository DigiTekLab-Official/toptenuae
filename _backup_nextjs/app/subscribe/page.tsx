// app/subscribe/page.tsx
import type { Metadata } from "next";
import { CheckCircle, Zap, Star, Shield, Cpu } from "lucide-react"; 
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Subscribe | Top Ten UAE",
  description: "Join 10,000+ UAE residents getting the best deals, guides, and reviews delivered to their inbox.",
};

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO SECTION */}
      <section className="bg-primary text-white pt-20 pb-32 px-4 text-center rounded-b-[3rem] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-xs font-bold uppercase tracking-wider mb-6">
            Join the Community
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Stop Searching. <br/>
            <span className="text-yellow-400">Start Saving.</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto font-medium leading-relaxed">
            Get the UAE's best-kept secrets, exclusive Amazon deals, and honest top 10 reviews delivered straight to your inbox.
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

      {/* FORM & BENEFITS CARD */}
      <div className="max-w-5xl mx-auto px-4 -mt-24 pb-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT: Benefits List */}
          <div className="bg-gray-50 p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll get:</h2>
            <ul className="space-y-4">
              {[
                { icon: Zap, text: "Flash Deals & Price Drops" },
                { icon: Star, text: "New 'Top 10' Lists First" },
                { icon: Shield, text: "Unbiased Buying Guides" },
                { icon: Cpu, text: "Latest Tech News" }, 
                { icon: CheckCircle, text: "Zero Spam / Ad Clutter" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-700 font-medium">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: The Form */}
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-white">
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Sign up for free
            </h3>
            <p className="text-gray-500 text-center text-base mb-8">
              Join smart shoppers in Dubai, Abu Dhabi & beyond.
            </p>
            
            {/* The Form Component */}
            <NewsletterForm />
            
          </div>

        </div>
      </div>

    </div>
  );
}