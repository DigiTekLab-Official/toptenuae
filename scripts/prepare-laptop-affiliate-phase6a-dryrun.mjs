import {createClient} from '@sanity/client'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
try { process.loadEnvFile(resolve(ROOT, '.env.local')) } catch {}

export const PROJECT_ID = 'kxdjzy8e'
export const DATASET = 'production'
export const API_VERSION = '2026-09-16'
export const CHECKED_DATE = '2026-09-16'
export const REVIEWED_AT = '2026-09-16T00:00:00.000Z'
export const TAG = 'apfunbox06-21'
export const PAGE_ID = '2d7cd630-2309-4f3e-b81a-65d4b6811e00'
export const PAGE_SLUG = 'best-laptop-under-1500-aed-uae'
export const PAGE_PATH = `/top-ten/${PAGE_SLUG}`
export const CANONICAL = `https://toptenuae.com${PAGE_PATH}`
export const CURRENT_PRODUCT_ID = '9371dd41-7b2d-4a0f-80a1-88c10d9ac927'
export const CURRENT_ASIN = 'B0DCLJ9V2B'

const amazon = asin => `https://www.amazon.ae/dp/${asin}?tag=${TAG}&th=1`
const ref = (_ref, _key) => ({_type: 'reference', _ref, _key})
const span = (_key, text, marks = []) => ({_key, _type: 'span', text, marks})
const block = (_key, style, parts, extra = {}) => {
  const markDefs = []
  const children = parts.map((part, index) => {
    if (typeof part === 'string') return span(`${_key}s${index}`, part)
    const marks = [...(part.strong ? ['strong'] : [])]
    if (part.href) {
      const markKey = `${_key}link${index}`
      marks.push(markKey)
      markDefs.push({_key: markKey, _type: 'link', href: part.href, blank: false})
    }
    return span(`${_key}s${index}`, part.text, marks)
  })
  return {_key, _type: 'block', style, markDefs, children, ...extra}
}
const p = (_key, ...parts) => block(_key, 'normal', parts)
const h2 = (_key, text) => block(_key, 'h2', [text])
const bullet = (_key, ...parts) => block(_key, 'normal', parts, {listItem: 'bullet', level: 1})
const table = (_key, rows) => ({
  _key, _type: 'table', rows: rows.map((cells, index) => ({_key: `${_key}r${index}`, _type: 'tableRow', cells})),
})
const faq = (_key, question, answer) => ({_key, _type: 'faq', question, answer: [p(`${_key}a`, answer)]})
const spec = (_key, specLabel, specValue) => ({_key, _type: 'object', specLabel, specValue})
const assert = (condition, message) => { if (!condition) throw new Error(message) }

export const EVIDENCE = [
  {
    key: 'asus', id: 'topten-budget-laptop-asus-chromebook-cm3001dm2a', asin: 'B0F9LRN47N',
    title: 'ASUS Chromebook CM3001DM2A 10.5-inch Detachable', brand: 'ASUS', role: 'Portable Chromebook / note-taking',
    exactVariation: '8GB LPDDR4X | 128GB eMMC', price: 1299.99, condition: 'new', orderable: true,
    delivery: 'FREE delivery Saturday 19 September 2026; fastest Friday 18 September when checked',
    seller: 'Notebook CT', fulfilment: 'Fulfilled by Amazon', cpu: 'MediaTek Kompanio 520', ram: '8GB LPDDR4X',
    storage: '128GB eMMC', screen: '10.5-inch WUXGA touchscreen', os: 'ChromeOS',
    keyboard: 'Detachable keyboard included; keyboard layout Unverified', warranty: 'Unverified', chargerPlug: 'Unverified',
    sellerUpgraded: false,
  },
  {
    key: 'lenovo', id: 'topten-budget-laptop-lenovo-500w-gen3', asin: 'B0D2YDZWC1',
    title: 'Lenovo 500w Gen 3 11.6-inch Student 2-in-1', brand: 'Lenovo', role: 'Basic Windows student 2-in-1',
    exactVariation: '8GB RAM | 128GB SSD', price: 594, condition: 'new', orderable: true,
    delivery: 'FREE delivery Sunday 20 September 2026; fastest Friday 18 September when checked',
    seller: 'MicroBee Global', fulfilment: 'Fulfilled by Amazon', cpu: 'Intel Pentium Silver N6000', ram: '8GB',
    storage: '128GB PCIe NVMe SSD', screen: '11.6-inch HD IPS touchscreen', os: 'Windows 11 Home',
    keyboard: 'Unverified', warranty: 'Unverified', chargerPlug: 'Unverified', sellerUpgraded: false,
  },
  {
    key: 'hp', id: 'topten-budget-laptop-hp-15-athlon-7120u', asin: 'B0GQVG2Q7P',
    title: 'HP 15 Athlon Silver 7120U 15.6-inch Laptop', brand: 'HP', role: 'Full-size basic Windows — qualified inclusion',
    exactVariation: '8GB RAM | 256GB PCIe NVMe SSD', price: 1299, condition: 'new', orderable: true,
    delivery: 'FREE delivery Saturday 19 September 2026; fastest one-day delivery when checked',
    seller: 'PrimeGadgets World', fulfilment: 'Fulfilled by Amazon', cpu: 'AMD Athlon Silver 7120U', ram: '8GB',
    storage: '256GB PCIe NVMe SSD', screen: '15.6-inch HD display', os: 'Windows 11 Pro',
    keyboard: 'Full-size keyboard and numeric keypad stated; language/layout Unverified',
    warranty: 'One-year seller warranty; UAE manufacturer warranty Unverified', chargerPlug: 'Unverified', sellerUpgraded: true,
  },
]

