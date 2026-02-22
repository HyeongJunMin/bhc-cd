export type RoomPageResult<T> = {
  items: T[];
  hasMore: boolean;
  nextOffset: number;
};

export function paginateRooms<T>(rooms: T[], offset: number, limit: number): RoomPageResult<T> {
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(1, limit);

  const items = rooms.slice(safeOffset, safeOffset + safeLimit);
  const nextOffset = safeOffset + items.length;

  return {
    items,
    hasMore: nextOffset < rooms.length,
    nextOffset,
  };
}
