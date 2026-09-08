import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export const paint=new THREE.MeshStandardMaterial({color:'#988a70',metalness:.26,roughness:.78});
export const panel=new THREE.MeshStandardMaterial({color:'#82765f',metalness:.25,roughness:.82});
export const edge=new THREE.MeshStandardMaterial({color:'#b2a58a',metalness:.55,roughness:.45});
export const steel=new THREE.MeshStandardMaterial({color:'#343938',metalness:.72,roughness:.43});
export const rubber=new THREE.MeshStandardMaterial({color:'#171a19',metalness:0,roughness:.96});
export const glass=new THREE.MeshStandardMaterial({color:'#1d2c30',metalness:.5,roughness:.16});
export const safetyGlass=new THREE.MeshStandardMaterial({color:'#8badaf',metalness:.25,roughness:.24,transparent:true,opacity:.19,depthWrite:false});
export const orange=new THREE.MeshStandardMaterial({color:'#b67937',metalness:.35,roughness:.6});
export const lamp=new THREE.MeshStandardMaterial({color:'#fff1d5',emissive:'#ffd9a5',emissiveIntensity:2});
// Small deterministic roughness map: painted steel variation without downloaded textures.
const roughnessData=new Uint8Array(32*32*4);
let seed=37;
for(let i=0;i<32*32;i++){seed=(seed*1664525+1013904223)>>>0;const value=190+(seed%66);roughnessData.set([value,value,value,255],i*4);}
const roughness=new THREE.DataTexture(roughnessData,32,32);
roughness.wrapS=roughness.wrapT=THREE.RepeatWrapping;
roughness.magFilter=roughness.minFilter=THREE.LinearFilter;
roughness.repeat.set(6,6);roughness.needsUpdate=true;
for(const material of [paint,panel,edge])material.roughnessMap=roughness;
const cube=new THREE.BoxGeometry(1,1,1);
const bevel=new RoundedBoxGeometry(1,1,1,1,.045);
export type Vec=[number,number,number];
export function Box({p=[0,0,0],s,mat=paint,r=[0,0,0],sharp=false}:{p?:Vec;s:Vec;mat?:THREE.Material;r?:Vec;sharp?:boolean}){return <mesh position={p} scale={s} rotation={r} geometry={sharp?cube:bevel} material={mat} castShadow receiveShadow/>;}
export function Cylinder({p=[0,0,0],radius=.05,length=.2,mat=steel,r=[0,0,0]}:{p?:Vec;radius?:number;length?:number;mat?:THREE.Material;r?:Vec}){return <mesh position={p} rotation={r} material={mat} castShadow><cylinderGeometry args={[radius,radius,length,16]}/></mesh>;}
export type Instance={p:Vec;s:Vec;r?:Vec};
// Repeated ribs, tread blocks and fasteners share one draw call per material.
export function Details({items,mat=paint,geometry=cube}:{items:Instance[];mat?:THREE.Material;geometry?:THREE.BufferGeometry}){
 const ref=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{const dummy=new THREE.Object3D();items.forEach((item,i)=>{dummy.position.set(...item.p);dummy.scale.set(...item.s);dummy.rotation.set(...(item.r??[0,0,0]));dummy.updateMatrix();ref.current!.setMatrixAt(i,dummy.matrix);});ref.current!.instanceMatrix.needsUpdate=true;ref.current!.computeBoundingSphere();},[items]);
 return <instancedMesh ref={ref} args={[geometry,mat,items.length]} castShadow receiveShadow/>;
}
export function Warning({p,r=[0,0,0]}:{p:Vec;r?:Vec}){return <group position={p} rotation={r}><Box s={[.19,.15,.014]} mat={orange}/><Box p={[0,.02,.01]} s={[.018,.055,.01]} mat={rubber}/><Box p={[0,-.03,.01]} s={[.018,.017,.01]} mat={rubber}/></group>;}


