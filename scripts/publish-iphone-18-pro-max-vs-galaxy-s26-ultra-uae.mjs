import { createClient } from '@sanity/client';

const PROJECT_ID = 'kxdjzy8e';
const DATASET = 'production';
const API_VERSION = '2026-09-25';
const TARGET_ID = 'e6e60eb4-8919-4cab-a899-37c002c866c6';
const STANDALONE_IPHONE_ID = '22445f8e-607b-4a37-bebf-d826b5ffcb4b';
const IPHONE_GENERATION_ID = 'iphone-18-pro-vs-iphone-17-pro-uae';
const SAMSUNG_ID = 'cb9f71ac-f411-4051-9a19-0e126fc79001';

const TARGET_PATH = '/smartphones/iphone-18-pro-vs-samsung-galaxy-s26-ultra-uae';
const IPHONE_PATH = '/smartphones/iphone-18-pro-uae-price-specs';
const IPHONE_GENERATION_PATH = '/smartphones/iphone-18-pro-vs-iphone-17-pro-uae';
const SAMSUNG_PATH = '/smartphones/samsung-galaxy-s26-ultra-specs-uae-price';
const EARBUDS_PATH = '/top-ten/best-wireless-earbuds-uae';

const APPLE_NEWS = 'https://www.apple.com/ae/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/';
const APPLE_SPECS = 'https://www.apple.com/ae/iphone-18-pro/specs/';
const APPLE_BUY = 'https://www.apple.com/ae/shop/buy-iphone/iphone-18-pro';
const SAMSUNG_PRODUCT = 'https://www.samsung.com/ae/smartphones/galaxy-s26-ultra/';
const SAMSUNG_BUY = 'https://www.samsung.com/ae/smartphones/galaxy-s26-ultra/buy/';
const ONE_UI_9 = 'https://news.samsung.com/global/samsung-begins-official-rollout-of-one-ui-9-bringing-the-latest-galaxy-experiences-to-more-devices';

let sequence = 0;
const key = (prefix = 'k') => `${prefix}${String(++sequence).padStart(4, '0')}`;
const span = (text, marks = []) => ({ _key: key('s'), _type: 'span', marks, text });
const block = (text, style = 'normal', extra = {}) => ({
  _key: key('b'), _type: 'block', style, markDefs: [], children: [span(text)], ...extra,
});
const bullet = (text) => block(text, 'normal', { listItem: 'bullet', level: 1 });
const numbered = (text) => block(text, 'normal', { listItem: 'number', level: 1 });
const linkedBlock = (parts, style = 'normal') => {
  const markDefs = [];
  const children = parts.map((part) => {
    if (typeof part === 'string') return span(part);
    const markKey = key('m');
    markDefs.push({ _key: markKey, _type: 'link', href: part.href, blank: part.blank ?? false });
    return span(part.text, [markKey]);
  });
  return { _key: key('b'), _type: 'block', style, markDefs, children };
};
const table = (rows) => ({
  _key: key('t'), _type: 'table',
  rows: rows.map((cells) => ({ _key: key('r'), _type: 'tableRow', cells })),
});
const faq = (question, answer) => ({
  _key: key('f'), _type: 'faq', question, answer: [block(answer)],
});

