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

  res.statusCode = 200;
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.end(
    '<!doctype html><html><head><meta charset="utf-8"><title>BHC Web</title></head><body><h1>BHC Web</h1><p>Server is running.</p></body></html>',
  );
});

server.listen(webPort, () => {
  console.log(`[web] listening on http://localhost:${webPort}`);
});

function shutdown(): void {
  server.close();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
