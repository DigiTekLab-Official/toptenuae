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
const AUTHOR_ID = '059ea742-ef28-47ce-a2f7-97f71ece3fa1'
const LAPTOP_CATEGORY_ID = '4bb228fd-41d6-401c-ae08-469e40084bca'
const GENERAL_ID = 'ec4a75a5-8acf-4103-bf86-3a040477e0d7'
const GAMING_ID = 'topten-best-gaming-laptops-uae'
const BUYING_GUIDE_ID = 'buyer-guide-how-to-choose-laptop-uae'
const STUDENT_ID = 'topten-best-laptops-for-students-uae'
const AI_ID = 'ccef5038-23f4-4cf1-9b3b-2fc34a217c04'
const BUDGET_ID = '2d7cd630-2309-4f3e-b81a-65d4b6811e00'

const ids = {
  yoga: 'b1692b2a-b273-42d8-af7b-b39eba1cb623',
  rog: '91332102-fe66-4c24-ae49-8dd93206f3ed',
  thinkpad: 'abf7eeb0-f82f-46b2-b3c9-0cc77bf5bcdc',
  victus: '811d6310-4994-4085-a2e8-d22b084e5206',
  surface: '1b91e5bc-9f50-4100-9688-9891adbd0a7b',
  vivobook: 'c5f619e8-3efa-45b3-832f-e3e66ab3c920',
  legion: 'e8f797ea-b7c8-4b7f-be1a-1fe0b87ca7b9',
  macM4: '83cb095b-5235-4ff2-aa9d-268d63450073',
  macM2: '2ef66e3f-3820-4770-8971-90bb8bcf0557',
  nitro: '9abe1b9c-c15d-43c4-8eee-9834e3ccfc8d',
}

const expectedProductIds = Object.values(ids)
const partnerTag = process.env.AMAZON_PARTNER_TAG || ''
const ref = (_ref, _key) => ({_type: 'reference', _ref, ...(_key ? {_key} : {})})
const amazon = asin => `https://www.amazon.ae/dp/${asin}?tag=${encodeURIComponent(partnerTag)}`
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
const source = (_key, title, publisher, url, note) => ({
  _key, _type: 'editorialSource', title, publisher, url, accessedAt: CHECKED_DATE, note,
})
const spec = (_key, specLabel, specValue) => ({_key, _type: 'object', specLabel, specValue})

class MigrationError extends Error {}
const assert = (condition, message) => { if (!condition) throw new MigrationError(message) }
const available = (asin, seller, fulfilment, keyboard) => ({
  affiliateLink: amazon(asin),
  retailer: 'Amazon.ae',
  availability: 'https://schema.org/InStock',
  availabilityStatus: 'available',
  availabilityCheckedAt: CHECKED_DATE,
  lastPriceCheckedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  uaeCommerce: {
    _type: 'uaeCommerceContext', availableInUae: true,
    availabilityNote: `Exact Amazon.ae ASIN ${asin} was orderable on ${CHECKED_DATE}; sold by ${seller}. ${keyboard}`,
    shippingNote: `${fulfilment} Confirm the live delivery date, return terms and total delivered cost for your UAE address.`,
    warrantyNote: 'A UAE manufacturer warranty was not established from the offer. Optional protection-plan advertising is not the same as manufacturer warranty; confirm the actual coverage and keep the invoice.',
    voltageOrCompatibility: 'The live offer did not establish a UAE Type-G plug. Confirm the charger input rating and included power lead before ordering; a plug adaptor does not convert voltage.',
  },
})
const unavailable = (asin, keyboard) => ({
  // Retain the exact ASIN in the verification note, but do not expose a
  // purchase path until the offer is orderable again.
  affiliateLink: null,
  retailer: 'Amazon.ae',
  availability: 'https://schema.org/OutOfStock',
  availabilityStatus: 'unavailable',
  availabilityCheckedAt: CHECKED_DATE,
  lastPriceCheckedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  uaeCommerce: {
    _type: 'uaeCommerceContext', availableInUae: false,
    availabilityNote: `Exact Amazon.ae ASIN ${asin} existed but had no orderable offer on ${CHECKED_DATE}. ${keyboard}`,
    shippingNote: 'No active fulfilment or delivery promise was available. The purchase CTA is suppressed until the exact offer is reverified.',
    warrantyNote: 'No current seller or UAE manufacturer warranty could be verified because the exact offer was unavailable.',
    voltageOrCompatibility: 'Confirm keyboard language, charger input and the included UAE Type-G power lead if this offer returns to stock.',
  },
})

