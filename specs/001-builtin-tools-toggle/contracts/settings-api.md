# Settings API Contract: Built-in Tools Toggle

**Feature**: 001-builtin-tools-toggle
**Date**: 2025-12-28

## Overview

This document defines the internal API contract for the built-in tools toggle feature. As an Obsidian plugin, there are no external REST/GraphQL APIs - all interactions are through the Obsidian Plugin API and internal TypeScript interfaces.

## Internal Contracts

### 1. Settings Interface Extension

**File**: `src/types.ts`

```typescript
interface NoteSageSettings {
  // ... existing fields

  /**
   * @description List of built-in tool names that are disabled
   * @default []
   * @example ['WebSearch', 'WebFetch']
   */
  disabledBuiltinTools?: string[];
}
```

### 2. AgentService Query Options

**File**: `src/AgentService.ts`

```typescript
// buildQueryOptions return type extension
interface QueryOptions {
  // ... existing options

  /**
   * @description Tools to exclude from the agent's available tool set
   * @optional Only included if disabledBuiltinTools is non-empty
   */
  disallowedTools?: string[];
}
```

### 3. Settings Tab UI Contract

**File**: `src/SettingsTab.ts`

```typescript
// New settings section for built-in tools
interface BuiltinToolToggle {
  toolName: string;       // 'WebSearch' | 'WebFetch'
  labelKey: string;       // i18n key for label
  descriptionKey: string; // i18n key for description
  enabled: boolean;       // Current toggle state
}
```

## Behavior Contracts

### Toggle State Synchronization

```
┌──────────────────┐         ┌─────────────────┐         ┌──────────────────┐
│   Settings UI    │ ──────► │  Plugin State   │ ──────► │   AgentService   │
│   (SettingsTab)  │         │  (data.json)    │         │   (Query Opts)   │
└──────────────────┘         └─────────────────┘         └──────────────────┘
     Toggle click           saveSettings()            buildQueryOptions()
```

### Invariants

1. **Backward Compatibility**: Missing `disabledBuiltinTools` field treated as `[]` (all enabled)
2. **Immediate Persistence**: Toggle changes saved immediately via `saveSettings()`
3. **Session Isolation**: Changes apply to next chat session, not current one
4. **No Reload Required**: Settings apply without Obsidian restart

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid tool name in settings | Ignored, logged if debug enabled |
| Settings load failure | Use DEFAULT_SETTINGS |
| SDK rejects disallowedTools | Log error, continue without restriction |

## Testing Contract

```typescript
// Unit test expectations
describe('Built-in Tools Toggle', () => {
  it('should add tool to disabledBuiltinTools when toggled off');
  it('should remove tool from disabledBuiltinTools when toggled on');
  it('should pass disallowedTools to SDK query options');
  it('should default to empty array for backward compatibility');
  it('should persist settings across sessions');
});
```
