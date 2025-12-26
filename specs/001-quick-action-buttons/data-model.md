# Data Model: Quick Action Buttons Customization

**Date**: 2025-12-26
**Feature**: 001-quick-action-buttons

## Entities

### QuickActionConfig

사용자 설정 가능한 빠른 액션 버튼의 구성 정보를 저장합니다.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | 고유 식별자 (예: 'summarize', 'improve', 'analyze', 'translate') |
| enabled | boolean | Yes | 버튼 활성화 여부 (기본값: true) |
| customPrompt | string \| undefined | No | 사용자 정의 프롬프트 (비어있으면 기본 프롬프트 사용) |

### QuickActionDefinition (Read-only)

빠른 액션 버튼의 정적 정의 정보입니다. 코드에 하드코딩되며 사용자가 수정할 수 없습니다.

| Field | Type | Description |
|-------|------|-------------|
| id | string | 고유 식별자 |
| icon | string | Obsidian 아이콘 이름 (예: 'file-text', 'edit') |
| labelKey | string | i18n 키 (예: 'quickAction.summarize') |
| promptKey | string | 기본 프롬프트 i18n 키 (예: 'quickAction.summarizePrompt') |

## Settings Structure Update

### NoteSageSettings (기존 인터페이스 확장)

```typescript
interface NoteSageSettings {
  // ... 기존 필드들 ...

  // Quick Actions 설정 (신규)
  quickActions?: QuickActionConfig[];
}
```

### DEFAULT_SETTINGS 확장

```typescript
const DEFAULT_SETTINGS: NoteSageSettings = {
  // ... 기존 기본값들 ...

  quickActions: [
    { id: 'summarize', enabled: true, customPrompt: undefined },
    { id: 'improve', enabled: true, customPrompt: undefined },
    { id: 'analyze', enabled: true, customPrompt: undefined },
    { id: 'translate', enabled: true, customPrompt: undefined },
  ],
};
```

## Static Definitions (코드 상수)

```typescript
const QUICK_ACTION_DEFINITIONS: QuickActionDefinition[] = [
  { id: 'summarize', icon: 'file-text', labelKey: 'quickAction.summarize', promptKey: 'quickAction.summarizePrompt' },
  { id: 'improve', icon: 'edit', labelKey: 'quickAction.improve', promptKey: 'quickAction.improvePrompt' },
  { id: 'analyze', icon: 'search', labelKey: 'quickAction.analyze', promptKey: 'quickAction.analyzePrompt' },
  { id: 'translate', icon: 'languages', labelKey: 'quickAction.translate', promptKey: 'quickAction.translatePrompt' },
];
```

## Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  SettingsTab    │────▶│ NoteSageSettings │────▶│  ChatView   │
│  (UI 입력)       │     │   (저장소)         │     │  (렌더링)    │
└─────────────────┘     └──────────────────┘     └─────────────┘
        │                        │                      │
        │  Toggle/Edit           │  persist()           │  filter enabled
        │  customPrompt          │                      │  get prompt
        ▼                        ▼                      ▼
  사용자 입력 ──────▶ JSON 저장 ──────▶ 버튼 표시/숨김 + 프롬프트 적용
```

## Validation Rules

| Rule | Description |
|------|-------------|
| ID Uniqueness | 각 QuickActionConfig의 id는 고유해야 함 |
| Valid ID | id는 QUICK_ACTION_DEFINITIONS에 정의된 값 중 하나여야 함 |
| Default Fallback | quickActions 배열이 없거나 일부 항목 누락 시 DEFAULT_SETTINGS에서 채움 |
| Empty Prompt | customPrompt가 빈 문자열이면 undefined와 동일하게 처리 (기본 프롬프트 사용) |

## Migration Notes

- 기존 사용자의 설정에는 `quickActions` 필드가 없음
- 플러그인 로드 시 `quickActions`가 undefined이면 DEFAULT_SETTINGS에서 복사
- 새로운 Quick Action이 추가되는 경우 (향후), 기존 설정에 해당 항목이 없으면 기본값으로 추가
