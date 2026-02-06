import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  // Matcher: Run on everything EXCEPT these paths
  matcher: [
    '/((?!api|_next/static|_next/image|_next/data|studio|favicon.ico|icon.svg|icon-v2.svg|apple-icon.png|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|js|css|json)$).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;
  const hostname = request.headers.get('host') || '';

  // ========================================================================
  // 0. CRITICAL: API & STUDIO BYPASS (The Safety Net)
  // ========================================================================
  // Even if the matcher regex misses something, this explicitly allows APIs to pass.
  if (
    pathname.startsWith('/api') || 
    pathname.startsWith('/studio') || 
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // ========================================================================
  // 1. SECURITY
  // ========================================================================
  if (
    hostname.startsWith('webmail.') ||
    hostname.startsWith('mail.') ||
    hostname.startsWith('cpanel.') ||
    hostname.startsWith('www.webmail.') ||
    hostname.startsWith('www.mail.')
  ) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (
    pathname.includes('.php') ||
    pathname.startsWith('/cgi-bin/') ||
    pathname.startsWith('/phpinfo') ||
    pathname === '/docs/index.html' ||
    pathname.includes('/page_does_not_exist')
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ========================================================================
  // 2. FIX MALFORMED URLS
  // ========================================================================
  if (pathname.includes('://')) {
    const cleanPath = pathname.replace(/^.*:\/\/[^/]+/, '');
    return NextResponse.redirect(new URL(cleanPath, request.url), 301);
  }

  // ========================================================================
  // 3. SEO BLOCKING (Spam Params)
  // ========================================================================
  if (searchParams.has('s') && searchParams.get('s') !== '') {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // ========================================================================
  // 4. URL CLEANUP & CANONICAL ENFORCEMENT
  // ========================================================================
  let needsRedirect = false;
  let isWWWRedirect = false;

  // A. Force WWW → Non-WWW (Or Non-WWW → WWW depending on preference)
  // Current logic: Removes WWW
  if (hostname.startsWith('www.')) {
    url.hostname = hostname.replace('www.', '');
    needsRedirect = true;
    isWWWRedirect = true;
  }

  // B. Block Legacy Wordpress Paths
  if (pathname.startsWith('/category/') || pathname.startsWith('/tag/') || pathname.startsWith('/author/')) {
    return new NextResponse('Gone', { status: 410 });
  }

  // C. Force Lowercase
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    needsRedirect = true;
  }

  // D. Clean Dirty URLs (Spaces, encoded chars)
  if (url.pathname.includes('%20') || url.pathname.includes(' ')) {
    url.pathname = url.pathname
      .replace(/%20|\s+/g, '-')
      .replace(/&/g, 'and')
      .replace(/-+/g, '-')
      .toLowerCase();
    needsRedirect = true;
  }

  // E. Remove Tracking/Legacy Params
  const badParams = [
    'noamp', 'amp', 'm', 'feed', 'cat', 
    'fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'
  ];
  
  if (pathname.endsWith('/feed') || pathname.endsWith('/feed/')) {
    url.pathname = pathname.replace(/\/feed\/?$/, '');
    needsRedirect = true;
  }
  if (pathname.endsWith('/amp') || pathname.endsWith('/amp/')) {
    url.pathname = pathname.replace(/\/amp\/?$/, '');
    needsRedirect = true;
  }
  
  badParams.forEach((param) => {
    if (searchParams.has(param)) {
      searchParams.delete(param);
      needsRedirect = true;
    }
  });

  if (pathname.startsWith('/index.php/')) {
    url.pathname = pathname.replace('/index.php', '');
    needsRedirect = true;
  }

  // F. Perform Redirect if needed
  if (needsRedirect) {
    const redirectUrl = new URL(url.pathname + url.search, request.url);
    const statusCode = isWWWRedirect ? 301 : 308;
    return NextResponse.redirect(redirectUrl, statusCode);
  }

  // ========================================================================
  // 5. HEADERS
  // ========================================================================
  const response = NextResponse.next();

  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  if (searchParams.has('_rsc')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Vary', 'RSC, Next-Router-State-Tree, Next-Router-Prefetch');
  }

  // CSP Header (Updated with connect-src for Sanity)
  const cspHeader = `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://static.cloudflareinsights.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://cdn.sanity.io https://placehold.co https://toptenuae.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://c.bing.com https://m.media-amazon.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://static.cloudflareinsights.com https://challenges.cloudflare.com; frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`;
  
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=()');

  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|css|js|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}