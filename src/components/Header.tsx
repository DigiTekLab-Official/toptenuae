"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, Search, Flame } from "lucide-react";

const NAV_LINKS = [
  { name: "Top 10 Lists", href: "/top-ten", title: "Best of UAE Ranked" },
  { name: "Reviews", href: "/reviews", title: "Product & Service Reviews" },
  { name: "Travel", href: "/travel-tourism", title: "UAE Travel Guides" },
  { name: "How-To", href: "/how-to", title: "Guides and Tutorials" },
  { name: "Holidays", href: "/events-holidays", title: "UAE Events & Holidays" },
  { name: "Deals", href: "/deals", title: "Latest Offers", isHighlight: true },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm font-sans">
      
      {/* INNER CONTAINER */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          
          {/* --- LOGO */}
          <div className={`flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 xl:opacity-100 pointer-events-none xl:pointer-events-auto' : 'opacity-100'}`}>
            <Link 
              href="/" 
              aria-label="TopTenUAE Homepage"
              className="flex items-center group"
            >
              <Image
                src="/images/brand/logo.svg"
                alt="TopTenUAE Logo"
                width={200}
                height={40}
                className="h-8 w-auto md:h-10 object-contain transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* --- SEARCH BAR OVERLAY */}
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto px-4 relative flex items-center animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="site-search" className="sr-only">Search</label>
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="site-search"
                  type="text"
                  placeholder="Search reviews, guides, places..."
                  className="w-full pl-12 pr-12 py-2.5 border-2 border-[#4b0082] rounded-full focus:outline-none focus:ring-2 focus:ring-[#4b0082]/20 text-gray-900 placeholder:text-gray-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* --- DESKTOP NAVIGATION */}
              <nav className="hidden xl:flex xl:gap-x-6 xl:items-center" role="navigation" aria-label="Main navigation">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={false}
                    title={link.title}
                    className={`relative text-[15px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 py-1 group ${
                      link.isHighlight 
                        ? "text-red-600 hover:text-red-700" 
                        : "text-gray-700 hover:text-[#4b0082]"
                    }`}
                  >
                    {link.isHighlight && (
                      <Flame className="w-4 h-4 fill-red-600 group-hover:fill-red-700 transition-colors" />
                    )}
                    <span>{link.name}</span>
                    {/* Modern underline effect */}
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left ${
                      link.isHighlight ? "bg-red-600" : "bg-[#4b0082]"
                    }`} />
                  </Link>
                ))}
              </nav>

              {/* --- RIGHT ICONS (DESKTOP) */}
              <div className="hidden items-center gap-3 lg:gap-4 xl:flex">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-gray-600 hover:text-[#4b0082] transition-all duration-200 rounded-full hover:bg-purple-50"
                  aria-label="Open search"
                  title="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
                <Link
                  href="/subscribe"
                  className="rounded-full bg-gradient-to-r from-[#4b0082] to-purple-700 px-6 py-2.5 text-xs font-bold uppercase text-white transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Subscribe
                </Link>
              </div>
            </>
          )}

          {/* --- MOBILE MENU BUTTON */}
          {!isSearchOpen && (
            <div className="flex items-center gap-3 xl:hidden">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-[#4b0082] transition-colors rounded-full hover:bg-gray-100"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-700 hover:text-[#4b0082] transition-colors rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE MENU DRAWER --- */}
      {isMobileMenuOpen && !isSearchOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white shadow-lg animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-6 pt-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="space-y-1" role="navigation" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-4 py-3.5 text-base font-semibold w-full transition-all duration-200 ${
                    link.isHighlight 
                      ? "text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-100" 
                      : "text-gray-900 hover:bg-purple-50 hover:text-[#4b0082] active:bg-purple-100"
                  }`}
                >
                  {link.isHighlight && <Flame className="w-4 h-4 fill-red-700 flex-shrink-0" />}
                  <span>{link.name}</span>
                </Link>
              ))}

              {/* Calculators Link (Mobile Only) */}
              <Link
                href="/calculators"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-4 py-3.5 text-base font-semibold w-full text-gray-900 hover:bg-purple-50 hover:text-[#4b0082] transition-all duration-200 active:bg-purple-100"
              >
                <span>Calculators</span>
              </Link>

              {/* Subscribe Button (Mobile) */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/subscribe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full rounded-lg bg-gradient-to-r from-[#4b0082] to-purple-700 px-4 py-3.5 text-center text-sm font-bold uppercase text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 active:scale-[0.98]"
                >
                  Subscribe Now
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}