import {createClient} from '@sanity/client'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
try { process.loadEnvFile(resolve(ROOT, '.env.local')) } catch {}

const PROJECT_ID = 'kxdjzy8e'
const DATASET = 'production'
const API_VERSION = '2026-09-16'
const CHECKED_DATE = '2026-09-16'
const REVIEWED_AT = '2026-09-16T00:00:00.000Z'
const PAGE_ID = 'topten-best-business-laptops-uae'
const GENERAL_ID = 'ec4a75a5-8acf-4103-bf86-3a040477e0d7'
const STUDENT_ID = 'topten-best-laptops-for-students-uae'
const GAMING_ID = 'topten-best-gaming-laptops-uae'
const AI_ID = 'ccef5038-23f4-4cf1-9b3b-2fc34a217c04'
const BUYING_GUIDE_ID = 'buyer-guide-how-to-choose-laptop-uae'
const PLATFORM_ID = 'buyer-guide-windows-laptop-vs-macbook-uae'
const AUTHOR_ID = '059ea742-ef28-47ce-a2f7-97f71ece3fa1'
const CATEGORY_ID = '4bb228fd-41d6-401c-ae08-469e40084bca'
const IMAGE_REF = 'image-6a37625c2bd09efef96ad14a7994788831cb0521-1920x1080-webp'

const products = {
  thinkpad: {id: 'abf7eeb0-f82f-46b2-b3c9-0cc77bf5bcdc', asin: 'B0DNQFK6B9', price: 4959},
  vivobook: {id: 'c5f619e8-3efa-45b3-832f-e3e66ab3c920', asin: 'B0FHHJW4NP', price: 2299},
  xps: {id: 'topten-ai-laptop-dell-xps-13-9350-ultra-7-256v', asin: 'B0HCNMTX4F', price: 5399},
  yoga: {id: 'b1692b2a-b273-42d8-af7b-b39eba1cb623', asin: 'B0FM3F1SGH', price: 3639},
  surface: {id: '1b91e5bc-9f50-4100-9688-9891adbd0a7b', asin: 'B0DZBMVVLT', price: 3599},
}

const partnerTag = process.env.AMAZON_PARTNER_TAG || ''
const amazon = asin => `https://www.amazon.ae/dp/${asin}?tag=${encodeURIComponent(partnerTag)}&th=1`
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
const table = (_key, rows) => ({_key, _type: 'table', rows: rows.map((cells, index) => ({_key: `${_key}r${index}`, _type: 'tableRow', cells}))})
const faq = (_key, question, answer) => ({_key, _type: 'faq', question, answer: [p(`${_key}a`, answer)]})
const assert = (condition, message) => { if (!condition) throw new Error(message) }

const offer = ({product, seller, fulfilment, keyboard, warranty, compatibility, sellerUpgraded}) => ({
  asin: product.asin,
  affiliateLink: amazon(product.asin),
  price: product.price,
  currency: 'AED',
  retailer: 'Amazon.ae',
  availability: 'https://schema.org/InStock',
  availabilityStatus: 'available',
  availabilityCheckedAt: CHECKED_DATE,
  lastPriceCheckedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  uaeCommerce: {
    _type: 'uaeCommerceContext', availableInUae: true,
    availabilityNote: `Exact Amazon.ae ASIN ${product.asin} was orderable on ${CHECKED_DATE}; sold by ${seller}.${sellerUpgraded ? ' The offer described the configuration as seller-upgraded.' : ''}`,
    shippingNote: `${fulfilment} Confirm delivery, returns and total delivered cost for the selected UAE address.`,
    warrantyNote: warranty,
    voltageOrCompatibility: `${keyboard} ${compatibility} The included UAE Type-G power lead was not established; confirm the charger and plug before ordering.`,
  },
})

