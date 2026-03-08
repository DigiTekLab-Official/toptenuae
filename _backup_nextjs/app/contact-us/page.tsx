// src/app/(static)/contact-us/page.tsx
import type { Metadata } from "next";
import { Mail, MapPin, Send, Clock, HelpCircle, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Top Ten UAE",
  description: "Get in touch with the TopTenUAE editorial team. We typically respond within 24-48 hours.",
};

export default function ContactPage() {
  return (
    <div className="bg-white font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-white/20">
             <MessageSquare className="w-4 h-4 text-yellow-400" /> We'd love to hear from you
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Get in <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 leading-relaxed font-medium max-w-2xl mx-auto">
            Have a question about a review? Want to suggest a product? Or just want to say hello? Our team in Dubai & Abu Dhabi is ready to answer.
          </p>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* LEFT COLUMN: Contact Info & FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              While we primarily operate digitally to keep our reviews unbiased and independent, we are rooted in the UAE.
            </p>

            <div className="space-y-6 mb-12">
              
              {/* 1. Response Time Card */}
              <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Response Time</h3>
                  <p className="text-sm text-blue-800 font-medium mt-1">
                    24-48 Hours
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Monday - Friday (Gulf Standard Time)
                  </p>
                </div>
              </div>

              {/* 2. Email Card */}
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white text-gray-600 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email Us</h3>
                  <p className="text-sm text-gray-500 mb-1">For general inquiries & partnerships</p>
                  <a href="mailto:info@toptenuae.com" className="text-primary font-bold hover:underline">info@toptenuae.com</a>
                </div>
              </div>

              {/* 3. Location Card */}
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white text-gray-600 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Location</h3>
                  <p className="text-sm text-gray-500">
                    Dubai & Abu Dhabi, <br /> United Arab Emirates
                  </p>
                </div>
              </div>
            </div>

            {/* Mini FAQ */}
            <div className="border-t border-gray-100 pt-8">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <HelpCircle className="w-5 h-5 text-gray-400" /> Frequently Asked Questions
               </h3>
               <div className="space-y-4">
                 <details className="group bg-white border border-gray-200 rounded-lg open:ring-2 open:ring-primary/20">
                   <summary className="font-medium text-gray-800 p-4 cursor-pointer list-none flex justify-between items-center">
                     Do you accept sponsored reviews?
                     <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                   </summary>
                   <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                     No. To maintain our independence, we do not accept payment in exchange for positive reviews or higher rankings.
                   </div>
                 </details>
                 <details className="group bg-white border border-gray-200 rounded-lg open:ring-2 open:ring-primary/20">
                   <summary className="font-medium text-gray-800 p-4 cursor-pointer list-none flex justify-between items-center">
                     How do I report a factual error?
                     <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                   </summary>
                   <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                     We strive for accuracy. If you find outdated info, please email us with the subject line "Correction".
                   </div>
                 </details>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10 relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">Send a Message</h2>
            <p className="text-gray-500 text-sm mb-8 relative z-10">
               Please fill out the form below. <span className="font-semibold text-primary">Response time: 24-48 hours.</span>
            </p>

            <form className="space-y-5 relative z-10">
              
              {/* 🛡️ SPAM PROTECTION: Honeypot Field 
                  ✅ UPDATED: Added aria-label to satisfy accessibility checkers
              */}
              <input 
                type="text" 
                name="_gotcha" 
                style={{ display: "none" }} 
                tabIndex={-1} 
                autoComplete="off" 
                aria-hidden="true" 
                aria-label="Do not fill this field"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-bold text-gray-700">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-bold text-gray-700">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="text-sm font-bold text-gray-700">Subject</label>
                <select 
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-gray-600"
                >
                  <option>General Inquiry</option>
                  <option>Partnership / Advertising</option>
                  <option>Report a Bug</option>
                  <option>Review Request</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-sm font-bold text-gray-700">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg hover:bg-primary/90 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Send Message
              </button>
              
              <p className="text-sm text-center text-gray-400 mt-4">
                By sending this message, you agree to our <a href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</a>.
                Protected by reCAPTCHA.
              </p>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}