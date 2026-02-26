# Service Ports

## Port Range Policy
- Allowed runtime port range: `9311` ~ `9320`
- Out-of-range values cause startup failure.

## Default Allocation
- `@bhc/game-server` auth API: `9311` (`AUTH_PORT`)
- `@bhc/game-server` lobby API: `9312` (`LOBBY_PORT`)
- `@bhc/web`: `9313` (`WEB_PORT`)

## Run Commands
- game server:
  - `pnpm --filter @bhc/game-server run dev`
- web:
  - `pnpm --filter @bhc/web run dev`

## Override Examples
- `AUTH_PORT=9315 LOBBY_PORT=9316 pnpm --filter @bhc/game-server run dev`
- `WEB_PORT=9317 pnpm --filter @bhc/web run dev`
