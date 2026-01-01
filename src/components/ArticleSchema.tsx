import Script from 'next/script'
import { discoverImage } from '@/sanity/lib/image'

export default function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  url,
}: any) {
  const imageUrl = discoverImage(image)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 2400,
      height: 1350,
    },
    datePublished,
    dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
