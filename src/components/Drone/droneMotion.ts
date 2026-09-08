// A pure, absolute scroll timeline. No integration or playback direction state.
export const phase = (p: number, start: number, end: number) => {
  const t = Math.max(0, Math.min(1, (p - start) / (end - start)));
  return t * t * (3 - 2 * t);
};
export function droneMotion(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const out = phase(p, .15, .30);
  const power = phase(p, .82, .92);
  return {
    arms: out * (1 - phase(p, .64, .73)),
    camera: out * (1 - phase(p, .70, .77)),
    battery: out * (1 - phase(p, .75, .82)),
    core: out * (1 - phase(p, .62, .67)),
    annotations: phase(p, .46, .48) * (1 - phase(p, .60, .62)),
    power,
    // Angle is an absolute function: fast scrubbing and reverse are exact.
    rotorAngle: p < .82 ? 0 : p < .92 ? 100 * Math.pow((p - .82) / .1, 3) : 100 + (p - .92) * 3000,
    takeoff: phase(p, .92, 1),
  };
}
