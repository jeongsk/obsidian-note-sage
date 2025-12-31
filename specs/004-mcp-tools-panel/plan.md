# Implementation Plan: MCP Tools Panel

**Branch**: `002-mcp-tools-panel` | **Date**: 2025-12-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-mcp-tools-panel/spec.md`

## Summary

헤더의 MCP 플러그 아이콘을 클릭 가능하게 변경하여 드롭다운 패널을 표시합니다. 패널에서는 연결된 MCP 서버 목록, 상태 확인, 활성화/비활성화 토글, 도구 목록 확인, 설정 바로가기 기능을 제공합니다. 기존 `McpServerManager`와 `McpSettingsUI`를 활용하여 새로운 `McpToolsPanel` UI 컴포넌트를 구현합니다.

## Technical Context

**Language/Version**: TypeScript 5.7+
**Primary Dependencies**: Obsidian API, @anthropic-ai/claude-agent-sdk ^0.1.5
**Storage**: Obsidian Plugin Settings (data.json)
**Testing**: Manual testing (Obsidian 플러그인 환경)
**Target Platform**: Obsidian Desktop (macOS, Windows, Linux)
**Project Type**: Single (Obsidian Plugin)
**Performance Goals**: 패널 열기/닫기 100ms 이내, 토글 반영 1초 이내
**Constraints**: Obsidian API 호환성, 기존 UI 패턴 준수
**Scale/Scope**: 최대 10-20개 MCP 서버 목록 표시

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution 파일이 템플릿 상태이므로 별도 게이트 적용 없음. 기존 프로젝트 패턴을 따릅니다:
- ✅ 기존 코드 구조 준수 (src/mcp/, src/ChatView.ts 패턴)
- ✅ 기존 CSS 네이밍 규칙 준수 (sage- prefix)
- ✅ 기존 타입 정의 패턴 준수 (src/types.ts)
- ✅ 기존 i18n 패턴 준수 (src/i18n/)

## Project Structure

### Documentation (this feature)

```text
specs/002-mcp-tools-panel/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - 내부 UI 컴포넌트)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── mcp/
│   ├── McpServerManager.ts    # 기존 - 상태 관리
│   ├── McpSettingsUI.ts       # 기존 - 설정 페이지 UI
│   └── McpToolsPanel.ts       # 신규 - 헤더 드롭다운 패널 UI
├── ChatView.ts                # 수정 - 아이콘 클릭 핸들러 추가
├── types.ts                   # 수정 - Tool 타입 추가 (필요시)
└── i18n/
    └── locales/
        ├── en.ts              # 수정 - 패널 번역 추가
        └── ko.ts              # 수정 - 패널 번역 추가

styles.css                     # 수정 - 패널 스타일 추가
```

**Structure Decision**: 기존 `src/mcp/` 디렉토리에 `McpToolsPanel.ts` 신규 파일 추가. 기존 `McpServerManager`의 상태 관리와 이벤트 시스템을 활용.

## Complexity Tracking

해당 없음 - 기존 아키텍처 내에서 단순 UI 확장

