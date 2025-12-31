# Tasks: Quick Action Buttons Customization

**Input**: Design documents from `/specs/001-quick-action-buttons/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md

**Tests**: Manual testing only (Obsidian plugin - no automated test framework)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- All TypeScript files in `src/` directory

---

## Phase 1: Setup (Foundation Types)

**Purpose**: Add type definitions and constants needed by all user stories

- [x] T001 [P] Add QuickActionConfig interface in src/types.ts
- [x] T002 [P] Add QuickActionDefinition interface in src/types.ts
- [x] T003 Add QUICK_ACTION_DEFINITIONS constant array in src/types.ts
- [x] T004 Add quickActions field to NoteSageSettings interface in src/types.ts
- [x] T005 Add default quickActions to DEFAULT_SETTINGS in src/types.ts
- [x] T006 [P] Add settings.quickActions translation key in src/i18n/locales/en.ts
- [x] T007 [P] Add settings.quickActions translation key in src/i18n/locales/ko.ts

**Checkpoint**: Type system ready - all user stories can now use QuickActionConfig

---

## Phase 2: User Story 1 - Enable/Disable Quick Action Buttons (Priority: P1)

**Goal**: 사용자가 각 빠른 액션 버튼을 개별적으로 활성화/비활성화할 수 있음

**Independent Test**: 설정에서 버튼을 비활성화하면 채팅 뷰에서 해당 버튼이 사라지는지 확인

### Implementation for User Story 1

- [x] T008 [US1] Refactor createQuickActions() to use QUICK_ACTION_DEFINITIONS in src/ChatView.ts
- [x] T009 [US1] Add filtering logic to show only enabled buttons in createQuickActions() in src/ChatView.ts
- [x] T010 [US1] Hide quick actions container when all buttons disabled in src/ChatView.ts
- [x] T011 [US1] Add Quick Actions settings section header in src/SettingsTab.ts
- [x] T012 [US1] Add toggle switch for each quick action button in src/SettingsTab.ts
- [x] T013 [US1] Implement toggle onChange handler to update quickActions in settings in src/SettingsTab.ts
- [x] T014 [US1] Ensure ChatView re-renders when settings change via updateSettings() in src/ChatView.ts

**Checkpoint**: User Story 1 complete - buttons can be toggled on/off and changes reflect immediately

---

## Phase 3: User Story 2 - Customize Quick Action Prompts (Priority: P2)

**Goal**: 사용자가 각 버튼의 프롬프트를 커스터마이즈할 수 있음

**Independent Test**: 설정에서 프롬프트를 수정한 후 버튼 클릭 시 수정된 프롬프트가 전송되는지 확인

### Implementation for User Story 2

- [x] T015 [US2] Modify button click handler to use customPrompt if set in src/ChatView.ts
- [x] T016 [US2] Add textarea for custom prompt editing in settings in src/SettingsTab.ts
- [x] T017 [US2] Set placeholder to default prompt (from i18n) in textarea in src/SettingsTab.ts
- [x] T018 [US2] Implement textarea onChange handler to update customPrompt in settings in src/SettingsTab.ts
- [x] T019 [P] [US2] Add settings.customPromptPlaceholder translation key in src/i18n/locales/en.ts
- [x] T020 [P] [US2] Add settings.customPromptPlaceholder translation key in src/i18n/locales/ko.ts

**Checkpoint**: User Story 2 complete - custom prompts work and persist across sessions

---

## Phase 4: User Story 3 - Reset Prompt to Default (Priority: P3)

**Goal**: 사용자가 수정한 프롬프트를 기본값으로 리셋할 수 있음

**Independent Test**: 리셋 버튼 클릭 시 customPrompt가 지워지고 기본 프롬프트가 적용되는지 확인

### Implementation for User Story 3

- [x] T021 [US3] Add reset button (extra button with reset icon) for each quick action in src/SettingsTab.ts
- [x] T022 [US3] Implement reset onClick handler to clear customPrompt in src/SettingsTab.ts
- [x] T023 [US3] Refresh textarea value after reset in src/SettingsTab.ts
- [x] T024 [P] [US3] Add settings.resetToDefault translation key in src/i18n/locales/en.ts
- [x] T025 [P] [US3] Add settings.resetToDefault translation key in src/i18n/locales/ko.ts

**Checkpoint**: User Story 3 complete - reset functionality works correctly

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases and final validation

- [x] T026 Handle migration for existing users without quickActions in settings in src/main.ts
- [x] T027 Verify all buttons enabled by default for new users
- [x] T028 Test edge case: all buttons disabled hides container
- [x] T029 Test edge case: special characters and emoji in custom prompts
- [x] T030 Run quickstart.md manual testing checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion
- **User Story 2 (Phase 3)**: Depends on Setup completion (can run parallel with US1)
- **User Story 3 (Phase 4)**: Depends on Setup completion (can run parallel with US1, US2)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - enable/disable toggle functionality
- **User Story 2 (P2)**: Independent - custom prompt editing
- **User Story 3 (P3)**: Independent - reset to default functionality

All user stories share the same files but modify different sections:
- Types: Shared foundation (Phase 1)
- ChatView: US1 for filtering, US2 for prompt selection
- SettingsTab: US1 for toggle, US2 for textarea, US3 for reset button

### Within Each User Story

- Models/Types before UI components
- Settings UI before ChatView updates
- Core implementation before edge cases

### Parallel Opportunities

- **Phase 1**: T001, T002 can run in parallel; T006, T007 can run in parallel
- **Phase 2-4**: User stories can be implemented in parallel after Phase 1 completes
- **Within US2**: T019, T020 can run in parallel
- **Within US3**: T024, T025 can run in parallel

---

## Parallel Example: Phase 1 Setup

```bash
# Launch parallel type definitions:
Task: "Add QuickActionConfig interface in src/types.ts"
Task: "Add QuickActionDefinition interface in src/types.ts"

# Launch parallel i18n updates:
Task: "Add settings.quickActions translation key in src/i18n/locales/en.ts"
Task: "Add settings.quickActions translation key in src/i18n/locales/ko.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: User Story 1 (T008-T014)
3. **STOP and VALIDATE**: Test button enable/disable independently
4. Deploy if ready - users can already hide unwanted buttons

### Incremental Delivery

1. Setup complete → Types ready
2. Add User Story 1 → Test toggle functionality → Deploy (MVP!)
3. Add User Story 2 → Test custom prompts → Deploy
4. Add User Story 3 → Test reset functionality → Deploy
5. Polish phase → Final testing → Release

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Setup | 7 | Type definitions and i18n keys |
| US1 (P1) | 7 | Enable/Disable buttons |
| US2 (P2) | 6 | Custom prompts |
| US3 (P3) | 5 | Reset to default |
| Polish | 5 | Edge cases and validation |
| **Total** | **30** | |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Manual testing in Obsidian development environment
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