const productUpdates = {
  [products.thinkpad.id]: offer({product: products.thinkpad, seller: 'ByteHub Traders', fulfilment: 'Fulfilled by Amazon when checked.', keyboard: 'The product description stated an English backlit keyboard.', warranty: 'The offer stated a one-year seller warranty and an opened seal for the upgrade; confirm covered parts and the service route.', compatibility: 'Windows 11 Pro was stated.', sellerUpgraded: true}),
  [products.vivobook.id]: offer({product: products.vivobook, seller: 'Notebook Zone', fulfilment: 'Delivered by Amazon.ae when checked.', keyboard: 'Keyboard language was not established.', warranty: 'The offer stated a one-year seller warranty and an opened seal for the upgrade; its description also referenced US ASUS support, so do not assume UAE manufacturer coverage.', compatibility: 'Windows 11 Pro was stated.', sellerUpgraded: true}),
  [products.xps.id]: offer({product: products.xps, seller: 'TECH-OFFER', fulfilment: 'Fulfilled by Amazon when checked.', keyboard: 'The exact title stated an English keyboard.', warranty: 'A specific UAE manufacturer or seller warranty was not established; optional protection-plan advertising is not manufacturer warranty.', compatibility: 'Windows 11 Home and conventional x86-64 Intel architecture were stated.', sellerUpgraded: false}),
  [products.yoga.id]: offer({product: products.yoga, seller: 'Byte Mart UAE', fulfilment: 'Delivered by Amazon.ae when checked.', keyboard: 'A backlit keyboard was stated, but its language was not established.', warranty: 'The offer stated a one-year seller warranty and an opened seal for the upgrade; confirm covered parts and the service route.', compatibility: 'Windows 11 Home was stated.', sellerUpgraded: true}),
  [products.surface.id]: offer({product: products.surface, seller: 'TechFlip By CompuLogic', fulfilment: 'Fulfilled by Amazon when checked.', keyboard: 'Keyboard language was not established.', warranty: 'The offer stated a one-year seller warranty and described the unit as upgraded; confirm covered parts and the service route.', compatibility: 'This is Windows on Arm: verify VPN, security agents, drivers, peripherals and specialist applications before ordering.', sellerUpgraded: true}),
}

const listItems = [
  ['business-thinkpad', 1, 'Best overall business laptop', products.thinkpad.id, 'The 32GB/1TB Windows 11 Pro offer, 16:10 display, Ethernet and broad ports make it the strongest office multitasker in this verified set.', 'It is a 1.81kg seller-upgraded configuration with seller warranty, not a sealed premium mobile workstation.'],
  ['business-vivobook', 2, 'Best value office laptop', products.vivobook.id, 'A Core i5, 16GB/512GB and Windows 11 Pro cover ordinary Office, browser, email and Teams work at the lowest checked price in this shortlist.', 'The 720p camera, Wi-Fi 5, seller-opened upgrade and seller warranty are compromises; keyboard language was not verified.'],
  ['business-xps', 3, 'Best premium travel laptop', products.xps.id, 'The 13.4-inch x86 laptop combines 16GB/1TB, an English keyboard and a light Dell-specified starting weight for frequent travel.', 'Two USB-C/Thunderbolt ports can require a dock, memory is integrated, and UAE manufacturer warranty was not established.'],
  ['business-yoga', 4, 'Best 2-in-1 for productivity', products.yoga.id, 'The 16-inch touchscreen, 16GB/1TB configuration and 360-degree hinge suit presentations, shared viewing and desk-based productivity.', 'At about 1.99kg it is less travel-friendly, memory is soldered, and the offer is seller-upgraded with seller warranty.'],
  ['business-surface', 5, 'Best Windows-on-Arm travel option', products.surface.id, 'The compact 13-inch touchscreen and Microsoft-specified 1.22kg starting weight suit mobile work when every required application is compatible.', 'The 256GB SSD is restrictive and Windows-on-Arm requires explicit VPN, security-agent, driver and specialist-software checks.'],
].map(([_key, rank, badgeLabel, productId, whySelected, skipIf]) => ({_key, _type: 'listItem', rank, badgeLabel, whySelected, skipIf, product: ref(productId, `${_key}-product`)}))

