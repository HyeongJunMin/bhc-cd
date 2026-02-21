export type RoomMember = {
  memberId: string;
  joinedAt: string;
};

export type RoomRoster = {
  hostMemberId: string | null;
  joinOrder: string[];
  membersById: Map<string, RoomMember>;
};

export function createRoomRoster(): RoomRoster {
  return {
    hostMemberId: null,
    joinOrder: [],
    membersById: new Map(),
  };
}

export function addMemberToRoster(roster: RoomRoster, memberId: string): RoomRoster {
  const joinedAt = new Date().toISOString();
  roster.membersById.set(memberId, { memberId, joinedAt });
  roster.joinOrder.push(memberId);

  if (!roster.hostMemberId) {
    roster.hostMemberId = memberId;
  }

  return roster;
}