const body = [
  block('Quick answer', 'h2'),
  block('Choose the iPhone 18 Pro Max if you want the longer manufacturer-rated video playback, Apple’s variable-aperture 48MP Main camera, strong professional video tools, MagSafe and tight integration with Apple devices. Choose the Galaxy S26 Ultra if you want a lighter phone, built-in S Pen, Privacy Display, more telephoto options, flexible SIM support and a lower official starting price.'),
  block('Both have 6.9-inch 120Hz OLED displays and flagship processors, but they solve different problems. The iPhone 18 Pro Max starts at AED 5,499 in the UAE; Samsung lists the Galaxy S26 Ultra 256GB at AED 5,099. That AED 400 difference is useful context, but live retailer discounts, trade-ins, warranty and storage tier can change the real gap.'),
  block('Prices and specifications checked: 25 September 2026. Manufacturer battery and performance figures use different test methods and are not directly comparable.'),

  block('iPhone 18 Pro Max vs Galaxy S26 Ultra: specifications', 'h2'),
  table([
    ['Feature', 'iPhone 18 Pro Max', 'Galaxy S26 Ultra'],
    ['Official UAE starting price', 'AED 5,499', 'AED 5,099'],
    ['Display', '6.9-inch Super Retina XDR OLED; ProMotion up to 120Hz', '6.9-inch QHD+ Dynamic AMOLED 2X; up to 120Hz'],
    ['Peak brightness claim', '3,000 nits outdoors', '2,600 nits'],
    ['Processor', 'A20 Pro', 'Snapdragon 8 Elite Gen 5 for Galaxy'],
    ['Main camera', '48MP Fusion Main; variable aperture', '200MP Wide; F1.4'],
    ['Other rear cameras', '48MP Ultra Wide; 48MP 4x Telephoto', '50MP Ultra Wide; 50MP 5x and 10MP 3x Telephoto'],
    ['Front camera', '18MP Center Stage', '12MP'],
    ['Video playback claim', 'Up to 45 hours', 'Up to 31 hours'],
    ['Charging claim', 'Up to 50% in about 15 minutes with compatible 60W+ adapter', 'Up to 75% in about 30 minutes with compatible adapter'],
    ['Storage', '256GB, 512GB, 1TB, 2TB', '256GB, 512GB, 1TB'],
    ['Weight / thickness', '249g / 8.75mm', '214g / 7.9mm'],
    ['SIM in UAE', 'Dual eSIM; no physical SIM', 'Physical SIM and eSIM combinations, depending on configuration'],
    ['Distinctive feature', 'Variable aperture, Pro video and MagSafe', 'S Pen, Privacy Display and One UI 9'],
  ]),

  block('UAE price and value', 'h2'),
  linkedBlock(['Apple UAE lists ', { text: 'iPhone 18 Pro Max', href: APPLE_BUY, blank: true }, ' from AED 5,499, with 256GB, 512GB, 1TB and 2TB capacities. Samsung’s official UAE pricing starts at AED 5,099 for the 256GB/12GB Galaxy S26 Ultra, AED 5,899 for 512GB/12GB and AED 7,099 for 1TB/16GB.']),
  block('At base storage, Samsung is AED 400 cheaper. The better value depends on what you will use: paying more for the iPhone may make sense for Apple ecosystem integration, its battery rating or professional video workflow; Samsung offers hardware extras such as the S Pen and Privacy Display while costing less at entry level.'),
  block('Retail prices can move quickly. Compare the same storage capacity, verify the seller and UAE warranty, and check the final price after trade-in or bank offers. An international model can have different SIM, warranty or service arrangements.'),

  block('Design and daily handling', 'h2'),
  block('These are both large phones, but their weight differs sharply. The iPhone 18 Pro Max is 163.4 × 78.0 × 8.75mm and 249g. The Galaxy S26 Ultra is 163.6 × 78.1 × 7.9mm and 214g. Their footprint is almost the same, yet Samsung is 35g lighter and 0.85mm thinner.'),
  block('That makes the Galaxy the easier option for long one-handed use even though neither is compact. The iPhone uses an aluminum unibody with Ceramic Shield 2 on the front and Ceramic Shield on the back. Samsung uses Armor Aluminum and Gorilla Armor 2. Both carry IP68 water- and dust-resistance ratings, subject to manufacturer conditions.'),

  block('Display: two 6.9-inch flagships, one with Privacy Display', 'h2'),
  block('Both phones use 6.9-inch OLED displays with adaptive refresh rates up to 120Hz. Apple lists a 2868-by-1320 Super Retina XDR panel, Always-On display, anti-reflective coating and up to 3,000 nits peak outdoor brightness. Samsung lists a 3120-by-1440 QHD+ Dynamic AMOLED 2X display with up to 2,600 nits peak brightness.'),
  block('Samsung’s differentiator is built-in Privacy Display. It can reduce side-angle visibility across the full screen or selected apps, notifications and sensitive input areas. It is useful on public transport or in shared spaces, although it is not a replacement for account security or awareness of your surroundings.'),
  block('Apple’s advantage is its higher outdoor-brightness claim and integration with features such as the Always-On display and Dynamic Island. Display preference should still be judged in person: resolution, color tuning, reflections and viewing comfort matter more than a single peak-nit number.'),

  block('Cameras: variable aperture versus more zoom choices', 'h2'),
  block('The iPhone 18 Pro Max has a 48MP Fusion Main camera with selectable f/1.48, f/1.8, f/2.8 and f/4 apertures, a 48MP Ultra Wide and a 48MP 4x Telephoto that also provides an 8x optical-quality option. Its 18MP Center Stage front camera supports autofocus and automatic framing.'),
  block('The Galaxy S26 Ultra uses a 200MP F1.4 main camera, 50MP Ultra Wide, 50MP 5x Telephoto and 10MP 3x Telephoto, plus a 12MP front camera. The two dedicated telephoto lenses give Samsung more native focal-length flexibility, especially between portrait and longer zoom ranges.'),
  block('Apple’s variable aperture is the more distinctive main-camera control. It can open wider in low light or narrow for additional depth of field, and Pro controls expose aperture, shutter speed, white balance and a histogram. Samsung’s pitch is versatility: a very high-resolution main sensor, two telephotos and Galaxy AI-assisted capture and editing.'),
  block('Neither megapixel count nor zoom label determines the winner in every scene. Processing, subject motion, lighting and the chosen mode all matter. This guide compares verified specifications and workflows; it does not claim a laboratory camera-test winner.'),

  block('Video and creator tools', 'h2'),
  block('The iPhone is the clearer fit for a workflow built around ProRes RAW, Apple Log 2, the Academy Color Encoding System, genlock and external USB-C recording. Apple lists Dolby Vision capture up to 4K at 120 fps on the rear camera system, subject to the supported mode and storage setup.'),
  block('Samsung supports high-resolution video, Super Steady stabilization and One UI 9’s My FanCam, which can track a selected person in recorded footage and reframe them. For quick social edits and flexible zoom capture, that toolset may be more approachable. For a managed professional production pipeline, Apple’s formats and color tools are the stronger differentiator.'),

  block('Performance, gaming and cooling', 'h2'),
  block('Apple’s A20 Pro combines a 6-core CPU, 7-core GPU and Dual 16-core Neural Engine. Samsung uses Snapdragon 8 Elite Gen 5 for Galaxy. Both companies make large performance claims against their previous generations; those claims are useful for direction, not for declaring a cross-platform winner because the tests and baselines differ.'),
  block('Both phones also emphasize vapor-chamber cooling for sustained work. In practice, either should handle demanding games, photo processing and video editing. Your app library and ecosystem are likely more important than a headline benchmark: some creative workflows favor iOS, while Android offers more interface flexibility, split-screen tools and DeX-style external-display use.'),

  block('Battery and charging', 'h2'),
  block('Apple rates the iPhone 18 Pro Max for up to 30 hours of typical use, 45 hours of video playback and 40 hours of streamed video playback. Samsung lists a 5,000mAh battery and up to 31 hours of video playback for the Galaxy S26 Ultra. These are manufacturer ratings from different test procedures, so 45 versus 31 is not a controlled head-to-head result.'),
  block('Apple says either iPhone 18 Pro model can reach 50% in about 15 minutes with a compatible 60W-or-higher USB-C adapter. It also supports MagSafe and Qi2 wireless charging up to 25W. Samsung says the S26 Ultra can reach up to 75% in around 30 minutes with a compatible adapter. Neither headline should be treated as a full-charge time, and actual charging varies with heat, settings and accessory support.'),

  block('Software, AI and update experience', 'h2'),
  block('The iPhone 18 Pro Max ships with iOS 27 and Apple Intelligence features. It fits most naturally with AirPods, Apple Watch, Mac, iPad, iCloud, AirDrop and iMessage. Apple does not advertise a fixed seven-year update promise on the product specification page, so this guide does not invent one.'),
  linkedBlock(['The Galaxy S26 Ultra launched with Samsung’s One UI and is now part of the ', { text: 'official One UI 9 rollout', href: ONE_UI_9, blank: true }, '. Samsung highlights My FanCam, customizable Now Brief cards, Warranty and Care, contextual Now Nudge features, Security Brief and Privacy Alerts. Availability can vary by market, model and account conditions.']),
  block('Samsung commits the S26 series to seven generations of OS upgrades and seven years of security updates. That is a clearer written support window; it does not automatically make one platform’s day-to-day software experience better. Pick according to the services and devices you already rely on.'),

  block('S Pen, biometrics and SIM differences', 'h2'),
  bullet('Galaxy S26 Ultra includes a built-in S Pen for notes, markup and precise selection. iPhone has no integrated stylus equivalent.'),
  bullet('iPhone uses Face ID. Galaxy offers an ultrasonic fingerprint reader and face recognition.'),
  bullet('UAE iPhone 18 Pro Max models are dual-eSIM only and have no physical SIM tray.'),
  bullet('Galaxy S26 Ultra supports physical SIM and eSIM combinations, depending on the exact UAE configuration.'),
  block('Frequent travelers should confirm carrier eSIM support before choosing iPhone. Buyers who need a physical work SIM or regularly swap cards have more flexibility with Samsung.'),

  block('Which should you buy?', 'h2'),
  block('Buy iPhone 18 Pro Max if', 'h3'),
  bullet('You use a Mac, Apple Watch, AirPods, iCloud or other Apple services every day.'),
  bullet('Variable aperture, manual camera controls, ProRes RAW or Apple Log 2 fit your photo/video workflow.'),
  bullet('Apple’s up-to-45-hour video-playback rating and MagSafe ecosystem matter to you.'),
  bullet('You need a 2TB factory storage option.'),
  bullet('You are comfortable using eSIM only in the UAE and when traveling.'),
  block('Buy Galaxy S26 Ultra if', 'h3'),
  bullet('You want a lighter and thinner phone with the same nominal 6.9-inch screen size.'),
  bullet('You will use the built-in S Pen, Privacy Display, split-screen tools or Samsung DeX.'),
  bullet('You prefer two dedicated telephoto cameras and flexible long-range zoom choices.'),
  bullet('Physical SIM flexibility or Samsung’s explicit seven-year support policy matters.'),
  bullet('The AED 400 lower official starting price improves the value for your needs.'),

  block('UAE buying checklist', 'h2'),
  numbered('Compare the same storage tier, not only each brand’s cheapest headline price.'),
  numbered('Confirm UAE warranty coverage, model number, seller and dispatcher before paying.'),
  numbered('For iPhone, confirm eSIM activation and travel support with e& or du and any overseas carrier you use.'),
  numbered('For Galaxy, confirm the SIM configuration, RAM, storage and whether the colour is Samsung.com-exclusive.'),
  numbered('Budget for a compatible charger if you want the advertised fast-charge result; verify what is included in the box.'),
  numbered('Check trade-in value, return window and accidental-damage coverage separately.'),

  block('Related UAE smartphone guides', 'h2'),
  linkedBlock(['For Apple specifications, pricing and camera details, read our ', { text: 'iPhone 18 Pro UAE guide', href: IPHONE_PATH }, '. If you are upgrading within Apple’s lineup, compare ', { text: 'iPhone 18 Pro vs iPhone 17 Pro', href: IPHONE_GENERATION_PATH }, '.']),
  linkedBlock(['For a deeper look at Samsung pricing, Privacy Display, cameras and the latest software, see our ', { text: 'Samsung Galaxy S26 Ultra UAE guide', href: SAMSUNG_PATH }, '. You can also compare companion audio in our ', { text: 'best wireless earbuds in the UAE', href: EARBUDS_PATH }, '.']),

  block('Final verdict', 'h2'),
  block('The iPhone 18 Pro Max is the better match for Apple ecosystem users, professional video workflows, MagSafe buyers and anyone prioritizing Apple’s longest current battery rating. The Galaxy S26 Ultra is the more versatile hardware package for S Pen users, Android multitasking, physical-SIM flexibility, built-in screen privacy and multiple telephoto focal lengths.'),
  block('For many UAE buyers, the decision is ecosystem first and specifications second. If you are genuinely platform-neutral, handle both phones in store, compare the exact storage tier and warranty, and choose the features you will use weekly—not the longest specification list.'),

  block('Official sources', 'h2'),
  linkedBlock(['Apple details were verified using the ', { text: 'Apple UAE launch announcement', href: APPLE_NEWS, blank: true }, ', ', { text: 'iPhone 18 Pro and Pro Max technical specifications', href: APPLE_SPECS, blank: true }, ' and ', { text: 'Apple UAE store', href: APPLE_BUY, blank: true }, '.']),
  linkedBlock(['Samsung details were verified using the ', { text: 'Galaxy S26 Ultra product page', href: SAMSUNG_PRODUCT, blank: true }, ', ', { text: 'Samsung UAE buying page', href: SAMSUNG_BUY, blank: true }, ' and the ', { text: 'One UI 9 rollout announcement', href: ONE_UI_9, blank: true }, '.']),
];