const productUpdates = {
  [ids.yoga]: {
    ...available('B0FM3F1SGH', 'Byte Mart UAE', 'Delivered by Amazon.ae when checked.', 'The listing stated a backlit English keyboard.'),
    heroFeature: 'Versatile work, study and touch use',
  },
  [ids.rog]: {
    ...available('B0DZZWMB2L', 'Tech Point Zone Electronics Trading LLC', 'Fulfilled by Amazon when checked.', 'Keyboard language was not stated clearly enough to verify.'),
    heroFeature: 'RTX 5060 gaming at 1080p-class resolution',
  },
  [ids.thinkpad]: {
    ...available('B0DNQFK6B9', 'ByteHub Traders', 'Fulfilled by Amazon when checked.', 'The listing stated a backlit English keyboard.'),
    heroFeature: 'Business multitasking and Windows 11 Pro',
  },
  [ids.victus]: {
    ...available('B0DN5RWNNC', 'THE-LAPTOP SHOP', 'Fulfilled by Amazon when checked.', 'The listing stated an English backlit keyboard.'),
    heroFeature: 'Best-value RTX 4050 gaming',
  },
  [ids.surface]: {
    ...available('B0DZBMVVLT', 'TechFlip By CompuLogic', 'Fulfilled by Amazon when checked.', 'Keyboard language was not stated clearly enough to verify.'),
    heroFeature: 'Compact Windows-on-Arm mobility',
  },
  [ids.vivobook]: {
    ...available('B0FHHJW4NP', 'Notebook Zone', 'Delivered by Amazon.ae when checked.', 'Keyboard language was not stated clearly enough to verify.'),
    heroFeature: 'Everyday office and study value',
  },
  [ids.legion]: {
    ...available('B0F6NRYPPG', 'Amazon US', 'The live offer was a cross-border Amazon US offer; a separate UAE fulfilment label was not exposed.', 'Keyboard language was not stated clearly enough to verify.'),
    heroFeature: 'OLED gaming and heavier creator workloads',
    specifications: [
      spec('legionspec0', 'Family', 'Lenovo Legion 5i 15IRX10'),
      spec('legionspec1', 'Processor', 'Intel Core i7-14700HX in the checked offer'),
      spec('legionspec2', 'Memory / storage', '16GB RAM / 1TB SSD in the checked offer'),
      spec('legionspec3', 'Display', '15-inch 2.5K (2560 × 1600) OLED, 165Hz'),
      spec('legionspec4', 'Graphics', 'NVIDIA GeForce RTX 5070 Laptop GPU, 8GB GDDR7'),
      spec('legionspec5', 'Offer route', 'Cross-border offer sold by Amazon US; verify import and warranty terms'),
    ],
  },
  [ids.macM4]: {
    ...unavailable('B0DZDXCFJQ', 'The selected variant stated an Arabic/English keyboard.'),
    heroFeature: 'Mac option to monitor for restock',
    specifications: [
      spec('m4spec0', 'Model', 'MacBook Air 13-inch (M4, 2025)'),
      spec('m4spec1', 'Processor', 'Apple M4, 10-core CPU'),
      spec('m4spec2', 'Graphics', '10-core GPU in the exact selected variant'),
      spec('m4spec3', 'Memory / storage', '16GB unified memory / 512GB SSD in the exact selected variant'),
      spec('m4spec4', 'Display', '13.6-inch Liquid Retina, 2560 × 1664'),
      spec('m4spec5', 'Keyboard / stock', 'Arabic/English; exact ASIN unavailable when checked'),
    ],
  },
  [ids.macM2]: {
    ...unavailable('B0DLHFZ7TW', 'The selected style was Arabic/English; the exact variant was unavailable.'),
    heroFeature: 'Older Mac value only after restock',
  },
  [ids.nitro]: {
    ...unavailable('B0FWXM6R9N', 'The listing stated an English keyboard.'),
    heroFeature: 'RTX 5050 alternative only after restock',
  },
}

