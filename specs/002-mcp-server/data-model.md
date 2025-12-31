# Data Model: MCP Server Integration

**Date**: 2025-12-27
**Feature**: 001-mcp-server

## Entities

### 1. McpServerConfigEntry

사용자가 등록한 MCP 서버의 설정 정보를 저장합니다.

```typescript
/**
 * MCP 서버 설정 항목 (플러그인 설정에 저장)
 */
interface McpServerConfigEntry {
  /** 고유 서버 이름 (SDK의 mcpServers 객체 키로 사용) */
  name: string;

  /** 서버 타입: stdio, sse, http */
  type: 'stdio' | 'sse' | 'http';

  /** 서버 활성화 여부 */
  enabled: boolean;

  // stdio 타입 전용 필드
  /** 실행할 명령어 (stdio 타입) */
  command?: string;
  /** 명령어 인자 (stdio 타입) */
  args?: string[];
  /** 환경 변수 (stdio 타입) */
  env?: Record<string, string>;

  // sse/http 타입 전용 필드
  /** 서버 URL (sse/http 타입) */
  url?: string;
  /** HTTP 헤더 (sse/http 타입) */
  headers?: Record<string, string>;
}
```

**Validation Rules**:
- `name`: 필수, 고유, 1-50자, 특수문자 제한 (/\:*?"<>| 금지)
- `type`: 필수, 'stdio' | 'sse' | 'http' 중 하나
- `enabled`: 기본값 true
- `command`: stdio 타입일 때 필수
- `url`: sse/http 타입일 때 필수, 유효한 URL 형식

---

### 2. McpServerStatus

런타임에 MCP 서버의 연결 상태를 나타냅니다.

```typescript
/**
 * MCP 서버 연결 상태 (런타임, SDK에서 조회)
 */
interface McpServerStatus {
  /** 서버 이름 */
  name: string;

  /** 연결 상태 */
  status: 'connected' | 'failed' | 'pending' | 'needs-auth';

  /** 서버 정보 (연결 성공 시) */
  serverInfo?: {
    name: string;
    version: string;
  };

  /** 오류 메시지 (연결 실패 시) */
  errorMessage?: string;
}
```

**State Transitions**:
```
[초기] -> pending (연결 시도 중)
pending -> connected (연결 성공)
pending -> failed (연결 실패 또는 타임아웃)
pending -> needs-auth (인증 필요)
connected -> failed (연결 끊김)
failed -> pending (재연결 시도)
```

---

### 3. NoteSageSettings (확장)

기존 설정 인터페이스에 MCP 서버 설정 필드를 추가합니다.

```typescript
interface NoteSageSettings {
  // ... 기존 필드들 ...

  /** MCP 서버 설정 목록 */
  mcpServers?: McpServerConfigEntry[];
}
```

**Default Value**:
```typescript
DEFAULT_SETTINGS = {
  // ... 기존 기본값들 ...
  mcpServers: []
}
```

---

## Relationships

```
NoteSageSettings
    └── mcpServers: McpServerConfigEntry[] (1:N)

McpServerConfigEntry (설정, 영구 저장)
    ↓ 이름으로 매핑
McpServerStatus (런타임 상태, 메모리)
```

---

## SDK Type Mapping

플러그인 설정(McpServerConfigEntry)을 SDK 옵션(McpServerConfig)으로 변환:

```typescript
function toSdkConfig(entry: McpServerConfigEntry): McpServerConfig {
  if (entry.type === 'stdio') {
    return {
      type: 'stdio',
      command: entry.command!,
      args: entry.args,
      env: entry.env
    };
  } else if (entry.type === 'sse') {
    return {
      type: 'sse',
      url: entry.url!,
      headers: entry.headers
    };
  } else {
    return {
      type: 'http',
      url: entry.url!,
      headers: entry.headers
    };
  }
}

function toSdkMcpServers(
  entries: McpServerConfigEntry[]
): Record<string, McpServerConfig> {
  return entries
    .filter(e => e.enabled)
    .reduce((acc, e) => {
      acc[e.name] = toSdkConfig(e);
      return acc;
    }, {} as Record<string, McpServerConfig>);
}
```

---

## Persistence

**Storage Location**: `.obsidian/plugins/obsidian-note-sage/data.json`

**Example Stored Data**:
```json
{
  "apiKey": "sk-...",
  "model": "claude-sonnet-4-5",
  "mcpServers": [
    {
      "name": "filesystem",
      "type": "stdio",
      "enabled": true,
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/path/to/dir"]
    },
    {
      "name": "weather-api",
      "type": "http",
      "enabled": true,
      "url": "http://localhost:8080/mcp"
    }
  ]
}
```
