import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'; // ✅ 1. Import Official GTM
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Clarity from "@/components/analytics/Clarity"; // ✅ 3. Keep Custom Clarity
import { initializeSentry } from "@/lib/monitoring"; // ✅ Initialize Sentry for error tracking

// Initialize Sentry for error tracking and monitoring
initializeSentry();

// =============================================================================
// FONT CONFIGURATION - OPTIMIZED FOR PERFORMANCE
// =============================================================================
// ✅ FIXED: Improved fallback fonts for better font-swap behavior
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap", // ✅ Show fallback while font loads (no FOUT)
  preload: true,
  adjustFontFallback: true,
  fallback: [
    'system-ui', 
    '-apple-system', 
    'BlinkMacSystemFont', 
    'Segoe UI', 
    'sans-serif'
  ], // ✅ Better system font stack
});

// ✅ NEW: System font for faster initial render
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

// =============================================================================
// GLOBAL METADATA
// =============================================================================
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

  alternates: {
    canonical: "./",
  },

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
// VIEWPORT
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
        {/* ✅ OPTIMIZED: Preconnect to critical resources */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        
        {/* ✅ DNS-only prefetch for non-critical domains */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />
        
        {/* ✅ Prefetch important routes for faster navigation */}
        <link rel="prefetch" href="/" />
        <link rel="prefetch" href="/reviews" />
        <link rel="prefetch" href="/top-ten" />

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
        {/* ✅ OPTIMIZED: GTM with proper script strategy */}
        {/* The @next/third-parties component handles deferring automatically */}
        <GoogleTagManager gtmId="GTM-N3PB47W" />

        {/* ✅ SERVICE WORKER REGISTRATION - Enables offline support & caching */}
        {/* SERVICE WORKER TEMPORARILY DISABLED - Causing image loading issues */}
        {/* Re-enable after fixing hydration mismatch */}
        {/* 
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => {
                      console.log('[SW] Service Worker registered:', reg.scope);
                      // Check for updates every hour
                      setInterval(() => reg.update(), 3600000);
                    })
                    .catch(err => console.warn('[SW] Registration failed:', err));
                });
              }
            `,
          }}
        />
        */}

        {/* TRUSTED TYPES POLYFILL */}
        <script
          async
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

        {/* ✅ 2. MANUAL NOSCRIPT FALLBACK */}
        {/* The official component doesn't always render this for you, so we keep it manual for robustness */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3PB47W"
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* ✅ 3. CUSTOM CLARITY SETUP */}
        {/* We wrap it in Suspense to ensure it doesn't block the UI */}
        <Suspense fallback={null}>
          <Clarity />
        </Suspense>

        <Header />

        <main className="grow w-full max-w-[100vw]" id="main-content">
          {children}
        </main>

        <div className="relative min-h-[300px] lg:min-h-[450px]">
          <Footer />
        </div>

      </body>
    </html>
  );
}