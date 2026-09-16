import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
try { process.loadEnvFile(resolve(ROOT, '.env.local')) } catch {}

const PROJECT_ID = 'kxdjzy8e'
const DATASET = 'production'
const API_VERSION = '2026-09-16'
const CHECKED_DATE = '2026-09-16'
const REVIEWED_AT = '2026-09-16T00:00:00.000Z'
const TAG = process.env.AMAZON_PARTNER_TAG || ''

const PAGE_IDS = {
  general: 'ec4a75a5-8acf-4103-bf86-3a040477e0d7',
  student: 'topten-best-laptops-for-students-uae',
  business: 'topten-best-business-laptops-uae',
  gaming: 'topten-best-gaming-laptops-uae',
  ai: 'ccef5038-23f4-4cf1-9b3b-2fc34a217c04',
  budget: '2d7cd630-2309-4f3e-b81a-65d4b6811e00',
  platform: 'buyer-guide-windows-laptop-vs-macbook-uae',
}

const IDS = {
  zenbook: 'topten-ai-laptop-asus-zenbook-s-16-um5606ga',
  surfaceX2: 'topten-ai-laptop-microsoft-surface-laptop-15-8th-edition-x2',
  proart: 'topten-ai-laptop-asus-proart-p16-h7606wp-rtx-5070',
  macPro: 'topten-ai-laptop-apple-macbook-pro-14-m5-16gb-1tb',
  omnibook: 'topten-ai-laptop-hp-omnibook-x-flip-16-ultra-7-256v',
  yogaSlim: 'topten-ai-laptop-lenovo-yoga-slim-7x-14q8x9',
  galaxy: 'topten-ai-laptop-samsung-galaxy-book6-16-ultra-7-355',
  xps: 'topten-ai-laptop-dell-xps-13-9350-ultra-7-256v',
  aspireAi: 'topten-ai-laptop-acer-aspire-14-ai-a14-52m-72s0',
  vivobookArm: 'topten-ai-laptop-asus-vivobook-16-x1607qa-snapdragon-x',
  thinkpad: 'abf7eeb0-f82f-46b2-b3c9-0cc77bf5bcdc',
  vivobook: 'c5f619e8-3efa-45b3-832f-e3e66ab3c920',
  yoga: 'b1692b2a-b273-42d8-af7b-b39eba1cb623',
  surface: '1b91e5bc-9f50-4100-9688-9891adbd0a7b',
  victus: '811d6310-4994-4085-a2e8-d22b084e5206',
  rog: '91332102-fe66-4c24-ae49-8dd93206f3ed',
  legion: 'e8f797ea-b7c8-4b7f-be1a-1fe0b87ca7b9',
  budgetAcer: '6dd190ab-8bf5-416d-8515-47f8f1b11433',
  budgetAsus: 'd36d3a19-df63-463a-b357-303f0fdc9029',
  budgetChromebook: '9371dd41-7b2d-4a0f-80a1-88c10d9ac927',
  budgetStream: 'b40346ff-48be-401b-aba3-35dde656871c',
  budgetHp15: 'eed46a9e-68de-44e4-ac41-a9398faaba09',
  budgetAsusGo: '4d9c0361-8828-46e9-a079-3b0796289766',
  budgetHp14: 'a3a32bba-809a-46d5-a2a4-c5116dc838eb',
  macM2: '2ef66e3f-3820-4770-8971-90bb8bcf0557',
  macM4: '83cb095b-5235-4ff2-aa9d-268d63450073',
  nitro: '9abe1b9c-c15d-43c4-8eee-9834e3ccfc8d',
}

const amazon = asin => `https://www.amazon.ae/dp/${asin}?tag=${encodeURIComponent(TAG)}&th=1`
const span = (_key, text, marks = []) => ({_key, _type: 'span', text, marks})
const block = (_key, style, parts) => {
  const markDefs = []
  const children = parts.map((part, index) => {
    if (typeof part === 'string') return span(`${_key}s${index}`, part)
    const markKey = `${_key}link${index}`
    markDefs.push({_key: markKey, _type: 'link', href: part.href, blank: false})
    return span(`${_key}s${index}`, part.text, [markKey])
  })
  return {_key, _type: 'block', style, markDefs, children}
}
const p = (_key, ...parts) => block(_key, 'normal', parts)
const table = (_key, rows) => ({_key, _type: 'table', rows: rows.map((cells, index) => ({_key: `${_key}r${index}`, _type: 'tableRow', cells}))})
const spec = (_key, specLabel, specValue) => ({_key, _type: 'object', specLabel, specValue})
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const getWriteToken = () => {
  const environmentToken = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
  if (environmentToken) return environmentToken
  try {
    const config = JSON.parse(readFileSync(resolve(homedir(), '.config/sanity/config.json'), 'utf8'))
    return config.authToken || ''
  } catch {
    return ''
  }
}

