# CLAUDE.md

Note Sage 코드베이스 작업을 위한 AI 어시스턴트 가이드.

## Project Overview

**Note Sage**는 Obsidian에서 Claude AI와 직접 대화할 수 있는 플러그인. Claude Agent SDK를 사용하여 우측 사이드바에 AI 채팅 인터페이스 제공.

### Key Features
- AI 채팅 인터페이스 (실시간 스트리밍)
- @ 멘션으로 파일/폴더 컨텍스트 추가
- MCP 서버 통합 (자동 명령어 탐지)
- Agent Options: maxTurns, budget, Extended Thinking, permissionMode
- Built-in Tools Toggle (WebSearch, WebFetch)
- Quick Action 버튼
- 11개 언어 i18n 지원
- 대화 자동 저장 및 세션 관리

## Tech Stack

- TypeScript 5.9+ + Obsidian API
- @anthropic-ai/claude-agent-sdk ^0.1.76
- TailwindCSS 3.4.19 (`tw-` prefix, no preflight)
- Vitest for testing
- Node.js >=22.0.0

## Codebase Structure

```
obsidian-note-sage/
├── src/
│   ├── main.ts              # 플러그인 진입점
│   ├── AgentService.ts      # Claude SDK 통합
│   ├── ChatView.ts          # 채팅 UI (ItemView)
│   ├── ChatRenderer.ts      # 메시지 렌더링
│   ├── MessageFactory.ts    # 메시지 생성
│   ├── SettingsTab.ts       # 설정 UI
│   ├── types.ts             # 타입 정의
│   ├── constants.ts         # 상수
│   ├── i18n/                # 11개 언어 지원
│   │   ├── index.ts
│   │   └── locales/*.ts
│   ├── mcp/                 # MCP 서버 관리
│   │   ├── McpServerManager.ts
│   │   ├── McpSettingsUI.ts
│   │   └── McpToolsPanel.ts
│   ├── mention/             # @ 멘션 컨텍스트
│   │   ├── MentionService.ts
│   │   ├── MentionInput.ts
│   │   └── AutocompletePopup.ts
│   ├── tools/               # 플러그인 도구
│   │   └── ObsidianPluginTools.ts
│   └── styles/
│       └── main.css         # Tailwind 소스
├── tailwind.config.js
├── esbuild.config.mjs
└── styles.css               # 생성됨 (수정 금지)
```

## Architecture

### Data Flow
```
User Input → ChatView → AgentService → Claude SDK → Streaming → ChatView
```

### Key Modules

| 모듈 | 역할 |
|------|------|
| AgentService | SDK 래퍼, 세션/취소 관리 |
| ChatView | Obsidian ItemView, UI 라이프사이클 |
| McpServerManager | MCP 서버 상태, SDK 설정 변환 |
| MentionService | 파일/폴더 검색, 컨텍스트 생성 |
| i18n | 번역 함수 `t()`, RTL 지원 |

### Settings (src/types.ts)
`NoteSageSettings`: apiKey, model, mcpServers[], disabledBuiltinTools[], maxTurns, maxBudgetUsd, enableExtendedThinking, permissionMode, quickActions[] 등

## TailwindCSS Guidelines

### 설정
- Config: `tailwind.config.js` (prefix: `tw-`, preflight: false)
- Source: `src/styles/main.css`
- Build: PostCSS + Tailwind (esbuild.config.mjs)

### Obsidian 색상 매핑
`obs-*` 색상은 Obsidian CSS 변수에 매핑:
- `tw-bg-obs-bg` → `var(--background-primary)`
- `tw-text-obs-text` → `var(--text-normal)`
- `tw-border-obs-border` → `var(--background-modifier-border)`
- 전체 매핑: `tailwind.config.js` 참조

### 컴포넌트 패턴
`@layer components`에서 `@apply` 사용:
```css
.sage-component {
  @apply tw-flex tw-items-center tw-gap-2 tw-bg-obs-bg tw-rounded-obs;
}
```

### 규칙
1. 유틸리티 클래스: `tw-` 접두사 필수 (`tw-flex`, `tw-p-2`)
2. 컴포넌트 클래스: `sage-` 접두사 (`sage-button`, `sage-panel`)
3. 색상: Obsidian 매핑 색상(`obs-*`) 사용, raw Tailwind 색상 금지
4. Preflight 비활성화: Obsidian 기본 스타일 유지

## Obsidian CSS Variables 스타일링 규칙

### Typography 매핑

| 용도 | Tailwind 클래스 | Obsidian 변수 | 기본값 |
|------|----------------|---------------|--------|
| 가장 작은 텍스트 | `tw-text-obs-smallest` | `--font-smallest` | 0.8em |
| 작은 텍스트 | `tw-text-obs-smaller` | `--font-smaller` | 0.875em |
| 일반 작은 텍스트 | `tw-text-obs-small` | `--font-small` | 0.933em |
| UI 더 작은 텍스트 | `tw-text-obs-ui-smaller` | `--font-ui-smaller` | 12px |
| UI 작은 텍스트 | `tw-text-obs-ui-small` | `--font-ui-small` | 13px |
| UI 중간 텍스트 | `tw-text-obs-ui-medium` | `--font-ui-medium` | 15px |
| UI 큰 텍스트 | `tw-text-obs-ui-large` | `--font-ui-large` | - |
| UI 더 큰 텍스트 | `tw-text-obs-ui-larger` | `--font-ui-larger` | 20px |

