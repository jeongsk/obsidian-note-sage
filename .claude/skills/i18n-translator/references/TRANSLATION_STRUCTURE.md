# Translation Structure Reference

Note Sage 플러그인의 번역 구조 상세 문서입니다.

## 파일 위치

모든 번역 파일은 `src/i18n/locales/` 디렉토리에 있습니다:

```
src/i18n/
├── index.ts                 # i18n 코어 모듈
└── locales/
    ├── en.ts               # English (기준, 인터페이스 정의)
    ├── ko.ts               # 한국어
    ├── ja.ts               # 日本語
    ├── es.ts               # Español
    ├── fr.ts               # Français
    ├── de.ts               # Deutsch
    ├── pt.ts               # Português
    ├── zh.ts               # 简体中文
    ├── ar.ts               # العربية (RTL)
    ├── ru.ts               # Русский
    └── hi.ts               # हिन्दी
```

## 인터페이스 구조

### 최상위 인터페이스: TranslationKeys

```typescript
export interface TranslationKeys {
  // 기본 문자열
  appTitle: string;
  examples: string;
  pluginSettings: string;
  newChat: string;
  selectModel: string;

  // 중첩 객체
  quickAction: QuickActionTranslations;
  commands: CommandsTranslations;
  prompts: PromptsTranslations;
  settings: SettingsTranslations;

  // 채팅 관련
  currentPage: string;
  addCurrentPageContext: string;
  inputPlaceholder: string;
  sendMessage: string;
  cancelProcessing: string;

  // 컨텍스트
  currentFile: string;
  selectedText: string;
  fileContent: string;
  truncated: string;
  charactersOmitted: string;

  // 오류
  vaultPathError: string;
  executionCancelled: string;
  error: string;
  errorRenderingMessage: string;

  // 메시지 상태
  cooking: string;
  thinking: string;
  toolResult: string;
  usingTool: string;
  noContent: string;
  system: string;

  // UI
  tasks: string;
  copy: string;
  copied: string;
  copyFailed: string;
  user: string;
  assistant: string;
  result: string;
  duration: string;
  aiChatTitle: string;
}
```

### QuickActionTranslations

빠른 액션 버튼 텍스트:

```typescript
interface QuickActionTranslations {
  summarize: string;       // 버튼 라벨
  summarizePrompt: string; // 실제 프롬프트
  improve: string;
  improvePrompt: string;
  analyze: string;
  analyzePrompt: string;
  translate: string;
  translatePrompt: string;
}
```

### CommandsTranslations

Obsidian 명령어 팔레트:

```typescript
interface CommandsTranslations {
  openNoteSage: string;
  startNewChat: string;
  saveConversation: string;
  summarizeDocument: string;
  explainSelection: string;
  improveWriting: string;
  translateToKorean: string;
  translateToEnglish: string;
  reviewCode: string;
}
```

### SettingsTranslations

설정 탭 (가장 큰 섹션):

```typescript
interface SettingsTranslations {
  // API Key
  apiKey: string;
  apiKeyDesc: string;
  apiKeyPlaceholder: string;

  // Model
  model: string;
  modelDesc: string;

  // Claude CLI
  claudeCli: string;
  claudeCliAdvanced: string;
  claudeCliPath: string;
  claudeCliPathDesc: string;
  claudeCliPathPlaceholder: string;
  claudeCliPathInfo: string;

  // Debug
  debugMode: string;
  debugModeDesc: string;

  // File Context
  fileContext: string;
  includeFileContent: string;
  includeFileContentDesc: string;
  preferSelectedText: string;
  preferSelectedTextDesc: string;
  maxContentLength: string;
  maxContentLengthDesc: string;

  // System Prompt
  systemPrompt: string;
  customSystemPrompt: string;
  customSystemPromptDesc: string;
  customSystemPromptPlaceholder: string;

  // Conversation Saving
  conversationSaving: string;
  autoSave: string;
  autoSaveDesc: string;
  savePath: string;
  savePathDesc: string;

  // Language
  language: string;
  languageDesc: string;
  languageAuto: string;

  // Quick Actions
  quickActions: string;
  quickActionsDesc: string;
  customPromptPlaceholder: string;
  resetToDefault: string;

  // Plugin Tools
  pluginTools: string;
  pluginToolsDesc: string;

  // 중첩 객체
  builtinTools: BuiltinToolsTranslations;
  agentOptions: AgentOptionsTranslations;
  mcp: McpSettingsTranslations;

  // About
  about: string;
  aboutText1: string;
  aboutText2: string;
}
```