const baseOffer = ({asin, price, seller, fulfilment, keyboard, warranty, plug, note = ''}) => ({
  asin,
  affiliateLink: amazon(asin),
  price,
  currency: 'AED',
  retailer: 'Amazon.ae',
  availability: 'https://schema.org/InStock',
  availabilityStatus: 'available',
  availabilityCheckedAt: CHECKED_DATE,
  lastPriceCheckedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  uaeCommerce: {
    _type: 'uaeCommerceContext',
    availableInUae: true,
    availabilityNote: `Exact Amazon.ae ASIN ${asin} was orderable on ${CHECKED_DATE}; sold by ${seller}.${note ? ` ${note}` : ''}`,
    shippingNote: `${fulfilment} Confirm the current delivery date, returns and total delivered cost for the selected UAE address.`,
    warrantyNote: warranty,
    voltageOrCompatibility: `${keyboard} ${plug}`,
  },
})

const unavailableOffer = ({asin, note, keyboard = 'Keyboard language was not verified.', plug = 'The included UAE Type-G power lead was not verified.'}) => ({
  asin,
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
    availabilityNote: `Exact Amazon.ae ASIN ${asin} had no usable purchase path on ${CHECKED_DATE}. ${note}`,
    shippingNote: 'No active seller, fulfilment or delivery promise was available. The purchase CTA is suppressed until the exact offer is reverified.',
    warrantyNote: 'No current seller or UAE warranty route could be verified because the exact offer was unavailable.',
    voltageOrCompatibility: `${keyboard} ${plug}`,
  },
})

const optionalPlanWarranty = 'Only optional protection-plan advertising was established; it is not proof of UAE manufacturer warranty. Confirm the base coverage and service route before ordering.'
const unverifiedWarranty = 'A specific UAE manufacturer or seller warranty was not established. Confirm the coverage and service route and retain the invoice.'
const unverifiedPlug = 'The included UAE Type-G power lead was not established; confirm the charger input and supplied lead before ordering.'

