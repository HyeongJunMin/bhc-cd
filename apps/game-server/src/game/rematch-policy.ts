import type { ScoreBoard } from './score-policy.ts';
import type { TurnState } from './turn-policy.ts';

export type GameState = 'WAITING' | 'IN_GAME' | 'FINISHED';

export type StartRematchResult =
  | {
      ok: true;
      nextRoomState: 'IN_GAME';
      turnState: TurnState;
    }
  | {
      ok: false;
      errorCode: 'GAME_NOT_ENOUGH_PLAYERS';
    };

export function resetScoresForRematch(scoreBoard: ScoreBoard): ScoreBoard {
  return Object.keys(scoreBoard).reduce<ScoreBoard>((nextScoreBoard, playerId) => {
    nextScoreBoard[playerId] = 0;
    return nextScoreBoard;
  }, {});
}

export function startRematch(previousTurnState: TurnState): StartRematchResult {
  if (previousTurnState.queue.length < 2) {
    return {
      ok: false,
      errorCode: 'GAME_NOT_ENOUGH_PLAYERS',
    };
  }

  return {
    ok: true,
    nextRoomState: 'IN_GAME',
    turnState: {
      queue: [...previousTurnState.queue],
      currentIndex: 0,
    },
  };
}
