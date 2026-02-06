// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle sitemap.xml requests
  if (pathname === '/sitemap.xml') {
    const response = NextResponse.next();
    
    // Force correct content type
    response.headers.set('Content-Type', 'application/xml; charset=utf-8');
    response.headers.set('X-Robots-Tag', 'all');
    
    return response;
  }

  // Handle robots.txt requests
  if (pathname === '/robots.txt') {
    const response = NextResponse.next();
    response.headers.set('Content-Type', 'text/plain; charset=utf-8');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/sitemap.xml', '/robots.txt'],
};