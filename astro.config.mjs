// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://toptenuae.com',
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true,
    },
  }),

  // NOTE: @astrojs/sitemap removed — it only saw static .astro routes (SSR
  // content routes are invisible to it) and produced a redundant second sitemap
  // (/sitemap-0.xml). The authoritative sitemap is public/sitemap.xml, generated
  // from Sanity by scripts/generate-sitemap.mjs (now run in the build step).
  integrations: [
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 600,
    },
    ssr: {
      external: ['node:crypto', 'node:buffer'],      
    },
  },

  // Prefetch for faster navigation
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },

  // Security headers handled via Cloudflare _headers file
  server: {
    port: 4321,
  },

  // Redirect trailing slashes
  trailingSlash: 'never',
});