import assert from 'node:assert/strict';
import test from 'node:test';
import { assemblyMotion, logisticsMotion, CONTAINER, DEPLOYMENT, rackProgress, rackRowX, rackSlotZ } from './workshopMotion.ts';
test('existing load path lands precisely on deck and stays locked',()=>{
 assert.deepEqual(logisticsMotion(0).container,[CONTAINER.bedX,0,-3.7]);
 for(const p of [.3,.45,.58,.76,.84,.91,1])assert.deepEqual(logisticsMotion(p).container,[CONTAINER.bedX,CONTAINER.bedY,0]);
 assert.ok(logisticsMotion(.08).container[1]>CONTAINER.bedY);
});
test('fixed 20ft envelope fits unchanged carrier and clears cab',()=>{
 assert.ok(CONTAINER.bedX-DEPLOYMENT.length/2>-.95);
 assert.ok(CONTAINER.bedX+DEPLOYMENT.length/2<1.38+5.74/2);
 assert.ok(DEPLOYMENT.width<2.32);
 assert.ok(Math.abs(DEPLOYMENT.length/DEPLOYMENT.height-2.4)<.05);
 assert.ok(rackSlotZ(2)+1.54*DEPLOYMENT.droneScale<DEPLOYMENT.width/2-.03);
 assert.ok(.78>3.08*DEPLOYMENT.droneScale,'adjacent row propellers have clearance');
 assert.ok(.70>3.08*DEPLOYMENT.droneScale,'adjacent slot propellers have clearance');
});
test('doors clear before staggered rack translation; no body expansion',()=>{
 assert.equal(logisticsMotion(.45).doors,0);assert.equal(logisticsMotion(.58).doors,1);
 for(let row=0;row<DEPLOYMENT.rows;row++){
  assert.equal(rackProgress(.58,row),0);assert.equal(rackProgress(.76,row),1);
 }
 assert.ok(rackProgress(.65,0)>rackProgress(.65,5));
 assert.equal('expansion' in logisticsMotion(.7),false);
});
test('launch occupant follows its rack exactly then rises before translating',()=>{
 for(let i=0;i<=910;i++){
  const p=i/1000, pose=logisticsMotion(p);
  assert.deepEqual(pose.drone,[rackRowX(DEPLOYMENT.selectedRow),1.59,DEPLOYMENT.travel*rackProgress(p,DEPLOYMENT.selectedRow)+rackSlotZ(DEPLOYMENT.selectedSlot)]);
 }
 assert.equal(logisticsMotion(.84).rotorAngle,0);assert.ok(logisticsMotion(.90).rotorAngle>0);
 const start=logisticsMotion(.91),clear=logisticsMotion(.94);
 assert.equal(clear.drone[0],start.drone[0]);assert.equal(clear.drone[2],start.drone[2]);
 assert.ok(clear.drone[1]-start.drone[1]>.79);
 assert.ok(logisticsMotion(.95).drone[0]>clear.drone[0]);
});
test('assembly deployment timing is preserved',()=>{
 assert.equal(assemblyMotion(.2).expansion,0);assert.equal(assemblyMotion(.45).expansion,1);
 assert.equal(assemblyMotion(.45).reveal,0);assert.equal(assemblyMotion(.7).ready,0);assert.equal(assemblyMotion(1).ready,1);
});
test('reverse scroll restores every pose and phase boundary continuously',()=>{
 for(const motion of [logisticsMotion,assemblyMotion,p=>Array.from({length:6},(_,row)=>rackProgress(p,row))]){
  const poses=Array.from({length:1001},(_,i)=>motion(i/1000));
  for(let i=1000;i>=0;i--)assert.deepEqual(motion(i/1000),poses[i]);
 }
 for(const p of [.08,.24,.3,.45,.58,.76,.84,.91,.94,1]){
  const a=logisticsMotion(p-1e-7),b=logisticsMotion(p+1e-7);
  for(let axis=0;axis<3;axis++){assert.ok(Math.abs(a.container[axis]-b.container[axis])<1e-4);assert.ok(Math.abs(a.drone[axis]-b.drone[axis])<1e-4);}
 }
});
