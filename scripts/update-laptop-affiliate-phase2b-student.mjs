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
const STUDENT_ID = 'topten-best-laptops-for-students-uae'
const GENERAL_ID = 'ec4a75a5-8acf-4103-bf86-3a040477e0d7'
const GAMING_ID = 'topten-best-gaming-laptops-uae'
const BUDGET_ID = '2d7cd630-2309-4f3e-b81a-65d4b6811e00'
const AI_ID = 'ccef5038-23f4-4cf1-9b3b-2fc34a217c04'
const BUYING_GUIDE_ID = 'buyer-guide-how-to-choose-laptop-uae'

const products = {
  yoga: {id: 'b1692b2a-b273-42d8-af7b-b39eba1cb623', asin: 'B0FM3F1SGH'},
  vivobook: {id: 'c5f619e8-3efa-45b3-832f-e3e66ab3c920', asin: 'B0FHHJW4NP'},
  thinkpad: {id: 'abf7eeb0-f82f-46b2-b3c9-0cc77bf5bcdc', asin: 'B0DNQFK6B9'},
  surface: {id: '1b91e5bc-9f50-4100-9688-9891adbd0a7b', asin: 'B0DZBMVVLT'},
  mac: {id: '2ef66e3f-3820-4770-8971-90bb8bcf0557', asin: 'B0DLHK2MMY'},
  victus: {id: '811d6310-4994-4085-a2e8-d22b084e5206', asin: 'B0DN5RWNNC'},
}

const productIds = Object.values(products).map(item => item.id)
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
const h3 = (_key, text) => block(_key, 'h3', [text])
const bullet = (_key, ...parts) => block(_key, 'normal', parts, {listItem: 'bullet', level: 1})
const table = (_key, rows) => ({
  _key, _type: 'table', rows: rows.map((cells, index) => ({_key: `${_key}r${index}`, _type: 'tableRow', cells})),
})
const faq = (_key, question, answer) => ({_key, _type: 'faq', question, answer: [p(`${_key}a`, answer)]})

class MigrationError extends Error {}
const assert = (condition, message) => { if (!condition) throw new MigrationError(message) }

const activeOffer = ({asin, seller, fulfilment, warranty, keyboard}) => ({
  asin,
  affiliateLink: amazon(asin),
  retailer: 'Amazon.ae',
  availability: 'https://schema.org/InStock',
  availabilityStatus: 'available',
  availabilityCheckedAt: CHECKED_DATE,
  lastPriceCheckedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  uaeCommerce: {
    _type: 'uaeCommerceContext',
    availableInUae: true,
    availabilityNote: `Exact Amazon.ae ASIN ${asin} was orderable on ${CHECKED_DATE}; sold by ${seller}.`,
    shippingNote: `${fulfilment} Confirm the current delivery date, returns and total delivered cost for your UAE address.`,
    warrantyNote: warranty,
    voltageOrCompatibility: `${keyboard} The offer did not establish the included UAE Type-G power lead; confirm the charger and plug before ordering.`,
  },
})

