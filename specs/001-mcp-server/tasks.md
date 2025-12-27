# Tasks: MCP Server Integration

**Input**: Design documents from `/specs/001-mcp-server/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: 수동 테스트 (Obsidian 플러그인 환경)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 타입 정의 및 국제화 기초 작업

- [x] T001 [P] Add McpServerConfigEntry interface to src/types.ts
- [x] T002 [P] Add McpServerStatus interface to src/types.ts
- [x] T003 [P] Update NoteSageSettings interface with mcpServers field in src/types.ts
- [x] T004 [P] Update DEFAULT_SETTINGS with mcpServers default value in src/types.ts
- [x] T005 [P] Add MCP-related translation keys (ko) to src/i18n/locales/ko.ts
- [x] T006 [P] Add MCP-related translation keys (en) to src/i18n/locales/en.ts
- [ ] T007 [P] Add MCP-related translation keys (ja) to src/i18n/index.ts (SKIPPED - ja not implemented)
- [x] T008 Create src/mcp/ directory for MCP modules

**Checkpoint**: 타입 정의 및 국제화 준비 완료

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: MCP 서버 관리의 핵심 인프라

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create McpServerManager class skeleton in src/mcp/McpServerManager.ts
- [x] T010 Implement toSdkConfig() utility function in src/mcp/McpServerManager.ts
- [x] T011 Implement toSdkMcpServers() utility function in src/mcp/McpServerManager.ts
- [x] T012 Implement status caching with Map in src/mcp/McpServerManager.ts
- [x] T013 Implement onStatusChange listener pattern in src/mcp/McpServerManager.ts
- [x] T014 Implement refreshFromSdk() method in src/mcp/McpServerManager.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - MCP 서버 설정 관리 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 Obsidian 설정 화면에서 MCP 서버를 추가, 편집, 삭제할 수 있음

**Independent Test**: 설정 화면에서 MCP 서버를 추가하고, 저장 후 다시 열었을 때 설정이 유지되는지 확인

### Implementation for User Story 1

- [x] T015 [P] [US1] Create McpSettingsUI class skeleton in src/mcp/McpSettingsUI.ts
- [x] T016 [US1] Implement renderServerList() method to display registered servers in src/mcp/McpSettingsUI.ts
- [x] T017 [US1] Implement server type dropdown (stdio/sse/http) in src/mcp/McpSettingsUI.ts
- [x] T018 [US1] Implement dynamic form fields based on server type in src/mcp/McpSettingsUI.ts
- [x] T019 [US1] Implement stdio type form (name, command, args, env) in src/mcp/McpSettingsUI.ts
- [x] T020 [US1] Implement sse/http type form (name, url, headers) in src/mcp/McpSettingsUI.ts
- [x] T021 [US1] Implement duplicate name validation with warning message in src/mcp/McpSettingsUI.ts
- [x] T022 [US1] Implement server add functionality in src/mcp/McpSettingsUI.ts
- [x] T023 [US1] Implement server edit functionality in src/mcp/McpSettingsUI.ts
- [x] T024 [US1] Implement server delete functionality with confirmation in src/mcp/McpSettingsUI.ts
- [x] T025 [US1] Implement server enable/disable toggle in src/mcp/McpSettingsUI.ts
- [x] T026 [US1] Add MCP 서버 설정 section to SettingsTab.display() in src/SettingsTab.ts
- [x] T027 [US1] Integrate McpSettingsUI with SettingsTab in src/SettingsTab.ts
- [x] T028 [P] [US1] Add MCP server list styles in styles.css
- [x] T029 [P] [US1] Add MCP server form styles in styles.css

**Checkpoint**: User Story 1 완료 - MCP 서버 추가/편집/삭제 기능 동작, 설정 영구 저장

---

## Phase 4: User Story 2 - MCP 서버 연결 상태 확인 (Priority: P2)

**Goal**: 사용자가 등록된 MCP 서버의 연결 상태를 실시간으로 확인

**Independent Test**: 유효한 MCP 서버와 유효하지 않은 MCP 서버를 각각 등록하고 상태 표시가 올바른지 확인

### Implementation for User Story 2

- [x] T030 [US2] Add status icon display in server list in src/mcp/McpSettingsUI.ts
- [x] T031 [US2] Add error message tooltip for failed servers in src/mcp/McpSettingsUI.ts
- [x] T032 [US2] Add MCP status icon container to chat header in src/ChatView.ts
- [x] T033 [US2] Implement renderMcpStatusIcon() method in src/ChatView.ts
- [x] T034 [US2] Add status tooltip with server details in src/ChatView.ts
- [x] T035 [US2] Subscribe to McpServerManager status changes in src/ChatView.ts
- [ ] T036 [US2] Call refreshStatus() on session start in src/ChatView.ts (deferred to Phase 5)
- [x] T037 [P] [US2] Add MCP status icon styles (connected/pending/failed) in styles.css

**Checkpoint**: User Story 2 완료 - 설정 화면과 채팅 뷰에서 연결 상태 확인 가능

---

## Phase 5: User Story 3 - MCP 도구 사용 (Priority: P3)

**Goal**: Claude Agent가 등록된 MCP 서버의 도구를 자동으로 인식하고 사용

**Independent Test**: 간단한 도구를 제공하는 MCP 서버를 등록하고, 해당 도구를 요청하는 프롬프트를 전송하여 도구가 호출되는지 확인

### Implementation for User Story 3

- [x] T038 [US3] Load mcpServers from settings on plugin load in src/main.ts
- [x] T039 [US3] Initialize McpServerManager on plugin load in src/main.ts
- [x] T040 [US3] Update AgentService mcpServers when settings change in src/ChatView.ts (via updateSettings)
- [x] T041 [US3] Modify buildQueryOptions() to include mcpServers from settings in src/AgentService.ts (already supported)
- [ ] T042 [US3] Call mcpServerStatus() after query creation in src/AgentService.ts (deferred - SDK dependent)
- [ ] T043 [US3] Forward status updates to McpServerManager in src/AgentService.ts (deferred - SDK dependent)

**Checkpoint**: User Story 3 완료 - MCP 서버가 채팅 세션에 연결되고 도구 사용 가능

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 전체 기능의 완성도 향상

- [ ] T044 [P] Add 30-second timeout handling for MCP connections in src/mcp/McpServerManager.ts (deferred - SDK handles timeout)
- [ ] T045 [P] Add error handling for invalid command paths in src/mcp/McpSettingsUI.ts (deferred - SDK validates)
- [ ] T046 [P] Add network error handling for SSE/HTTP servers in src/mcp/McpServerManager.ts (deferred - SDK handles)
- [x] T047 Update quickstart.md with final implementation notes in specs/001-mcp-server/quickstart.md
- [ ] T048 Run full manual test following quickstart.md scenarios (user testing required)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (needs server list to show status)
- **User Story 3 (P3)**: Depends on User Story 1 (needs server config to pass to SDK)

### Within Each User Story

- UI skeleton before feature implementation
- Validation before save/update logic
- Settings integration before ChatView integration

### Parallel Opportunities

**Phase 1 (all parallel)**:
```bash
# All type definitions and i18n can run in parallel:
T001, T002, T003, T004, T005, T006, T007, T008
```

**Phase 3 User Story 1**:
```bash
# UI skeleton and styles can run in parallel:
T015, T028, T029
```

**Phase 4 User Story 2**:
```bash
# Styles can run parallel with other tasks:
T037
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T014)
3. Complete Phase 3: User Story 1 (T015-T029)
4. **STOP and VALIDATE**: MCP 서버 추가/편집/삭제 테스트
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP 완료!**
3. Add User Story 2 → 상태 표시 기능 추가
4. Add User Story 3 → SDK 연동 완료
5. Polish → 에러 처리 및 안정화

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- 수동 테스트: Obsidian Developer Console (Cmd+Opt+I / Ctrl+Shift+I)
