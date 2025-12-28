# Data Model: Agent Options

**Date**: 2025-12-28
**Feature**: Agent Options (001-agent-options)

## Entity Definitions

### 1. NoteSageSettings (확장)

기존 `NoteSageSettings` 인터페이스에 새 필드 추가:

```typescript
interface NoteSageSettings {
    // ... 기존 필드들 ...

    // Agent Options - 새로 추가
    maxTurns?: number;              // 최대 대화 턴 수 (1-100, 0=무제한)
    maxBudgetUsd?: number;          // 최대 비용 한도 USD (0.01-100.00, 0=무제한)
    enableExtendedThinking?: boolean; // Extended Thinking 활성화
    maxThinkingTokens?: number;     // 최대 사고 토큰 수 (1000-100000)
    permissionMode?: PermissionMode; // 권한 모드
}
```

### 2. PermissionMode (새 타입)

```typescript
type PermissionMode = 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan';
```

### 3. AGENT_OPTIONS_DEFAULTS (새 상수)

```typescript
const AGENT_OPTIONS_DEFAULTS = {
    maxTurns: 0,                    // 0 = 무제한
    maxBudgetUsd: 0,                // 0 = 무제한
    enableExtendedThinking: false,
    maxThinkingTokens: 10000,
    permissionMode: 'bypassPermissions' as PermissionMode,
} as const;
```

### 4. AGENT_OPTIONS_LIMITS (새 상수)

```typescript
const AGENT_OPTIONS_LIMITS = {
    maxTurns: { min: 0, max: 100 },
    maxBudgetUsd: { min: 0, max: 100 },
    maxThinkingTokens: { min: 1000, max: 100000 },
} as const;
```

---

## Field Specifications

### maxTurns

| 속성 | 값 |
|------|-----|
| 타입 | `number` |
| 범위 | 0 ~ 100 |
| 기본값 | 0 (무제한) |
| 검증 | 정수, 범위 내 |
| UI | 숫자 입력 필드 |
| 저장 | data.json |

### maxBudgetUsd

| 속성 | 값 |
|------|-----|
| 타입 | `number` |
| 범위 | 0 ~ 100 |
| 기본값 | 0 (무제한) |
| 검증 | 소수점 2자리까지, 범위 내 |
| UI | 숫자 입력 필드 ($ 접두사) |
| 표시 조건 | API 키가 설정된 경우만 |
| 저장 | data.json |

### enableExtendedThinking

| 속성 | 값 |
|------|-----|
| 타입 | `boolean` |
| 기본값 | false |
| UI | 토글 스위치 |
| 저장 | data.json |

### maxThinkingTokens

| 속성 | 값 |
|------|-----|
| 타입 | `number` |
| 범위 | 1,000 ~ 100,000 |
| 기본값 | 10,000 |
| 검증 | 정수, 범위 내 |
| UI | 슬라이더 또는 숫자 입력 |
| 표시 조건 | enableExtendedThinking이 true일 때만 |
| 저장 | data.json |

### permissionMode

| 속성 | 값 |
|------|-----|
| 타입 | `PermissionMode` |
| 허용값 | 'default', 'acceptEdits', 'bypassPermissions', 'plan' |
| 기본값 | 'bypassPermissions' |
| UI | 드롭다운 |
| 저장 | data.json |

---

## Validation Rules

### VR-001: maxTurns 범위 검증
```typescript
if (maxTurns !== undefined) {
    maxTurns = Math.max(0, Math.min(100, Math.floor(maxTurns)));
}
```

### VR-002: maxBudgetUsd 범위 검증
```typescript
if (maxBudgetUsd !== undefined) {
    maxBudgetUsd = Math.max(0, Math.min(100, Math.round(maxBudgetUsd * 100) / 100));
}
```

### VR-003: maxThinkingTokens 범위 검증
```typescript
if (maxThinkingTokens !== undefined) {
    maxThinkingTokens = Math.max(1000, Math.min(100000, Math.floor(maxThinkingTokens)));
}
```

### VR-004: permissionMode 허용값 검증
```typescript
const validModes = ['default', 'acceptEdits', 'bypassPermissions', 'plan'];
if (!validModes.includes(permissionMode)) {
    permissionMode = 'bypassPermissions';
}
```

---

## State Transitions

### Extended Thinking 토글

```
enableExtendedThinking: false
    │
    ▼ 사용자가 토글 ON
enableExtendedThinking: true
    │
    ▼ maxThinkingTokens 슬라이더 표시
    │
    ▼ 사용자가 토글 OFF
enableExtendedThinking: false
    │
    ▼ maxThinkingTokens 슬라이더 숨김 (값은 유지)
```

### API 키 조건부 UI

```
apiKey: undefined 또는 ''
    │
    ▼ 비용 관련 UI 숨김
    │
apiKey: 'sk-...' (값 있음)
    │
    ▼ 비용 관련 UI 표시
        - maxBudgetUsd 입력 필드
        - 세션 비용 표시
```

---

## Migration

### 기존 설정과의 호환성

새 필드들은 모두 optional이며 기본값이 정의되어 있어 별도 마이그레이션 불필요.

```typescript
// DEFAULT_SETTINGS 확장
export const DEFAULT_SETTINGS: NoteSageSettings = {
    // ... 기존 기본값들 ...

    // Agent Options 기본값 추가
    maxTurns: 0,
    maxBudgetUsd: 0,
    enableExtendedThinking: false,
    maxThinkingTokens: 10000,
    permissionMode: 'bypassPermissions',
};
```
