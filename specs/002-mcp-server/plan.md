# Implementation Plan: MCP Server Integration

**Branch**: `001-mcp-server` | **Date**: 2025-12-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mcp-server/spec.md`

## Summary

MCP(Model Context Protocol) 서버 통합 기능을 통해 사용자가 Obsidian 설정 화면에서 외부 MCP 서버(stdio, SSE, HTTP 타입)를 등록하고 관리할 수 있게 합니다. 등록된 서버는 Claude Agent SDK에 전달되어 커스텀 도구를 사용할 수 있습니다.

## Technical Context

**Language/Version**: TypeScript 5.7+ (기존 프로젝트와 동일)
**Primary Dependencies**: @anthropic-ai/claude-agent-sdk ^0.1.5, Obsidian API, Zod ^4.2.1
**Storage**: Obsidian 플러그인 설정 (JSON, data.json)
**Testing**: 수동 테스트 (Obsidian 플러그인 환경)
**Target Platform**: Obsidian Desktop (Node.js 18+, macOS/Windows/Linux)
**Project Type**: Single (Obsidian 플러그인)
**Performance Goals**: MCP 서버 연결 상태 5초 이내 UI 반영
**Constraints**: 30초 연결 타임아웃, Obsidian 플러그인 API 제약
**Scale/Scope**: 최대 10개 MCP 서버 동시 등록 지원

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

프로젝트 constitution이 템플릿 상태이므로 기본 원칙을 적용합니다:
- ✅ 기존 코드 패턴 준수 (SettingsTab.ts, types.ts 구조 활용)
- ✅ 기존 AgentService.ts의 mcpServers 지원 활용
- ✅ 국제화 지원 (i18n 시스템 사용)
- ✅ 최소 변경 원칙 (필요한 파일만 수정)

## Project Structure

### Documentation (this feature)

```text
specs/001-mcp-server/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - internal plugin)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── main.ts              # Plugin entry point (수정: MCP 서버 초기화)
├── AgentService.ts      # Claude Agent SDK 통합 (기존 mcpServers 지원 활용)
├── ChatView.ts          # Chat UI (수정: MCP 상태 아이콘 추가)
├── SettingsTab.ts       # Settings UI (수정: MCP 서버 관리 섹션 추가)
├── types.ts             # Type definitions (수정: MCP 설정 타입 추가)
├── i18n/                # Internationalization
│   └── index.ts         # (수정: MCP 관련 번역 키 추가)
└── mcp/                 # NEW: MCP 서버 관련 모듈
    ├── McpServerManager.ts  # MCP 서버 상태 관리
    └── McpSettingsUI.ts     # MCP 설정 UI 컴포넌트

styles.css               # (수정: MCP 상태 아이콘 스타일 추가)
```

**Structure Decision**: 기존 src/ 구조를 유지하면서 MCP 관련 로직을 src/mcp/ 하위 모듈로 분리합니다. 이는 코드 응집성을 높이고 향후 유지보수를 용이하게 합니다.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 새 디렉토리 (src/mcp/) | MCP 관련 로직 분리 | 단일 파일로 구현 시 SettingsTab.ts가 과도하게 커짐 |
