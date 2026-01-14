// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|icon-v2.svg|apple-icon.png|robots.txt|sitemap.xml).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // 1. FIX: RSC Prefetch Errors (Rewrite to strip _rsc and prevent 404s)
  if (url.searchParams.has('_rsc')) {
    const cleanUrl = url.clone();
    cleanUrl.searchParams.delete('_rsc');
    
    const response = NextResponse.rewrite(cleanUrl);
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  // Standard response for non-RSC requests
  const response = NextResponse.next();

  // 2. DEFINE CSP (Content Security Policy)
  // Updated: Added https://www.google.com to img-src (Fix #1)
  const csp = `
    default-src 'self';
    base-uri 'self';

    script-src 'self' 'unsafe-eval' 'unsafe-inline'
      https://cdn.sanity.io
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://static.cloudflareinsights.com
      https://challenges.cloudflare.com
      https://*.clarity.ms
      https://c.clarity.ms
      https://c.bing.com;

    style-src 'self' 'unsafe-inline'
      https://fonts.googleapis.com;

    img-src 'self' blob: data:
      https://cdn.sanity.io
      https://placehold.co
      https://toptenuae.com
      https://lh3.googleusercontent.com
      https://www.google-analytics.com
      https://www.google.com
      https://*.clarity.ms
      https://c.clarity.ms
      https://c.bing.com;  

    font-src 'self' data:
      https://fonts.gstatic.com;

    connect-src 'self'
      https://*.sanity.io
      https://www.google-analytics.com
      https://www.googletagmanager.com
      https://*.clarity.ms
      https://c.clarity.ms 
      https://c.bing.com
      https://cloudflareinsights.com
      https://challenges.cloudflare.com;

    frame-src 'self'
      https://challenges.cloudflare.com;

    frame-ancestors 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  // 3. SET SECURITY HEADERS
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Content-Security-Policy', csp);

  return response;
}