const productUpdates = {
  [IDS.zenbook]: baseOffer({asin:'B0GPQH46G2',price:7759.01,seller:'Amazon.ae',fulfilment:'Shipped by Amazon.ae when checked.',keyboard:'Keyboard language was not established.',warranty:optionalPlanWarranty,plug:unverifiedPlug,note:'The title stated Ryzen AI 9 465, 32GB/2TB and a 16-inch 3K OLED display; Amazon’s overview separately displayed Ryzen AI 9 390, so the listing contains a material attribute conflict.'}),
  [IDS.surfaceX2]: baseOffer({asin:'B0H5JWXP5D',price:6999,seller:'Amazon.ae',fulfilment:'Shipped by Amazon.ae when checked.',keyboard:'Keyboard language was not established.',warranty:'The page surfaced “1 Year Manufacturer Warranty,” but the UAE service route was not established; confirm it before ordering.',plug:'The offer explicitly stated that the power supply is sold separately.',note:'The title stated a 15-inch Snapdragon X2 Elite 16GB/512GB configuration; the overview and one bullet separately described 13.8-inch and 13-inch displays, so the listing contains a material size conflict.'}),
  [IDS.proart]: unavailableOffer({asin:'B0GPRL4RDG',note:'The 64GB/2TB RTX 5070 offer was currently unavailable.',keyboard:'A backlit keyboard was stated, but its language was not verified.'}),
  [IDS.macPro]: baseOffer({asin:'B0FWD57CZH',price:7459,seller:'Amazon.ae',fulfilment:'Shipped by Amazon.ae when checked.',keyboard:'Keyboard language was not established.',warranty:'Optional AppleCare+ was shown; the base UAE warranty and service route were not established on the offer page.',plug:unverifiedPlug,note:'The title and bullets stated M5 with 16GB/1TB; Amazon’s overview separately displayed Apple M4, so the listing contains a material chip attribute conflict.'}),
  [IDS.omnibook]: baseOffer({asin:'B0FMY1W2ZH',price:3249,seller:'ByteHub Traders',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'A backlit keyboard was stated, but its language was not established.',warranty:optionalPlanWarranty,plug:unverifiedPlug}),
  [IDS.yogaSlim]: unavailableOffer({asin:'B0DQRH3LQL',note:'Amazon exposed only “See All Buying Options,” with no usable selected buy box.',keyboard:'A backlit standard keyboard was stated, but its language was not verified.',plug:'A 65W Type-C power supply was stated; a UAE Type-G lead was not verified.'}),
  [IDS.galaxy]: baseOffer({asin:'B0H9RTKYQM',price:3775,seller:'Tech Point Zone Electronics Trading LLC',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'Keyboard language was not established.',warranty:optionalPlanWarranty,plug:unverifiedPlug}),
  [IDS.xps]: baseOffer({asin:'B0HCNMTX4F',price:5399,seller:'TECH-OFFER',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'The exact title stated an English keyboard.',warranty:optionalPlanWarranty,plug:unverifiedPlug}),
  [IDS.aspireAi]: baseOffer({asin:'B0DWNLQLL6',price:3099,seller:'Tech Point Zone Electronics Trading LLC',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'A backlit keyboard was stated, but its language was not established.',warranty:optionalPlanWarranty,plug:unverifiedPlug}),
  [IDS.vivobookArm]: baseOffer({asin:'B0GWNCDMV6',price:2298.99,seller:'TECH-OFFER',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'Keyboard language was not established.',warranty:optionalPlanWarranty,plug:unverifiedPlug}),
  [IDS.thinkpad]: baseOffer({asin:'B0DNQFK6B9',price:4959,seller:'ByteHub Traders',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'A backlit keyboard was stated, but its language was not established.',warranty:'The offer stated a one-year seller warranty and an opened seal for the upgrade; confirm covered parts and the service route.',plug:unverifiedPlug,note:'The title and overview supported Core Ultra 7 155H, 32GB/1TB and Windows 11 Pro; one generic seller bullet conflicted, so verify the selected specification at checkout.'}),
  [IDS.vivobook]: baseOffer({asin:'B0FHHJW4NP',price:2299,seller:'DXB Laptop Arena',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'Keyboard language was not established; the listing did not state a backlit keyboard.',warranty:'The offer stated a one-year seller warranty and an opened seal for the upgrade; confirm covered parts and the service route.',plug:unverifiedPlug,note:'The offer was seller-upgraded.'}),
  [IDS.yoga]: baseOffer({asin:'B0FM3F1SGH',price:3639,seller:'B2C Hub',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'A backlit English (US) keyboard was surfaced in the listing details.',warranty:'The offer stated a one-year seller warranty and an opened seal for the upgrade; confirm covered parts and the service route.',plug:unverifiedPlug,note:'The title and overview supported Core Ultra 7 155U, 16GB/1TB and integrated graphics; generic seller bullets conflicted, so verify the selected specification at checkout.'}),
  [IDS.surface]: baseOffer({asin:'B0DZBMVVLT',price:3599,seller:'TechFlip By CompuLogic',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'Keyboard language was not established.',warranty:'The offer stated a one-year seller warranty and described an upgraded configuration; confirm covered parts and the service route.',plug:'This is Windows on Arm; verify every required app, driver and peripheral. The included UAE Type-G lead was not established.'}),
  [IDS.victus]: baseOffer({asin:'B0DN5RWNNC',price:3599,seller:'Q A Z TECH GENERAL TRADING',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'The exact title stated an English backlit keyboard.',warranty:optionalPlanWarranty,plug:unverifiedPlug,note:'The title stated FA2701WM with i5-13420H, 16GB/512GB and RTX 4050; Amazon’s overview separately displayed model 15-fa1082wm, so the listing contains a model attribute conflict.'}),
  [IDS.rog]: baseOffer({asin:'B0DZZWMB2L',price:6207,seller:'Tech Point Zone Electronics Trading LLC',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'An esports-ready keyboard was stated, but its language was not established.',warranty:'The offer stated a one-year seller warranty and an opened seal for the upgrade; confirm covered parts and the service route.',plug:unverifiedPlug,note:'The title and overview supported RTX 5060 dedicated graphics; one generic seller bullet incorrectly said integrated graphics.'}),
  [IDS.legion]: baseOffer({asin:'B0F6NRYPPG',price:7711.14,seller:'Amazon US',fulfilment:'This was a cross-border Amazon US offer; the page separately showed an import/delivery charge.',keyboard:'Keyboard language was not established.',warranty:unverifiedWarranty,plug:'Amazon warned that a power plug adaptor may be required for UAE sockets.'}),
  [IDS.budgetAcer]: baseOffer({asin:'B0CV5ZSR17',price:2149.32,seller:'DesertcartAE',fulfilment:'Shipper and seller were DesertcartAE.',keyboard:'The exact title stated an English keyboard.',warranty:unverifiedWarranty,plug:unverifiedPlug,note:'The price exceeded the AED 1,500 page ceiling, so this product is removed from that money page while its individual review retains an accurate offer.'}),
  [IDS.budgetAsus]: baseOffer({asin:'B0DB67YDVX',price:1799,seller:'THE-LAPTOP SHOP',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'Keyboard language was not established.',warranty:optionalPlanWarranty,plug:unverifiedPlug,note:'The price exceeded the AED 1,500 page ceiling, so this product is removed from that money page while its individual review retains an accurate offer.'}),
  [IDS.budgetChromebook]: baseOffer({asin:'B0DCLJ9V2B',price:1494.31,seller:'DesertcartAE',fulfilment:'Shipper and seller were DesertcartAE.',keyboard:'The listing stated an English non-backlit keyboard.',warranty:unverifiedWarranty,plug:unverifiedPlug}),
  [IDS.budgetStream]: {
    ...baseOffer({asin:'B0CZL2SLCJ',price:2708.61,seller:'DesertcartAE',fulfilment:'Shipper and seller were DesertcartAE.',keyboard:'Keyboard language was not established.',warranty:'The listing stated one-year coverage for the upgrade and remaining components, but a UAE service route was not established.',plug:unverifiedPlug,note:'The price exceeded AED 1,500 and the old CMS configuration did not match this exact route.'}),
    title: 'HP Stream 14 (Celeron N4120, 16GB, 288GB bundle)',
    specifications: [
      spec('phase5streamcpu','Processor','Intel Celeron N4120'),
      spec('phase5streamram','RAM','16GB DDR4 in the checked seller-upgraded offer'),
      spec('phase5streamstorage','Storage','128GB eMMC plus a 160GB docking-station bundle, advertised as 288GB total'),
      spec('phase5streamscreen','Screen','14-inch HD BrightView (1366 × 768)'),
      spec('phase5streamgraphics','Graphics','Intel UHD Graphics'),
      spec('phase5streamos','Operating system','Windows 11 Home in S mode'),
    ],
  },
  [IDS.budgetHp15]: baseOffer({asin:'B0DB5B5WWS',price:1759,seller:'Lenowo Online market',fulfilment:'Fulfilled by Amazon when checked.',keyboard:'The exact title stated an English keyboard.',warranty:optionalPlanWarranty,plug:unverifiedPlug,note:'The price exceeded the AED 1,500 page ceiling, so this product is removed from that money page while its individual review retains an accurate offer.'}),
  [IDS.budgetAsusGo]: baseOffer({asin:'B0DTVQN7KM',price:2410.88,seller:'DesertcartAE',fulfilment:'Shipper and seller were DesertcartAE.',keyboard:'Keyboard language was not established.',warranty:unverifiedWarranty,plug:unverifiedPlug,note:'The price exceeded the AED 1,500 page ceiling, so this product is removed from that money page while its individual review retains an accurate offer.'}),
  [IDS.budgetHp14]: unavailableOffer({asin:'B0FPXJ6G6B',note:'The Intel N150, 16GB, 128GB UFS plus 128GB microSD offer was currently unavailable.',keyboard:'The listing stated a non-backlit keyboard; its language was not verified.'}),
  [IDS.macM2]: unavailableOffer({asin:'B0DLHK2MMY',note:'The route resolved to variation B0DLHFZ7TW; both represented the 16GB/256GB M2 configuration and no usable buy box was available.',keyboard:'The selected style stated an Arabic/English keyboard.'}),
  [IDS.macM4]: unavailableOffer({asin:'B0DZDXCFJQ',note:'The 16GB/512GB M4 configuration was currently unavailable.',keyboard:'The selected variant stated an Arabic/English keyboard, although review text on the page conflicted.'}),
  [IDS.nitro]: unavailableOffer({asin:'B0FWXM6R9N',note:'The Ryzen 5 240, 16GB/512GB, RTX 5050 configuration was currently unavailable.',keyboard:'The exact title stated an English keyboard.'}),
}

