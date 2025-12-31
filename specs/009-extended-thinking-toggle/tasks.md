# Tasks: Extended Thinking Toggle

**Input**: Design documents from `/specs/009-extended-thinking-toggle/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project Type**: Obsidian Plugin
- **Source**: `src/` at repository root
- **Styles**: `src/styles/main.css`

---

## Phase 1: User Story 1 - Extended Thinking 토글 활성화 (Priority: P1) 🎯 MVP

**Goal**: Chat View 헤더에 Extended Thinking on/off 토글을 추가하여 사용자가 즉시 기능을 제어할 수 있도록 한다.

**Independent Test**: Chat View를 열고 헤더의 Extended Thinking 토글을 클릭하여 on/off 상태가 변경되고, 해당 상태가 다음 메시지 전송에 반영되는지 확인.

### Implementation for User Story 1

- [x] T001 [P] [US1] Add `.sage-extended-thinking-toggle` styles in `src/styles/main.css`
- [x] T002 [US1] Add `extendedThinkingToggleEl` property to ChatView class in `src/ChatView.ts`
- [x] T003 [US1] Implement `createExtendedThinkingToggle()` method in `src/ChatView.ts`
- [x] T004 [US1] Call `createExtendedThinkingToggle()` in `createHeader()` method (after MCP icon, before button group) in `src/ChatView.ts`
- [x] T005 [US1] Implement toggle change event handler to update `settings.enableExtendedThinking` and call `saveSettings()` in `src/ChatView.ts`

**Checkpoint**: Extended Thinking 토글이 헤더에 표시되고, 클릭 시 설정이 변경되어야 함.

---

## Phase 2: User Story 2 - 토글 상태 동기화 (Priority: P2)

**Goal**: Chat View의 Extended Thinking 토글 상태가 Settings 탭의 설정과 동기화된다.

**Independent Test**: Chat View에서 토글을 변경한 후 Settings 탭을 열어 동일한 설정값이 반영되어 있는지 확인.

### Implementation for User Story 2

- [x] T006 [US2] Update toggle checkbox state in `updateSettings()` method when settings change externally in `src/ChatView.ts`

**Checkpoint**: Settings 탭에서 변경한 설정이 Chat View 토글에 반영되어야 함.

---

## Phase 3: User Story 3 - 상태 지속성 (Priority: P3)

**Goal**: Extended Thinking 토글 상태가 Obsidian을 재시작해도 유지된다.

**Independent Test**: 토글 상태를 변경한 후 Obsidian을 재시작하여 이전 상태가 유지되는지 확인.

### Implementation for User Story 3

> **NOTE**: 이 스토리는 US1에서 `saveSettings()` 호출로 자동 구현됨. 초기 상태 로드만 확인 필요.

- [x] T007 [US3] Verify toggle initializes with saved `settings.enableExtendedThinking` value in `createExtendedThinkingToggle()` in `src/ChatView.ts`

**Checkpoint**: Obsidian 재시작 후에도 토글 상태가 유지되어야 함.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: 검증 및 마무리

- [x] T008 Build and verify no TypeScript errors (`npm run build`)
- [ ] T009 Test toggle functionality in Obsidian (on/off, visual feedback)
- [ ] T010 Test settings synchronization (ChatView ↔ Settings tab)
- [ ] T011 Test persistence (restart Obsidian, verify state)
- [ ] T012 Test RTL language display (if applicable)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1)**: Can start immediately - core toggle implementation
- **Phase 2 (US2)**: Depends on US1 completion - adds sync capability
- **Phase 3 (US3)**: Depends on US1 completion - verifies persistence (mostly automatic)
- **Phase 4 (Polish)**: Depends on all user stories being complete

### Within Each User Story

- T001 (styles) can run in parallel with T002-T005 (different files)
- T002 → T003 → T004 → T005 must be sequential (same file, dependencies)
- T006 depends on T002-T005 completion
- T007 depends on T003 completion

### Parallel Opportunities

```bash
# Can run in parallel (different files):
T001: styles in main.css
T002-T005: implementation in ChatView.ts

# Sequential within ChatView.ts:
T002 (property) → T003 (method) → T004 (call) → T005 (handler) → T006 (sync) → T007 (verify)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001-T005 (Phase 1)
2. **STOP and VALIDATE**: Test toggle on/off, visual feedback
3. If working, proceed to Phase 2-4

### Recommended Approach

이 기능은 단순하므로 모든 태스크를 순차적으로 완료하는 것이 효율적:

1. T001: 스타일 추가 (main.css)
2. T002-T005: ChatView.ts 수정
3. T006: 동기화 로직 추가
4. T007: 초기화 검증
5. T008-T012: 빌드 및 테스트

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 12 |
| US1 Tasks | 5 |
| US2 Tasks | 1 |
| US3 Tasks | 1 |
| Polish Tasks | 5 |
| Files Modified | 2 (ChatView.ts, main.css) |
| Parallel Opportunities | T001 ∥ (T002-T005) |

---

## Notes

- 기존 `sage-toggle-sm` 패턴 재사용으로 스타일 작업 최소화
- 기존 `enableExtendedThinking` 설정 재사용으로 types.ts 수정 불필요
- 기존 `extendedThinking` i18n 키 사용으로 번역 작업 불필요
- `saveSettings()` 호출로 US3 (지속성) 자동 구현
- `updateSettings()` 메서드에서 토글 상태 갱신으로 US2 (동기화) 구현