const offerUpdates = {
  [products.yoga.id]: activeOffer({
    asin: products.yoga.asin,
    seller: 'Byte Mart UAE',
    fulfilment: 'Delivered by Amazon.ae when checked.',
    warranty: 'The offer stated a one-year seller warranty and said the original seal was opened for an upgrade; confirm the covered parts and service route before ordering.',
    keyboard: 'The offer stated a backlit keyboard, but its language was not verified.',
  }),
  [products.vivobook.id]: activeOffer({
    asin: products.vivobook.asin,
    seller: 'Notebook Zone',
    fulfilment: 'Delivered by Amazon.ae when checked.',
    warranty: 'The offer stated a one-year seller warranty and said the original seal was opened for an upgrade; confirm the covered parts and service route before ordering.',
    keyboard: 'Keyboard language was not stated clearly enough to verify.',
  }),
  [products.thinkpad.id]: activeOffer({
    asin: products.thinkpad.asin,
    seller: 'ByteHub Traders',
    fulfilment: 'Fulfilled by Amazon when checked.',
    warranty: 'The offer stated a one-year seller warranty and said the original seal was opened for an upgrade; confirm the covered parts and service route before ordering.',
    keyboard: 'The offer stated a backlit keyboard, but its language was not verified.',
  }),
  [products.surface.id]: activeOffer({
    asin: products.surface.asin,
    seller: 'TechFlip By CompuLogic',
    fulfilment: 'Fulfilled by Amazon when checked.',
    warranty: 'The offer stated a one-year seller warranty and described the unit as upgraded; confirm the covered parts and service route before ordering.',
    keyboard: 'Keyboard language was not stated clearly enough to verify.',
  }),
  [products.victus.id]: activeOffer({
    asin: products.victus.asin,
    seller: 'THE-LAPTOP SHOP',
    fulfilment: 'Fulfilled by Amazon when checked.',
    warranty: 'A current UAE manufacturer or seller warranty was not established from the offer. Optional protection-plan advertising is not proof of manufacturer warranty.',
    keyboard: 'The offer stated an English backlit keyboard.',
  }),
  [products.mac.id]: {
    asin: products.mac.asin,
    affiliateLink: null,
    retailer: 'Amazon.ae',
    availability: 'https://schema.org/OutOfStock',
    availabilityStatus: 'unavailable',
    availabilityCheckedAt: CHECKED_DATE,
    lastPriceCheckedAt: REVIEWED_AT,
    lastReviewedAt: REVIEWED_AT,
    uaeCommerce: {
      _type: 'uaeCommerceContext',
      availableInUae: false,
      availabilityNote: `Amazon.ae ASIN ${products.mac.asin} and the linked variation route B0DLHFZ7TW both resolved to the same 16GB/256GB M2 configuration and were unavailable on ${CHECKED_DATE}.`,
      shippingNote: 'No active seller, fulfilment or delivery promise was available. The purchase CTA remains suppressed until the exact offer is orderable and reverified.',
      warrantyNote: 'No current seller or UAE warranty could be verified because the exact configuration was unavailable.',
      voltageOrCompatibility: 'The selected style stated an Arabic/English keyboard. Confirm the charger and UAE Type-G power lead if the offer returns to stock.',
    },
  },
}

