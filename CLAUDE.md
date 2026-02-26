# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

실시간 멀티플레이어 3쿠션 당구 웹 게임. pnpm workspace + Turborepo 모노레포 구조.

## Commands

```bash
# 전체 워크스페이스
pnpm dev          # 모든 앱 개발 서버 병렬 실행
pnpm build        # 모든 패키지/앱 빌드
pnpm test         # 전체 테스트
pnpm lint         # 전체 린트

# 특정 워크스페이스
pnpm --filter @bhc/game-server test
pnpm --filter @bhc/physics-core test

# 단일 테스트 파일 실행 (Node.js 내장 테스트러너)
node --experimental-strip-types --test <file.test.ts>
# 예시:
node --experimental-strip-types --test packages/physics-core/src/three-cushion-model.test.ts
node --experimental-strip-types --test apps/game-server/src/game/turn-policy.test.ts

# DB 마이그레이션
pnpm -C apps/game-server migrate:up
pnpm -C apps/game-server migrate:down

# Spec 동기화 검증 (스펙 변경 후 필수)
python3 scripts/ci/spec_guard.py <변경된_파일들...>

# QA 스크립트
pnpm qa:table-boundary
pnpm qa:cushion-contact-time
```

## Architecture

```
bhc-c (monorepo)
├── apps/
│   ├── web/              # 프론트엔드 (PixiJS 2D 렌더링)
│   └── game-server/      # 실시간 게임 서버
│       ├── src/auth/     # 인증 (Argon2id + JWT) → port 9211
│       ├── src/lobby/    # 로비/방 목록 → port 9212
│       ├── src/room/     # 방 상태 및 정책
│       ├── src/game/     # 게임 로직 (턴, 점수, 규칙)
│       ├── src/chat/     # 인게임 채팅 (레이트 리밋)
│       ├── src/input/    # 샷 입력 검증 및 매핑
│       └── migrations/   # PostgreSQL 마이그레이션
├── packages/
│   ├── physics-core/     # 3쿠션 물리 엔진 및 득점 판정
│   └── shared-types/     # 공통 DTO, 이벤트, 상수
├── schemas/
│   └── shot-input-v1.json  # 샷 입력 JSON Schema (v1.0.0)
├── docs/                 # GDD, Physics-Spec, Input-Schema 등 스펙 문서
├── scripts/
│   ├── ci/spec_guard.py  # CI 스펙 동기화 검증
│   └── qa/               # E2E, 동시성, 렌더링 QA 스크립트
└── docker/               # Dockerfile + docker-compose.yml
```

**의존 관계:**
- `web` → `shared-types`
- `game-server` → `shared-types`, `physics-core`
- `physics-core` / `shared-types` → 외부 의존 없음

**주요 포트:** 9311 (auth), 9312 (lobby), 9313 (web)

**런타임:** Node.js 22.x LTS, TypeScript 5.x, ES modules (번들러 없음, `--experimental-strip-types` 직접 실행)

**DB:** PostgreSQL 16+ (node-pg-migrate)

## Spec Sync Rules (AGENTS.md — 필수)

스펙 문서 변경 시 관련 문서를 **같은 작업에서** 모두 업데이트해야 함.

| 변경 파일 | 함께 업데이트해야 할 파일 |
|-----------|--------------------------|
| `docs/GDD.md` 또는 `GDD_kr.md` | Physics-Spec, Input-Schema, shot-input-v1.json 검토 |
| `schemas/shot-input-v1.json` | `docs/Input-Schema.md` + `docs/Input-Schema_kr.md` |
| 영문 스펙 문서 | 대응하는 한국어 문서 (항상 쌍으로) |

- `schemaVersion`은 `schemas/shot-input-v1.json`과 Input-Schema 문서가 일치해야 함.
- 스펙 변경 후 반드시 실행: `python3 scripts/ci/spec_guard.py <변경_파일...>`

## Task Workflow (필수)

개발은 아래 5단계를 순서대로 따른다.

### 1단계: 요구사항 확인 및 분석
- 사용자의 요구사항을 확인하고 코드베이스를 분석하여 영향 범위를 파악한다.
- 불명확한 부분은 반드시 사용자에게 질문하여 해소한다.

### 2단계: 세부 일감 작성
- 분석 결과를 바탕으로 세부 일감을 작성한다.
- `docs/Execution-Backlog.md`에 Task ID와 함께 일감을 추가한다.
- `docs/Execution-Status.md`에 각 일감의 상태를 `pending`으로 등록한다.
- 사용자에게 일감 목록을 공유하고 확인받은 후 개발을 시작한다.

### 3단계: 일감 별 개발 및 커밋
- `docs/Execution-Status.md`에서 현재 일감을 `in_progress`로 변경한다.
- 일감 단위로 개발하고, 완료 시 일감 별로 커밋한다.
- 커밋 후 `docs/Execution-Status.md`를 `done`으로 업데이트한다.
- **푸시는 하지 않는다** — 모든 커밋은 로컬에 쌓아둔다.

### 4단계: 사용자 기능 확인
- 모든 일감 개발 완료 후, 사용자에게 기능 확인을 요청한다.
- 사용자가 수정을 요청하면 추가 커밋으로 반영한다.

### 5단계: 푸시 (사용자 허가 필수)
- **사용자가 명시적으로 허가한 경우에만** 푸시한다.
- 허가 없이 절대 푸시하지 않는다.

**커밋 메시지 형식:**
```
[TASK-ID] <작업 요약 (한국어)>

왜 변경했는지
무엇을 변경했는지 (파일/핵심 로직)

Validation:
- <실행 명령> (pass/fail)

Next Task: <다음 Task ID>
```

- 설명 텍스트는 **한국어**, Task ID/파일 경로/명령어는 **영문** 유지
- 브랜치명: `task/<TASK-ID>-<short-slug>`
- 작업 완료 후 `docs/Execution-Status.md` 업데이트 필수 (Status, Validation, Next Task, Updated At)

## Docker Build

Docker 이미지 빌드 시 반드시 **멀티 아키텍처(linux/amd64, linux/arm64)** 로 빌드해야 한다.

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t <image>:<tag> --push .
```

단일 아키텍처 빌드(`docker build`)는 금지한다.

## Key Docs

| 파일 | 내용 |
|------|------|
| `docs/GDD.md` | 게임 디자인 문서 (MVP 범위, 규칙) |
| `docs/Physics-Spec.md` | 물리 공식 및 상수 |
| `docs/Input-Schema.md` | 샷 입력 포맷 명세 |
| `docs/Error-Codes.md` | 표준 에러 코드 |
| `docs/Ports.md` | 네트워크 포트 할당 |
| `docs/Execution-Status.md` | 태스크 진행 상태 추적 |
