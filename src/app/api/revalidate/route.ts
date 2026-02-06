import { revalidateTag, revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * SANITY WEBHOOK HANDLER (Best Practice 2026)
 * * Triggered by: Sanity Webhook (Manage -> API -> Webhooks)
 * Security: Verifies the 'sanity-webhook-signature' header
 * * Required Env Var: SANITY_WEBHOOK_SECRET
 */

export async function POST(req: NextRequest) {
  try {
    // 1. Secure Signature Verification
    // This parses the body AND checks the cryptographic signature from Sanity
    const { isValidSignature, body } = await parseBody(
      req, 
      process.env.SANITY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      console.error('❌ Invalid Sanity Signature');
      return new NextResponse('Unauthorized: Invalid Signature', { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse('Bad Request: Missing _type', { status: 400 });
    }

    console.log(`🔄 Revalidating: ${body._type} | Slug: ${body.slug}`);

    // 2. Revalidate Data Tags (The "Sanity Way")
    // Purges all fetches tagged with this type (e.g., 'howTo', 'article')
    // @ts-expect-error: Next.js 16 signature mismatch (requires 2 args)
    revalidateTag(body._type);
    
    // Purge the specific document slug
    if (body.slug) {
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag(body.slug);
    }

    // Purge Global Lists (Homepage, Category pages)
    if (['howTo', 'topTenList', 'article', 'product', 'deal'].includes(body._type)) {
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag('home-feed');
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag('category-lists');
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag('topTenList');
      
      revalidatePath('/', 'layout'); // Nuclear option: clear homepage cache
    }

    // 3. Attempt to Revalidate the Specific Page Path (HTML)
    // We construct the path based on the category sent in the payload
    if (body.slug) {
      // ✅ FIX: Force String() to prevent "Type {} cannot be used as index" error
      const category = String(body.category || 'reviews'); 
      
      // Normalize category (Quick map to match your page.tsx logic)
      const catMap: Record<string, string> = {
        'travel-tourism': 'events-holidays',
        'health-fitness': 'lifestyle',
        'buyers-guide': 'reviews',
      };
      
      const finalCat = catMap[category] || category;

      const path = `/${finalCat}/${body.slug}`;
      console.log(`📍 Purging Path: ${path}`);
      revalidatePath(path);
    }

    return NextResponse.json({
      status: 'success',
      revalidated: true,
      now: Date.now(),
      body
    });

  } catch (err: any) {
    console.error('⚡ Revalidation Error:', err.message);
    return new NextResponse(err.message, { status: 500 });
  }
}

// Optional: Keep GET for manual testing if needed (Insecure mode)
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  const path = request.nextUrl.searchParams.get('path');

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid Secret' }, { status: 401 });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: path, now: Date.now() });
  }

  return NextResponse.json({ message: 'Missing path param' }, { status: 400 });
}