const studentBody = [
  h2('studentquickh', 'Quick answer: the best student laptops in UAE'),
  p('studentquickp', 'For most UAE university and college students, start with the Lenovo Yoga 7i when a large 2-in-1 suits your routine. Choose the ASUS Vivobook 14 for everyday value, the ThinkPad E16 for programming and heavier multitasking, the Surface Laptop 13 for a light Windows option, or the HP Victus when verified course software can use discrete graphics. The MacBook Air M2 offer is retained for comparison but is currently unavailable, so it has no purchase CTA.'),
  h2('studentchecksh', 'UAE buying checks'),
  bullet('studentcheck1', 'Open the exact ASIN and confirm CPU, RAM, storage, display and operating system before paying.'),
  bullet('studentcheck2', 'Check the current seller, fulfilment, return terms and who actually provides warranty service in the UAE.'),
  bullet('studentcheck3', 'Confirm keyboard language and the included charger or UAE Type-G power lead; neither was established for every offer.'),
  bullet('studentcheck4', 'Treat 16 September 2026 as a dated offer snapshot. Stock, seller and configuration can change without notice.'),
  h2('studentscopeh', 'Choose the right laptop path'),
  p('studentscopep', 'This page is for UAE university and college workloads. Use the ', {text: 'general UAE laptop shortlist', href: '/top-ten/best-laptops-uae'}, ' for a broader comparison, the ', {text: 'gaming laptop guide', href: '/top-ten/best-gaming-laptops-uae'}, ' for dedicated-GPU choices, or the ', {text: 'AI laptop guide', href: '/top-ten/best-ai-laptops-uae'}, ' when NPU and Copilot+ features matter. If AED 1,500 is a hard ceiling, use the ', {text: 'budget laptop shortlist', href: '/top-ten/best-laptop-under-1500-aed-uae'}, '. If you are still choosing specifications, start with the ', {text: 'UAE laptop buying guide', href: '/laptops/how-to-choose-a-laptop-in-uae'}, '.'),
  h2('studentworkloadh', 'Choose by course workload'),
  h3('studentgeneralh', 'General coursework'),
  p('studentgeneralp', 'For browser research, Office documents, PDFs and video calls, prioritise portability, a usable keyboard, enough local storage and 16GB memory for comfortable multitasking. The Vivobook is the value-led option; the Yoga adds a larger touchscreen and 2-in-1 modes; the Surface is lighter but requires an Arm compatibility check.'),
  h3('studentprogrammingh', 'Programming and computer-science coursework'),
  p('studentprogrammingp', 'Check the required operating system, IDE, containers, virtual machines and device drivers before choosing. The ThinkPad’s checked 32GB/1TB configuration gives the most memory and storage headroom here, but students should still verify any Linux, virtualisation or architecture requirement with the course.'),
  h3('studentengineeringh', 'Engineering, CAD and technical software'),
  p('studentengineeringp', 'Many engineering packages have specific Windows, processor, RAM and GPU requirements. The Victus is the only discrete-GPU choice in this student shortlist, but its GeForce GPU is not automatically equivalent to a certified professional workstation. Confirm the exact CAD, simulation, CUDA and virtualisation requirements with the faculty and software vendor.'),
  h3('studentcreativeh', 'Creative coursework'),
  p('studentcreativep', 'Photo, video and design students should check application compatibility, display requirements, storage growth and whether acceleration depends on a specific GPU. The Victus provides discrete graphics, while the MacBook Air supports macOS workflows but its checked 256GB storage is fixed and the exact Amazon.ae offer is currently unavailable. No colour, export-speed or battery benchmark claim is made here.'),
  h2('studenttradeoffsh', 'The student trade-offs that matter'),
  table('studenttradeoffs', [
    ['Decision', 'Practical baseline', 'When to move up or reconsider'],
    ['Memory', '16GB for most new student purchases', 'Use 32GB when the course specifies VMs, large datasets or heavier technical tools'],
    ['Storage', '512GB reduces dependence on external or cloud storage', 'Choose 1TB for large local projects, VMs, games or media; 256GB needs disciplined storage'],
    ['Compatibility', 'Verify required apps before choosing an OS', 'Check Windows on Arm, macOS, drivers, exam software and plug-ins individually'],
    ['Portability', 'Compare laptop plus charger', 'A gaming laptop may be poor for daily campus travel even when its GPU is useful'],
    ['Warranty', 'Identify the actual service provider', 'Seller-upgraded or imported configurations need extra scrutiny'],
  ]),
  h2('studentspecsh', 'Verified offer snapshot'),
  table('studentspecstable', [
    ['Laptop', 'Exact checked configuration', 'Operating system', 'Offer status on 16 Sep 2026'],
    ['Yoga 7i 16IML9', 'Core Ultra 7 155U / 16GB / 1TB / 16-inch touch', 'Windows 11 Home', 'Orderable; Byte Mart UAE; delivered by Amazon.ae'],
    ['Vivobook 14 X1404VA', 'Core i5-1334U / 16GB / 512GB / 14-inch FHD', 'Windows 11 Pro', 'Orderable; Notebook Zone; delivered by Amazon.ae'],
    ['ThinkPad E16 Gen 2', 'Core Ultra 7 155H / 32GB / 1TB / 16-inch WUXGA', 'Windows 11 Pro', 'Orderable; ByteHub Traders; fulfilled by Amazon'],
    ['Surface Laptop 13', 'Snapdragon X Plus / 16GB / 256GB / 13-inch touch', 'Windows 11 on Arm', 'Orderable; TechFlip By CompuLogic; fulfilled by Amazon'],
    ['MacBook Air M2', 'Apple M2 / 16GB / 256GB / 13.6-inch', 'macOS', 'Unavailable; CTA suppressed'],
    ['HP Victus 15-fa2701wm', 'Core i5-13420H / 16GB / 512GB / RTX 4050 / 15.6-inch 144Hz', 'Windows 11', 'Orderable; THE-LAPTOP SHOP; fulfilled by Amazon'],
  ]),
]

