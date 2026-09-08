import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Cylinder, steel, rubber } from './IndustrialParts';
import type { Vec } from './IndustrialParts';
const clothing=new THREE.MeshStandardMaterial({color:'#555b4b',roughness:.95});
const fabric=new THREE.MeshStandardMaterial({color:'#6e705c',roughness:.9});
const skin=new THREE.MeshStandardMaterial({color:'#9a8168',roughness:.88});
function Limb({a,b,radius=.055}:{a:Vec;b:Vec;radius?:number}){
 const transform=useMemo(()=>{const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);return {position:start.add(end).multiplyScalar(.5),quaternion:new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize()),length:delta.length()};},[a,b]);
 return <mesh position={transform.position} quaternion={transform.quaternion} material={clothing} castShadow><cylinderGeometry args={[radius*.85,radius,transform.length,8]}/></mesh>;
}
export default function Technician({position,rotation=0,checking=false}:{position:Vec;rotation?:number;checking?:boolean}){
 return <group position={position} rotation={[0,rotation,0]} name="WorkshopTechnician"><Box p={[0,1.1,0]} s={[.34,.48,.23]} mat={clothing}/><Box p={[0,.82,0]} s={[.29,.17,.22]} mat={fabric}/><Cylinder p={[0,1.4,0]} radius={.054} length={.12} mat={skin}/><mesh position={[0,1.53,.012]} material={skin}><sphereGeometry args={[.112,10,8]}/></mesh><mesh position={[0,1.59,0]} scale={[1,.6,1]} material={fabric}><sphereGeometry args={[.131,10,8]}/></mesh>
 {[-1,1].map(side=><group key={side}><Limb a={[side*.1,.82,0]} b={[side*.115,.46,.03]} radius={.074}/><Limb a={[side*.115,.46,.03]} b={[side*.12,.12,.02]} radius={.058}/><Box p={[side*.12,.07,.065]} s={[.14,.13,.25]} mat={rubber}/><Limb a={[side*.18,1.29,0]} b={[side*.24,1.08,.17]}/><Limb a={[side*.24,1.08,.17]} b={[side*.12,checking?1.19:1.01,.38]} radius={.042}/><mesh position={[side*.12,checking?1.19:1.01,.39]} material={skin}><sphereGeometry args={[.048,8,6]}/></mesh></group>)}
 {checking&&<Box p={[0,1.2,.4]} s={[.26,.025,.18]} mat={steel}/>}</group>;
}
