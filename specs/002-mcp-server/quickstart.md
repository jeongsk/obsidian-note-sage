# Quickstart: MCP Server Integration

**Date**: 2025-12-27
**Feature**: 001-mcp-server
**Status**: ✅ Implemented

## 개요

이 기능은 사용자가 Obsidian 설정에서 MCP(Model Context Protocol) 서버를 등록하고 관리할 수 있게 합니다. 등록된 서버는 Claude Agent가 외부 도구와 리소스에 접근하는 데 사용됩니다.

---

## 사용 방법

### 1. MCP 서버 추가

1. Obsidian 설정 열기 (Cmd+, 또는 Ctrl+,)
2. 플러그인 옵션 > Note Sage 선택
3. "MCP 서버" 섹션으로 스크롤
4. "서버 추가" 클릭

### 2. 서버 타입 선택

- **stdio (로컬 명령어)**: 로컬에서 실행되는 MCP 서버
  - 예: `npx @anthropic/mcp-server-filesystem /path/to/folder`
- **SSE (Server-Sent Events)**: 원격 SSE 기반 서버
- **HTTP**: 원격 HTTP 기반 서버

### 3. 서버 설정 예시

#### stdio 타입 (파일시스템 서버)
```
서버 이름: filesystem
타입: stdio
명령어: npx
인자: -y, @anthropic/mcp-server-filesystem, /Users/yourname/Documents
```

#### HTTP 타입
```
서버 이름: my-api
타입: HTTP
URL: http://localhost:3000/mcp
헤더: {"Authorization": "Bearer your-token"}
```

### 4. 상태 확인

- 설정 화면: 각 서버 옆에 상태 아이콘 표시
- 채팅 뷰: 헤더에 MCP 상태 아이콘 표시 (서버가 활성화된 경우)

---

## 구현된 기능

### ✅ Phase 1: Setup (타입 정의 및 국제화)
- `McpServerConfigEntry` 인터페이스 추가
- `McpServerStatus` 인터페이스 추가
- `NoteSageSettings`에 `mcpServers` 필드 추가
- 한국어/영어 번역 키 추가

### ✅ Phase 2: Foundational (McpServerManager)
- 상태 캐싱 및 조회
- 상태 변경 리스너 관리
- SDK 타입 변환 유틸리티 (`toSdkConfig`, `toSdkMcpServers`)

### ✅ Phase 3: User Story 1 (설정 UI)
- MCP 서버 목록 렌더링
- 서버 추가/편집/삭제 폼
- 중복 이름 검증
- 활성화/비활성화 토글

### ✅ Phase 4: User Story 2 (상태 표시)
- 설정 화면 상태 아이콘
- 채팅 뷰 헤더 상태 아이콘
- 상세 상태 툴팁

### ✅ Phase 5: User Story 3 (SDK 연동)
- 설정에서 MCP 서버 로드
- AgentService에 활성화된 서버 전달
- 설정 변경 시 자동 업데이트

---

## 구현된 파일

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/types.ts` | 수정 | `McpServerConfigEntry`, `McpServerStatus` 타입 추가 |
| `src/i18n/locales/en.ts` | 수정 | MCP 관련 영어 번역 추가 |
| `src/i18n/locales/ko.ts` | 수정 | MCP 관련 한국어 번역 추가 |
| `src/mcp/McpServerManager.ts` | 신규 | 상태 관리 클래스 |
| `src/mcp/McpSettingsUI.ts` | 신규 | 설정 UI 컴포넌트 |
| `src/SettingsTab.ts` | 수정 | MCP 설정 섹션 통합 |
| `src/ChatView.ts` | 수정 | 헤더 상태 아이콘 추가 |
| `src/main.ts` | 수정 | McpServerManager 초기화 |
| `styles.css` | 수정 | MCP 관련 스타일 추가 |

---

## 테스트 시나리오

### 기본 흐름
1. 설정 > Note Sage > MCP 서버 섹션으로 이동
2. "서버 추가" 클릭
3. stdio 타입 선택, 이름과 command 입력
4. 저장 후 서버 목록에 추가 확인
5. 채팅 뷰에서 상태 아이콘 확인
6. MCP 도구 사용을 요청하는 프롬프트 전송
7. 도구가 호출되는지 확인

### 에러 케이스
- 중복 이름 입력 → 경고 메시지, 저장 차단
- 잘못된 command 경로 → 연결 실패 상태 표시 (SDK에서 반환)

---

## 의존성

- `@anthropic-ai/claude-agent-sdk`: MCP 서버 지원 (기존 설치됨)

추가 패키지 설치 불필요.

---

## 향후 개선 사항

- T042, T043: SDK의 mcpServerStatus() API를 통한 실시간 상태 조회
- T044: MCP 연결 30초 타임아웃 처리
- T045, T046: 입력 유효성 검증 강화
