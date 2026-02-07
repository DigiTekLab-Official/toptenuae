// src/app/robots.ts
// Remove dynamic/runtime exports if present
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // ... your other rules
    ],
    sitemap: 'https://toptenuae.com/sitemap.xml', // Pointing to the static file
  };
}