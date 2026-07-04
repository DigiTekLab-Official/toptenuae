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
  // … CSP + headers exactly as before …
  return response;
});