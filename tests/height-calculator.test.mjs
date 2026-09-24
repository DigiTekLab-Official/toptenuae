import assert from 'node:assert/strict';
import test from 'node:test';
import { convertHeight } from '../src/lib/calculators/height.js';
test('height converts 175 cm and exact imperial values', () => {
  const r = convertHeight('cm',175);
  assert.equal(r.feet,5); assert.equal(r.inches,8.9);
  assert.equal(convertHeight('imperial',5,9).cm,175.26);
  assert.equal(convertHeight('imperial',5,9.5).cm,176.53);
  assert.equal(convertHeight('cm',182.88).feet,6);
  assert.equal(convertHeight('cm',182.88).inches,0);
});
test('height rounding carries inches into feet and preserves precision', () => {
  assert.equal(convertHeight('cm',182.879).inches,0);
  assert.equal(convertHeight('cm',182.879).feet,6);
  for(const cm of [1,50,175.123,299.99,300]) assert.ok(Math.abs(convertHeight('cm',cm).totalInches*2.54-cm)<1e-10);
});
test('height rejects invalid modes, bounds, missing and nonfinite values', () => {
  for(const bad of [undefined,NaN,Infinity,-Infinity,0,-1,301,'175']) assert.throws(()=>convertHeight('cm',bad),RangeError);
  for(const [feet,inches] of [[0,0],[-1,5],[5.5,1],[10,0],[5,12],[5,-1],[5,NaN],[Infinity,1]]) assert.throws(()=>convertHeight('imperial',feet,inches),RangeError);
  assert.throws(()=>convertHeight('wrong',175),RangeError);
});