const closingContent = [
  h2('studentfinalh', 'Final student buying checklist'),
  bullet('studentfinal1', 'Get the course software list before choosing Windows, macOS or Windows on Arm.'),
  bullet('studentfinal2', 'Choose enough RAM and local storage for the full course, not only first-semester assignments.'),
  bullet('studentfinal3', 'Compare notebook weight, charger size, ports and external-display needs together.'),
  bullet('studentfinal4', 'Open the exact Amazon.ae ASIN and reconfirm configuration, seller, fulfilment, keyboard, charger, returns and warranty.'),
  bullet('studentfinal5', 'Do not buy an unavailable comparison entry or substitute a similarly named model without repeating the checks.'),
]

const faqs = [
  faq('studentfaq1', 'What is the best laptop for university students in UAE?', 'The Lenovo Yoga 7i is the best all-round fit in this six-model shortlist when a large touchscreen convertible suits the student. Daily commuters may prefer the lighter Vivobook 14 or Surface Laptop 13 after checking software compatibility.'),
  faq('studentfaq2', 'Is 8GB RAM enough for students in 2026?', 'It can cover lighter documents, browser work and online classes, but 16GB is the safer target for a new general student purchase. Course requirements override this general guidance.'),
  faq('studentfaq3', 'Which laptop is best for programming students?', 'The ThinkPad E16 is the programming-led option here because the exact checked offer has 32GB memory and 1TB storage. Verify the required operating system, virtualisation, containers and processor architecture first.'),
  faq('studentfaq4', 'Should engineering students buy a gaming laptop?', 'Only when the required application benefits from its higher-power processor or discrete GPU. The HP Victus has RTX 4050 Laptop graphics, but that does not make it a certified professional workstation.'),
  faq('studentfaq5', 'Is the MacBook Air M2 a good student laptop?', 'It can suit macOS-compatible coursework, but the exact 16GB/256GB Amazon.ae configuration checked for this guide was unavailable on 16 September 2026. Its memory and storage are not user-upgradeable, and Windows-only requirements must be checked.'),
  faq('studentfaq6', 'What should UAE students check before ordering from Amazon.ae?', 'Verify the exact ASIN and selected configuration, current seller and fulfilment, keyboard language, included charger or Type-G lead, return terms and the party providing warranty service.'),
]

const amazonSourceUpdates = {
  studentsrcyogaamazon: {title: 'Yoga 7i 16IML9 exact Amazon.ae offer — ASIN B0FM3F1SGH', url: amazon(products.yoga.asin), note: 'Core Ultra 7 155U, 16GB/1TB offer sold by Byte Mart UAE and delivered by Amazon.ae; one-year seller warranty and seller-opened upgrade were stated.'},
  studentsrcasusamazon: {title: 'Vivobook 14 X1404VA exact Amazon.ae offer — ASIN B0FHHJW4NP', url: amazon(products.vivobook.asin), note: 'Core i5-1334U, 16GB/512GB offer sold by Notebook Zone and delivered by Amazon.ae; one-year seller warranty and seller-opened upgrade were stated.'},
  studentsrcthinkpadamazon: {title: 'ThinkPad E16 Gen 2 exact Amazon.ae offer — ASIN B0DNQFK6B9', url: amazon(products.thinkpad.asin), note: 'Core Ultra 7 155H, 32GB/1TB offer sold by ByteHub Traders and fulfilled by Amazon; one-year seller warranty and seller-opened upgrade were stated.'},
  studentsrcsurfaceamazon: {title: 'Surface Laptop 13 exact Amazon.ae offer — ASIN B0DZBMVVLT', url: amazon(products.surface.asin), note: 'Snapdragon X Plus, 16GB/256GB offer sold by TechFlip By CompuLogic and fulfilled by Amazon; one-year seller warranty and an upgraded configuration were stated.'},
  studentsrcappleamazon: {title: 'MacBook Air M2 13-inch Amazon.ae offer — ASIN B0DLHK2MMY', note: 'The ASIN and variation route B0DLHFZ7TW resolved to the same 16GB/256GB Arabic/English configuration; both routes were unavailable and no Amazon link or CTA is exposed.'},
  studentsrchpamazon: {title: 'HP Victus 15-fa2701wm exact Amazon.ae offer — ASIN B0DN5RWNNC', url: amazon(products.victus.asin), note: 'Core i5-13420H, 16GB/512GB, RTX 4050 offer sold by THE-LAPTOP SHOP and fulfilled by Amazon; English backlit keyboard stated, warranty not established.'},
}

