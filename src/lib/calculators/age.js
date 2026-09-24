const DAY = 86400000;

function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new RangeError('Enter a valid date of birth.');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value || date.getUTCFullYear() < 1) {
    throw new RangeError('Enter a valid date of birth.');
  }
  return date;
}

/** Shift from the original birth date, clamping to the destination month's end. */
function anniversary(birth, months) {
  const date = new Date(birth);
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const end = new Date(date);
  end.setUTCMonth(end.getUTCMonth() + 1);
  end.setUTCDate(0);
  date.setUTCDate(Math.min(birth.getUTCDate(), end.getUTCDate()));
  return date;
}

/** Calendar age; today is supplied by the server, never the browser clock. */
export function calculateAge(dateOfBirth, today) {
  const birth = parseDate(dateOfBirth);
  const current = parseDate(today);
  if (birth > current) throw new RangeError('Date of birth cannot be in the future.');
  let years = current.getUTCFullYear() - birth.getUTCFullYear();
  if (anniversary(birth, years * 12) > current) years--;
  let months = 0;
  while (months < 11 && anniversary(birth, years * 12 + months + 1) <= current) months++;
  const days = Math.round((current.getTime() - anniversary(birth, years * 12 + months).getTime()) / DAY);
  return { years, months, days };
}

export function getUaeToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (type) => parts.find(p => p.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
