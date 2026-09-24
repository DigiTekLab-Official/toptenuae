import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCalories, ACTIVITY_FACTORS } from '../src/lib/calculators/calories.js';
const input={age:30,sex:'male',weight:70,height:175,activity:'moderate'};
test('calories independently checked male and female estimates',()=>{
  const r=calculateCalories(input);
  assert.equal(r.resting,1648.75); assert.equal(r.maintenance,2555.5625);
  assert.equal(r.lowerScenario,2300.00625); assert.ok(Math.abs(r.higherScenario-2811.11875)<1e-9);
  const f=calculateCalories({...input,sex:'female',activity:'sedentary'});
  assert.equal(f.resting,1482.75); assert.equal(f.maintenance,1779.3);
});
test('all activity levels and decimal measurements stay finite',()=>{
  for(const activity of Object.keys(ACTIVITY_FACTORS)) {
    const r=calculateCalories({...input,weight:70.5,height:175.5,activity});
    assert.equal(r.maintenance,r.resting*ACTIVITY_FACTORS[activity]);
    assert.ok(Number.isFinite(r.higherScenario));
  }
});
test('lower calorie scenario is withheld for underweight and low estimates',()=>{
  assert.equal(calculateCalories({...input,weight:50}).lowerScenario,null);
  assert.equal(calculateCalories({...input,age:80,sex:'female',weight:45,height:150,activity:'sedentary'}).lowerScenario,null);
});
test('calories rejects invalid and nonfinite inputs',()=>{
  for(const [key,values] of Object.entries({age:[17,101,30.5,NaN,Infinity],weight:[29,301,0,NaN,Infinity],height:[99,251,0,NaN,Infinity],sex:['','other'],activity:['','__proto__','extreme']})) {
    for(const value of values) assert.throws(()=>calculateCalories({...input,[key]:value}),RangeError);
  }
  assert.throws(()=>calculateCalories({...input,weight:undefined}),RangeError);
});
