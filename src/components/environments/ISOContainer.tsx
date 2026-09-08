
import type { ReactNode } from 'react';


import { Box, Cylinder, Details, Warning, paint, panel, edge, steel, rubber, lamp } from './IndustrialParts';
import type { Instance } from './IndustrialParts';


const ribs:Instance[]=Array.from({length:35},(_,i)=>({p:[-2.86+i*.168,1.4,-1.18],s:[.065,2.32,.075]}));
const roofRibs:Instance[]=Array.from({length:30},(_,i)=>({p:[-2.83+i*.195,2.67,-.45],s:[.055,.025,1.4]}));
const vents:Instance[]=Array.from({length:10},(_,i)=>({p:[3.093,1.25+i*.046,-.68],s:[.018,.019,.55]}));
function Door({side,angle}:{side:number;angle:number}) {return <group position={[3.035,.2,side*1.12]} rotation={[0,-side*angle,0]}><Box p={[0,1.15,-side*.55]} s={[.065,2.3,1.08]} mat={panel}/>{[-.29,-.79].map(z=><group key={z}><Cylinder p={[.065,1.15,side*z]} radius={.022} length={2.18} mat={edge}/><Box p={[.09,1.04,side*z]} s={[.045,.04,.2]} mat={steel}/>{[.19,2.1].map(y=><Box key={y} p={[.075,y,side*z]} s={[.06,.1,.09]} mat={edge}/>)}</group>)}{[.28,1.15,2.03].map(y=><Box key={y} p={[.048,y,0]} s={[.13,.15,.15]} mat={edge}/>)}<Box p={[.055,.92,-side*.48]} s={[.045,.16,.16]} mat={rubber}/><Warning p={[.043,1.65,-side*.58]} r={[0,Math.PI/2,0]}/></group>;}
export function ISOContainer({children,doors=.9,closedBack=true}:{children?:ReactNode;doors?:number;closedBack?:boolean}) {
 return <group name="ISOContainer"><Box p={[0,.09,0]} s={[6.1,.18,2.44]} mat={steel}/><Box p={[0,.2,0]} s={[5.91,.07,2.27]} mat={panel}/>{[-1.14,1.14].map(z=><group key={z}><Box p={[0,.13,z]} s={[6.1,.18,.12]} mat={edge}/><Box p={[0,2.58,z]} s={[6.1,.16,.13]} mat={paint}/></group>)}{[-2.97,2.97].flatMap(x=>[-1.14,1.14].map(z=><group key={`${x}${z}`}><Box p={[x,1.38,z]} s={[.15,2.45,.15]} mat={edge}/>{[.12,2.58].map(y=><group key={y}><Box p={[x,y,z]} s={[.23,.2,.21]} mat={paint}/><Box p={[x,y,z+Math.sign(z)*.11]} s={[.1,.065,.006]} mat={rubber}/></group>)}</group>))}
 <Box p={[0,2.62,-.43]} s={[6,.09,1.5]} mat={panel}/><Details items={roofRibs} mat={paint}/>
 {closedBack&&<><Box p={[0,1.39,-1.19]} s={[5.8,2.3,.04]} mat={panel}/><Details items={ribs}/></>}
 <Box p={[-3,1.4,0]} s={[.055,2.25,2.25]} mat={panel}/><Door side={-1} angle={doors}/><Door side={1} angle={doors}/>
 <Box p={[3.07,1.46,-.68]} s={[.03,.55,.66]} mat={rubber}/><Details items={vents} mat={edge}/><Box p={[-2.97,.8,.55]} s={[.08,.75,.63]} mat={steel}/>
 {[0,.8,1.6,2.4].map((x,i)=><Box key={i} p={[x-1.2,.242,0]} s={[.012,.006,2.1]} mat={steel}/>)}
 <Box p={[0,2.48,0]} s={[4.8,.045,.09]} mat={lamp}/><pointLight position={[0,2.15,.2]} color="#ffe5be" intensity={9} distance={6}/><Warning p={[-2.78,2.28,1.23]}/>
 {children}</group>;
}

