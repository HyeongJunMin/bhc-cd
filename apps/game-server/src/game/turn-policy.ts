export type TurnState = {
  queue: string[];
  currentIndex: number;
};

export type TurnTimeoutResult = {
  timedOut: boolean;
  skippedPlayerId: string | null;
  nextPlayerId: string | null;
};

export function createTurnState(playerIds: string[]): TurnState {
  return {
    queue: [...playerIds],
    currentIndex: 0,
  };
}

export function getCurrentTurnPlayerId(turnState: TurnState): string | null {
  if (turnState.queue.length === 0) {
    return null;
  }

  return turnState.queue[turnState.currentIndex] ?? null;
}

export function advanceTurn(turnState: TurnState): TurnState {
  if (turnState.queue.length === 0) {
    return turnState;
  }

  turnState.currentIndex = (turnState.currentIndex + 1) % turnState.queue.length;
  return turnState;
}

export function handleTurnTimeout(turnState: TurnState): TurnTimeoutResult {
  const skippedPlayerId = getCurrentTurnPlayerId(turnState);
  if (skippedPlayerId === null) {
    return {
      timedOut: false,
      skippedPlayerId: null,
      nextPlayerId: null,
    };
  }

  advanceTurn(turnState);

  return {
    timedOut: true,
    skippedPlayerId,
    nextPlayerId: getCurrentTurnPlayerId(turnState),
  };
}
