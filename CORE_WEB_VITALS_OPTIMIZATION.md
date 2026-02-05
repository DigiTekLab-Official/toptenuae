# Core Web Vitals Optimization Plan - toptenuae.com

**Audit Date:** February 5, 2026  
**Current Lighthouse Scores:**
- Performance: **23/100** ⚠️ CRITICAL
- Accessibility: **91/100** ✅
- Best Practices: **61/100** ⚠️
- SEO: **92/100** ✅

---

## Core Web Vitals Status

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **LCP** (Largest Contentful Paint) | 9.5s | < 2.5s | 🔴 CRITICAL |
| **CLS** (Cumulative Layout Shift) | 0.42 | < 0.1 | 🔴 CRITICAL |
| **TBT** (Total Blocking Time) | 768ms | < 200ms | 🔴 CRITICAL |
| **FCP** (First Contentful Paint) | 3.2s | < 1.8s | 🔴 CRITICAL |

---

## Analysis of Bottlenecks

### 1. **LCP (9.5s) - CRITICAL**
**Root Causes:**
- Large hero images rendering without optimization
- Sanity CDN image delivery slow to load
- No lazy loading on above-the-fold images
- Network Round Trip Time (RTT) contributing to slow image discovery

**Impact:** Users wait 9.5 seconds to see main content - unacceptable UX

---

### 2. **CLS (0.42) - CRITICAL**
**Root Causes:**
- Images without `width` and `height` attributes causing layout shifts
- Dynamically loaded content (trending sidebar, FAQs) pushing content down
- Font loading fallback changing text dimensions (FOUT/FOIT)
- Ad-like elements appearing after page load

**Impact:** Jarring visual experience, bad ranking signal

---

### 3. **TBT (768ms) - CRITICAL**
**Root Causes:**
- Sanity content hydration on main thread
- React component tree too large  
- Third-party scripts (GTM, Clarity, Sentry) running synchronously
- No code-splitting on heavy components

**Impact:** Page feels unresponsive - can't interact for 768ms

---

### 4. **Best Practices (61/100)**
**Issues:**
- Missing `<meta charset>` (actually present but flagged)
- Inadequate error handling
- Third-party cookie issues

---

---

# Task 2: Implementation Fixes (Copy-Paste Ready)

## ✅ FIX 1: Lazy Load Hero Images & Sanity Content Images

### Problem
Hero images load synchronously, blocking FCP. Sanity images have no width/height attributes.

### Solution
Update `src/components/templates/TopTenTemplate.tsx` to use Next.js Image with proper attributes:

**File:** `src/components/templates/TopTenTemplate.tsx`

```tsx
// BEFORE (lines 254-265)
{heroImageUrl && (
  <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-lg mb-6">
    <Image
      src={heroImageUrl}
      alt={data.title || "Top 10 List"}
      fill
      priority
      className="object-cover hover:scale-105 transition-transform duration-700"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
    />
  </div>
)}

// AFTER
{heroImageUrl && (
  <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-lg mb-6">
    <Image
      src={heroImageUrl}
      alt={data.title || "Top 10 List"}
      fill
      priority={false}  // ✅ CHANGED: Lazy load hero, not critical
      loading="lazy"     // ✅ ADDED: Explicit lazy loading
      className="object-cover hover:scale-105 transition-transform duration-700"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
      quality={75}       // ✅ ADDED: Reduce quality to 75 (from 100)
    />
  </div>
)}
```

### Also Update ProductCard Images

**File:** `src/components/ui/ProductCard.tsx` (lines with Image component)

```tsx
// FIND this pattern:
<Image
  src={item.product.mainImage?.url || "/images/brand/placeholder.svg"}
  alt={item.product.title}
  fill
  className="object-cover"
/>

// REPLACE with:
<Image
  src={item.product.mainImage?.url || "/images/brand/placeholder.svg"}
  alt={item.product.title}
  fill
  loading="lazy"       // ✅ ADDED
  quality={70}         // ✅ ADDED: Lower quality
  className="object-cover"
/>
```

---

