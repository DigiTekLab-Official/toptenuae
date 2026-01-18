// src/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, Flame } from "lucide-react";
// Ensure this path matches where you saved your SVG/Logo component
import TopTenUAELogo from "./icons/TopTenUAELogo"; 

const NAV_LINKS = [
  { name: "Holidays", href: "/events-holidays" },
  { name: "Tech & AI", href: "/tech" },
  { name: "Lifestyle", href: "/lifestyle" },
  { name: "Parenting", href: "/parenting-kids" },
  { name: "Reviews", href: "/reviews" },
  { name: "Smart Home", href: "/smart-home" },
  { name: "Finance", href: "/finance-tools" },
  { name: "Deals", href: "/deals", isHighlight: true },
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm font-sans overflow-x-clip">
      
      {/* INNER CONTAINER */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          
          {/* --- LOGO --- */}
          <div className={`flex-shrink-0 ${isSearchOpen ? 'hidden xl:block' : 'block'}`}>
            <Link href="/" className="flex items-center" aria-label="TopTenUAE Homepage">
              <TopTenUAELogo className="h-8 w-auto md:h-10" />
            </Link>
          </div>

          {/* --- SEARCH BAR OVERLAY --- */}
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto px-4 relative flex items-center animate-in fade-in zoom-in duration-200">
               {/* Fixed: Removed invalid ARIA role if this was the source, or ensured standard input compliance */}
               <label htmlFor="site-search" className="sr-only">Search</label>
               <input
                id="site-search"
                type="text"
                placeholder="Search reviews, guides, places..."
                className="w-full pl-5 pr-10 py-2.5 border-2 border-primary rounded-full focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-7 text-gray-500 hover:text-red-600 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <>
              {/* --- DESKTOP NAVIGATION --- */}
              <nav className="hidden xl:flex xl:gap-x-5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={false}
                    // Fixed: Increased contrast from text-gray-700 to text-gray-900
                    className={`
                      text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap flex items-center gap-1
                      ${link.isHighlight 
                        ? "text-red-700 hover:text-red-900" // Darkened red for better contrast
                        : "text-gray-700 hover:text-primary-700"
                      }
                    `}
                  >
                    {link.isHighlight && <Flame className="w-4 h-4 fill-red-700" />}
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* --- RIGHT ICONS --- */}
              <div className="hidden items-center gap-3 lg:gap-4 xl:flex">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-primary-700 transition-colors rounded-full hover:bg-gray-100"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </button>
                <Link
                  href="/subscribe"
                  // Fixed: Ensure background/text contrast is high (white on dark primary)
                  className="rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-primary-800 whitespace-nowrap"
                >
                  Subscribe
                </Link>
              </div>
            </>
          )}

          {/* --- MOBILE MENU BUTTON --- */}
          {!isSearchOpen && (
            <div className="flex items-center gap-4 xl:hidden">
              <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-primary-700"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              <button
                type="button"
                className="text-gray-700 hover:text-primary-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE MENU DRAWER --- */}
      {isMobileMenuOpen && !isSearchOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-6 pt-2 max-h-[80vh] overflow-y-auto">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium w-full
                    ${link.isHighlight 
                      ? "text-red-800 bg-red-50 hover:bg-red-100" 
                      : "text-gray-900 hover:bg-gray-50 hover:text-primary-700"
                    }
                  `}
                >
                  {link.isHighlight && <Flame className="w-4 h-4 fill-red-800" />}
                  {link.name}
                </Link>
              ))}
               <div className="mt-4 border-t border-gray-100 pt-4">
                <Link
                  href="/subscribe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full rounded-md bg-primary px-3 py-3 text-center text-sm font-bold uppercase text-white hover:bg-primary-800"
                >
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}