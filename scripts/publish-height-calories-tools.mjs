import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

let index = 0;
const key = () => `hc-${++index}`;
const block = (text, style = 'normal') => ({_key:key(),_type:'block',style,markDefs:[],children:[{_key:key(),_type:'span',marks:[],text}]});
const link = (label, href) => {
  const mark = key();
  return {_key:key(),_type:'block',style:'normal',markDefs:[{_key:mark,_type:'link',href}],children:[{_key:key(),_type:'span',marks:[mark],text:label}]};
};
const faq = (question, answer) => ({_key:key(),_type:'faqItem',question,answer});
const reference = id => ({_key:key(),_type:'reference',_ref:id});
const categoryId = 'topten-category-calculators';
const tool = (id, title, componentId) => ({_id:id,_type:'tool',title,slug:{_type:'slug',current:id},componentId,categories:[reference(categoryId)]});

export const documents = [
  {
    ...tool('height-calculator-uae','Height Calculator UAE','height-uae'),
    overview:'Convert height from centimetres to feet and inches, or feet and inches to centimetres. A free height converter with decimal input and clear rounding.',
    heroBadge:'Height Unit Converter', heroTitleSuffix:'cm, Feet & Inches',
    heroTags:['cm to Feet','Feet to cm','Decimal Inches','Height Conversion'],
    intro:'Convert a measured height between centimetres and feet plus inches. Choose a direction, enter your height and select Convert Height.',
    content:[
      block('How to convert your height','h2'),
      block('For centimetres to feet and inches, enter a positive height in cm. For the reverse conversion, enter whole feet and inches below 12; enter 0 inches for an exact number of feet. Decimal cm and decimal inches are supported. This tool accepts combined heights up to 300 cm.'),
      block('The conversion formula','h2'),
      block('One inch equals exactly 2.54 centimetres and one foot equals 12 inches. To convert to cm, multiply (feet × 12 + inches) by 2.54. To convert cm to total inches, divide by 2.54 and split the result into whole feet and remaining inches.'),
      block('Examples','h2'),
      block('175 cm is approximately 5 ft 8.90 in. A height of 5 ft 9 in is exactly 175.26 cm. A height of 6 ft is exactly 182.88 cm. Values are rounded only for display; the converter uses the exact conversion factor.'),
      block('Measured height, not predicted adult height','h2'),
      block('This calculator converts units. It does not estimate a child’s future height, compare two people visually, or assess whether a height is healthy. For a measurement, stand without shoes and use a flat wall and a level headpiece.'),
      block('Units and decimal notation','h2'),
      block('5.9 feet is not the same as 5 feet 9 inches. A decimal part of a foot must be multiplied by 12 to get inches. In this tool’s imperial mode, enter 5 in Feet and 9 in Inches for 5 ft 9 in.'),
      link('NIST: SI unit conversion guidance','https://www.nist.gov/pml/special-publication-811'),
    ],
    faqs:[
      faq('How many centimetres are in one inch?','One inch is exactly 2.54 cm. One foot is exactly 30.48 cm.'),
      faq('What is 175 cm in feet and inches?','175 cm is approximately 5 feet 8.90 inches. The displayed inches are rounded to two decimal places.'),
      faq('What is 5 feet 9 inches in cm?','5 feet 9 inches is 69 inches. Multiplying 69 by 2.54 gives 175.26 cm.'),
      faq('Can I enter decimal measurements?','Yes. Centimetres and inches accept decimals. The feet field accepts whole numbers; put any remaining measurement in the inches field.'),
      faq('Does this predict a child’s adult height?','No. This tool converts an existing measurement and does not predict growth or adult height.'),
      faq('Why can a rounded result show the next whole foot?','The combined inches are rounded before they are split into feet and inches, so a result close enough to the next foot displays as that foot and 0.00 inches rather than 12.00 inches.'),
    ],
    relatedTools:[reference('bmi-calculator-uae'),reference('age-calculator-uae'),reference('calories-calculator-uae')],
    seo:{metaTitle:'Height Calculator UAE: Convert cm to Feet & Inches',metaDescription:'Convert height from cm to feet and inches or feet and inches to cm. Use decimal measurements, clear formulas and a free mobile-friendly height converter.',keywords:['height calculator UAE','height calculator in cm','feet to cm','cm to feet and inches']},
  },
  {
    ...tool('calories-calculator-uae','Calories Calculator UAE','calories-uae'),
    overview:'Estimate adult daily calorie needs using age, weight, height, sex and activity level. Includes resting energy, maintenance calories and illustrative scenarios.',
    heroBadge:'Adult Calorie Estimate',heroTitleSuffix:'Daily Energy Needs',
    heroTags:['Daily Calories','Maintenance Estimate','Activity Level','Mifflin–St Jeor'],
    intro:'Estimate your daily maintenance calories from your measurements and activity level. These are starting estimates for adults, not personalised diet prescriptions.',
    content:[
      block('What this calories calculator estimates','h2'),
      block('Enter age in complete years, weight in kg, height in cm, the sex coefficient used by the equation and an approximate activity level. The calculator shows resting energy and estimated total daily energy expenditure (TDEE), often called maintenance calories. Food Calories are kilocalories (kcal).'),
      block('Method and assumptions','h2'),
      block('The simplified Mifflin–St Jeor equation is 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years), plus 5 for the male coefficient or minus 161 for the female coefficient. It estimates resting energy, not a recommended food intake.'),
      block('This tool multiplies resting energy by an approximate activity factor: sedentary 1.2, light 1.375, moderate 1.55, active 1.725 or very active 1.9. These factors are practical modelling assumptions, not measurements and not part of the original resting-energy equation. Select the level that reflects your overall routine, including work and exercise.'),
      block('Understanding the scenarios','h2'),
      block('The 10% lower and 10% higher results are arithmetic illustrations relative to estimated maintenance. They do not prescribe a diet, forecast kilograms lost or gained, or guarantee a result. The lower scenario is not displayed when BMI is below 18.5 or the estimate is below 1,500 kcal for the male coefficient or 1,200 kcal for the female coefficient. These are conservative tool guardrails, not universal safe intake thresholds.'),
      block('Worked example','h2'),
      block('For age 30, weight 70 kg, height 175 cm and the male coefficient, estimated resting energy is 1,648.75 kcal/day. With the moderate activity factor of 1.55, maintenance is 2,555.5625 kcal/day, displayed as 2,556. The illustrative lower and higher values display as 2,300 and 2,811 kcal/day.'),
      block('Who should not use this as a diet target','h2'),
      block('This tool is for adults aged 18–100, excluding pregnancy and breastfeeding. It is not suitable for setting intake during eating-disorder recovery, illness or other situations needing clinical nutrition support. Athletes and people with unusually high or low muscle mass may need a different assessment. Consult a registered dietitian for individual goals; do not treat the resting estimate as an intake target.'),
      block('UAE context and privacy','h2'),
      block('The calculator uses metric inputs common in the UAE. It does not assume a separate UAE metabolic formula or automatically adjust calories for heat or fasting. Its calculations run in your browser; the calculator does not submit the measurements to a nutrition API.'),
      block('Sources','h2'),
      link('Original Mifflin–St Jeor study (1990), PubMed','https://pubmed.ncbi.nlm.nih.gov/2305711/'),
      link('NIDDK: adult body-weight planning and exclusions','https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner'),
    ],
    faqs:[
      faq('Which calorie formula is used?','The calculator uses the simplified Mifflin–St Jeor resting-energy equation and multiplies the result by the activity factor you select. The activity factors are approximate assumptions.'),
      faq('Are maintenance calories the same as resting calories?','No. Resting energy estimates basic energy use at rest. Maintenance adds an activity adjustment to estimate total daily energy use. Neither result is a measured value.'),
      faq('Does this tell me exactly how much weight I will lose?','No. The 10% lower and higher scenarios are illustrations, not weight-change forecasts or recommended intakes. Individual energy needs and responses vary.'),
      faq('Why is the lower-calorie scenario sometimes hidden?','It is withheld for a BMI below 18.5 or a lower estimate below the tool’s 1,500 kcal male or 1,200 kcal female guardrails. These cutoffs do not establish a universally safe intake; seek individual guidance.'),
      faq('Can children or pregnant people use it?','No. This version is limited to adults aged 18–100 and excludes pregnancy and breastfeeding. Medical conditions and eating-disorder recovery require individual nutrition advice.'),
      faq('Does the UAE climate change this calculation?','No automatic heat or fasting adjustment is made. This tool uses the same resting-energy equation and chosen activity assumptions regardless of location.'),
      faq('What measurements can I enter?','Use age 18–100 in whole years, weight 30–300 kg, and height 100–250 cm. Weight and height may include decimals. The bounds are input limits, not a guarantee that the equation is appropriate for every person within them.'),
      faq('Why does the equation ask for a sex coefficient?','The published equation has male and female coefficients. These do not cover every individual circumstance, including effects of hormone therapy or unusual body composition. Seek individual advice if neither estimate is appropriate for you.'),
    ],
    relatedTools:[reference('bmi-calculator-uae'),reference('height-calculator-uae'),reference('age-calculator-uae')],
    seo:{metaTitle:'Calories Calculator UAE: Estimate Daily Calorie Needs',metaDescription:'Estimate adult maintenance calories and resting energy from age, height, weight and activity. See the formula, limitations and illustrative calorie scenarios.',keywords:['calories calculator UAE','daily calorie calculator','maintenance calories','TDEE calculator UAE']},
  },
];