const generalBody = [
  h2('lapquickh', 'The short answer'),
  p('lapquick', 'For most UAE buyers, start with the Lenovo Yoga 7i when a 16-inch touchscreen convertible fits your routine. Choose the ASUS Vivobook 14 for simpler everyday value, the ThinkPad E16 Gen 2 for office-heavy multitasking, the HP Victus for lower-cost RTX gaming, or the Surface Laptop for compact Windows-on-Arm mobility. Every exact Amazon.ae destination was rechecked on 16 September 2026; unavailable offers are clearly marked and their CTAs are disabled.'),
  h2('lapdecisionh', 'Choose by workload, not by one universal ranking'),
  table('lapdecision', [
    ['Buyer need', 'Start with', 'Decision boundary'],
    ['Best overall', 'Lenovo Yoga 7i 16IML9', 'Large 16-inch convertible; no discrete GPU'],
    ['Best budget/value', 'ASUS Vivobook 14', 'Everyday office and study, not demanding creation or gaming'],
    ['Best for students', 'Student laptop guide', 'Compare portability, coding and engineering needs separately'],
    ['Best for business/office', 'ThinkPad E16 Gen 2', 'Verify seller-upgraded 32GB/1TB configuration'],
    ['Best for gaming', 'Gaming laptop guide', 'Choose by GPU, display, cooling and portability'],
    ['Best for portability', 'Surface Laptop 13-inch', 'Verify Windows-on-Arm software and peripheral support'],
    ['Best Mac option', 'MacBook Air M4', 'Exact checked offer was unavailable; do not click until reverified'],
    ['Best AI laptop', 'AI laptop guide', 'Compare NPU capability and app compatibility'],
  ]),
  p('lapspecialists', 'Use the ', {text: 'gaming laptop guide', href: '/top-ten/best-gaming-laptops-uae'}, ' for dedicated-GPU choices, the ', {text: 'student laptop guide', href: '/top-ten/best-laptops-for-students-uae'}, ' for university workloads, and the ', {text: 'AI laptop guide', href: '/top-ten/best-ai-laptops-uae'}, ' for NPU and Copilot+ decisions. For office use, compare the ThinkPad below and read its full review; a separate business list is not yet justified by the current inventory.'),
  p('lapbudget', 'If AED 1,500 is a hard ceiling, go directly to the ', {text: 'best laptops under AED 1,500 guide', href: '/top-ten/best-laptop-under-1500-aed-uae'}, '. If you are still deciding between CPU, RAM, SSD, GPU and display priorities, start with the ', {text: 'UAE laptop buying guide', href: '/laptops/how-to-choose-a-laptop-in-uae'}, '.'),
  h2('lapchecksh', 'UAE buying checks'),
  bullet('lapcheck1', 'Open the exact ASIN and confirm the selected RAM, storage, processor, GPU and display before paying.'),
  bullet('lapcheck2', 'Check the current seller and whether the offer is fulfilled by Amazon, delivered by Amazon.ae or shipped cross-border.'),
  bullet('lapcheck3', 'Confirm keyboard language, charger input, Type-G plug or regional power lead, return terms and who actually provides warranty service.'),
  bullet('lapcheck4', 'Treat the offer-check date as a snapshot: stock, seller and configuration can change without notice.'),
]

const generalClosing = [
  h2('lapchooseh', 'How to choose between these laptops'),
  bullet('lapchoose1', 'Choose the operating system and software compatibility first. Windows, Windows on Arm and macOS are not interchangeable for every application, game, driver or peripheral.'),
  bullet('lapchoose2', 'For general work and study, 16GB memory and a 512GB SSD are a practical baseline. Large games and media libraries make 1TB more useful.'),
  bullet('lapchoose3', 'Buy a dedicated GPU only when games or GPU-accelerated creation justify the extra cost, weight, heat and dependence on the charger.'),
  bullet('lapchoose4', 'Do not treat an optional third-party protection plan as proof of UAE manufacturer warranty.'),
  h2('lapresearchh', 'Research scope and limitations'),
  p('lapresearch', 'This comparison uses manufacturer documentation and exact Amazon.ae offer pages. TopTenUAE did not conduct hands-on benchmarks, battery rundown tests, display measurements, thermal testing, fan-noise testing or long-term durability testing for these laptops.'),
]

const gamingBody = [
  h2('gamingquickh', 'The short answer'),
  p('gamingquick', 'Choose the HP Victus 15 for the lowest-cost verified gaming role in this shortlist, the ASUS ROG Strix G16 for a step up to an RTX 5060 configuration, or the Lenovo Legion 5i when its OLED display and RTX 5070 justify a premium cross-border offer. The Acer Nitro V 16 AI was checked but excluded because its exact Amazon.ae offer was unavailable.'),
  h2('gaminggpuh', 'What the verified GPU tiers mean'),
  p('gaminggpu1', 'The Victus uses an RTX 4050 Laptop GPU and is the sensible starting point for 1080p-class gaming. The ROG moves to an RTX 5060 Laptop GPU, while the Legion uses an RTX 5070 Laptop GPU and pairs it with a higher-resolution OLED panel. Laptop GPU names alone do not guarantee a fixed frame rate: power limits, cooling, game settings and drivers materially affect results.'),
  p('gaminggpu2', 'TopTenUAE did not benchmark these machines. Use the GPU tier to narrow the shortlist, then check independent testing for the exact model and power configuration when a specific game or creator application matters.'),
]

