import type { TurnCollisionEvent } from './three-cushion-model.ts';

export type TurnEventTracker = {
  turnId: string;
  events: TurnCollisionEvent[];
};

export function initTurnEventTracker(turnId: string): TurnEventTracker {
  return {
    turnId,
    events: [],
  };
}
