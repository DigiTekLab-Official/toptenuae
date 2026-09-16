import {createClient} from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId) throw new Error('Missing PUBLIC_SANITY_PROJECT_ID')

const client = createClient({projectId, dataset, apiVersion, useCdn: false, perspective: 'published'})

const slugs = [
  'best-laptops-uae',
  'best-gaming-laptops-uae',
  'best-laptops-for-students-uae',
  'best-business-laptops-uae',
  'best-ai-laptops-uae',
  'best-laptop-under-1500-aed-uae',
]

const query = `{
  "moneyPages": *[_type == "topTenList" && slug.current in $slugs] | order(slug.current asc) {
    _id, _updatedAt, title, "slug": slug.current,
    listItems[] | order(rank asc) {
      rank, badgeLabel, whySelected, skipIf,
      product->{
        _id, _updatedAt, title, brand, "slug": slug.current,
        asin, affiliateLink, price, currency, priceTier,
        availability, availabilityStatus, availabilityCheckedAt, lastPriceCheckedAt,
        specifications[]{specLabel, specValue}, uaeCommerce, verdict
      }
    }
  },
  "decisionPage": *[_type == "buyerGuide" && slug.current == "windows-laptop-vs-macbook-uae"][0] {
    _id, _updatedAt, title, "slug": slug.current,
    "decisionProducts": body[_type == "decisionProduct"]{
      path, role, title, asin, affiliateLink, availabilityStatus, offerCheckedAt,
      ctaLabel, configuration, limitation,
      "product": product->{
        _id, _updatedAt, title, brand, "slug": slug.current,
        asin, affiliateLink, price, currency, priceTier,
        availability, availabilityStatus, availabilityCheckedAt, lastPriceCheckedAt,
        specifications[]{specLabel, specValue}, uaeCommerce, verdict
      }
    }
  }
}`

const result = await client.fetch(query, {slugs})

const asinPattern = /(?:\/dp\/|\/gp\/product\/|ASIN\s+)([A-Z0-9]{10})(?:\b|\/|\?)/i
const extractAsin = (...values) => {
  for (const value of values) {
    if (typeof value !== 'string') continue
    const match = value.match(asinPattern)
    if (match) return match[1].toUpperCase()
  }
  return null
}

const compactProduct = (product, overrides = {}) => {
  product ||= {}
  const uae = product.uaeCommerce || {}
  const specs = Object.fromEntries(
    (product.specifications || [])
      .filter((item) => item?.specLabel)
      .map((item) => [item.specLabel, item.specValue || null]),
  )
  const asin = overrides.asin || product.asin || extractAsin(
    overrides.affiliateLink,
    product.affiliateLink,
    uae.availabilityNote,
    uae.variantRiskNote,
  )

  return {
    productId: product._id || null,
    productUpdatedAt: product._updatedAt || null,
    reviewSlug: product.slug || null,
    title: overrides.title || product.title || null,
    brand: product.brand || null,
    asin,
    storedAsin: overrides.asin || product.asin || null,
    affiliateLink: overrides.affiliateLink || product.affiliateLink || null,
    price: product.price || null,
    currency: product.currency || null,
    priceTier: product.priceTier || null,
    availability: product.availability || null,
    availabilityStatus: overrides.availabilityStatus || product.availabilityStatus || null,
    availabilityCheckedAt: overrides.offerCheckedAt || product.availabilityCheckedAt || null,
    lastPriceCheckedAt: product.lastPriceCheckedAt || null,
    specs,
    uaeCommerce: product.uaeCommerce || null,
  }
}

const rows = []
for (const page of result.moneyPages || []) {
  for (const item of page.listItems || []) {
    rows.push({
      pageType: 'topTenList',
      pageId: page._id,
      pageUpdatedAt: page._updatedAt,
      pageTitle: page.title,
      pageSlug: page.slug,
      pageUrl: `https://toptenuae.com/top-ten/${page.slug}`,
      position: item.rank,
      role: item.badgeLabel || null,
      whySelected: item.whySelected || null,
      skipIf: item.skipIf || null,
      ...compactProduct(item.product),
    })
  }
}

const decisionPage = result.decisionPage
for (const item of decisionPage?.decisionProducts || []) {
  const product = compactProduct(item.product, item)
  rows.push({
    pageType: 'buyerGuide',
    pageId: decisionPage._id,
    pageUpdatedAt: decisionPage._updatedAt,
    pageTitle: decisionPage.title,
    pageSlug: decisionPage.slug,
    pageUrl: `https://toptenuae.com/laptops/${decisionPage.slug}`,
    position: item.path || null,
    role: item.role || null,
    ctaLabel: item.ctaLabel || null,
    configuration: item.configuration || null,
    limitation: item.limitation || null,
    ...product,
  })
}

const uniqueOffers = []
const seenOffers = new Map()
for (const row of rows) {
  const key = row.asin || row.productId || `${row.pageSlug}:${row.position}`
  if (!seenOffers.has(key)) {
    const offer = {
      key,
      asin: row.asin,
      title: row.title,
      productId: row.productId,
      reviewSlug: row.reviewSlug,
      affiliateLink: row.affiliateLink,
      storedAsin: row.storedAsin,
      price: row.price,
      currency: row.currency,
      availability: row.availability,
      availabilityStatus: row.availabilityStatus,
      availabilityCheckedAt: row.availabilityCheckedAt,
      lastPriceCheckedAt: row.lastPriceCheckedAt,
      specs: row.specs,
      uaeCommerce: row.uaeCommerce,
      placements: [],
    }
    seenOffers.set(key, offer)
    uniqueOffers.push(offer)
  }
  seenOffers.get(key).placements.push({
    pageSlug: row.pageSlug,
    pageUrl: row.pageUrl,
    position: row.position,
    role: row.role,
  })
}

const payload = {
  generatedAt: new Date().toISOString(),
  pageCount: new Set(rows.map((row) => row.pageSlug)).size,
  placementCount: rows.length,
  uniqueOfferCount: uniqueOffers.length,
  rows,
  uniqueOffers,
}

if (process.argv.includes('--list')) {
  const list = uniqueOffers.map((offer) => ({
    productId: offer.productId,
    reviewSlug: offer.reviewSlug,
    asin: offer.asin,
    title: offer.title,
    status: offer.availabilityStatus,
    affiliateLink: offer.affiliateLink,
    price: offer.price,
    placements: offer.placements.map((item) => `${item.pageSlug}#${item.position}`).join(', '),
  }))
  process.stdout.write(`${JSON.stringify({
    generatedAt: payload.generatedAt,
    pageCount: payload.pageCount,
    placementCount: payload.placementCount,
    uniqueOfferCount: payload.uniqueOfferCount,
    offers: list,
  }, null, 2)}\n`)
} else {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`)
}
