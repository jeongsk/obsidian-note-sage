# Data Model: Built-in Tools Toggle

**Feature**: 001-builtin-tools-toggle
**Date**: 2025-12-28

## Entity Changes

### NoteSageSettings (Extended)

**Location**: `src/types.ts`

```typescript
export interface NoteSageSettings {
  // ... existing fields (apiKey, model, debugContext, etc.)

  /**
   * List of built-in tool names that are disabled.
   * Empty array means all tools are enabled.
   * Example: ['WebSearch', 'WebFetch']
   */
  disabledBuiltinTools?: string[];
}
```

### DEFAULT_SETTINGS (Extended)

**Location**: `src/types.ts`

```typescript
export const DEFAULT_SETTINGS: NoteSageSettings = {
  // ... existing defaults
  disabledBuiltinTools: []  // All enabled by default for backward compatibility
};
```

## Constants

### TOGGLEABLE_BUILTIN_TOOLS

**Location**: `src/types.ts`

```typescript
/**
 * Built-in tools that can be toggled by the user.
 * Phase 1: WebSearch, WebFetch only.
 * Future phases may add: Bash, Write, Edit, Task, NotebookEdit
 */
export const TOGGLEABLE_BUILTIN_TOOLS = [
  {
    name: 'WebSearch',
    labelKey: 'settings.builtinTools.webSearch',
    descriptionKey: 'settings.builtinTools.webSearchDesc'
  },
  {
    name: 'WebFetch',
    labelKey: 'settings.builtinTools.webFetch',
    descriptionKey: 'settings.builtinTools.webFetchDesc'
  }
] as const;

export type ToggleableBuiltinTool = typeof TOGGLEABLE_BUILTIN_TOOLS[number]['name'];
```

## State Transitions

```
┌─────────────┐     User toggles off      ┌──────────────┐
│   Enabled   │ ────────────────────────► │   Disabled   │
│ (default)   │                           │              │
└─────────────┘ ◄──────────────────────── └──────────────┘
                    User toggles on
```

## Data Flow

```
User Action                 Settings Storage              SDK Query
───────────                 ────────────────              ─────────

Toggle OFF WebSearch  ──►  disabledBuiltinTools:    ──►  disallowedTools:
                           ['WebSearch']                  ['WebSearch']

Toggle OFF WebFetch   ──►  disabledBuiltinTools:    ──►  disallowedTools:
                           ['WebSearch', 'WebFetch']     ['WebSearch', 'WebFetch']

Toggle ON WebSearch   ──►  disabledBuiltinTools:    ──►  disallowedTools:
                           ['WebFetch']                   ['WebFetch']
```

## Persistence Format

**File**: `.obsidian/plugins/obsidian-note-sage/data.json`

```json
{
  "apiKey": "...",
  "model": "claude-sonnet-4-5",
  "debugContext": false,
  "disabledBuiltinTools": ["WebSearch", "WebFetch"]
}
```

## Validation Rules

1. `disabledBuiltinTools` must be an array of strings
2. Tool names must be valid (from TOGGLEABLE_BUILTIN_TOOLS)
3. Duplicate entries are ignored
4. Unknown tool names are preserved but ignored (forward compatibility)

## Migration Strategy

**From**: Existing settings without `disabledBuiltinTools`
**To**: Settings with `disabledBuiltinTools: []`

No migration needed - missing field defaults to empty array via `DEFAULT_SETTINGS`.
