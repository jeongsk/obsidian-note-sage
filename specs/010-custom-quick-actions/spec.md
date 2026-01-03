# Feature Specification: Custom Quick Actions

**Feature Branch**: `010-custom-quick-actions`  
**Created**: 2025-01-03  
**Status**: Draft  
**Input**: User description: "설정의 빠른 액션에서 사용자가 커스텀 빠른 액션을 추가할 수 있는 기능을 구현합니다."

## Clarifications

### Session 2025-01-03

- 기존 4개의 기본 빠른 액션(요약, 개선, 분석, 번역)은 유지하면서, 사용자가 추가적인 커스텀 빠른 액션을 생성할 수 있도록 확장

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Custom Quick Action (Priority: P1)

사용자가 설정의 빠른 액션 섹션에서 새로운 커스텀 빠른 액션을 추가하여 자주 사용하는 프롬프트를 버튼으로 빠르게 실행할 수 있습니다.

**Why this priority**: 커스텀 빠른 액션 생성은 이 기능의 핵심 가치입니다. 사용자가 자신만의 워크플로우에 맞는 빠른 액션을 만들 수 있어야 합니다.

**Independent Test**: 설정에서 "커스텀 빠른 액션 추가" 버튼을 클릭하고, 이름과 프롬프트를 입력한 후 저장하면 채팅 뷰에 새 버튼이 표시되는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 빠른 액션 설정 섹션에 있는 상태, **When** 사용자가 "커스텀 빠른 액션 추가" 버튼을 클릭, **Then** 새 커스텀 빠른 액션을 생성할 수 있는 입력 폼이 나타남
2. **Given** 커스텀 빠른 액션 입력 폼에서, **When** 사용자가 이름(예: "코드 리뷰")과 프롬프트(예: "이 코드를 리뷰해주세요")를 입력하고 저장, **Then** 새 커스텀 빠른 액션이 설정에 추가되고 채팅 뷰에 버튼으로 표시됨
3. **Given** Obsidian을 재시작한 상태, **When** 채팅 뷰를 열면, **Then** 이전에 생성한 커스텀 빠른 액션이 유지되어 표시됨

---

### User Story 2 - Edit Custom Quick Action (Priority: P2)

사용자가 이미 생성한 커스텀 빠른 액션의 이름이나 프롬프트를 수정할 수 있습니다.

**Why this priority**: 생성 후 수정이 가능해야 실수를 바로잡거나 프롬프트를 개선할 수 있습니다.

**Independent Test**: 설정에서 기존 커스텀 빠른 액션의 이름이나 프롬프트를 변경하고, 채팅 뷰에서 수정된 내용이 반영되는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** "코드 리뷰"라는 커스텀 빠른 액션이 있는 상태, **When** 사용자가 이름을 "PR 리뷰"로 변경, **Then** 채팅 뷰의 버튼 라벨이 "PR 리뷰"로 업데이트됨
2. **Given** 커스텀 빠른 액션의 프롬프트가 설정된 상태, **When** 사용자가 프롬프트를 수정하고 해당 버튼을 클릭, **Then** 수정된 프롬프트가 전송됨

---

### User Story 3 - Delete Custom Quick Action (Priority: P2)

사용자가 더 이상 필요하지 않은 커스텀 빠른 액션을 삭제할 수 있습니다.

**Why this priority**: 사용하지 않는 액션을 정리하여 UI를 깔끔하게 유지할 수 있어야 합니다.

**Independent Test**: 설정에서 커스텀 빠른 액션 삭제 버튼을 클릭하면 해당 액션이 설정과 채팅 뷰에서 사라지는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 커스텀 빠른 액션 "코드 리뷰"가 있는 상태, **When** 사용자가 삭제 버튼을 클릭하고 확인, **Then** 해당 액션이 설정 목록과 채팅 뷰에서 제거됨
2. **Given** 커스텀 빠른 액션을 삭제한 상태, **When** Obsidian을 재시작, **Then** 삭제된 액션은 복원되지 않음

---

### User Story 4 - Enable/Disable Custom Quick Action (Priority: P3)

사용자가 커스텀 빠른 액션을 삭제하지 않고 일시적으로 비활성화할 수 있습니다.

**Why this priority**: 기본 빠른 액션과 동일하게 활성화/비활성화 기능을 제공하여 일관된 사용자 경험을 보장합니다.