const body = [
  h2('businessdecisionh', 'Choose by the work you actually do'),
  table('businessdecisiontable', [
    ['Work pattern', 'Practical starting point', 'Best-fit path here'],
    ['Word, PowerPoint, email, browser and normal spreadsheets', '16GB RAM and 512GB SSD', 'Vivobook 14'],
    ['Large workbooks, many tabs, Teams and multiple apps', '32GB RAM and 1TB SSD when the workload justifies it', 'ThinkPad E16'],
    ['Frequent travel with conventional Windows compatibility', 'Compact x86 laptop; check ports and dock needs', 'Dell XPS 13'],
    ['Presentations, touch and flexible desk use', 'Large touchscreen 2-in-1', 'Yoga 7i'],
    ['Maximum mobility with Windows on Arm', 'Verify every company tool first', 'Surface Laptop 13'],
  ]),
  h2('businesscompareh', 'Business laptop comparison'),
  table('businesscompare', [
    ['Laptop', 'Exact configuration', 'Business role', 'Main limitation'],
    ['ThinkPad E16 Gen 2', 'Core Ultra 7 155H / 32GB / 1TB / 16-inch WUXGA / Windows 11 Pro', 'Heavy office multitasking and docking', 'Seller-upgraded; 1.81kg starting weight'],
    ['Vivobook 14 X1404VA', 'Core i5-1334U / 16GB / 512GB / 14-inch FHD / Windows 11 Pro', 'Value office work', '720p camera; Wi-Fi 5; seller-upgraded'],
    ['Dell XPS 13 9350', 'Core Ultra 7 256V / 16GB / 1TB / 13.4-inch FHD+ / Windows 11 Home', 'Premium x86 travel', 'Two USB-C ports; integrated memory'],
    ['Yoga 7i 16IML9', 'Core Ultra 7 155U / 16GB / 1TB / 16-inch touch / Windows 11 Home', '2-in-1 presentations and desk work', 'About 1.99kg; seller-upgraded'],
    ['Surface Laptop 13', 'Snapdragon X Plus / 16GB / 256GB / 13-inch touch / Windows 11 Home', 'Arm-based mobile work', 'Compatibility check and limited storage'],
  ]),
  h2('businessexcelh', 'Excel and Microsoft 365: standard work versus heavier multitasking'),
  p('businessexcelp1', 'Word, PowerPoint, Outlook, browser work and ordinary spreadsheets do not require a premium processor badge. The Vivobook’s 16GB/512GB configuration is the value path here. For large workbooks, many simultaneous applications or heavier data work, the ThinkPad’s 32GB/1TB configuration provides more memory and storage headroom. This is practical configuration guidance, not a benchmark claim.'),
  p('businessexcelp2', 'Confirm add-ins, macros, accounting software, database connectors and company management tools before choosing macOS or Windows on Arm. The ', {text: 'Windows laptop vs MacBook decision guide', href: '/laptops/windows-laptop-vs-macbook-uae'}, ' covers the platform choice in more detail.'),
  h2('businessmeetingsh', 'Teams, video meetings and external displays'),
  p('businessmeetingsp', 'Check the exact webcam, microphones, speakers, ports and dock support rather than assuming every premium laptop is meeting-ready. The ThinkPad offer states a 1080p IR camera, privacy shutter and dual-array microphones; the Vivobook states a 720p camera. External-monitor support depends on the selected port, cable, dock and display resolution.'),
  h2('businesstravelh', 'Business travel and service risk'),
  p('businesstravelp', 'Compare the laptop and charger together, then check ports, keyboard language, return terms and who provides warranty service. Dell specifies the XPS platform from about 1.17kg and Microsoft specifies the Surface from about 1.22kg; those are manufacturer starting weights, not measurements of these marketplace packages. Seller-upgraded ThinkPad, Vivobook, Yoga and Surface offers require extra scrutiny.'),
  h2('businesssecurityh', 'Security and serviceability'),
  p('businesssecurityp', 'Windows edition, firmware features, fingerprint or IR sign-in and physical lock support can matter, but a consumer marketplace offer should not be called enterprise-certified without evidence. The ThinkPad description states firmware TPM 2.0, a fingerprint reader and Kensington slot. Confirm company management, encryption and support requirements with IT before purchase.'),
  h2('businessarmh', 'Windows on Arm: check the complete company workflow'),
  p('businessarmp', 'The Surface is included only as a conditional mobility option. Before buying, confirm the organisation’s VPN, endpoint security, printer and scanner drivers, accounting tools, browser extensions, meeting software and specialist applications. Emulation does not replace an Arm-compatible driver. Use the ', {text: 'platform compatibility guide', href: '/laptops/windows-laptop-vs-macbook-uae'}, ' for the detailed check.'),
  h2('businessmoreh', 'Other laptop paths'),
  p('businessmorep', 'Use the ', {text: 'general laptop shortlist', href: '/top-ten/best-laptops-uae'}, ' for broad home, study and work choices, the ', {text: 'student guide', href: '/top-ten/best-laptops-for-students-uae'}, ' for course-led decisions, the ', {text: 'gaming guide', href: '/top-ten/best-gaming-laptops-uae'}, ' for dedicated-GPU gaming, the ', {text: 'AI laptop guide', href: '/top-ten/best-ai-laptops-uae'}, ' for NPU-led comparisons, or the ', {text: 'complete laptop buying guide', href: '/laptops/how-to-choose-a-laptop-in-uae'}, ' for specification education.'),
]