const publish = process.argv.includes('--publish');
if (!publish) { console.log(JSON.stringify({mode:'plan',documents},null,2)); process.exit(0); }
const studio = resolve(import.meta.dirname,'../../../00-Shared-Core/universal-studio');
if (process.env.HEIGHT_CALORIES_CLI !== '1') {
  const result = spawnSync(resolve(studio,'node_modules/.bin/sanity'),['exec',import.meta.filename,'--with-user-token','--','--publish'],{cwd:studio,stdio:'inherit',env:{...process.env,UNIVERSAL_SANITY_WORKSPACE:'toptenuae',HEIGHT_CALORIES_CLI:'1'}});
  if(result.error) throw result.error;
  process.exit(result.status ?? 1);
}
const {getCliClient} = await import(pathToFileURL(resolve(studio,'node_modules/sanity/lib/cli.js')).href);
const client = getCliClient({projectId:'kxdjzy8e',dataset:'production',apiVersion:'2021-06-07',useCdn:false,perspective:'raw'});
assert.ok(client.config().token,'Authenticated CLI session required');
const ids = documents.map(d=>d._id);
const conflicts = await client.fetch('*[slug.current in $ids || _id in $ids || _id in $drafts]{_id}',{ids,drafts:ids.map(id=>`drafts.${id}`)});
assert.equal(conflicts.length,0,'Existing document or draft found; refusing to overwrite');
const category = await client.fetch('*[_id == $id][0]{_type,"slug":slug.current}',{id:categoryId});
assert.equal(category?._type,'category'); assert.equal(category?.slug,'calculators');
const existing = await client.fetch('*[_type == "tool"]{_id,_rev}');
for(const id of ['bmi-calculator-uae','age-calculator-uae']) assert.ok(existing.some(d=>d._id===id));
let transaction=client.transaction();
for(const doc of documents) transaction=transaction.create(doc);
await transaction.commit({visibility:'sync'});
for(const doc of documents) assert.deepEqual((await client.getDocument(doc._id)).seo,doc.seo);
const after=await client.fetch('*[_type == "tool"]{_id,_rev}');
for(const doc of existing) assert.equal(after.find(d=>d._id===doc._id)?._rev,doc._rev,'Existing tool changed');
console.log(JSON.stringify({mode:'published',ids,category:'calculators',existingToolsUnchanged:true},null,2));
