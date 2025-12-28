# Implementation Plan: Agent Options

**Branch**: `001-agent-options` | **Date**: 2025-12-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-agent-options/spec.md`

## Summary

Claude Agent SDK의 고급 옵션들(maxTurns, maxBudgetUsd, Extended Thinking, permissionMode)을 사용자가 설정 UI를 통해 제어할 수 있도록 구현합니다. 비용 관련 기능은 API 키가 설정된 사용자에게만 표시됩니다.

## Technical Context

**Language/Version**: TypeScript 5.9+
**Primary Dependencies**: @anthropic-ai/claude-agent-sdk ^0.1.76, Obsidian API
**Storage**: Obsidian plugin data.json (via `this.plugin.saveSettings()`)
**Testing**: Vitest
**Target Platform**: Obsidian Desktop (Node.js 22+, Electron)
**Project Type**: Single project (Obsidian plugin)
**Performance Goals**: 설정 UI 렌더링 100ms 이내, 설정 저장 즉시 반영
**Constraints**: Obsidian API 규약 준수, 기존 설정 UI 패턴과 일관성 유지
**Scale/Scope**: 4개의 새 설정 옵션, 11개 기능 요구사항

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution 파일이 템플릿 상태이므로 특별한 gate 위반 없음. 기존 프로젝트 패턴을 따름:
- [x] 기존 SettingsTab.ts 패턴 활용
- [x] types.ts에 타입 정의 추가
- [x] AgentService.ts에 옵션 전달 로직 추가
- [x] i18n 다국어 지원 유지

## Project Structure

### Documentation (this feature)

```text
specs/001-agent-options/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no external API)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── types.ts             # NoteSageSettings 인터페이스 확장
├── SettingsTab.ts       # 새 설정 UI 컴포넌트 추가
├── AgentService.ts      # buildQueryOptions에 새 옵션 전달
├── ChatView.ts          # 비용/턴 표시 UI 추가
├── i18n/
│   ├── en.ts            # 영어 번역 추가
│   └── ko.ts            # 한국어 번역 추가
└── constants.ts         # 기본값 상수 정의
```

**Structure Decision**: 기존 Obsidian 플러그인 구조 유지. 새 파일 생성 없이 기존 파일들을 확장하여 구현.

## Complexity Tracking

> 복잡도 추적 불필요 - 기존 패턴을 따르는 단순 확장 기능

## Phase 0 Artifacts

- [research.md](./research.md) - SDK 옵션 조사 결과

## Phase 1 Artifacts

- [data-model.md](./data-model.md) - 설정 데이터 모델
- [quickstart.md](./quickstart.md) - 빠른 시작 가이드
- contracts/ - N/A (외부 API 없음, 내부 설정만 사용)
