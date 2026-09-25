export const RENT_BUY_FIELDS = [
  { key: 'price', label: 'Property price (AED)', min: 10000, max: 100000000, value: 1000000, step: 'any', group: 'Home and mortgage' },
  { key: 'downPercent', label: 'Down payment (%)', min: 0, max: 100, value: 20, step: 'any', group: 'Home and mortgage' },
  { key: 'mortgageRate', label: 'Mortgage interest rate (% per year)', min: 0, max: 30, value: 4.5, step: 'any', group: 'Home and mortgage' },
  { key: 'mortgageYears', label: 'Mortgage term (years)', min: 1, max: 25, value: 25, step: '1', group: 'Home and mortgage' },
  { key: 'annualRent', label: 'Current annual rent (AED)', min: 0, max: 10000000, value: 70000, step: 'any', group: 'Rent and holding period' },
  { key: 'years', label: 'Compare after (years)', min: 1, max: 30, value: 5, step: '1', group: 'Rent and holding period' },
  { key: 'buyFeesPercent', label: 'Total upfront buying costs (% of price)', min: 0, max: 25, value: 6, step: 'any', group: 'Editable assumptions' },
  { key: 'sellFeesPercent', label: 'Selling costs (% of future sale price)', min: 0, max: 25, value: 2, step: 'any', group: 'Editable assumptions' },
  { key: 'annualOwnerCosts', label: 'Annual ownership costs (AED)', min: 0, max: 10000000, value: 12000, step: 'any', group: 'Editable assumptions' },
  { key: 'rentGrowth', label: 'Annual rent change (%)', min: -20, max: 20, value: 3, step: 'any', group: 'Editable assumptions' },
  { key: 'priceGrowth', label: 'Annual property value change (%)', min: -20, max: 20, value: 2, step: 'any', group: 'Editable assumptions' },
  { key: 'investmentReturn', label: 'Annual investment return, net of costs (%)', min: -20, max: 20, value: 4, step: 'any', group: 'Editable assumptions' },
];
export const RENT_BUY_DEFAULTS = Object.fromEntries(RENT_BUY_FIELDS.map(f => [f.key, f.value]));

export class RentBuyInputError extends RangeError {
  constructor(field, message) { super(message); this.field = field; }
}

/** Equal starting cash and monthly budgets; end-of-month payments/contributions. */
export function calculateRentVsBuy(input) {
  for (const f of RENT_BUY_FIELDS) {
    const n = input?.[f.key];
    if (!Number.isFinite(n) || n < f.min || n > f.max || (f.step === '1' && !Number.isInteger(n))) {
      throw new RentBuyInputError(f.key, `${f.label}: enter ${f.step === '1' ? 'a whole number' : 'a number'} from ${f.min.toLocaleString('en-AE')} to ${f.max.toLocaleString('en-AE')}.`);
    }
  }
  const {price, downPercent, mortgageRate, mortgageYears, annualRent, years, buyFeesPercent, sellFeesPercent, annualOwnerCosts, rentGrowth, priceGrowth, investmentReturn} = input;
  const downPayment = price * downPercent / 100;
  const buyFees = price * buyFeesPercent / 100;
  const upfrontCash = downPayment + buyFees;
  const principal = price - downPayment;
  const months = mortgageYears * 12;
  const rate = mortgageRate / 1200;
  // Stable for rates close to zero, without changing the existing EMI calculator.
  const mortgagePayment = principal === 0 ? 0 : rate === 0 ? principal / months : principal * rate / -Math.expm1(-months * Math.log1p(rate));
  const investmentMonthly = Math.expm1(Math.log1p(investmentReturn / 100) / 12);
  let balance = principal, renterSavings = upfrontCash, ownerSavings = 0;
  let totalRent = 0, totalInterest = 0, totalMortgagePayments = 0;
  const annual = [];
  for (let month = 1; month <= years * 12; month++) {
    const rent = annualRent * (1 + rentGrowth / 100) ** Math.floor((month - 1) / 12) / 12;
    const interest = month <= months ? balance * rate : 0;
    const payment = month <= months ? Math.min(mortgagePayment, balance + interest) : 0;
    balance = month === months ? 0 : Math.max(0, balance + interest - payment);
    totalRent += rent; totalInterest += interest; totalMortgagePayments += payment;
    const ownerMonthlyCost = payment + annualOwnerCosts / 12;
    // The cheaper side invests the difference; no fictitious negative investment balance.
    renterSavings = renterSavings * (1 + investmentMonthly) + Math.max(ownerMonthlyCost - rent, 0);
    ownerSavings = ownerSavings * (1 + investmentMonthly) + Math.max(rent - ownerMonthlyCost, 0);
    if (month % 12 === 0) {
      const year = month / 12;
      const homeValue = price * (1 + priceGrowth / 100) ** year;
      const sellingCosts = homeValue * sellFeesPercent / 100;
      const saleEquity = homeValue - sellingCosts - balance;
      const buyPosition = saleEquity + ownerSavings;
      annual.push({year, homeValue, sellingCosts, balance, saleEquity, ownerSavings, buyPosition, rentPosition:renterSavings, difference:buyPosition-renterSavings});
    }
  }
  const final = annual.at(-1);
  if (!final) throw new RangeError('Choose a comparison period of at least one year.');
  const result = { ...final, downPayment, buyFees, upfrontCash, principal, mortgagePayment, totalRent, totalInterest, totalMortgagePayments, firstYearBuyingAhead:annual.find(r=>r.difference>=0)?.year ?? null, annual };
  if (Object.values(result).some(v => typeof v === 'number' && !Number.isFinite(v))) throw new RangeError('The inputs produce an invalid result. Check the assumptions.');
  return result;
}
