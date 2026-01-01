import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Info, ExternalLink, ShieldAlert, MessageSquare, DollarSign, Mail, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer | Top Ten UAE",
  description: "Limitation of liability and educational purpose disclaimer for TopTenUAE.",
};

export default function DisclaimerPage() {
  const lastUpdated = "December 27, 2025";

  return (
    <div className="bg-white font-sans text-gray-700">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-white/20">
             <AlertTriangle className="w-4 h-4 text-yellow-400" /> Important Notice
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Disclaimer
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 leading-relaxed font-medium max-w-2xl mx-auto">
            The information contained on TopTenUAE is for general information purposes only. Please read this before making any purchasing decisions.
          </p>
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

      {/* 2. MAIN CONTENT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        
        {/* GENERAL INFO BOX */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-r-xl shadow-sm mb-12">
          <h2 className="text-xl font-bold text-yellow-900 flex items-center gap-3 mb-3">
            <Info className="w-6 h-6 text-yellow-600" /> General Information
          </h2>
          <p className="text-yellow-800 leading-relaxed font-medium">
            The Company assumes no responsibility for errors or omissions in the contents of the Service. In no event shall the Company be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service.
          </p>
        </div>

        {/* GRID OF DISCLAIMERS */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Card 1: External Links */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
               <ExternalLink className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">External Links</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with the Company. Please note that the Company does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
          </div>

          {/* Card 2: Use at Own Risk */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-red-200 transition-colors">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-6">
               <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">"Use at Your Own Risk"</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              All information in the Service is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied.
            </p>
          </div>

          {/* Card 3: Views Expressed */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 transition-colors">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
               <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Views Expressed</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              The views and opinions expressed on TopTenUAE are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer or company, including the Company.
            </p>
          </div>

          {/* Card 4: Affiliate (Highlighted) */}
          <div className="bg-green-50 p-8 rounded-2xl border border-green-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-green-200 text-green-800 text-sm font-bold px-3 py-1 rounded-bl-lg">TRANSPARENCY</div>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
               <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Affiliate Disclaimer</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              This website contains links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links. Our affiliate relationship is primarily with Amazon.ae and Amazon Services LLC Associates Program.
            </p>
          </div>

        </div>

        {/* CONTACT CTA */}
        <div className="text-center border-t border-gray-100 pt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Have questions about this Disclaimer?</h3>
          <Link 
            href="/contact-us" 
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full hover:border-primary hover:text-primary transition-all shadow-sm"
          >
            <Mail className="w-4 h-4" /> Contact Us <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

      </section>
    </div>
  );
}