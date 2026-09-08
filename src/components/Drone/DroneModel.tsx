import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { RefObject } from 'react';
import type { ScrollState } from '../../hooks/useScrollExperience';
import { droneMotion } from './droneMotion';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const shell = new THREE.MeshStandardMaterial({color:'#62564a', roughness:.73, metalness:.18});
const dark = new THREE.MeshStandardMaterial({color:'#242929', roughness:.66, metalness:.32});
const metal = new THREE.MeshStandardMaterial({color:'#a29d92', roughness:.36, metalness:.8});
const rubber = new THREE.MeshStandardMaterial({color:'#111313', roughness:.86});
const lens = new THREE.MeshStandardMaterial({color:'#16282d', roughness:.13, metalness:.55});
type PartName = 'DroneCore' | 'DroneBody' | 'DroneBattery' | 'DroneCamera' | `DroneArm${'FL'|'FR'|'RL'|'RR'}` | `Motor${'FL'|'FR'|'RL'|'RR'}` | `Propeller${'FL'|'FR'|'RL'|'RR'}`;
export type DroneParts = Record<PartName, THREE.Group | null>;
export interface DroneHandle { root: THREE.Group | null; parts: DroneParts }
function Block({size, position=[0,0,0], material=shell}: {size:[number,number,number]; position?:[number,number,number]; material?:THREE.Material}) {
  return <RoundedBox args={size} radius={.025} smoothness={2} position={position} material={material} castShadow receiveShadow/>;
}
export function DroneBody() {
  return <><Block size={[.62,.18,.95]}/><Block size={[.55,.06,.79]} position={[0,.12,0]}/><Block size={[.46,.05,.78]} position={[0,-.12,0]} material={dark}/>{[-1,1].flatMap(x=>[-1,1].map(z=><mesh key={`${x}${z}`} position={[x*.23,.16,z*.33]} material={metal}><cylinderGeometry args={[.027,.027,.017,8]}/></mesh>))}{[-1,1].map(x=><Block key={x} size={[.035,.07,.6]} position={[x*.32,0,.02]} material={dark}/>)}</>;
}
export function DroneArm({x,z}:{x:number;z:number}) {
  return <group position={[x*.62,-.02,z*.55]} rotation={[0,-x*z*.85,0]}><Block size={[1.12,.095,.14]}/><Block size={[.89,.02,.07]} position={[0,.057,0]} material={dark}/><Block size={[.18,.16,.2]} position={[-x*.34,0,0]}/></group>;
}
export function DroneMotor() {
  return <><mesh material={shell} position={[0,-.035,0]} castShadow><cylinderGeometry args={[.145,.145,.07,24]}/></mesh><mesh material={dark} position={[0,.045,0]} castShadow><cylinderGeometry args={[.115,.115,.12,24]}/></mesh><mesh material={metal} position={[0,.117,0]}><cylinderGeometry args={[.082,.082,.028,24]}/></mesh>{Array.from({length:12},(_,i)=><mesh key={i} position={[Math.cos(i*Math.PI/6)*.111,.045,Math.sin(i*Math.PI/6)*.111]} rotation={[0,-i*Math.PI/6,0]} material={metal}><boxGeometry args={[.012,.072,.012]}/></mesh>)}</>;
}
export function DronePropeller() {
  return <><mesh material={dark} castShadow rotation={[0,0,.06]} scale={[.49,.007,.052]}><sphereGeometry args={[1,16,8]}/></mesh><mesh material={metal} position={[0,.025,0]}><cylinderGeometry args={[.035,.035,.06,8]}/></mesh></>;
}
export function DroneBattery() {
  return <><Block size={[.43,.24,.63]} material={rubber}/>{[-.18,.18].map(z=><Block key={z} size={[.445,.252,.065]} position={[0,0,z]} material={dark}/>)}<Block size={[.24,.005,.28]} position={[0,.124,0]} material={shell}/><mesh position={[.21,-.06,-.34]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.08,.012,6,20,Math.PI]}/><meshStandardMaterial color="#a65330" roughness={.6}/></mesh></>;
}
export function DroneCamera() {
  return <><Block size={[.31,.27,.21]} material={dark}/><mesh rotation={[Math.PI/2,0,0]} position={[0,0,-.13]} material={metal}><cylinderGeometry args={[.107,.107,.06,24]}/></mesh><mesh rotation={[Math.PI/2,0,0]} position={[0,0,-.166]} material={lens}><cylinderGeometry args={[.077,.077,.014,32]}/></mesh><mesh position={[-.021,.025,-.176]}><sphereGeometry args={[.015,12,8]}/><meshBasicMaterial color="#accbd0"/></mesh></>;
}
const corners = [{id:'FL',x:-1,z:-1},{id:'FR',x:1,z:-1},{id:'RL',x:-1,z:1},{id:'RR',x:1,z:1}] as const;
// Stable logical groups are the replacement contract for a future /models/drone.glb.
export const DroneModel = forwardRef<DroneHandle,{exploded?:number; state?:RefObject<ScrollState>; compact?:boolean}>(function DroneModel({exploded=0,state,compact=false}, ref) {
  const root = useRef<THREE.Group>(null);
  const parts = useRef({} as DroneParts);
  useImperativeHandle(ref,()=>({root:root.current,parts:parts.current}),[]);
  useFrame(()=>{
    if(!state)return;
    const pose=droneMotion(state.current.progress/4), groups=parts.current;
    groups.DroneBattery?.position.set(0,.3+pose.battery,.04);
    groups.DroneCamera?.position.set(0,-.015-pose.camera*.18,-.56-pose.camera*.5);
    groups.DroneCore?.position.set(0,.155+pose.core*.35,0);
    corners.forEach(({id,x,z},i)=>{
      const dx=x*pose.arms*.44,dz=z*pose.arms*.44;
      groups[`DroneArm${id}`]?.position.set(dx,0,dz);
      groups[`Motor${id}`]?.position.set(x*1.04+dx,.04,z*.93+dz);
      const prop=groups[`Propeller${id}`];
      if(prop){prop.position.set(x*1.04+dx,.21,z*.93+dz);prop.rotation.y=x*z*.5+(state.current.reducedMotion?0:pose.rotorAngle*(i%2?1:-1));}
    });
  });
  const bind=(name:PartName)=>(group:THREE.Group|null)=>{parts.current[name]=group;};
  return <group ref={root} name="DroneModel"><group ref={bind('DroneBody')} name="DroneBody"><DroneBody/></group><group ref={bind('DroneCore')} name="DroneCore" position={[0,.155,0]}><Block size={[.35,.025,.42]} material={dark}/>{!compact&&[-.1,.1].map(x=><Block key={x} size={[.07,.035,.09]} position={[x,.02,0]} material={metal}/>)}</group><group ref={bind('DroneBattery')} name="DroneBattery" position={[0,.3+exploded,.04]}><DroneBattery/></group><group ref={bind('DroneCamera')} name="DroneCamera" position={[0,-.015-exploded*.18,-.56-exploded*.5]}><DroneCamera/></group>{corners.map(({id,x,z})=><group key={id}><group ref={bind(`DroneArm${id}`)} name={`DroneArm${id}`} position={[x*exploded*.44,0,z*exploded*.44]}><DroneArm x={x} z={z}/></group><group ref={bind(`Motor${id}`)} name={`Motor${id}`} position={[x*(1.04+exploded*.44),.04,z*(.93+exploded*.44)]}><DroneMotor/></group><group ref={bind(`Propeller${id}`)} name={`Propeller${id}`} position={[x*(1.04+exploded*.44),.21,z*(.93+exploded*.44)]} rotation={[0,x*z*.5,0]}><DronePropeller/></group></group>)}</group>;
});

