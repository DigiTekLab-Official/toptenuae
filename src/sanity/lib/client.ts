// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'

// --- CONFIGURATION ---
// We use your specific ID as the default fallback so the app works 
// even if .env.local is missing during the build.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kxdjzy8e'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// --- SAFETY CHECK ---
if (!projectId) {
  console.error("❌ Sanity Project ID is missing. Please check .env.local or client.ts");
}

// --- CLIENT CREATION ---
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  
  // ✅ IMPORTANT: Set to FALSE for the Money Page
  // This forces Next.js to fetch fresh data every time revalidate triggers (60s),
  // instead of getting stuck with stale data from the Sanity CDN.
  useCdn: false, 
  
  perspective: 'published',
  
  // Optional: optimized for Vercel visual editing
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})