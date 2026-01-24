// src/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Mail, ShieldCheck, Calculator, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClass = "block py-2 text-sm text-slate-200 hover:text-purple-400 transition-colors duration-200";
  const headingClass = "text-white font-bold text-base mb-4 flex items-center gap-2";

  return (
    <footer className="bg-gradient-to-b from-slate-950 to-slate-900 text-slate-50 font-sans border-t-2 border-purple-600">

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* 1. Brand Column - Takes more space on desktop */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" prefetch={false} className="inline-block group" aria-label="TopTenUAE Home">
              <div className="bg-white p-2 rounded-xl shadow-md inline-block transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/images/brand/logo.svg"
                  alt="TopTenUAE Logo"
                  width={140}
                  height={36}
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            </Link>

            <p className="text-base leading-relaxed font-semibold text-slate-100">
              The Best of the UAE, Ranked.
            </p>

            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 bg-emerald-900/50 px-3 py-2 rounded-full border border-emerald-700/50 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Unbiased & Independent</span>
            </div>


          </div>

          {/* 2. Discover Column */}
          <div className="lg:col-span-2">
            <h2 className={headingClass}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              Discover
            </h2>
            <nav aria-label="Discover navigation">
              <ul className="space-y-1">
                <li><Link href="/top-ten" prefetch={false} className={linkClass}>Top 10 Lists</Link></li>
                <li><Link href="/reviews" prefetch={false} className={linkClass}>Reviews</Link></li>
                <li><Link href="/how-to" prefetch={false} className={linkClass}>How-To Guides</Link></li>
                <li><Link href="/travel-tourism" prefetch={false} className={linkClass}>Travel & Tourism</Link></li>
                <li><Link href="/events-holidays" prefetch={false} className={linkClass}>Events & Holidays</Link></li>
                <li>
                  <Link href="/deals" prefetch={false} className="block py-2 text-sm text-amber-300 hover:text-amber-200 transition-colors duration-200 font-semibold flex items-center gap-1">
                    Deals & Offers 🔥
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* 3. Calculators Column - FEATURED */}
          <div className="lg:col-span-3 bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-800/30 rounded-xl p-5 backdrop-blur-sm">
            <h2 className={headingClass}>
              <Calculator className="w-5 h-5 text-purple-400" />
              <span className="text-purple-200">Free Calculators</span>
            </h2>
            <nav aria-label="Calculators navigation">
              <ul className="space-y-1">
                <li><Link href="/finance-tools/gratuity-calculator-uae" prefetch={false} className="block py-2 text-sm text-purple-100 hover:text-white transition-colors duration-200 font-medium">UAE Gratuity Calculator</Link></li>
                <li><Link href="/finance-tools/uae-vat-calculator" prefetch={false} className="block py-2 text-sm text-purple-100 hover:text-white transition-colors duration-200 font-medium">VAT Calculator</Link></li>
                <li><Link href="/finance-tools/zakat-calculator" prefetch={false} className="block py-2 text-sm text-purple-100 hover:text-white transition-colors duration-200 font-medium">Zakat Calculator</Link></li>                
                <li className="pt-2">
                  <Link href="/finance-tools" prefetch={false} className="inline-flex items-center gap-2 text-sm text-white bg-purple-600 hover:bg-purple-500 px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold hover:shadow-lg hover:shadow-purple-500/30">
                    View All Tools →
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* 4. Company Column */}
          <div className="lg:col-span-2">
            <h2 className={headingClass}>Company</h2>
            <nav aria-label="Company navigation">
              <ul className="space-y-1">
                <li><Link href="/about-us" prefetch={false} className={linkClass}>About Us</Link></li>
                <li><Link href="/contact-us" prefetch={false} className={linkClass}>Contact</Link></li>

                <li className="py-3" aria-hidden="true">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                </li>

                <li><Link href="/privacy-policy" prefetch={false} className={linkClass}>Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" prefetch={false} className={linkClass}>Terms of Service</Link></li>
                <li><Link href="/cookies-policy" prefetch={false} className={linkClass}>Cookies Policy</Link></li>
                <li><Link href="/disclaimer" prefetch={false} className={linkClass}>Disclaimer</Link></li>
                <li><Link href="/affiliate-disclosure" prefetch={false} className={linkClass}>Affiliate Disclosure</Link></li>
              </ul>
            </nav>
          </div>

          {/* 5. Newsletter/Contact Column */}
          <div className="lg:col-span-2">
            <h2 className={headingClass}>Stay Connected</h2>

            {/* Contact Button */}
            <Link
              href="/contact-us"
              prefetch={false}
              className="inline-flex items-center gap-2 text-sm text-white bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600 w-full justify-center mb-6"
            >
              <Mail className="w-4 h-4" />
              <span className="font-semibold">Email Our Team</span>
            </Link>

            {/* Social Media - Desktop Only */}
            <div className="hidden lg:block pt-2">
              <h3 className="text-white font-semibold text-sm mb-3">Follow Us</h3>
              <div className="flex gap-3">
                <Link
                  href="https://www.facebook.com/TopTenUAEofficial"
                  prefetch={false}
                  aria-label="Follow on Facebook"
                  className="h-10 w-10 flex items-center justify-center bg-slate-800 text-slate-100 rounded-lg hover:bg-[#1877F2] hover:text-white hover:scale-110 transition-all duration-200"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="https://x.com/top10_uae"
                  prefetch={false}
                  aria-label="Follow on X (Twitter)"
                  className="h-10 w-10 flex items-center justify-center bg-slate-800 text-slate-100 rounded-lg hover:bg-black hover:text-white hover:scale-110 transition-all duration-200"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/toptenuae_/"
                  prefetch={false}
                  aria-label="Follow on Instagram"
                  className="h-10 w-10 flex items-center justify-center bg-slate-800 text-slate-100 rounded-lg hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white hover:scale-110 transition-all duration-200"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Social Media - Mobile/Tablet */}
            <div className="lg:hidden">
              <h3 className="text-white font-semibold text-sm mb-3">Follow Us</h3>
              <div className="flex gap-3">
                <Link
                  href="https://www.facebook.com/TopTenUAEofficial"
                  prefetch={false}
                  aria-label="Follow on Facebook"
                  className="h-10 w-10 flex items-center justify-center bg-slate-800 text-slate-100 rounded-lg hover:bg-[#1877F2] hover:text-white hover:scale-110 transition-all duration-200"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="https://x.com/top10_uae"
                  prefetch={false}
                  aria-label="Follow on X (Twitter)"
                  className="h-10 w-10 flex items-center justify-center bg-slate-800 text-slate-100 rounded-lg hover:bg-black hover:text-white hover:scale-110 transition-all duration-200"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/toptenuae_/"
                  prefetch={false}
                  aria-label="Follow on Instagram"
                  className="h-10 w-10 flex items-center justify-center bg-slate-800 text-slate-100 rounded-lg hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white hover:scale-110 transition-all duration-200"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>


          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">

          {/* Affiliate Disclosure */}
          <div className="mb-4 pb-4 border-b border-slate-900">
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Affiliate Disclosure:</strong> TopTenUAE is a participant in the Amazon Services LLC Associates Program and other affiliate programs. We may earn a commission when you purchase through links on our site, at no extra cost to you. This helps us keep our content free and unbiased.
            </p>
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
            <p>&copy; {currentYear} TopTenUAE. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Made with <span className="text-red-500 animate-pulse">♥</span> in Dubai <span role="img" aria-label="UAE Flag">🇦🇪</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}