import test from 'node:test';
import assert from 'node:assert/strict';

import { mapHorizontalRotation, normalizeDirectionDeg } from './control-mapping.ts';

test('수평 방향은 0 이상 360 미만으로 정규화한다', () => {
  assert.equal(normalizeDirectionDeg(370), 10);
  assert.equal(normalizeDirectionDeg(-30), 330);
  assert.equal(normalizeDirectionDeg(720), 0);
});

test('좌우 회전 입력은 360도 기준으로 순환 누적된다', () => {
  const nextFromRight = mapHorizontalRotation(350, 20);
  const nextFromLeft = mapHorizontalRotation(10, -30);

  assert.equal(nextFromRight, 10);
  assert.equal(nextFromLeft, 340);
});
