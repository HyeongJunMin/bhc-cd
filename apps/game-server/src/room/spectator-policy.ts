export type JoinRole = 'PLAYER' | 'SPECTATOR';

export type SpectatorJoinDecision =
  | { ok: true }
  | { ok: false; errorCode: 'ROOM_SPECTATOR_NOT_ALLOWED' };

export function evaluateSpectatorJoin(role: JoinRole): SpectatorJoinDecision {
  if (role === 'SPECTATOR') {
    return { ok: false, errorCode: 'ROOM_SPECTATOR_NOT_ALLOWED' };
  }

  return { ok: true };
}
