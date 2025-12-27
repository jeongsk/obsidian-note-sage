# Quickstart: MCP Tools Panel

**Date**: 2025-12-27
**Feature**: 002-mcp-tools-panel

## Overview

MCP 플러그 아이콘 클릭 시 드롭다운 패널을 표시하여 MCP 서버 상태 확인 및 토글 기능을 제공합니다.

## Prerequisites

- Node.js 18+
- 기존 Note Sage 플러그인 개발 환경
- Obsidian Desktop 설치

## Quick Setup

```bash
# 1. 브랜치 체크아웃
git checkout 002-mcp-tools-panel

# 2. 의존성 설치 (이미 설치된 경우 생략)
npm install

# 3. 개발 모드 실행
npm run dev
```

## Key Files to Implement

| File | Action | Description |
|------|--------|-------------|
| `src/mcp/McpToolsPanel.ts` | **Create** | 메인 패널 UI 컴포넌트 |
| `src/ChatView.ts` | Modify | 아이콘 클릭 핸들러 연결 |
| `src/types.ts` | Modify | McpTool 타입 추가 |
| `src/i18n/locales/ko.ts` | Modify | 한국어 번역 추가 |
| `src/i18n/locales/en.ts` | Modify | 영어 번역 추가 |
| `styles.css` | Modify | 패널 스타일 추가 |

## Implementation Order

### Phase 1: Core Panel Structure
1. `McpToolsPanel` 클래스 생성
2. 패널 열기/닫기 로직
3. 외부 클릭 감지

### Phase 2: Server List
1. 서버 목록 렌더링
2. 상태 아이콘 표시
3. 실시간 상태 업데이트 구독

### Phase 3: Toggle & Interaction
1. 활성화/비활성화 토글
2. 에러 처리 및 롤백
3. 토스트 알림

### Phase 4: Tools & Settings
1. 서버 확장/축소 (도구 목록)
2. 설정 바로가기

### Phase 5: Polish
1. 스타일링 완성
2. 번역 추가
3. Edge case 처리

## Testing Checklist

- [ ] 아이콘 클릭 시 패널 열림
- [ ] 패널 외부 클릭 시 닫힘
- [ ] 아이콘 재클릭 시 닫힘
- [ ] 서버 목록 정확히 표시
- [ ] 연결 상태 아이콘 정확함
- [ ] 토글 클릭 시 상태 변경
- [ ] 토글 에러 시 롤백 + 알림
- [ ] 서버 클릭 시 확장
- [ ] 도구 목록 표시
- [ ] 설정 바로가기 동작
- [ ] 빈 상태 메시지 표시
- [ ] ESC 키로 패널 닫기

## API Reference

### McpToolsPanel

```typescript
class McpToolsPanel {
  constructor(
    containerEl: HTMLElement,
    plugin: NoteSagePlugin,
    mcpServerManager: McpServerManager
  );

  open(): void;
  close(): void;
  toggle(): void;
  destroy(): void;
}
```

### Event Hooks

```typescript
// ChatView.ts에서 연결
iconEl.addEventListener('click', (e) => {
  e.stopPropagation();
  this.mcpToolsPanel.toggle();
});
```

## CSS Classes

| Class | Purpose |
|-------|---------|
| `.sage-mcp-panel` | 패널 컨테이너 |
| `.sage-mcp-panel-header` | 패널 헤더 |
| `.sage-mcp-panel-list` | 서버 목록 컨테이너 |
| `.sage-mcp-panel-item` | 개별 서버 항목 |
| `.sage-mcp-panel-item--expanded` | 확장된 서버 항목 |
| `.sage-mcp-panel-tools` | 도구 목록 컨테이너 |
| `.sage-mcp-panel-empty` | 빈 상태 메시지 |
| `.sage-mcp-panel-settings` | 설정 바로가기 |
