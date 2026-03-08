import { discoverImage } from '@/sanity/lib/image'

export default function ArticleHero({ image, alt }: { image: any, alt: string }) {
  const src = discoverImage(image)

  if (!src) return null

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden my-6">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  )
}