const gamingClosing = [
  h2('gamingrealityh', 'Performance reality: heat, power and portability'),
  p('gamingreality1', 'Gaming laptops are designed to deliver their strongest performance near mains power. Expect larger chargers, more fan noise and shorter unplugged runtime than a general-purpose ultrabook. Cooling also depends on room temperature, airflow and the selected performance mode; no universal temperature or battery claim is made here.'),
  p('gamingreality2', 'The Legion offer is sold by Amazon US, so its import path and support risk differ from the two locally fulfilled marketplace offers. The Victus and ROG were fulfilled by Amazon when checked, but both were sold by third-party sellers. Seller and fulfilment can change, so recheck the buy box.'),
  h2('gamingcheckh', 'Gaming laptop buying checklist'),
  bullet('gamingcheck1', 'Match the GPU and display resolution to the games and settings you actually use.'),
  bullet('gamingcheck2', 'Confirm the exact RAM and SSD configuration, plus whether either was seller-upgraded.'),
  bullet('gamingcheck3', 'Check seller, fulfilment, return terms, keyboard language, charger and UAE warranty before paying.'),
  bullet('gamingcheck4', 'Plan desk space and travel around the laptop plus its power brick, not the laptop alone.'),
  bullet('gamingcheck5', 'For a non-gaming alternative, return to the ', {text: 'general laptop shortlist', href: '/top-ten/best-laptops-uae'}, ' or use the ', {text: 'AI laptop guide', href: '/top-ten/best-ai-laptops-uae'}, ' when NPU features matter more than a gaming GPU.'),
]

const gamingFaqs = [
  faq('gamingfaq1', 'Which gaming laptop is best for most UAE buyers?', 'The HP Victus is the value starting point in this verified shortlist, while the ROG Strix G16 offers a stronger RTX 5060 tier. Choose the Legion only when its OLED display, RTX 5070 configuration and higher cross-border cost fit your priorities.'),
  faq('gamingfaq2', 'Is an RTX 4050 laptop enough for 1080p gaming?', 'It can be a sensible 1080p-class starting point, but actual performance depends on the exact laptop power configuration, cooling, game, quality settings and driver version. No frame-rate promise is made here.'),
  faq('gamingfaq3', 'Should I buy a 1440p or OLED gaming laptop?', 'A higher-resolution or OLED panel can improve image quality, but it also raises price and may make native-resolution gaming more demanding. The Legion is the display-led option in this shortlist; buyers focused on value may prefer a lower-resolution high-refresh display.'),
  faq('gamingfaq4', 'Can I use a gaming laptop on battery?', 'Yes for light tasks, but sustained gaming performance is normally strongest on the supplied charger. Battery runtime varies substantially by workload, settings and power mode.'),
  faq('gamingfaq5', 'What should I verify on Amazon.ae before ordering?', 'Verify the exact ASIN, selected CPU, GPU, RAM, storage and display, plus the current seller, fulfilment, keyboard language, charger, return terms and whether warranty service is valid in the UAE.'),
]

