// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ PERFORMANCE: Exclude static assets and API routes from middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|icon-v2.svg|apple-icon.png|robots.txt|sitemap.xml).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;
  const hostname = request.headers.get('host') || '';

  // ============================================================================
  // 1. SECURITY: BLOCK SUBDOMAINS
  // ============================================================================
  
  if (
    hostname.startsWith('webmail.') || 
    hostname.startsWith('mail.') || 
    hostname.startsWith('cpanel.')
  ) {
    return new NextResponse('Gone', { status: 410 });
  }

  let hasChanges = false;

  // ============================================================================
  // 2. SEO: FORCE NON-WWW
  // ============================================================================
  
  if (hostname.startsWith('www.')) {
    const newHost = hostname.replace('www.', '');
    return NextResponse.redirect(
      new URL(`https://${newHost}${pathname}${url.search}`, request.url),
      301
    );
  }

  // ============================================================================
  // 3. SEO: CLEAN PARAMETERS (Feed/AMP)
  // ============================================================================
  
  // Remove /feed and /amp from URLs
  if (pathname.endsWith('/feed') || pathname.endsWith('/feed/')) {
    url.pathname = pathname.replace(/\/feed\/?$/, '');
    hasChanges = true;
  }
  
  if (pathname.endsWith('/amp') || pathname.endsWith('/amp/')) {
    url.pathname = pathname.replace(/\/amp\/?$/, '');
    hasChanges = true;
  }

  // Remove bad query parameters
  const badParams = ['noamp', 'amp', 'm', 'feed', 'cat'];
  badParams.forEach((param) => {
    if (searchParams.has(param)) {
      searchParams.delete(param);
      hasChanges = true;
    }
  });

  // ✅ If we cleaned anything, redirect
  if (hasChanges) {
    return NextResponse.redirect(url, 301);
  }

  // ============================================================================
  // 4. SECURITY & PERFORMANCE HEADERS (FIXED FOR BEST PRACTICES 100)
  // ============================================================================
  
  const response = NextResponse.next();
  
  // ✅ PERFORMANCE: Disable caching for RSC (React Server Components) requests
  // This fixes the 404 errors for _rsc requests
  if (searchParams.has('_rsc')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Vary', 'RSC, Next-Router-State-Tree, Next-Router-Prefetch');
  }
  
  // ✅ SECURITY: Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // ✅ SECURITY: Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // ✅ SECURITY: XSS Protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // ✅ SECURITY: Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // ✅ SECURITY: Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // ✅ SECURITY FIX: Content Security Policy (CSP) - COMPLETE FIX
  // Added 'challenges.cloudflare.com' to script-src, frame-src, and connect-src
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' 
      https://www.googletagmanager.com 
      https://www.google-analytics.com 
      https://www.clarity.ms 
      https://scripts.clarity.ms
      https://static.cloudflareinsights.com
      https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' 
      https://fonts.googleapis.com;
    img-src 'self' blob: data: 
      https://cdn.sanity.io 
      https://placehold.co 
      https://toptenuae.com 
      https://lh3.googleusercontent.com
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://c.clarity.ms
      https://c.bing.com;
    font-src 'self' 
      https://fonts.gstatic.com;
    connect-src 'self' 
      https://cdn.sanity.io 
      https://*.sanity.io
      https://www.google-analytics.com 
      https://www.googletagmanager.com
      https://www.clarity.ms
      https://c.clarity.ms
      https://y.clarity.ms
      https://z.clarity.ms
      https://j.clarity.ms
      https://static.cloudflareinsights.com
      https://challenges.cloudflare.com;
    frame-src 'self' 
      https://www.googletagmanager.com
      https://challenges.cloudflare.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // ✅ CLOUDFLARE: Set cache headers for static content
  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|css|js|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}