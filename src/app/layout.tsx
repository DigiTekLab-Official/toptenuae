// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GTM from "@/components/analytics/GTM";
import Clarity from "@/components/analytics/Clarity";
import { Suspense } from "react";

// ✅ PERFORMANCE: Optimized font loading with size-adjust to prevent CLS
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-ibm-plex-sans", 
  display: "swap",
  adjustFontFallback: true, // Prevents layout shift during font load
});

export const metadata: Metadata = {
  metadataBase: new URL('https://toptenuae.com'), 
  
  title: {
    template: '%s | TopTenUAE', 
    default: 'TopTenUAE | Discover the Best of the Emirates',
  },
  description: "Discover the top 10 best places, services, and experiences in the UAE.",
  keywords: ["Top 10 UAE", "Best in Dubai", "Abu Dhabi Guide"],
  
  icons: {
    icon: '/icon-v2.svg', 
    shortcut: '/icon-v2.svg',
    apple: '/apple-icon.png',
  },

  openGraph: {
    title: 'TopTenUAE',
    description: 'Discover the top 10 best places, services, and experiences in the UAE.',
    url: 'https://toptenuae.com',
    siteName: 'TopTenUAE',
    images: [
      {
        url: '/images/brand/og-default.png', 
        width: 1200,
        height: 630,
        alt: 'TopTenUAE - Best of the Emirates',
      },
    ],
    locale: 'en_AE',
    type: 'website',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#4b0082',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TopTenUAE',
    alternateName: ['TopTenUAE.com'],
    url: 'https://toptenuae.com',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ CSP REMOVED: Now handled via middleware.ts headers to avoid Lighthouse "meta tag" warning */}
        
        {/* ✅ PERFORMANCE: Preconnect to critical third-party domains */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />
      </head>
      <body
        className={`${ibmPlexSans.className} ${ibmPlexSans.variable} font-sans text-slate-900 bg-slate-50 antialiased min-h-screen flex flex-col overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        {/* ✅ PERFORMANCE: Defer non-critical CSS loading */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                links.forEach(link => {
                  if (!link.href.includes('fonts.googleapis')) {
                    link.media = 'print';
                    link.onload = function() {
                      this.media = 'all';
                    };
                  }
                });
              })();
            `
          }}
        />
        {/* GTM NoScript Fallback */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3PB47W"
            height="0" 
            width="0" 
            title="Google Tag Manager"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Inject JSON-LD Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ✅ PERFORMANCE: Defer analytics to prevent blocking */}
        <Suspense fallback={null}>
          <GTM />
          <Clarity />
        </Suspense>
        
        <Header />
        
        <div className="grow w-full max-w-[100vw]">
          {children}
        </div>
        
        {/* ✅ CLS FIX: Reserve minimum height for footer */}
        <div style={{ minHeight: '400px' }}>
          <Footer />
        </div>
      </body>
    </html>
  );
}