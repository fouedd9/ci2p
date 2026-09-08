import { Box, Cylinder, Details, Warning, panel, edge, steel, rubber, glass, safetyGlass, orange, lamp } from './IndustrialParts';
export default function InjectionMachine(){return <group name="InjectionMoldingMachine" position={[0,.27,0]}>
 <Box p={[0,.35,0]} s={[4.8,.7,1.35]} mat={steel}/>{[-1.95,1.95].flatMap(x=>[-.47,.47].map(z=><Box key={`${x}${z}`} p={[x,.02,z]} s={[.3,.12,.25]} mat={rubber}/>))}
 {[-1.65,-.45,.75,1.83].map(x=><group key={x}><Box p={[x,.39,.691]} s={[1.04,.53,.024]} mat={panel}/><Box p={[x+.38,.49,.717]} s={[.09,.025,.018]} mat={steel}/></group>)}
 <Box p={[-1.7,1.2,0]} s={[.28,1.04,1.05]} mat={edge}/><Box p={[-.28,1.2,0]} s={[.21,1.04,1.05]} mat={edge}/><Box p={[-.83,1.18,0]} s={[.38,.66,.72]} mat={steel}/><Box p={[-1.18,1.18,0]} s={[.25,.66,.72]} mat={steel}/>
 {[.91,1.52].flatMap(y=>[-.39,.39].map(z=><Cylinder key={`${y}${z}`} p={[-1,y,z]} radius={.039} length={1.75} r={[0,0,Math.PI/2]} mat={edge}/>))}
 <Box p={[-1.02,1.78,0]} s={[2.06,.11,1.27]} mat={orange}/>{[-1.99,.02].map(x=><Box key={x} p={[x,1.2,.61]} s={[.06,1.05,.06]} mat={orange}/>)}
 <Box p={[-1.5,1.27,.615]} s={[.9,.83,.025]} mat={safetyGlass}/><Box p={[-.57,1.27,.615]} s={[.91,.83,.025]} mat={safetyGlass}/><Box p={[-.62,1.24,.66]} s={[.045,.29,.04]} mat={edge}/>
 <Cylinder p={[.83,1.16,0]} radius={.15} length={1.76} r={[0,0,Math.PI/2]} mat={steel}/>{[.2,.49,.78,1.07,1.36].map(x=><Cylinder key={x} p={[x,1.16,0]} radius={.175} length={.14} r={[0,0,Math.PI/2]} mat={edge}/>)}
 <Box p={[1.89,1.02,0]} s={[.7,.53,.86]} mat={steel}/><mesh position={[1.3,1.65,0]} rotation={[0,Math.PI/4,0]} material={edge}><cylinderGeometry args={[.39,.13,.64,4]}/></mesh><Box p={[1.3,1.98,0]} s={[.6,.045,.6]} mat={steel}/><Cylinder p={[1.3,1.27,0]} radius={.1} length={.2} mat={edge}/>
 <Box p={[.35,.75,.73]} s={[.07,1.06,.07]} mat={steel}/><group position={[.35,1.5,.84]} rotation={[-.16,0,0]}><Box s={[.51,.64,.12]} mat={edge}/><Box p={[0,.08,.07]} s={[.4,.35,.012]} mat={rubber}/><Box p={[0,.09,.078]} s={[.33,.24,.009]} mat={glass}/><Box p={[-.1,-.22,.073]} s={[.045,.045,.02]} mat={orange}/><Box p={[.09,-.22,.073]} s={[.045,.045,.02]} mat={lamp}/></group>
 <Details mat={rubber} items={Array.from({length:8},(_,i)=>({p:[1.68+i*.07,.3,.711],s:[.026,.18,.014]}))}/><Warning p={[-1.69,1.21,.645]}/><Box p={[-.8,1.69,.2]} s={[1.55,.02,.035]} mat={lamp}/>
 </group>;}

