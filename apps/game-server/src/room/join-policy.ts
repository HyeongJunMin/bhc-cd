export const ROOM_MAX_PLAYERS = 6;

export type RoomJoinContext = {
  currentPlayerCount: number;
  roomState: 'WAITING' | 'IN_GAME' | 'FINISHED';
};

export function isRoomFull(currentPlayerCount: number): boolean {
  return currentPlayerCount >= ROOM_MAX_PLAYERS;
}

export function isJoinBlockedByState(roomState: RoomJoinContext['roomState']): boolean {
  return roomState === 'IN_GAME';
}