const updateStudent = student => ({
  title: 'Best Laptops for Students in UAE (2026): 6 Picks by Study Need',
  intro: 'For UAE university and college students, this guide compares six existing laptops by course workload, portability, compatibility, memory, storage and purchase risk. Five exact Amazon.ae offers were orderable and one MacBook Air offer was unavailable when rechecked on 16 September 2026.',
  body: studentBody,
  closingContent,
  lastReviewedAt: REVIEWED_AT,
  keyTakeaways: [
    'Choose for required course software before brand, processor or operating-system preference.',
    'Five exact offers were orderable on 16 September 2026; the unavailable MacBook Air has no purchase CTA.',
    'Sixteen gigabytes is the general starting point here, while 32GB may suit specified virtual-machine or heavier technical workloads.',
    'Recheck the exact configuration, seller, fulfilment, keyboard, charger and warranty before paying.',
  ],
  whoItsFor: 'UAE university and college students comparing laptops for general coursework, programming, business, engineering, creative study, portability or discrete-graphics needs.',
  whoShouldAvoid: 'Buyers with a strict AED 1,500 ceiling should use the budget shortlist. Students with certified workstation, specialist scientific-computing or institution-managed-device requirements should follow their programme specification first.',
  methodology: [
    p('studentmethod1', 'TopTenUAE compared official manufacturer specifications with each exact Amazon.ae offer. All six offer routes were rechecked on 16 September 2026 for configuration, seller, fulfilment, keyboard, warranty, charger or plug information and orderability.'),
    p('studentmethod2', 'TopTenUAE did not perform hands-on benchmarks, battery rundowns, display measurements, thermal tests, acoustic tests or durability testing. Student roles are feature-based editorial judgments; prices, discounts and stock urgency are not ranking evidence.'),
  ],
  uaeContext: [
    p('studentuae1', 'Amazon.ae marketplace listings can be imported or seller-upgraded. Confirm the current seller, fulfilment, exact components, keyboard layout, charger, UAE Type-G lead, returns and warranty provider for the selected offer.'),
    p('studentuae2', 'University requirements override this guide. Confirm operating system, processor architecture, GPU, RAM, storage, drivers, plug-ins and exam software with the faculty or software vendor.'),
  ],
  relatedBuyerGuide: ref(BUYING_GUIDE_ID, 'studentbuyingguide'),
  relatedContent: [
    ref(GENERAL_ID, 'studentrelatedgeneral'),
    ref(GAMING_ID, 'studentrelatedgaming'),
    ref(BUDGET_ID, 'studentrelatedbudget'),
    ref(AI_ID, 'studentrelatedai'),
  ],
  faqs,
  affiliateDisclosure: 'TopTenUAE may earn a commission from qualifying Amazon.ae purchases. Rankings are editorial and are not determined by commission, seller stock or temporary pricing.',
  seo: {
    _type: 'seo',
    metaTitle: 'Best Laptops for Students UAE: 6 Picks',
    metaDescription: 'Compare six student laptops in the UAE by coursework, coding, engineering, portability and compatibility, with exact Amazon.ae offer checks.',
    keywords: ['best laptops for students UAE', 'best student laptops UAE', 'laptop for university students UAE', 'best laptop for programming students UAE', 'best laptop for engineering students UAE'],
    canonicalUrl: 'https://toptenuae.com/top-ten/best-laptops-for-students-uae',
    noIndex: false,
    schemaType: 'ItemList',
  },
  listItems: student.listItems.map(item => {
    const details = {
      [products.yoga.id]: ['Best overall student laptop', 'Its 16GB/1TB checked configuration, touchscreen and 360-degree hinge suit general coursework, presentations and annotation.', 'Skip it if a 1.99kg 16-inch laptop is too large for daily commuting or the course requires discrete graphics.'],
      [products.vivobook.id]: ['Best value student laptop', 'The Core i5, 16GB/512GB checked offer covers everyday coursework in a lighter 14-inch chassis.', 'Skip it for GPU-heavy engineering, modern gaming or colour-critical creative work; the seller-opened configuration and seller warranty also need confirmation.'],
      [products.thinkpad.id]: ['Best for programming and multitasking', 'The checked 32GB/1TB offer, 16:10 display, Ethernet, Thunderbolt 4 and upgrade paths suit IDEs, multitasking and office coursework.', 'Skip it when a smaller commuter laptop, sealed factory configuration or certified workstation GPU is required.'],
      [products.surface.id]: ['Best lightweight Windows option', 'At about 1.22kg, the 13-inch touchscreen configuration combines 16GB memory and compact campus mobility.', 'Skip it until every required application, driver and peripheral is confirmed for Windows on Arm; 256GB may also be restrictive.'],
      [products.mac.id]: ['Mac option—currently unavailable', 'The 1.24kg M2 Air remains a useful macOS comparison with 16GB unified memory, but the exact checked configuration is not orderable.', 'Skip it while unavailable, for Windows-only course software, or when the fixed 256GB storage is insufficient.'],
      [products.victus.id]: ['Best for engineering workloads needing a GPU', 'Its Core i5 H-series processor and RTX 4050 Laptop GPU provide the only discrete-graphics role in this student shortlist.', 'Skip it for light daily commuting or long unplugged use, and do not treat its gaming GPU as a certified workstation substitute.'],
    }[item.product?._ref]
    assert(details, `Unexpected product in student list: ${item.product?._ref}`)
    const rank = {
      [products.yoga.id]: 1,
      [products.vivobook.id]: 2,
      [products.thinkpad.id]: 3,
      [products.victus.id]: 4,
      [products.surface.id]: 5,
      [products.mac.id]: 6,
    }[item.product?._ref]
    return {...item, rank, badgeLabel: details[0], whySelected: details[1], skipIf: details[2]}
  }),
  sources: student.sources.map(source => {
    const update = amazonSourceUpdates[source._key]
    if (!update) return source
    if (source._key === 'studentsrcappleamazon') {
      const {url: _unavailableDestination, ...sourceWithoutUrl} = source
      return {...sourceWithoutUrl, ...update, accessedAt: CHECKED_DATE}
    }
    return {...source, ...update, accessedAt: CHECKED_DATE}
  }),
})

