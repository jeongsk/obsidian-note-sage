# Tasks: MCP Tools Panel

**Input**: Design documents from `/specs/002-mcp-tools-panel/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Manual testing only (Obsidian 플러그인 환경)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, repository root
- Paths assume Obsidian plugin structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 프로젝트 기반 준비 및 타입 정의

- [x] T001 [P] Add McpTool interface to src/types.ts (name, description fields)
- [x] T002 [P] Add panel-related i18n keys to src/i18n/locales/ko.ts
- [x] T003 [P] Add panel-related i18n keys to src/i18n/locales/en.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: McpToolsPanel 클래스 기본 구조 생성 - 모든 User Story에 필요

**⚠️ CRITICAL**: 이 단계 완료 전까지 User Story 작업 불가

- [x] T004 Create McpToolsPanel class skeleton in src/mcp/McpToolsPanel.ts with constructor (containerEl, plugin, mcpServerManager)
- [x] T005 Implement open(), close(), toggle(), destroy() methods in src/mcp/McpToolsPanel.ts
- [x] T006 Add click outside detection logic (document.addEventListener pattern) in src/mcp/McpToolsPanel.ts
- [x] T007 Add ESC key handler to close panel in src/mcp/McpToolsPanel.ts
- [x] T008 [P] Add base panel CSS styles (.sage-mcp-panel, .sage-mcp-panel-header, .sage-mcp-panel-list) in styles.css

**Checkpoint**: Foundation ready - McpToolsPanel 기본 구조 완료

---

## Phase 3: User Story 1 - View MCP Server Status Panel (Priority: P1) 🎯 MVP

**Goal**: 헤더의 MCP 아이콘 클릭 시 서버 목록 패널 표시

**Independent Test**: 아이콘 클릭 → 패널 열림 → 서버 목록 표시 → 외부 클릭/재클릭 시 닫힘

### Implementation for User Story 1

- [x] T009 [US1] Modify createMcpStatusIcon() in src/ChatView.ts to make icon clickable (add click handler, stopPropagation)
- [x] T010 [US1] Instantiate McpToolsPanel in src/ChatView.ts and connect to icon click
- [x] T011 [US1] Implement renderServerList() in src/mcp/McpToolsPanel.ts to display all servers from settings.mcpServers
- [x] T012 [US1] Implement renderServerItem() in src/mcp/McpToolsPanel.ts showing server name, type (stdio/sse/http), status icon
- [x] T013 [US1] Subscribe to McpServerManager.onStatusChange() for real-time status updates in src/mcp/McpToolsPanel.ts
- [x] T014 [US1] Implement renderEmptyState() in src/mcp/McpToolsPanel.ts showing "등록된 서버가 없습니다" message
- [x] T015 [P] [US1] Add server item CSS styles (.sage-mcp-panel-item, status icons, type badges) in styles.css

**Checkpoint**: User Story 1 완료 - 패널 열기/닫기 및 서버 목록 표시 동작

---

## Phase 4: User Story 2 - Toggle MCP Server Activation (Priority: P2)

**Goal**: 패널에서 개별 서버 활성화/비활성화 토글

**Independent Test**: 토글 클릭 → 상태 변경 → 설정 저장 → 에러 시 롤백 + 알림

### Implementation for User Story 2

- [x] T016 [US2] Add toggle switch to renderServerItem() in src/mcp/McpToolsPanel.ts
- [x] T017 [US2] Implement handleToggle() in src/mcp/McpToolsPanel.ts with plugin.saveSettings() call
- [x] T018 [US2] Implement error handling with rollback and Notice toast in handleToggle()
- [x] T019 [US2] Add updateMcpServers() call after toggle to refresh AgentService in src/mcp/McpToolsPanel.ts
- [x] T020 [P] [US2] Add toggle switch CSS styles (.sage-mcp-toggle) in styles.css

**Checkpoint**: User Story 2 완료 - 토글로 서버 활성/비활성 제어 가능

---

## Phase 5: User Story 3 - View Available Tools per Server (Priority: P3)

**Goal**: 서버 확장 시 해당 서버의 도구 목록 표시

**Independent Test**: 연결된 서버 클릭 → 확장 → 도구 목록 표시 / 미연결 서버 → 메시지 표시

### Implementation for User Story 3

- [x] T021 [US3] Add expandedServers state (Set<string>) to McpToolsPanel class in src/mcp/McpToolsPanel.ts
- [x] T022 [US3] Implement toggleExpand() method in src/mcp/McpToolsPanel.ts
- [x] T023 [US3] Add click handler to server item (excluding toggle area) to trigger toggleExpand() in src/mcp/McpToolsPanel.ts
- [x] T024 [US3] Implement renderToolsList() in src/mcp/McpToolsPanel.ts showing tool name and description
- [x] T025 [US3] Add tools data retrieval from McpServerManager or SDK metadata in src/mcp/McpToolsPanel.ts
- [x] T026 [US3] Show "연결 후 도구 목록을 확인할 수 있습니다" for disconnected servers in src/mcp/McpToolsPanel.ts
- [x] T027 [P] [US3] Add expansion CSS styles (.sage-mcp-panel-item--expanded, .sage-mcp-panel-tools, max-height transition) in styles.css

**Checkpoint**: User Story 3 완료 - 서버별 도구 목록 확인 가능

---

## Phase 6: User Story 4 - Quick Access to Settings (Priority: P4)

**Goal**: 패널에서 설정 페이지로 빠르게 이동

**Independent Test**: 설정 버튼 클릭 → 플러그인 설정 페이지 열림 (MCP 섹션)

### Implementation for User Story 4

- [x] T028 [US4] Add settings shortcut button/icon to panel header in src/mcp/McpToolsPanel.ts
- [x] T029 [US4] Implement openSettings() using (this.app as any).setting.open() and openTabById() in src/mcp/McpToolsPanel.ts
- [x] T030 [P] [US4] Add settings button CSS styles (.sage-mcp-panel-settings) in styles.css

**Checkpoint**: User Story 4 완료 - 설정 페이지 바로가기 동작

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 마무리 및 품질 개선

- [ ] T031 [P] Add keyboard accessibility (focus management, tab navigation) in src/mcp/McpToolsPanel.ts
- [ ] T032 [P] Add panel positioning logic (below icon, viewport bounds check) in src/mcp/McpToolsPanel.ts
- [x] T033 [P] Add panel max-height and internal scroll for long server lists in styles.css
- [x] T034 Verify all i18n keys are used correctly across panel components
- [x] T035 Clean up McpToolsPanel.destroy() for proper resource cleanup (event listeners, subscriptions)
- [ ] T036 Run quickstart.md testing checklist validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001 (types) - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Base MVP, no story dependencies
  - US2 (P2): Depends on US1 (toggle in server item)
  - US3 (P3): Depends on US1 (expansion in server item)
  - US4 (P4): Depends on US1 (panel header exists)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 (server item rendering exists)
- **User Story 3 (P3)**: Depends on US1 (server item rendering exists)
- **User Story 4 (P4)**: Depends on US1 (panel header exists)

### Within Each User Story

- Core UI rendering first
- Event handlers next
- Error handling and edge cases last
- CSS can be parallel with implementation

### Parallel Opportunities

- T001, T002, T003 in Setup phase (different files)
- T008 CSS parallel with T004-T007 implementation
- T015, T020, T027, T030 CSS tasks parallel with their story implementations
- T031, T032, T033 in Polish phase (different concerns)

---

## Parallel Example: Setup Phase

```bash
# Launch all Setup tasks together:
Task: "Add McpTool interface to src/types.ts"
Task: "Add panel-related i18n keys to src/i18n/locales/ko.ts"
Task: "Add panel-related i18n keys to src/i18n/locales/en.ts"
```

## Parallel Example: User Story 1

```bash
# Launch implementation and CSS together:
Task: "Implement renderServerList() in src/mcp/McpToolsPanel.ts"
Task: "Add server item CSS styles in styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T008)
3. Complete Phase 3: User Story 1 (T009-T015)
4. **STOP and VALIDATE**: Test US1 independently
   - 아이콘 클릭 → 패널 열림
   - 서버 목록 표시
   - 외부 클릭 / 아이콘 재클릭 → 패널 닫힘
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo (MVP!)
3. Add User Story 2 → Test toggle functionality → Demo
4. Add User Story 3 → Test expansion/tools → Demo
5. Add User Story 4 → Test settings shortcut → Demo
6. Polish phase → Final refinements

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- CSS styles use `sage-mcp-panel-*` prefix per project conventions