export const CURRENT_EVIDENCE = {
  asin: CURRENT_ASIN, title: 'Lenovo Slim 3 Chromebook', exactVariation: '4GB RAM | 64GB eMMC + 64GB memory card',
  price: 1494.31, condition: 'new', orderable: true, delivery: '23–25 September 2026 when checked',
  seller: 'DesertcartAE', fulfilment: 'Ships from DesertcartAE', cpu: 'MediaTek Kompanio 520', ram: '4GB',
  storage: '64GB eMMC plus 64GB memory card', screen: '14-inch FHD touchscreen', os: 'ChromeOS',
  keyboard: 'English non-backlit keyboard stated', warranty: 'Unverified', chargerPlug: 'Unverified',
}

export const isEligibleEvidence = item => item.orderable === true && item.condition === 'new' && item.price <= 1500

const productDocument = item => ({
  _id: item.id,
  _type: 'product',
  title: item.title,
  brand: item.brand,
  asin: item.asin,
  itemDescription: `${item.role}. Exact ${item.exactVariation} Amazon.ae configuration checked on ${CHECKED_DATE}.`,
  affiliateLink: amazon(item.asin),
  price: item.price,
  currency: 'AED',
  priceTier: 'Budget',
  retailer: 'Amazon.ae',
  availability: 'https://schema.org/InStock',
  availabilityStatus: 'available',
  availabilityCheckedAt: CHECKED_DATE,
  lastPriceCheckedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  heroFeature: item.role,
  keyFeatures: [item.exactVariation, item.cpu, item.screen, item.os],
  pros: item.key === 'asus'
    ? ['8GB RAM and 128GB eMMC at the checked price', 'Detachable format for portable browser-based study']
    : item.key === 'lenovo'
      ? ['Very low checked price for a new Windows 2-in-1', '8GB RAM and 128GB SSD']
      : ['Full-size 15.6-inch format', '256GB PCIe NVMe SSD and Windows 11 Pro'],
  cons: item.key === 'asus'
    ? ['ChromeOS cannot run desktop Windows applications', 'Small 10.5-inch display; keyboard layout, warranty and plug are unverified']
    : item.key === 'lenovo'
      ? ['Entry-level processor and small HD display', 'Keyboard, warranty and plug are unverified']
      : ['Entry-level Athlon processor and HD display', 'Seller-upgraded with seller warranty; keyboard layout and plug are unverified'],
  verdict: item.key === 'asus'
    ? 'The strongest portable Chromebook value in this checked set for browser and web-based study, provided the buyer does not need Windows-only course software.'
    : item.key === 'lenovo'
      ? 'A basic Windows option for light documents, browsing and web learning; not positioned for strong multitasking or demanding courses.'
      : 'A qualified basic-use choice for buyers who want a full-size Windows laptop; it is not a high-performance recommendation.',
  specifications: [
    spec(`${item.key}spec1`, 'Processor', item.cpu),
    spec(`${item.key}spec2`, 'Memory', item.ram),
    spec(`${item.key}spec3`, 'Storage', item.storage),
    spec(`${item.key}spec4`, 'Display', item.screen),
    spec(`${item.key}spec5`, 'Operating system', item.os),
    spec(`${item.key}spec6`, 'Exact checked variation', item.exactVariation),
  ],
  uaeCommerce: {
    _type: 'uaeCommerceContext',
    availableInUae: true,
    availabilityNote: `New exact Amazon.ae ASIN ${item.asin} was orderable on ${CHECKED_DATE}; sold by ${item.seller}.${item.sellerUpgraded ? ' The listing describes this as a seller-upgraded configuration.' : ''}`,
    shippingNote: `${item.fulfilment}. ${item.delivery}. Confirm the live delivery date, returns and total checkout cost for the selected UAE address.`,
    warrantyNote: item.warranty === 'Unverified' ? 'Specific UAE manufacturer and seller warranty: Unverified. Optional protection-plan advertising is not proof of manufacturer warranty.' : item.warranty,
    voltageOrCompatibility: `${item.keyboard}. Included charger and UAE Type-G plug: ${item.chargerPlug}. Confirm both before ordering.`,
  },
})

