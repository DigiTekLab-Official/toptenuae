import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateBmi } from '../src/lib/calculators/bmi.js';

test('converts centimetres to metres and calculates BMI', () => {
  const result = calculateBmi(70, 175);
  assert.ok(Math.abs(result.bmi - 22.857142857142858) < 1e-12);
  assert.equal(result.classification, 'Normal');
});

test('classifies exact WHO boundaries without rounding first', () => {
  for (const [bmi, band] of [[18.49, 'Underweight'], [18.5, 'Normal'], [24.999, 'Normal'], [25, 'Overweight'], [29.999, 'Overweight'], [30, 'Obese']]) {
    assert.equal(calculateBmi(bmi * 4, 200).classification, band);
  }
});

test('rejects absent, nonfinite, zero and negative measurements', () => {
  for (const bad of [undefined, NaN, Infinity, -Infinity, 0, -1]) {
    assert.throws(() => calculateBmi(bad, 175), RangeError);
    assert.throws(() => calculateBmi(70, bad), RangeError);
  }
  assert.throws(() => calculateBmi(Number.MAX_VALUE, Number.MIN_VALUE), RangeError);
});
