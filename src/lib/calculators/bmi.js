/** WHO adult bands use the unrounded BMI. Display rounding belongs to the UI. */
export function calculateBmi(weightKg, heightCm) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('Enter a weight greater than zero in kilograms.');
  }
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new RangeError('Enter a height greater than zero in centimetres.');
  }
  const bmi = weightKg / ((heightCm / 100) ** 2);
  if (!Number.isFinite(bmi) || bmi <= 0) {
    throw new RangeError('These measurements cannot be calculated. Check your weight and height.');
  }
  const classification = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  return { bmi, classification };
}
