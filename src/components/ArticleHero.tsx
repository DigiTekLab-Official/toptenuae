import { responsiveSanityImage } from '@/sanity/lib/image'

export default function ArticleHero({ image, alt }: { image: any, alt: string }) {
  const responsiveImage = responsiveSanityImage(image, {
    widths: [480, 768, 1200, 1600],
    defaultWidth: 1200,
    aspectRatio: 16 / 9,
  })

  if (!responsiveImage) return null

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden my-6">
      <img
        src={responsiveImage.src}
        srcSet={responsiveImage.srcSet}
        sizes="(min-width: 1024px) 896px, calc(100vw - 2rem)"
        alt={alt}
        width={responsiveImage.width}
        height={responsiveImage.height}
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  )
}
