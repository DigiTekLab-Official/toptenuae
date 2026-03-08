// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|studio|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  let needsRedirect = false;

  // ========================================================================
  // 0. BYPASS LOGIC
  // ========================================================================
  if (
    url.pathname.startsWith('/api') || 
    url.pathname.startsWith('/studio') || 
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/static') ||
    url.pathname === '/sitemap.xml' ||
    url.pathname === '/robots.txt' ||
    url.pathname.includes('.') 
  ) {
    return NextResponse.next();
  }

  // ========================================================================
  // 1. SECURITY BLOCKLIST
  // ========================================================================
  if (
    hostname.startsWith('webmail.') ||
    hostname.startsWith('cpanel.') ||
    url.pathname.includes('.php') ||
    url.pathname.startsWith('/cgi-bin/')
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ========================================================================
  // 2. CONSOLIDATED REDIRECTS (The "One Jump" Fix)
  // ========================================================================
  
  // A. Trailing Slash Removal
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
    needsRedirect = true;
  }

  // B. Force Non-WWW
  if (hostname.startsWith('www.')) {
    url.hostname = hostname.replace('www.', '');
    needsRedirect = true;
  }

  // C. Force Lowercase (Check against the updated pathname from Step A)
  if (url.pathname !== url.pathname.toLowerCase()) {
    url.pathname = url.pathname.toLowerCase();
    needsRedirect = true;
  }

  // D. Strip Tracking Parameters
  const badParams = ['fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'ref'];
  badParams.forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      needsRedirect = true;
    }
  });

  // EXECUTE REDIRECT (If any of the above changed)
  if (needsRedirect) {
    return NextResponse.redirect(url, 301);
  }

  // ========================================================================
  // 3. SECURITY HEADERS (CSP)
  // ========================================================================
  const response = NextResponse.next();

  const cspHeader = `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://cdn.sanity.io https://placehold.co https://toptenuae.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://c.bing.com https://m.media-amazon.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms; frame-src 'self' https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`;
  
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}