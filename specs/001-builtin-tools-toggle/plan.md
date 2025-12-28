# Implementation Plan: Built-in Tools Toggle

**Branch**: `001-builtin-tools-toggle` | **Date**: 2025-12-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-builtin-tools-toggle/spec.md`

## Summary

Enable users to toggle built-in Claude Agent SDK tools (WebSearch, WebFetch) on/off via plugin settings. When disabled, these tools are excluded from the SDK's available tool set using the `disallowedTools` option, allowing MCP server alternatives to be used exclusively.

## Technical Context

**Language/Version**: TypeScript 5.9+
**Primary Dependencies**: @anthropic-ai/claude-agent-sdk ^0.1.76, Obsidian API
**Storage**: Obsidian plugin data.json (via `this.plugin.saveSettings()`)
**Testing**: Vitest
**Target Platform**: Obsidian Desktop (macOS, Windows, Linux)
**Project Type**: Single project (Obsidian plugin)
**Performance Goals**: No measurable impact on chat response time (<5% variance)
**Constraints**: Settings must persist across Obsidian restarts; backward compatible with existing configs
**Scale/Scope**: 2 toggleable tools (WebSearch, WebFetch) in initial implementation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution template is not customized for this project. Applying standard principles:

| Principle | Status | Notes |
|-----------|--------|-------|
| Simplicity | ✅ PASS | Minimal change: 2 new settings fields, ~50 lines code |
| Testability | ✅ PASS | Unit tests for settings serialization, integration test for SDK options |
| Backward Compatibility | ✅ PASS | Default enabled maintains existing behavior |
| No Over-engineering | ✅ PASS | Only implementing requested WebSearch/WebFetch toggles |

## Project Structure

### Documentation (this feature)

```text
specs/001-builtin-tools-toggle/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── types.ts              # NoteSageSettings interface (add disabledBuiltinTools)
├── AgentService.ts       # buildQueryOptions (add disallowedTools logic)
├── SettingsTab.ts        # Add toggle UI for built-in tools
└── main.ts               # No changes expected

tests/
└── unit/
    └── builtin-tools-toggle.test.ts  # New test file
```

**Structure Decision**: Existing single-project Obsidian plugin structure. Changes are isolated to 3 files (types.ts, AgentService.ts, SettingsTab.ts) plus new test file.

## Complexity Tracking

No constitution violations. Feature is minimal and focused.