const updateBlockByKey = (body, replacements) => (body || []).map(item => replacements[item?._key] || item)

const updateGeneral = page => {
  const activeIds = new Set([IDS.yoga, IDS.rog, IDS.thinkpad, IDS.victus, IDS.surface, IDS.vivobook, IDS.legion])
  const listItems = page.listItems.filter(item => activeIds.has(item.product?._ref)).sort((a,b) => a.rank-b.rank).map((item,index) => ({...item,rank:index+1}))
  return {
    title: '7 Best Laptops in UAE (2026): Work, Study & Gaming Picks',
    intro: 'The Lenovo Yoga 7i is the best all-round starting point when a large touchscreen convertible fits your routine. The ASUS Vivobook 14 is the everyday-value pick, the ThinkPad E16 is the business choice, and the HP Victus starts the gaming tier. Seven exact Amazon.ae offers were orderable when rechecked on 16 September 2026; three unavailable products were removed from the commercial shortlist.',
    keyTakeaways: [
      'Seven exact offers remained orderable on 16 September 2026; three unavailable products were removed instead of padding the list.',
      'Start with workload and software compatibility, then compare the exact configuration—not the model family name alone.',
      'Verify seller, fulfilment, keyboard, charger and the actual warranty provider on Amazon.ae before ordering.',
    ],
    lastReviewedAt: REVIEWED_AT,
    listItems,
    body: updateBlockByKey(page.body, {
      lapquick: p('lapquick','For most UAE buyers, start with the Lenovo Yoga 7i when a 16-inch touchscreen convertible fits your routine. Choose the ASUS Vivobook 14 for simpler everyday value, the ThinkPad E16 Gen 2 for office-heavy multitasking, the HP Victus for lower-cost RTX gaming, or the Surface Laptop for compact Windows-on-Arm mobility. Seven exact Amazon.ae destinations were orderable when rechecked on 16 September 2026.'),
      lapdecision: table('lapdecision', [
        ['Buyer need','Start with','Decision boundary'],
        ['Best overall','Lenovo Yoga 7i 16IML9','Large 16-inch convertible; no discrete GPU'],
        ['Best budget/value','ASUS Vivobook 14','Everyday office and study, not demanding creation or gaming'],
        ['Best for students','Student laptop guide','Compare portability, coding and engineering needs separately'],
        ['Best for business/office','ThinkPad E16 Gen 2','Verify seller-upgraded 32GB/1TB configuration'],
        ['Best for gaming','Gaming laptop guide','Choose by GPU, display, cooling and portability'],
        ['Best for portability','Surface Laptop 13-inch','Verify Windows-on-Arm software and peripheral support'],
        ['Best AI laptop','AI laptop guide','Compare NPU capability and app compatibility'],
      ]),
      lapspecialists: p('lapspecialists','Use the ',{text:'gaming laptop guide',href:'/top-ten/best-gaming-laptops-uae'},' for dedicated-GPU choices, the ',{text:'student laptop guide',href:'/top-ten/best-laptops-for-students-uae'},' for university workloads, the ',{text:'business and office laptop guide',href:'/top-ten/best-business-laptops-uae'},' for professional productivity, and the ',{text:'AI laptop guide',href:'/top-ten/best-ai-laptops-uae'},' for NPU and Copilot+ decisions.'),
    }),
    seo: {...page.seo,metaTitle:'Best Laptops UAE: 7 Work, Study & Gaming Picks',metaDescription:'Compare seven verified UAE laptop offers for work, study, business, portability and gaming, with exact configuration and marketplace-risk checks.'},
  }
}

