// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request, url, redirect }, next) => {
  const hostname = request.headers.get('host') || '';

  // Skip static assets and API routes
  // NOTE: keep the `.` check LAST and be aware it also skips any path containing
  // a dot. That's fine for assets, but means dotted content slugs (none today)
  // would bypass normalization. Revisit if slugs ever contain dots.
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_astro') ||
    url.pathname.startsWith('/static') ||
    url.pathname === '/sitemap.xml' ||
    url.pathname === '/robots.txt' ||
    url.pathname.includes('.')
  ) {
    return next();
  }

  // Security blocklist
  if (
    hostname.startsWith('webmail.') ||
    hostname.startsWith('cpanel.') ||
    url.pathname.includes('.php') ||
    url.pathname.startsWith('/cgi-bin/')
  ) {
    return new Response('Not Found', { status: 404 });
  }

  // --- 410 Gone: permanently-removed WordPress legacy namespaces (unchanged) ---
  const path = url.pathname;
  if (
    path.startsWith('/category/') ||
    path.startsWith('/author/') ||
    path.startsWith('/tag/') ||
    path === '/feed' ||
    path.startsWith('/feed/') ||
    path === '/rss' ||
    path.startsWith('/rss/')
  ) {
    return new Response('Gone', { status: 410 });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CONSOLIDATED NORMALIZATION — collapse www + case + trailing-slash into ONE
  // 301 so we never chain middleware → Astro-core-slash-strip → page redirect.
  // This is the fix for the 14 trailing-slash redirect_error URLs in GSC.
  // ─────────────────────────────────────────────────────────────────────────
  let needsRedirect = false;
  const newUrl = new URL(url);

  // 1. Force non-www
  if (hostname.startsWith('www.')) {
    newUrl.hostname = hostname.replace(/^www\./, '');
    needsRedirect = true;
  }

  // 2. Force lowercase path
  if (newUrl.pathname !== newUrl.pathname.toLowerCase()) {
    newUrl.pathname = newUrl.pathname.toLowerCase();
    needsRedirect = true;
  }

  // 3. Strip trailing slash HERE (was previously delegated to Astro core, which
  //    runs AFTER middleware and caused a second hop). Root path is exempt.
  if (newUrl.pathname !== '/' && newUrl.pathname.endsWith('/')) {
    newUrl.pathname = newUrl.pathname.replace(/\/+$/, '');
    needsRedirect = true;
  }

  // 4. Strip tracking parameters
  const badParams = ['fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'ref'];
  for (const param of badParams) {
    if (newUrl.searchParams.has(param)) {
      newUrl.searchParams.delete(param);
      needsRedirect = true;
    }
  }

  // 5. Reviews-list → top-ten consolidation, resolved HERE so it merges into the
  //    same single 301 instead of firing as a trailing page-handler hop.
  //    IMPORTANT: this must use the SAME source of truth the page handler used
  //    to decide a slug is a topTenList. Options, in order of preference:
  //      (a) a build-time generated Set of list slugs imported here, or
  //      (b) a Sanity lookup (adds latency to every /reviews/ request — avoid).
  //    Pseudocode below assumes (a): `LIST_SLUGS` is a Set<string> generated in
  //    the same build step as sitemap.xml. Keep the page-handler redirect as a
  //    fallback so a cache-miss can never 200 the wrong URL.
  //
  //    const m = newUrl.pathname.match(/^\/reviews\/([^/]+)$/);
  //    if (m && LIST_SLUGS.has(m[1])) {
  //      newUrl.pathname = `/top-ten/${m[1]}`;
  //      needsRedirect = true;
  //    }

  if (needsRedirect) {
    return redirect(newUrl.toString(), 301);
  }

  // Continue and add security headers (unchanged)
  const response = await next();
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://challenges.cloudflare.com",
    "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https://cdn.sanity.io https://placehold.co https://toptenuae.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.clarity.ms https://c.bing.com https://m.media-amazon.com https://images-na.ssl-images-amazon.com https://images-eu.ssl-images-amazon.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.clarity.ms https://challenges.cloudflare.com",
    "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  return response;
});