const faqs = [
  faq('businessfaq1', 'What is the best business laptop in UAE?', 'The ThinkPad E16 Gen 2 is the best overall fit in this verified shortlist for buyers who value 32GB memory, 1TB storage, Windows 11 Pro, Ethernet and broad connectivity. Buyers prioritising low weight or value should choose a different role.'),
  faq('businessfaq2', 'How much RAM does an office laptop need?', 'Sixteen gigabytes is a practical starting point for Office, browser, email and meetings. Thirty-two gigabytes can help when large workbooks, many tabs, virtual machines or several heavier applications run together. Application requirements override this guidance.'),
  faq('businessfaq3', 'Which laptop is best for heavy Excel work?', 'The ThinkPad is the heavy-multitasking choice here because the checked offer has 32GB RAM and 1TB storage. No claim is made that it is the fastest Excel laptop; workbook design, add-ins, data connections and processor behaviour also matter.'),
  faq('businessfaq4', 'Is Windows on Arm suitable for business?', 'It can suit compatible Microsoft 365, browser and meeting workflows, but buyers must verify VPN, security agents, drivers, peripherals and specialist software. Do not assume emulation solves driver requirements.'),
  faq('businessfaq5', 'What should UAE buyers check before ordering a work laptop?', 'Recheck the exact ASIN and configuration, seller and fulfilment, keyboard language, charger or Type-G lead, returns, whether the seal was opened for upgrades, and whether warranty is manufacturer, international or seller-provided.'),
]

