import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    // We keep your existing matcher which excludes static assets and key SEO files
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|icon-v2.svg|apple-icon.png|robots.txt|sitemap.xml).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;
  const hostname = request.headers.get('host') || '';

  // =========================================================
  // PHASE 1: SEO GATEKEEPER (Fixes Google Indexing Issues)
  // =========================================================

  // 1. BLOCK SUBDOMAINS (Fixes webmail.toptenuae.com GSC errors)
  // If Google tries to crawl webmail/cpanel, we send "410 Gone" instantly.
  if (
    hostname.startsWith('webmail.') || 
    hostname.startsWith('mail.') || 
    hostname.startsWith('cpanel.')
  ) {
    return new NextResponse('Gone', { status: 410 });
  }

  let hasChanges = false;

  // 2. FORCE NON-WWW (Standard SEO Practice)
  // Redirects www.toptenuae.com -> toptenuae.com
  if (hostname.startsWith('www.')) {
    const newHost = hostname.replace('www.', '');
    // We construct the full URL manually to ensure protocol match
    return NextResponse.redirect(
      new URL(`https://${newHost}${pathname}${url.search}`, request.url),
      301
    );
  }

  // 3. REMOVE 'BAD' PATHS (Fixes /feed/ and /amp/ errors)
  // Detects and removes trailing /feed or /feed/
  if (pathname.endsWith('/feed') || pathname.endsWith('/feed/')) {
    url.pathname = pathname.replace(/\/feed\/?$/, '');
    hasChanges = true;
  }

  // Detects and removes trailing /amp or /amp/
  if (pathname.endsWith('/amp') || pathname.endsWith('/amp/')) {
    url.pathname = pathname.replace(/\/amp\/?$/, '');
    hasChanges = true;
  }

  // 4. CLEAN LEGACY QUERY PARAMETERS
  // Fixes duplicate content: ?noamp=mobile, ?ref=..., ?m=1
  const badParams = ['noamp', 'amp', 'm', 'feed', 'cat'];
  badParams.forEach((param) => {
    if (searchParams.has(param)) {
      searchParams.delete(param);
      hasChanges = true;
    }
  });

  // EXECUTE REDIRECT IF SEO CHANGES WERE MADE
  // Browsers will restart the request with the clean URL
  if (hasChanges) {
    return NextResponse.redirect(url, 301);
  }

  // =========================================================
  // PHASE 2: SECURITY & HEADERS (Your Original Logic)
  // =========================================================
  
  // If we are here, the URL is clean. We proceed with the response.
  const response = NextResponse.next();

  // 5. SAFE FIX: Prevent Caching of RSC Data
  if (request.nextUrl.searchParams.has('_rsc')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
  }

  // 6. DEFINE CSP (Content Security Policy)
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

  // 7. SET SECURITY HEADERS
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