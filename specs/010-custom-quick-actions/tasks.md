# Tasks: Custom Quick Actions

**Input**: Design documents from `/specs/010-custom-quick-actions/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification. Implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (Obsidian plugin)

---

## Phase 1: Setup

**Purpose**: No additional setup required - extending existing Obsidian plugin structure

- [X] T001 Verify existing Quick Actions implementation in `src/types.ts` and `src/SettingsTab.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and i18n keys that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Add `CustomQuickAction` interface to `src/types.ts` (id, name, prompt, enabled, order fields)
- [X] T003 [P] Add `customQuickActions?: CustomQuickAction[]` to `NoteSageSettings` interface in `src/types.ts`
- [X] T004 Add `customQuickActions: []` to `DEFAULT_SETTINGS` in `src/types.ts`
- [X] T005 [P] Add i18n keys for custom quick actions in `src/i18n/locales/en.ts` (add, name, namePlaceholder, prompt, promptPlaceholder, delete, deleteConfirm, moveUp, moveDown)
- [X] T006 [P] Add i18n keys for custom quick actions in `src/i18n/locales/ko.ts`
- [X] T007 [P] Add i18n keys for custom quick actions in `src/i18n/locales/ja.ts`
- [X] T008 [P] Add i18n keys for custom quick actions in `src/i18n/locales/zh.ts`
- [X] T009 [P] Add i18n keys for custom quick actions in `src/i18n/locales/de.ts`
- [X] T010 [P] Add i18n keys for custom quick actions in `src/i18n/locales/fr.ts`
- [X] T011 [P] Add i18n keys for custom quick actions in `src/i18n/locales/es.ts`
- [X] T012 [P] Add i18n keys for custom quick actions in `src/i18n/locales/pt.ts`
- [X] T013 [P] Add i18n keys for custom quick actions in `src/i18n/locales/ru.ts`
- [X] T014 [P] Add i18n keys for custom quick actions in `src/i18n/locales/hi.ts`
- [X] T015 [P] Add i18n keys for custom quick actions in `src/i18n/locales/ar.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create Custom Quick Action (Priority: P1) 🎯 MVP

**Goal**: 사용자가 설정에서 새로운 커스텀 빠른 액션을 추가하여 채팅 뷰에 버튼으로 표시

**Independent Test**: 설정에서 "커스텀 빠른 액션 추가" 버튼 클릭 → 이름/프롬프트 입력 → 저장 → 채팅 뷰에 버튼 표시 확인

### Implementation for User Story 1

- [X] T016 [US1] Add `renderCustomQuickActionsSettings()` method in `src/SettingsTab.ts` with "커스텀 빠른 액션" 섹션 헤더
- [X] T017 [US1] Add "커스텀 빠른 액션 추가" button in `src/SettingsTab.ts` using `t('settings.customQuickActions.add')`
- [X] T018 [US1] Implement `addCustomQuickAction()` method in `src/SettingsTab.ts` to create new action with `crypto.randomUUID()`, empty name/prompt, enabled=true, order=length
- [X] T019 [US1] Implement `renderCustomQuickActionItem()` method in `src/SettingsTab.ts` to render single custom action with name input and prompt textarea
- [X] T020 [US1] Call `renderCustomQuickActionsSettings()` from `display()` in `src/SettingsTab.ts`
- [X] T021 [US1] Extend `renderQuickActions()` in `src/ChatView.ts` to render enabled custom actions after default actions
- [X] T022 [US1] Add click handler for custom action buttons in `src/ChatView.ts` to call `sendMessage(action.prompt)`
- [X] T023 [US1] Use `zap` icon for custom action buttons in `src/ChatView.ts` via `setIcon(iconEl, 'zap')`

**Checkpoint**: User Story 1 complete - users can create custom quick actions and see them in chat view

---

## Phase 4: User Story 2 - Edit Custom Quick Action (Priority: P2)

**Goal**: 사용자가 기존 커스텀 빠른 액션의 이름과 프롬프트를 수정

**Independent Test**: 설정에서 커스텀 액션 이름/프롬프트 변경 → 채팅 뷰에서 변경 반영 확인

### Implementation for User Story 2

- [X] T024 [US2] Add name input field with `onChange` handler in `renderCustomQuickActionItem()` in `src/SettingsTab.ts`
- [X] T025 [US2] Add prompt textarea with `onChange` handler in `renderCustomQuickActionItem()` in `src/SettingsTab.ts`
- [X] T026 [US2] Implement `updateCustomQuickAction(id, updates)` method in `src/SettingsTab.ts` to update and save settings
- [X] T027 [US2] Call `this.updateViews()` after saving to refresh ChatView immediately in `src/SettingsTab.ts`

**Checkpoint**: User Story 2 complete - users can edit custom quick actions

---

## Phase 5: User Story 3 - Delete Custom Quick Action (Priority: P2)

**Goal**: 사용자가 더 이상 필요없는 커스텀 빠른 액션을 삭제

**Independent Test**: 설정에서 삭제 버튼 클릭 → 확인 모달 → 확인 → 액션 제거 확인

### Implementation for User Story 3

- [X] T028 [US3] Add delete button with trash icon in `renderCustomQuickActionItem()` in `src/SettingsTab.ts`
- [X] T029 [US3] Create `CustomQuickActionDeleteModal` class in `src/SettingsTab.ts` following `SkillDeleteModal` pattern
- [X] T030 [US3] Implement `deleteCustomQuickAction(id)` method in `src/SettingsTab.ts` to remove action and recalculate order
- [X] T031 [US3] Open delete confirmation modal on delete button click in `src/SettingsTab.ts`
- [X] T032 [US3] Call `this.updateViews()` after deletion to refresh ChatView in `src/SettingsTab.ts`

**Checkpoint**: User Story 3 complete - users can delete custom quick actions with confirmation

---

## Phase 6: User Story 4 - Enable/Disable Custom Quick Action (Priority: P3)

**Goal**: 사용자가 커스텀 빠른 액션을 삭제하지 않고 일시적으로 비활성화

**Independent Test**: 설정에서 토글 OFF → 채팅 뷰에서 버튼 숨김 → 토글 ON → 버튼 표시

### Implementation for User Story 4

- [X] T033 [US4] Add toggle switch in `renderCustomQuickActionItem()` in `src/SettingsTab.ts` for enabled state
- [X] T034 [US4] Update `enabled` field via `updateCustomQuickAction()` when toggle changes in `src/SettingsTab.ts`
- [X] T035 [US4] Filter custom actions by `enabled === true` in `renderQuickActions()` in `src/ChatView.ts`

**Checkpoint**: User Story 4 complete - users can toggle custom quick actions visibility

---

## Phase 7: User Story 5 - Reorder Quick Actions (Priority: P3)

**Goal**: 사용자가 커스텀 빠른 액션의 표시 순서를 변경

**Independent Test**: 설정에서 순서 변경 → 채팅 뷰에서 버튼 순서 변경 확인

### Implementation for User Story 5

- [X] T036 [US5] Add move up button (chevron-up icon) in `renderCustomQuickActionItem()` in `src/SettingsTab.ts`
- [X] T037 [US5] Add move down button (chevron-down icon) in `renderCustomQuickActionItem()` in `src/SettingsTab.ts`
- [X] T038 [US5] Implement `moveCustomQuickActionUp(id)` method in `src/SettingsTab.ts` to swap with previous item
- [X] T039 [US5] Implement `moveCustomQuickActionDown(id)` method in `src/SettingsTab.ts` to swap with next item
- [X] T040 [US5] Sort custom actions by `order` field in `renderQuickActions()` in `src/ChatView.ts`
- [X] T041 [US5] Disable move up button for first item and move down button for last item in `src/SettingsTab.ts`

**Checkpoint**: User Story 5 complete - users can reorder custom quick actions

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validation, edge cases, and UI improvements

- [X] T042 Add validation to disable save when name is empty in `renderCustomQuickActionItem()` in `src/SettingsTab.ts`
- [X] T043 Add validation to disable save when prompt is empty in `renderCustomQuickActionItem()` in `src/SettingsTab.ts`
- [X] T044 Add visual distinction between default and custom quick actions in settings UI in `src/SettingsTab.ts`
- [X] T045 Handle empty customQuickActions gracefully (no error when undefined) in `src/ChatView.ts`
- [X] T046 Add CSS styling for custom quick action settings items in `src/styles/main.css`
- [X] T047 Ensure customQuickActions initialized as empty array in `loadSettings()` in `src/main.ts`
- [ ] T048 Manual test: Create, edit, delete, toggle, reorder custom quick actions
- [ ] T049 Manual test: Verify persistence after Obsidian restart

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verification only
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - MVP delivery
- **User Story 2 (Phase 4)**: Depends on Foundational - Independent of US1
- **User Story 3 (Phase 5)**: Depends on Foundational - Independent of US1/US2
- **User Story 4 (Phase 6)**: Depends on Foundational - Independent of others
- **User Story 5 (Phase 7)**: Depends on Foundational - Independent of others
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (Create) | Foundational | Phase 2 complete |
| US2 (Edit) | Foundational | Phase 2 complete |
| US3 (Delete) | Foundational | Phase 2 complete |
| US4 (Toggle) | Foundational | Phase 2 complete |
| US5 (Reorder) | Foundational | Phase 2 complete |

**Note**: All user stories are independent after Foundational phase, but recommended execution order is P1 → P2 → P3 for incremental delivery.

### Parallel Opportunities

**Phase 2 (Foundational)**:
```bash
# All i18n tasks can run in parallel:
T005, T006, T007, T008, T009, T010, T011, T012, T013, T014, T015

