import assert from 'node:assert/strict';
import test from 'node:test';
import { droneMotion } from './droneMotion.ts';
test('assembled before disassembly and exactly restored before power-up',()=>{
  for(const p of [0,.1,.15,.82,.9,.92,1]){
    const pose=droneMotion(p);
    for(const part of ['arms','camera','battery','core'])assert.equal(pose[part],0,`${part} at ${p}`);
  }
});
test('engineering hold preserves the exploded silhouette',()=>{
  for(const p of [.30,.4,.48,.55,.60,.62]){
    const pose=droneMotion(p);
    for(const part of ['arms','camera','battery','core'])assert.equal(pose[part],1);
  }
  assert.equal(droneMotion(.55).annotations,1);
});
test('reassembly sequence and stationary hero rotors',()=>{
  const pose=droneMotion(.72);
  assert.equal(pose.core,0); assert.ok(pose.arms<pose.camera); assert.equal(pose.battery,1);
  for(const p of [0,.15,.5,.82])assert.equal(droneMotion(p).rotorAngle,0);
  assert.ok(droneMotion(.9).rotorAngle<droneMotion(.92).rotorAngle);
  assert.equal(droneMotion(.92).takeoff,0); assert.equal(droneMotion(1).takeoff,1);
});
test('reverse and arbitrary scrubbing recover identical absolute poses',()=>{
  const forward=Array.from({length:1001},(_,i)=>droneMotion(i/1000));
  for(let i=1000;i>=0;i--)assert.deepEqual(droneMotion(i/1000),forward[i]);
  for(const i of [930,210,780,0,550,1000,300,150])assert.deepEqual(droneMotion(i/1000),forward[i]);
});
