import test from 'node:test';
import assert from 'node:assert/strict';

import { START_RACK_LAYOUT, applyStartRackLayout, resetRackForRematch } from './rack-layout.ts';

test('경기 시작 배치 좌표 상수가 정의되어 있다', () => {
  assert.equal(typeof START_RACK_LAYOUT.cueBall.x, 'number');
  assert.equal(typeof START_RACK_LAYOUT.cueBall.y, 'number');
  assert.equal(typeof START_RACK_LAYOUT.objectBall1.x, 'number');
  assert.equal(typeof START_RACK_LAYOUT.objectBall2.x, 'number');
});

test('두 목적구는 같은 x축, 서로 다른 y축에 배치된다', () => {
  assert.equal(START_RACK_LAYOUT.objectBall1.x, START_RACK_LAYOUT.objectBall2.x);
  assert.notEqual(START_RACK_LAYOUT.objectBall1.y, START_RACK_LAYOUT.objectBall2.y);
});

test('시작 배치 적용 함수는 배치 상태를 반환한다', () => {
  const placement = applyStartRackLayout();

  assert.deepEqual(placement, START_RACK_LAYOUT);
  assert.notEqual(placement.cueBall, START_RACK_LAYOUT.cueBall);
});

test('재경기 재배치는 시작 좌표로 복원하고 속도/스핀을 0으로 초기화한다', () => {
  const rematchState = resetRackForRematch();

  assert.deepEqual(rematchState.cueBall, START_RACK_LAYOUT.cueBall);
  assert.deepEqual(rematchState.objectBall1, START_RACK_LAYOUT.objectBall1);
  assert.deepEqual(rematchState.objectBall2, START_RACK_LAYOUT.objectBall2);

  assert.deepEqual(rematchState.linearVelocityByBall, {
    cueBall: { x: 0, y: 0 },
    objectBall1: { x: 0, y: 0 },
    objectBall2: { x: 0, y: 0 },
  });
  assert.deepEqual(rematchState.angularVelocityByBall, {
    cueBall: { x: 0, y: 0 },
    objectBall1: { x: 0, y: 0 },
    objectBall2: { x: 0, y: 0 },
  });
});