const makeGamingArticle = general => ({
  _id: GAMING_ID,
  _type: 'topTenList',
  title: 'Best Gaming Laptops in UAE (2026): Picks by GPU and Budget',
  slug: {_type: 'slug', current: 'best-gaming-laptops-uae'},
  author: ref(AUTHOR_ID),
  categories: [ref(LAPTOP_CATEGORY_ID, 'gaminglaptopcategory')],
  reviewSection: 'tech',
  publishedAt: REVIEWED_AT,
  originalPublishedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  showAffiliateDisclosure: true,
  affiliateDisclosure: 'TopTenUAE may earn a commission from qualifying Amazon.ae purchases. Rankings are editorial and are not determined by commission or seller stock.',
  mainImage: {...general.mainImage, alt: 'Laptop shortlist including a gaming notebook compared for UAE buyers'},
  intro: 'This UAE gaming laptop guide covers three distinct, currently orderable roles rather than forcing a ten-product list: an RTX 4050 value pick, an RTX 5060 step-up and an RTX 5070 OLED premium option. Exact Amazon.ae offers, sellers and fulfilment were checked on 16 September 2026. Prices and stock can change, so the page uses price tiers and asks you to verify the live buy box.',
  body: gamingBody,
  closingContent: gamingClosing,
  keyTakeaways: [
    'Best value: HP Victus 15 with RTX 4050 graphics and a 144Hz FHD display in the checked offer.',
    'Best RTX 5060 step-up: ASUS ROG Strix G16, with the exact 16GB/1TB configuration fulfilled by Amazon when checked.',
    'Best display-led premium pick: Lenovo Legion 5i OLED with RTX 5070, sold through a cross-border Amazon US offer.',
  ],
  whoItsFor: 'UAE buyers choosing among verified dedicated-GPU laptops for 1080p-class gaming, a stronger RTX 5060 tier or higher-resolution OLED gaming and creation.',
  whoShouldAvoid: 'Buyers who mainly browse, study or use office apps should avoid the extra weight, heat, fan noise and charger dependence and start with the general laptop guide.',
  methodology: [
    p('gamingmethod1', 'We started with the four existing gaming review assets, checked each exact Amazon.ae destination on 16 September 2026, and retained only the three orderable configurations with distinct buyer roles.'),
    p('gamingmethod2', 'Specifications are based on the exact marketplace offer identity and manufacturer documentation. TopTenUAE did not run game benchmarks, thermal measurements, display tests, noise tests or battery rundown tests.'),
  ],
  uaeContext: [
    p('gaminguae1', 'Confirm seller, fulfilment, return terms and UAE warranty at checkout. Marketplace sellers and cross-border offers can carry different support routes even when the ASIN remains the same.'),
    p('gaminguae2', 'Keyboard language and UAE Type-G charger inclusion were not established for every offer. Confirm both before purchase; a plug adaptor does not change voltage.'),
  ],
  sources: [
    source('gamingsource1', 'Victus 15-fa2701wm exact Amazon.ae offer', 'Amazon.ae', 'https://www.amazon.ae/dp/B0DN5RWNNC', 'Exact 16GB/512GB, RTX 4050, English-keyboard offer was orderable, sold by THE-LAPTOP SHOP and fulfilled by Amazon when checked.'),
    source('gamingsource2', 'ROG Strix G16 G615 exact Amazon.ae offer', 'Amazon.ae', 'https://www.amazon.ae/dp/B0DZZWMB2L', 'Exact RTX 5060, 16GB/1TB offer was orderable, sold by Tech Point Zone Electronics Trading LLC and fulfilled by Amazon when checked.'),
    source('gamingsource3', 'Legion 5i OLED exact Amazon.ae offer', 'Amazon.ae', 'https://www.amazon.ae/dp/B0F6NRYPPG', 'Exact i7-14700HX, RTX 5070, 16GB/1TB OLED offer was orderable as a cross-border Amazon US offer when checked.'),
  ],
  relatedBuyerGuide: ref(BUYING_GUIDE_ID),
  relatedContent: [ref(GENERAL_ID, 'gamingrelatedgeneral'), ref(AI_ID, 'gamingrelatedai'), ref(STUDENT_ID, 'gamingrelatedstudent')],
  listItems: [
    {_key: 'gamingitem1', _type: 'item', rank: 1, badgeLabel: 'Best value gaming laptop', whySelected: 'The lowest-cost orderable gaming role in this shortlist, with an RTX 4050 Laptop GPU and 144Hz FHD display.', skipIf: 'Skip it if display quality, low fan noise, light weight or long unplugged use matters more than gaming value.', product: ref(ids.victus)},
    {_key: 'gamingitem2', _type: 'item', rank: 2, badgeLabel: 'Best RTX 5060 step-up', whySelected: 'A distinct performance step with an RTX 5060 Laptop GPU, 165Hz 16-inch display and 1TB SSD in the exact offer.', skipIf: 'Skip it if portability, quiet everyday use or a lower purchase tier matters more than the stronger GPU.', product: ref(ids.rog)},
    {_key: 'gamingitem3', _type: 'item', rank: 3, badgeLabel: 'Best OLED premium option', whySelected: 'The display-led option for buyers who want a 2.5K OLED panel and RTX 5070 graphics for gaming plus heavier creator workloads.', skipIf: 'Skip it if you need a locally sold offer, low weight, long unplugged use or the best value for 1080p gaming.', product: ref(ids.legion)},
  ],
  faqs: gamingFaqs,
  seo: {
    _type: 'seo',
    metaTitle: 'Best Gaming Laptops UAE: Budget to Premium Picks',
    metaDescription: 'Compare verified gaming laptops in the UAE by RTX GPU, display and buyer fit, with current Amazon.ae seller, warranty and configuration checks.',
    keywords: ['best gaming laptop UAE', 'gaming laptop Dubai', 'RTX laptop UAE', 'gaming laptop for 1080p', 'gaming laptop for 1440p'],
    canonicalUrl: 'https://toptenuae.com/top-ten/best-gaming-laptops-uae',
    noIndex: false,
    schemaType: 'ItemList',
  },
})

