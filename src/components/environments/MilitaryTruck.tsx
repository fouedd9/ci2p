import * as THREE from "three";
import {
  Box,
  Cylinder,
  Details,
  paint,
  panel,
  edge,
  steel,
  rubber,
  glass,
  lamp,
  orange,
} from "./IndustrialParts";
import type { Instance } from "./IndustrialParts";
const profile = new THREE.Shape();
profile.moveTo(-3.38, 1.04);
profile.lineTo(-3.47, 1.53);
profile.lineTo(-3.21, 2.58);
profile.lineTo(-2.98, 2.85);
profile.lineTo(-1.62, 2.85);
profile.lineTo(-1.45, 2.64);
profile.lineTo(-1.45, 1.04);
profile.lineTo(-1.77, 1.04);
profile.lineTo(-1.95, 1.4);
profile.lineTo(-2.74, 1.4);
profile.lineTo(-3.03, 1.04);
profile.closePath();
const cabGeometry = new THREE.ExtrudeGeometry(profile, {
  depth: 2.1,
  bevelEnabled: true,
  bevelSegments: 1,
  steps: 1,
  bevelSize: 0.045,
  bevelThickness: 0.045,
});
cabGeometry.translate(0, 0, -1.05);
const sideWindow = new THREE.Shape();
sideWindow.moveTo(-3.1, 2.5);
sideWindow.lineTo(-2.91, 1.98);
sideWindow.lineTo(-1.77, 1.98);
sideWindow.lineTo(-1.77, 2.59);
sideWindow.closePath();
const sideGlass = new THREE.ShapeGeometry(sideWindow);
const treads: Instance[] = [],
  bolts: Instance[] = [];
const axles = [-2.45, -0.8, 1.62, 2.93];
for (const x of axles)
  for (const side of [-1, 1]) {
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI) / 12;
      for (const lane of [-1, 1])
        treads.push({
          p: [
            x + Math.cos(a) * 0.622,
            0.66 + Math.sin(a) * 0.622,
            side * 1.16 + lane * 0.13,
          ],
          s: [0.14, 0.07, 0.17],
          r: [0, lane * 0.2, a - Math.PI / 2],
        });
    }
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      bolts.push({
        p: [x + Math.cos(a) * 0.22, 0.66 + Math.sin(a) * 0.22, side * 1.438],
        s: [0.05, 0.05, 0.026],
      });
    }
  }
