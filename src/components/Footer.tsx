// src/components/Footer.tsx
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, ShieldCheck } from 'lucide-react';
import TopTenUAELogo from "./icons/TopTenUAELogo"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClass = "block py-3 text-slate-200 hover:text-[#A78BFA] transition-colors";

  return (
    <footer className="bg-slate-950 text-slate-100 font-sans border-t-4 border-[#8B5CF6]">
      
      {/* 1. TOP SECTION */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" prefetch={false} className="inline-block p-1" aria-label="TopTenUAE Home">
              <div className="bg-white p-2 rounded-lg shadow-sm inline-block">
                <TopTenUAELogo className="h-8 w-auto" />
              </div>
            </Link>
            <p className="text-sm leading-relaxed font-bold text-slate-100">
              The Best of the UAE, Ranked.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300 bg-emerald-950/50 w-fit px-3 py-1.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Unbiased & Independent</span>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h2 className="text-white font-bold text-base uppercase tracking-wider mb-2">Discover</h2>
            <ul className="space-y-1 text-sm">
              <li><Link href="/events-holidays" prefetch={false} className={linkClass}>Events & Holidays</Link></li>
              <li><Link href="/tech" prefetch={false} className={linkClass}>Tech & AI</Link></li>
              <li><Link href="/lifestyle" prefetch={false} className={linkClass}>Lifestyle</Link></li>
              <li><Link href="/parenting-kids" prefetch={false} className={linkClass}>Parenting & Kids</Link></li>
              <li><Link href="/smart-home" prefetch={false} className={linkClass}>Smart Home</Link></li>
              <li><Link href="/reviews" prefetch={false} className={linkClass}>Reviews</Link></li>
              <li><Link href="/travel-tourism" prefetch={false} className={linkClass}>Travel & Tourism</Link></li>
              <li><Link href="/deals" prefetch={false} className={`block py-3 hover:text-[#A78BFA] transition-colors text-amber-300 font-medium`}>Deals & Offers 🔥</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h2 className="text-white font-bold text-base uppercase tracking-wider mb-2">Calculators & Money</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/finance-tools" prefetch={false} className="group block py-3 hover:text-white transition-colors">
                   <div className="flex items-center gap-2">
                     <span className="group-hover:text-[#A78BFA] transition-colors text-amber-300 text-base">Financial Calculators</span>
                     {/* ✅ CONTRAST FIX: Changed bg-violet-600 to bg-violet-700 */}
                     <span className="bg-violet-700 text-white text-[12px] font-bold px-1.5 py-0.5 rounded animate-pulse">NEW</span>
                   </div>
                </Link>
              </li>
              <li><Link href="/finance-tools/gratuity-calculator-uae" prefetch={false} className={linkClass}>Gratuity Calculator</Link></li>
              <li><Link href="/finance-tools/uae-vat-calculator" prefetch={false} className={linkClass}>UAE VAT Calculator</Link></li>
              <li><Link href="/finance-tools/zakat-calculator" prefetch={false} className={linkClass}>Zakat Calculator</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h2 className="text-white font-bold text-base uppercase tracking-wider mb-2">Company</h2>
            <ul className="space-y-1 text-sm">
              <li><Link href="/about-us" prefetch={false} className={linkClass}>About TopTenUAE</Link></li>
              <li><Link href="/contact-us" prefetch={false} className={linkClass}>Contact Our Team</Link></li>
              
              <li className="h-px bg-slate-800 my-2 w-2/3"></li>
              
              <li><Link href="/privacy-policy" prefetch={false} className={linkClass}>Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" prefetch={false} className={linkClass}>Terms of Service</Link></li>
              <li><Link href="/cookies-policy" prefetch={false} className={linkClass}>Cookies Policy</Link></li>
              <li><Link href="/disclaimer" prefetch={false} className={linkClass}>Disclaimer</Link></li>
              <li><Link href="/affiliate-disclosure" prefetch={false} className={linkClass}>Affiliate Disclosure</Link></li>
            </ul>
          </div>

          {/* Column 5: Connect */}
          <div>
            <h2 className="text-white font-bold text-base uppercase tracking-wider mb-4">Connect</h2>
            <div className="flex gap-2 mb-6">
              <Link 
                href="https://www.facebook.com/TopTenUAEofficial" 
                prefetch={false} 
                aria-label="Follow TopTenUAE on Facebook" 
                className="h-12 w-12 flex items-center justify-center bg-slate-800 text-slate-200 rounded-full hover:bg-[#1877F2] hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link 
                href="https://x.com/top10_uae" 
                prefetch={false} 
                aria-label="Follow TopTenUAE on Twitter" 
                className="h-12 w-12 flex items-center justify-center bg-slate-800 text-slate-200 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link 
                href="https://www.instagram.com/toptenuae_/" 
                prefetch={false} 
                aria-label="Follow TopTenUAE on Instagram" 
                className="h-12 w-12 flex items-center justify-center bg-slate-800 text-slate-200 rounded-full hover:bg-[#E4405F] hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
            
            <Link href="/contact-us" prefetch={false} className="inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white transition-colors border border-slate-700 rounded-lg px-4 py-3 hover:bg-slate-800">
              <Mail className="w-4 h-4" /> 
              <span>Email Our Team</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM BAR */}
      <div className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-6 pb-6 border-b border-slate-950">
            <p className="text-[12px] text-slate-300 leading-relaxed text-justify md:text-left">
              <strong className="text-slate-200">Affiliate Disclosure:</strong> TopTenUAE is a participant in the Amazon Services LLC Associates Program...
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-300">
            <p>&copy; {currentYear} TopTenUAE. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <span className="text-red-500">♥</span> in Dubai <span role="img" aria-label="UAE Flag">🇦🇪</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}