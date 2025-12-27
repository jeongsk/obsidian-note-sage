# Feature Specification: MCP Server Integration

**Feature Branch**: `001-mcp-server`
**Created**: 2025-12-27
**Status**: Draft
**Input**: User description: "Claude Agent SDK의 MCP 서버 기능을 활용하여 사용자가 커스텀 도구를 추가하고 관리할 수 있는 기능 제공"

## Clarifications

### Session 2025-12-27

- Q: MCP 서버 연결 상태를 어디에 표시할지? → A: 설정 화면과 채팅 뷰 모두에 표시
- Q: 중복 서버 이름 처리 방식? → A: 경고 메시지 표시 후 저장 차단
- Q: MCP 서버 연결 타임아웃 시간? → A: 30초
- Q: 채팅 뷰에서 MCP 서버 상태 표시 위치? → A: 채팅 헤더 영역 (모델 선택 옆 아이콘)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - MCP 서버 설정 관리 (Priority: P1)

사용자가 Obsidian 설정 화면에서 외부 MCP 서버(stdio, SSE, HTTP 타입)를 추가, 편집, 삭제할 수 있습니다. 이를 통해 Claude Agent가 외부 도구와 리소스에 접근할 수 있게 됩니다.

**Why this priority**: MCP 서버를 등록할 수 없다면 어떤 커스텀 도구도 사용할 수 없으므로 가장 핵심적인 기능입니다.

**Independent Test**: 설정 화면에서 MCP 서버를 추가하고, 저장 후 다시 열었을 때 설정이 유지되는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** 사용자가 설정 탭에 있을 때, **When** MCP 서버 섹션에서 "서버 추가" 버튼을 클릭하면, **Then** 서버 타입(stdio/SSE/HTTP)을 선택할 수 있는 폼이 표시됩니다.
2. **Given** 사용자가 stdio 타입을 선택했을 때, **When** command와 args를 입력하고 저장하면, **Then** 서버 목록에 새 서버가 추가됩니다.
3. **Given** 기존 MCP 서버가 등록되어 있을 때, **When** 해당 서버의 편집 버튼을 클릭하면, **Then** 기존 설정값이 채워진 편집 폼이 표시됩니다.
4. **Given** 기존 MCP 서버가 등록되어 있을 때, **When** 해당 서버의 삭제 버튼을 클릭하면, **Then** 확인 후 서버가 목록에서 제거됩니다.

---

### User Story 2 - MCP 서버 연결 상태 확인 (Priority: P2)

사용자가 등록된 MCP 서버의 연결 상태(connected, failed, pending 등)를 실시간으로 확인할 수 있습니다.

**Why this priority**: 서버가 제대로 연결되었는지 확인할 수 있어야 문제 해결이 가능합니다.

**Independent Test**: 유효한 MCP 서버와 유효하지 않은 MCP 서버를 각각 등록하고 상태 표시가 올바른지 확인합니다.

**Acceptance Scenarios**:

1. **Given** MCP 서버가 등록되어 있을 때, **When** 채팅 세션이 시작되면, **Then** 채팅 헤더의 모델 선택 옆에 MCP 서버 연결 상태 아이콘이 표시됩니다.
2. **Given** MCP 서버 연결이 실패했을 때, **When** 상태를 확인하면, **Then** "failed" 상태와 함께 오류 정보가 표시됩니다.

---

### User Story 3 - MCP 도구 사용 (Priority: P3)

사용자가 채팅 중에 등록된 MCP 서버가 제공하는 도구들을 Claude Agent가 자동으로 인식하고 사용할 수 있습니다.

**Why this priority**: 궁극적으로 MCP 서버를 등록하는 이유가 도구 사용이므로 핵심적인 사용자 경험입니다.

**Independent Test**: 간단한 도구를 제공하는 MCP 서버를 등록하고, 해당 도구를 요청하는 프롬프트를 전송하여 도구가 호출되는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** MCP 서버가 연결되고 도구를 제공할 때, **When** 사용자가 해당 도구가 필요한 작업을 요청하면, **Then** Claude Agent가 해당 도구를 호출합니다.
2. **Given** MCP 도구가 호출되었을 때, **When** 결과가 반환되면, **Then** 채팅 화면에 도구 사용 결과가 표시됩니다.

---

### Edge Cases

- MCP 서버 실행 파일 경로가 잘못되었을 때 명확한 오류 메시지가 표시되어야 합니다.
- 네트워크 연결 문제로 SSE/HTTP 서버에 연결할 수 없을 때 적절한 오류 처리가 필요합니다.
- MCP 서버가 30초 내에 응답하지 않을 때 연결 실패로 처리합니다.
- 중복된 서버 이름을 등록하려 할 때 경고 메시지를 표시하고 저장을 차단합니다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 stdio, SSE, HTTP 세 가지 타입의 MCP 서버를 등록할 수 있어야 합니다.
- **FR-002**: 시스템은 각 MCP 서버 타입에 맞는 설정 필드를 제공해야 합니다:
  - stdio: name, command, args, env
  - SSE: name, url, headers
  - HTTP: name, url, headers
- **FR-003**: 사용자는 등록된 MCP 서버를 활성화/비활성화할 수 있어야 합니다.
- **FR-004**: 시스템은 MCP 서버 설정을 플러그인 설정에 영구 저장해야 합니다.
- **FR-005**: 시스템은 채팅 세션 시작 시 활성화된 MCP 서버들을 Claude Agent SDK에 전달해야 합니다.
- **FR-006**: 시스템은 등록된 MCP 서버의 연결 상태를 설정 화면과 채팅 뷰 모두에 표시해야 합니다.
- **FR-007**: 시스템은 MCP 서버 연결 실패 시 사용자에게 오류 정보를 제공해야 합니다.

### Key Entities *(include if feature involves data)*

- **McpServerConfig**: 개별 MCP 서버의 설정 정보 (name, type, 타입별 필드, enabled 상태)
- **McpServerStatus**: 연결된 MCP 서버의 상태 정보 (name, status, serverInfo)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자가 3분 이내에 새 MCP 서버를 설정 화면에서 등록할 수 있습니다.
- **SC-002**: 등록된 MCP 서버가 다음 채팅 세션에서 자동으로 연결됩니다.
- **SC-003**: MCP 서버 연결 상태가 5초 이내에 UI에 반영됩니다.
- **SC-004**: MCP 서버 설정이 Obsidian 재시작 후에도 유지됩니다.
- **SC-005**: 90% 이상의 사용자가 도움말 없이 MCP 서버를 등록할 수 있습니다.

## Assumptions

- Claude Agent SDK의 `mcpServers` 옵션이 stdio, SSE, HTTP 타입을 모두 지원합니다.
- 사용자는 MCP 서버의 기본 개념(command, args, URL 등)을 이해하고 있습니다.
- MCP 서버 실행 파일은 사용자 시스템에 이미 설치되어 있습니다.
- Obsidian 플러그인 설정 시스템이 복잡한 객체 배열을 저장할 수 있습니다.
