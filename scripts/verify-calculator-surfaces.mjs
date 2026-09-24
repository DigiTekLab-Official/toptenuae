import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:4341';
const finance = ['gratuity-calculator-uae', 'uae-vat-calculator', 'zakat-calculator', 'uae-loan-emi-calculator'];
const everyday = ['bmi-calculator-uae', 'age-calculator-uae'];
const tags = ['Age in Years', 'Months & Days', 'Date of Birth', 'UAE Date'];
const get = async path => {
  const response = await fetch(base + path, {redirect:'manual', signal:AbortSignal.timeout(30000)});
  assert.equal(response.status, 200, path);
  return response.text();
};
const links = html => [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
const home = await get('/');
const header = home.match(/<header\b[\s\S]*?<\/header>/)[0];
const footer = home.match(/<footer\b[\s\S]*?<\/footer>/)[0];
for (const name of ['Primary navigation', 'Mobile navigation']) {
  const nav = header.match(new RegExp(`<nav[^>]*aria-label="${name}"[^>]*>([\\s\\S]*?)<\\/nav>`))[1];
  for (const hub of ['calculators','finance-tools']) assert.equal(links(nav).filter(l=>l===`/${hub}`).length,1, `${name}: ${hub}`);
}
assert.equal(links(footer).filter(l=>l==='/calculators').length,1);
assert.ok(links(footer).includes('/finance-tools'));
assert.deepEqual(links(footer).filter(l=>l.startsWith('/finance-tools/')).sort(), finance.map(s=>`/finance-tools/${s}`).sort());
for (const [hub, slugs] of [['finance-tools',finance],['calculators',everyday]]) {
  const section = home.match(new RegExp(`<section[^>]*aria-labelledby="section-${hub}"[^>]*>([\\s\\S]*?)<\\/section>`))[1];
  assert.deepEqual(links(section).filter(l=>l.startsWith(`/${hub}/`)).sort(), slugs.map(s=>`/${hub}/${s}`).sort());
  assert.ok(links(section).includes(`/${hub}`));
}
for (const slug of everyday) assert.ok(!home.includes(`/finance-tools/${slug}`), 'Stale homepage/header/footer link');
const age = await get('/calculators/age-calculator-uae');
const bmi = await get('/calculators/bmi-calculator-uae');
const tagList = html => html.match(/<ul[^>]*aria-label="Calculator topics"[^>]*>([\s\S]*?)<\/ul>/)[1];
const ageItems = [...tagList(age).matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)];
assert.deepEqual(ageItems.map(m=>m[1].trim().replace(/&amp;/g,'&')),tags);
const classes = html => [...tagList(html).matchAll(/<li class="([^"]+)"/g)].map(m=>m[1]);
assert.ok(classes(age).every(c=>c===classes(bmi)[0]), 'Same shared pill styling');
const ageHeader = age.match(/<header\b[\s\S]*?<\/header>/)[0];
assert.equal([...ageHeader.matchAll(/<a[^>]*href="\/calculators"[^>]*aria-current="page"[^>]*>/g)].length,2);
console.log(JSON.stringify({base,desktopNav:'PASS',mobileNav:'PASS',footer:'PASS',financeCards:4,calculatorCards:2,staleLinks:0,ageTags:tags,sharedTagStyle:'PASS'},null,2));