const updateStudent = page => {
  const activeIds = new Set([IDS.yoga, IDS.vivobook, IDS.thinkpad, IDS.victus, IDS.surface])
  const ranks = {[IDS.yoga]:1,[IDS.vivobook]:2,[IDS.thinkpad]:3,[IDS.victus]:4,[IDS.surface]:5}
  const listItems = page.listItems.filter(item => activeIds.has(item.product?._ref)).map(item => ({...item,rank:ranks[item.product._ref]}))
  return {
    title: 'Best Laptops for Students in UAE (2026): 5 Picks by Study Need',
    intro: 'For UAE university and college students, this guide compares five currently orderable laptops by course workload, portability, compatibility, memory, storage and purchase risk. The unavailable MacBook Air M2 was removed from the commercial shortlist after the 16 September 2026 recheck.',
    keyTakeaways: [
      'Five exact student-laptop offers were orderable on 16 September 2026; the unavailable MacBook Air was removed.',
      'Choose for required course software before brand, processor or operating-system preference.',
      'Recheck the exact configuration, seller, fulfilment, keyboard, charger and warranty before paying.',
    ],
    lastReviewedAt: REVIEWED_AT,
    listItems,
    body: updateBlockByKey(page.body, {
      studentquickp: p('studentquickp','For most UAE university and college students, start with the Lenovo Yoga 7i when a large 2-in-1 suits your routine. Choose the ASUS Vivobook 14 for everyday value, the ThinkPad E16 for programming and heavier multitasking, the Surface Laptop 13 for a light Windows option, or the HP Victus when verified course software can use discrete graphics.'),
      studentcreativep: p('studentcreativep','Photo, video and design students should check application compatibility, display requirements, storage growth and whether acceleration depends on a specific GPU. The Victus provides discrete graphics, but no colour, export-speed or battery benchmark claim is made here.'),
      studentspecstable: table('studentspecstable', [
        ['Laptop','Exact checked configuration','Operating system','Offer status on 16 Sep 2026'],
        ['Yoga 7i 16IML9','Core Ultra 7 155U / 16GB / 1TB / 16-inch touch','Windows 11 Home','Orderable; B2C Hub; fulfilled by Amazon'],
        ['Vivobook 14 X1404VA','Core i5-1334U / 16GB / 512GB / 14-inch FHD','Windows 11 Pro','Orderable; DXB Laptop Arena; fulfilled by Amazon'],
        ['ThinkPad E16 Gen 2','Core Ultra 7 155H / 32GB / 1TB / 16-inch WUXGA','Windows 11 Pro','Orderable; ByteHub Traders; fulfilled by Amazon'],
        ['Surface Laptop 13','Snapdragon X Plus / 16GB / 256GB / 13-inch touch','Windows 11 on Arm','Orderable; TechFlip By CompuLogic; fulfilled by Amazon'],
        ['HP Victus 15-fa2701wm','Core i5-13420H / 16GB / 512GB / RTX 4050 / 15.6-inch 144Hz','Windows 11','Orderable; Q A Z TECH GENERAL TRADING; fulfilled by Amazon'],
      ]),
    }),
    seo: {...page.seo,metaTitle:'Best Laptops for Students UAE: 5 Verified Picks',metaDescription:'Compare five currently orderable student laptops in the UAE by coursework, coding, engineering, portability and compatibility.'},
  }
}