function Wheel({ x, side }: { x: number; side: number }) {
  return (
    <group position={[x, 0.66, side * 1.16]}>
      <mesh material={rubber} castShadow>
        <torusGeometry args={[0.455, 0.17, 10, 28]} />
      </mesh>
      <Cylinder
        radius={0.44}
        length={0.4}
        mat={rubber}
        r={[Math.PI / 2, 0, 0]}
      />
      <Cylinder
        p={[0, 0, side * 0.235]}
        radius={0.32}
        length={0.035}
        mat={panel}
        r={[Math.PI / 2, 0, 0]}
      />
      <Cylinder
        p={[0, 0, side * 0.266]}
        radius={0.14}
        length={0.09}
        mat={steel}
        r={[Math.PI / 2, 0, 0]}
      />
      <mesh material={edge} position={[0, 0, side * 0.256]}>
        <torusGeometry args={[0.3, 0.018, 6, 24]} />
      </mesh>
    </group>
  );
}
export default function MilitaryTruck() {
  return (
    <group name="MilitaryLogistics8x8">
      <mesh geometry={cabGeometry} material={paint} castShadow receiveShadow />
      <Box
        p={[-3.335, 2.18, 0]}
        s={[0.025, 0.66, 1.88]}
        r={[0, 0, -0.24]}
        mat={rubber}
      />
      <Box
        p={[-3.354, 2.19, 0]}
        s={[0.028, 0.56, 1.72]}
        r={[0, 0, -0.24]}
        mat={glass}
      />
      <Box
        p={[-3.372, 2.19, 0]}
        s={[0.032, 0.61, 0.045]}
        r={[0, 0, -0.24]}
        mat={edge}
      />
      {[-0.48, 0.48].map((z) => (
        <Box
          key={z}
          p={[-3.439, 1.975, z]}
          s={[0.025, 0.022, 0.55]}
          r={[0.17, 0, 0]}
          mat={rubber}
        />
      ))}
      <Box p={[-3.5, 1.34, 0]} s={[0.08, 0.39, 1.64]} mat={rubber} />
      <Details
        mat={panel}
        items={Array.from({ length: 9 }, (_, i) => ({
          p: [-3.55, 1.34, -0.7 + i * 0.175],
          s: [0.035, 0.31, 0.04],
        }))}
      />
      <Box p={[-3.6, 0.94, 0]} s={[0.22, 0.22, 2.43]} mat={steel} />
      {[-0.88, 0.88].map((z) => (
        <group key={z}>
          <Box p={[-3.57, 1.13, z]} s={[0.11, 0.25, 0.37]} mat={rubber} />
          <Box p={[-3.637, 1.14, z]} s={[0.018, 0.13, 0.24]} mat={lamp} />
          <Cylinder
            p={[-3.72, 0.85, z * 0.65]}
            radius={0.062}
            length={0.06}
            mat={edge}
            r={[0, 0, Math.PI / 2]}
          />
        </group>
      ))}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            geometry={sideGlass}
            position={[0, 0, side * 1.102]}
            material={glass}
            rotation={side < 0 ? [0, 0, 0] : [0, 0, 0]}
          >
            <meshStandardMaterial
              color="#263a3c"
              metalness={0.7}
              roughness={0.19}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Box
            p={[-2.17, 1.68, side * 1.103]}
            s={[0.98, 0.43, 0.022]}
            mat={panel}
          />
          <Box
            p={[-1.84, 1.85, side * 1.13]}
            s={[0.19, 0.04, 0.04]}
            mat={rubber}
          />
          <Box
            p={[-3.02, 2.35, side * 1.26]}
            s={[0.04, 0.51, 0.04]}
            mat={steel}
          />
          <Box
            p={[-3.02, 2.12, side * 1.41]}
            s={[0.075, 0.36, 0.2]}
            mat={rubber}
          />
          <Box
            p={[-2.98, 2.12, side * 1.414]}
            s={[0.012, 0.29, 0.15]}
            mat={glass}
          />
          {[0.6, 0.83, 1.05].map((y) => (
            <Box
              key={y}
              p={[-1.59, y, side * 1.11]}
              s={[0.37, 0.06, 0.3]}
              mat={steel}
            />
          ))}
          {axles.map((x) => (
            <group key={x}>
              <Wheel x={x} side={side} />
              <mesh position={[x, 0.66, side * 1.16]} material={paint}>
                <torusGeometry args={[0.74, 0.055, 4, 16, Math.PI]} />
              </mesh>
              <Box
                p={[x + 0.68, 0.7, side * 1.16]}
                s={[0.055, 0.49, 0.48]}
                mat={rubber}
              />
            </group>
          ))}
          <Box p={[0.4, 0.87, side * 0.96]} s={[1, 0.55, 0.5]} mat={panel} />
          {[0.06, 0.73].map((x) => (
            <Box
              key={x}
              p={[x, 0.87, side * 1.222]}
              s={[0.055, 0.54, 0.025]}
              mat={steel}
            />
          ))}
          <Box p={[2.45, 1.32, side * 1.15]} s={[2.25, 0.13, 0.1]} mat={edge} />
        </group>
      ))}
      <Details items={treads} mat={rubber} />
      <Details items={bolts} mat={edge} />
      {[-0.65, 0.65].map((z) => (
        <Box key={z} p={[0.42, 0.93, z]} s={[6.6, 0.23, 0.16]} mat={steel} />
      ))}
      {axles.map((x) => (
        <group key={x}>
          <Cylinder
            p={[x, 0.65, 0]}
            radius={0.09}
            length={2.2}
            r={[Math.PI / 2, 0, 0]}
            mat={steel}
          />
          <Box p={[x, 0.65, 0]} s={[0.35, 0.3, 0.38]} mat={steel} />
          {[-0.62, 0.62].map((z) => (
            <Box
              key={z}
              p={[x, 0.77, z]}
              s={[0.72, 0.055, 0.14]}
              mat={rubber}
            />
          ))}
        </group>
      ))}
      <Box p={[3.74, 1.13, 0]} s={[1.15, 0.15, 2.2]} mat={steel} />
      <Box p={[1.38, 1.25, 0]} s={[5.74, 0.18, 2.32]} mat={panel} />
      <Details
        mat={steel}
        items={Array.from({ length: 16 }, (_, i) => ({
          p: [-1.3 + i * 0.37, 1.348, 0],
          s: [0.014, 0.007, 2.14],
        }))}
      />
      <Box p={[-1.28, 1.95, 0]} s={[0.15, 1.43, 2.18]} mat={steel} />
      <Box p={[-1.18, 2.63, 0]} s={[0.22, 0.13, 2.2]} mat={paint} />
      <Cylinder
        p={[-1.05, 2.12, -0.65]}
        radius={0.32}
        length={0.2}
        r={[0, 0, Math.PI / 2]}
        mat={rubber}
      />
      <Cylinder
        p={[-1.27, 2.14, 0.81]}
        radius={0.055}
        length={1.38}
        mat={steel}
      />
      <Box p={[-2.25, 2.94, 0]} s={[0.72, 0.08, 0.86]} mat={panel} />
      <Cylinder p={[-1.64, 3.23, -0.83]} radius={0.012} length={0.75} />
      <Box p={[4.3, 1.05, 0]} s={[0.13, 0.16, 2.25]} mat={steel} />
      {[-0.92, 0.92].map((z) => (
        <Box key={z} p={[4.38, 1.09, z]} s={[0.02, 0.09, 0.16]} mat={orange} />
      ))}
    </group>
  );
}
