import type { ScoreBoard } from './score-policy.ts';

export function resetScoresForRematch(scoreBoard: ScoreBoard): ScoreBoard {
  return Object.keys(scoreBoard).reduce<ScoreBoard>((nextScoreBoard, playerId) => {
    nextScoreBoard[playerId] = 0;
    return nextScoreBoard;
  }, {});
}