const validateState = state => {
  assert(state.student?._id === STUDENT_ID, 'Student page is missing')
  assert(state.student.listItems?.length === 6, 'Student page must retain exactly six researched entries')
  assert(state.products?.length === 6, 'One or more student product records are missing')
  assert(state.refs?.length === 5, 'One or more required internal-link targets are missing')
  assert(!state.drafts?.length, `Draft collision detected: ${state.drafts.map(item => item._id).join(', ')}`)
}

const verifyPublished = async client => {
  const result = await client.fetch(`*[_id == $id][0]{
    _id,title,"slug":slug.current,lastReviewedAt,seo,relatedBuyerGuide,relatedContent,
    "faqCount":count(faqs),"bodyLinks":body[].markDefs[].href,
    listItems[]{rank,badgeLabel,whySelected,skipIf,product->{_id,title,asin,affiliateLink,availabilityStatus,availabilityCheckedAt,uaeCommerce,"slug":slug.current}}
  }
  `, {id: STUDENT_ID})
  assert(result?.slug === 'best-laptops-for-students-uae', 'Student page slug changed')
  assert(result.lastReviewedAt === REVIEWED_AT, 'Student page review date mismatch')
  assert(result.seo?.canonicalUrl === 'https://toptenuae.com/top-ten/best-laptops-for-students-uae', 'Canonical mismatch')
  assert(result.seo?.noIndex === false, 'Student page must remain indexable')
  assert(result.seo?.schemaType === 'ItemList', 'Student page schema type mismatch')
  assert(result.listItems?.length === 6, 'Student page must contain six entries')
  assert(result.faqCount === 6, 'Visible FAQ count mismatch')
  assert(result.relatedBuyerGuide?._ref === BUYING_GUIDE_ID, 'Buying-guide link mismatch')
  const relatedIds = new Set(result.relatedContent?.map(item => item._ref))
  for (const id of [GENERAL_ID, GAMING_ID, BUDGET_ID, AI_ID]) assert(relatedIds.has(id), `Missing related guide ${id}`)
  const bodyLinks = new Set((result.bodyLinks || []).filter(Boolean))
  for (const path of ['/top-ten/best-laptops-uae', '/top-ten/best-gaming-laptops-uae', '/top-ten/best-laptop-under-1500-aed-uae', '/top-ten/best-ai-laptops-uae', '/laptops/how-to-choose-a-laptop-in-uae']) {
    assert(bodyLinks.has(path), `Expected contextual destination ${path}`)
  }
  const active = result.listItems.filter(item => item.product?.availabilityStatus === 'available')
  const unavailable = result.listItems.filter(item => item.product?.availabilityStatus === 'unavailable')
  assert(active.length === 5 && unavailable.length === 1, 'Expected five active offers and one unavailable offer')
  for (const item of active) {
    const destination = new URL(item.product.affiliateLink)
    assert(destination.hostname === 'www.amazon.ae', `Non-direct destination for ${item.product.title}`)
    assert(destination.pathname === `/dp/${item.product.asin}`, `ASIN mismatch for ${item.product.title}`)
    assert(destination.searchParams.get('tag') === partnerTag, `Affiliate tag mismatch for ${item.product.title}`)
    assert(item.product.availabilityCheckedAt === CHECKED_DATE, `Check date mismatch for ${item.product.title}`)
  }
  assert(unavailable[0].product.affiliateLink == null, 'Unavailable MacBook still has a purchase path')
  return result
}