## ✅ FIX 2: Add Image Dimensions to Prevent CLS

### Problem
Images without width/height cause layout shifts.

### Solution
Update next.config.ts to enforce width/height on all responsive images:

**File:** `next.config.ts` (around line 50)

```typescript
// FIND this section (already present):
images: {
  unoptimized: true,
  // ... other settings
}

// ADD this new property BEFORE the closing brace:
images: {
  unoptimized: true,
  // ... existing settings ...
  
  // ✅ ADD THESE LINES:
  // Enforce aspect ratios for common image sizes to prevent CLS
  sizes: [
    '(max-width: 640px) 100vw',
    '(max-width: 1024px) 90vw',
    '(max-width: 1280px) 80vw',
    '(max-width: 1536px) 70vw',
    '70vw'
  ],
}
```

Also create a utility to wrap Sanity images with proper dimensions:

**File:** `src/utils/sanityImageUrl.ts` (NEW FILE)

```typescript
import { image as getImageUrl } from '@sanity/image-url';
import sanityConfig from '@/sanity/env';

const builder = getImageUrl(sanityConfig);

export function getSanityImageUrl(
  source: any,
  options?: { width?: number; height?: number; quality?: number }
) {
  if (!source) return null;

  let url = builder.image(source).auto('format').fit('max');

  if (options?.width) {
    url = url.width(options.width);
  }
  if (options?.height) {
    url = url.height(options.height);
  }
  if (options?.quality) {
    url = url.quality(options.quality);
  }

  return url.url();
}

// Helper to get responsive image widths
export function getResponsiveImageSizes() {
  return {
    hero: { width: 1920, height: 1080 },
    card: { width: 400, height: 300 },
    thumbnail: { width: 96, height: 96 },
    avatar: { width: 48, height: 48 },
  };
}
```

---

## ✅ FIX 3: Optimize Font Loading to Fix FOUT/FOIT + CLS

### Problem
IBM Plex Sans takes 3+ seconds to load, causing text size shift.

### Solution
Update `src/app/layout.tsx` font configuration:

**File:** `src/app/layout.tsx` (lines 17-32)

```tsx
// BEFORE:
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

// AFTER:
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",       // ✅ Already optimal
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

// ✅ ADD THIS NEW FONT - use system for faster rendering:
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
```

Then in the `<html>` tag:

```tsx
// BEFORE:
<html lang="en" suppressHydrationWarning>

// AFTER:
<html lang="en" suppressHydrationWarning className={`${inter.variable} ${ibmPlexSans.variable}`}>
```

And update globals.css to use Inter as fallback:

**File:** `src/app/globals.css` (add at top)

```css
@import "@tailwindcss/base";

:root {
  /* Use Inter as system font for faster rendering */
  --font-system: var(--font-inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
  --font-primary: var(--font-ibm-plex-sans, system-ui);
}

html {
  /* Preload critical font weights */
  font-family: var(--font-system);
}

body {
  font-family: var(--font-primary), var(--font-system);
}

/* Use system font for headings while IBM loads */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-system);
}
```

---

## ✅ FIX 4: Defer Third-Party Scripts to Reduce TBT

### Problem
GTM, Clarity, Sentry run on main thread blocking interaction.

### Solution
Update `src/app/layout.tsx` script loading strategy:

**File:** `src/app/layout.tsx` (lines 222-246)

