import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GTM from "@/components/analytics/GTM";
import Clarity from "@/components/analytics/Clarity";

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
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});

// =============================================================================
// METADATA (SEO GLOBAL DEFAULTS)
// =============================================================================
export const metadata: Metadata = {
  metadataBase: new URL("https://toptenuae.com"),

  // ✅ SITE NAME SIGNAL: Explicit Application Name
  applicationName: "TopTenUAE",
  
  // ✅ SITE NAME SIGNAL: Apple Web App Title
  appleWebApp: {
    title: "TopTenUAE",
    statusBarStyle: "default",
  },

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

  // ✅ FAVICON SIGNALS (Order matters for Google)
  icons: {
    icon: [
      // 1. The Purple PNG (Primary for Google Search)
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      // 2. The SVG (Fallback for modern browsers)
      { url: "/icon-v2.svg", type: "image/svg+xml" },
      // 3. Standard Favicon
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
  
  // ✅ REMOVED Duplicate "WebSite" Schema (jsonLd object). 
  // It is now handled exclusively on the Homepage by schemaGenerator.ts.

  // ✅ KEPT Organization Schema (Brand Authority) with PNG Logo
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://toptenuae.com/#organization",
    name: "TopTenUAE",
    url: "https://toptenuae.com",
    logo: {
      "@type": "ImageObject",
      url: "https://toptenuae.com/icon.png", // Point to PNG for consistency
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
        {/* Connection Optimizations */}
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />

        {/* JSON-LD Injections */}
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
        {/* Trusted Types Polyfill */}
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

        {/* Analytics */}
        <Suspense fallback={null}>
          <GTM />
          <Clarity />
        </Suspense>

        <Header />

        <main className="grow w-full max-w-[100vw]">{children}</main>

        {/* Footer CLS Reserve Space */}
        <div style={{ minHeight: "450px" }} className="relative">
          <Footer />
        </div>
      </body>
    </html>
  );
}