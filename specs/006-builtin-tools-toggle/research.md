# Research: Built-in Tools Toggle

**Feature**: 001-builtin-tools-toggle
**Date**: 2025-12-28

## Research Questions

### Q1: How to disable built-in tools in Claude Agent SDK?

**Decision**: Use the `disallowedTools` option in the query options

**Rationale**:
- The Claude Agent SDK `query()` function accepts `disallowedTools` as an array of tool names
- This is the inverse of `allowedTools` - it explicitly blocks specific tools
- More suitable for our use case because we want to disable specific tools while keeping others

**Evidence**:
```typescript
// From claude-code-action documentation
disallowed_tools: "WebSearch,WebFetch"

// From CLI usage
claude --disallowedTools "WebSearch,WebFetch"

// From SDK usage pattern
query({
  prompt: "...",
  options: {
    disallowedTools: ["WebSearch", "WebFetch"]
  }
})
```

**Alternatives Considered**:
1. `allowedTools` - Would require listing all allowed tools; more complex and error-prone
2. `canUseTool` hook - More complex, intended for dynamic permission checks, not static disabling

---

### Q2: What are all the built-in tools that can be toggled?

**Decision**: Document all 15 built-in tools; implement toggles for WebSearch and WebFetch first

**Rationale**:
- User's primary concern is WebSearch and WebFetch conflicting with MCP alternatives
- Other tools can be added in future iterations based on feedback

**Evidence** (from SDK GitHub issues):
```text
Available tools: [
  'Task', 'Bash',
  'Glob', 'Grep',
  'ExitPlanMode', 'Read',
  'Edit', 'Write',
  'NotebookEdit', 'WebFetch',
  'TodoWrite', 'WebSearch',
  'BashOutput', 'KillShell',
  'SlashCommand'
]
```

**Tools for potential future toggles**:
| Tool | Reason for Toggle |
|------|-------------------|
| Bash | Security restrictions |
| Write/Edit | Read-only mode |
| Task | Disable subagents |
| NotebookEdit | Unused by many users |

---

### Q3: How to integrate with existing settings infrastructure?

**Decision**: Add `disabledBuiltinTools: string[]` to `NoteSageSettings` interface

**Rationale**:
- Consistent with existing pattern (e.g., `mcpServers: McpServerConfigEntry[]`)
- Simple array of tool names that are disabled
- Empty array = all tools enabled (backward compatible default)

**Implementation Pattern**:
```typescript
// types.ts
export interface NoteSageSettings {
  // ... existing fields
  disabledBuiltinTools?: string[];
}

export const DEFAULT_SETTINGS: NoteSageSettings = {
  // ... existing defaults
  disabledBuiltinTools: []  // All enabled by default
};
```

---

### Q4: How to pass disallowedTools to the SDK?

**Decision**: Add to `buildQueryOptions()` in AgentService.ts

**Rationale**:
- Central location for all SDK query options
- Already handles model, MCP servers, system prompt, etc.

**Implementation Pattern**:
```typescript
// AgentService.ts - buildQueryOptions method
private buildQueryOptions(...): Record<string, unknown> {
  const options: Record<string, unknown> = {
    // ... existing options
  };

  // Add disallowed built-in tools
  if (this.settings.disabledBuiltinTools?.length) {
    options.disallowedTools = this.settings.disabledBuiltinTools;
  }

  return options;
}
```

---

## Summary

| Question | Decision | Confidence |
|----------|----------|------------|
| How to disable tools | `disallowedTools` option | High |
| Which tools to toggle | WebSearch, WebFetch (Phase 1) | High |
| Settings structure | `disabledBuiltinTools: string[]` | High |
| SDK integration point | `buildQueryOptions()` method | High |

All research questions resolved. Ready for Phase 1 design.