const updateGeneral = general => {
  const laptopCategoryPresent = general.categories?.some(item => item?._ref === LAPTOP_CATEGORY_ID)
  return {
    title: '10 Best Laptops in UAE (2026): Reviews, Prices & Buying Guide',
    categories: laptopCategoryPresent ? general.categories : [...(general.categories || []), ref(LAPTOP_CATEGORY_ID, 'generalaptopcategory')],
    lastReviewedAt: REVIEWED_AT,
    mainImage: {...general.mainImage, alt: 'Modern Windows laptops, gaming laptops and a MacBook compared for UAE buyers'},
    intro: 'The Lenovo Yoga 7i is the best all-round starting point in this shortlist when a large touchscreen convertible fits your routine. The ASUS Vivobook 14 is the everyday-value pick, the ThinkPad E16 is the business choice, and the HP Victus starts the gaming tier. Exact Amazon.ae offers were checked on 16 September 2026; unavailable MacBook Air and Acer Nitro offers remain visible for transparency but cannot be clicked until reverified.',
    body: generalBody,
    closingContent: generalClosing,
    keyTakeaways: [
      'Start with workload and software compatibility, then compare the exact configuration—not the model family name alone.',
      'Six local marketplace offers and one cross-border Legion offer were orderable when checked; three exact offers were unavailable and have disabled CTAs.',
      'Verify seller, fulfilment, keyboard, charger and the actual warranty provider on Amazon.ae before ordering.',
    ],
    whoItsFor: 'UAE buyers who need a primary shortlist spanning general work, study, business, portability, gaming and macOS, with links to narrower specialist guides.',
    whoShouldAvoid: 'Buyers with a firm sub-AED 1,500 budget should use the dedicated budget guide. Specialist workstation users should verify software certification, GPU memory and vendor support separately.',
    methodology: [
      p('lapmethod1', 'This is an editorial-research comparison based on official manufacturer specifications, exact Amazon.ae offer identity and buyer-fit trade-offs. All ten destinations were rechecked on 16 September 2026.'),
      p('lapmethod2', 'TopTenUAE did not conduct hands-on performance benchmarks, battery rundown tests, display measurements, thermal measurements, noise measurements or long-term durability testing. Marketplace price, stock, seller and fulfilment are dated observations rather than durable claims.'),
    ],
    relatedBuyerGuide: ref(BUYING_GUIDE_ID),
    relatedContent: [ref(GAMING_ID, 'laprelatedgaming'), ref(STUDENT_ID, 'laprelatedstudent'), ref(AI_ID, 'laprelatedai'), ref(BUDGET_ID, 'laprelatedbudget')],
    affiliateDisclosure: 'TopTenUAE may earn a commission from qualifying Amazon.ae purchases. This does not change the price you pay or the editorial ranking.',
    seo: {
      _type: 'seo',
      metaTitle: 'Best Laptops UAE: 10 Picks for Work, Study & Gaming',
      metaDescription: 'Compare 10 UAE laptop picks for work, study, business, portability, gaming and macOS, with exact offer checks and specialist buying guides.',
      keywords: ['best laptop UAE', 'best laptops UAE 2026', 'laptop price UAE', 'best laptop for students UAE', 'gaming laptop UAE'],
      canonicalUrl: 'https://toptenuae.com/top-ten/best-laptops-uae',
      noIndex: false,
      schemaType: 'ItemList',
    },
    listItems: general.listItems.map(item => {
      const updates = {
        [ids.yoga]: ['Best overall', 'Best overall for buyers who want one Windows laptop for work, study and touch or tablet use.', 'Skip it if you need a discrete gaming GPU, a small travel chassis or upgradeable memory.'],
        [ids.rog]: ['Best gaming performance', 'Best gaming step-up for buyers prioritising an RTX 5060 Laptop GPU and a fast 16-inch display.', 'Skip it if low weight, quiet everyday use or long unplugged runtime matters more than gaming hardware.'],
        [ids.thinkpad]: ['Best for business and office', 'Best office-heavy choice for buyers who want 32GB memory, 1TB storage and Windows 11 Pro in the exact offer.', 'Skip it if you need a light commuter, dedicated graphics or a manufacturer-sealed factory upgrade.'],
        [ids.victus]: ['Best value gaming pick', 'Best value gaming role for buyers who want RTX 4050 graphics below the ROG and Legion tiers.', 'Skip it if display quality, low fan noise, light weight or long unplugged use is the priority.'],
        [ids.surface]: ['Best for portability', 'Best compact Windows mobility pick for buyers comfortable with Windows on Arm.', 'Skip it if critical software, games, drivers or peripherals have not been verified for Arm compatibility.'],
        [ids.vivobook]: ['Best everyday value', 'Best everyday value for office, browsing and study workloads that do not need a dedicated GPU.', 'Skip it if you need a premium display, demanding creation, modern gaming graphics or a clearly stated keyboard layout.'],
        [ids.legion]: ['Best display for gaming and creation', 'Best display-led gaming and creation option for buyers wanting OLED and RTX 5070 graphics.', 'Skip it if you need a locally sold offer, low weight, long battery life or a low-cost general-purpose laptop.'],
        [ids.macM4]: ['Mac option—currently unavailable', 'The strongest Mac role in the researched set, retained for transparent stock monitoring without an active CTA.', 'Skip it until an exact orderable Amazon.ae offer with clear seller and warranty details is reverified.'],
        [ids.macM2]: ['Older Mac—currently unavailable', 'An older Mac value option only when an exact orderable offer returns well below newer models.', 'Skip it while unavailable or whenever pricing approaches a newer MacBook Air.'],
        [ids.nitro]: ['Gaming alternative—currently unavailable', 'An RTX 5050 alternative retained for transparent stock monitoring without an active CTA.', 'Skip it until the exact offer becomes orderable and its current seller and warranty are verified.'],
      }[item.product?._ref]
      assert(updates, `Unexpected product in general list: ${item.product?._ref}`)
      return {...item, badgeLabel: updates[0], whySelected: updates[1], skipIf: updates[2]}
    }),
  }
}

