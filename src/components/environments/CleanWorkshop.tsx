import * as THREE from 'three';
import { Box, Cylinder, Details, rubber, steel, paint } from './IndustrialParts';
import Technician from './Technician';
export const cleanWall=new THREE.MeshStandardMaterial({color:'#e6e8e5',roughness:.76});
const bin=new THREE.MeshStandardMaterial({color:'#919999',roughness:.65,metalness:.2});
const joint=new THREE.MeshStandardMaterial({color:'#91b7c1',roughness:.4,metalness:.25});
export const whiteLED=new THREE.MeshStandardMaterial({color:'#ffffff',emissive:'#e6f3ff',emissiveIntensity:.7});
function Bin({position}:{position:[number,number,number]}){return <group position={position}><Box p={[0,.03,0]} s={[.61,.06,.48]} mat={bin}/>{[-.285,.285].map(x=><Box key={x} p={[x,.24,0]} s={[.05,.45,.48]} mat={bin}/>)}{[-.215,.215].map(z=><group key={z}><Box p={[0,.24,z]} s={[.61,.45,.05]} mat={bin}/><Box p={[0,.34,z*1.13]} s={[.18,.04,.014]} mat={steel}/></group>)}</group>;}
function Manipulator({x,side}:{x:number;side:number}){return <group position={[x,1.04,side*.45]}><Cylinder radius={.11} length={.1} mat={steel}/><Cylinder p={[0,.22,0]} radius={.075} length={.4} mat={cleanWall}/><Cylinder p={[0,.4,0]} radius={.095} length={.17} r={[Math.PI/2,0,0]} mat={joint}/><group position={[0,.41,0]} rotation={[side*.65,0,0]}><Cylinder p={[0,.18,0]} radius={.052} length={.36} mat={cleanWall}/><Cylinder p={[0,.36,0]} radius={.075} length={.13} r={[Math.PI/2,0,0]} mat={joint}/><group position={[0,.36,0]} rotation={[side*1.1,0,0]}><Cylinder p={[0,.13,0]} radius={.046} length={.26} mat={cleanWall}/><Box p={[0,.29,0]} s={[.11,.09,.075]} mat={steel}/>{[-.045,.045].map(z=><Box key={z} p={[0,.35,z]} s={[.025,.12,.02]} mat={steel}/>)}</group></group></group>;}
export function CleanRoomInterior({side}:{side:number}){return <group>
 <Box p={[0,.305,0]} s={[4.66,.025,1.68]} mat={cleanWall}/>
 <Details mat={bin} items={Array.from({length:8},(_,i)=>({p:[-2.1+i*.6,.32,0],s:[.009,.003,1.65]}))}/>
 <Box p={[0,1.42,side*.805]} s={[4.56,2.17,.025]} mat={cleanWall}/>
 <Details mat={bin} items={Array.from({length:7},(_,i)=>({p:[-1.9+i*.62,1.42,side*.785],s:[.008,2.12,.006]}))}/>
 {[-1.3,.8].map(x=><Box key={x} p={[x,2.44,0]} s={[1.4,.045,.82]} mat={whiteLED}/>)}
 {[-1.7,-.9].flatMap(x=>[.32,.8,1.28].map(y=><Bin key={`${x}${y}`} position={[x,y,side*.4]}/>))}
 <Bin position={[1.1,.32,side*.4]}/><Technician position={[.2,.32,-side*.24]} checking={side<0}/>
 </group>;}
export default function CleanWorkshop(){return <group name="CleanIndustrialWorkshop">
 <Box p={[0,.215,0]} s={[4.7,.025,2.03]} mat={cleanWall}/>
 <Details mat={bin} items={Array.from({length:8},(_,i)=>({p:[-2.1+i*.6,.23,0],s:[.009,.004,2.02]}))}/>
 <Box p={[-.3,1,0]} s={[3.35,.12,.82]} mat={cleanWall}/><Box p={[-.3,1.067,0]} s={[3.2,.03,.55]} mat={rubber}/>
 <Details mat={steel} items={Array.from({length:28},(_,i)=>({p:[-1.83+i*.114,1.087,0],s:[.016,.01,.54]}))}/>
 {[-1.6,.8].flatMap(x=>[-.33,.33].map(z=><Box key={`${x}${z}`} p={[x,.62,z]} s={[.065,.75,.065]} mat={steel}/>))}
 {[-1.3,.15].flatMap(x=>[-1,1].map(side=><Manipulator key={`${x}${side}`} x={x} side={side}/>))}
 {[-.9,.55].map(x=><group key={x} position={[x,1.12,0]}><Box s={[.23,.065,.34]} mat={paint}/>{[-1,1].map(side=><Box key={side} p={[0,0,side*.18]} s={[.48,.035,.06]} mat={paint} r={[0,side*.6,0]}/>)}</group>)}
 <Technician position={[-1.7,.23,.87]}/><Technician position={[.7,.23,-.87]} checking/>
 <Box p={[-2.39,1.94,0]} s={[.13,.4,.9]} mat={cleanWall}/><Box p={[-2.3,1.85,0]} s={[.02,.065,.72]} mat={steel}/>
 {[-1.2,.8].map(x=><Box key={x} p={[x,2.52,0]} s={[1.35,.04,.85]} mat={whiteLED}/>)}
 </group>;}

