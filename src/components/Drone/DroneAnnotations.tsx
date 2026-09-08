import type { RefObject } from 'react';
import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import type { ScrollState } from '../../hooks/useScrollExperience';
import { phase } from './droneMotion';
const labels = [
  {name:'02 / POWER UNIT',a:[0,1.3,.04],b:[.75,1.65,.04]},
  {name:'01 / CHASSIS',a:[.28,.08,0],b:[1.2,.5,.15]},
  {name:'03 / CAMERA',a:[0,-.2,-1.03],b:[.65,-.45,-1.4]},
  {name:'04 / PROPULSION ARM',a:[-.95,-.02,.85],b:[-1.05,.4,1.1]},
] as const;
export default function DroneAnnotations({state}:{state:RefObject<ScrollState>}) {
  const root=useRef<Group>(null);
  const elements=useRef<(HTMLDivElement|null)[]>([]);
  useFrame(({size})=>{const p=state.current.progress/4;const opacity=phase(p,.30,.35)*(1-phase(p,.46,.49));if(root.current){root.current.visible=opacity>0;root.current.children.forEach((g,i)=>{g.visible=size.width>=600||i<3;});}elements.current.forEach((el,i)=>{if(el){const visible=opacity>0&&(size.width>=600||i<3);el.style.opacity=String(visible?opacity:0);el.style.visibility=visible?'visible':'hidden';}});});
  return <group ref={root}>{labels.map(({name,a,b},i)=><group key={name}><Line points={[[...a],[...b]]} color="#b9855c" lineWidth={.65}/><mesh position={[...a]}><sphereGeometry args={[.018,8,6]}/><meshBasicMaterial color="#dc9a6b"/></mesh><Html position={[...b]} zIndexRange={[2,0]} style={{pointerEvents:'none'}}><div ref={el=>{elements.current[i]=el;}} className="engineering-label">{name}</div></Html></group>)}</group>;
}






