import { createServer } from 'node:http';

const PORT_MIN = 9211;
const PORT_MAX = 9220;
const DEFAULT_WEB_PORT = 9213;

function parsePort(name: string, fallback: number): number {
  const raw = process.env[name];
  const value = raw ? Number(raw) : fallback;

  if (!Number.isInteger(value) || value < PORT_MIN || value > PORT_MAX) {
    throw new Error(`${name} must be an integer in range ${PORT_MIN}-${PORT_MAX}. received: ${raw ?? fallback}`);
  }

  return value;
}

const webPort = parsePort('WEB_PORT', DEFAULT_WEB_PORT);

const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.url === '/login') {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end(
      '<!doctype html><html><head><meta charset="utf-8"><title>BHC Login</title></head><body><main><h1>로그인</h1><p>인증 페이지 준비 중</p><section><h2>로그인</h2><form><input placeholder="아이디" /><input placeholder="비밀번호" type="password" /><button type="submit">로그인</button></form></section><section><h2>회원가입</h2><form><input placeholder="아이디" /><input placeholder="비밀번호" type="password" /><button type="submit">회원가입</button></form></section><section><h2>게스트 로그인</h2><form><input placeholder="닉네임" /><button type="submit">게스트 입장</button></form></section></main></body></html>',
    );
    return;
  }

  res.statusCode = 200;
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.end('<!doctype html><html><head><meta charset="utf-8"><title>BHC Web</title></head><body><h1>BHC Web</h1><p>Server is running.</p><a href="/login">/login</a></body></html>');
});

server.listen(webPort, () => {
  console.log(`[web] listening on http://localhost:${webPort}`);
});

function shutdown(): void {
  server.close();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
