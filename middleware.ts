import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  // Exclude static assets/api from middleware to save performance
  matcher: [
    '/((?!api|_next/static|_next/image|studio|favicon.ico|icon.svg|icon-v2.svg|apple-icon.png|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;
  const hostname = request.headers.get('host') || '';

  // --------------------------------------------------------
  // 1. SECURITY: Block Bad Bots / Hosts
  // --------------------------------------------------------
  if (
    hostname.startsWith('webmail.') ||
    hostname.startsWith('mail.') ||
    hostname.startsWith('cpanel.')
  ) {
    return new NextResponse('Gone', { status: 410 });
  }

  // --------------------------------------------------------
  // 2. CRITICAL MIGRATION REDIRECTS (Fixes Localhost 404s)
  // --------------------------------------------------------
  // We handle these specific stubborn URLs here to force a redirect
  // before the Next.js router can throw a 404.
  const legacyRedirects: Record<string, string> = {
    '/how-to-clean-washing-machine': '/smart-home/how-to-clean-washing-machine',
    '/gratuity-calculator-uae': '/finance-tools/gratuity-calculator-uae',
    '/uae-vat-calculator': '/finance-tools/uae-vat-calculator',
    '/zakat-calculator': '/finance-tools/zakat-calculator',
    // Add any other single-segment URLs that fail here
  };

  // Remove trailing slash for matching
  const cleanPath = pathname.replace(/\/$/, '');
  
  if (legacyRedirects[cleanPath]) {
    return NextResponse.redirect(new URL(legacyRedirects[cleanPath], request.url), 301);
  }

  // --------------------------------------------------------
  // 3. SEO: URL Normalization
  // --------------------------------------------------------
  let needsRedirect = false;

  // A. Force WWW → Non-WWW
  if (hostname.startsWith('www.')) {
    return NextResponse.redirect(
      new URL(
        `https://${hostname.replace('www.', '')}${pathname}${url.search}`,
        request.url
      ),
      301
    );
  }

  // B. Force Lowercase
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    needsRedirect = true;
  }

  // C. Clean Dirty URLs (Spaces, encoded chars)
  if (url.pathname.includes('%20') || url.pathname.includes(' ')) {
    url.pathname = url.pathname
      .replace(/%20/g, '-')
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and')
      .replace(/-+/g, '-')
      .toLowerCase();

    needsRedirect = true;
  }

  // D. Remove Tracking Params & Legacy URL patterns
  const badParams = ['noamp', 'amp', 'm', 'feed', 'cat', 'fbclid', 'gclid'];

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

  // Execute Redirect if needed
  if (needsRedirect) {
    return NextResponse.redirect(url, 301);
  }

  // --------------------------------------------------------
  // 4. HEADERS: Security & Performance
  // --------------------------------------------------------
  const response = NextResponse.next();

  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set(
    'Cross-Origin-Opener-Policy',
    'same-origin-allow-popups'
  );

  // Fix for React Server Components (RSC)
  if (searchParams.has('_rsc')) {
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate'
    );
    response.headers.set(
      'Vary',
      'RSC, Next-Router-State-Tree, Next-Router-Prefetch'
    );
  }

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=(), accelerometer=(), gyroscope=(), magnetometer=()'
  );

  // --------------------------------------------------------
  // 5. CONTENT SECURITY POLICY
  // --------------------------------------------------------
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
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // --------------------------------------------------------
  // 6. STATIC ASSET CACHING
  // --------------------------------------------------------
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