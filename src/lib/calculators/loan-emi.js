const assertFiniteNumber = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be a finite number`);
};

/**
 * Calculate a fixed monthly payment using a reducing-balance loan formula.
 * Monetary values are returned unrounded so callers can choose display precision.
 */
export function calculateLoanEmi({ principal, annualRate, tenureMonths }) {
  assertFiniteNumber(principal, 'Principal');
  assertFiniteNumber(annualRate, 'Annual rate');
  assertFiniteNumber(tenureMonths, 'Tenure');

  if (principal <= 0) throw new RangeError('Principal must be greater than zero');
  if (annualRate < 0 || annualRate > 100) {
    throw new RangeError('Annual rate must be between 0 and 100');
  }
  if (!Number.isInteger(tenureMonths) || tenureMonths < 1 || tenureMonths > 360) {
    throw new RangeError('Tenure must be a whole number from 1 to 360 months');
  }

  const monthlyRate = annualRate / 1200;
  const monthlyPayment = monthlyRate === 0
    ? principal / tenureMonths
    : principal * monthlyRate * ((1 + monthlyRate) ** tenureMonths)
      / (((1 + monthlyRate) ** tenureMonths) - 1);
  const totalPayment = monthlyPayment * tenureMonths;

  return {
    monthlyPayment,
    totalInterest: totalPayment - principal,
    totalPayment,
  };
}
