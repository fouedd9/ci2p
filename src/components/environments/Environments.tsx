import { useRef } from 'react';
import type { RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import RotorBlur from '../Drone/RotorBlur';
import { phase } from '../Drone/droneMotion';
import { DroneModel } from '../Drone/DroneModel';
import type { DroneHandle } from '../Drone/DroneModel';
import type { ScrollState } from '../../hooks/useScrollExperience';
import { Box, steel, edge } from './IndustrialParts';
import { ISOContainer } from './ISOContainer';
import InjectionMachine from './InjectionMachine';
import MilitaryTruck from './MilitaryTruck';
import ExpandableContainer from './ExpandableContainer';
import DeploymentContainer20ft from './DeploymentContainer20ft';
import type { WorkshopPose } from './ExpandableContainer';
import { assemblyMotion, logisticsMotion, CONTAINER, DEPLOYMENT } from './workshopMotion';
export function ProductionEnvironment(){return <group name="ProductionEnvironment"><ISOContainer doors={1.2}><InjectionMachine/></ISOContainer><Box p={[-2.4,.28,1.42]} s={[.62,.15,.43]} mat={steel}/></group>;}
function LaunchTable(){return <group><Box p={[1.9,1.27,0]} s={[.84,.06,.9]} mat={steel}/>{[-.31,.31].map(z=><Box key={z} p={[1.9,.72,z]} s={[.055,1.1,.055]} mat={steel}/>)}</group>;}
export function AssemblyEnvironment({state}:{state:RefObject<ScrollState>}){
 const motion=useRef<WorkshopPose>({expansion:0,reveal:0,lights:0,ready:0});
 const complete=useRef<Group>(null);
 useFrame(()=>{motion.current=assemblyMotion(state.current.assemblyProgress);if(complete.current)complete.current.visible=motion.current.ready>.05;});
 return <group name="AssemblyEnvironment"><ExpandableContainer motion={motion}><group ref={complete} position={[0,0,1.975]}><LaunchTable/><group position={[1.9,1.35,0]} scale={.32} rotation={[0,-Math.PI/2,0]}><DroneModel/></group></group></ExpandableContainer></group>;
}
export function LogisticsEnvironment({state}:{state:RefObject<ScrollState>}){
 const container=useRef<Group>(null),drone=useRef<Group>(null),model=useRef<DroneHandle>(null),power=useRef(0);
 useFrame(()=>{
  const pose=logisticsMotion(state.current.logisticsProgress);
  power.current=phase(state.current.logisticsProgress,.84,.91);
  if(container.current){container.current.position.set(...pose.container);container.current.rotation.y=0;}
  if(drone.current){drone.current.position.set(...pose.drone);drone.current.rotation.set(pose.pitch,-Math.PI/2,0,'YXZ');}
  if(model.current){(['FL','FR','RL','RR'] as const).forEach((id,i)=>{const prop=model.current!.parts[`Propeller${id}`];if(prop)prop.rotation.y=[.5,-.5,-.5,.5][i]+(state.current.reducedMotion?0:pose.rotorAngle*(i%2?1:-1));});}
 });
 return <group name="LogisticsEnvironment"><MilitaryTruck/>{[-2.43,2.43].flatMap(x=>[-1.03,1.03].map(z=><Box key={`${x}${z}`} p={[CONTAINER.bedX+x,1.3,z]} s={[.22,.08,.2]} mat={edge}/>))}
 <group ref={container} name="LoadedContainerHierarchy"><DeploymentContainer20ft state={state}/><group ref={drone} name="LaunchDrone" scale={DEPLOYMENT.droneScale}><DroneModel ref={model}/><RotorBlur model={model} power={power} state={state}/></group></group>
 </group>;
}




