// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request, url, redirect }, next) => {
  const hostname = request.headers.get('host') || '';

  // Skip static assets and API routes
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

  // Consolidated redirects
  let needsRedirect = false;
  const newUrl = new URL(url);

  // Force non-www
  if (hostname.startsWith('www.')) {
    newUrl.hostname = hostname.replace('www.', '');
    needsRedirect = true;
  }

  // Force lowercase
  if (newUrl.pathname !== newUrl.pathname.toLowerCase()) {
    newUrl.pathname = newUrl.pathname.toLowerCase();
    needsRedirect = true;
  }

  // Strip tracking parameters
  const badParams = ['fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'ref'];
  for (const param of badParams) {
    if (newUrl.searchParams.has(param)) {
      newUrl.searchParams.delete(param);
      needsRedirect = true;
    }
  }

  if (needsRedirect) {
    return redirect(newUrl.toString(), 301);
  }

  // Continue and add security headers
  const response = await next();

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https://cdn.sanity.io https://placehold.co https://toptenuae.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://c.bing.com https://m.media-amazon.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms",
    "frame-src 'self' https://www.googletagmanager.com",
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

  return response;
});