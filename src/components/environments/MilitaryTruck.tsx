import * as THREE from 'three';
import { Box, Cylinder, Details, paint, panel, edge, steel, rubber, glass, lamp, orange } from './IndustrialParts';
import type { Instance } from './IndustrialParts';
const profile=new THREE.Shape();
profile.moveTo(-3.38,1.04);profile.lineTo(-3.47,1.53);profile.lineTo(-3.21,2.58);profile.lineTo(-2.98,2.85);profile.lineTo(-1.62,2.85);profile.lineTo(-1.45,2.64);profile.lineTo(-1.45,1.04);profile.lineTo(-1.77,1.04);profile.lineTo(-1.95,1.4);profile.lineTo(-2.74,1.4);profile.lineTo(-3.03,1.04);profile.closePath();
const cabGeometry=new THREE.ExtrudeGeometry(profile,{depth:2.1,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.045,bevelThickness:.045});
cabGeometry.translate(0,0,-1.05);
const sideWindow=new THREE.Shape();sideWindow.moveTo(-3.1,2.5);sideWindow.lineTo(-2.91,1.98);sideWindow.lineTo(-1.77,1.98);sideWindow.lineTo(-1.77,2.59);sideWindow.closePath();
const sideGlass=new THREE.ShapeGeometry(sideWindow);
const treads:Instance[]=[],bolts:Instance[]=[];
const axles=[-2.45,-.8,1.62,2.93];
for(const x of axles)for(const side of [-1,1]){
 for(let i=0;i<24;i++){const a=i*Math.PI/12;for(const lane of [-1,1])treads.push({p:[x+Math.cos(a)*.622,.66+Math.sin(a)*.622,side*1.16+lane*.13],s:[.14,.07,.17],r:[0,lane*.2,a-Math.PI/2]});}
 for(let i=0;i<8;i++){const a=i*Math.PI/4;bolts.push({p:[x+Math.cos(a)*.22,.66+Math.sin(a)*.22,side*1.438],s:[.05,.05,.026]});}
}
function Wheel({x,side}:{x:number;side:number}){return <group position={[x,.66,side*1.16]}><mesh material={rubber} castShadow><torusGeometry args={[.455,.17,10,28]}/></mesh><Cylinder radius={.44} length={.4} mat={rubber} r={[Math.PI/2,0,0]}/><Cylinder p={[0,0,side*.235]} radius={.32} length={.035} mat={panel} r={[Math.PI/2,0,0]}/><Cylinder p={[0,0,side*.266]} radius={.14} length={.09} mat={steel} r={[Math.PI/2,0,0]}/><mesh material={edge} position={[0,0,side*.256]}><torusGeometry args={[.3,.018,6,24]}/></mesh></group>;}
export default function MilitaryTruck(){return <group name="MilitaryLogistics8x8">
 <mesh geometry={cabGeometry} material={paint} castShadow receiveShadow/>
 <Box p={[-3.335,2.18,0]} s={[.025,.66,1.88]} r={[0,0,-.24]} mat={rubber}/><Box p={[-3.354,2.19,0]} s={[.028,.56,1.72]} r={[0,0,-.24]} mat={glass}/><Box p={[-3.372,2.19,0]} s={[.032,.61,.045]} r={[0,0,-.24]} mat={edge}/>
 {[-.48,.48].map(z=><Box key={z} p={[-3.439,1.975,z]} s={[.025,.022,.55]} r={[.17,0,0]} mat={rubber}/>)}
 <Box p={[-3.5,1.34,0]} s={[.08,.39,1.64]} mat={rubber}/><Details mat={panel} items={Array.from({length:9},(_,i)=>({p:[-3.55,1.34,-.7+i*.175],s:[.035,.31,.04]}))}/>
 <Box p={[-3.6,.94,0]} s={[.22,.22,2.43]} mat={steel}/>{[-.88,.88].map(z=><group key={z}><Box p={[-3.57,1.13,z]} s={[.11,.25,.37]} mat={rubber}/><Box p={[-3.637,1.14,z]} s={[.018,.13,.24]} mat={lamp}/><Cylinder p={[-3.72,.85,z*.65]} radius={.062} length={.06} mat={edge} r={[0,0,Math.PI/2]}/></group>)}
 {[-1,1].map(side=><group key={side}><mesh geometry={sideGlass} position={[0,0,side*1.102]} material={glass} rotation={side<0?[0,0,0]:[0,0,0]}><meshStandardMaterial color="#263a3c" metalness={.7} roughness={.19} side={THREE.DoubleSide}/></mesh>
 <Box p={[-2.17,1.68,side*1.103]} s={[.98,.43,.022]} mat={panel}/><Box p={[-1.84,1.85,side*1.13]} s={[.19,.04,.04]} mat={rubber}/><Box p={[-3.02,2.35,side*1.26]} s={[.04,.51,.04]} mat={steel}/><Box p={[-3.02,2.12,side*1.41]} s={[.075,.36,.2]} mat={rubber}/><Box p={[-2.98,2.12,side*1.414]} s={[.012,.29,.15]} mat={glass}/>
 {[.6,.83,1.05].map(y=><Box key={y} p={[-1.59,y,side*1.11]} s={[.37,.06,.3]} mat={steel}/>)}
 {axles.map(x=><group key={x}><Wheel x={x} side={side}/><mesh position={[x,.66,side*1.16]} material={paint}><torusGeometry args={[.74,.055,4,16,Math.PI]}/></mesh><Box p={[x+.68,.7,side*1.16]} s={[.055,.49,.48]} mat={rubber}/></group>)}
 <Box p={[.4,.87,side*.96]} s={[1,.55,.5]} mat={panel}/>{[.06,.73].map(x=><Box key={x} p={[x,.87,side*1.222]} s={[.055,.54,.025]} mat={steel}/>)}<Box p={[2.45,1.32,side*1.15]} s={[2.25,.13,.1]} mat={edge}/>
 </group>)}
 <Details items={treads} mat={rubber}/><Details items={bolts} mat={edge}/>
 {[-.65,.65].map(z=><Box key={z} p={[.42,.93,z]} s={[6.6,.23,.16]} mat={steel}/>)}
 {axles.map(x=><group key={x}><Cylinder p={[x,.65,0]} radius={.09} length={2.2} r={[Math.PI/2,0,0]} mat={steel}/><Box p={[x,.65,0]} s={[.35,.3,.38]} mat={steel}/>{[-.62,.62].map(z=><Box key={z} p={[x,.77,z]} s={[.72,.055,.14]} mat={rubber}/>)}</group>)}
 <Box p={[3.74,1.13,0]} s={[1.15,.15,2.2]} mat={steel}/><Box p={[1.38,1.25,0]} s={[5.74,.18,2.32]} mat={panel}/><Details mat={steel} items={Array.from({length:16},(_,i)=>({p:[-1.3+i*.37,1.348,0],s:[.014,.007,2.14]}))}/>
 <Box p={[-1.28,1.95,0]} s={[.15,1.43,2.18]} mat={steel}/><Box p={[-1.18,2.63,0]} s={[.22,.13,2.2]} mat={paint}/><Cylinder p={[-1.05,2.12,-.65]} radius={.32} length={.2} r={[0,0,Math.PI/2]} mat={rubber}/><Cylinder p={[-1.27,2.14,.81]} radius={.055} length={1.38} mat={steel}/><Box p={[-2.25,2.94,0]} s={[.72,.08,.86]} mat={panel}/><Cylinder p={[-1.64,3.23,-.83]} radius={.012} length={.75}/><Box p={[4.3,1.05,0]} s={[.13,.16,2.25]} mat={steel}/>{[-.92,.92].map(z=><Box key={z} p={[4.38,1.09,z]} s={[.02,.09,.16]} mat={orange}/>)}
 </group>;}

