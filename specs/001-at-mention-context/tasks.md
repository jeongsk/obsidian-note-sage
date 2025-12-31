# Tasks: @ 멘션 컨텍스트 추가

**Input**: Design documents from `/specs/001-at-mention-context/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: 테스트는 선택사항입니다. 명시적으로 요청된 경우에만 포함됩니다.

**Organization**: 작업은 User Story별로 그룹화되어 각 스토리의 독립적인 구현 및 테스트가 가능합니다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 해당 User Story (예: US1, US2, US3, US4)
- 설명에 정확한 파일 경로 포함

## Path Conventions

- **단일 프로젝트**: `src/`, `tests/` (repository root 기준)
- 멘션 모듈: `src/mention/`
- 기존 파일 수정: `src/ChatView.ts`, `styles.css`

---

## Phase 1: Setup (프로젝트 초기화)

**Purpose**: mention 모듈 구조 생성 및 기본 설정

- [ ] T001 Create mention module directory structure at src/mention/
- [ ] T002 [P] Create type definitions in src/mention/types.ts (from data-model.md)
- [ ] T003 [P] Add mention CSS classes to styles.css (.sage-autocomplete-*, .sage-mention-chip-*)
- [ ] T004 [P] Create module index file at src/mention/index.ts

---

## Phase 2: Foundational (핵심 인프라)

**Purpose**: 모든 User Story가 의존하는 핵심 서비스 구현

**⚠️ CRITICAL**: 이 단계가 완료되어야 User Story 구현 시작 가능

- [ ] T005 Implement MentionService class skeleton in src/mention/MentionService.ts
- [ ] T006 [P] Implement file cache mechanism using Obsidian Vault API in src/mention/MentionService.ts
- [ ] T007 [P] Implement search() method with filtering logic in src/mention/MentionService.ts
- [ ] T008 Implement AutocompletePopup class in src/mention/AutocompletePopup.ts
- [ ] T009 [P] Add keyboard navigation (ArrowUp, ArrowDown, Enter, ESC) in src/mention/AutocompletePopup.ts
- [ ] T010 [P] Add mouse click selection handling in src/mention/AutocompletePopup.ts
- [ ] T011 Implement MentionInput class skeleton in src/mention/MentionInput.ts
- [ ] T012 [P] Add @ trigger detection and input state tracking in src/mention/MentionInput.ts
- [ ] T013 [P] Add IME composition event handling (한글 입력) in src/mention/MentionInput.ts

**Checkpoint**: Foundation ready - User Story 구현 시작 가능

---

## Phase 3: User Story 1 - 파일 멘션으로 컨텍스트 추가 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 @로 파일을 검색/선택하고, 해당 파일 내용이 AI 컨텍스트에 포함됨

**Independent Test**: `@README.md` 입력 후 선택 → 파일 내용이 AI 메시지에 포함되어 전송되는지 확인

### Implementation for User Story 1

- [ ] T014 [US1] Implement createMention() for file type in src/mention/MentionService.ts
- [ ] T015 [US1] Implement createContext() for FileContextAttachment in src/mention/MentionService.ts
- [ ] T016 [P] [US1] Add file icon mapping (setIcon) in src/mention/AutocompletePopup.ts
- [ ] T017 [US1] Add mention chip rendering for single file in src/mention/MentionInput.ts
- [ ] T018 [US1] Implement buildContextString() for single file mention in src/mention/MentionService.ts
- [ ] T019 [US1] Integrate MentionInput into ChatView.createInputArea() in src/ChatView.ts
- [ ] T020 [US1] Add mention chips container above input field in src/ChatView.ts
- [ ] T021 [US1] Update handleSendMessage() to include file context from mentions in src/ChatView.ts
- [ ] T022 [P] [US1] Handle binary file detection (FR-012) in src/mention/MentionService.ts
- [ ] T023 [P] [US1] Handle hidden file filtering (.으로 시작) in src/mention/MentionService.ts
- [ ] T024 [US1] Add large file warning dialog (100KB+) with user choice in src/ChatView.ts

**Checkpoint**: User Story 1 완료 - 파일 멘션 기능이 독립적으로 동작

---

## Phase 4: User Story 2 - 폴더 멘션으로 파일 리스트 추가 (Priority: P2)

**Goal**: 사용자가 @로 폴더를 선택하면 해당 폴더의 파일 목록이 컨텍스트에 포함됨

**Independent Test**: `@src/` 폴더 선택 → 폴더 내 파일 리스트가 AI 메시지에 포함되어 전송되는지 확인

### Implementation for User Story 2

- [ ] T025 [US2] Implement createMention() for folder type in src/mention/MentionService.ts
- [ ] T026 [US2] Implement createContext() for FolderContextAttachment in src/mention/MentionService.ts
- [ ] T027 [P] [US2] Add recursive folder listing (max depth 3) in src/mention/MentionService.ts
- [ ] T028 [P] [US2] Add folder icon distinction in AutocompletePopup in src/mention/AutocompletePopup.ts
- [ ] T029 [US2] Update mention chip rendering to distinguish folder type in src/mention/MentionInput.ts
- [ ] T030 [US2] Update buildContextString() to handle folder context in src/mention/MentionService.ts
- [ ] T031 [US2] Handle empty folder case in src/mention/MentionService.ts

**Checkpoint**: User Story 2 완료 - 폴더 멘션 기능이 독립적으로 동작

---

## Phase 5: User Story 3 - 다중 멘션 지원 (Priority: P3)

**Goal**: 사용자가 하나의 메시지에 여러 파일/폴더를 멘션하고 모든 컨텍스트가 전달됨

**Independent Test**: `@file1.md @file2.md @folder/` 함께 입력 → 모든 컨텍스트가 포함되어 전송되는지 확인

### Implementation for User Story 3

- [ ] T032 [US3] Enable multiple mentions array management in src/mention/MentionInput.ts
- [ ] T033 [US3] Update buildContextString() for multiple mentions (중복 제거) in src/mention/MentionService.ts
- [ ] T034 [P] [US3] Add multiple chip rendering (horizontal scroll or wrap) in src/mention/MentionInput.ts
- [ ] T035 [US3] Update ChatView to pass all mentions to buildContextString() in src/ChatView.ts
- [ ] T036 [P] [US3] Add styling for multiple chips container in styles.css

**Checkpoint**: User Story 3 완료 - 다중 멘션 기능이 독립적으로 동작

---

## Phase 6: User Story 4 - 멘션 제거 및 수정 (Priority: P4)

**Goal**: 사용자가 추가된 멘션을 삭제하거나 수정할 수 있음

**Independent Test**: 멘션 칩의 X 버튼 클릭 또는 백스페이스 → 멘션이 제거되고 컨텍스트에서 제외되는지 확인

### Implementation for User Story 4

- [ ] T037 [US4] Add remove button (X) to mention chip in src/mention/MentionInput.ts
- [ ] T038 [US4] Implement removeMention() callback in src/mention/MentionInput.ts
- [ ] T039 [P] [US4] Handle backspace key to remove last mention in src/mention/MentionInput.ts
- [ ] T040 [US4] Update mention array on removal in src/mention/MentionInput.ts
- [ ] T041 [P] [US4] Add chip removal animation/transition in styles.css

**Checkpoint**: User Story 4 완료 - 멘션 제거 기능이 독립적으로 동작

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 전체 기능 개선 및 마무리

- [ ] T042 [P] Add existence check for mentioned files/folders (FR-011) in src/mention/MentionService.ts
- [ ] T043 [P] Implement vault change event listeners (create/delete/rename) for cache refresh in src/mention/MentionService.ts
- [ ] T044 [P] Add debounce (50ms) to search input in src/mention/MentionInput.ts
- [ ] T045 Performance optimization: limit results to 50 items in src/mention/MentionService.ts
- [ ] T046 [P] Add error handling for file read failures in src/mention/MentionService.ts
- [ ] T047 [P] Add i18n translation keys for mention UI strings in src/i18n/
- [ ] T048 Code cleanup and remove debug logs
- [ ] T049 Run quickstart.md validation (manual test)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - 즉시 시작 가능
- **Foundational (Phase 2)**: Setup 완료 후 시작 - 모든 User Story를 BLOCK
- **User Stories (Phase 3-6)**: Foundational 완료 후 시작 가능
  - P1 → P2 → P3 → P4 순서 권장 (또는 병렬 진행 가능)
- **Polish (Phase 7)**: 모든 User Story 완료 후 시작

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 완료 후 시작 - 다른 스토리에 의존 없음
- **User Story 2 (P2)**: Foundational 완료 후 시작 - US1과 독립적으로 테스트 가능
- **User Story 3 (P3)**: US1, US2의 기본 구조 활용 - 독립적으로 테스트 가능
- **User Story 4 (P4)**: US1, US2, US3와 통합 - 독립적으로 테스트 가능

### Within Each User Story

- 모델/서비스 → UI 컴포넌트 → ChatView 통합 순서
- [P] 표시된 작업은 병렬 실행 가능

---

## Parallel Opportunities

### Phase 1 (Setup)
```bash
# 병렬 실행 가능:
T002: Create type definitions
T003: Add CSS classes
T004: Create index file
```

### Phase 2 (Foundational)
```bash
# 병렬 실행 가능 (T005 완료 후):
T006: File cache mechanism
T007: Search method
T009: Keyboard navigation
T010: Mouse click handling
T012: @ trigger detection
T013: IME handling
```

### User Story 1 (Phase 3)
```bash
# 병렬 실행 가능:
T016: File icon mapping
T022: Binary file detection
T023: Hidden file filtering
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup 완료
2. Phase 2: Foundational 완료 (CRITICAL)
3. Phase 3: User Story 1 완료
4. **STOP and VALIDATE**: 파일 멘션 기능 독립 테스트
5. 배포/데모 가능 (MVP!)

### Incremental Delivery

1. Setup + Foundational → 기반 준비
2. User Story 1 추가 → 파일 멘션 동작 → 배포 (MVP)
3. User Story 2 추가 → 폴더 멘션 동작 → 배포
4. User Story 3 추가 → 다중 멘션 동작 → 배포
5. User Story 4 추가 → 멘션 제거 동작 → 배포
6. Polish 단계 → 최적화 및 마무리

---

## Notes

- [P] tasks = 다른 파일, 의존성 없음
- [Story] label = 특정 User Story에 매핑 (추적성)
- 각 User Story는 독립적으로 완료 및 테스트 가능해야 함
- 각 작업 또는 논리적 그룹 완료 후 커밋
- 체크포인트에서 스토리 독립 검증 가능
- 피해야 할 것: 모호한 작업, 같은 파일 충돌, 스토리 간 의존성으로 인한 독립성 파괴
