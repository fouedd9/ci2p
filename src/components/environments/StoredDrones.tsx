import { useMemo } from 'react';
import { CylinderGeometry } from 'three';
import { Details, paint, rubber, steel } from './IndustrialParts';
import type { Vec, Instance } from './IndustrialParts';
const motorGeometry=new CylinderGeometry(.5,.5,1,12);
// Rack drones retain the FPV silhouette in three shared draw calls.
export default function StoredDrones({positions,scale=.36}:{positions:Vec[];scale?:number}){
 const batches=useMemo(()=>{
  const shells:Instance[]=[],dark:Instance[]=[],motors:Instance[]=[];
  for(const [x,y,z] of positions){
   const piece=(p:Vec,s:Vec,r?:Vec):Instance=>({p:[x+p[0]*scale,y+p[1]*scale,z+p[2]*scale],s:[s[0]*scale,s[1]*scale,s[2]*scale],r});
   shells.push(piece([0,0,0],[.62,.18,.95]));dark.push(piece([0,.24,0],[.43,.24,.63]),piece([0,0,-.56],[.3,.25,.23]));
   for(const a of [-1,1])for(const b of [-1,1]){
    shells.push(piece([a*.62,-.02,b*.55],[1.12,.095,.14],[0,-a*b*.85,0]));
    motors.push(piece([a*1.04,.08,b*.93],[.23,.17,.23]));
    dark.push(piece([a*1.04,.21,b*.93],[.98,.018,.085],[0,a*b*.5,0]));
   }
  }
  return {shells,dark,motors};
 },[positions,scale]);
 return <group name="StoredFPVDemonstrators"><Details items={batches.shells} mat={paint}/><Details items={batches.dark} mat={rubber}/><Details items={batches.motors} mat={steel} geometry={motorGeometry}/></group>;
}
