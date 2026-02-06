// src/app/api/sanity-hook/route.ts
import { revalidateTag, revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

// Force dynamic to prevent static HTML generation
export const dynamic = 'force-dynamic';

/**
 * GET Handler
 * Returns a helpful message (this endpoint is for webhooks only)
 */
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Sanity Webhook Endpoint',
      status: 'ready',
      methods: ['POST', 'OPTIONS'],
      description: 'This endpoint receives webhooks from Sanity CMS for cache revalidation'
    },
    { status: 200 }
  );
}

/**
 * OPTIONS Handler
 * Fixes "405 Method Not Allowed" by telling Cloudflare/Sanity 
 * that POST requests are definitely allowed here.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

/**
 * POST Handler (The Main Webhook)
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody(
      req, 
      process.env.SANITY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      console.error('❌ Invalid Sanity Signature');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    console.log(`Receiving Webhook: ${body._type} | ${body.slug}`);

    // 1. Tag Revalidation
    // @ts-expect-error: Next.js signature bypass
    revalidateTag(body._type);
    
    if (body.slug) {
      // @ts-expect-error: Next.js signature bypass
      revalidateTag(body.slug);
    }

    // 2. Global List Revalidation
    if (['howTo', 'topTenList', 'article', 'product', 'deal'].includes(body._type)) {
      const tags = ['home-feed', 'category-lists', 'topTenList', 'article', 'howTo', 'product', 'deal'];
      tags.forEach(tag => {
        // @ts-expect-error: Next.js signature bypass
        revalidateTag(tag);
      });
      revalidatePath('/', 'layout');
    }

    // 3. Path Revalidation
    if (body.slug) {
      const slug = body.slug;
      const category = String(body.category || 'reviews');
      const paths = [
        `/${category}/${slug}`,
        `/reviews/${slug}`,
        `/tech/${slug}`,
        `/top-ten/${slug}`,
        `/how-to-guides/${slug}`
      ];
      paths.forEach(p => revalidatePath(p));
    }

    return NextResponse.json({ success: true, now: Date.now() });

  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return new NextResponse(err.message, { status: 500 });
  }
}