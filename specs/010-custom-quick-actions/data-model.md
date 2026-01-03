# Data Model: Custom Quick Actions

**Feature**: 010-custom-quick-actions  
**Date**: 2025-01-03

## Entities

### CustomQuickAction

사용자가 생성한 커스텀 빠른 액션을 나타냅니다.

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | `string` | Yes | 고유 식별자 (UUID) | `crypto.randomUUID()` 생성 |
| `name` | `string` | Yes | 버튼에 표시될 라벨 | 비어있지 않음, `trim()` 적용 |
| `prompt` | `string` | Yes | 클릭 시 전송될 프롬프트 | 비어있지 않음 |
| `enabled` | `boolean` | Yes | 활성화 상태 | 기본값: `true` |
| `order` | `number` | Yes | 표시 순서 (0-based) | 정수, >= 0 |

### TypeScript Interface

```typescript
/**
 * 사용자 정의 빠른 액션
 * 사용자가 생성한 커스텀 프롬프트 버튼
 */
export interface CustomQuickAction {
  /** 고유 식별자 (UUID) */
  id: string;
  
  /** 버튼에 표시될 이름 */
  name: string;
  
  /** 클릭 시 전송될 프롬프트 */
  prompt: string;
  
  /** 활성화 상태 (채팅 뷰에 표시 여부) */
  enabled: boolean;
  
  /** 표시 순서 (0부터 시작, 낮을수록 앞에 표시) */
  order: number;
}
```

## Settings Extension

### NoteSageSettings 확장

```typescript
export interface NoteSageSettings {
  // ... 기존 필드 ...
  
  /** 사용자 정의 빠른 액션 목록 */
  customQuickActions?: CustomQuickAction[];
}
```

### DEFAULT_SETTINGS 확장

```typescript
export const DEFAULT_SETTINGS: NoteSageSettings = {
  // ... 기존 기본값 ...
  
  // 커스텀 빠른 액션 기본값 (빈 배열)
  customQuickActions: [],
};
```

## Relationships

```
NoteSageSettings
    │
    ├── quickActions: QuickActionConfig[]     # 기본 4개 액션 설정
    │       └── { id, enabled, customPrompt }
    │
    └── customQuickActions: CustomQuickAction[] # 사용자 정의 액션
            └── { id, name, prompt, enabled, order }
```

## State Transitions

### CustomQuickAction Lifecycle

```
[생성] → enabled: true, order: (마지막 + 1)
   │
   ├── [비활성화] → enabled: false
   │       │
   │       └── [활성화] → enabled: true
   │
   ├── [수정] → name, prompt 업데이트
   │
   ├── [순서 변경] → order 재계산
   │
   └── [삭제] → 배열에서 제거, 나머지 order 재계산
```

### Order 관리

순서 변경 시 다른 액션들의 `order` 값도 조정:

```typescript
// 위로 이동 (order 감소)
function moveUp(id: string): void {
  const actions = [...settings.customQuickActions];
  const index = actions.findIndex(a => a.id === id);
  if (index > 0) {
    [actions[index - 1], actions[index]] = [actions[index], actions[index - 1]];
    actions.forEach((a, i) => a.order = i);
  }
}

// 아래로 이동 (order 증가)
function moveDown(id: string): void {
  const actions = [...settings.customQuickActions];
  const index = actions.findIndex(a => a.id === id);
  if (index < actions.length - 1) {
    [actions[index], actions[index + 1]] = [actions[index + 1], actions[index]];
    actions.forEach((a, i) => a.order = i);
  }
}
```

## Validation Rules

| Rule | Description | Error Handling |
|------|-------------|----------------|
| 이름 필수 | `name.trim().length > 0` | 저장 버튼 비활성화 |
| 프롬프트 필수 | `prompt.trim().length > 0` | 저장 버튼 비활성화 |
| ID 고유성 | 동일 ID 없음 | UUID 자동 생성으로 보장 |
| 순서 정수 | `order >= 0` | 배열 인덱스로 자동 관리 |

## Data Migration

이전 버전에서 `customQuickActions` 필드가 없는 경우:

```typescript
// main.ts - loadSettings()
async loadSettings() {
  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  
  // customQuickActions가 undefined면 빈 배열로 초기화
  if (!this.settings.customQuickActions) {
    this.settings.customQuickActions = [];
  }
}
```

## Storage Location

Obsidian 플러그인 데이터로 저장:
- 경로: `[vault]/.obsidian/plugins/obsidian-note-sage/data.json`
- 형식: JSON
- 저장 시점: 설정 변경 즉시 (`plugin.saveSettings()`)
