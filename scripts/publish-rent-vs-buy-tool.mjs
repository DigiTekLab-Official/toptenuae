import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const id='rent-vs-buy-calculator-uae';
const categoryId='1eda81a9-1d25-45a1-8a46-8b1ba318a73c';
const inboundIds=['uae-loan-emi-calculator','4d2f78a4-1fbe-4f77-8360-acd0dbb3ef61'];
let i=0;
const key=()=>`rb-${++i}`;
const block=(text,style='normal')=>({_key:key(),_type:'block',style,markDefs:[],children:[{_key:key(),_type:'span',text,marks:[]}]});
const link=(text,href)=>{const mark=key();return {_key:key(),_type:'block',style:'normal',markDefs:[{_key:mark,_type:'link',href}],children:[{_key:key(),_type:'span',text,marks:[mark]}]};};
const faq=(question,answer)=>({_key:key(),_type:'faqItem',question,answer});
const ref=_ref=>({_key:key(),_type:'reference',_ref});
const document={
  _id:id,_type:'tool',title:'Rent vs Buy Calculator UAE',slug:{_type:'slug',current:id},componentId:'rent-buy-uae',categories:[ref(categoryId)],
  overview:'Compare renting with buying a UAE home using mortgage costs, upfront fees, rent growth, future sale equity and invested savings.',
  heroBadge:'UAE Home Decision Tool',heroTitleSuffix:'Renting or Buying?',
  heroTags:['Rent vs Buy UAE','Mortgage & Fees','Investment Opportunity Cost','Year-by-Year Comparison'],
  intro:'Explore whether renting or buying could leave you in a stronger financial position over your chosen holding period. Adjust the assumptions to your own property, rent and costs; the starting numbers are examples, not market quotes.',
  content:[
    block('Compare a home purchase with renting in the UAE','h2'),
    block('A mortgage instalment is only one part of buying a home. Upfront charges, service charges, maintenance, the time you expect to stay and the price you eventually sell for can all change the comparison. Renting also leaves capital available for other uses. This calculator brings those assumptions together in one nominal AED model.'),
    block('How to use the calculator','h2'),
    block('Enter the property price, down-payment percentage, quoted annual mortgage rate and loan term. Add the annual rent for a comparable home and your intended holding period. Then replace the example fees, ownership costs and growth assumptions with your own estimates. A down payment of 100% represents a cash purchase. Set the mortgage rate to 0% to test an interest-free loan.'),
    block('Include all relevant buying and selling charges','h2'),
    block('The upfront buying-cost input is a combined percentage of the property price, excluding the down payment. Include the charges you expect to pay for transfer or registration, the agent, bank arrangement, valuation, mortgage registration and other purchase administration. Convert fixed AED charges into a percentage by dividing their total by the purchase price and multiplying by 100. Do not add the same charge twice.'),
    block('For Dubai, consult Dubai Land Department’s fee schedule and obtain current quotes for your transaction. Fees elsewhere in the UAE can differ. The example 6% buying cost and 2% selling cost are editable modelling assumptions, not official all-inclusive fee rates. Add relevant early mortgage settlement or discharge charges to selling costs; the calculator does not work out statutory or lender caps.'),
    link('Dubai Land Department: official property registration fee schedule','https://dubailand.gov.ae/media/x0bf21ii/book.pdf'),
    block('What belongs in annual ownership costs?','h2'),
    block('Use a combined annual AED amount for service charges, maintenance and owner-specific insurance or other recurring costs. This model holds that figure constant for the whole horizon. Utilities and other living expenses are excluded; compare homes with similar running costs or reflect material owner-only differences in this input.'),
    block('How the comparison stays consistent','h2'),
    block('Both choices start with the same cash: the down payment plus buying fees. The buyer uses it to complete the purchase; the renter invests it. Each month, the model assumes both households can fund the higher of mortgage-plus-ownership costs and rent. Whichever option costs less invests that month’s difference. This avoids treating principal repayments as pure costs or ignoring the renter’s opportunity to invest.'),
    block('The mortgage is a fixed-rate, reducing-balance loan paid monthly. Rent changes at annual renewal intervals. Both investment balances compound monthly using the effective monthly equivalent of your annual net return, with savings added at month-end. The return is assumed after relevant investment fees and taxes. No deposit is borrowed or invested twice.'),
    block('At each year-end, the model assumes the property is sold. Buying’s position is sale price minus selling costs and the remaining loan, plus the buyer’s invested cash-flow savings. Renting’s position is the renter’s investment balance. The difference is not a statement of affordability, and these figures are not your total household net worth.'),
    block('Worked example — not a forecast','h2'),
    block('With a price of AED 1,000,000, 20% down, 4.5% interest over 25 years, annual rent of AED 70,000 and a five-year hold, the mortgage payment is about AED 4,447 a month. Using the example 6% buying cost, 2% selling cost, AED 12,000 annual owner costs, 3% rent growth, 2% property growth and 4% investment return, the model gives approximately AED 427,645 for buying and AED 316,330 for renting. Change the assumptions rather than treating that result as a forecast.'),
    block('Use more than one scenario','h2'),
    block('Try a shorter stay, zero or negative property growth, higher mortgage costs and different investment returns. The first year buying is ahead can change or reverse later; use the full year-by-year table rather than assuming a permanent break-even date. Negative sale equity means additional cash would be needed to clear the loan and selling costs.'),
    block('Useful next calculations','h2'),
    link('Check monthly repayments separately with the UAE Loan EMI Calculator','https://toptenuae.com/finance-tools/uae-loan-emi-calculator'),
    link('Estimate end-of-service benefits with the UAE Gratuity Calculator','https://toptenuae.com/finance-tools/gratuity-calculator-uae'),
    block('An estimated gratuity payment is not guaranteed available cash. Keep emergency savings and purchase liquidity separate from uncertain future receipts. The tool does not verify income, creditworthiness, residency status or eligibility for a mortgage.'),
    link('CBUAE: mortgage lending regulations and amendments','https://rulebook.centralbank.ae/en/entiresection/4074'),
    block('Limitations','h2'),
    block('This is a planning estimate, not financial, tax or legal advice. It assumes a completed owner-occupied home, immediate occupancy, one fixed mortgage rate and sale at the selected horizon. It excludes off-plan payment schedules, taxes not already reflected in your inputs, moving costs, rental agency/admin charges, refundable renter deposits and future changes to owner costs. Rent is spread evenly across months, so upfront cheque timing is not modelled. Returns and property prices are uncertain. Confirm current charges and borrowing terms with qualified advisers.'),
  ],
  faqs:[
    faq('Is renting or buying always better in the UAE?','Neither is always better. Holding period, transaction costs, comparable rent, financing terms and future returns can change the result. The calculator compares your assumptions, not a guaranteed outcome.'),
    faq('Does the calculator use current Dubai property prices or mortgage offers?','No. Every starting value is illustrative. Enter the price, rent and lender rate relevant to your situation; there is no live property-price or bank-rate feed.'),
    faq('Does the buying-cost percentage include my down payment?','No. The down payment is calculated separately. Buying costs should combine all other expected upfront charges as a percentage of the price, including fixed AED charges converted to a percentage.'),
    faq('Does it account for investing while renting?','Yes. The renter invests the buyer’s down payment and buying-fee equivalent. Each month, whichever option has the lower housing cash outflow invests the difference at the same assumed return.'),
    faq('How is the mortgage balance calculated?','The model applies a fixed annual nominal rate divided by 12, pays a reducing-balance monthly instalment, and tracks interest and principal. Payments stop after the selected loan term. A 0% rate divides principal evenly across the term.'),
    faq('Can I compare buying without a mortgage?','Yes. Set the down payment to 100%. Mortgage payments and the remaining loan become zero; purchase costs and ownership costs still apply.'),
    faq('Is the first year buying is ahead a guaranteed break-even date?','No. It is only the first sampled year-end where buying’s position is at least equal under the entered assumptions. It may reverse later, and there is no within-year break-even calculation.'),
    faq('Are the example fees official UAE rates?','No. The combined buying and selling percentages are examples. Actual fees depend on the emirate, property, contract, bank and services used. Check official schedules and current quotes.'),
    faq('Does this tell me whether a bank will approve my mortgage?','No. Input bounds are modelling limits, not lending eligibility rules. The calculator does not check income, debt burden, residency, age, valuation or loan-to-value requirements.'),
    faq('What costs or timing details are excluded?','The model excludes moving costs, rental agency/admin charges, refundable renter deposits, upfront rent-cheque timing and off-plan schedules. Annual owner costs and the mortgage rate stay constant. Include relevant purchase and loan-exit charges in the fee inputs.'),
  ],
  relatedTools:inboundIds.map(ref),
  seo:{metaTitle:'Rent vs Buy Calculator UAE: Compare Housing Costs',metaDescription:'Compare renting and buying a UAE home with mortgage payments, fees, rent growth and invested savings. Explore editable assumptions and year-by-year results.',keywords:['rent vs buy calculator UAE','rent or buy Dubai','UAE property calculator','rent versus mortgage UAE']},
};
if(!process.argv.includes('--publish')) {console.log(JSON.stringify({mode:'plan',document,appendRelatedToolTo:inboundIds},null,2));process.exit(0);}
const studio=resolve(import.meta.dirname,'../../../00-Shared-Core/universal-studio');
if(process.env.RENT_BUY_CLI!=='1') {
  const child=spawnSync(resolve(studio,'node_modules/.bin/sanity'),['exec',import.meta.filename,'--with-user-token','--','--publish'],{cwd:studio,stdio:'inherit',env:{...process.env,UNIVERSAL_SANITY_WORKSPACE:'toptenuae',RENT_BUY_CLI:'1'}});
  if(child.error) throw child.error; process.exit(child.status??1);
}
const {getCliClient}=await import(pathToFileURL(resolve(studio,'node_modules/sanity/lib/cli.js')).href);
const client=getCliClient({projectId:'kxdjzy8e',dataset:'production',apiVersion:'2021-06-07',useCdn:false,perspective:'raw'});
assert.ok(client.config().token,'Authenticated CLI required');
const conflicts=await client.fetch('*[slug.current == $id || _id in [$id,$draft]]{_id}',{id,draft:`drafts.${id}`});
assert.equal(conflicts.length,0,'Tool already exists; refusing overwrite');
assert.equal(await client.fetch('*[_id == $id][0].slug.current',{id:categoryId}),'finance-tools');
const before=await client.fetch('*[_type == "tool"]');
for(const target of inboundIds) {
  assert.ok(before.some(d=>d._id===target),'Missing related tool');
  assert.ok(!before.some(d=>d._id===`drafts.${target}`),'Draft exists; avoid overwriting ongoing edits');
}
let tx=client.transaction().create(document);
const expected=new Map();
for(const target of inboundIds) {
  const original=before.find(d=>d._id===target);
  const related=[...(original.relatedTools||[]),ref(id)];
  expected.set(target,related);
  tx=tx.patch(target,p=>p.ifRevisionId(original._rev).set({relatedTools:related}));
}
await tx.commit({visibility:'sync'});
const after=await client.fetch('*[_type == "tool"]');
const strip=d=>Object.fromEntries(Object.entries(d).filter(([k])=>!['_rev','_updatedAt'].includes(k)));
for(const original of before) {
  const wanted=expected.has(original._id)?{...original,relatedTools:expected.get(original._id)}:original;
  assert.deepEqual(strip(after.find(d=>d._id===original._id)),strip(wanted),'Unexpected existing-tool change');
}
const added=after.find(d=>d._id===id);
for(const [field,value] of Object.entries(document)) assert.deepEqual(added[field],value);
console.log(JSON.stringify({published:id,category:'finance-tools',inboundRelatedLinksAdded:inboundIds,otherContentUnchanged:true},null,2));
