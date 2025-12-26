# Implementation Plan: Quick Action Buttons Customization

**Branch**: `001-quick-action-buttons` | **Date**: 2025-12-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-quick-action-buttons/spec.md`

## Summary

채팅 입력창 위의 4개 빠른 액션 버튼(요약, 개선, 분석, 번역)에 대해 개별 활성화/비활성화, 프롬프트 커스터마이징, 기본값 리셋 기능을 추가합니다. 기존 설정 탭에 "Quick Actions" 섹션을 추가하여 각 버튼별 토글 스위치와 프롬프트 편집 필드를 제공합니다.

## Technical Context

**Language/Version**: TypeScript 5.7+
**Primary Dependencies**: Obsidian API, @anthropic-ai/claude-agent-sdk
**Storage**: Obsidian Plugin Settings (JSON file in `.obsidian/plugins/` folder)
**Testing**: Manual testing in Obsidian development environment
**Target Platform**: Desktop (Obsidian desktop app - Electron-based)
**Project Type**: Single project (Obsidian plugin)
**Performance Goals**: Instant UI response (<100ms for toggle/edit actions)
**Constraints**: Must follow Obsidian plugin API patterns, support i18n (en/ko)
**Scale/Scope**: 4 quick action buttons, ~200 lines of new code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution 파일이 템플릿 상태이므로 프로젝트별 제약사항이 정의되어 있지 않습니다.
기존 코드베이스 패턴을 따라 구현합니다:
- ✅ TypeScript strict mode 사용
- ✅ Obsidian API 패턴 준수 (Setting, PluginSettingTab)
- ✅ i18n 지원 (en/ko)
- ✅ 기존 설정 구조와 일관성 유지

## Project Structure

### Documentation (this feature)

```text
specs/001-quick-action-buttons/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── types.ts             # QuickActionConfig 인터페이스 추가
├── ChatView.ts          # createQuickActions() 수정 - 설정 기반 렌더링
├── SettingsTab.ts       # Quick Actions 설정 섹션 추가
├── i18n/
│   ├── index.ts         # 타입 export
│   └── locales/
│       ├── en.ts        # 영어 번역 추가
│       └── ko.ts        # 한국어 번역 추가
```

**Structure Decision**: 기존 단일 프로젝트 구조를 유지하며, 새 파일 생성 없이 기존 파일들을 확장합니다.

## Complexity Tracking

> No violations - implementation follows existing patterns.

| Aspect | Approach | Rationale |
|--------|----------|-----------|
| Data Storage | Obsidian Plugin Settings | 기존 패턴 유지, 별도 저장소 불필요 |
| UI Components | Obsidian Setting API | 기존 SettingsTab 확장 |
| State Management | Settings object propagation | 기존 updateSettings() 패턴 활용 |
