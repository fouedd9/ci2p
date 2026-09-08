import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { DroneModel } from '../Drone/DroneModel';
import { Box, Cylinder, Details, paint, panel, steel, edge, rubber, orange } from './IndustrialParts';
import { DEPLOYMENT, logisticsMotion, rackProgress, rackRowX, rackSlotZ } from './workshopMotion';
import type { ScrollState } from '../../hooks/useScrollExperience';

// Bake one existing assembled DroneModel into shared instanced meshes for the parked fleet.
// The launch slot is omitted here and occupied continuously by the independent launch model.
function ParkedDrones({selected}:{selected:boolean}) {
 const template=useRef<THREE.Group>(null), fleet=useRef<THREE.Group>(null);
 useLayoutEffect(()=>{
  const source=template.current!, destination=fleet.current!;
  source.updateWorldMatrix(true,true);
  const inverse=source.matrixWorld.clone().invert(), scale=new THREE.Matrix4().makeScale(DEPLOYMENT.droneScale,DEPLOYMENT.droneScale,DEPLOYMENT.droneScale);
  const slots=[0,1,2].filter(i=>!(selected&&i===DEPLOYMENT.selectedSlot));
  const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();
  source.traverse(object=>{
   if(!(object instanceof THREE.Mesh))return;
   const local=new THREE.Matrix4().multiplyMatrices(inverse,object.matrixWorld);
   const geometry=(object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone()).applyMatrix4(local);
   const material=object.material as THREE.Material;
   batches.set(material,[...(batches.get(material)??[]),geometry]);
  });
  batches.forEach((geometries,material)=>{
   const geometry=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());
   const instances=new THREE.InstancedMesh(geometry,material,slots.length);
   slots.forEach((slot,i)=>{const placement=new THREE.Matrix4().makeTranslation(rackSlotZ(slot),.11,0);placement.multiply(new THREE.Matrix4().makeRotationY(0));placement.multiply(scale);instances.setMatrixAt(i,placement);});
   instances.computeBoundingSphere();destination.add(instances);
  });
  return ()=>{destination.children.forEach(object=>{if(object instanceof THREE.InstancedMesh){object.geometry.dispose();object.dispose();}});destination.clear();};
 },[selected]);
 return <><group ref={template} visible={false}><DroneModel compact/></group><group ref={fleet}/></>;
}
function Rack({side,row,state}:{side:number;row:number;state:RefObject<ScrollState>}) {
 const slider=useRef<THREE.Group>(null);
 useFrame(()=>{if(slider.current)slider.current.position.x=side*DEPLOYMENT.travel*rackProgress(state.current.logisticsProgress,row);});
 return <group position={[rackRowX(row),side>0?1.48:1.02,0]} rotation={[0,-Math.PI/2,0]} name={`RackAxis${side}-${row}`}>
  <Box p={[0,-.1,0]} s={[2.13,.09,.12]} mat={steel}/>
  <group ref={slider} name={`RackRow${side}-${row}`}>
   <Box s={[2.1,.07,.61]} mat={panel}/>{[-.28,.28].map(z=><Box key={z} p={[0,-.06,z]} s={[2.1,.11,.045]} mat={steel}/>)}
   {[-.8,0,.8].map(x=><Box key={x} p={[x,.045,0]} s={[.025,.025,.62]} mat={edge}/>)}
   {side>0&&row===DEPLOYMENT.selectedRow&&<group position={[rackSlotZ(DEPLOYMENT.selectedSlot),.04,0]}>{[-1,1].map(sign=><Box key={sign} p={[sign*.3,0,.27]} s={[.12,.009,.024]} mat={orange}/>)}</group>}
   <ParkedDrones selected={side>0&&row===DEPLOYMENT.selectedRow}/>
  </group>
 </group>;
}
export default function DeploymentContainer20ft({state}:{state:RefObject<ScrollState>}) {
 const doors=useRef<(THREE.Group|null)[]>([]);
 useFrame(()=>{const a=logisticsMotion(state.current.logisticsProgress).doors;doors.current.forEach((g,i)=>{if(g)g.rotation.x=(i===0?1:-1)*a*Math.PI*1.5;});});
 return <group name="DeploymentContainer20ft"><group name="FixedISOContainer">
  <Box p={[0,.09,0]} s={[5,.18,2.2]} mat={steel}/><Box p={[0,2.04,0]} s={[5,.12,2.2]} mat={paint}/>
  <Details mat={panel} items={Array.from({length:28},(_,i)=>({p:[-2.4+i*.177,2.112,0],s:[.043,.025,2.13]}))}/>
  {[-2.43,2.43].flatMap(x=>[-1.03,1.03].map(z=><group key={`${x}${z}`}><Box p={[x,1.05,z]} s={[.14,1.95,.14]} mat={edge}/>{[.1,2.03].map(y=><group key={y}><Box p={[x,y,z]} s={[.22,.2,.22]} mat={paint}/><Box p={[x+Math.sign(x)*.115,y,z]} s={[.008,.06,.09]} mat={rubber}/></group>)}</group>))}
  <Box p={[-2.47,1.1,0]} s={[.07,1.8,2.05]} mat={panel}/>
  {[-.52,.52].map(z=><group key={z}><Box p={[2.47,1.1,z]} s={[.07,1.8,1.01]} mat={paint}/>{[-.28,.28].map(offset=><group key={offset}><Cylinder p={[2.52,1.1,z+offset]} radius={.022} length={1.65} mat={steel}/><Box p={[2.55,1.04,z+offset]} s={[.045,.05,.17]} mat={edge}/></group>)}{[.45,1.7].map(y=><Box key={y} p={[2.51,y,z+Math.sign(z)*.43]} s={[.08,.12,.1]} mat={steel}/>)}</group>)}
  {[-1,1].map((side,i)=><group key={side} ref={g=>{doors.current[i]=g;}} position={[0,2.17+i*.09,side*1.075]} name={side<0?'LeftSideDoor':'RightSideDoor'}>
   <Box p={[0,-.98,0]} s={[4.72,1.96,.065]} mat={paint}/>
   <Details mat={panel} items={Array.from({length:27},(_,j)=>({p:[-2.27+j*.175,-.98,side*.046],s:[.05,1.85,.045]}))}/>
   {[-1.8,1.8].map(x=><Cylinder key={x} p={[x,0,0]} radius={.055} length={.32} r={[0,0,Math.PI/2]} mat={steel}/>)}
  </group>)}
 </group>{[-1,1].flatMap(side=>Array.from({length:DEPLOYMENT.rows},(_,row)=><Rack key={`${side}-${row}`} side={side} row={row} state={state}/>))}</group>;
}



