// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GTM from "@/components/analytics/GTM";
import Clarity from "@/components/analytics/Clarity";

// =============================================================================
// FONT CONFIGURATION (CLS-OPTIMIZED)
// =============================================================================
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
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
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // google: 'your-google-verification-code', // Add when available
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
  // Base JSON-LD for all pages
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
        {/* ================================================================= */}
        {/* CRITICAL PERFORMANCE: Preconnect & DNS Prefetch                  */}
        {/* ================================================================= */}
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />

        {/* ================================================================= */}
        {/* CRITICAL FIX: Preload Critical CSS to Prevent Render Blocking    */}
        {/* ================================================================= */}
        <link
          rel="preload"
          href="/_next/static/css/app/layout.css"
          as="style"
        />

        {/* ================================================================= */}
        {/* Schema.org JSON-LD                                               */}
        {/* ================================================================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        {/* Trusted Types Polyfill (Cloudflare Compatibility)                */}
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
                } catch (e) {}
              }
            `,
          }}
        />

        {/* ================================================================= */}
        {/* Google Tag Manager (noscript)                                    */}
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
        {/* Analytics (Deferred for Performance)                             */}
        {/* ================================================================= */}
        <Suspense fallback={null}>
          <GTM />
          <Clarity />
        </Suspense>

        {/* ================================================================= */}
        {/* Main Layout Structure                                            */}
        {/* ================================================================= */}
        <Header />

        {/* Main Content Area */}
        <main className="grow w-full max-w-[100vw]">{children}</main>

        {/* ================================================================= */}
        {/* CRITICAL CLS FIX: Reserve Footer Space                           */}
        {/* This prevents the massive 0.42 CLS caused by Footer              */}
        {/* ================================================================= */}
        <div style={{ minHeight: "450px" }} className="relative">
          <Footer />
        </div>
      </body>
    </html>
  );
}