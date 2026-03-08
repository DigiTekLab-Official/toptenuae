// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Clarity from "@/components/analytics/Clarity";
import GTM from "@/components/analytics/GTM";

// ❌ REMOVED: initializeSentry() 
// Sentry should be initialized in sentry.client.config.ts and sentry.server.config.ts
// Calling it here only runs it on the server render, missing all browser errors.

// =============================================================================
// FONT CONFIGURATION
// =============================================================================
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true, 
  // ❌ REMOVED: Manual fallback array. 
  // Letting Next.js handle this automatically prevents Cumulative Layout Shift (CLS) better.
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

// =============================================================================
// METADATA & VIEWPORT (Kept as is - looks good)
// =============================================================================
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4b0082" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://toptenuae.com"),
  manifest: "/manifest.json",
  applicationName: "TopTenUAE",
  appleWebApp: {
    title: "TopTenUAE",
    statusBarStyle: "default",
    capable: true,
  },
  title: {
    template: "%s | TopTenUAE",
    default: "TopTenUAE - The Best of the UAE, Ranked",
  },
  description:
    "Discover the top 10 best places, services, and experiences in the UAE. Expert reviews, unbiased rankings, and smart tools for life in Dubai and Abu Dhabi.",
  keywords: [
    "Top 10 UAE", "Best in Dubai", "Abu Dhabi Guide", "UAE Product Reviews",
    "Dubai Shopping", "UAE Deals", "Best Products UAE", "Dubai Lifestyle",
    "UAE Calculators", "VAT Calculator UAE", "Gratuity Calculator"
  ],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-v2.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icon-v2.svg", color: "#4b0082" },
    ],
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "TopTenUAE - The Best of the UAE, Ranked",
    description: "Expert reviews, unbiased rankings, and smart tools for UAE life.",
    url: "https://toptenuae.com",
    siteName: "TopTenUAE",
    images: [
      {
        url: "/images/brand/og-default.png",
        width: 1200,
        height: 630,
        alt: "TopTenUAE - Best of the Emirates",
      },
    ],
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopTenUAE - The Best of the UAE, Ranked",
    description: "Expert reviews and rankings for UAE life.",
    images: ["/images/brand/og-default.png"],
    creator: "@toptenuae",
    site: "@toptenuae",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: 'Shopping & Reviews',
  creator: 'TopTenUAE Editorial Team',
  publisher: 'TopTenUAE',
};

// =============================================================================
// ROOT LAYOUT
// =============================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://toptenuae.com/#organization",
    name: "TopTenUAE",
    alternateName: "Top Ten UAE",
    url: "https://toptenuae.com",
    logo: {
      "@type": "ImageObject",
      "@id": "https://toptenuae.com/#logo",
      url: "https://toptenuae.com/icon.png",
      width: 512,
      height: 512,
      caption: "TopTenUAE Logo"
    },
    image: {
      "@type": "ImageObject",
      url: "https://toptenuae.com/images/brand/og-default.png",
      width: 1200,
      height: 630
    },
    description: "Expert reviews, rankings, and smart tools for UAE residents.",
    foundingDate: "2020",
    areaServed: {
      "@type": "Country",
      name: "United Arab Emirates"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      areaServed: "AE",
      availableLanguage: ["English", "Arabic"]
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ CRITICAL: Preload LCP font variant only */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/ibmplexsans/v19/zYX9KVElMYYaJe8bpLHnCwDKjQ76AIxsdP3pBmtF8A.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* ✅ DNS prefetch only (non-blocking) */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body
        className={`${ibmPlexSans.className} ${ibmPlexSans.variable} ${inter.variable} font-sans text-slate-900 bg-slate-50 antialiased min-h-screen flex flex-col overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <Suspense fallback={null}>
          <GTM />
          <Clarity />
        </Suspense>

        <Header />

        <main className="grow w-full max-w-[100vw]" id="main-content">
          {children}
        </main>

        <div className="relative min-h-[300px] lg:min-h-[450px]">
          <Footer />
        </div>
        
        <SpeedInsights />  
      </body>
    </html>
  );
}