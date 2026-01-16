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

  // 1. BLOCK SUBDOMAINS (Security)
  if (
    hostname.startsWith('webmail.') || 
    hostname.startsWith('mail.') || 
    hostname.startsWith('cpanel.')
  ) {
    return new NextResponse('Gone', { status: 410 });
  }

  let hasChanges = false;

  // 2. FORCE NON-WWW (SEO)
  if (hostname.startsWith('www.')) {
    const newHost = hostname.replace('www.', '');
    return NextResponse.redirect(
      new URL(`https://${newHost}${pathname}${url.search}`, request.url),
      301
    );
  }

  // 3. CLEAN PARAMETERS (Feed/AMP)
  // We do NOT handle trailing slashes here. Next.js handles that.
  if (pathname.endsWith('/feed') || pathname.endsWith('/feed/')) {
    url.pathname = pathname.replace(/\/feed\/?$/, '');
    hasChanges = true;
  }
  if (pathname.endsWith('/amp') || pathname.endsWith('/amp/')) {
    url.pathname = pathname.replace(/\/amp\/?$/, '');
    hasChanges = true;
  }

  const badParams = ['noamp', 'amp', 'm', 'feed', 'cat'];
  badParams.forEach((param) => {
    if (searchParams.has(param)) {
      searchParams.delete(param);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    return NextResponse.redirect(url, 301);
  }

  // 4. SECURITY HEADERS
  const response = NextResponse.next();
  
  // (Your existing CSP logic here - keep it exactly as you had it)
  if (request.nextUrl.searchParams.has('_rsc')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  }
  
  // Shortened for brevity - paste your CSP/Headers code back here
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  // ... rest of headers
  
  return response;
}