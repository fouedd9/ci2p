import { Component, Suspense, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { DroneModel } from "../Drone/DroneModel";
import RotorBlur from "../Drone/RotorBlur";
import type { DroneHandle } from "../Drone/DroneModel";
import DroneAnnotations from "../Drone/DroneAnnotations";
import { droneMotion, phase } from "../Drone/droneMotion";
import { logisticsMotion } from "../environments/workshopMotion";
import {
  ProductionEnvironment,
  AssemblyEnvironment,
  LogisticsEnvironment,
} from "../environments/Environments";
import type { ScrollState } from "../../hooks/useScrollExperience";
// The existing 0–4 chapter progression is the single source for the 0–100% mechanical timeline.
const cameraKeys = [
  { p: 0, pos: [4, 2.5, 5.6] },
  { p: 0.15, pos: [3.8, 2.4, 5.3] },
  { p: 0.3, pos: [5.3, 3.9, 8.1] },
  { p: 0.48, pos: [5.4, 5.5, 8.6] },
  { p: 0.62, pos: [4.7, 5.1, 8.5] },
  { p: 0.82, pos: [4.1, 2.8, 6.6] },
  { p: 0.92, pos: [8.7, 4.8, 12.5] },
  { p: 1, pos: [7.2, 3.8, 13] },
];
const lerp = THREE.MathUtils.lerp;
function Scene({ state }: { state: RefObject<ScrollState> }) {
  const drone = useRef<THREE.Group>(null),
    production = useRef<THREE.Group>(null),
    assembly = useRef<THREE.Group>(null),
    logistics = useRef<THREE.Group>(null);
  const key = useRef<THREE.DirectionalLight>(null),
    rim = useRef<THREE.DirectionalLight>(null),
    ambient = useRef<THREE.AmbientLight>(null);
  const target = useRef(new THREE.Vector3());
  const heroModel = useRef<DroneHandle>(null),
    rotorPower = useRef(0);
  const technicalState = useRef<ScrollState>({ ...state.current });
  useFrame(({ camera, pointer, size, clock, scene }) => {
    scene.environmentIntensity = 0.32;
    const p = state.current.progress / 4,
      reduced = state.current.reducedMotion,
      mobile = size.width < 760;
    const pose = droneMotion(p);
    rotorPower.current = phase(p, 0.76, 0.86);
    const intro = reduced || p > 0.015 ? 1 : phase(clock.elapsedTime, 0.2, 3.6);
    const technical = phase(p, 0.24, 0.32) * (1 - phase(p, 0.46, 0.5));
    technicalState.current = {
      ...state.current,
      progress: p >= 0.5 ? 3.28 : state.current.progress,
    };
    const productionWeight = phase(p, 0.15, 0.23) * (1 - phase(p, 0.3, 0.38));
    const index = Math.max(
      0,
      cameraKeys.findIndex(
        (v, i) =>
          i < cameraKeys.length - 1 && p >= v.p && p <= cameraKeys[i + 1].p,
      ),
    );
    const a = cameraKeys[index],
      b = cameraKeys[index + 1],
      t = phase(p, a.p, b.p);
    camera.position.set(
      lerp(a.pos[0], b.pos[0], t),
      lerp(a.pos[1], b.pos[1], t) + (mobile ? 2 : 0),
      lerp(a.pos[2], b.pos[2], t) *
        (mobile ? Math.max(1.75, (760 / size.width) * 0.7) : 1),
    );
    target.current.set(
      mobile ? 0 : -0.8,
      mobile ? 1.1 + phase(p, 0.15, 0.23) * 0.5 + productionWeight * 0.9 : 0.4,
      0,
    );
    const assemblyFocus = phase(p, 0.46, 0.5) * (1 - phase(p, 0.62, 0.72));
    const ap = state.current.assemblyProgress;
    camera.position.lerp(
      new THREE.Vector3(
        6.5 - ap * 0.7,
        3.2 - phase(ap, 0.45, 0.7) * 1.05 + (mobile ? 2 : 0),
        (9 - ap * 0.5) * (mobile ? 1.95 : 1),
      ),
      assemblyFocus,
    );
    target.current.lerp(
      new THREE.Vector3(mobile ? 0 : -0.6, mobile ? 2 : -0.3, 0),
      assemblyFocus,
    );
    const logisticsBlend = phase(p, 0.83, 1);
    const lp = state.current.logisticsProgress,
      launch = logisticsMotion(lp),
      flight = launch.takeoff;
    camera.position.lerp(
      new THREE.Vector3(
        7 +
          phase(lp, 0.42, 0.68) * 2 +
          phase(lp, 0.84, 0.91) * 3 -
          flight * 2.4,
        4.8 +
          phase(lp, 0.42, 0.68) * 1.2 -
          phase(lp, 0.84, 0.91) * 2.7 -
          flight * 0.5 +
          (mobile ? 2 : 0),
        (12.5 -
          phase(lp, 0.42, 0.68) * 2 -
          phase(lp, 0.84, 0.91) * 3.5 +
          flight * 1.5) *
          (mobile ? 1.65 + phase(lp, 0.8, 0.92) * 0.4 : 1),
      ),
      logisticsBlend,
    );
    target.current.lerp(
      new THREE.Vector3(
        mobile ? phase(lp, 0.8, 0.9) + flight * 3.3 : -0.5 + flight * 2.1,
        mobile ? 2.1 : -0.3 + flight * 0.4,
        -0.8 + flight * 0.8,
      ),
      logisticsBlend,
    );
    const rackView =
      phase(lp, 0.58, 0.76) * (1 - phase(lp, 0.84, 0.94)) * logisticsBlend;
    camera.position.lerp(
      new THREE.Vector3(13, mobile ? 12 : 10, mobile ? 13 : 4),
      rackView,
    );
    const approach = phase(lp, 0.92, 1) * logisticsBlend;
    camera.position.lerp(
      new THREE.Vector3(
        mobile ? 8 : 10.2,
        mobile ? 5.5 : 5.1,
        mobile ? 3.8 : 1.15,
      ),
      approach,
    );
    target.current.lerp(
      new THREE.Vector3(
        mobile ? (launch.drone[0] + 1.65) * 0.5976 - 0.16 : 8.9,
        mobile ? (launch.drone[1] + 1.34) * 0.5976 - 0.9 : 4.5,
        mobile ? launch.drone[2] * 0.5976 - 0.15 : 0,
      ),
      approach,
    );
    camera.lookAt(target.current);
    if (key.current)
      key.current.intensity =
        (2.65 + technical * 0.65 + pose.power * 0.35) * (0.12 + intro * 0.88);
    if (rim.current)
      rim.current.intensity = (2.2 + technical * 0.65) * (0.25 + intro * 0.75);
    if (ambient.current)
      ambient.current.intensity = 0.28 + intro * 0.14 + technical * 0.15;
    if (drone.current) {
      const industrial = phase(p, 0.15, 0.3) * (1 - phase(p, 0.62, 0.82));
      const wide = phase(p, 0.82, 0.94);
      const hover =
        !reduced && p < 0.15
          ? Math.sin(clock.elapsedTime * 0.65) * 0.025 * intro
          : 0;
      const vibration = reduced ? 0 : Math.sin(p * 2000) * pose.power * 0.0015;
      drone.current.position.set(
        mobile ? 0 : lerp(0, 1.65, industrial) + wide * 0.3,
        0.3 +
          industrial * (mobile ? 0.5 : 1.35) +
          wide * 1.5 +
          pose.takeoff * 0.65 +
          hover,
        industrial * 0.45 - pose.takeoff * 0.7,
      );
      drone.current.scale.setScalar(
        (1 - industrial * 0.14 - wide * 0.2) *
          (mobile
            ? (1 - phase(p, 0.15, 0.23) * 0.22) * (1 - productionWeight * 0.18)
            : 1),
      );
      const showcase =
        p < 0.5
          ? 1 - phase(p, 0.46, 0.5)
          : phase(p, 0.7, 0.76) * (1 - phase(p, 0.82, 0.9));
      drone.current.scale.multiplyScalar(
        showcase * (mobile ? 1 + technical * 0.18 : 1),
      );
      drone.current.visible = showcase > 0.001;
      drone.current.rotation.set(
        0.08 -
          pose.takeoff * 0.13 +
          vibration +
          (reduced || mobile || p > 0.15 ? 0 : pointer.y * 0.02),
        Math.PI -
          0.35 +
          (1 - intro) * 0.13 +
          phase(p, 0.48, 0.62) * 0.15 +
          pose.takeoff * 0.6 +
          (reduced || mobile || p > 0.15 ? 0 : pointer.x * 0.045),
        -0.03 + vibration,
      );
    }
    const environments = [
      {
        ref: production,
        w: phase(p, 0.15, 0.23) * (1 - phase(p, 0.3, 0.38)),
        s: 0.55,
        z: -1.2,
      },
      {
        ref: assembly,
        w: phase(p, 0.44, 0.5) * (1 - phase(p, 0.62, 0.72)),
        s: 0.72,
        z: -1.2,
      },
      { ref: logistics, w: phase(p, 0.86, 1), s: 0.72, z: -0.15 },
    ];
    environments.forEach(({ ref, w, s, z }) => {
      if (ref.current) {
        ref.current.visible = w > 0.001;
        ref.current.position.set((mobile ? 0 : 1.3) + (1 - w) * 7, -1.5, z);
        ref.current.scale.setScalar(
          s * (mobile ? 0.83 * (1 - productionWeight * 0.2) : 1),
        );
      }
    });
  });
  return (
    <>
      <color attach="background" args={["#0b0b0b"]} />
      <ambientLight ref={ambient} intensity={0.42} />
      <hemisphereLight args={["#c8d1dc", "#30291d", 0.85]} />
      <directionalLight
        ref={key}
        position={[2, 6, 4]}
        intensity={3.4}
        color="#fff0d8"
      />
      <directionalLight
        ref={rim}
        position={[-4, 3, -3]}
        intensity={2.2}
        color="#a3b6bf"
      />
      <spotLight
        position={[4, 5, -1]}
        angle={0.8}
        penumbra={1}
        intensity={20}
        color="#e9cba2"
      />
      <Environment resolution={64} frames={1}>
        <Lightformer
          intensity={2}
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 5, 1]}
        />
        <Lightformer
          intensity={1.5}
          position={[-4, 2, 3]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[2, 5, 1]}
        />
        <Lightformer
          intensity={1.2}
          position={[4, 1, -3]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[2, 4, 1]}
        />
      </Environment>
      <group ref={drone}>
        <DroneModel ref={heroModel} state={technicalState} />
        <RotorBlur model={heroModel} power={rotorPower} state={state} />
        <DroneAnnotations state={state} />
      </group>
      <group ref={production} visible={false}>
        <ProductionEnvironment />
      </group>
      <group ref={assembly} visible={false} rotation={[0, -1.05, 0]}>
        <AssemblyEnvironment state={state} />
      </group>
      <group ref={logistics} visible={false}>
        <LogisticsEnvironment state={state} />
      </group>
      {!window.matchMedia("(max-width: 600px)").matches && (
        <ContactShadows
          position={[0, -1.52, 0]}
          opacity={0.58}
          scale={25}
          blur={2.4}
          far={7}
          resolution={256}
        />
      )}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.55, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#090b0a" roughness={1} metalness={0} />
      </mesh>
      <fog attach="fog" args={["#0b0b0b", 18, 42]} />
    </>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="webgl-fallback">
        L’aperçu 3D nécessite WebGL.
        <br />
        Découvrez le projet en poursuivant votre lecture.
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function Experience({
  state,
}: {
  state: RefObject<ScrollState>;
}) {
  return (
    <div className="experience" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [4, 2.5, 5.6], fov: 36, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            <Scene state={state} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
