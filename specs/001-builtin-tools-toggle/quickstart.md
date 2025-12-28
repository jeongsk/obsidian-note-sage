# Quickstart: Built-in Tools Toggle

**Feature**: 001-builtin-tools-toggle
**Date**: 2025-12-28

## Implementation Overview

This feature adds toggle controls for built-in Claude Agent SDK tools (WebSearch, WebFetch) in the plugin settings.

## Files to Modify

| File | Changes |
|------|---------|
| `src/types.ts` | Add `disabledBuiltinTools` to settings, add `TOGGLEABLE_BUILTIN_TOOLS` constant |
| `src/AgentService.ts` | Add `disallowedTools` to query options in `buildQueryOptions()` |
| `src/SettingsTab.ts` | Add new settings section with toggle controls |
| `src/i18n/index.ts` | Add i18n keys for new UI labels |

## Step-by-Step Implementation

### Step 1: Update Types (src/types.ts)

```typescript
// Add constant for toggleable tools
export const TOGGLEABLE_BUILTIN_TOOLS = [
  { name: 'WebSearch', labelKey: 'settings.builtinTools.webSearch', descriptionKey: 'settings.builtinTools.webSearchDesc' },
  { name: 'WebFetch', labelKey: 'settings.builtinTools.webFetch', descriptionKey: 'settings.builtinTools.webFetchDesc' }
] as const;

// Extend NoteSageSettings interface
export interface NoteSageSettings {
  // ... existing fields
  disabledBuiltinTools?: string[];
}

// Update DEFAULT_SETTINGS
export const DEFAULT_SETTINGS: NoteSageSettings = {
  // ... existing defaults
  disabledBuiltinTools: []
};
```

### Step 2: Update AgentService (src/AgentService.ts)

```typescript
private buildQueryOptions(...): Record<string, unknown> {
  const options: Record<string, unknown> = {
    // ... existing options
  };

  // Add disallowed built-in tools
  if (this.settings.disabledBuiltinTools?.length) {
    options.disallowedTools = this.settings.disabledBuiltinTools;

    if (this.settings.debugContext) {
      console.log('[AgentService] Disabled built-in tools:', this.settings.disabledBuiltinTools);
    }
  }

  return options;
}
```

### Step 3: Update SettingsTab (src/SettingsTab.ts)

```typescript
// Add new section after MCP settings
private renderBuiltinToolsSettings(containerEl: HTMLElement): void {
  new Setting(containerEl)
    .setName(t('settings.builtinTools'))
    .setDesc(t('settings.builtinToolsDesc'))
    .setHeading();

  for (const tool of TOGGLEABLE_BUILTIN_TOOLS) {
    const isEnabled = !this.plugin.settings.disabledBuiltinTools?.includes(tool.name);

    new Setting(containerEl)
      .setName(t(tool.labelKey))
      .setDesc(t(tool.descriptionKey))
      .addToggle(toggle => toggle
        .setValue(isEnabled)
        .onChange(async (value) => {
          const disabled = this.plugin.settings.disabledBuiltinTools || [];
          if (value) {
            // Enable: remove from disabled list
            this.plugin.settings.disabledBuiltinTools = disabled.filter(t => t !== tool.name);
          } else {
            // Disable: add to disabled list
            if (!disabled.includes(tool.name)) {
              this.plugin.settings.disabledBuiltinTools = [...disabled, tool.name];
            }
          }
          await this.plugin.saveSettings();
          this.updateViews();
        }));
  }
}

// Call in display() method after MCP settings
display(): void {
  // ... existing code

  // Add after MCP settings section
  this.renderBuiltinToolsSettings(containerEl);

  // ... rest of existing code
}
```

### Step 4: Add i18n Keys

```typescript
// English
'settings.builtinTools': 'Built-in Tools',
'settings.builtinToolsDesc': 'Enable or disable built-in Claude tools. Disable if you prefer using MCP alternatives.',
'settings.builtinTools.webSearch': 'Web Search',
'settings.builtinTools.webSearchDesc': 'Search the web for current information',
'settings.builtinTools.webFetch': 'Web Fetch',
'settings.builtinTools.webFetchDesc': 'Fetch and analyze web page content',

// Korean
'settings.builtinTools': '내장 도구',
'settings.builtinToolsDesc': '내장 Claude 도구를 활성화하거나 비활성화합니다. MCP 대안을 사용하려면 비활성화하세요.',
'settings.builtinTools.webSearch': '웹 검색',
'settings.builtinTools.webSearchDesc': '최신 정보를 검색합니다',
'settings.builtinTools.webFetch': '웹 가져오기',
'settings.builtinTools.webFetchDesc': '웹 페이지 콘텐츠를 가져와 분석합니다',
```

## Testing

```bash
# Run unit tests
npm run test

# Manual testing checklist
1. Open plugin settings
2. Find "Built-in Tools" section
3. Toggle WebSearch off → verify in debug logs
4. Toggle WebFetch off → verify in debug logs
5. Restart Obsidian → verify settings persisted
6. Start chat with disabled tools → verify Claude uses MCP alternatives
```

## Verification

1. Settings persist in `data.json`:
   ```json
   {
     "disabledBuiltinTools": ["WebSearch", "WebFetch"]
   }
   ```

2. Debug log shows (when debug mode enabled):
   ```
   [AgentService] Disabled built-in tools: ["WebSearch", "WebFetch"]
   ```

3. Claude does not use disabled tools during chat session
