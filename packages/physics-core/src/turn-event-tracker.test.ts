import test from 'node:test';
import assert from 'node:assert/strict';

import { initTurnEventTracker } from './turn-event-tracker.ts';

test('턴 시작 시 이벤트 추적기를 빈 상태로 초기화한다', () => {
  const tracker = initTurnEventTracker('turn-1');

  assert.equal(tracker.turnId, 'turn-1');
  assert.deepEqual(tracker.events, []);
});
