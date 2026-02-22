import { appendFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { createTurnState, handleTurnTimeout } from '../../apps/game-server/src/game/turn-policy.ts';
import { createScoreBoard, increaseScoreAndCheckGameEnd } from '../../apps/game-server/src/game/score-policy.ts';

type ErrorLog = {
  ts: string;
  step: string;
  message: string;
};

const durationMs = Number(process.env.QA_DURATION_MS ?? '600000');
const tickMs = Number(process.env.QA_TICK_MS ?? '1000');
const logDir = resolve(process.cwd(), 'tmp');
const logPath = resolve(logDir, 'qa-play-errors.log');

function writeLog(entry: ErrorLog): void {
  appendFileSync(logPath, `${JSON.stringify(entry)}\n`, 'utf8');
}

async function run(): Promise<void> {
  mkdirSync(logDir, { recursive: true });
  appendFileSync(logPath, `# run started at ${new Date().toISOString()}\n`, 'utf8');

  const startedAt = Date.now();
  let loopCount = 0;
  let errorCount = 0;

  while (Date.now() - startedAt < durationMs) {
    loopCount += 1;

    try {
      const turnState = createTurnState(['p1', 'p2']);
      handleTurnTimeout(turnState);

      const scoreBoard = createScoreBoard(['p1', 'p2']);
      increaseScoreAndCheckGameEnd(scoreBoard, 'p1');
    } catch (error) {
      errorCount += 1;
      writeLog({
        ts: new Date().toISOString(),
        step: `loop-${loopCount}`,
        message: error instanceof Error ? error.message : String(error),
      });
    }

    await new Promise((resolveWait) => setTimeout(resolveWait, tickMs));
  }

  console.log(
    JSON.stringify(
      {
        durationMs,
        tickMs,
        loopCount,
        errorCount,
        logPath,
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  writeLog({
    ts: new Date().toISOString(),
    step: 'fatal',
    message: error instanceof Error ? error.stack ?? error.message : String(error),
  });
  process.exit(1);
});
