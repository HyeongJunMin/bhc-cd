import test from 'node:test';
import assert from 'node:assert/strict';

import { isTurnCollisionEventList } from './three-cushion-model.ts';

test('유효한 충돌 이벤트 리스트를 입력 모델로 인정한다', () => {
  const events = [
    {
      type: 'BALL_COLLISION',
      atMs: 10,
      sourceBallId: 'cue',
      targetBallId: 'ob1',
    },
    {
      type: 'CUSHION_COLLISION',
      atMs: 20,
      sourceBallId: 'cue',
      cushionId: 'top',
    },
  ];

  assert.equal(isTurnCollisionEventList(events), true);
});

test('필수 필드가 누락된 이벤트는 입력 모델에서 거부한다', () => {
  const invalidEvents = [
    {
      type: 'BALL_COLLISION',
      atMs: 10,
      sourceBallId: 'cue',
    },
  ];

  assert.equal(isTurnCollisionEventList(invalidEvents), false);
});
