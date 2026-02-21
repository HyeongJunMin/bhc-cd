export const CHAT_RATE_LIMIT_WINDOW_MS = 3000;

export type UserLastSentAtStore = Map<string, number>;

export type ChatRateLimitResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      errorCode: 'CHAT_RATE_LIMITED';
      retryAfterMs: number;
    };

export function recordLastChatSentAt(
  userLastSentAtStore: UserLastSentAtStore,
  memberId: string,
  sentAtMs: number,
): UserLastSentAtStore {
  userLastSentAtStore.set(memberId, sentAtMs);
  return userLastSentAtStore;
}

export function getLastChatSentAt(userLastSentAtStore: UserLastSentAtStore, memberId: string): number | null {
  return userLastSentAtStore.get(memberId) ?? null;
}

export function evaluateChatRateLimit(
  userLastSentAtStore: UserLastSentAtStore,
  memberId: string,
  nowMs: number,
): ChatRateLimitResult {
  const lastSentAtMs = getLastChatSentAt(userLastSentAtStore, memberId);
  if (lastSentAtMs === null) {
    return { ok: true };
  }

  const elapsedMs = nowMs - lastSentAtMs;
  if (elapsedMs >= CHAT_RATE_LIMIT_WINDOW_MS) {
    return { ok: true };
  }

  return {
    ok: false,
    errorCode: 'CHAT_RATE_LIMITED',
    retryAfterMs: CHAT_RATE_LIMIT_WINDOW_MS - elapsedMs,
  };
}
