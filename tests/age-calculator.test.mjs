import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateAge, getUaeToday } from '../src/lib/calculators/age.js';

test('normal DOB gives complete years, months and remaining days', () => {
  assert.deepEqual(calculateAge('1990-05-15', '2026-09-24'), { years: 36, months: 4, days: 9 });
});
test('birthday not yet reached this year', () => {
  assert.deepEqual(calculateAge('2000-12-10', '2026-09-24'), { years: 25, months: 9, days: 14 });
});
test('Feb 29 anniversaries clamp to Feb 28 in non-leap years', () => {
  assert.deepEqual(calculateAge('2000-02-29', '2025-02-28'), { years: 25, months: 0, days: 0 });
  assert.deepEqual(calculateAge('2000-02-29', '2024-02-28'), { years: 23, months: 11, days: 30 });
  assert.deepEqual(calculateAge('2000-02-29', '2024-02-29'), { years: 24, months: 0, days: 0 });
  assert.deepEqual(calculateAge('2000-02-29', '2025-03-01'), { years: 25, months: 0, days: 1 });
});
test('month-end clamping, same-day birth and century leap rules', () => {
  assert.deepEqual(calculateAge('2026-01-31', '2026-03-01'), { years: 0, months: 1, days: 1 });
  assert.deepEqual(calculateAge('2026-09-24', '2026-09-24'), { years: 0, months: 0, days: 0 });
  assert.throws(() => calculateAge('1900-02-29', '2026-09-24'), /valid date/);
});
test('rejects future, empty and malformed dates', () => {
  assert.throws(() => calculateAge('2026-09-25', '2026-09-24'), /future/);
  for (const invalid of ['', 'garbage', '2026-02-30', '0000-01-01', '2026-13-01']) {
    assert.throws(() => calculateAge(invalid, '2026-09-24'), /valid date/);
  }
});
test('server clock uses UAE date at UTC midnight boundary', () => {
  assert.equal(getUaeToday(new Date('2026-09-24T19:59:59Z')), '2026-09-24');
  assert.equal(getUaeToday(new Date('2026-09-24T20:00:00Z')), '2026-09-25');
});
