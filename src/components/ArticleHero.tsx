import { urlFor } from '@/sanity/lib/image'

export default function ArticleHero({ image, alt }: { image: any, alt: string }) {
  if (!image?.asset) return null

  const sourceDimensions = image.asset.metadata?.dimensions
  const maxCropWidth = sourceDimensions?.width && sourceDimensions?.height
    ? Math.min(sourceDimensions.width, Math.floor(sourceDimensions.height * 16 / 9))
    : 1600
  const widths = [480, 768, 1200, 1600].filter((width) => width <= maxCropWidth)
  if (widths.length === 0) widths.push(maxCropWidth)
  const displayWidth = Math.min(1200, maxCropWidth)
  const displayHeight = Math.round(displayWidth * 9 / 16)
  const imageUrl = (width: number) => urlFor(image)
    .width(width)
    .height(Math.round(width * 9 / 16))
    .fit('crop')
    .auto('format')
    .quality(78)
    .url()
  const src = imageUrl(displayWidth)
  const srcSet = widths.map((width) => `${imageUrl(width)} ${width}w`).join(', ')

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden my-6">
      <img
        src={src}
        srcSet={srcSet}
        sizes="(min-width: 1024px) 896px, calc(100vw - 2rem)"
        alt={alt}
        width={displayWidth}
        height={displayHeight}
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  )
}