const updateAi = page => {
  const activeIds = [IDS.zenbook,IDS.surfaceX2,IDS.macPro,IDS.omnibook,IDS.galaxy,IDS.xps,IDS.aspireAi,IDS.vivobookArm]
  const ranks = Object.fromEntries(activeIds.map((id,index)=>[id,index+1]))
  const listItems = page.listItems.filter(item => activeIds.includes(item.product?._ref)).map(item => ({...item,rank:ranks[item.product._ref]}))
  return {
    title: '8 Best AI-Powered Laptops in UAE (2026) – Ranked by NPU & Buying Fit',
    intro: 'Compare eight currently orderable AI laptops for UAE buyers, ranked by verified NPU metrics, overall value and buying fit. Two unavailable offers were removed after the 16 September 2026 marketplace recheck.',
    keyTakeaways: [
      'Eight exact AI-laptop offers remained orderable on 16 September 2026; the unavailable ProArt P16 and Yoga Slim 7x were removed.',
      'Best overall: ASUS Zenbook S 16, with an explicit warning that Amazon’s title and overview conflict on the processor label.',
      'Highest published NPU figure here: Surface Laptop 15 with Snapdragon X2 Elite, subject to Windows-on-Arm and Amazon display-size checks.',
      'Do not compare Apple Neural Engine descriptions, NPU-only TOPS, combined platform TOPS and GPU AI TOPS as the same measurement.',
    ],
    lastReviewedAt: REVIEWED_AT,
    listItems,
    body: updateBlockByKey(page.body, {
      aiquick: p('aiquick','The ASUS Zenbook S 16 is the best overall fit for premium Windows buyers who accept the listing’s processor-label conflict. Choose the Surface Laptop 15 for the 80-TOPS Snapdragon X2 NPU, the HP OmniBook X Flip for a 2-in-1, the Dell XPS 13 for a compact x86 design, or the ASUS Vivobook 16 for the lowest-cost Copilot+ entry—after checking Windows-on-Arm compatibility where applicable.'),
      aicomparetable: table('aicomparetable', [
        ['Buyer priority','Recommended model','Published NPU / AI metric'],
        ['Best overall','ASUS Zenbook S 16 UM5606GA','50 NPU TOPS'],
        ['Highest NPU','Surface Laptop 15 (8th Edition)','80 NPU TOPS'],
        ['Best Mac','MacBook Pro 14 M5','16-core Neural Engine; no official TOPS'],
        ['Best 2-in-1','HP OmniBook X Flip 16','47 NPU TOPS'],
        ['Best value','ASUS Vivobook 16 X1607QA','45 NPU TOPS'],
      ]),
    }),
    seo: {...page.seo,metaTitle:'Best AI Laptops UAE 2026: 8 Verified Picks',metaDescription:'Compare eight orderable AI laptops in the UAE by NPU metrics, app compatibility, configuration and current marketplace risk.'},
  }
}