const faqs = [
  faq('How much is the iPhone 18 Pro Max in the UAE?', 'Apple UAE lists the iPhone 18 Pro Max from AED 5,499. It is available with 256GB, 512GB, 1TB or 2TB storage.'),
  faq('How much is the Samsung Galaxy S26 Ultra in the UAE?', 'Samsung UAE lists the Galaxy S26 Ultra from AED 5,099 for 256GB/12GB, AED 5,899 for 512GB/12GB and AED 7,099 for 1TB/16GB.'),
  faq('Which phone has better battery life?', 'Apple rates the iPhone 18 Pro Max for up to 45 hours of video playback, while Samsung rates the Galaxy S26 Ultra for up to 31 hours. The companies use different tests, so the figures are not a controlled head-to-head comparison.'),
  faq('Which phone is lighter?', 'The Galaxy S26 Ultra is lighter at 214g. The iPhone 18 Pro Max weighs 249g, a difference of 35g.'),
  faq('Which phone has the better camera?', 'There is no universal winner. iPhone emphasizes variable aperture, manual controls and professional video formats; Galaxy offers a 200MP main camera and two dedicated telephoto cameras for more zoom flexibility.'),
  faq('Does iPhone 18 Pro Max have a physical SIM tray in the UAE?', 'No. Apple’s UAE specifications list iPhone 18 Pro Max as dual-eSIM only and not compatible with physical SIM cards.'),
  faq('Does the Galaxy S26 Ultra include an S Pen?', 'Yes. The S Pen is built into the Galaxy S26 Ultra for notes, markup and precise input.'),
  faq('Does the Galaxy S26 Ultra have Privacy Display?', 'Yes. Its built-in Privacy Display can limit side-angle viewing for the whole screen or selected apps, notifications and sensitive inputs.'),
];

