// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|icon-v2.svg|apple-icon.png|robots.txt|sitemap.xml).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;
  const hostname = request.headers.get('host') || '';

  // 1. SECURITY: BLOCK SUBDOMAINS
  if (hostname.startsWith('webmail.') || hostname.startsWith('mail.') || hostname.startsWith('cpanel.')) {
    return new NextResponse('Gone', { status: 410 });
  }

  // 2. SEO: FORCE NON-WWW & CLEAN PARAMS
  let hasChanges = false;
  if (hostname.startsWith('www.')) {
    return NextResponse.redirect(new URL(`https://${hostname.replace('www.', '')}${pathname}${url.search}`, request.url), 301);
  }

  const badParams = ['noamp', 'amp', 'm', 'feed', 'cat'];
  if (pathname.endsWith('/feed') || pathname.endsWith('/feed/')) { url.pathname = pathname.replace(/\/feed\/?$/, ''); hasChanges = true; }
  if (pathname.endsWith('/amp') || pathname.endsWith('/amp/')) { url.pathname = pathname.replace(/\/amp\/?$/, ''); hasChanges = true; }
  badParams.forEach((param) => { if (searchParams.has(param)) { searchParams.delete(param); hasChanges = true; } });

  if (hasChanges) return NextResponse.redirect(url, 301);

  // 3. GENERATE NONCE FOR CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // 4. PREPARE HEADERS
  // ✅ BEST PRACTICES FIX: Strict CSP with Nonce & Strict-Dynamic
  // This satisfies the "Ensure CSP is effective against XSS attacks" audit
  const cspHeader = `
    default-src 'self';
    script-src 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https: http:;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https:;
    frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    upgrade-insecure-requests;
    require-trusted-types-for 'script';
  `.replace(/\s{2,}/g, ' ').trim();

  // Create request headers to pass nonce to the application (layout.tsx)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set response headers for the browser
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=(), accelerometer=(), gyroscope=(), magnetometer=()'
  );

  if (searchParams.has('_rsc')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Vary', 'RSC, Next-Router-State-Tree, Next-Router-Prefetch');
  } else if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|css|js|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}