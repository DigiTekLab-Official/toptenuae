import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calculateRentVsBuy,RENT_BUY_DEFAULTS as defaults,RENT_BUY_FIELDS} from '../src/lib/calculators/rent-vs-buy.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const simple={...defaults,price:120000,downPercent:100,annualRent:12000,annualOwnerCosts:0,years:1,buyFeesPercent:0,sellFeesPercent:0,priceGrowth:0,rentGrowth:0,investmentReturn:0};
test('cash purchase and equal budgets: renter invests upfront cash, buyer invests avoided rent',()=>{
  const r=calculateRentVsBuy(simple);
  close(r.mortgagePayment,0);close(r.rentPosition,120000);close(r.ownerSavings,12000);close(r.buyPosition,132000);close(r.difference,12000);
});
test('0% mortgage converts payments to equity while equal rent builds no savings',()=>{
  const r=calculateRentVsBuy({...simple,downPercent:0,mortgageRate:0,mortgageYears:10});
  close(r.mortgagePayment,1000);close(r.balance,108000);close(r.buyPosition,12000);close(r.rentPosition,0);close(r.totalInterest,0);
});
test('upfront and selling costs reduce the buyer comparison once each',()=>{
  const r=calculateRentVsBuy({...simple,buyFeesPercent:5,sellFeesPercent:2});
  close(r.upfrontCash,126000);close(r.saleEquity,117600);close(r.difference,3600);
});
test('independent closed-form mortgage balance and portfolio calculation',()=>{
  const r=calculateRentVsBuy({...defaults,rentGrowth:0,investmentReturn:0});
  const rate=0.045/12,n=300,m=60,p=800000;
  const payment=p*rate*(1+rate)**n/((1+rate)**n-1);
  const balance=p*(1+rate)**m-payment*((1+rate)**m-1)/rate;
  close(r.mortgagePayment,payment);close(r.balance,balance);
  const ownerCost=payment+1000, rent=70000/12;
  close(r.ownerSavings,Math.max(rent-ownerCost,0)*m);
  close(r.rentPosition,260000+Math.max(ownerCost-rent,0)*m);
  close(r.saleEquity,1000000*1.02**5*0.98-balance);
});
test('effective investment return compounds, contributions occur at month end',()=>{
  const r=calculateRentVsBuy({...simple,annualRent:0,annualOwnerCosts:12000,investmentReturn:12});
  const g=1.12**(1/12)-1;
  close(r.rentPosition,120000*1.12+1000*((1+g)**12-1)/g);
});
test('mortgage stops after payoff and rent changes only at annual renewals',()=>{
  const r=calculateRentVsBuy({...simple,downPercent:0,mortgageRate:0,mortgageYears:1,years:2,rentGrowth:10});
  close(r.balance,0);close(r.totalMortgagePayments,120000);close(r.totalRent,25200);close(r.ownerSavings,13200);
  close(r.rentPosition,108000);
});
test('negative growth, zero rent, tiny rates and extreme valid inputs stay finite',()=>{
  for(const extra of [{priceGrowth:-20,rentGrowth:-20,investmentReturn:-20},{annualRent:0},{mortgageRate:1e-10},{price:100000000,years:30,priceGrowth:20,investmentReturn:20}]) {
    const r=calculateRentVsBuy({...defaults,...extra}); assert.ok(Number.isFinite(r.difference)); assert.ok(r.balance>=0);
  }
  close(calculateRentVsBuy({...simple,downPercent:0,mortgageRate:1e-10,mortgageYears:10}).mortgagePayment,1000);
});
test('all numeric inputs reject blanks/nonfinite/out-of-range values; terms reject fractions',()=>{
  for(const f of RENT_BUY_FIELDS) for(const value of [undefined,NaN,Infinity,-Infinity,'',f.min-1,f.max+1]) assert.throws(()=>calculateRentVsBuy({...defaults,[f.key]:value}),RangeError);
  for(const key of ['years','mortgageYears']) assert.throws(()=>calculateRentVsBuy({...defaults,[key]:2.5}),RangeError);
});
test('calculator static IDs do not collide with generated field IDs',()=>{
  const source=readFileSync(new URL('../src/components/tools/RentVsBuyCalculator.astro',import.meta.url),'utf8');
  const ids=[...source.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  ids.push(...RENT_BUY_FIELDS.map(f=>`rb-${f.key}`));
  assert.equal(new Set(ids).size,ids.length);
  assert.match(source,/<tbody id="rb-year-rows">/);
});
