# Implementation Plan: Custom Quick Actions

**Branch**: `010-custom-quick-actions` | **Date**: 2025-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-custom-quick-actions/spec.md`

## Summary

사용자가 설정에서 커스텀 빠른 액션을 생성, 수정, 삭제, 순서 변경할 수 있는 기능을 구현합니다. 기존 4개의 기본 빠른 액션(요약, 개선, 분석, 번역) 시스템을 확장하여 사용자 정의 액션을 지원합니다.

## Technical Context

**Language/Version**: TypeScript 5.9+  
**Primary Dependencies**: Obsidian API, @anthropic-ai/claude-agent-sdk ^0.1.76, TailwindCSS 3.4.19 (`tw-` prefix)  
**Storage**: Obsidian Plugin Data (`NoteSageSettings.customQuickActions`)  
**Testing**: Vitest  
**Target Platform**: Obsidian Desktop (Electron, Node.js >=22.0.0)  
**Project Type**: Single project (Obsidian plugin)  
**Performance Goals**: UI 응답 <100ms, 설정 저장 즉시 반영  
**Constraints**: Obsidian 플러그인 패턴 준수, TailwindCSS `tw-` prefix, Obsidian CSS 변수 사용  
**Scale/Scope**: 단일 사용자, 무제한 커스텀 액션 (실용적 범위)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

프로젝트 Constitution이 템플릿 상태이므로 특정 제약 없음. 기존 코드베이스 패턴을 따름:
- ✅ 기존 Quick Actions 패턴 확장
- ✅ TypeScript 타입 안전성 유지
- ✅ i18n 지원 (UI 텍스트)
- ✅ Obsidian CSS 변수 사용

## Project Structure

### Documentation (this feature)

```text
specs/010-custom-quick-actions/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── types.ts                    # CustomQuickAction 인터페이스 추가
├── SettingsTab.ts              # 커스텀 빠른 액션 설정 UI
├── ChatView.ts                 # 커스텀 빠른 액션 버튼 렌더링
└── i18n/
    └── locales/*.ts            # 새 번역 키 추가

tests/
└── CustomQuickActions.test.ts  # 유닛 테스트 (선택)
```

**Structure Decision**: 기존 Obsidian 플러그인 구조 유지. 새 파일 생성 없이 기존 파일 확장.

## Key Implementation Points

### 1. 타입 확장 (src/types.ts)

```typescript
// 새 인터페이스
interface CustomQuickAction {
  id: string;           // UUID
  name: string;         // 사용자 정의 라벨
  prompt: string;       // 프롬프트 텍스트
  enabled: boolean;     // 활성화 상태
  order: number;        // 표시 순서
}

// NoteSageSettings 확장
customQuickActions?: CustomQuickAction[];
```

### 2. 설정 UI 확장 (src/SettingsTab.ts)

- "커스텀 빠른 액션 추가" 버튼
- 각 커스텀 액션: 이름 입력, 프롬프트 텍스트 영역, 토글, 순서 변경 버튼, 삭제 버튼
- 삭제 확인 모달

### 3. ChatView 렌더링 확장 (src/ChatView.ts)

- `renderQuickActions()` 수정: 기본 액션 후 커스텀 액션 렌더링
- 기본 아이콘 사용 (`zap` 또는 `command`)

### 4. i18n 키 추가

- `settings.customQuickActions.add`
- `settings.customQuickActions.name`
- `settings.customQuickActions.prompt`
- `settings.customQuickActions.delete`
- `settings.customQuickActions.deleteConfirm`
- `settings.customQuickActions.moveUp`
- `settings.customQuickActions.moveDown`

## Complexity Tracking

> No constitution violations. Feature extends existing patterns.

| Aspect | Complexity | Justification |
|--------|------------|---------------|
| Data Model | Low | 단순 CRUD, 기존 패턴 확장 |
| UI | Medium | 순서 변경 UI 필요 |
| Integration | Low | 기존 Quick Actions와 동일한 흐름 |
