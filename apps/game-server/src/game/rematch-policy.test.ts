import test from 'node:test';
import assert from 'node:assert/strict';

import { resetScoresForRematch } from './rematch-policy.ts';

test('재경기 시작 시 모든 플레이어 점수를 0으로 초기화한다', () => {
  const initialScoreBoard = {
    p1: 10,
    p2: 6,
    p3: 2,
  };

  const nextScoreBoard = resetScoresForRematch(initialScoreBoard);

  assert.deepEqual(nextScoreBoard, {
    p1: 0,
    p2: 0,
    p3: 0,
  });
});

test('점수 초기화는 기존 점수판 객체를 변경하지 않는다', () => {
  const initialScoreBoard = {
    p1: 3,
    p2: 1,
  };

  const nextScoreBoard = resetScoresForRematch(initialScoreBoard);

  assert.notEqual(nextScoreBoard, initialScoreBoard);
  assert.deepEqual(initialScoreBoard, {
    p1: 3,
    p2: 1,
  });
});
