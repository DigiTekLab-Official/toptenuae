// Service Worker for TopTenUAE
// Provides offline fallback and caches critical assets for performance

const CACHE_NAME = 'toptenuae-v2';
const CRITICAL_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html'
];

const STATIC_ASSET_PATHS = [
  /\/_next\/static\//,
  /\/images\//,
  /\.woff2$/,
  /\.svg$/
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Installing and caching critical assets');
      return cache.addAll(CRITICAL_ASSETS).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache static assets, fallback for dynamic
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // Only handle GET requests
  if (method !== 'GET') return;

  // ✅ CRITICAL FIX: Pass through Sanity images directly without caching
  // This prevents hydration mismatch on initial page load
  if (url.includes('cdn.sanity.io')) {
    event.respondWith(
      fetch(request, { credentials: 'omit' })
        .then(response => response.ok ? response : null)
        .catch(() => null)
    );
    return;
  }

  // Skip Google Analytics, external scripts
  if (
    url.includes('google-analytics') ||
    url.includes('googletagmanager') ||
    url.includes('clarity.ms') ||
    url.includes('cloudflareinsights')
  ) {
    // Network first for dynamic content
    event.respondWith(
      fetch(request)
        .then(response => response.ok ? response : caches.match('/offline.html'))
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Cache-first strategy for static assets
  if (STATIC_ASSET_PATHS.some(pattern => pattern.test(url))) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) return response;

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const cache = caches.open(CACHE_NAME);
          cache.then(c => c.put(request, response.clone()));
          return response;
        }).catch(() => {
          // Return cached or placeholder
          return caches.match(request);
        });
      })
    );
    return;
  }

  // Network-first for HTML pages
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        // Cache successful responses
        const cache = caches.open(CACHE_NAME);
        cache.then(c => c.put(request, response.clone()));
        return response;
      })
      .catch(() => {
        return caches.match(request).then(cached => {
          return cached || caches.match('/offline.html');
        });
      })
  );
});

// Handle messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded for TopTenUAE');