export const PRODUCTS = EVIDENCE.map(productDocument)

export const LIST_ITEMS = [
  {
    _key: 'budget1500asus', _type: 'item', rank: 1, badgeLabel: 'Best portable Chromebook value',
    whySelected: 'The checked 8GB/128GB detachable offer costs AED 194.32 less than the current Lenovo Chromebook while doubling both RAM and built-in storage.',
    skipIf: 'Skip it if you need desktop Windows applications, a larger screen, or course software that has not been confirmed for ChromeOS.',
    product: ref(EVIDENCE[0].id, 'budget1500asusproduct'),
  },
  {
    _key: 'budget1500lenovo', _type: 'item', rank: 2, badgeLabel: 'Best low-cost basic Windows 2-in-1',
    whySelected: 'It provides Windows 11, 8GB RAM, a 128GB SSD and touch input at the lowest checked new-product price in the shortlist.',
    skipIf: 'Skip it for heavy multitasking, demanding university software or buyers who need a larger display.',
    product: ref(EVIDENCE[1].id, 'budget1500lenovoproduct'),
  },
  {
    _key: 'budget1500hp', _type: 'item', rank: 3, badgeLabel: 'Qualified full-size basic Windows option',
    whySelected: 'The checked seller-upgraded configuration provides 8GB RAM, 256GB SSD storage, Windows 11 Pro and a 15.6-inch screen within the cap.',
    skipIf: 'Skip it if you expect high performance, a higher-resolution display, a factory-sealed configuration or verified UAE manufacturer warranty.',
    product: ref(EVIDENCE[2].id, 'budget1500hpproduct'),
  },
]