const updateBudget = page => {
  const item = page.listItems.find(entry => entry.product?._ref === IDS.budgetChromebook)
  assert(item, 'Budget Chromebook list item missing')
  return {
    title: 'Best Laptop Under 1500 AED in UAE (2026): Current Verified Pick',
    intro: 'Only one existing recommendation remained both orderable and within the AED 1,500 ceiling when rechecked on 16 September 2026: the Lenovo Slim 3 Chromebook at AED 1,494.31. Five orderable Windows offers had moved above the price ceiling and one HP offer was unavailable, so they were removed instead of padding the list.',
    keyTakeaways: [
      'Current verified pick: Lenovo Slim 3 Chromebook for browser-based study and Google Workspace.',
      'The observed AED 1,494.31 price is a dated snapshot, not a guarantee; recheck before ordering.',
      'Windows buyers should not substitute ChromeOS without confirming every required course or work application.',
    ],
    lastReviewedAt: REVIEWED_AT,
    listItems: [{...item,rank:1,badgeLabel:'Current verified pick under AED 1,500',whySelected:'The only existing recommendation that was both orderable and within the AED 1,500 ceiling during the current exact-offer check.',skipIf:'Skip it if you need Windows-only desktop software, more than 4GB RAM or dependable UAE manufacturer warranty.'}],
    body: updateBlockByKey(page.body, {
      b98a4def7e86: p('b98a4def7e86','The current verified choice is a Chromebook, so it suits browser research, Google Workspace, video calls and streaming. It is not a drop-in replacement for Windows-only course software. We removed products that moved above AED 1,500 or became unavailable rather than preserving an artificial product count.'),
      '23225d529cd6': block('23225d529cd6','blockquote',['The Amazon.ae offer was checked on 16 September 2026. Price, seller and stock can change; verify the exact ASIN and final checkout total before buying.']),
      f6ac59414d81: p('f6ac59414d81','We re-opened every exact existing Amazon route, resolved all legacy short links, and retained only an offer that was orderable and within the AED 1,500 ceiling. No replacement was silently introduced because new product-review pages are outside this offer-refresh phase.'),
    }),
    methodology: [p('phase1budgetlaptopmethod','TopTenUAE did not conduct hands-on lab tests. On 16 September 2026 we opened every exact existing Amazon.ae route, recorded configuration, seller, fulfilment and orderability, and removed products that were unavailable or above the page’s AED 1,500 ceiling.')],
    seo: {...page.seo,metaTitle:'Best Laptop Under 1500 AED UAE: Verified 2026 Pick',metaDescription:'See the current verified laptop pick under AED 1,500 in the UAE, with exact Amazon.ae configuration, seller and marketplace-risk checks.'},
  }
}

const updatePlatform = page => ({
  lastReviewedAt: REVIEWED_AT,
  body: (page.body || []).map(item => item?._type === 'decisionProduct' && item.asin === 'B0GR1N3L6Q'
    ? {...item,offerCheckedAt:CHECKED_DATE,availabilityStatus:'available',affiliateLink:amazon('B0GR1N3L6Q'),limitation:'Amazon.ae sold and shipped the English-keyboard 16GB/512GB M5 offer at AED 5,499 when checked. Amazon’s overview separately displayed Apple M4; base UAE warranty and the Type-G lead were unverified.'}
    : item),
})

