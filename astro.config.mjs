// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
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

  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('/thank-you') &&
        !page.includes('/report') &&
        !page.includes('/newsletter/confirm'),
      serialize(item) {
        if (item.url.includes('/reviews/')) {
          item.changefreq = 'weekly';
          item.priority = 0.9;
        } else if (item.url.includes('/deals')) {
          item.changefreq = 'daily';
          item.priority = 0.8;
        } else if (item.url.includes('/top-ten/')) {
          item.changefreq = 'weekly';
          item.priority = 0.9;
        } else if (item.url === 'https://toptenuae.com') {
          item.changefreq = 'daily';
          item.priority = 1.0;
        }
        return item;
      },
    }),
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
