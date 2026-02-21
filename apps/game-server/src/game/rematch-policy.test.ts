import test from 'node:test';
import assert from 'node:assert/strict';

import { resetScoresForRematch, startRematch } from './rematch-policy.ts';

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

test('재경기 시작 시 기존 턴 순서를 유지하고 방 상태를 IN_GAME으로 전이한다', () => {
  const result = startRematch({
    queue: ['p1', 'p2', 'p3'],
    currentIndex: 2,
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.nextRoomState, 'IN_GAME');
    assert.deepEqual(result.turnState.queue, ['p1', 'p2', 'p3']);
    assert.equal(result.turnState.currentIndex, 0);
  }
});

test('재경기 시작 시 플레이어가 2명 미만이면 거부한다', () => {
  const result = startRematch({
    queue: ['p1'],
    currentIndex: 0,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errorCode, 'GAME_NOT_ENOUGH_PLAYERS');
  }
});
