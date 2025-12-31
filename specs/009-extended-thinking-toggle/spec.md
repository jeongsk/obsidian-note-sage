# Feature Specification: Extended Thinking Toggle

**Feature Branch**: `009-extended-thinking-toggle`
**Created**: 2026-01-01
**Status**: Draft
**Input**: User description: "chat view 에서 Extended Thinking 를 on/off 할 수 있는 기능을 추가합니다."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Extended Thinking 토글 활성화 (Priority: P1)

사용자가 Chat View 헤더에서 Extended Thinking 기능을 켜고 끌 수 있다. 복잡한 문제를 해결할 때 Claude가 더 깊이 생각하도록 하거나, 빠른 응답이 필요할 때 기능을 비활성화할 수 있다.

**Why this priority**: 핵심 기능이며, 사용자가 Settings 탭에 들어가지 않고도 채팅 중에 바로 Extended Thinking을 제어할 수 있어 UX가 크게 향상된다.

**Independent Test**: Chat View를 열고 헤더의 Extended Thinking 토글을 클릭하여 on/off 상태가 변경되고, 해당 상태가 다음 메시지 전송에 반영되는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** Chat View가 열려 있고 Extended Thinking이 비활성화된 상태, **When** 사용자가 Extended Thinking 토글을 클릭, **Then** 토글이 활성화 상태로 변경되고 시각적 피드백(색상 변화)이 표시됨
2. **Given** Extended Thinking이 활성화된 상태, **When** 사용자가 메시지를 전송, **Then** Claude가 Extended Thinking 모드로 응답하고 사고 과정 블록이 표시됨
3. **Given** Extended Thinking이 비활성화된 상태, **When** 사용자가 메시지를 전송, **Then** Claude가 일반 모드로 응답하고 사고 과정 블록이 표시되지 않음

---

### User Story 2 - 토글 상태 동기화 (Priority: P2)

Chat View의 Extended Thinking 토글 상태가 Settings 탭의 설정과 동기화된다. 한 곳에서 변경하면 다른 곳에도 반영된다.

**Why this priority**: 설정 일관성을 위해 중요하지만, 핵심 토글 기능이 동작한 후에 구현해도 된다.

**Independent Test**: Chat View에서 토글을 변경한 후 Settings 탭을 열어 동일한 설정값이 반영되어 있는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** Chat View에서 Extended Thinking을 활성화, **When** Settings 탭을 열기, **Then** Extended Thinking 설정이 활성화 상태로 표시됨
2. **Given** Settings 탭에서 Extended Thinking을 비활성화, **When** Chat View로 돌아가기, **Then** 헤더의 토글이 비활성화 상태로 표시됨

---

### User Story 3 - 상태 지속성 (Priority: P3)

Extended Thinking 토글 상태가 Obsidian을 재시작해도 유지된다.

**Why this priority**: 사용자 경험을 위해 필요하지만, 기존 설정 저장 메커니즘을 그대로 사용하므로 자연스럽게 구현된다.

**Independent Test**: 토글 상태를 변경한 후 Obsidian을 재시작하여 이전 상태가 유지되는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** Extended Thinking을 활성화하고 Obsidian 종료, **When** Obsidian을 다시 시작하고 Chat View 열기, **Then** Extended Thinking 토글이 활성화 상태로 표시됨

---

### Edge Cases

- 토글을 빠르게 여러 번 클릭해도 상태가 올바르게 반영되어야 함
- 설정 저장 중 오류가 발생해도 UI 상태가 일관성을 유지해야 함
- RTL(Right-to-Left) 언어에서도 토글이 올바르게 표시되어야 함

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 Chat View 헤더에 Extended Thinking on/off 토글을 표시해야 함
- **FR-002**: 토글 클릭 시 Extended Thinking 설정이 즉시 변경되어야 함
- **FR-003**: 토글 상태가 시각적으로 명확하게 구분되어야 함 (활성화: 강조 색상, 비활성화: 기본 색상)
- **FR-004**: 토글 상태 변경이 플러그인 설정에 저장되어야 함
- **FR-005**: Chat View와 Settings 탭 간 설정 동기화가 유지되어야 함
- **FR-006**: 토글에 아이콘과 레이블을 표시하여 기능을 식별할 수 있어야 함

### Key Entities

- **Extended Thinking Toggle**: 헤더에 위치한 토글 UI 요소, 현재 Extended Thinking 활성화 상태를 표시하고 제어
- **Settings (enableExtendedThinking)**: 플러그인 전역 설정, 토글 상태와 동기화됨

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자가 Settings 탭에 들어가지 않고 1번의 클릭으로 Extended Thinking을 토글할 수 있음
- **SC-002**: 토글 상태 변경 시 시각적 피드백이 즉각적으로 표시됨 (지연 없음)
- **SC-003**: 모든 설정 변경이 영구적으로 저장되어 앱 재시작 후에도 유지됨
- **SC-004**: 토글 UI가 기존 헤더 디자인과 일관성을 유지함 (MCP 상태 아이콘, 버튼 그룹과 조화)
- **SC-005**: 11개 지원 언어 모두에서 레이블과 툴팁이 올바르게 표시됨
