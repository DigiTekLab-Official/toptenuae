/** Exact international inch: 2.54 centimetres. Display rounding only. */
export function convertHeight(mode, first, inches = 0) {
  let cm;
  if (mode === 'cm') {
    if (!Number.isFinite(first) || first <= 0 || first > 300) throw new RangeError('Enter a height greater than 0 and no more than 300 cm.');
    cm = first;
  } else if (mode === 'imperial') {
    if (!Number.isInteger(first) || first < 0 || first > 9) throw new RangeError('Enter whole feet from 0 to 9.');
    if (!Number.isFinite(inches) || inches < 0 || inches >= 12) throw new RangeError('Enter inches from 0 up to, but not including, 12.');
    cm = (first * 12 + inches) * 2.54;
    if (cm <= 0 || cm > 300) throw new RangeError('Enter a combined height greater than 0 and no more than 300 cm.');
  } else throw new RangeError('Choose a conversion direction.');
  const totalInches = cm / 2.54;
  // Round the combined inches first so the display never says 5 ft 12.00 in.
  const hundredths = Math.round(totalInches * 100);
  return { cm, totalInches, feet: Math.floor(hundredths / 1200), inches: (hundredths % 1200) / 100 };
}
