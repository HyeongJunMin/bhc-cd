import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

import { hashPassword } from './password.ts';

type UserRecord = {
  id: number;
  username: string;
  passwordHash: string;
};

type AuthState = {
  nextUserId: number;
  usersByUsername: Map<string, UserRecord>;
};

type SignupResult =
  | { ok: true; user: UserRecord }
  | { ok: false; statusCode: 400 | 409; errorCode: 'AUTH_INVALID_INPUT' | 'AUTH_DUPLICATE_USERNAME' };

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function writeJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function getStringField(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function handleSignup(req: IncomingMessage, res: ServerResponse, state: AuthState): Promise<void> {
  const rawBody = await readBody(req);
  let parsedBody: unknown;

  try {
    parsedBody = JSON.parse(rawBody || '{}');
  } catch {
    writeJson(res, 400, { errorCode: 'AUTH_INVALID_JSON' });
    return;
  }

  const username = getStringField((parsedBody as Record<string, unknown>).username);
  const password = getStringField((parsedBody as Record<string, unknown>).password);

  const result = await signup(state, { username, password });
  if (!result.ok) {
    writeJson(res, result.statusCode, { errorCode: result.errorCode });
    return;
  }

  writeJson(res, 201, { userId: result.user.id, username: result.user.username });
}

export async function signup(
  state: AuthState,
  input: { username: string | null; password: string | null },
): Promise<SignupResult> {
  if (!input.username || !input.password) {
    return { ok: false, statusCode: 400, errorCode: 'AUTH_INVALID_INPUT' };
  }

  if (state.usersByUsername.has(input.username)) {
    return { ok: false, statusCode: 409, errorCode: 'AUTH_DUPLICATE_USERNAME' };
  }

  const passwordHash = await hashPassword(input.password);
  const user: UserRecord = {
    id: state.nextUserId,
    username: input.username,
    passwordHash,
  };
  state.nextUserId += 1;
  state.usersByUsername.set(input.username, user);

  return { ok: true, user };
}

export function createAuthHttpServer() {
  const state: AuthState = {
    nextUserId: 1,
    usersByUsername: new Map(),
  };

  const server = createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/auth/signup') {
      await handleSignup(req, res, state);
      return;
    }

    writeJson(res, 404, { errorCode: 'NOT_FOUND' });
  });

  return {
    server,
    state,
  };
}