### Font Family/Weight 매핑

| Tailwind 클래스 | Obsidian 변수 | 용도/값 |
|----------------|---------------|---------|
| `tw-font-obs-interface` | `--font-interface` | UI 요소 |
| `tw-font-obs-text` | `--font-text` | 본문 텍스트 |
| `tw-font-obs-mono` | `--font-monospace` | 코드, 고정폭 |
| `tw-font-obs-normal` | `--font-normal` | 400 |
| `tw-font-obs-medium` | `--font-medium` | 500 |
| `tw-font-obs-semibold` | `--font-semibold` | 600 |
| `tw-font-obs-bold` | `--font-bold` | 700 |

### Line Height 매핑

| Tailwind 클래스 | Obsidian 변수 | 값 | 용도 |
|----------------|---------------|-----|------|
| `tw-leading-obs-normal` | `--line-height-normal` | 1.5 | 일반 텍스트 |
| `tw-leading-obs-tight` | `--line-height-tight` | 1.3 | 검색 결과, 트리 아이템 |

### 금지된 클래스 (사용 금지)

| 금지 클래스 | 대체 클래스 |
|------------|------------|
| `tw-text-xs` | `tw-text-obs-smallest` |
| `tw-text-sm` | `tw-text-obs-small` |
| `tw-text-lg` | `tw-text-obs-ui-large` |
| `tw-font-mono` | `tw-font-obs-mono` |
| `tw-font-semibold` | `tw-font-obs-semibold` |
| `tw-bg-white` | `tw-bg-obs-bg` 또는 CSS 변수 |
| `tw-text-red-500` | `tw-text-obs-text-error` |

### CSS에서 직접 사용 시

```css
/* ✅ 올바른 사용 */
.my-component {
  font-size: var(--font-small);
  line-height: var(--line-height-normal);
  font-weight: var(--font-medium);
  border-radius: var(--radius-s);
}

/* ❌ 잘못된 사용 */
.my-component {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  border-radius: 4px;
}
```

## Development

```bash
npm install          # 설치
npm run dev          # 개발 모드 (watch)
npm run build        # 프로덕션 빌드
npm run test         # 테스트 실행
```

### Testing in Obsidian
1. 플러그인 폴더를 vault의 `.obsidian/plugins/`에 심링크
2. Community Plugins에서 활성화
3. 코드 변경 후 Obsidian 리로드

## Code Conventions

### Naming
- **Classes/Interfaces**: PascalCase (`NoteSageView`, `ChatMessage`)
- **Methods/Functions**: camelCase (`handleSendMessage`)
- **Constants**: UPPER_SNAKE_CASE (`VIEW_TYPE_NOTE_SAGE`)
- **CSS Classes**: `sage-` prefix (`sage-chat-container`)

### TypeScript
- 명시적 타입 어노테이션 사용
- interfaces 선호 (object shapes)
- `readonly` 적극 활용
- async/await 선호, optional chaining (`?.`), nullish coalescing (`??`)

### Code Style
- Tabs for indentation
- Single quotes for strings
- No unused variables

## Common Tasks

### 새 설정 추가
1. `NoteSageSettings` 인터페이스 업데이트 (types.ts)
2. `DEFAULT_SETTINGS` 기본값 추가
3. `SettingsTab.ts`에 UI 컨트롤 추가

### 새 메시지 타입 추가
1. types.ts에 타입 정의
2. AgentService.convertSDKMessage() 핸들링
3. ChatView 렌더링 로직 추가
4. styles/main.css에 스타일 추가

## Debugging

1. 설정에서 "Debug mode" 활성화
2. Developer Console: `Cmd+Opt+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. 로그 출력: API 상태, 모델, 메시지 컨텍스트, 세션 ID

## Important Notes

### Security
- `bypassPermissions` 모드 사용 - 파일 읽기/쓰기/명령 실행 가능
- API 키는 플러그인 데이터에 저장 (암호화되지 않음)
- 프로덕션 사용 전 vault 백업 권장

### Desktop Only
`isDesktopOnly: true` - Node.js 및 파일 시스템 접근 필요

### Build Output
- `main.js` - 번들된 플러그인 코드 (수정 금지)
- `styles.css` - 생성된 CSS (수정 금지, src/styles/main.css 편집)

## Active Technologies
- TypeScript 5.9+ + Obsidian API, @anthropic-ai/claude-agent-sdk ^0.1.76, TailwindCSS 3.4.19 (001-skills-management)
- Obsidian Vault 파일 시스템 (`.claude/skills/` 디렉토리), 플러그인 데이터 (settings) (001-skills-management)
- TypeScript 5.9+ + Obsidian API, @anthropic-ai/claude-agent-sdk ^0.1.76, TailwindCSS 3.4.19 (`tw-` prefix) (009-extended-thinking-toggle)
- Obsidian Plugin Data (NoteSageSettings.enableExtendedThinking) (009-extended-thinking-toggle)
- Obsidian Plugin Data (`NoteSageSettings.customQuickActions`) (010-custom-quick-actions)

## Recent Changes
- 001-skills-management: Added TypeScript 5.9+ + Obsidian API, @anthropic-ai/claude-agent-sdk ^0.1.76, TailwindCSS 3.4.19
