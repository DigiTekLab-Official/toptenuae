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
    plugins: [
      tailwindcss(),
      // ⬇️ Custom plugin to force Vite to pre-bundle React & Astro view transitions for Cloudflare
      {
        name: 'fix-cloudflare-react-hooks',
        configEnvironment(name, config) {
          if (name !== 'client') {
            config.optimizeDeps = config.optimizeDeps || {};
            config.optimizeDeps.include = config.optimizeDeps.include || [];
            config.optimizeDeps.include.push(
              'react',
              'react-dom',
              'react-dom/server',
              'react/jsx-runtime',
              'react/jsx-dev-runtime',
              'astro/virtual-modules/transitions.js',
              'astro/virtual-modules/transitions-router.js',
              'astro/virtual-modules/transitions-types.js',
              'astro/virtual-modules/transitions-events.js',
              'astro/virtual-modules/transitions-swap-functions.js'
            );
          }
        },
      }
    ],
    // ⬇️ Forces Cloudflare's local environment to use a single instance of Edge React
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        'react-dom/server': 'react-dom/server.edge',
      },
    },
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