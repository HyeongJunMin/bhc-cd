import test from 'node:test';
import assert from 'node:assert/strict';

import { paginateRooms } from './pagination.ts';

test('페이지네이션 결과에 hasMore/nextOffset 계약을 포함한다', () => {
  const rooms = ['r1', 'r2', 'r3', 'r4'];

  const page = paginateRooms(rooms, 0, 2);

  assert.deepEqual(page.items, ['r1', 'r2']);
  assert.equal(page.hasMore, true);
  assert.equal(page.nextOffset, 2);
});

test('마지막 페이지에서는 hasMore=false를 반환한다', () => {
  const rooms = ['r1', 'r2', 'r3'];

  const page = paginateRooms(rooms, 2, 2);

  assert.deepEqual(page.items, ['r3']);
  assert.equal(page.hasMore, false);
  assert.equal(page.nextOffset, 3);
});