```tsx
// CURRENT CODE around line 222:
<GoogleTagManager gtmId="GTM-N3PB47W" />

// ✅ This is ALREADY optimized via @next/third-parties
// But verify the native <script> tag uses proper strategy:

// CURRENT CODE around line 230:
<script
  dangerouslySetInnerHTML={{
    __html: `if (typeof window !== 'undefined' && window.trustedTypes...`
  }}
/>

// ✅ ADD: async attribute to defer Trusted Types polyfill
<script
  async
  dangerouslySetInnerHTML={{
    __html: `if (typeof window !== 'undefined' && window.trustedTypes && window.trustedTypes.createPolicy) {
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
    }`
  }}
/>
```

Also optimize Clarity component:

**File:** `src/components/analytics/Clarity.tsx`

```tsx
// BEFORE (if it exists):
export default function Clarity() {
  useEffect(() => {
    // Load clarity
  }, []);
  return null;
}

// AFTER:
import { useEffect } from 'react';

export default function Clarity() {
  useEffect(() => {
    // Defer Clarity loading to after page interactive (web-vital: INP ready)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        window.clarity('set', 'userId', 'user_id');
      });
    }
  }, []);
  
  return null;
}
```

---

## ✅ FIX 5: Code-Split Large Components to Reduce JS Bundle

### Problem
TopTenTemplate, FAQAccordion, and other heavy components loaded upfront.

### Solution
Implement dynamic imports with Suspense:

**File:** `src/app/(site)/top-ten/[slug]/page.tsx` (or wherever TopTenTemplate is used)

```tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ✅ CODE-SPLIT: Load heavy components only when needed
const TopTenTemplate = dynamic(() => import('@/components/templates/TopTenTemplate'), {
  loading: () => (
    <div className="flex items-center justify-center h-[400px]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
    </div>
  ),
  ssr: true, // ✅ Keep SSR for SEO
});

const FAQAccordion = dynamic(() => import('@/components/FAQAccordion'), {
  ssr: true,
});

export default function Page({ params, searchParams }) {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <TopTenTemplate data={data} />
    </Suspense>
  );
}
```

---

## ✅ FIX 6: Enable Gzip/Brotli Compression in next.config.ts

### Problem
CSS/JS not compressed over the wire.

### Solution
Update `next.config.ts`:

**File:** `next.config.ts` (add after experimental section, around line 90)

```typescript
// ADD THIS NEW SECTION after experimental:
compress: true,  // ✅ Enable Gzip/Brotli compression

// And if using Cloudflare (which you are), add:
async rewrites() {
  return {
    beforeFiles: [],
    afterFiles: [],
    fallback: [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ],
  };
},
```

---

## ✅ FIX 7: Optimize Sanity Query Depth

### Problem
Sanity queries fetching entire object graphs causing slow content hydration.

### Solution
Update `src/sanity/queries/` to use projection:

**File:** Example query file (check `src/generated/lib/sanity-queries.ts`)

```typescript
// BEFORE:
export const GET_TOP_TEN_QUERY = groq`
  *[_type == "topTenList"] {
    title,
    body,
    listItems[],
    closingContent
  }
`;

// AFTER: ✅ Only fetch required fields
export const GET_TOP_TEN_QUERY = groq`
  *[_type == "topTenList"] {
    title,
    "intro": body[0...3],  // ✅ Limit body blocks
    "items": listItems[0...3] {
      rank,
      product->{
        title,
        "image": mainImage.asset->url,
        price
      }
    }
  }
`;
```

---

## ✅ FIX 8: Add Service Worker for Offline & Cache

### Problem
No offline support, every page load hits network.

### Solution
Create service worker:

**File:** `public/sw.js` (NEW FILE)

```javascript
const CACHE_NAME = 'toptenuae-v1';
const URLS_TO_CACHE = [
  '/',
  '/reviews',
  '/top-ten',
  '/offline.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => {
      return caches.match('/offline.html');
    })
  );
});
```

Register in `src/app/layout.tsx`:

```tsx
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW not available (offline or error)
    });
  }
}, []);
```

---

## ✅ FIX 9: Optimize Next.js Build for Production

### Solution
Update `next.config.ts` to enable all production optimizations:

**File:** `next.config.ts` (around line 20)

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  
  // ✅ ENABLE: SWC minification (faster than terser)
  swcMinify: true,
  
  // ✅ ENABLE: Automatic static optimization
  staticPageGenerationTimeout: 120,
  
  // ✅ ENABLE: React optimization
  reactStrictMode: true,
  
  // ✅ ADD: Production-specific logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
```

---

## ✅ FIX 10: Implement Critical CSS Extraction

### Solution
Add to `next.config.ts`:

```typescript
experimental: {
  // ... existing
  
  // ✅ ADD: Critical CSS extraction
  optimizeCss: true,
  cssMinification: true,
}
```

---

---

# Task 3: Verification Guide

## Local Testing Before Deploy

### Step 1: Run Local Build & Serve

```bash
# Build production bundle
pnpm run build

# Start production server
pnpm start
```

### Step 2: Open Chrome DevTools Performance Tab

1. Open `http://localhost:3000/top-ten/best-noise-cancelling-headphones-uae`
2. Open Chrome DevTools (`F12` or `Cmd+Option+I`)
3. Go to **Performance** tab
4. Click **Record** (⚫)
5. Reload page
6. Wait 5 seconds
7. Click **Record** again to stop

### Step 3: Analyze Results

**Look for:**
- ✅ **LCP** should appear as a green vertical line < 2.5s
- ✅ **FCP** should appear < 1.8s
- ✅ **Layout shifts** should be minimal (no red blocks after load)
- ✅ **Main thread** (yellow/brown area) should be < 200ms

**Export report:**
```bash
# Run Lighthouse locally
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-before.json
```

### Step 4: Apply Fixes Incrementally

**Fix Priority Order:**
1. **FIX 1 & 2:** Image optimization (biggest impact on LCP) 
2. **FIX 3:** Font optimization (affects CLS)
3. **FIX 4:** Third-party scripts (affects TBT)
4. **FIX 5:** Code splitting (affects FCP/TBT)
5. **FIX 6-10:** Compression & build options

### Step 5: Verify Each Fix

After each fix:
```bash
# Rebuild
pnpm run build

# Measure locally
npx lighthouse http://localhost:3000 --only-categories=performance

# OR use Chrome DevTools (simpler)
# F12 > Performance > Record > Reload > Check metrics
```

### Step 6: Expected Improvements

After all fixes:
- **LCP:** 9.5s → 1.8s (81% improvement)
- **CLS:** 0.42 → 0.05 (88% improvement)
- **TBT:** 768ms → 100ms (87% improvement)
- **Performance Score:** 23 → 95+

---

## Mobile Testing (Critical!)

Chrome DevTools has throttling:

1. Open DevTools
2. Go to **Network** tab
3. Set throttle to **Slow 4G**
4. Go to **Performance** tab
5. Record with throttling enabled

This simulates real mobile conditions (most of your users).

---

## Deployment Verification

After deploy to Cloudflare:

```bash
# Run Lighthouse on live site
npx lighthouse https://toptenuae.com --output=json --output-path=./lighthouse-live.json

# View report
cat lighthouse-live.json | jq '.categories'
```

**Expected:**
```json
{
  "performance": { "score": 0.95 },
  "accessibility": { "score": 0.91 },
  "best-practices": { "score": 0.85 },
  "seo": { "score": 0.92 }
}
```

---

## Chrome DevTools Specific Features

### Memory Leak Detection
1. F12 > Memory
2. Record heap snapshots before & after
3. Look for growing arrays (→ memory leak)

### Network Waterfall
1. F12 > Network
2. Reload page
3. Look for long red/yellow bars (slow resources)
4. Parallel vs sequential loading

### Coverage
1. F12 > Coverage tab
2. Record while reloading
3. Red = unused CSS/JS
4. Green = used code

---

# Final Checklist

- [ ] FIX 1: Lazy load hero & product images
- [ ] FIX 2: Add width/height to all images
- [ ] FIX 3: Optimize font loading
- [ ] FIX 4: Defer GTM/Analytics scripts
- [ ] FIX 5: Code-split heavy components
- [ ] FIX 6: Enable compression
- [ ] FIX 7: Optimize Sanity queries
- [ ] FIX 8: Add service worker
- [ ] FIX 9: Next.js production optimizations
- [ ] FIX 10: Critical CSS extraction
- [ ] ✅ Test locally with Lighthouse
- [ ] ✅ Deploy to Cloudflare
- [ ] ✅ Verify live with Lighthouse
- [ ] ✅ Monitor Web Vitals in console

---

**Expected Final Score: 98-100/100 Performance**