const validateState = state => {
  assert(state.general?._id === GENERAL_ID, 'General laptop page is missing')
  assert(state.category?._id === LAPTOP_CATEGORY_ID, 'Laptop category is missing')
  assert(state.products?.length === expectedProductIds.length, `Expected ${expectedProductIds.length} product records`)
  assert(state.refs?.length === 4, 'One or more specialist guide references are missing')
  assert(!state.drafts?.length, `Draft collision detected: ${state.drafts.map(item => item._id).join(', ')}`)
}

const verifyPublished = async client => {
  const result = await client.fetch(`{
    "general": *[_id == $generalId][0]{_id,title,lastReviewedAt,seo,categories,listItems[]{rank,badgeLabel,product->{_id,affiliateLink,availabilityStatus,availabilityCheckedAt}}},
    "gaming": *[_id == $gamingId][0]{_id,title,"slug":slug.current,lastReviewedAt,seo,categories,relatedBuyerGuide,relatedContent,"faqCount":count(faqs),listItems[]{rank,badgeLabel,product->{_id,title,affiliateLink,availabilityStatus,availabilityCheckedAt}}},
    "category": *[_id == $categoryId][0]{_id,title,description,metaTitle}
  }`, {generalId: GENERAL_ID, gamingId: GAMING_ID, categoryId: LAPTOP_CATEGORY_ID})
  assert(result.general?.lastReviewedAt === REVIEWED_AT, 'General page review date mismatch')
  assert(result.general.listItems?.length === 10, 'General page no longer has ten researched entries')
  assert(result.gaming?.slug === 'best-gaming-laptops-uae', 'Gaming page is missing')
  assert(result.gaming.listItems?.length === 3, 'Gaming page must contain three verified roles')
  assert(result.gaming.listItems.every(item => item.product?.availabilityStatus === 'available'), 'Gaming page includes an unavailable product')
  assert(result.gaming.faqCount === 5, 'Gaming FAQ count mismatch')
  const allItems = [...result.general.listItems, ...result.gaming.listItems]
  const links = allItems.map(item => item.product?.affiliateLink).filter(Boolean)
  assert(links.every(value => new URL(value).hostname === 'www.amazon.ae'), 'A non-direct Amazon destination remains')
  assert(links.every(value => new URL(value).searchParams.get('tag') === partnerTag), 'Affiliate tag mismatch')
  assert(result.general.listItems.filter(item => item.product?.availabilityStatus === 'unavailable').every(item => !item.product?.affiliateLink), 'Unavailable offer still exposes a purchase path')
  return result
}

