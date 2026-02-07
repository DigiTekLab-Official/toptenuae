// src/app/api/test/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// Note: We are deliberately NOT setting runtime='edge' here to use the default

export async function GET() {
  console.log("✅ Test route was hit!"); // This will show in Cloudflare logs
  
  return new NextResponse('Hello! The API is working.', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store',
    },
  });
}