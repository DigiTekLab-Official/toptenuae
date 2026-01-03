// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    // Added 'icon-v2.svg' to the exclusion list
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|icon-v2.svg|robots.txt|sitemap.xml).*)',
  ],
};

export default function middleware(request: NextRequest) {
  return NextResponse.next();
}