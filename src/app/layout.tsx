import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GTM from "@/components/analytics/GTM";
import Clarity from "@/components/analytics/Clarity";

// =============================================================================
// FONT CONFIGURATION (Optimized)
// =============================================================================
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

// =============================================================================
// METADATA (SEO GLOBAL DEFAULTS)
// =============================================================================
export const metadata: Metadata = {
  metadataBase: new URL("https://toptenuae.com"),

  title: {
    template: "%s | TopTenUAE",
    default: "TopTenUAE | Discover the Best of the Emirates",
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
  ],

  icons: {
    icon: [
      { url: "/icon-v2.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon-v2.svg",
    apple: "/apple-icon.png",
  },

  alternates: {
    canonical: "./",
  },

  openGraph: {
    title: "TopTenUAE | Discover the Best of the Emirates",
    description:
      "Expert reviews, unbiased rankings, and smart tools for UAE life.",
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
    title: "TopTenUAE | Discover the Best of the Emirates",
    description: "Expert reviews and rankings for UAE life.",
    images: ["/images/brand/og-default.png"],
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

  verification: {
    // google: 'your-google-verification-code', 
  },
};

// =============================================================================
// VIEWPORT CONFIGURATION
// =============================================================================
export const viewport: Viewport = {
  themeColor: "#4b0082",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// =============================================================================
// ROOT LAYOUT
// =============================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // 1. WebSite Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TopTenUAE",
    alternateName: ["TopTenUAE.com", "Top Ten UAE"],
    url: "https://toptenuae.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://toptenuae.com/?s={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // 2. Organization Schema (Brand Authority)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://toptenuae.com/#organization",
    name: "TopTenUAE",
    url: "https://toptenuae.com",
    logo: {
      "@type": "ImageObject",
      url: "https://toptenuae.com/icon-v2.svg",
      width: 512,
      height: 512,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      areaServed: "AE",
      availableLanguage: "English",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch & Preconnect */}
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />
        <link rel="dns-prefetch" href="https://challenges.cloudflare.com" />

        {/* Preload Critical Font */}
        <link
          rel="preload"
          href="/fonts/ibm-plex-sans-v19-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>

      <body
        className={`${ibmPlexSans.className} ${ibmPlexSans.variable} font-sans text-slate-900 bg-slate-50 antialiased min-h-screen flex flex-col overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        {/* Trusted Types Polyfill for Cloudflare/Security Headers */}
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
                } catch (e) {}
              }
            `,
          }}
        />

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3PB47W"
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Analytics (Deferred) */}
        <Suspense fallback={null}>
          <GTM />
          <Clarity />
        </Suspense>

        <Header />
        
        {/* Semantic Main Wrapper for Accessibility */}
        <main className="grow w-full max-w-[100vw]">{children}</main>
        
        <Footer />
      </body>
    </html>
  );
}