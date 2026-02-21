import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clampCueElevationDeg,
  mapHorizontalRotation,
  mapVerticalRotation,
  normalizeDirectionDeg,
} from './control-mapping.ts';

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

test('수직 각도는 0~89 범위로 클램프한다', () => {
  assert.equal(clampCueElevationDeg(-10), 0);
  assert.equal(clampCueElevationDeg(40), 40);
  assert.equal(clampCueElevationDeg(120), 89);
});

test('상하 회전 입력은 누적 후 0~89 범위로 제한된다', () => {
  const nextUp = mapVerticalRotation(80, 15);
  const nextDown = mapVerticalRotation(5, -20);

  assert.equal(nextUp, 89);
  assert.equal(nextDown, 0);
});
