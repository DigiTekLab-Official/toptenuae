export const ACTIVITY_FACTORS = Object.freeze({ sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 });

/** Mifflin–St Jeor resting energy; activity factors and +/-10% are tool assumptions. */
export function calculateCalories({ age, sex, weight, height, activity }) {
  if (!Number.isInteger(age) || age < 18 || age > 100) throw new RangeError('Enter a whole-number age from 18 to 100.');
  if (!['male', 'female'].includes(sex)) throw new RangeError('Choose a sex coefficient for the equation.');
  if (!Number.isFinite(weight) || weight < 30 || weight > 300) throw new RangeError('Enter a weight from 30 to 300 kg.');
  if (!Number.isFinite(height) || height < 100 || height > 250) throw new RangeError('Enter a height from 100 to 250 cm.');
  if (!Object.hasOwn(ACTIVITY_FACTORS, activity)) throw new RangeError('Choose an activity level.');
  const resting = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
  const maintenance = resting * ACTIVITY_FACTORS[activity];
  if (!Number.isFinite(maintenance) || resting <= 0) throw new RangeError('These measurements cannot produce a reliable estimate. Check your inputs.');
  const bmi = weight / (height / 100) ** 2;
  const lower = maintenance * 0.9;
  // Conservative product guardrails, not universal minimum intake recommendations.
  const lowerScenario = bmi < 18.5 || lower < (sex === 'male' ? 1500 : 1200) ? null : lower;
  return { resting, maintenance, lowerScenario, higherScenario: maintenance * 1.1 };
}
