import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-Demand ISR (Incremental Static Regeneration)
 * 
 * Endpoint to manually revalidate cached pages and data
 * Triggered by Sanity webhooks when content is published
 * 
 * Security: Requires REVALIDATE_SECRET header
 * 
 * Usage:
 * POST /api/revalidate
 * Headers: { "x-revalidate-secret": "your-secret" }
 * Body: { "path": "/reviews/best-product" }
 * 
 * Response: { "revalidated": true, "message": "...", "timestamp": "..." }
 */

export async function POST(request: NextRequest) {
  try {
    // Verify the secret token
    const secret = request.headers.get('x-revalidate-secret');

    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing revalidation secret' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json(
        { 
          error: 'Bad Request: Provide "path" for revalidation',
          example: { path: '/reviews/best-product' },
        },
        { status: 400 }
      );
    }

    // Revalidate by path
    if (typeof path !== 'string') {
      return NextResponse.json(
        { error: 'Bad Request: "path" must be a string' },
        { status: 400 }
      );
    }

    revalidatePath(path);
    
    return NextResponse.json(
      {
        revalidated: true,
        message: `Successfully revalidated path: ${path}`,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('ISR Revalidation Error:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for testing (optional)
 * Usage: GET /api/revalidate?path=/reviews
 */
export async function GET(request: NextRequest) {
  // Verify the secret token
  const secret = request.headers.get('x-revalidate-secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing revalidation secret' },
      { status: 401 }
    );
  }

  const path = request.nextUrl.searchParams.get('path');

  if (!path) {
    return NextResponse.json(
      {
        message: 'ISR Revalidation Endpoint',
        usage: {
          post: {
            description: 'Trigger revalidation by path',
            headers: { 'x-revalidate-secret': 'your-secret' },
            body: { path: '/reviews' },
          },
          get: {
            description: 'Test endpoint (GET method)',
            queryParams: { path: '/reviews' },
          },
        },
      },
      { status: 200 }
    );
  }

  revalidatePath(path);
  return NextResponse.json(
    {
      revalidated: true,
      message: `Revalidated path: ${path}`,
    },
    { status: 200 }
  );
}