async function verify(client) {
  const result = await client.fetch(`{
    "pages": *[_id in $pageIds]{_id,title,lastReviewedAt,seo,"slug":slug.current,listItems[]{rank,product->{_id,asin,affiliateLink,availabilityStatus,availabilityCheckedAt}}},
    "products": *[_id in $productIds]{_id,title,asin,affiliateLink,price,availabilityStatus,availabilityCheckedAt,uaeCommerce,"slug":slug.current},
    "platform": *[_id == $platformId][0]{_id,lastReviewedAt,"offers":body[_type=="decisionProduct"]{asin,affiliateLink,availabilityStatus,offerCheckedAt}}
  }`, {pageIds:Object.values(PAGE_IDS).filter(id=>id!==PAGE_IDS.platform),productIds:Object.keys(productUpdates),platformId:PAGE_IDS.platform})
  assert(result.pages.length === 6, 'Expected six money pages')
  assert(result.products.length === Object.keys(productUpdates).length, 'Product verification count mismatch')
  const pageById = Object.fromEntries(result.pages.map(page => [page._id,page]))
  assert(pageById[PAGE_IDS.general].listItems.length === 7, 'General page must have seven active products')
  assert(pageById[PAGE_IDS.student].listItems.length === 5, 'Student page must have five active products')
  assert(pageById[PAGE_IDS.ai].listItems.length === 8, 'AI page must have eight active products')
  assert(pageById[PAGE_IDS.budget].listItems.length === 1, 'Budget page must have one verified in-budget product')
  for (const page of result.pages) {
    assert(page.lastReviewedAt === REVIEWED_AT, `Stale page date: ${page._id}`)
    assert(page.seo?.noIndex === false, `Page became noindex: ${page._id}`)
    for (const item of page.listItems || []) assert(item.product?.availabilityStatus === 'available', `Unavailable product remains in ${page._id}`)
  }
  for (const product of result.products) {
    assert(product.availabilityCheckedAt === CHECKED_DATE, `Stale product date: ${product._id}`)
    if (product.availabilityStatus === 'unavailable') {
      assert(product.affiliateLink == null, `Unavailable product has CTA: ${product._id}`)
      continue
    }
    const url = new URL(product.affiliateLink)
    assert(url.hostname === 'www.amazon.ae', `Non-Amazon host: ${product._id}`)
    assert(url.pathname === `/dp/${product.asin}`, `ASIN mismatch: ${product._id}`)
    assert(url.searchParams.get('tag') === TAG, `Tag mismatch: ${product._id}`)
  }
  const m5 = result.platform.offers.find(offer => offer.asin === 'B0GR1N3L6Q')
  assert(m5?.offerCheckedAt === CHECKED_DATE && new URL(m5.affiliateLink).searchParams.get('tag') === TAG, 'MacBook Air M5 decision offer mismatch')
  return result
}

async function main() {
  const mode = process.argv.find(arg => ['--plan','--write','--validate'].includes(arg))
  assert(mode, 'Choose --plan, --write or --validate')
  assert(TAG === 'apfunbox06-21', 'Expected approved Amazon tag apfunbox06-21')
  const token = getWriteToken()
  if (mode === '--write') assert(token, 'Sanity write token required')
  const client = createClient({projectId:PROJECT_ID,dataset:DATASET,apiVersion:API_VERSION,useCdn:false,token,perspective:mode==='--write'?'raw':'published'})
  if (mode === '--validate') {
    const result = await verify(client)
    console.log(JSON.stringify({ok:true,mode:'validate',pages:result.pages.length,products:result.products.length},null,2))
    return
  }
  const state = await client.fetch(`{
    "pages": *[_id in $pageIds],
    "products": *[_id in $productIds],
    "drafts": *[_id in $draftIds]{_id}
  }`, {pageIds:Object.values(PAGE_IDS),productIds:Object.keys(productUpdates),draftIds:[...Object.values(PAGE_IDS),...Object.keys(productUpdates)].map(id=>`drafts.${id}`)})
  assert(state.pages.length === 7, 'One or more Phase 5 pages are missing')
  assert(state.products.length === Object.keys(productUpdates).length, 'One or more Phase 5 products are missing')
  assert(state.drafts.length === 0, `Draft collision: ${state.drafts.map(doc=>doc._id).join(', ')}`)
  const pageById = Object.fromEntries(state.pages.map(page=>[page._id,page]))
  const pageUpdates = {
    [PAGE_IDS.general]: updateGeneral(pageById[PAGE_IDS.general]),
    [PAGE_IDS.student]: updateStudent(pageById[PAGE_IDS.student]),
    [PAGE_IDS.ai]: updateAi(pageById[PAGE_IDS.ai]),
    [PAGE_IDS.budget]: updateBudget(pageById[PAGE_IDS.budget]),
    [PAGE_IDS.business]: {lastReviewedAt:REVIEWED_AT},
    [PAGE_IDS.gaming]: {lastReviewedAt:REVIEWED_AT},
    [PAGE_IDS.platform]: updatePlatform(pageById[PAGE_IDS.platform]),
  }
  if (mode === '--plan') {
    console.log(JSON.stringify({ok:true,mode:'plan',pages:Object.keys(pageUpdates),products:Object.keys(productUpdates),unavailable:Object.entries(productUpdates).filter(([,value])=>value.availabilityStatus==='unavailable').map(([id])=>id)},null,2))
    return
  }
  let tx = client.transaction()
  for (const product of state.products) tx = tx.patch(product._id, patch => patch.ifRevisionId(product._rev).set(productUpdates[product._id]))
  for (const page of state.pages) tx = tx.patch(page._id, patch => patch.ifRevisionId(page._rev).set(pageUpdates[page._id]))
  const commit = await tx.commit({visibility:'sync',returnDocuments:false})
  const result = await verify(client.withConfig({perspective:'published'}))
  console.log(JSON.stringify({ok:true,mode:'write',transactionId:commit.transactionId,pages:result.pages.length,products:result.products.length},null,2))
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1 })