const update = {
  title: 'iPhone 18 Pro Max vs Samsung Galaxy S26 Ultra: UAE Comparison',
  updatedAt: '2026-09-25T00:00:00.000Z',
  lastReviewedAt: '2026-09-25T00:00:00.000Z',
  intro: [block('A UAE-focused iPhone 18 Pro Max vs Samsung Galaxy S26 Ultra comparison covering official prices, displays, cameras, battery, charging, software, SIM support and the features that should decide your purchase.')],
  methodology: [block('We compared current Apple UAE and Samsung Gulf product pages, technical specifications, official pricing and software announcements. Manufacturer battery and performance claims are labelled and are not treated as independent head-to-head test results. Prices were checked on 25 September 2026 and can change.')],
  body,
  faqs,
  schemaType: 'Guide',
  seo: {
    _type: 'seo',
    metaTitle: 'iPhone 18 Pro Max vs S26 Ultra UAE',
    metaDescription: 'iPhone 18 Pro Max vs Samsung Galaxy S26 Ultra in UAE: compare official price, camera, display, battery, charging, software and key features.',
    keywords: [
      'iPhone 18 Pro Max vs Samsung Galaxy S26 Ultra',
      'iPhone 18 Pro Max vs S26 Ultra UAE',
      'iPhone 18 Pro Max UAE price',
      'Galaxy S26 Ultra UAE price',
      'best flagship phone UAE',
    ],
    noIndex: false,
    schemaType: 'Guide',
  },
};