### BuiltinToolsTranslations

내장 도구 설정:

```typescript
interface BuiltinToolsTranslations {
  title: string;
  description: string;
  webSearch: string;
  webSearchDesc: string;
  webFetch: string;
  webFetchDesc: string;
}
```

### AgentOptionsTranslations

Agent SDK 옵션:

```typescript
interface AgentOptionsTranslations {
  title: string;
  description: string;
  maxTurns: string;
  maxTurnsDesc: string;
  maxTurnsPlaceholder: string;
  maxBudgetUsd: string;
  maxBudgetUsdDesc: string;
  maxBudgetUsdPlaceholder: string;
  enableExtendedThinking: string;
  enableExtendedThinkingDesc: string;
  maxThinkingTokens: string;
  maxThinkingTokensDesc: string;
  permissionMode: {
    title: string;
    description: string;
    bypassPermissions: string;
    bypassPermissionsDesc: string;
    acceptEdits: string;
    acceptEditsDesc: string;
    default: string;
    defaultDesc: string;
    plan: string;
    planDesc: string;
  };
  costDisplay: string;        // 변수 포함: ${cost}
  costLimitReached: string;
  turnLimitReached: string;
}
```

### McpSettingsTranslations

MCP 서버 설정 (가장 긴 섹션):

```typescript
interface McpSettingsTranslations {
  title: string;
  description: string;
  addServer: string;
  editServer: string;
  deleteServer: string;
  deleteConfirm: string;
  serverName: string;
  serverNamePlaceholder: string;
  serverType: string;
  typeStdio: string;
  typeSse: string;
  typeHttp: string;
  command: string;
  commandPlaceholder: string;
  args: string;
  argsPlaceholder: string;
  env: string;
  envPlaceholder: string;
  url: string;
  urlPlaceholder: string;
  headers: string;
  headersPlaceholder: string;
  enabled: string;
  save: string;
  cancel: string;
  duplicateName: string;
  invalidJson: string;
  statusConnected: string;
  statusFailed: string;
  statusPending: string;
  statusNeedsAuth: string;
  noServers: string;
  commandNotFound: string;
  commandNotFoundDesc: string;   // 변수 포함: {command}
  commandValidating: string;
  // 패널 번역
  panelTitle: string;
  panelNoServers: string;
  panelNoServersDesc: string;
  panelOpenSettings: string;
  panelToolsNotConnected: string;
  panelToolsCount: string;       // 변수 포함: {count}
  panelToggleError: string;
  deleteError: string;
  saveError: string;
}
```

## 변수가 포함된 문자열

일부 번역에는 런타임에 치환되는 변수가 있습니다:

```typescript
// ${변수} 형식
costDisplay: 'Session cost: ${cost}'

// {변수} 형식
commandNotFoundDesc: 'The command "{command}" could not be found...'
panelToolsCount: '{count} tools'
```

**참고:** 변수 형식이 다르므로 번역 시 원본 형식을 그대로 유지해야 합니다.

## 언어별 고려사항

### 아랍어 (ar) - RTL

```typescript
// src/i18n/index.ts
export function isRtlLanguage(): boolean {
  return getEffectiveLanguage() === 'ar';
}

export function getTextDirection(): 'ltr' | 'rtl' {
  return isRtlLanguage() ? 'rtl' : 'ltr';
}
```

UI에서 RTL 지원을 위해 `dir="rtl"` 속성을 적용해야 합니다.

### 문자열 길이

언어별로 동일한 의미의 텍스트 길이가 다릅니다:

| 언어 | 특징 |
|------|------|
| 영어 | 기준 |
| 독일어 | 보통 10-20% 더 김 |
| 중국어/일본어 | 보통 더 짧음 |
| 아랍어 | 다이어크리틱으로 추가 공간 필요 |

UI 레이아웃 시 여유 공간을 확보하세요.

## 새 언어 추가 절차

1. `src/i18n/locales/XX.ts` 파일 생성
2. `en.ts`에서 `TranslationKeys` 타입 import
3. 모든 키에 대한 번역 작성
4. `src/i18n/index.ts`에서:
   - 새 언어 파일 import
   - `translations` 객체에 추가
   - `AVAILABLE_LANGUAGES` 배열에 추가

```typescript
// src/i18n/index.ts
import { vi } from './locales/vi';

const translations: Record<string, TranslationKeys> = {
  // ... 기존 언어
  vi: vi,
};

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  // ... 기존 언어
  { value: 'vi', label: 'Tiếng Việt', direction: 'ltr' },
];
```
