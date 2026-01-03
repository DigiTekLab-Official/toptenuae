import type { Metadata, Viewport } from "next";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GTM from "@/components/analytics/GTM";
import Clarity from "@/components/analytics/Clarity";
import { Suspense } from "react";

// Configure Font
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-ibm-plex-sans", 
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://toptenuae.com'), 
  
  title: {
    template: '%s | TopTenUAE', 
    default: 'TopTenUAE | Discover the Best of the Emirates',
  },
  description: "Discover the top 10 best places, services, and experiences in the UAE.",
  keywords: ["Top 10 UAE", "Best in Dubai", "Abu Dhabi Guide"],
  
  // ✅ FIX 1: Explicitly point to the V2 file in public/
  // This overrides src/app/icon.svg if it exists, ensuring the new file is used.
  icons: {
    icon: '/icon-v2.svg', 
    shortcut: '/icon-v2.svg',
    apple: '/apple-icon.png', // Ensure this file exists in public/ or remove this line
  },

  openGraph: {
    title: 'TopTenUAE',
    description: 'Discover the top 10 best places, services, and experiences in the UAE.',
    url: 'https://toptenuae.com',
    siteName: 'TopTenUAE', // This sets the OG name
    images: [
      {
        // ✅ FIX 2: Using your existing file path
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
  themeColor: '#4b0082', // Purple theme color matches your new branding
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // ✅ FIX 3: JSON-LD to force Google to read "TopTenUAE" as the brand name
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TopTenUAE',
    alternateName: ['TopTenUAE.com'],
    url: 'https://toptenuae.com',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexSans.className} ${ibmPlexSans.variable} font-sans text-slate-900 bg-slate-50 antialiased min-h-screen flex flex-col overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        {/* Inject JSON-LD Script */}
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
        
        <Footer />
      </body>
    </html>
  );
}