async function main() {
  const modes = process.argv.filter(arg => ['--plan', '--write', '--validate'].includes(arg))
  assert(modes.length === 1, 'Choose exactly one mode: --plan, --write or --validate')
  const mode = modes[0].slice(2)
  assert(partnerTag === 'apfunbox06-21', 'Phase 2B requires the existing apfunbox06-21 production tag')
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
  if (mode === 'write') assert(token, 'A Sanity write token is required for --write')
  const client = createClient({projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: false, perspective: mode === 'write' ? 'raw' : 'published', token})
  const state = await client.fetch(`{
    "student": *[_id == $studentId][0],
    "products": *[_id in $productIds],
    "refs": *[_id in $refIds]{_id,_type},
    "drafts": *[_id in $draftIds]{_id}
  }`, {
    studentId: STUDENT_ID,
    productIds,
    refIds: [GENERAL_ID, GAMING_ID, BUDGET_ID, AI_ID, BUYING_GUIDE_ID],
    draftIds: [STUDENT_ID, ...productIds].map(id => `drafts.${id}`),
  })
  validateState(state)

  if (mode === 'validate') {
    const result = await verifyPublished(client)
    console.log(JSON.stringify({ok: true, mode, student: result._id, activeOffers: 5, unavailableOffers: 1}, null, 2))
    return
  }

  const studentUpdate = updateStudent(state.student)
  if (mode === 'plan') {
    console.log(JSON.stringify({
      ok: true,
      mode,
      student: {id: STUDENT_ID, entries: studentUpdate.listItems.length, relatedGuides: studentUpdate.relatedContent.length},
      productUpdates: Object.entries(offerUpdates).map(([id, update]) => ({id, asin: update.asin, status: update.availabilityStatus, destination: update.affiliateLink})),
    }, null, 2))
    return
  }

  let transaction = client.transaction().patch(STUDENT_ID, patch => patch.ifRevisionId(state.student._rev).set(studentUpdate))
  for (const product of state.products) {
    transaction = transaction.patch(product._id, patch => patch.ifRevisionId(product._rev).set(offerUpdates[product._id]))
  }
  const commit = await transaction.commit({visibility: 'sync', returnDocuments: false})
  const result = await verifyPublished(client.withConfig({perspective: 'published'}))
  console.log(JSON.stringify({ok: true, mode, transactionId: commit.transactionId, student: result._id, activeOffers: 5, unavailableOffers: 1}, null, 2))
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