# Type definitions can run in parallel:
T002, T003
```

**After Foundational**:
```bash
# All user stories can start in parallel (if multiple developers):
Phase 3 (US1), Phase 4 (US2), Phase 5 (US3), Phase 6 (US4), Phase 7 (US5)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verification)
2. Complete Phase 2: Foundational (types, i18n)
3. Complete Phase 3: User Story 1 (Create)
4. **STOP and VALIDATE**: Test creating custom quick actions
5. Deploy if ready - users can now add custom quick actions!

### Incremental Delivery

| Milestone | Stories Included | User Value |
|-----------|-----------------|------------|
| MVP | US1 | Create custom quick actions |
| v1.1 | US1 + US2 + US3 | Full CRUD |
| v1.2 | All stories | Complete feature with reorder/toggle |

### Recommended Sequence (Single Developer)

1. T001 → T002-T015 (Setup + Foundational)
2. T016-T023 (US1 - MVP)
3. T024-T027 (US2 - Edit)
4. T028-T032 (US3 - Delete)
5. T033-T035 (US4 - Toggle)
6. T036-T041 (US5 - Reorder)
7. T042-T049 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable after Foundational phase
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Uses existing `SkillDeleteModal` pattern for delete confirmation
- Uses existing `t()` function for i18n
- Uses existing `updateViews()` pattern for immediate UI refresh