export const PAGE_UPDATE = {
  title: 'Best Laptop Under 1500 AED in UAE (2026): 3 Verified Picks',
  intro: 'New-laptop choice below AED 1,500 is narrow in the UAE. These three exact Amazon.ae offers were orderable within the cap on 16 September 2026: an ASUS detachable Chromebook for browser-based study, a Lenovo 500w for basic Windows work, and a qualified full-size HP 15 option. Each has material compromises, so confirm software, keyboard, warranty and charger requirements before paying.',
  keyTakeaways: [
    'Three new products—and no renewed or used products—passed the exact-offer and AED 1,500 gates on 16 September 2026.',
    'The ASUS offers the strongest portable Chromebook value, but ChromeOS is not a substitute for Windows-only university software.',
    'The Lenovo and HP are basic Windows choices; neither is positioned for demanding workloads or strong multitasking.',
    'Recheck the exact ASIN, selected variation, seller, fulfilment, keyboard, warranty, charger and checkout total before ordering.',
  ],
  listItems: LIST_ITEMS,
  body: [
    h2('budget1500quickh', 'Quick answer: three verified new options under AED 1,500'),
    p('budget1500quickp', 'Choose the ASUS Chromebook for portable browser-based study and note-taking, the Lenovo 500w when basic Windows compatibility and touch input matter most, or the HP 15 when a full-size Windows format is the priority. These are qualified choices within a strict cap, not claims that they are the three best laptops at every budget.'),
    h2('budget1500compareh', 'Comparison of the checked configurations'),
    table('budget1500comparetable', [
      ['Product', 'Role', 'OS', 'RAM', 'Storage', 'Display', 'Best for', 'Main limitation', 'Offer check'],
      ['ASUS CM3001DM2A', 'Portable detachable', 'ChromeOS', '8GB', '128GB eMMC', '10.5-inch WUXGA touch', 'Browser-based study and notes', 'Small screen; no desktop Windows apps', 'AED 1,299.99; orderable 16 Sep'],
      ['Lenovo 500w Gen 3', 'Basic Windows 2-in-1', 'Windows 11 Home', '8GB', '128GB SSD', '11.6-inch HD touch', 'Light documents and web learning', 'Entry-level CPU; small display', 'AED 594; orderable 16 Sep'],
      ['HP 15', 'Full-size basic Windows', 'Windows 11 Pro', '8GB', '256GB SSD', '15.6-inch HD', 'Basic desk-based work', 'Entry-level CPU; seller-upgraded', 'AED 1,299; orderable 16 Sep'],
    ]),
    h2('budget1500chromebookh', 'ASUS Chromebook: portable, but verify course software'),
    p('budget1500chromebookp', 'The ASUS is the strongest portable Chromebook value in this checked set: 8GB RAM, 128GB eMMC and a detachable 10.5-inch touchscreen at AED 1,299.99. It suits browser research, Google Workspace and web-based study. ChromeOS does not provide desktop Windows applications, so verify university, exam, coding and specialist software before buying. The small screen is also a real trade-off.'),
    h2('budget1500lenovoh', 'Lenovo 500w: basic Windows only'),
    p('budget1500lenovop', 'The Lenovo combines an entry-level Pentium Silver N6000, 8GB RAM, 128GB SSD, 11.6-inch HD touchscreen and Windows 11 Home. It is suitable for light documents, browsing and web learning—not strong multitasking or demanding-course workloads. Keyboard, warranty and charger or plug details were Unverified.'),
    h2('budget1500hph', 'HP 15: qualified full-size inclusion'),
    p('budget1500hpp', 'The HP 15 has an entry-level Athlon Silver 7120U, 8GB RAM, 256GB SSD, 15.6-inch HD display and Windows 11 Pro. It is included as a qualified basic-use option, not a high-performance or exceptional-value claim. The listing says the configuration is seller-upgraded and provides a one-year seller warranty; do not assume UAE manufacturer warranty. Keyboard language or layout and charger or plug details were Unverified.'),
    h2('budget1500newh', 'New products only'),
    p('budget1500newp', 'This ranking contains three new products, zero renewed products and zero used products. Renewed laptops can offer stronger specifications at this budget, but their condition, battery health and warranty require a separate evaluation and they are outside this shortlist.'),
    h2('budget1500increaseh', 'When to Increase Your Budget'),
    p('budget1500increasep', 'Move above AED 1,500 when you need a stronger processor, more comfortable display, heavier multitasking, demanding course software or clearer warranty support. Compare the ', {text: 'general UAE laptop shortlist', href: '/top-ten/best-laptops-uae'}, ', the ', {text: 'student laptop guide', href: '/top-ten/best-laptops-for-students-uae'}, ', or the ', {text: 'business and office laptop guide', href: '/top-ten/best-business-laptops-uae'}, ' for role-specific choices. If you are still choosing specifications, use the ', {text: 'UAE laptop buying guide', href: '/laptops/how-to-choose-a-laptop-in-uae'}, '.'),
    h2('budget1500checksh', 'UAE checkout checks'),
    bullet('budget1500check1', 'Open the exact ASIN and confirm the selected RAM, storage, processor, display and operating system.'),
    bullet('budget1500check2', 'Recheck price and stock; 16 September 2026 is a dated snapshot, not a guarantee.'),
    bullet('budget1500check3', 'Confirm seller, fulfilment, returns, keyboard language or layout, charger and UAE Type-G plug.'),
    bullet('budget1500check4', 'Identify whether warranty is provided by the manufacturer or seller and how UAE service would work.'),
  ],
  closingContent: [
    h2('budget1500finalh', 'Final decision'),
    p('budget1500finalp', 'Keep the strict cap only if one of these limited roles matches your actual workload. The ASUS is the best Chromebook value of the checked options, the Lenovo is the cheapest basic Windows path, and the HP is the full-size basic Windows alternative. If the compromises conflict with required software or daily comfort, increase the budget instead of buying the wrong platform or configuration.'),
  ],
  whoItsFor: 'UAE buyers who need a new laptop at or below AED 1,500 for browser-based study, light documents, web learning or basic home and office tasks.',
  whoShouldAvoid: 'Buyers who need demanding engineering, creative, gaming, virtual-machine or heavy multitasking performance, or guaranteed UAE manufacturer warranty, should increase the budget.',
  methodology: [
    p('budget1500method1', 'TopTenUAE opened each exact Amazon.ae ASIN on 16 September 2026 and recorded the selected variation, price, orderability, delivery, seller, fulfilment, condition and stated configuration. Coupon-only, payment-method and different-variation prices were not used.'),
    p('budget1500method2', 'TopTenUAE did not conduct hands-on benchmarks, battery tests or durability tests. Roles and limitations are configuration-based editorial judgments. Missing keyboard, warranty and charger or plug information remains Unverified.'),
  ],
  uaeContext: [p('budget1500uae1', 'Amazon.ae marketplace details can change by seller and selected variation. Confirm the exact ASIN, configuration, condition, seller, fulfilment, return terms, keyboard, charger, plug and actual warranty provider before payment.')],
  sources: EVIDENCE.map(item => ({
    _key: `budget1500amazon${item.key}`, _type: 'source', title: `${item.title} exact Amazon.ae offer — ASIN ${item.asin}`,
    publisher: 'Amazon.ae', url: amazon(item.asin), accessedAt: CHECKED_DATE,
  })),
  affiliateDisclosure: 'TopTenUAE may earn a commission from qualifying Amazon.ae purchases. Rankings are editorial and are not determined by commission, temporary pricing or stock urgency.',
  showAffiliateDisclosure: true,
  faqs: [
    faq('budget1500faq1', 'What is the best laptop under AED 1,500 in the UAE?', 'For portable browser-based study, the ASUS Chromebook is the strongest value in this checked set. Choose the Lenovo 500w for basic Windows compatibility or the HP 15 for a full-size basic Windows format. The right choice depends on required software and screen size.'),
    faq('budget1500faq2', 'Can a Chromebook run Windows university software?', 'No. ChromeOS does not provide desktop Windows applications. Some web or Android alternatives may exist, but confirm every required course, exam, coding and specialist application before buying.'),
    faq('budget1500faq3', 'Is the Lenovo 500w suitable for demanding study?', 'It is positioned only for basic documents, browsing and web learning. Its Pentium Silver N6000 is entry-level, and buyers should not assume it suits demanding engineering, creative, data or virtual-machine workloads.'),
    faq('budget1500faq4', 'Why is the HP 15 only a qualified recommendation?', 'Its 8GB RAM, 256GB SSD and full-size format fit basic use, but the Athlon processor and HD display are entry-level. The checked configuration is seller-upgraded and has seller warranty rather than verified UAE manufacturer warranty.'),
    faq('budget1500faq5', 'Are renewed laptops included?', 'No. This shortlist contains three new products and no renewed or used products. Renewed devices require a separate condition, battery and warranty assessment.'),
  ],
  lastReviewedAt: REVIEWED_AT,
  seo: {
    _type: 'seo',
    metaTitle: 'Best Laptop Under 1500 AED UAE: 3 Verified Picks',
    metaDescription: 'Compare three verified new laptops under AED 1,500 in the UAE: an ASUS Chromebook, Lenovo Windows 2-in-1 and qualified HP 15 option.',
    keywords: ['best laptop under 1500 AED UAE', 'laptop under 1500 AED', 'cheap laptop UAE', 'budget laptop UAE'],
    canonicalUrl: CANONICAL,
    noIndex: false,
    schemaType: 'ItemList',
  },
}

