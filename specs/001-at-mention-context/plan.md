# Implementation Plan: @ 멘션 컨텍스트 추가

**Branch**: `001-at-mention-context` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-at-mention-context/spec.md`

## Summary

채팅 입력창에서 `@` 기호를 입력하면 Obsidian vault 내의 파일/폴더를 자동완성으로 검색하고 선택하여 AI 컨텍스트로 추가하는 기능을 구현합니다. 파일은 내용을, 폴더는 파일 목록을 컨텍스트에 포함합니다. Obsidian API의 `vault.getFiles()`, `vault.read()` 등을 활용하여 파일 시스템에 접근합니다.

## Technical Context

**Language/Version**: TypeScript 5.9+
**Primary Dependencies**: @anthropic-ai/claude-agent-sdk ^0.1.76, obsidian API (latest)
**Storage**: N/A (Obsidian vault 파일 시스템 직접 접근)
**Testing**: Vitest 2.1.9
**Target Platform**: Obsidian Desktop (Electron-based)
**Project Type**: Obsidian Plugin (single project structure)
**Performance Goals**: 자동완성 드롭다운 표시 300ms 이내, 필터링 100ms 이내
**Constraints**: 파일 크기 100KB 이상 시 경고, 자동완성 최대 50개 항목
**Scale/Scope**: 1000+ 파일 vault에서 원활한 동작

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Template-based (constitution 미설정) | ✅ Pass | Constitution이 템플릿 상태이므로 기본 가이드라인 적용 |

## Project Structure

### Documentation (this feature)

```text
specs/001-at-mention-context/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── mention/                    # @ 멘션 기능 모듈
│   ├── MentionService.ts       # 멘션 처리 서비스 (파일/폴더 컨텍스트 생성)
│   ├── AutocompletePopup.ts    # 자동완성 드롭다운 UI 컴포넌트
│   ├── MentionInput.ts         # 입력창 멘션 감지 및 렌더링
│   └── types.ts                # 멘션 관련 타입 정의
├── ChatView.ts                 # 기존 파일 - 멘션 통합
├── types.ts                    # 기존 파일 - 타입 확장
└── ...

tests/
├── unit/
│   └── mention/
│       ├── MentionService.test.ts
│       └── AutocompletePopup.test.ts
└── ...
```

**Structure Decision**: 기존 단일 프로젝트 구조를 유지하면서 `src/mention/` 디렉토리에 멘션 관련 코드를 모듈화합니다. 이는 기존 코드와의 결합도를 낮추고 테스트 용이성을 높입니다.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - 모든 가이드라인 준수
