import Image from 'next/image'
import { discoverImage } from '@/sanity/lib/image'

export default function ArticleHero({ image, alt }: { image: any, alt: string }) {
  const src = discoverImage(image)

  if (!src) return null

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden my-6">
      <Image
        src={src}
        alt={alt}
        fill // 'fill' is better for responsive containers in App Router
        priority={true} // High priority for LCP
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
    </div>
  )
}