export function buildDryRunPlan(state) {
  assert(state?.page?._id === PAGE_ID, 'Target production page is missing')
  assert(state.page.slug?.current === PAGE_SLUG, 'Established slug changed; stop')
  assert(state.page._rev, 'Target page revision is missing')
  assert(Array.isArray(state.candidateDocuments) && state.candidateDocuments.length === 0, 'A candidate ASIN or proposed product ID already exists; stop for collision review')
  assert(state.currentProduct?.asin === CURRENT_ASIN, 'Current product ASIN could not be confirmed')
  const mutations = [
    ...PRODUCTS.map(document => ({create: document})),
    {patch: {id: PAGE_ID, ifRevisionID: state.page._rev, set: PAGE_UPDATE}},
  ]
  const plan = {
    mode: 'dry-run', projectId: PROJECT_ID, dataset: DATASET, checkedDate: CHECKED_DATE,
    preconditions: {pageRevision: state.page._rev, candidateDocumentsAbsent: true, currentAsin: CURRENT_ASIN},
    mutations,
  }
  validateDryRunPlan(plan)
  return plan
}

export function validateDryRunPlan(plan) {
  assert(TAG === 'apfunbox06-21', 'Approved Amazon tag changed')
  assert(EVIDENCE.length === 3 && PRODUCTS.length === 3 && LIST_ITEMS.length === 3, 'Exactly three candidates are required')
  assert(EVIDENCE.every(isEligibleEvidence), 'Candidate no longer qualifies — do not publish')
  assert(EVIDENCE.every(item => item.condition === 'new'), 'Renewed or used product detected')
  assert(new Set(EVIDENCE.map(item => item.asin)).size === 3, 'Duplicate candidate ASIN')
  assert(!LIST_ITEMS.some(item => item.product?._ref === CURRENT_PRODUCT_ID), 'Current product remains in active shortlist')
  assert(plan.mutations.length === 4, 'Transaction must affect exactly four documents')
  assert(plan.mutations.filter(item => item.create).length === 3, 'Expected three product creates')
  assert(plan.mutations.filter(item => item.patch).length === 1, 'Expected one page patch')
  assert(plan.mutations.every(item => item.create || item.patch?.id === PAGE_ID), 'Unrelated mutation detected')
  for (const product of PRODUCTS) {
    assert(product._type === 'product' && !('slug' in product), `Product review route must not be created: ${product._id}`)
    assert(product.availabilityStatus === 'available' && product.uaeCommerce?.availableInUae === true, `Unavailable product exposed: ${product._id}`)
    assert(product.price <= 1500, `Price cap exceeded: ${product._id}`)
    const url = new URL(product.affiliateLink)
    assert(url.hostname === 'www.amazon.ae', `Malformed Amazon host: ${product._id}`)
    assert(url.pathname === `/dp/${product.asin}`, `Amazon ASIN mismatch: ${product._id}`)
    assert(url.searchParams.get('tag') === TAG && url.searchParams.get('th') === '1', `Affiliate metadata mismatch: ${product._id}`)
  }
  assert(PAGE_UPDATE.seo.canonicalUrl === CANONICAL && PAGE_UPDATE.seo.noIndex === false, 'Indexability or canonical mismatch')
  assert(PAGE_UPDATE.seo.schemaType === 'ItemList' && PAGE_UPDATE.faqs.length > 0, 'ItemList/FAQ preparation missing')
  return true
}

