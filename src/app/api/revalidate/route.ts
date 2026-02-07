import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Force Node.js runtime (important for ISR + webhooks)
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Validate secret via query param
    const secret = req.nextUrl.searchParams.get('secret')

    if (!secret || secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return new NextResponse('Invalid token', { status: 401 })
    }

    // 2️⃣ Parse JSON body sent by Sanity
    const body = await req.json()

    if (!body || !body._type) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    // 3️⃣ Always revalidate homepage
    const pathsToRevalidate: string[] = ['/']

    // 4️⃣ Content-type based ISR
    switch (body._type) {
      case 'howTo':
        pathsToRevalidate.push('/how-to-guides')
        if (body.slug?.current) {
          pathsToRevalidate.push(`/how-to-guides/${body.slug.current}`)
        }
        break

      case 'holiday':
        pathsToRevalidate.push('/events-holidays')
        if (body.slug?.current) {
          pathsToRevalidate.push(`/events-holidays/${body.slug.current}`)
        }
        break

      case 'deals':
        pathsToRevalidate.push('/deals')
        if (body.slug?.current) {
          pathsToRevalidate.push(`/deals/${body.slug.current}`)
        }
        break

      case 'topTenList':
        pathsToRevalidate.push('/top-ten')
        if (body.slug?.current) {
          pathsToRevalidate.push(`/top-ten/${body.slug.current}`)
        }
        break

      case 'article':
        if (body.slug?.current) {
          pathsToRevalidate.push(`/articles/${body.slug.current}`)
        }
        break

      case 'product':
        pathsToRevalidate.push('/reviews')
        if (body.slug?.current) {
          pathsToRevalidate.push(`/products/${body.slug.current}`)
        }
        break
    }

    // 5️⃣ Trigger ISR
    for (const path of pathsToRevalidate) {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      now: Date.now(),
    })
  } catch (error) {
    console.error('ISR revalidation error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