const page = {
  _id: PAGE_ID, _type: 'topTenList',
  title: 'Best Business and Office Laptops in UAE (2026)',
  slug: {_type: 'slug', current: 'best-business-laptops-uae'},
  reviewSection: 'tech',
  intro: 'For most UAE professionals, buy for the actual workflow: choose the ThinkPad E16 for heavier multitasking and ports, the Vivobook 14 for value office work, the XPS 13 for premium x86 travel, the Yoga 7i for 2-in-1 productivity, or the Surface Laptop only after a Windows-on-Arm compatibility check.',
  body,
  listItems,
  keyTakeaways: ['Five exact Amazon.ae offers were orderable on 16 September 2026.', 'Sixteen gigabytes suits standard office work; 32GB is the heavier-multitasking path here.', 'Seller-upgraded configurations and seller warranties require explicit checkout verification.', 'Windows-on-Arm buyers must verify the complete company workflow.'],
  whoItsFor: 'Individual UAE professionals, SME owners and office buyers choosing a laptop for Microsoft 365, Excel, Teams, browser-heavy work, home offices, travel and external displays.',
  whoShouldAvoid: 'Large organisations running a formal procurement process should use their IT standards, fleet management, support and approved-supplier requirements instead of this individual-buyer shortlist.',
  methodology: [p('businessmethod1', 'TopTenUAE compared current UAE search-result patterns, official specifications, existing product reviews and five exact Amazon.ae offers. Seller, fulfilment, configuration and orderability were checked on 16 September 2026.'), p('businessmethod2', 'TopTenUAE did not perform hands-on benchmarks, battery rundowns, webcam tests, durability tests or repairability tests. Roles are configuration- and workflow-based editorial judgments.')],
  uaeContext: [p('businessuae1', 'Amazon.ae marketplace offers can be imported or seller-upgraded. Confirm the selected variation, seller, fulfilment, keyboard, charger, returns and actual warranty provider before paying.')],
  sources: [
    {_key: 'businesssrcmiddleware', _type: 'source', title: 'How to choose a business laptop in the UAE', publisher: 'Middleware UAE', url: 'https://middleware.ae/blog/how-to-choose-a-business-laptop-in-the-uae-thinkpad-vs-elitebook-vs-latitude', accessedAt: CHECKED_DATE},
    {_key: 'businesssrcgulf', _type: 'source', title: 'Best Business Laptops in UAE for Office, Remote Work & Travel', publisher: 'Gulf Micro Systems', url: 'https://www.gulfmicro.ae/blogs/posts/best-business-laptops-in-uae', accessedAt: CHECKED_DATE},
    ...Object.entries(products).map(([key, product]) => ({_key: `businessamazon${key}`, _type: 'source', title: `${key} exact Amazon.ae offer — ASIN ${product.asin}`, publisher: 'Amazon.ae', url: amazon(product.asin), accessedAt: CHECKED_DATE})),
  ],
  affiliateDisclosure: 'TopTenUAE may earn a commission from qualifying Amazon.ae purchases. Rankings are editorial and are not determined by commission, temporary pricing or stock urgency.',
  showAffiliateDisclosure: true,
  faqs,
  relatedBuyerGuide: ref(BUYING_GUIDE_ID, 'business-buying-guide'),
  relatedContent: [ref(GENERAL_ID, 'business-related-general'), ref(STUDENT_ID, 'business-related-student'), ref(GAMING_ID, 'business-related-gaming'), ref(AI_ID, 'business-related-ai'), ref(PLATFORM_ID, 'business-related-platform')],
  mainImage: {_type: 'image', asset: {_type: 'reference', _ref: IMAGE_REF}, alt: 'Business and office laptops for UAE professionals'},
  author: {_type: 'reference', _ref: AUTHOR_ID},
  categories: [ref(CATEGORY_ID, 'business-laptops-category')],
  publishedAt: REVIEWED_AT, originalPublishedAt: REVIEWED_AT, lastReviewedAt: REVIEWED_AT,
  seo: {_type: 'seo', metaTitle: 'Best Business & Office Laptops UAE: 2026 Picks', metaDescription: 'Compare five business and office laptops in the UAE for Excel, Teams, travel and multitasking, with exact Amazon.ae offer checks.', keywords: ['best business laptop UAE', 'best business laptops UAE', 'best laptop for office work UAE', 'best laptop for work UAE', 'business laptop Dubai'], canonicalUrl: 'https://toptenuae.com/top-ten/best-business-laptops-uae', noIndex: false, schemaType: 'ItemList'},
}

const appendRelated = (doc, key) => {
  const current = Array.isArray(doc.relatedContent) ? doc.relatedContent : []
  return current.some(item => item?._ref === PAGE_ID) ? current : [...current, ref(PAGE_ID, key)]
}
const appendBodyLink = (doc, key, text) => {
  const exists = (doc.body || []).some(item => item?._type === 'block' && (item.markDefs || []).some(mark => mark.href === '/top-ten/best-business-laptops-uae'))
  return exists ? doc.body : [...(doc.body || []), p(key, text, {text: 'business and office laptop shortlist', href: '/top-ten/best-business-laptops-uae'}, '.')]
}

