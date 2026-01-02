import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. Import Fonts
import { IBM_Plex_Sans } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GTM from "@/components/analytics/GTM";
import Clarity from "@/components/analytics/Clarity";
import { Suspense } from "react";

// 2. Configure Font
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-ibm-plex-sans", 
  display: "swap",
});

export const metadata: Metadata = {
  // CRITICAL: Base URL resolves all your image links
  metadataBase: new URL('https://toptenuae.com'), 
  
  title: {
    template: '%s | TopTenUAE', 
    default: 'TopTenUAE | Discover the Best of the Emirates',
  },
  description: "Discover the top 10 best places, services, and experiences in the UAE.",
  keywords: ["Top 10 UAE", "Best in Dubai", "Abu Dhabi Guide"],
  
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

// ✅ FIX: Removed maximumScale to allow zooming
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // ✅ High Contrast Fix included here
        className={`${ibmPlexSans.className} ${ibmPlexSans.variable} font-sans text-slate-900 bg-slate-50 antialiased min-h-screen flex flex-col overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <Suspense fallback={null}>
          <GTM />
          <Clarity />
        </Suspense>
        
        <Header />
        
        <div className="flex-grow w-full max-w-[100vw]">
          {children}
        </div>
        
        <Footer />
      </body>
    </html>
  );
}