async function main() {
  const modes = process.argv.filter(arg => ['--plan', '--write', '--validate', '--suppress-unavailable'].includes(arg))
  assert(modes.length === 1, 'Choose exactly one mode: --plan, --write, --validate or --suppress-unavailable')
  const mode = modes[0].slice(2)
  assert(/^[A-Za-z0-9][A-Za-z0-9-]{2,59}$/.test(partnerTag), 'A valid AMAZON_PARTNER_TAG is required')
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
  if (mode === 'write' || mode === 'suppress-unavailable') assert(token, `A Sanity write token is required for --${mode}`)
  const client = createClient({projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: false, perspective: mode === 'write' ? 'raw' : 'published', token})
  const state = await client.fetch(`{
    "general": *[_id == $generalId][0],
    "gaming": *[_id == $gamingId][0],
    "category": *[_id == $categoryId][0],
    "products": *[_id in $productIds],
    "refs": *[_id in $refIds]{_id,_type},
    "drafts": *[_id in $draftIds]{_id}
  }`, {
    generalId: GENERAL_ID, gamingId: GAMING_ID, categoryId: LAPTOP_CATEGORY_ID,
    productIds: expectedProductIds, refIds: [BUYING_GUIDE_ID, STUDENT_ID, AI_ID, BUDGET_ID],
    draftIds: [GENERAL_ID, GAMING_ID, LAPTOP_CATEGORY_ID, ...expectedProductIds].map(id => `drafts.${id}`),
  })
  validateState(state)

  if (mode === 'suppress-unavailable') {
    assert(state.gaming?._id === GAMING_ID, 'Published gaming page is missing')
    let transaction = client.transaction()
    for (const product of state.products.filter(item => [ids.macM4, ids.macM2, ids.nitro].includes(item._id))) {
      transaction = transaction.patch(product._id, patch => patch.ifRevisionId(product._rev).set(productUpdates[product._id]))
    }
    const commit = await transaction.commit({visibility: 'sync', returnDocuments: false})
    const result = await verifyPublished(client.withConfig({perspective: 'published'}))
    console.log(JSON.stringify({ok: true, mode, transactionId: commit.transactionId, suppressedOffers: 3, gaming: result.gaming._id}, null, 2))
    return
  }

  if (mode === 'validate') {
    const result = await verifyPublished(client)
    console.log(JSON.stringify({ok: true, mode, general: result.general._id, gaming: result.gaming._id, gamingProducts: result.gaming.listItems.length}, null, 2))
    return
  }

  assert(!state.gaming, 'Gaming page already exists; use --validate instead of overwriting it')
  const generalSet = updateGeneral(state.general)
  const gaming = makeGamingArticle(state.general)
  if (mode === 'plan') {
    console.log(JSON.stringify({
      ok: true, mode, general: {id: GENERAL_ID, entries: generalSet.listItems.length},
      gaming: {id: GAMING_ID, entries: gaming.listItems.length},
      productUpdates: Object.entries(productUpdates).map(([id, update]) => ({id, status: update.availabilityStatus, destination: update.affiliateLink})),
      category: {id: LAPTOP_CATEGORY_ID, newTitle: 'Laptop Reviews & Buying Guides for UAE Shoppers'},
    }, null, 2))
    return
  }

  let transaction = client.transaction()
  transaction = transaction.patch(GENERAL_ID, patch => patch.ifRevisionId(state.general._rev).set(generalSet))
  transaction = transaction.create(gaming)
  transaction = transaction.patch(LAPTOP_CATEGORY_ID, patch => patch.ifRevisionId(state.category._rev).set({
    title: 'Laptop Reviews & Buying Guides for UAE Shoppers',
    metaTitle: 'Laptop Reviews & Buying Guides UAE | TopTenUAE',
    description: 'Compare UAE laptop buying guides for general use, gaming, students, AI features and tighter budgets, then read exact model reviews.',
  }))
  for (const product of state.products) {
    const update = productUpdates[product._id]
    assert(update, `Missing verified update for ${product._id}`)
    transaction = transaction.patch(product._id, patch => patch.ifRevisionId(product._rev).set(update))
  }
  const commit = await transaction.commit({visibility: 'sync', returnDocuments: false})
  const result = await verifyPublished(client.withConfig({perspective: 'published'}))
  console.log(JSON.stringify({ok: true, mode, transactionId: commit.transactionId, general: result.general._id, gaming: result.gaming._id, productsChecked: expectedProductIds.length}, null, 2))
}

main().catch(error => {
  console.error(error instanceof MigrationError ? error.message : error)
  process.exitCode = 1
})
