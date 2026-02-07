import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ========================================================================
// ✅ UPDATED MATCHER
// ========================================================================
export const config = {
  matcher: [
    // Ignore internal Next.js files, Sanity Studio, and specific static files
    '/((?!api|studio|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;
  const hostname = request.headers.get('host') || '';

  /// ========================================================================
  // 0. BYPASS LOGIC (Safety Net)
  // ========================================================================
  if (
    pathname.startsWith('/api') || 
    pathname.startsWith('/studio') || 
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    // Always use .txt here, even if the source is .ts
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname.includes('.') 
  ) {
    return NextResponse.next();
  }

  // ========================================================================
  // 1. TRAILING SLASH REMOVAL
  // ========================================================================
  if (pathname !== '/' && pathname.endsWith('/')) {
    url.pathname = pathname.replace(/\/$/, '');
    return NextResponse.redirect(url, 301);
  }

  // ========================================================================
  // 2. SECURITY BLOCKLIST
  // ========================================================================
  if (
    hostname.startsWith('webmail.') ||
    hostname.startsWith('cpanel.') ||
    pathname.includes('.php') ||
    pathname.startsWith('/cgi-bin/')
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ========================================================================
  // 3. URL CLEANUP (WWW & Case)
  // ========================================================================
  let needsRedirect = false;

  // A. Force Non-WWW
  if (hostname.startsWith('www.')) {
    url.hostname = hostname.replace('www.', '');
    needsRedirect = true;
  }

  // B. Force Lowercase
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    needsRedirect = true;
  }

  // C. Strip Tracking Parameters
  const badParams = ['fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'ref'];
  badParams.forEach((param) => {
    if (searchParams.has(param)) {
      searchParams.delete(param);
      needsRedirect = true;
    }
  });

  if (needsRedirect) {
    return NextResponse.redirect(url, 301);
  }

  // ========================================================================
  // 4. SECURITY HEADERS (CSP)
  // ========================================================================
  const response = NextResponse.next();

  const cspHeader = `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://static.cloudflareinsights.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://cdn.sanity.io https://placehold.co https://toptenuae.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://c.bing.com https://m.media-amazon.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://static.cloudflareinsights.com https://challenges.cloudflare.com; frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`;
  
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}