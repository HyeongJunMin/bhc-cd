export type RoomParticipant = {
  memberId: string;
  roomId: string;
};

export type RoomChatEvent = {
  roomId: string;
  senderMemberId: string;
  message: string;
};

export type RoomChatBroadcast = {
  recipients: string[];
  event: RoomChatEvent;
};

export function broadcastRoomChat(
  participants: RoomParticipant[],
  roomId: string,
  senderMemberId: string,
  message: string,
): RoomChatBroadcast {
  const recipients = participants
    .filter((participant) => participant.roomId === roomId)
    .map((participant) => participant.memberId);

  return {
    recipients,
    event: {
      roomId,
      senderMemberId,
      message,
    },
  };
}
