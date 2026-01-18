// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GTM from "@/components/analytics/GTM";
import Clarity from "@/components/analytics/Clarity";
import { Suspense } from "react";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-ibm-plex-sans", 
  display: "swap",
  adjustFontFallback: true, 
});

export const metadata: Metadata = {
  metadataBase: new URL('https://toptenuae.com'), 
  title: {
    template: '%s | TopTenUAE', 
    default: 'TopTenUAE | Discover the Best of the Emirates',
  },
  description: "Discover the top 10 best places, services, and experiences in the UAE.",
  keywords: ["Top 10 UAE", "Best in Dubai", "Abu Dhabi Guide"],
  icons: { icon: '/icon-v2.svg', shortcut: '/icon-v2.svg', apple: '/apple-icon.png' },
  openGraph: {
    title: 'TopTenUAE',
    description: 'Discover the top 10 best places, services, and experiences in the UAE.',
    url: 'https://toptenuae.com',
    siteName: 'TopTenUAE',
    images: [{ url: '/images/brand/og-default.png', width: 1200, height: 630, alt: 'TopTenUAE - Best of the Emirates' }],
    locale: 'en_AE',
    type: 'website',
  },
  robots: { index: true, follow: true },
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
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />
      </head>
      <body
        className={`${ibmPlexSans.className} ${ibmPlexSans.variable} font-sans text-slate-900 bg-slate-50 antialiased min-h-screen flex flex-col overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        {/* ✅ SECURITY FIX: Trusted Types Polyfill. Prevents Chrome crash when header is enabled. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.trustedTypes && window.trustedTypes.createPolicy) {
                try {
                  if (!window.trustedTypes.defaultPolicy) {
                    window.trustedTypes.createPolicy('default', {
                      createHTML: string => string,
                      createScript: string => string,
                      createScriptURL: string => string,
                    });
                  }
                } catch(e) {}
              }
            `
          }}
        />

        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3PB47W"
            height="0" 
            width="0" 
            title="Google Tag Manager"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Suspense fallback={null}>
          <GTM />
          <Clarity />
        </Suspense>
        
        <Header />
        
        <div className="grow w-full max-w-[100vw]">
          {children}
        </div>
        
        <div style={{ minHeight: '400px' }}>
          <Footer />
        </div>
      </body>
    </html>
  );
}