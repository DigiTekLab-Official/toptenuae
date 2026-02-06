// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We removed the sitemap/robots logic because it is handled by next.config.ts
  // and the dynamic route handlers directly.
  return NextResponse.next();
}

export const config = {
  // Empty matcher if you aren't using middleware for anything else
  matcher: [],
};