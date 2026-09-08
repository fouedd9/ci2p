const smooth = (p: number, a: number, b: number) => {
  const t = Math.max(0, Math.min(1, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const CONTAINER = { length: 5, width: 2.2, height: 2.65, bedX: 1.65, bedY: 1.34, travel: 1.75 };
export const DEPLOYMENT = { length: 5, width: 2.2, height: 2.1, rows: 6, travel: 2.05, droneScale: .22, selectedRow: 5, selectedSlot: 2 };
export const rackRowX = (row: number) => -1.95 + row * .78;
export const rackProgress = (p: number, row: number) => smooth(p, .58 + row * .012, .70 + row * .012);
export const rackSlotZ = (slot: number) => -.70 + slot * .70;
export function assemblyMotion(progress: number) {
  return { expansion: smooth(progress, .2, .45), reveal: smooth(progress, .45, .58), lights: smooth(progress, .3, .48), ready: smooth(progress, .7, .84) };
}
export function logisticsMotion(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  // Lift, transfer, then lower onto the actual deck surface. All positions are absolute.
  const lift = smooth(p, 0, .08), transfer = smooth(p, .08, .24), settle = smooth(p, .24, .3);
  const takeoff = smooth(p, .91, 1), vertical = smooth(p, .91, .94), flight = smooth(p, .94, 1);
  return {
    container: [CONTAINER.bedX, lift * (CONTAINER.bedY + .18) - settle * .18, 3.7 * (transfer - 1)] as [number, number, number],
    doors: smooth(p, .45, .58),
    lights: smooth(p, .45, .58),
    // One actual outer rack occupant: clear the adjacent aircraft vertically before forward flight.
    drone: [rackRowX(DEPLOYMENT.selectedRow) + flight * (9.5-rackRowX(DEPLOYMENT.selectedRow)), 1.59 + vertical * .8 + flight * 4.98, (DEPLOYMENT.travel * rackProgress(p, DEPLOYMENT.selectedRow) + rackSlotZ(DEPLOYMENT.selectedSlot)) * (1-flight)] as [number, number, number],
    rotorAngle: p < .84 ? 0 : 180 * Math.pow(Math.min(1, (p - .84) / .07), 3) + Math.max(0, p - .91) * 5400,
    pitch: -.10 * flight,
    takeoff,
  };
}






