// src/components/Header.tsx - FIXED & UPDATED
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, Flame, Moon } from "@/components/icons";

// Define the shape of our links to avoid TS errors
type NavLink = {
  name: string;
  href: string;
  title: string;
  badge: string | null;
  isHighlight?: boolean;
  icon?: any; // Allows passing the Lucide Icon component
};

// ✅ UPDATED NAVIGATION LIST
const NAV_LINKS: NavLink[] = [
  { name: "Rankings", href: "/top-ten", title: "Best of UAE Ranked", badge: null },
  { name: "Best Buys", href: "/reviews", title: "Product & Service Reviews", badge: null },
  { name: "Guides", href: "/how-to-guides", title: "Guides and Tutorials", badge: null },
  
  // ✅ ADDED: Ramadan 2026 with Moon Icon
  { name: "Ramadan 2026", href: "/ramadan-2026", title: "Ramadan 2026 Guide", badge: null, icon: Moon },
  
  { name: "Finance Tools", href: "/finance-tools", title: "UAE Finance Tools", badge: null },
  { name: "What's On", href: "/events-holidays", title: "UAE Events & Holidays", badge: null },
  
  // ✅ UPDATED: Removed "Hot" badge text, kept Flame icon
  { name: "Ramadan Deals", href: "/deals", title: "Latest Deals", isHighlight: true, badge: null }, 
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]); 

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setSearchQuery("");
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm font-sans transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          
          {/* LOGO */}
          <div 
            className={`flex-shrink-0 transition-opacity duration-200 ${
              isSearchOpen ? 'opacity-0 xl:opacity-100 pointer-events-none xl:pointer-events-auto' : 'opacity-100'
            }`}
          >
            <Link 
              href="/" 
              className="flex items-center group"
              title="TopTenUAE - The Best of the UAE"
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

          {/* SEARCH BAR */}
          {isSearchOpen ? (
            <form 
              onSubmit={handleSearch} 
              className="flex-1 max-w-2xl mx-auto px-4 relative flex items-center animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="relative w-full">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                />
                <input
                  type="search"
                  placeholder="Search reviews, guides, calculators..."
                  className="w-full pl-12 pr-12 py-2.5 border-2 border-[#4b0082] rounded-full focus:outline-none focus:ring-2 focus:ring-[#4b0082]/20 text-gray-900 placeholder:text-gray-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* DESKTOP NAV */}
              <nav className="hidden xl:flex xl:gap-x-6 xl:items-center">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={false}
                    title={link.title}
                    className={`relative text-[15px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 py-1 group ${
                      link.isHighlight 
                        ? "text-red-600 hover:text-red-700" 
                        : isActiveLink(link.href)
                        ? "text-[#4b0082]"
                        : "text-gray-700 hover:text-[#4b0082]"
                    }`}
                  >
                    {/* Flame Icon Logic */}
                    {link.isHighlight && (
                      <Flame className="w-4 h-4 fill-red-600 group-hover:fill-red-700 transition-colors animate-pulse" />
                    )}

                    {/* ✅ MOON ICON LOGIC (For Ramadan) */}
                    {link.icon && !link.isHighlight && (
                      <link.icon className="w-4 h-4 fill-[#2ad29a]" aria-hidden="true" />
                    )}

                    <span>{link.name}</span>
                    
                    {link.badge && (
                      <span className="ml-1 px-1.5 py-0.5 text-[12px] font-bold bg-red-600 text-white rounded-full uppercase">
                        {link.badge}
                      </span>
                    )}
                    
                    <span 
                      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-transform duration-200 origin-left ${
                        link.isHighlight ? "bg-red-600" : "bg-[#4b0082]"
                      } ${
                        isActiveLink(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                ))}
              </nav>

              {/* RIGHT ICONS */}
              <div className="hidden items-center gap-3 lg:gap-4 xl:flex">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-gray-600 hover:text-[#4b0082] transition-all duration-200 rounded-full hover:bg-purple-50 group"
                >
                  <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
                
                <Link
                  href="/subscribe"
                  className="rounded-full bg-gradient-to-r from-[#4b0082] to-purple-700 px-6 py-2.5 text-xs font-bold uppercase text-white transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 whitespace-nowrap active:scale-95"
                >
                  Subscribe
                </Link>
              </div>
            </>
          )}

          {/* MOBILE CONTROLS */}
          {!isSearchOpen && (
            <div className="flex items-center gap-3 xl:hidden">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-[#4b0082] transition-colors rounded-full hover:bg-gray-100"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <button
                type="button"
                className="p-2 text-gray-700 hover:text-[#4b0082] transition-colors rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && !isSearchOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white shadow-lg animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-6 pt-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between gap-2.5 rounded-lg px-4 py-3.5 text-base font-semibold w-full transition-all duration-200 ${
                    link.isHighlight 
                      ? "text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-100" 
                      : isActiveLink(link.href)
                      ? "text-[#4b0082] bg-purple-50"
                      : "text-gray-900 hover:bg-purple-50 hover:text-[#4b0082] active:bg-purple-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {link.isHighlight && (
                      <Flame className="w-4 h-4 fill-red-700 flex-shrink-0" />
                    )}
                    {/* ✅ MOBILE MOON ICON */}
                    {link.icon && !link.isHighlight && (
                      <link.icon className="w-4 h-4 flex-shrink-0" />
                    )}
                    
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[12px] font-bold bg-red-500 text-white rounded-full uppercase">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {isActiveLink(link.href) && (
                    <div className="w-2 h-2 rounded-full bg-[#4b0082]" />
                  )}
                </Link>
              ))}

              <Link
                href="/calculators"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between gap-2.5 rounded-lg px-4 py-3.5 text-base font-semibold w-full text-gray-900 hover:bg-purple-50 hover:text-[#4b0082] active:bg-purple-100 transition-all duration-200"
              >
                <span>Calculators</span>
              </Link>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/subscribe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full rounded-lg bg-gradient-to-r from-[#4b0082] to-purple-700 px-4 py-3.5 text-center text-sm font-bold uppercase text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 active:scale-[0.98]"
                >
                  Subscribe to Newsletter
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}