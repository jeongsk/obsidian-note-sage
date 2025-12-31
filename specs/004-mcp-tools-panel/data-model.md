# Data Model: MCP Tools Panel

**Date**: 2025-12-27
**Feature**: 002-mcp-tools-panel

## Entities

### 1. McpServerConfigEntry (기존)

외부 도구를 제공하는 MCP 서버의 설정 정보

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| name | string | 고유 서버 이름 | 필수, 중복 불가 |
| type | 'stdio' \| 'sse' \| 'http' | 서버 연결 타입 | 필수 |
| enabled | boolean | 서버 활성화 여부 | 필수, 기본값 true |
| command | string? | 실행할 명령어 (stdio 전용) | stdio 시 필수 |
| args | string[]? | 명령어 인자 (stdio 전용) | 선택 |
| env | Record<string, string>? | 환경 변수 (stdio 전용) | 선택 |
| url | string? | 서버 URL (sse/http 전용) | sse/http 시 필수 |
| headers | Record<string, string>? | HTTP 헤더 (sse/http 전용) | 선택 |

**Location**: `src/types.ts` (기존)

### 2. McpServerStatus (기존)

MCP 서버의 런타임 연결 상태

| Field | Type | Description |
|-------|------|-------------|
| name | string | 서버 이름 (McpServerConfigEntry.name과 매칭) |
| status | 'connected' \| 'failed' \| 'pending' \| 'needs-auth' | 연결 상태 |
| serverInfo | { name: string; version: string }? | 서버 메타데이터 (연결 성공 시) |
| errorMessage | string? | 오류 메시지 (연결 실패 시) |

**Location**: `src/types.ts` (기존)

### 3. McpTool (신규)

MCP 서버가 제공하는 개별 도구 정보

| Field | Type | Description |
|-------|------|-------------|
| name | string | 도구 이름 |
| description | string? | 도구 설명 |

**Location**: `src/types.ts` (신규 추가)

**Note**: Claude Agent SDK의 MCP 서버 응답에서 tools 정보를 추출. SDK에서 제공하는 메타데이터 구조에 따라 조정 필요.

### 4. McpToolsPanelState (신규)

패널 UI 상태 관리

| Field | Type | Description |
|-------|------|-------------|
| isOpen | boolean | 패널 열림 여부 |
| expandedServers | Set<string> | 확장된 서버 이름 목록 |

**Location**: `src/mcp/McpToolsPanel.ts` (클래스 내부 상태)

## Relationships

```
NoteSageSettings
    └── mcpServers: McpServerConfigEntry[]
            │
            ▼
    McpServerManager
        ├── statusCache: Map<name, McpServerStatus>
        └── listeners: Set<callback>
            │
            ▼
    McpToolsPanel (UI)
        ├── servers: McpServerConfigEntry[] (from settings)
        ├── statuses: McpServerStatus[] (from manager)
        └── tools: Map<serverName, McpTool[]> (from SDK)
```

## State Transitions

### Server Enabled/Disabled Toggle

```
[User Clicks Toggle]
    │
    ├─ enabled: true → false
    │   └─ Server disconnected, status reset to 'pending'
    │
    └─ enabled: false → true
        └─ Server connection attempted
            ├─ Success → status: 'connected'
            └─ Failure → status: 'failed', toggle rollback
```

### Panel State

```
[Panel Closed] ──(icon click)──→ [Panel Open]
      ▲                               │
      │                               │
      └──(outside click / ESC)────────┘
```

### Server Expansion State

```
[Collapsed] ──(server item click)──→ [Expanded]
     ▲                                    │
     │                                    │
     └────(server item click)─────────────┘
```

## Data Flow

1. **설정 로드**: Plugin → Settings → McpServerConfigEntry[]
2. **상태 조회**: AgentService → SDK → McpServerManager → McpServerStatus[]
3. **상태 변경 감지**: McpServerManager → onStatusChange() → McpToolsPanel.render()
4. **토글 저장**: McpToolsPanel → Plugin.saveSettings() → data.json
