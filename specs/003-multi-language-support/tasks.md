# Tasks: Multi-Language Support

**Input**: Design documents from `/specs/003-multi-language-support/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested - implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (i18n Infrastructure)

**Purpose**: Update core i18n types and configuration to support 11 languages

- [x] T001 Update `SupportedLanguage` type to include all 11 languages in src/i18n/index.ts
- [x] T002 Update `AVAILABLE_LANGUAGES` array with native names and direction in src/i18n/index.ts
- [x] T003 Add `getTextDirection()` and `isRtlLanguage()` helper functions in src/i18n/index.ts

---

## Phase 2: Foundational (Locale Files)

**Purpose**: Create all 9 new locale files with complete translations - MUST complete before user stories can be verified

**⚠️ CRITICAL**: These locale files are required for all user story testing

- [x] T004 [P] Create Spanish translations in src/i18n/locales/es.ts
- [x] T005 [P] Create French translations in src/i18n/locales/fr.ts
- [x] T006 [P] Create German translations in src/i18n/locales/de.ts
- [x] T007 [P] Create Portuguese translations in src/i18n/locales/pt.ts
- [x] T008 [P] Create Japanese translations in src/i18n/locales/ja.ts
- [x] T009 [P] Create Chinese (Simplified) translations in src/i18n/locales/zh.ts
- [x] T010 [P] Create Arabic translations in src/i18n/locales/ar.ts
- [x] T011 [P] Create Russian translations in src/i18n/locales/ru.ts
- [x] T012 [P] Create Hindi translations in src/i18n/locales/hi.ts
- [x] T013 Register all new locale imports in src/i18n/index.ts translations object

**Checkpoint**: All 11 locales created - user story implementation can now begin

---

## Phase 3: User Story 1 - Language Selection (Priority: P1) 🎯 MVP

**Goal**: Users can select their preferred language from settings and see all 11 languages with native names

**Independent Test**: Open Note Sage settings, click language dropdown, verify all 11 languages listed with native names, select one, confirm UI updates immediately

### Implementation for User Story 1

- [x] T014 [US1] Verify language selector dropdown displays all 11 languages in src/SettingsTab.ts
- [x] T015 [US1] Ensure language preference persists across Obsidian restarts via settings in src/main.ts
- [x] T016 [US1] Verify immediate UI update when language changes (no restart required) in src/ChatView.ts

**Checkpoint**: User Story 1 complete - language selection works with all 11 languages

---

## Phase 4: User Story 2 - Localized Chat Interface (Priority: P2)

**Goal**: All chat interface text (buttons, labels, placeholders, tooltips) appears in the selected language

**Independent Test**: Select each supported language, verify chat UI elements (send button, input placeholder, error messages) display correctly in that language

### Implementation for User Story 2

- [x] T017 [US2] Verify chat input placeholder uses t() translation in src/ChatView.ts
- [x] T018 [US2] Verify quick action buttons use t() translations in src/ChatView.ts
- [x] T019 [US2] Add RTL support to chat container with dir attribute in src/ChatView.ts
- [x] T020 [US2] Add RTL CSS overrides for Arabic layout in styles.css

**Checkpoint**: User Story 2 complete - chat interface fully localized with RTL support

---

## Phase 5: User Story 3 - Localized Settings Panel (Priority: P3)

**Goal**: Settings panel labels, descriptions, and option texts appear in the selected language

**Independent Test**: Select each supported language, navigate to Note Sage settings, verify all labels and descriptions display in that language

### Implementation for User Story 3

- [x] T021 [US3] Verify all settings labels use t() translations in src/SettingsTab.ts
- [x] T022 [US3] Verify all settings descriptions use t() translations in src/SettingsTab.ts
- [x] T023 [US3] Verify MCP server settings use t() translations in src/mcp/McpSettingsUI.ts

**Checkpoint**: User Story 3 complete - settings panel fully localized

---

## Phase 6: User Story 4 - System Message Localization (Priority: P4)

**Goal**: System-generated messages (loading states, session notifications) appear in the selected language

**Independent Test**: Trigger loading states and system notifications, verify messages display in the selected language

### Implementation for User Story 4

- [x] T024 [US4] Verify loading/processing messages use t() translations in src/ChatView.ts
- [x] T025 [US4] Verify error messages use t() translations in src/ChatView.ts
- [x] T026 [US4] Verify todo card labels use t() translations in src/ChatRenderer.ts

**Checkpoint**: User Story 4 complete - all system messages localized

---

## Phase 7: Polish & Verification

**Purpose**: Final verification and documentation

- [x] T027 [P] Verify build succeeds with npm run build
- [ ] T028 [P] Test all 11 languages in Obsidian manually (manual testing required)
- [ ] T029 [P] Verify Arabic RTL layout has no overflow or alignment issues (manual testing required)
- [x] T030 Update version in manifest.json for release (0.6.0)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories (locales needed)
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational - Independent of US1/US2
- **User Story 4 (P4)**: Can start after Foundational - Independent of US1/US2/US3

### Parallel Opportunities

- T004-T012 (locale files) can all run in parallel
- T027-T029 (verification) can run in parallel
- User stories can be worked on in parallel once Foundational phase completes

---

## Parallel Example: Foundational Phase (Locale Files)

```bash
# Launch all locale file creation in parallel:
Task: "Create Spanish translations in src/i18n/locales/es.ts"
Task: "Create French translations in src/i18n/locales/fr.ts"
Task: "Create German translations in src/i18n/locales/de.ts"
Task: "Create Portuguese translations in src/i18n/locales/pt.ts"
Task: "Create Japanese translations in src/i18n/locales/ja.ts"
Task: "Create Chinese (Simplified) translations in src/i18n/locales/zh.ts"
Task: "Create Arabic translations in src/i18n/locales/ar.ts"
Task: "Create Russian translations in src/i18n/locales/ru.ts"
Task: "Create Hindi translations in src/i18n/locales/hi.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational - All locale files (T004-T013)
3. Complete Phase 3: User Story 1 - Language Selection (T014-T016)
4. **STOP and VALIDATE**: Test language selection with all 11 languages
5. Deploy/demo if ready - users can now select their language

### Incremental Delivery

1. Complete Setup + Foundational → All locales ready
2. Add User Story 1 → Language selection works → MVP!
3. Add User Story 2 → Chat interface localized + RTL support
4. Add User Story 3 → Settings panel localized
5. Add User Story 4 → System messages localized
6. Complete Polish → Ready for release

### Suggested MVP Scope

**User Story 1** provides immediate value:
- Users can select from all 11 languages
- Language names shown in native script
- Preference persists across sessions
- Foundation for all other stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Locale files must implement all ~370 keys from TranslationKeys interface
- Only Arabic requires RTL support (direction: 'rtl')
- Brand name "Note Sage" should NOT be translated
- Commit after each task or logical group