const clusterBlock = (before, anchor, after) => linkedBlock([
  before, { text: anchor, href: TARGET_PATH }, after,
]);

const hasLink = (bodyValue, href) => (bodyValue || []).some((item) =>
  (item.markDefs || []).some((mark) => mark?.href === href || mark?.href === `https://toptenuae.com${href}`),
);

const normalizeExistingTargetAnchor = (bodyValue) => {
  const next = structuredClone(bodyValue || []);
  let changed = false;
  for (const item of next) {
    const markKeys = new Set((item.markDefs || [])
      .filter((mark) => mark?.href === TARGET_PATH || mark?.href === `https://toptenuae.com${TARGET_PATH}`)
      .map((mark) => mark._key));
    if (!markKeys.size) continue;
    for (const child of item.children || []) {
      if ((child.marks || []).some((mark) => markKeys.has(mark)) && /iPhone 18 Pro(?! Max)/.test(child.text || '')) {
        child.text = child.text.replace(/iPhone 18 Pro(?! Max)/g, 'iPhone 18 Pro Max');
        changed = true;
      }
    }
  }
  return { body: next, changed };
};

const args = new Set(process.argv.slice(2));
const publish = args.has('--publish');
const token = process.env.TOPTEN_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN;
if (publish && !token) throw new Error('TOPTEN_WRITE_TOKEN or SANITY_WRITE_TOKEN is required');

