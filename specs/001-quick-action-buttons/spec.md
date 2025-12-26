# Feature Specification: Quick Action Buttons Customization

**Feature Branch**: `001-quick-action-buttons`
**Created**: 2025-12-26
**Status**: Draft
**Input**: User description: "chat view의 채팅 입력창 바로 위에 "요약", "개선", "분석", "번역" 버튼을 추가하거나 제외할 수 있습니다. 삭제는 불가능하고 enable 또는 disable 만 가능합니다. 그리고 프롬프트도 수정가능합니다. 수정한 프롬프트를 다시 기본 프롬프트로 리셋하는 것도 가능합니다."

## Clarifications

### Session 2025-12-26

- Q: 설정 페이지에서 빠른 액션 버튼들의 설정 UI를 어떻게 배치할까요? → A: 기존 설정 탭에 "Quick Actions" 섹션 추가 (각 버튼별 토글 + 프롬프트 편집 필드)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enable/Disable Quick Action Buttons (Priority: P1)

사용자가 채팅 입력창 위의 빠른 액션 버튼(요약, 개선, 분석, 번역)을 개별적으로 활성화하거나 비활성화하여 자주 사용하지 않는 버튼을 숨길 수 있습니다.

**Why this priority**: 사용자가 UI를 깔끔하게 유지하고 자주 사용하는 기능만 표시할 수 있어 사용성을 향상시킵니다. 이것이 핵심 요구사항입니다.

**Independent Test**: 설정에서 특정 버튼을 비활성화한 후 채팅 뷰에서 해당 버튼이 사라지는지 확인하여 테스트할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 모든 빠른 액션 버튼이 활성화된 상태, **When** 사용자가 설정에서 "요약" 버튼을 비활성화, **Then** 채팅 입력창 위에 "요약" 버튼이 표시되지 않음
2. **Given** "분석" 버튼이 비활성화된 상태, **When** 사용자가 설정에서 "분석" 버튼을 다시 활성화, **Then** 채팅 입력창 위에 "분석" 버튼이 다시 표시됨
3. **Given** 플러그인이 설치된 상태, **When** 사용자가 처음 플러그인을 사용, **Then** 모든 4개의 빠른 액션 버튼이 기본적으로 활성화되어 표시됨

---

### User Story 2 - Customize Quick Action Prompts (Priority: P2)

사용자가 각 빠른 액션 버튼의 프롬프트를 자신의 필요에 맞게 수정할 수 있습니다.

**Why this priority**: 기본 프롬프트가 모든 사용자의 요구를 충족하지 못할 수 있으므로 커스터마이징 기능은 고급 사용자에게 중요합니다.

**Independent Test**: 설정에서 프롬프트를 수정한 후 해당 버튼을 클릭했을 때 수정된 프롬프트가 전송되는지 확인하여 테스트할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** "요약" 버튼의 기본 프롬프트가 설정된 상태, **When** 사용자가 설정에서 프롬프트를 "이 문서를 3줄로 요약해줘"로 변경, **Then** "요약" 버튼 클릭 시 변경된 프롬프트가 전송됨
2. **Given** 프롬프트가 수정된 상태, **When** 사용자가 Obsidian을 재시작, **Then** 수정된 프롬프트가 유지됨
3. **Given** 빈 프롬프트 입력 필드, **When** 사용자가 아무것도 입력하지 않고 저장, **Then** 기본 프롬프트가 적용됨

---

### User Story 3 - Reset Prompt to Default (Priority: P3)

사용자가 수정한 프롬프트를 기본값으로 되돌릴 수 있습니다.

**Why this priority**: 사용자가 실험 후 원래 설정으로 쉽게 복구할 수 있어야 합니다.

**Independent Test**: 수정된 프롬프트가 있는 상태에서 리셋 버튼을 클릭하여 기본 프롬프트로 복구되는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** "번역" 버튼의 프롬프트가 사용자 정의 값으로 수정된 상태, **When** 사용자가 해당 프롬프트의 리셋 버튼을 클릭, **Then** 프롬프트가 기본값으로 복원됨
2. **Given** 프롬프트가 기본값인 상태, **When** 사용자가 리셋 버튼을 클릭, **Then** 아무 변화 없이 기본값 유지

---

### Edge Cases

- 사용자가 모든 빠른 액션 버튼을 비활성화하면 어떻게 되나요?
  - 빠른 액션 컨테이너 영역이 숨겨져 공간을 차지하지 않음
- 프롬프트에 특수문자나 이모지가 포함되면 어떻게 되나요?
  - 정상적으로 저장 및 전송됨
- 프롬프트가 매우 긴 경우(예: 1000자 이상)?
  - 시스템이 허용하는 범위 내에서 정상 처리됨

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to enable or disable each of the four quick action buttons (Summarize, Improve, Analyze, Translate) individually
- **FR-002**: System MUST persist the enable/disable state for each button across sessions
- **FR-003**: System MUST allow users to edit the prompt text for each quick action button
- **FR-004**: System MUST persist custom prompts across sessions
- **FR-005**: System MUST provide a reset button for each prompt to restore the default value
- **FR-006**: System MUST display only enabled quick action buttons in the chat view
- **FR-007**: System MUST apply the custom prompt (if set) when a quick action button is clicked
- **FR-008**: System MUST use the default prompt when the custom prompt is empty or reset
- **FR-009**: System MUST NOT allow deletion of quick action buttons (only enable/disable)
- **FR-010**: System MUST display all four quick action buttons as enabled by default for new users
- **FR-011**: System MUST provide a "Quick Actions" section in the existing plugin settings tab containing toggle switches and prompt editors for each button

### Key Entities

- **QuickAction**: Represents a quick action button with properties: id (unique identifier), labelKey (i18n key for display name), promptKey (i18n key for default prompt), icon (icon identifier), enabled (boolean), customPrompt (optional string)
- **QuickActionsSettings**: Collection of QuickAction configurations stored in plugin settings

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can toggle the visibility of each quick action button within 2 clicks from the settings page
- **SC-002**: Custom prompts are applied correctly 100% of the time when the corresponding button is clicked
- **SC-003**: Reset to default restores the original prompt value immediately upon clicking
- **SC-004**: Settings changes are reflected in the chat view without requiring plugin restart or Obsidian reload
- **SC-005**: All customizations persist correctly across Obsidian restarts
