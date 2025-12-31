# Tasks: Agent Options

**Input**: Design documents from `/specs/001-agent-options/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: 테스트 요구사항이 명시되지 않았으므로 테스트 태스크는 생략합니다.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Obsidian plugin structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 타입 정의 및 상수 추가, i18n 번역 추가

- [x] T001 [P] Add PermissionMode type and AGENT_OPTIONS_DEFAULTS/LIMITS constants in `src/types.ts`
- [x] T002 [P] Add Agent Options default values to DEFAULT_SETTINGS in `src/types.ts`
- [x] T003 [P] Add English translations for Agent Options settings in `src/i18n/locales/en.ts`
- [x] T004 [P] Add Korean translations for Agent Options settings in `src/i18n/locales/ko.ts`
- [x] T004.1 [P] Add translations for all other languages (ar, de, es, fr, hi, ja, pt, ru, zh)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: AgentService에 옵션 전달 로직 추가 - 모든 User Story가 의존함

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Extend buildQueryOptions to read permissionMode from settings in `src/AgentService.ts`
- [x] T006 Add maxTurns option support in buildQueryOptions in `src/AgentService.ts`
- [x] T007 Add maxBudgetUsd option support (only when apiKey is set) in buildQueryOptions in `src/AgentService.ts`
- [x] T008 Add maxThinkingTokens option support (when enableExtendedThinking is true) in buildQueryOptions in `src/AgentService.ts`

**Checkpoint**: ✅ AgentService가 모든 Agent Options를 SDK에 전달할 수 있음

---

## Phase 3: User Story 1 - 비용 관리 설정 (Priority: P1) 🎯 MVP

**Goal**: API 키 사용자가 세션당 최대 비용 한도를 설정하고, 비용을 모니터링할 수 있음

**Independent Test**: API 키가 설정된 상태에서 비용 한도를 $1.00로 설정한 후 대화를 진행하여 한도 도달 시 세션이 올바르게 종료되고 알림이 표시되는지 확인

### Implementation for User Story 1

- [x] T009 [US1] Add maxBudgetUsd setting UI (conditional: only when apiKey is set) in `src/SettingsTab.ts`
- [x] T010 [US1] Implement API key detection helper function for conditional UI rendering in `src/SettingsTab.ts`
- [x] T011 [US1] Add session cost display in result message rendering in `src/ChatRenderer.ts`
- [x] T012 [US1] Add cost limit reached notification handler in `src/ChatView.ts`

**Checkpoint**: ✅ API 키 사용자가 비용 한도를 설정하고 비용을 모니터링할 수 있음

---

## Phase 4: User Story 2 - 대화 턴 수 제한 (Priority: P2)

**Goal**: 사용자가 최대 대화 턴 수를 설정하여 무한 루프를 방지할 수 있음

**Independent Test**: 최대 턴 수를 5로 설정한 후 대화를 진행하여 5턴 후 세션이 종료되는지 확인

### Implementation for User Story 2

- [x] T013 [US2] Add maxTurns setting UI with number input field in `src/SettingsTab.ts`
- [x] T014 [US2] Add input validation for maxTurns (range: 0-100) in `src/SettingsTab.ts`
- [x] T015 [US2] Add turn limit reached notification handler in `src/ChatView.ts`

**Checkpoint**: ✅ 사용자가 턴 수 제한을 설정하고 한도 도달 시 알림을 받을 수 있음

---

## Phase 5: User Story 3 - Extended Thinking 모드 활성화 (Priority: P3)

**Goal**: 사용자가 Extended Thinking 모드를 활성화하여 Claude의 깊은 분석을 사용할 수 있음

**Independent Test**: Extended Thinking을 활성화한 후 복잡한 질문을 하여 Claude의 응답에 사고 과정이 포함되는지 확인

### Implementation for User Story 3

- [x] T016 [US3] Add enableExtendedThinking toggle setting UI in `src/SettingsTab.ts`
- [x] T017 [US3] Add maxThinkingTokens slider/input (conditional: only when toggle is ON) in `src/SettingsTab.ts`
- [x] T018 [US3] Add thinking block rendering support in `src/ChatRenderer.ts` and `src/types.ts`

**Checkpoint**: ✅ 사용자가 Extended Thinking을 설정하고 사고 과정 블록을 볼 수 있음

---

## Phase 6: User Story 4 - 권한 모드 선택 (Priority: P4)

**Goal**: 사용자가 Claude의 파일/시스템 접근 권한 수준을 선택할 수 있음

**Independent Test**: 권한 모드를 'acceptEdits'로 변경한 후 파일 편집 요청 시 자동 승인되는지 확인

### Implementation for User Story 4

- [x] T019 [US4] Add permissionMode dropdown setting UI in `src/SettingsTab.ts`
- [x] T020 [US4] Add permission mode descriptions for each option in dropdown in `src/SettingsTab.ts`

**Checkpoint**: ✅ 사용자가 권한 모드를 선택할 수 있음

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 전체 기능 통합 및 정리

- [x] T021 [P] Add "Agent Options" section header in settings tab in `src/SettingsTab.ts`
- [x] T022 [P] Ensure settings UI visual consistency with existing design in `src/SettingsTab.ts`
- [x] T023 Validate all settings persist correctly after plugin reload
- [x] T024 Run quickstart.md validation - test all 4 user stories

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent of other stories

### Within Each User Story

- Settings UI before ChatView changes (where applicable)
- Core implementation before validation/notification handlers

### Parallel Opportunities

- All Setup tasks (T001-T004) can run in parallel
- After Setup, all Foundational tasks should be sequential (same file: AgentService.ts)
- User Stories can proceed in parallel after Foundational phase
- Polish tasks (T021-T022) can run in parallel

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all Setup tasks together:
Task: "Add PermissionMode type and constants in src/types.ts"
Task: "Add Agent Options default values in src/types.ts"
Task: "Add English translations in src/i18n/en.ts"
Task: "Add Korean translations in src/i18n/ko.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (비용 관리)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (비용 관리) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (턴 수 제한) → Test independently → Deploy/Demo
4. Add User Story 3 (Extended Thinking) → Test independently → Deploy/Demo
5. Add User Story 4 (권한 모드) → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Suggested MVP Scope

**MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1: 비용 관리)**

이유:
- 비용 관리는 사용자의 재정적 손실을 직접 방지하는 핵심 기능
- API 키 사용자에게 가장 중요한 기능
- 독립적으로 테스트 및 배포 가능

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- 비용 관련 UI는 API 키가 설정된 경우에만 표시
- Extended Thinking 토큰 슬라이더는 토글이 ON일 때만 표시
