# Implementation Plan: Extended Thinking Toggle

**Branch**: `009-extended-thinking-toggle` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-extended-thinking-toggle/spec.md`

## Summary

Chat View 헤더에 Extended Thinking on/off 토글을 추가하여 사용자가 Settings 탭에 들어가지 않고도 채팅 중에 바로 Extended Thinking 기능을 제어할 수 있도록 한다. 기존 `sage-toggle-sm` 토글 패턴과 `enableExtendedThinking` 설정을 재사용하여 구현한다.

## Technical Context

**Language/Version**: TypeScript 5.9+
**Primary Dependencies**: Obsidian API, @anthropic-ai/claude-agent-sdk ^0.1.76, TailwindCSS 3.4.19 (`tw-` prefix)
**Storage**: Obsidian Plugin Data (NoteSageSettings.enableExtendedThinking)
**Testing**: Vitest
**Target Platform**: Obsidian Desktop (Node.js, isDesktopOnly: true)
**Project Type**: Obsidian Plugin
**Performance Goals**: 즉각적 UI 응답 (토글 클릭 시 지연 없음)
**Constraints**: Obsidian API 호환성, TailwindCSS `tw-` prefix 필수, Obsidian 테마 색상(`obs-*`) 사용
**Scale/Scope**: 단일 토글 UI 추가 (ChatView.ts 수정, main.css 스타일 추가)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| 기존 패턴 재사용 | ✅ Pass | `sage-toggle-sm` 토글 패턴, 기존 설정 시스템 재사용 |
| 새로운 의존성 없음 | ✅ Pass | 추가 라이브러리 불필요 |
| 단순성 원칙 | ✅ Pass | 최소한의 코드 변경으로 기능 구현 |
| i18n 지원 | ✅ Pass | 기존 `extendedThinking` 번역 키 사용 |

## Project Structure

### Documentation (this feature)

```text
specs/009-extended-thinking-toggle/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── ChatView.ts          # 토글 UI 추가 (createExtendedThinkingToggle 메서드)
├── types.ts             # enableExtendedThinking 설정 (기존)
├── AgentService.ts      # Extended Thinking 적용 로직 (기존)
├── i18n/
│   └── locales/*.ts     # extendedThinking 번역 키 (기존)
└── styles/
    └── main.css         # 토글 스타일 추가

tests/
└── (기존 테스트 구조 유지)
```

**Structure Decision**: 기존 Obsidian 플러그인 구조 유지. ChatView.ts에 토글 메서드 추가, main.css에 스타일 추가.

## Implementation Design

### 1. UI 위치 및 레이아웃

토글 위치: MCP 상태 아이콘과 버튼 그룹(Examples, Settings, New Chat) 사이

```text
[앱 타이틀] [모델 선택기] [MCP 아이콘] [Extended Thinking 토글] [버튼 그룹]
```

### 2. 토글 UI 구조

기존 `sage-toggle-sm` 패턴 재사용:

```html
<div class="sage-extended-thinking-toggle">
  <span class="sage-toggle-label">[아이콘] ET</span>
  <label class="sage-toggle-sm">
    <input type="checkbox" class="sage-toggle-sm-checkbox" />
    <span class="sage-toggle-sm-slider"></span>
  </label>
</div>
```

### 3. 아이콘 선택

`brain` 아이콘 사용 (ChatRenderer의 Extended Thinking 블록과 일관성 유지)

### 4. 설정 동기화 흐름

```text
토글 클릭 → settings.enableExtendedThinking 변경 → plugin.saveSettings()
         → updateViews() → Settings 탭 동기화
```

### 5. 주요 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/ChatView.ts` | `createExtendedThinkingToggle()` 메서드 추가, `createHeader()`에서 호출 |
| `src/styles/main.css` | `.sage-extended-thinking-toggle` 스타일 추가 |

### 6. 수정 불필요 파일

| 파일 | 이유 |
|------|------|
| `src/types.ts` | `enableExtendedThinking` 설정 이미 존재 |
| `src/AgentService.ts` | Extended Thinking 적용 로직 이미 구현됨 |
| `src/i18n/locales/*.ts` | `extendedThinking` 번역 키 이미 존재 |

## Complexity Tracking

> 위반 사항 없음 - 기존 패턴과 설정 재사용으로 최소한의 변경

## Next Steps

1. `/speckit.tasks` 실행하여 구현 태스크 생성
2. ChatView.ts 수정
3. main.css 스타일 추가
4. 테스트 및 검증
