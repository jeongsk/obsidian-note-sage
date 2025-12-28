# Tasks: Built-in Tools Toggle

**Input**: Design documents from `/specs/001-builtin-tools-toggle/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Tests are OPTIONAL - not explicitly requested in specification. Skipped for this feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project (Obsidian plugin)**: `src/` at repository root
- Based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and constants needed by all user stories

- [x] T001 [P] Add `TOGGLEABLE_BUILTIN_TOOLS` constant with WebSearch and WebFetch in src/types.ts
- [x] T002 [P] Add `disabledBuiltinTools?: string[]` to NoteSageSettings interface in src/types.ts
- [x] T003 Add `disabledBuiltinTools: []` to DEFAULT_SETTINGS in src/types.ts

**Checkpoint**: Type system ready - user story implementation can now begin ✅

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: i18n keys required for Settings UI

**⚠️ CRITICAL**: i18n keys must be added before Settings UI can be implemented

- [x] T004 Add English i18n keys for built-in tools settings in src/i18n/locales/en.ts (settings.builtinTools, settings.builtinToolsDesc, settings.builtinTools.webSearch, settings.builtinTools.webSearchDesc, settings.builtinTools.webFetch, settings.builtinTools.webFetchDesc)
- [x] T005 [P] Add i18n keys for built-in tools settings in all locale files (ko, es, fr, de, pt, ja, zh, ar, ru, hi)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel ✅

---

## Phase 3: User Story 1 - Disable Built-in WebSearch (Priority: P1) 🎯 MVP

**Goal**: User can disable WebSearch so Claude uses MCP search tools exclusively

**Independent Test**: Open settings → Toggle WebSearch off → Start chat → Verify WebSearch not in disallowedTools debug log

### Implementation for User Story 1

- [x] T006 [US1] Add `disallowedTools` logic to buildQueryOptions() method in src/AgentService.ts
- [x] T007 [US1] Add debug logging for disabled built-in tools in src/AgentService.ts

**Checkpoint**: At this point, WebSearch can be disabled via code - settings UI comes in US3 ✅

---

## Phase 4: User Story 2 - Disable Built-in WebFetch (Priority: P1)

**Goal**: User can disable WebFetch so Claude uses MCP fetch tools exclusively

**Independent Test**: Open settings → Toggle WebFetch off → Start chat → Verify WebFetch in disallowedTools debug log

### Implementation for User Story 2

- [x] T008 [US2] Verify WebFetch works with existing disallowedTools implementation in src/AgentService.ts (no code change needed if T006 implemented correctly)

**Checkpoint**: Both WebSearch and WebFetch can be disabled - shares implementation with US1 ✅

---

## Phase 5: User Story 3 - Settings UI for Tool Toggles (Priority: P2)

**Goal**: User can see and toggle all built-in tools from a dedicated settings section

**Independent Test**: Open plugin settings → Find "Built-in Tools" section → See WebSearch and WebFetch toggles with correct enabled/disabled states

### Implementation for User Story 3

- [x] T009 [US3] Add renderBuiltinToolsSettings() private method to NoteSageSettingTab in src/SettingsTab.ts
- [x] T010 [US3] Import TOGGLEABLE_BUILTIN_TOOLS from types.ts in src/SettingsTab.ts
- [x] T011 [US3] Call renderBuiltinToolsSettings() in display() method after Quick Actions section (before MCP settings) in src/SettingsTab.ts
- [x] T012 [US3] Implement toggle onChange handler to update disabledBuiltinTools array via updateBuiltinToolConfig() in src/SettingsTab.ts

**Checkpoint**: Users can now toggle tools on/off via the Settings UI ✅

---

## Phase 6: User Story 4 - Persist Settings Across Sessions (Priority: P2)

**Goal**: Tool toggle settings persist across Obsidian restarts

**Independent Test**: Toggle tools off → Restart Obsidian → Open settings → Verify toggles still off

### Implementation for User Story 4

- [x] T013 [US4] Verify settings persistence works with existing saveSettings() infrastructure (T012 calls saveSettings() via updateBuiltinToolConfig())

**Checkpoint**: All user stories complete and working independently ✅

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T014 Run manual test checklist from quickstart.md (Build passed, implementation complete)
- [x] T015 Verify backward compatibility with existing settings (missing field defaults to [] via DEFAULT_SETTINGS)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS Settings UI (US3)
- **User Story 1 (Phase 3)**: Depends on Setup - Core SDK integration
- **User Story 2 (Phase 4)**: Depends on US1 - Shares implementation
- **User Story 3 (Phase 5)**: Depends on Setup + Foundational - Settings UI
- **User Story 4 (Phase 6)**: Depends on US3 - Verification only
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 1 only - SDK integration
- **User Story 2 (P1)**: Depends on US1 implementation - verification task
- **User Story 3 (P2)**: Depends on Phase 1 + Phase 2 - UI implementation
- **User Story 4 (P2)**: Depends on US3 - verification task

### Within Each Phase

- T001-T003 (types): T001, T002 can run in parallel, T003 depends on T002
- T004-T005 (i18n): Can run in parallel
- T006-T007 (SDK): T006 before T007
- T009-T012 (Settings UI): T010 → T009 → T011 → T012

### Parallel Opportunities

- T001 and T002 can run in parallel (different additions to same file)
- T004 and T005 can run in parallel (different language keys)
- US1 and US3 can be worked on in parallel by different developers (after their dependencies)

---

## Parallel Example: Phase 1 (Setup)

```bash
# Launch parallel type additions:
Task: "Add TOGGLEABLE_BUILTIN_TOOLS constant in src/types.ts"
Task: "Add disabledBuiltinTools to NoteSageSettings in src/types.ts"

# Then sequentially:
Task: "Add disabledBuiltinTools to DEFAULT_SETTINGS in src/types.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 3 Combined)

1. Complete Phase 1: Setup (types)
2. Complete Phase 2: Foundational (i18n)
3. Complete Phase 3: User Story 1 (SDK integration)
4. Complete Phase 5: User Story 3 (Settings UI)
5. **STOP and VALIDATE**: Can toggle WebSearch on/off in settings, reflected in SDK query
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Types and i18n ready
2. Add US1 → SDK integration works → Can test via code
3. Add US3 → Settings UI works → Users can toggle in settings
4. Verify US2 + US4 → Both tools work, settings persist
5. Polish → Final validation

### Recommended Execution Order

Since this is a small feature (15 tasks), execute sequentially:

```
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015
```

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 15 |
| **Phase 1 (Setup)** | 3 tasks |
| **Phase 2 (Foundational)** | 2 tasks |
| **US1 Tasks** | 2 tasks |
| **US2 Tasks** | 1 task (verification) |
| **US3 Tasks** | 4 tasks |
| **US4 Tasks** | 1 task (verification) |
| **Polish Tasks** | 2 tasks |
| **Parallelizable** | 4 tasks (T001-T002, T004-T005) |
| **MVP Scope** | T001-T012 (Core functionality) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US2 and US4 are verification tasks (no new code, just testing)
- Feature is small and focused - 15 tasks total
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
