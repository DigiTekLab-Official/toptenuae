// src/app/(static)/privacy-policy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, Server, Cookie, FileText, Mail, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Top Ten UAE",
  description: "Read our Privacy Policy to understand how TopTenUAE collects, uses, and safeguards your data.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 29, 2025";

  return (
    <div className="bg-white font-sans text-gray-700">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-white/20">
             <ShieldCheck className="w-4 h-4 text-yellow-400" /> Legal Compliance
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Privacy <span className="text-yellow-400">Policy</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 leading-relaxed font-medium max-w-2xl mx-auto">
            Your trust is our top priority. We are transparent about how we collect, use, and protect your data while you shop for the best deals in the UAE.
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

      {/* 2. VISUAL SUMMARY (Optional but good for UX) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-gray-100">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
            <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Welcome to <strong>TopTenUAE.com</strong>. This policy outlines exactly what happens when you visit our site. We primarily collect data to improve your browsing experience and ensure our website functions correctly.
            </p>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
            <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Key Highlights
            </h3>
            <ul className="space-y-3">
              {[
                "We never sell personal data to third parties.",
                "We use cookies for site functionality & ads.",
                "We are an Amazon Associate (Affiliate).",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-indigo-800 font-medium">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. FULL LEGAL TEXT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
          
          {/* POINT 1 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
              1. Interpretation and Definitions
            </h2>
            <p>
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>
            <ul className="mt-4 space-y-2">
              <li><strong>Company:</strong> Referred to as "We," "Us," or "Our" (TopTenUAE).</li>
              <li><strong>Cookies:</strong> Small files placed on your device containing the details of your browsing history on that website.</li>
              <li><strong>Device:</strong> Any device that can access the Service such as a computer, a cellphone, or a digital tablet.</li>
              <li><strong>Personal Data:</strong> Any information that relates to an identified or identifiable individual.</li>
            </ul>
          </div>

          {/* POINT 2 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
              2. Collecting and Using Your Data
            </h2>
            
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Types of Data Collected</h3>
            
            <div className="pl-4 border-l-4 border-primary/20 my-4">
              <h4 className="font-bold text-gray-900">Personal Data</h4>
              <p className="text-sm">While using our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and Last name.</p>
            </div>

            <div className="pl-4 border-l-4 border-primary/20 my-4">
              <h4 className="font-bold text-gray-900">Usage Data</h4>
              <p className="text-sm">Usage Data is collected automatically when using the Service. It may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
            </div>
          </div>

          {/* POINT 3 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
              3. Advertising (AdSense Compliance)
            </h2>
            <p>
              We use third-party vendors, including <strong>Google</strong>, to serve ads based on your prior visits to our website or other websites.
            </p>
            <ul className="mt-4 space-y-3 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <li>
                <strong>DoubleClick DART Cookie:</strong> Google uses DART cookies to enable it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
              </li>
              <li>
                <strong>Opt-Out:</strong> You may opt out of the use of the DART cookie by visiting the <a href="https://adssettings.google.com/" target="_blank" rel="nofollow" className="text-primary font-bold hover:underline">Google Ad Settings</a> page.
              </li>
            </ul>
          </div>

          {/* POINT 4 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
              4. Third-Party Services
            </h2>
            <p>
              We may employ third-party companies (like Google Analytics) to facilitate our Service, to provide the Service on our behalf, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </div>

          {/* POINT 5 */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
              5. Security of Data
            </h2>
            <p>
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
            </p>
          </div>

          {/* POINT 6 (Affiliate) */}
          <div className="mb-12">
             <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
              6. Affiliate Disclosure
            </h2>
            <div className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-400 text-amber-900">
              <p className="font-medium">
                <strong>Important:</strong> TopTenUAE.com is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.ae and Amazon.com. As an Amazon Associate, we earn from qualifying purchases.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CONTACT CTA */}
      <section className="bg-gray-50 py-16 px-4 text-center border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Have questions about your data?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="mailto:info@toptenuae.com" 
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Mail className="w-5 h-5" /> Email Privacy Team
          </a>
          <Link 
            href="/contact-us" 
            className="inline-block bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:border-primary hover:text-primary transition-colors"
          >
            Contact Form
          </Link>
        </div>
      </section>

    </div>
  );
}