import test from 'node:test';
import assert from 'node:assert/strict';

import { broadcastRoomChat } from './room-chat.ts';

test('룸 채팅은 같은 방 참가자에게만 전파된다', () => {
  const result = broadcastRoomChat(
    [
      { memberId: 'u1', roomId: 'room-1' },
      { memberId: 'u2', roomId: 'room-1' },
      { memberId: 'u3', roomId: 'room-2' },
    ],
    'room-1',
    'u1',
    'hello',
  );

  assert.deepEqual(result.recipients, ['u1', 'u2']);
  assert.equal(result.event.roomId, 'room-1');
  assert.equal(result.event.senderMemberId, 'u1');
  assert.equal(result.event.message, 'hello');
});
