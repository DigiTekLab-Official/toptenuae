import type { Metadata } from "next";
import Link from "next/link";
import { Scale, FileText, AlertTriangle, Globe, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Top Ten UAE",
  description: "Read the Terms and Conditions for using TopTenUAE.com.",
};

export default function TermsPage() {
  const lastUpdated = "December 27, 2025";

  return (
    <div className="bg-white font-sans text-gray-700">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-white/20">
             <Scale className="w-4 h-4 text-yellow-400" /> Usage Agreement
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Terms & <span className="text-yellow-400">Conditions</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 leading-relaxed font-medium max-w-2xl mx-auto">
            Please read these terms carefully before using Our Service. They set out your rights and responsibilities when using TopTenUAE.
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

      {/* 2. SUMMARY CARD */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100 shadow-sm">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Quick Summary
          </h2>
          <ul className="space-y-3">
            {[
              "By using this site, you agree to these terms.",
              "Content is for informational purposes only.",
              "We are not responsible for third-party (Amazon) links.",
              "These terms are governed by the laws of the UAE."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-indigo-800 font-medium">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. LEGAL CONTENT */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
          
          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 border-b border-gray-200 pb-2 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Service, You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions, then You may not access the Service.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 border-b border-gray-200 pb-2 mb-4">2. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding Content provided by You or other users), features, and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 border-b border-gray-200 pb-2 mb-4">3. Links to Other Websites</h2>
            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400 my-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-yellow-900">
                  <strong>Disclaimer:</strong> Our Service may contain links to third-party web sites (like Amazon.ae) or services that are not owned or controlled by the Company.
                </div>
              </div>
            </div>
            <p>
              The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused by or in connection with the use of such content.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 border-b border-gray-200 pb-2 mb-4">4. Limitation of Liability</h2>
            <p>
              In no event shall the Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 border-b border-gray-200 pb-2 mb-4">5. Governing Law</h2>
            <div className="flex items-center gap-3 mb-4 text-primary font-bold">
               <Globe className="w-5 h-5" /> United Arab Emirates
            </div>
            <p>
              The laws of the Country (UAE), excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 border-b border-gray-200 pb-2 mb-4">6. Changes to These Terms</h2>
            <p>
              We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 border-b border-gray-200 pb-2 mb-4">7. Contact Us</h2>
            <p>If you have any questions about these Terms, You can contact us:</p>
            <ul className="list-none pl-0">
               <li>
                 <Link href="/contact-us" className="text-primary font-bold hover:underline">
                   Visit our Contact Page
                 </Link>
               </li>
               <li>
                 Email: <a href="mailto:info@toptenuae.com" className="text-primary font-bold hover:underline">info@toptenuae.com</a>
               </li>
            </ul>
          </div>

        </div>
      </section>

    </div>
  );
}