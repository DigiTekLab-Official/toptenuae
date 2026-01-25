// src/app/ramadan-2026/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import RamadanCountdown from "@/components/RamadanCountdown"; 
import { 
  Moon, 
  Sun, 
  Clock, 
  Calendar, 
  Heart, 
  Briefcase,
  ChevronRight,
  Flame,
  CreditCard,
  Gift,
  Zap,
  Calculator,
  BookOpen
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ramadan 2026 UAE: Dates, Iftar Timings & Deals Guide",
  description: "Complete guide to Ramadan 2026 in Dubai & UAE. Expected dates, fasting hours, Iftar/Sehri timings, and exclusive Ramadan offers.",
};

export default function RamadanPage() {
  return (
    <main className="bg-slate-50 min-h-screen font-sans">
      
      {/* ================================================================== */}
      {/* 1. HERO SECTION (Vibrant Purple Background)                        */}
      {/* ================================================================== */}
      <section className="relative bg-[#4b0082] text-white overflow-hidden py-16 lg:py-24">
        {/* Background Pattern/Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-amber-400/20 text-amber-300 font-bold text-base tracking-widest uppercase mb-4 border border-amber-400/30">
            Ramadan Kareem 1447 AH
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Ramadan 2026 <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
              UAE Guide & Deals
            </span>
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your essential guide to dates, Iftar timings, working hours, and the best fasting essentials in Dubai, Abu Dhabi, and across the Emirates.
          </p>

          {/* RUNNING COUNTDOWN TIMER */}
          <RamadanCountdown />
          
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. QUICK FACTS GRID                                                */}
      {/* ================================================================== */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Start Date */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-4">
            <div className="bg-purple-50 p-3 rounded-xl">
              <Moon className="w-8 h-8 text-[#4b0082]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider">Expected Start</h3>
              <p className="text-xl font-black text-gray-900 mt-1">Tue, Feb 17, 2026</p>
              <p className="text-base text-gray-400 mt-1">Subject to moon sighting</p>
            </div>
          </div>

          {/* Card 2: Duration */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-4">
            <div className="bg-amber-50 p-3 rounded-xl">
              <Sun className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider">Fasting Hours</h3>
              <p className="text-xl font-black text-gray-900 mt-1">13–14 Hours</p>
              <p className="text-base text-gray-400 mt-1">Fajr to Maghrib</p>
            </div>
          </div>

          {/* Card 3: Eid */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Calendar className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider">Eid Al Fitr</h3>
              <p className="text-xl font-black text-gray-900 mt-1">~ March 19, 2026</p>
              <Link href="/events-holidays/uae-holidays-2026" className="text-base font-bold text-emerald-600 hover:underline mt-1 block">
                View 2026 Holiday Calendar &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* ================================================================ */}
        {/* 3. MAIN CONTENT (Left Column)                                    */}
        {/* ================================================================ */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Introduction */}
          <div className="prose prose-lg max-w-none text-gray-600">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">When is Ramadan 2026 in the UAE?</h2>
            <p>
              Ramadan 2026 is expected to begin on <strong>Tuesday, February 17, 2026</strong>. 
              As the holiest month in Islam, it is a time of fasting, prayer, and community. 
              In the UAE, the atmosphere transforms with reduced working hours, vibrant night markets, 
              and special Iftar tents.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg my-6">
              <p className="text-base text-yellow-800 m-0 font-medium">
                ⚠️ <strong>Note:</strong> All dates are subject to the official announcement by the UAE Moon Sighting Committee. 
                For broader planning, check our guide to <Link href="/events-holidays/uae-holidays-2026" className="underline decoration-yellow-500 hover:bg-yellow-100">Official UAE Holidays in 2026</Link>.
              </p>
            </div>
          </div>

          {/* Timetable Table */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#4b0082]" /> Expected Prayer Timings
            </h3>
            <div className="overflow-hidden border border-gray-200 rounded-xl shadow-base">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-bold text-gray-500 uppercase tracking-wider">Time Period</th>
                    <th className="px-6 py-3 text-left text-base font-bold text-gray-500 uppercase tracking-wider">Fajr (Suhoor Ends)</th>
                    <th className="px-6 py-3 text-left text-base font-bold text-gray-500 uppercase tracking-wider">Maghrib (Iftar)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-base font-medium text-gray-900">Beginning (Feb 17)</td>
                    <td className="px-6 py-4 text-base text-gray-600">05:25 AM</td>
                    <td className="px-6 py-4 text-base text-gray-600">06:15 PM</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-base font-medium text-gray-900">Middle (Mar 3)</td>
                    <td className="px-6 py-4 text-base text-gray-600">05:10 AM</td>
                    <td className="px-6 py-4 text-base text-gray-600">06:22 PM</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-base font-medium text-gray-900">End (Mar 18)</td>
                    <td className="px-6 py-4 text-base text-gray-600">04:55 AM</td>
                    <td className="px-6 py-4 text-base text-gray-600">06:30 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-base text-gray-500 mt-2">*Timings are approximate for Dubai and may vary by +/- 3 minutes for Abu Dhabi and Sharjah.</p>
          </section>

          {/* Grid: Working Hours & Charity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Charity & Zakat Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 rounded-lg"><Heart className="w-6 h-6 text-red-500" /></div>
                <h3 className="text-xl font-bold text-gray-900">Zakat & Charity</h3>
              </div>
              <p className="text-base text-gray-600 mb-6 flex-1">
                Ramadan is the month of giving. Calculate your exact Zakat amount easily or learn how to pay securely online.
              </p>
              <div className="flex flex-col gap-3 mt-auto">
                <Link 
                  href="/finance-tools/zakat-calculator" 
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 text-red-700 font-bold rounded-xl text-base hover:bg-red-100 transition-colors"
                >
                  <CalculatorIcon className="w-4 h-4" /> Use Zakat Calculator
                </Link>
                <Link 
                  href="/how-to-guides/how-to-pay-zakat-in-uae-online" 
                  className="text-center text-base font-bold text-gray-500 hover:text-red-600"
                >
                  Read Guide: How to Pay Online &rarr;
                </Link>
              </div>
            </div>

            {/* Eid Al Fitr Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg"><Gift className="w-6 h-6 text-emerald-600" /></div>
                <h3 className="text-xl font-bold text-gray-900">Eid Al Fitr 2026</h3>
              </div>
              <p className="text-base text-gray-600 mb-6 flex-1">
                As Ramadan concludes, prepare for the celebrations. Find prayer timings and the best spots to visit during the long break.
              </p>
              <div className="space-y-3 mt-auto">
                <Link 
                  href="/events-holidays/eid-al-fitr-uae-prayer-timings-free-events" 
                  className="block text-base font-bold text-emerald-700 hover:underline"
                >
                  🕌 Eid Prayer Timings & Locations
                </Link>
                <Link 
                  href="/events-holidays/eid-holidays-uae-2026-best-places-to-visit" 
                  className="block text-base font-bold text-emerald-700 hover:underline"
                >
                  🎡 Best Places to Visit this Eid
                </Link>
              </div>
            </div>
          </div>

          {/* AMAZON STYLE BANNER */}
          <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg text-white">
            <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')]"></div>
            
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="inline-block bg-white/20 backdrop-blur-base px-3 py-1 rounded-full text-base font-bold uppercase tracking-wider mb-3">
                  Early Access
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-2">Early Ramadan Deals</h3>
                <p className="text-orange-100 font-medium text-lg mb-6">
                  Up to 50% Off Kitchen, Decor & Electronics
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-base flex items-center gap-2 shadow-base">
                    <CreditCard className="w-4 h-4" /> Extra 10% off with ADCB
                  </div>
                  <div className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-base flex items-center gap-2 shadow-base">
                    <CreditCard className="w-4 h-4" /> FAB Bank Offers
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Link 
                  href="/deals" 
                  className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-white text-orange-600 font-black rounded-xl hover:bg-orange-50 transition-all transform hover:scale-105 shadow-xl"
                >
                  Shop Deals Now <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </section>

        </div>

        {/* ================================================================ */}
        {/* 4. SIDEBAR (Editorial Style)                                     */}
        {/* ================================================================ */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-24">
            
            {/* Editorial Essentials Sidebar */}
            <div className="bg-white p-6 rounded-2xl shadow-base border border-gray-100">
              <h3 className="text-base font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#4b0082]" /> Ramadan Essentials
              </h3>
              
              <div className="space-y-6">
                
                {/* Link 1: Zakat Calculator */}
                <Link href="/finance-tools/zakat-calculator" className="group block">
                  <span className="text-base font-bold text-[#4b0082] mb-1 block flex items-center gap-1">
                    <Calculator className="w-3 h-3" /> Finance Tool
                  </span>
                  <h4 className="text-gray-900 font-bold leading-snug group-hover:text-[#4b0082] transition-colors">
                    Official UAE Zakat Calculator 2026
                  </h4>
                </Link>

                {/* Link 2: How to Pay Zakat */}
                <Link href="/how-to-guides/how-to-pay-zakat-in-uae-online" className="group block border-t border-gray-100 pt-4">
                  <span className="text-base font-bold text-emerald-600 mb-1 block">Step-by-Step Guide</span>
                  <h4 className="text-gray-900 font-bold leading-snug group-hover:text-[#4b0082] transition-colors">
                    How to Pay Zakat Online in UAE (Secure & Approved)
                  </h4>
                </Link>

                {/* Link 3: Eid Prayer */}
                <Link href="/events-holidays/eid-al-fitr-uae-prayer-timings-free-events" className="group block border-t border-gray-100 pt-4">
                  <span className="text-base font-bold text-purple-600 mb-1 block">Eid Al Fitr</span>
                  <h4 className="text-gray-900 font-bold leading-snug group-hover:text-[#4b0082] transition-colors">
                    Eid Prayer Timings & Musalla Locations
                  </h4>
                </Link>

                {/* Link 4: General Holidays */}
                <Link href="/events-holidays/uae-holidays-2026" className="group block border-t border-gray-100 pt-4">
                  <span className="text-base font-bold text-amber-500 mb-1 block">Planning Ahead</span>
                  <h4 className="text-gray-900 font-bold leading-snug group-hover:text-[#4b0082] transition-colors">
                    Full UAE Public Holiday Calendar 2026
                  </h4>
                </Link>

              </div>
            </div>

            {/* Mini Newsletter (Optional Filler) */}
            <div className="bg-[#4b0082] p-6 rounded-2xl shadow-lg text-center mt-6">
              <h4 className="text-white font-bold mb-2">Don't Miss Eid Deals</h4>
              <p className="text-purple-200 text-base mb-4">Get the best offers delivered to your inbox.</p>
              <Link href="/subscribe" className="block w-full py-2 bg-white text-[#4b0082] font-bold rounded-lg text-base hover:bg-gray-100 transition-colors">
                Subscribe Free
              </Link>
            </div>

          </div>
        </aside>
      </div>

      {/* ================================================================== */}
      {/* 5. DEALS SECTION (Placeholder)                                     */}
      {/* ================================================================== */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <span className="bg-red-100 p-2 rounded-lg"><Flame className="w-6 h-6 text-red-600" /></span>
              Exclusive Ramadan Offers
            </h2>
            <Link href="/deals" className="text-[#4b0082] font-bold hover:underline hidden md:block">
              View All 42 Deals &rarr;
            </Link>
          </div>

          <div className="p-12 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 bg-gray-50">
            [Deals Grid Component Renders Here]
          </div>
        </div>
      </section>

    </main>
  );
}

// Simple icon helper for the Zakat button
function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}