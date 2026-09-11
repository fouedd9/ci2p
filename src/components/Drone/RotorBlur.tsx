import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DroneHandle } from "./DroneModel";
import type { ScrollState } from "../../hooks/useScrollExperience";
const disc = new THREE.RingGeometry(0.07, 0.49, 32);
const ids = ["FL", "FR", "RL", "RR"] as const;
/** Optical persistence only; the validated propeller transforms remain unchanged. */
export default function RotorBlur({
  model,
  power,
  state,
}: {
  model: RefObject<DroneHandle | null>;
  power: RefObject<number>;
  state: RefObject<ScrollState>;
}) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#84938f",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useFrame(() => {
    const strength = state.current.reducedMotion ? 0 : power.current;
    material.opacity = strength * 0.105;
    meshes.current.forEach((mesh, i) => {
      if (mesh) {
        const prop = model.current?.parts[`Propeller${ids[i]}`];
        mesh.visible = strength > 0.05 && !!prop;
        if (prop) {
          mesh.position.copy(prop.position);
          mesh.position.y += 0.035;
        }
      }
    });
  });
  return (
    <group name="OpticalRotorPersistence">
      {ids.map((id, i) => (
        <mesh
          key={id}
          ref={(g) => {
            meshes.current[i] = g;
          }}
          geometry={disc}
          material={material}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      ))}
    </group>
  );
}
