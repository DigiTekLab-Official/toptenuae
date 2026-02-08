// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { revalidateTag } from 'next/cache'

// Force Node.js runtime for ISR + webhooks
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Validate signature using next-sanity helper
    const { body, isValidSignature } = await parseBody(
      req,
      process.env.SANITY_WEBHOOK_SECRET!
    )

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    // 2️⃣ Decide which tags to revalidate
    const tagsToRevalidate: string[] = []
    const slug = body.slug as string | undefined

    switch (body._type) {
      case 'deal':
      case 'product':
        tagsToRevalidate.push('deals', 'deal', 'product', 'reviews', 'topTenList')
        if (slug) tagsToRevalidate.push(slug, `product:${slug}`)
        break
      case 'howTo':
        tagsToRevalidate.push('howTo')
        if (slug) tagsToRevalidate.push(slug)
        break
      case 'holiday':
        tagsToRevalidate.push('holiday')
        if (slug) tagsToRevalidate.push(slug)
        break
      case 'topTenList':
        tagsToRevalidate.push('topTenList', 'product', 'reviews')
        if (slug) tagsToRevalidate.push(slug, `topTenList:${slug}`)
        break
      case 'article':
        tagsToRevalidate.push('article')
        if (slug) tagsToRevalidate.push(slug)
        break
      default:
        tagsToRevalidate.push(body._type as string)
    }

    // 3️⃣ Trigger ISR revalidation by tag
    for (const tag of tagsToRevalidate) {
      revalidateTag(tag, 'all')
    }

    // 4️⃣ Return success response
    return NextResponse.json({
      revalidated: true,
      tags: tagsToRevalidate,
      now: Date.now(),
    })
  } catch (error: any) {
    console.error('ISR revalidation error:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
