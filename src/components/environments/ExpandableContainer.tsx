import { useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Cylinder, Details, Warning, paint, panel, edge, steel, rubber } from './IndustrialParts';
import type { Instance } from './IndustrialParts';
import CleanWorkshop, { CleanRoomInterior } from './CleanWorkshop';
import { CONTAINER } from './workshopMotion';
export interface WorkshopPose {expansion:number;reveal:number;lights:number;ready:number}
const roofRibs:Instance[]=Array.from({length:27},(_,i)=>({p:[-2.36+i*.18,2.69,0],s:[.045,.025,2.14]}));
function Room({side,motion}:{side:number;motion:RefObject<WorkshopPose>}){
 const doors=useRef<(THREE.Group|null)[]>([]);
 useFrame(()=>{doors.current.forEach((g,i)=>{if(g)g.rotation.y=(i===0?1:-1)*motion.current.reveal*1.65;});});
 return <group name={side<0?'LeftEnclosedRoom':'RightEnclosedRoom'}>
 <Box p={[0,.24,0]} s={[4.75,.11,1.75]} mat={steel}/><Box p={[0,2.55,0]} s={[4.8,.13,1.79]} mat={panel}/><Box p={[0,2.56,-side*.84]} s={[4.78,.14,.045]} mat={rubber}/>
 <Box p={[-2.35,1.43,0]} s={[.075,2.25,1.74]} mat={panel}/>
 <Box p={[0,1.43,side*.86]} s={[4.7,2.25,.075]} mat={paint}/>
 {[-2.3,-.77,.77,2.3].map(x=><Box key={x} p={[x,1.43,side*.905]} s={[.06,2.25,.035]} mat={edge}/>)}
 <Box p={[2.35,2.42,0]} s={[.09,.2,1.74]} mat={edge}/>
 {[-1,1].map((sign,i)=><group ref={g=>{doors.current[i]=g;}} key={sign} position={[2.35,.31,sign*.85]} name="OpaqueServiceDoor"><Box p={[0,1.01,-sign*.425]} s={[.075,2.02,.85]} mat={paint}/><Box p={[.047,1,-sign*.76]} s={[.035,.15,.025]} mat={steel}/>{[.3,1.7].map(y=><Cylinder key={y} p={[0,y,0]} radius={.035} length={.15} mat={edge}/>)}</group>)}
 <CleanRoomInterior side={side}/></group>;
}
export default function ExpandableContainer({motion,supportHeight=0,children}:{motion:RefObject<WorkshopPose>;supportHeight?:number;children?:ReactNode}){
 const left=useRef<THREE.Group>(null),right=useRef<THREE.Group>(null),door=useRef<THREE.Group>(null),light=useRef<THREE.PointLight>(null),work=useRef<THREE.Group>(null);
 const supports=useRef<(THREE.Group|null)[]>([]),rails=useRef<(THREE.Group|null)[]>([]);

 useFrame(()=>{
  const pose=motion.current,e=pose.expansion;
  if(left.current)left.current.position.z=-(.225+e*CONTAINER.travel);
  if(right.current)right.current.position.z=.225+e*CONTAINER.travel;
  if(door.current)door.current.rotation.y=pose.reveal*1.55;

  if(light.current)light.current.intensity=pose.lights*11;
  if(work.current)work.current.visible=e>.35;
  supports.current.forEach(g=>{if(g){const amount=Math.max(0,(e-.72)/.28);g.visible=amount>0;g.scale.y=Math.max(.001,amount*(supportHeight+.1));}});
  rails.current.forEach(g=>{if(g)g.scale.z=1+e*1.65;});
 });
 return <group name="ExpandableContainer"><group name="CentralCore"><Box p={[0,.1,0]} s={[5,.2,2.2]} mat={steel}/>{[-1.07,1.07].map(z=><Box key={z} p={[0,.13,z]} s={[5,.095,.075]} mat={edge}/>)}<Box p={[0,2.62,0]} s={[5,.12,2.2]} mat={paint}/><Details items={roofRibs} mat={panel}/>
 {[-2.43,2.43].flatMap(x=>[-1.03,1.03].map(z=><group key={`${x}${z}`}><Box p={[x,1.37,z]} s={[.13,2.48,.13]} mat={edge}/>{[.11,2.61].map(y=><group key={y}><Box p={[x,y,z]} s={[.21,.2,.2]} mat={paint}/><Box p={[x+Math.sign(x)*.11,y,z]} s={[.006,.07,.1]} mat={rubber}/></group>)}</group>))}
 <Box p={[-2.46,1.41,0]} s={[.08,2.38,2.04]} mat={panel}/>
 {/* The central personnel door is a physical opening, also used by the launch path. */}
 <Box p={[2.46,1.4,-.82]} s={[.09,2.35,.39]} mat={panel}/><Box p={[2.46,1.4,.82]} s={[.09,2.35,.39]} mat={panel}/><Box p={[2.46,2.39,0]} s={[.09,.39,1.25]} mat={panel}/>{[-.615,.615].map(z=><Box key={z} p={[2.475,1.22,z]} s={[.13,2.04,.08]} mat={steel}/>)}<Box p={[2.475,2.22,0]} s={[.13,.08,1.3]} mat={steel}/>
 <group ref={door} position={[2.48,.21,-.575]} name="PersonnelDoor"><Box p={[0,.98,.575]} s={[.07,1.96,1.15]} mat={paint}/><Box p={[.067,.91,.96]} s={[.04,.16,.045]} mat={steel}/>{[.25,1.5].map(y=><Cylinder key={y} p={[.035,y,0]} radius={.035} length={.16} mat={edge}/>)}<Warning p={[.045,1.8,.575]} r={[0,Math.PI/2,0]}/></group>
 </group>
 <group ref={left} name="LeftExpandableModule"><group scale={[1,.91,1]}><Room side={-1} motion={motion}/></group></group><group ref={right} name="RightExpandableModule"><group scale={[1,.91,1]}><Room side={1} motion={motion}/></group></group>
 <group name="SupportSystem">{[-1.65,1.65].map((x,i)=><group key={x}><group ref={g=>{rails.current[i]=g;}}><Box p={[x,.075,0]} s={[.13,.12,2.1]} mat={edge}/></group>{[-1,1].map((side,j)=><group key={side} position={[x,.1,0]}><MovingSupport motion={motion} side={side}><group ref={g=>{supports.current[i*2+j]=g;}}><Cylinder p={[0,-.5,0]} radius={.045} length={1} mat={steel}/><Box p={[0,-1,0]} s={[.32,.045,.3]} mat={steel}/></group></MovingSupport></group>)}</group>)}</group>
 <group ref={work} name="InteriorWorkshop"><CleanWorkshop/></group>
 <pointLight ref={light} position={[.4,2,0]} color="#edf5ff" intensity={0} distance={7}/>{children}</group>;
}
function MovingSupport({motion,side,children}:{motion:RefObject<WorkshopPose>;side:number;children:ReactNode}){const root=useRef<THREE.Group>(null);useFrame(()=>{if(root.current)root.current.position.z=side*(.95+motion.current.expansion*CONTAINER.travel);});return <group ref={root}>{children}</group>;}







