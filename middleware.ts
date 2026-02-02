// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  // ✅ CLOUDFLARE OPTIMIZED: Exclude static assets, API, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|_next/data|studio|favicon.ico|icon.svg|icon-v2.svg|apple-icon.png|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|js|css|json)$).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;
  const hostname = request.headers.get('host') || '';

  // ========================================================================
  // 1. SECURITY: Block Bad Bots / Malicious Hosts
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

  // Block PHP files and suspicious paths
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
  // 2. FIX: Malformed URLs (Cloudflare Compatible)
  // ========================================================================
  if (pathname.includes('://')) {
    const httpsIndex = pathname.indexOf('https://');
    const httpIndex = pathname.indexOf('http://');
    
    if (httpsIndex !== -1) {
      const afterHttps = pathname.substring(httpsIndex + 8);
      const nextSlashIndex = afterHttps.indexOf('/');
      if (nextSlashIndex !== -1) {
        const cleanPath = afterHttps.substring(nextSlashIndex);
        // ✅ Cloudflare Pages: Use absolute URL
        return NextResponse.redirect(new URL(cleanPath, request.url), 301);
      }
    } else if (httpIndex !== -1) {
      const afterHttp = pathname.substring(httpIndex + 7);
      const nextSlashIndex = afterHttp.indexOf('/');
      if (nextSlashIndex !== -1) {
        const cleanPath = afterHttp.substring(nextSlashIndex);
        // ✅ Cloudflare Pages: Use absolute URL
        return NextResponse.redirect(new URL(cleanPath, request.url), 301);
      }
    }
    return new NextResponse('Bad Request', { status: 400 });
  }

  // ❌ REMOVED: Section 3 (legacyRedirects)
  // Reason: These are now handled faster in next.config.ts

  // ========================================================================
  // 4. SEO: Block Search Results from Indexing
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

  // A. Force WWW → Non-WWW (Critical for canonical URLs & GSC)
  if (hostname.startsWith('www.')) {
    url.hostname = hostname.replace('www.', '');
    needsRedirect = true;
    isWWWRedirect = true;
  }

  // B. Block Legacy WordPress Paths (Return 410 Gone for SEO)
  if (pathname.startsWith('/category/') || pathname.startsWith('/tag/') || pathname.startsWith('/author/')) {
    return new NextResponse('Gone', { status: 410 });
  }

  // C. Force Lowercase
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    needsRedirect = true;
  }

  // D. Clean Dirty URLs
  if (url.pathname.includes('%20') || url.pathname.includes(' ')) {
    url.pathname = url.pathname
      .replace(/%20/g, '-')
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and')
      .replace(/-+/g, '-')
      .toLowerCase();

    needsRedirect = true;
  }

  // E. Remove Tracking Params & Legacy URL patterns
  const badParams = ['noamp', 'amp', 'm', 'feed', 'cat', 'fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  if (pathname.endsWith('/feed') || pathname.endsWith('/feed/')) {
    url.pathname = pathname.replace(/\/feed\/?$/, '/');
    needsRedirect = true;
  }

  if (pathname.endsWith('/amp') || pathname.endsWith('/amp/')) {
    url.pathname = pathname.replace(/\/amp\/?$/, '/');
    needsRedirect = true;
  }

  // Block /amp/ anywhere in path (e.g., /thank-you/amp/)
  if (pathname.includes('/amp/') && !pathname.includes('_next')) {
    url.pathname = pathname.replace(/\/amp\//g, '/');
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

  // F. TRAILING SLASH ENFORCEMENT (Critical for Cloudflare Pages + trailingSlash: true)
  // Check if URL is missing trailing slash (after all cleanup)
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(url.pathname);
  const isRoot = url.pathname === '/';
  const hasTrailingSlash = url.pathname.endsWith('/');

  // Only add trailing slash if:
  // 1. Not a file (no .jpg, .css, etc.)
  // 2. Not root (already has slash)
  // 3. Doesn't already have trailing slash
  if (!hasFileExtension && !isRoot && !hasTrailingSlash) {
    url.pathname = url.pathname + '/';
    needsRedirect = true;
  }

  // G. Perform Redirect if needed
  if (needsRedirect) {
    // ✅ Cloudflare Pages: Construct absolute URL for proper edge caching
    const redirectUrl = new URL(url.pathname + url.search, request.url);
    
    // Use 308 for trailing slash enforcement (SEO best practice)
    // Use 301 for all other redirects
    const statusCode = isWWWRedirect ? 301 : 308;
    
    return NextResponse.redirect(redirectUrl, statusCode);
  }

  // ========================================================================
  // 6. HEADERS: Security & Performance
  // ========================================================================
  const response = NextResponse.next();

  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  if (searchParams.has('_rsc')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Vary', 'RSC, Next-Router-State-Tree, Next-Router-Prefetch');
  }

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=(), accelerometer=(), gyroscope=(), magnetometer=()');

  // ========================================================================
  // 7. CONTENT SECURITY POLICY
  // ========================================================================
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline'
      https://www.googletagmanager.com
      https://www.google-analytics.com
      https://www.clarity.ms
      https://*.clarity.ms
      https://c.clarity.ms
      https://z.clarity.ms
      https://j.clarity.ms
      https://y.clarity.ms
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
      https://www.clarity.ms
      https://*.clarity.ms
      https://c.clarity.ms
      https://c.bing.com
      https://m.media-amazon.com;
    font-src 'self'
      https://fonts.gstatic.com;
    connect-src 'self'
      https://cdn.sanity.io
      https://*.sanity.io
      https://www.google-analytics.com
      https://www.googletagmanager.com
      https://www.clarity.ms
      https://*.clarity.ms
      https://c.clarity.ms
      https://z.clarity.ms
      https://j.clarity.ms
      https://y.clarity.ms
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

  // ========================================================================
  // 8. STATIC ASSET CACHING
  // ========================================================================
  if (
    pathname.match(
      /\.(jpg|jpeg|png|gif|svg|webp|avif|ico|css|js|woff|woff2|ttf|eot)$/
    )
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  return response;
}