# Research: MCP Server Integration

**Date**: 2025-12-27
**Feature**: 001-mcp-server

## 1. Claude Agent SDK MCP Server 지원

### Decision
Claude Agent SDK의 `mcpServers` 옵션을 사용하여 stdio, SSE, HTTP 타입의 MCP 서버를 지원합니다.

### Rationale
- SDK가 이미 `McpServerConfig` 타입을 제공하며 세 가지 타입을 모두 지원
- 기존 AgentService.ts에 `setMcpServers()` 메서드가 이미 구현되어 있음
- `mcpServerStatus()` 메서드로 연결 상태 조회 가능

### Alternatives Considered
1. **직접 MCP 프로토콜 구현**: 불필요한 복잡성, SDK가 이미 처리
2. **외부 MCP 클라이언트 라이브러리**: SDK와 중복, 의존성 증가

### SDK 타입 정의 (참조)
```typescript
type McpServerConfig =
  | McpStdioServerConfig    // { type?: 'stdio', command, args?, env? }
  | McpSSEServerConfig      // { type: 'sse', url, headers? }
  | McpHttpServerConfig;    // { type: 'http', url, headers? }
```

---

## 2. Obsidian 설정 저장 방식

### Decision
`NoteSageSettings` 인터페이스에 `mcpServers?: McpServerConfigEntry[]` 필드를 추가하여 설정을 저장합니다.

### Rationale
- 기존 설정 저장 패턴과 일관성 유지
- Obsidian의 `saveData()`/`loadData()` API가 복잡한 객체 배열 지원
- 플러그인 재시작 후에도 설정 유지

### Alternatives Considered
1. **별도 설정 파일**: 불필요한 복잡성, Obsidian API 활용 못함
2. **localStorage**: 플러그인 삭제 시 정리 안됨

---

## 3. MCP 서버 상태 관리

### Decision
`McpServerManager` 클래스를 생성하여 서버 상태를 중앙에서 관리합니다.

### Rationale
- 설정 화면과 채팅 뷰 모두에서 상태 조회 필요
- SDK의 `mcpServerStatus()` 호출 결과를 캐싱하여 성능 최적화
- 상태 변경 시 UI 업데이트를 위한 이벤트 시스템 필요

### Implementation Pattern
```typescript
class McpServerManager {
  private statusCache: Map<string, McpServerStatus>;
  private listeners: Set<(status: Map<string, McpServerStatus>) => void>;

  async refreshStatus(query: Query): Promise<void>;
  getStatus(serverName: string): McpServerStatus | undefined;
  onStatusChange(listener): () => void;
}
```

---

## 4. 설정 UI 패턴

### Decision
기존 Quick Actions 설정 UI 패턴을 따라 MCP 서버 목록을 렌더링합니다.

### Rationale
- 기존 `renderQuickActionsSettings()` 메서드와 유사한 패턴 사용
- Obsidian Setting API와 일관된 UX 제공
- 모달 대신 인라인 폼으로 간소화

### UI Components
1. **서버 목록**: 각 서버에 대해 이름, 타입, 상태 아이콘, 활성화 토글, 편집/삭제 버튼
2. **추가 버튼**: 새 서버 추가 시 타입 선택 드롭다운과 필드 표시
3. **폼 필드**: 타입에 따라 동적으로 표시 (command/args/env 또는 url/headers)

---

## 5. 채팅 뷰 상태 표시

### Decision
채팅 헤더의 모델 선택 드롭다운 옆에 MCP 상태 아이콘을 표시합니다.

### Rationale
- 항상 보이는 영역에 표시하여 사용자가 쉽게 확인 가능
- 클릭 시 툴팁으로 상세 상태 표시
- 기존 헤더 레이아웃과 조화

### Status Icons
- 🟢 (connected): 모든 서버 정상 연결
- 🟡 (pending): 연결 중인 서버 있음
- 🔴 (failed): 연결 실패한 서버 있음
- ⚫ (none): 등록된 서버 없음

---

## 6. 에러 처리

### Decision
연결 실패 시 30초 타임아웃을 적용하고, 상세 오류 메시지를 UI에 표시합니다.

### Rationale
- 30초는 대부분의 MCP 서버가 시작하기에 충분한 시간
- 사용자가 문제를 진단할 수 있도록 오류 정보 제공
- SDK의 에러 메시지를 그대로 전달

### Error Handling Flow
1. 연결 시도 → 30초 후 타임아웃
2. 타임아웃 또는 에러 발생 시 status = 'failed'
3. 에러 메시지를 statusMessage에 저장
4. 설정 화면과 채팅 뷰에서 오류 정보 표시 (툴팁)

---

## 7. 중복 이름 처리

### Decision
서버 저장 시 이름 중복 검사를 수행하고, 중복 시 경고 메시지와 함께 저장을 차단합니다.

### Rationale
- 명확한 피드백으로 사용자 혼란 방지
- 의도치 않은 덮어쓰기 방지
- SDK의 mcpServers 객체가 이름을 키로 사용하므로 고유성 필수

### Validation Logic
```typescript
function isNameDuplicate(name: string, excludeIndex?: number): boolean {
  return settings.mcpServers?.some(
    (s, i) => s.name === name && i !== excludeIndex
  ) ?? false;
}
```
