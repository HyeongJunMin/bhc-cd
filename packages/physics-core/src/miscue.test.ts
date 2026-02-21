import test from 'node:test';
import assert from 'node:assert/strict';

import { CUE_BALL_RADIUS_M, isMiscue } from './miscue.ts';

test('임계 반경 안쪽 타격은 미스큐가 아니다', () => {
  const inside = 0.5 * CUE_BALL_RADIUS_M;

  assert.equal(isMiscue(inside, 0), false);
});

test('임계 반경 바깥 타격은 미스큐다', () => {
  const outside = 0.95 * CUE_BALL_RADIUS_M;

  assert.equal(isMiscue(outside, 0), true);
});
