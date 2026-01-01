// src/components/Footer.tsx
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, ShieldCheck } from 'lucide-react';
import TopTenUAELogo from "./icons/TopTenUAELogo"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t-4 border-[#8B5CF6]">
      
      {/* 1. TOP SECTION (Links) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          
          {/* Column 1: Brand & Trust */}
          <div className="space-y-4">
            <Link href="/" className="inline-block" aria-label="TopTenUAE Home">
              <div className="bg-white p-2 rounded-lg shadow-sm inline-block">
                <TopTenUAELogo className="h-8 w-auto" />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted buying guide for the Emirates. We review, rank, and compare the best products and services in the UAE.
            </p>
            
            {/* Trust Signal */}
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1.5 rounded-full border border-emerald-400/20">
              <ShieldCheck className="w-3 h-3" />
              <span>Unbiased & Independent</span>
            </div>
          </div>

          {/* Column 2: Tech & Travel */}
          <div>
            <h2 className="text-white font-bold text-base uppercase tracking-wider mb-4">Discover</h2>
            <ul className="space-y-2.5 text-sm">
              {/* ✅ UPDATED: Removed /category/ prefix for Clean URLs */}
              <li><Link href="/events-holidays" className="hover:text-[#8B5CF6] transition-colors">Events & Holidays</Link></li>
              <li><Link href="/tech" className="hover:text-[#8B5CF6] transition-colors">Tech & AI</Link></li>
              <li><Link href="/lifestyle" className="hover:text-[#8B5CF6] transition-colors">Lifestyle</Link></li>
              <li><Link href="/parenting-kids" className="hover:text-[#8B5CF6] transition-colors">Parenting & Kids</Link></li>
              <li><Link href="/smart-home" className="hover:text-[#8B5CF6] transition-colors">Smart Home</Link></li>
              <li><Link href="/reviews" className="hover:text-[#8B5CF6] transition-colors">Reviews</Link></li>
                           
              <li><Link href="/deals" className="hover:text-[#8B5CF6] transition-colors text-amber-400 font-medium">Deals & Offers 🔥</Link></li>
            </ul>
          </div>

          {/* Column 3: Family & Guides */}
          <div>
            <h2 className="text-white font-bold text-base uppercase tracking-wider mb-4">Tools & Money</h2>
            <ul className="space-y-2.5 text-sm">
                         
              {/* Tool Badge */}
              <li className="pt-0">
                <Link href="/finance-tools" className="group flex items-center gap-2 hover:text-white transition-colors">
                   <span className=" group-hover:text-[#8B5CF6] transition-colors text-amber-400 text-base">Financial Calculators</span>
                   <span className="bg-violet-300 text-[#4b0082] text-[12px] font-bold px-1.5 py-0.5 rounded animate-pulse">NEW</span>
                </Link>
              </li>
              <li><Link href="/gratuity-calculator-uae" className="hover:text-[#8B5CF6] transition-colors">Gratuity Calculator</Link></li>
              <li><Link href="/uae-vat-calculator" className="hover:text-[#8B5CF6] transition-colors">UAE VAT Calculator</Link></li>
              <li><Link href="/zakat-calculator" className="hover:text-[#8B5CF6] transition-colors">Zakat Calculator</Link></li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div>
            <h2 className="text-white font-bold text-base uppercase tracking-wider mb-4">Company</h2>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about-us" className="hover:text-[#8B5CF6] transition-colors">About Us</Link></li>
              
              <li className="h-px bg-slate-800 my-2 w-2/3"></li> {/* Separator */}
              
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors text-slate-400">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors text-slate-400">Terms of Service</Link></li>
              <li><Link href="/cookies-policy" className="hover:text-white transition-colors text-slate-400">Cookies Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors text-slate-400">Disclaimer</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-white transition-colors text-slate-400">Affiliate Disclosure</Link></li>
            </ul>
          </div>

          {/* Column 5: Connect */}
          <div>
            <h2 className="text-white font-bold text-base uppercase tracking-wider mb-4">Connect</h2>
            <div className="flex gap-3 mb-6">
              <Link href="https://www.facebook.com/TopTenUAEofficial" aria-label="Facebook" className="bg-slate-800 p-2 rounded-full hover:bg-[#1877F2] hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="https://x.com/top10_uae" aria-label="Twitter" className="bg-slate-800 p-2 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="https://www.instagram.com/toptenuae_/" aria-label="Instagram" className="bg-slate-800 p-2 rounded-full hover:bg-[#E4405F] hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </Link>
            </div>
            
            <Link href="/contact-us" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-slate-700 rounded-lg px-4 py-2 hover:bg-slate-800">
              <Mail className="w-4 h-4" /> 
              <span>Contact Team</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM BAR (Compliance & Copyright) */}
      <div className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="container mx-auto px-4">
          
          {/* AMAZON DISCLAIMER */}
          <div className="mb-6 pb-6 border-b border-slate-950">
            <p className="text-[12px] text-slate-400 leading-relaxed text-justify md:text-left">
              <strong className="text-slate-300">Affiliate Disclosure:</strong> TopTenUAE is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.ae and Amazon.com. As an Amazon Associate, we earn from qualifying purchases. We also participate in other affiliate programs and may earn a commission if you purchase through our links, at no extra cost to you.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
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