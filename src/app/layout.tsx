// src/app/layout.tsx - 2026 OPTIMIZED
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GTM from "@/components/analytics/GTM";
import Clarity from "@/components/analytics/Clarity";

// =============================================================================
// FONT CONFIGURATION (2026 Optimized)
// =============================================================================
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true, // Auto-generates metrics to reduce CLS
  fallback: ['system-ui', 'sans-serif'],
});

// =============================================================================
// GLOBAL METADATA (SEO Foundation)
// =============================================================================
export const metadata: Metadata = {
  metadataBase: new URL("https://toptenuae.com"),

  // PWA Manifest
  manifest: "/manifest.json",

  // Application Name (Brand Signal)
  applicationName: "TopTenUAE",
  
  // Apple Web App Configuration
  appleWebApp: {
    title: "TopTenUAE",
    statusBarStyle: "default",
    capable: true,
  },

  // Title Template
  title: {
    template: "%s | TopTenUAE",
    default: "TopTenUAE - The Best of the UAE, Ranked",
  },

  description:
    "Discover the top 10 best places, services, and experiences in the UAE. Expert reviews, unbiased rankings, and smart tools for life in Dubai and Abu Dhabi.",

  keywords: [
    "Top 10 UAE",
    "Best in Dubai",
    "Abu Dhabi Guide",
    "UAE Product Reviews",
    "Dubai Shopping",
    "UAE Deals",
    "Best Products UAE",
    "Dubai Lifestyle",
    "UAE Calculators",
    "VAT Calculator UAE",
    "Gratuity Calculator"
  ],

  // Icons (Optimized for Google Search)
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
      {
        rel: "mask-icon",
        url: "/icon-v2.svg",
        color: "#4b0082",
      },
    ],
  },

  // Canonical URL
  alternates: {
    canonical: "./",
  },

  // OpenGraph
  openGraph: {
    title: "TopTenUAE - The Best of the UAE, Ranked",
    description:
      "Expert reviews, unbiased rankings, and smart tools for UAE life. Discover the best products, services, and experiences in the Emirates.",
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

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "TopTenUAE - The Best of the UAE, Ranked",
    description: "Expert reviews and rankings for UAE life.",
    images: ["/images/brand/og-default.png"],
    creator: "@toptenuae",
    site: "@toptenuae",
  },

  // Robots Configuration
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

  // Verification (Fill these if using Meta Tag verification)
  verification: {
    // google: '...', 
    // yandex: '...',
  },

  // Additional Metadata
  category: 'Shopping & Reviews',
  creator: 'TopTenUAE Editorial Team',
  publisher: 'TopTenUAE',
};

// =============================================================================
// VIEWPORT CONFIGURATION
// =============================================================================
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4b0082" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }, // Matches Slate-900
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

// =============================================================================
// ROOT LAYOUT COMPONENT
// =============================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Organization Schema (Brand Authority)
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
        {/* ================================================================= */}
        {/* CRITICAL RESOURCE HINTS (LCP & Speed)                            */}
        {/* ================================================================= */}
        
        {/* Sanity CDN */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        
        {/* Google Analytics & GTM */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Clarity & Cloudflare */}
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />

        {/* ================================================================= */}
        {/* STRUCTURED DATA (JSON-LD)                                        */}
        {/* ================================================================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body
        className={`${ibmPlexSans.className} ${ibmPlexSans.variable} font-sans text-slate-900 bg-slate-50 antialiased min-h-screen flex flex-col overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        {/* ================================================================= */}
        {/* TRUSTED TYPES POLYFILL (Security)                                */}
        {/* ================================================================= */}
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
                } catch (e) {
                  console.warn('Trusted Types policy already exists');
                }
              }
            `,
          }}
        />

        {/* ================================================================= */}
        {/* GOOGLE TAG MANAGER (No-Script Fallback)                          */}
        {/* ================================================================= */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3PB47W"
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* ================================================================= */}
        {/* ANALYTICS COMPONENTS (Lazy Loaded)                               */}
        {/* ================================================================= */}
        <Suspense fallback={null}>
          <GTM />
          <Clarity />
        </Suspense>

        {/* ================================================================= */}
        {/* HEADER (Sticky Navigation)                                       */}
        {/* ================================================================= */}
        <Header />

        {/* ================================================================= */}
        {/* MAIN CONTENT AREA                                                */}
        {/* ================================================================= */}
        <main className="grow w-full max-w-[100vw]" id="main-content">
          {children}
        </main>

        {/* ================================================================= */}
        {/* FOOTER (CLS Prevention)                                          */}
        {/* ================================================================= */}
        {/* ✅ FIX: Responsive min-height prevents layout shifts on load */}
        <div className="relative min-h-[300px] lg:min-h-[450px]">
          <Footer />
        </div>

      </body>
    </html>
  );
}