async function verify(client) {
  const result = await client.fetch(`*[_id == $id][0]{_id,title,"slug":slug.current,seo,"faqCount":count(faqs),"bodyLinks":body[].markDefs[].href,listItems[]{rank,badgeLabel,product->{_id,title,asin,affiliateLink,availabilityStatus,availabilityCheckedAt,"slug":slug.current}}}`, {id: PAGE_ID})
  assert(result?.slug === 'best-business-laptops-uae', 'Business page missing')
  assert(result.listItems?.length === 5, 'Expected five products')
  assert(result.faqCount === 5, 'Expected five visible FAQs')
  assert(result.seo?.canonicalUrl === 'https://toptenuae.com/top-ten/best-business-laptops-uae' && result.seo.noIndex === false && result.seo.schemaType === 'ItemList', 'SEO configuration mismatch')
  for (const item of result.listItems) {
    assert(item.product.availabilityStatus === 'available', `${item.product.title} is not active`)
    const url = new URL(item.product.affiliateLink)
    assert(url.hostname === 'www.amazon.ae' && url.pathname === `/dp/${item.product.asin}` && url.searchParams.get('tag') === partnerTag, `Offer mismatch: ${item.product.title}`)
    assert(item.product.availabilityCheckedAt === CHECKED_DATE, `Stale check date: ${item.product.title}`)
  }
  return result
}

async function main() {
  const mode = process.argv.find(arg => ['--plan', '--write', '--validate'].includes(arg))
  assert(mode, 'Choose --plan, --write or --validate')
  assert(partnerTag === 'apfunbox06-21', 'Expected approved Amazon tag')
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
  if (mode === '--write') assert(token, 'Sanity write token required')
  const client = createClient({projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: false, token, perspective: mode === '--write' ? 'raw' : 'published'})
  if (mode === '--validate') { const result = await verify(client); console.log(JSON.stringify({ok:true,mode:'validate',page:result._id,products:5},null,2)); return }
  const ids = Object.values(products).map(x => x.id)
  const state = await client.fetch(`{"products":*[_id in $ids],"general":*[_id==$general][0],"buying":*[_id==$buying][0],"platform":*[_id==$platform][0],"page":*[_id==$page][0]}`, {ids, general:GENERAL_ID, buying:BUYING_GUIDE_ID, platform:PLATFORM_ID, page:PAGE_ID})
  assert(state.products.length === 5 && state.general && state.buying && state.platform, 'Required documents missing')
  if (mode === '--plan') { console.log(JSON.stringify({ok:true,mode:'plan',page:PAGE_ID,products:ids,create:!state.page},null,2)); return }
  let tx = client.transaction().createOrReplace(page)
  for (const product of state.products) tx = tx.patch(product._id, patch => patch.ifRevisionId(product._rev).set(productUpdates[product._id]))
  tx = tx.patch(GENERAL_ID, patch => patch.ifRevisionId(state.general._rev).set({relatedContent: appendRelated(state.general, 'general-related-business')}))
  tx = tx.patch(BUYING_GUIDE_ID, patch => patch.ifRevisionId(state.buying._rev).set({body: appendBodyLink(state.buying, 'business-buying-backlink', 'For professional productivity, Excel, Teams and office travel, compare the ')}))
  tx = tx.patch(PLATFORM_ID, patch => patch.ifRevisionId(state.platform._rev).set({body: appendBodyLink(state.platform, 'business-platform-backlink', 'If office productivity is the primary goal, continue to the ')}))
  const commit = await tx.commit({visibility:'sync',returnDocuments:false})
  const result = await verify(client.withConfig({perspective:'published'}))
  console.log(JSON.stringify({ok:true,mode:'write',transactionId:commit.transactionId,page:result._id,products:5},null,2))
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1 })
