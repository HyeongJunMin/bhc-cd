export function normalizeDirectionDeg(directionDeg: number): number {
  const normalized = directionDeg % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function mapHorizontalRotation(currentDirectionDeg: number, deltaDeg: number): number {
  return normalizeDirectionDeg(currentDirectionDeg + deltaDeg);
}