const client = createClient({
  projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION,
  useCdn: false, token, perspective: 'published',
});

const ids = [TARGET_ID, STANDALONE_IPHONE_ID, IPHONE_GENERATION_ID, SAMSUNG_ID];
const records = await client.fetch(
  `*[_id in $ids]{_id,_rev,_type,title,"slug":slug.current,publishedAt,featuredImage,mainImage,body}`,
  { ids },
);
const byId = new Map(records.map((record) => [record._id, record]));
for (const id of ids) if (!byId.has(id)) throw new Error(`Required document not found: ${id}`);

const target = byId.get(TARGET_ID);
if (target._type !== 'buyerGuide') throw new Error(`Expected buyerGuide, found ${target._type}`);
if (target.slug !== 'iphone-18-pro-vs-samsung-galaxy-s26-ultra-uae') throw new Error(`Unexpected target slug: ${target.slug}`);

const relatedUpdates = [];
const standalone = byId.get(STANDALONE_IPHONE_ID);
const normalized = normalizeExistingTargetAnchor(standalone.body);
if (normalized.changed) relatedUpdates.push({ ...standalone, nextBody: normalized.body, change: 'normalize comparison anchor to Pro Max' });

const generation = byId.get(IPHONE_GENERATION_ID);
if (!hasLink(generation.body, TARGET_PATH)) {
  relatedUpdates.push({
    ...generation,
    nextBody: [...(generation.body || []), clusterBlock('Choosing between platforms as well as iPhone generations? Read our ', 'iPhone 18 Pro Max vs Samsung Galaxy S26 Ultra UAE comparison', ' for price, camera, battery, display and ecosystem differences.')],
    change: 'add comparison backlink',
  });
}

const samsung = byId.get(SAMSUNG_ID);
if (!hasLink(samsung.body, TARGET_PATH)) {
  relatedUpdates.push({
    ...samsung,
    nextBody: [...(samsung.body || []), clusterBlock('Also considering Apple’s largest flagship? See our ', 'iPhone 18 Pro Max vs Samsung Galaxy S26 Ultra UAE comparison', ' for a feature-by-feature buying decision.')],
    change: 'add comparison backlink',
  });
}

const wordCount = body.flatMap((item) => item.children || [])
  .reduce((total, child) => total + String(child.text || '').trim().split(/\s+/).filter(Boolean).length, 0);
const internalLinks = body.flatMap((item) => item.markDefs || []).map((mark) => mark.href).filter((href) => href?.startsWith('/'));
const summary = {
  mode: publish ? 'publish' : 'dry-run', id: TARGET_ID, preservedSlug: target.slug,
  preservedPublishedAt: target.publishedAt, title: update.title, bodyBlocks: body.length,
  wordCount, faqCount: faqs.length, internalLinks, relatedUpdates: relatedUpdates.map(({ title, change }) => ({ title, change })),
};
console.log(JSON.stringify(summary, null, 2));
if (!publish) process.exit(0);

let transaction = client.transaction().patch(TARGET_ID, (patch) => patch.ifRevisionId(target._rev).set({
  ...update,
  'featuredImage.alt': 'iPhone 18 Pro Max and Samsung Galaxy S26 Ultra UAE flagship comparison',
}));
for (const related of relatedUpdates) {
  transaction = transaction.patch(related._id, (patch) => patch.ifRevisionId(related._rev).set({ body: related.nextBody }));
}
const result = await transaction.commit({ visibility: 'sync' });
console.log(JSON.stringify({ transactionId: result.transactionId, documentIds: result.documentIds }, null, 2));