export function createExpectedAffiliatePayload(product, position) {
  return {
    event: 'affiliate_click', affiliate_network: 'amazon_ae', page_path: PAGE_PATH,
    affiliate_product: product.title, affiliate_cta: 'product_card', affiliate_destination: product.affiliateLink,
    affiliate_category: 'laptops-general', affiliate_position: String(position), affiliate_tracking_id: TAG,
  }
}

async function main() {
  const mode = process.argv.find(arg => arg.startsWith('--'))
  assert(mode === '--plan', 'DRY RUN ONLY — use --plan; no Sanity write is permitted')
  assert(process.env.AMAZON_PARTNER_TAG === TAG, `Set AMAZON_PARTNER_TAG=${TAG}`)
  const client = createClient({projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: false, perspective: 'published'})
  const state = await client.fetch(`{
    "page": *[_id == $pageId][0]{_id,_rev,slug,title,listItems[]{rank,product->{_id,asin}}},
    "currentProduct": *[_id == $currentProductId][0]{_id,asin},
    "candidateDocuments": *[_id in $candidateIds || asin in $candidateAsins]{_id,asin}
  }`, {
    pageId: PAGE_ID,
    currentProductId: CURRENT_PRODUCT_ID,
    candidateIds: PRODUCTS.map(product => product._id),
    candidateAsins: PRODUCTS.map(product => product.asin),
  })
  const plan = buildDryRunPlan(state)
  console.log(JSON.stringify(plan, null, 2))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1 })
}