**Independent Test**: 설정에서 커스텀 빠른 액션의 토글을 끄면 채팅 뷰에서 버튼이 숨겨지고, 다시 켜면 나타나는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 활성화된 커스텀 빠른 액션이 있는 상태, **When** 사용자가 해당 액션을 비활성화, **Then** 채팅 뷰에서 해당 버튼이 사라짐
2. **Given** 비활성화된 커스텀 빠른 액션이 있는 상태, **When** 사용자가 해당 액션을 다시 활성화, **Then** 채팅 뷰에 해당 버튼이 다시 표시됨

---

### User Story 5 - Reorder Quick Actions (Priority: P3)

사용자가 커스텀 빠른 액션의 표시 순서를 변경할 수 있습니다.

**Why this priority**: 자주 사용하는 액션을 앞쪽에 배치하여 접근성을 높일 수 있습니다.

**Independent Test**: 설정에서 커스텀 빠른 액션의 순서를 변경하면 채팅 뷰에서도 동일한 순서로 표시되는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 여러 개의 커스텀 빠른 액션이 있는 상태, **When** 사용자가 드래그 앤 드롭 또는 순서 변경 버튼으로 순서를 변경, **Then** 채팅 뷰의 버튼 순서가 설정과 동일하게 변경됨
2. **Given** 순서가 변경된 상태, **When** Obsidian을 재시작, **Then** 변경된 순서가 유지됨

---

### Edge Cases

- 사용자가 이름 없이 커스텀 빠른 액션을 생성하려고 하면?
  - 이름은 필수 입력 필드로, 빈 이름은 허용되지 않으며 저장 버튼이 비활성화됨
- 프롬프트가 비어있는 커스텀 빠른 액션을 생성하면?
  - 프롬프트는 필수 입력 필드로, 빈 프롬프트는 허용되지 않음
- 동일한 이름의 커스텀 빠른 액션을 생성하면?
  - 중복 이름은 허용됨 (사용자가 구분할 수 있도록 다른 이름을 권장하지만 강제하지 않음)
- 커스텀 빠른 액션이 10개 이상이면?
  - 제한 없이 생성 가능하며, 채팅 뷰에서 스크롤 또는 줄바꿈으로 모든 버튼 표시
- 기본 빠른 액션(요약, 개선, 분석, 번역)을 삭제하려고 하면?
  - 기본 빠른 액션은 삭제할 수 없으며, 활성화/비활성화만 가능 (기존 동작 유지)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create new custom quick actions with a name and prompt
- **FR-002**: System MUST display an "Add Custom Quick Action" button in the Quick Actions settings section
- **FR-003**: System MUST persist custom quick actions across sessions
- **FR-004**: System MUST allow users to edit the name and prompt of existing custom quick actions
- **FR-005**: System MUST allow users to delete custom quick actions
- **FR-006**: System MUST display a confirmation before deleting a custom quick action
- **FR-007**: System MUST allow users to enable or disable individual custom quick actions
- **FR-008**: System MUST display only enabled custom quick actions in the chat view alongside enabled default quick actions
- **FR-009**: System MUST allow users to reorder custom quick actions
- **FR-010**: System MUST apply the custom prompt when a custom quick action button is clicked
- **FR-011**: System MUST validate that name and prompt are not empty before saving a custom quick action
- **FR-012**: System MUST clearly distinguish between default quick actions (non-deletable) and custom quick actions (deletable) in the settings UI
- **FR-013**: Custom quick actions MUST appear after default quick actions in the chat view button area

### Key Entities

- **CustomQuickAction**: Represents a user-created quick action with properties: id (unique identifier), name (display label), prompt (text to send), enabled (boolean), order (display position)
- **QuickActionsSettings**: Extended to include an array of CustomQuickAction entries alongside the existing default quick action configurations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new custom quick action within 30 seconds (name + prompt input + save)
- **SC-002**: Custom quick actions appear in the chat view immediately after saving without requiring page refresh
- **SC-003**: All custom quick action operations (create, edit, delete, enable/disable, reorder) are reflected in the chat view without Obsidian restart
- **SC-004**: Custom quick actions persist correctly across Obsidian restarts
- **SC-005**: Users can distinguish between default and custom quick actions at a glance in the settings UI

## Assumptions

- Icons for custom quick actions will use a default icon (e.g., "zap" or "command") since users won't select custom icons in this initial implementation
- The order of display will be: default quick actions first (in their original order), then custom quick actions (in user-defined order)
- i18n support for custom quick action names is not required since users input their own text
