# CLAUDE.md

This file provides guidance for AI assistants working with the Note Sage (obsidian-note-sage) codebase.

## Project Overview

**Note Sage** is an Obsidian plugin that integrates Claude AI directly into the Obsidian workspace. It uses the Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`) to provide an AI chat interface in Obsidian's right sidebar, allowing users to interact with Claude while working in their vault.

### Key Features
- Chat with Claude directly within Obsidian
- Automatic file context inclusion from the current active note
- Session management for conversation continuity
- Real-time streaming of AI responses
- Task/todo tracking display
- Multiple Claude model support

## Codebase Structure

```
obsidian-note-sage/
├── src/                     # Source code directory
│   ├── main.ts              # Plugin entry point, lifecycle management
│   ├── AgentService.ts      # Claude Agent SDK integration layer
│   ├── ChatView.ts          # UI component for the chat interface
│   ├── ChatRenderer.ts      # Chat message rendering utilities
│   ├── MessageFactory.ts    # Message creation utilities
│   ├── SettingsTab.ts       # Plugin settings configuration UI
│   ├── types.ts             # TypeScript type definitions
│   └── exampleMessages.ts   # Example message data for testing
├── styles.css               # Chat interface styling
├── esbuild.config.mjs       # Build configuration
├── manifest.json            # Obsidian plugin manifest
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── .eslintrc                # ESLint configuration
```

### Core Files

| File | Purpose |
|------|---------|
| `src/main.ts` | Plugin class extending Obsidian's `Plugin`. Handles loading/unloading, settings, and view registration. |
| `src/AgentService.ts` | Wraps the Claude Agent SDK `query()` function. Manages streaming responses, session IDs, and abort handling. |
| `src/ChatView.ts` | Extends Obsidian's `ItemView`. Renders the chat UI, handles user input, displays messages, and manages chat state. |
| `src/ChatRenderer.ts` | Utility class for rendering chat messages and content blocks. |
| `src/MessageFactory.ts` | Factory for creating structured chat messages. |
| `src/SettingsTab.ts` | Plugin settings tab for API key, model selection, and debug mode. |
| `src/types.ts` | Type definitions for settings, messages, content blocks, and SDK message types. |

## Architecture

### Data Flow
```
User Input → ChatView.handleSendMessage()
    → AgentService.execute()
        → Claude Agent SDK query()
            → Streaming messages back
                → ChatView.addMessage() → UI render
```

### Key Classes

**NoteSagePlugin** (`src/main.ts`)
- Entry point extending `Plugin`
- Registers the custom view type `note-sage-view`
- Manages settings persistence
- Activates the chat view in the right sidebar

**AgentService** (`src/AgentService.ts`)
- Manages Claude Agent SDK interactions
- Handles streaming message conversion
- Provides cancellation support via `AbortController`
- Converts SDK messages to internal `ChatMessage` format

**NoteSageView** (`src/ChatView.ts`)
- Obsidian `ItemView` implementation
- Manages chat UI lifecycle
- Handles message rendering (user, assistant, tool use, tool results)
- Supports file context toggling
- Processing state management (loading/cancel)

### Message Types

The plugin handles several message types from the Claude Agent SDK:

- `system` (with subtype `init`) - Session initialization
- `assistant` - Claude's text responses and tool calls
- `user` - Tool results and user input
- `result` - Final response with execution stats

## Development Workflow

### Prerequisites
- Node.js (v18+)
- npm
- An Obsidian vault for testing

### Setup
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
Starts esbuild in watch mode with inline source maps.

### Production Build
```bash
npm run build
```
Runs TypeScript type checking and creates a minified bundle.

### Testing in Obsidian
1. Create a symlink or copy the plugin folder to your vault's `.obsidian/plugins/` directory
2. Enable the plugin in Obsidian's Community Plugins settings
3. Reload Obsidian after code changes (or use hot reload if available)

## Code Conventions

### TypeScript
- Use explicit type annotations for function parameters and return types
- Prefer interfaces over types for object shapes
- Use `readonly` for immutable properties where applicable
- Follow the existing patterns in `src/types.ts` for new type definitions

### Naming Conventions
- **Classes**: PascalCase (e.g., `NoteSageView`, `AgentService`)
- **Interfaces**: PascalCase (e.g., `ChatMessage`, `NoteSageSettings`)
- **Methods/Functions**: camelCase (e.g., `handleSendMessage`, `renderMessage`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `VIEW_TYPE_NOTE_SAGE`, `DEFAULT_SETTINGS`)
- **CSS Classes**: kebab-case with `sage-` prefix (e.g., `sage-chat-container`, `sage-message-content`)

### Code Style
- Use tabs for indentation (per `.editorconfig`)
- Single quotes for strings (per ESLint config)
- No unused variables (enforced by ESLint)
- Prefer async/await over raw promises
- Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate

### CSS Conventions
- All CSS classes prefixed with `sage-` to avoid conflicts
- Use CSS custom properties (CSS variables) from Obsidian's theme (e.g., `var(--background-primary)`)
- Responsive design considerations for sidebar width

## Key Integration Points

### Obsidian API Usage
- `Plugin` - Base class for plugin lifecycle
- `ItemView` - Base class for custom views
- `WorkspaceLeaf` - Container for views
- `PluginSettingTab` - Settings interface
- `setIcon` - Icon rendering utility

### Claude Agent SDK
- `query()` - Main function for sending prompts and receiving streaming responses
- Uses `permissionMode: 'bypassPermissions'` for full functionality
- Session resumption via `resume` option

### Environment Variables
- `ANTHROPIC_API_KEY` - Set from plugin settings for API authentication

## Configuration

### Settings (`src/types.ts`)
```typescript
interface NoteSageSettings {
  apiKey?: string;        // Anthropic API key
  model?: string;         // Claude model identifier
  debugContext?: boolean; // Enable debug logging
}
```

### Available Models (`src/types.ts`)
- `claude-opus-4-5` - Most capable
- `claude-sonnet-4-5` - Default
- `claude-haiku-4-5` - Fastest

## Common Tasks

### Adding a New Setting
1. Add the property to `NoteSageSettings` interface in `src/types.ts`
2. Add default value to `DEFAULT_SETTINGS` in `src/types.ts`
3. Add UI control in `src/SettingsTab.ts` `display()` method
4. Update relevant components to use the new setting

### Adding a New Message Type
1. Define the type in `src/types.ts` (update `ChatMessage` or create new interface)
2. Handle the new type in `src/AgentService.convertSDKMessage()`
3. Add rendering logic in `src/ChatView.renderMessage()` or `renderMessageContent()`
4. Add corresponding CSS styles in `styles.css`

### Modifying the Chat UI
- UI components are in `src/ChatView.ts`
- Styles are in `styles.css`
- Use Obsidian's `createEl()` for DOM creation
- Follow existing patterns for collapsible sections

## Debugging

### Enable Debug Mode
1. Open plugin settings in Obsidian
2. Enable "Debug mode" toggle
3. Open Developer Console: `Cmd+Opt+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux)

### Debug Output
When debug mode is enabled, the plugin logs:
- API key configuration status
- Model selection
- Message context (original and final message with file context)
- Session ID tracking
- Streaming messages as they arrive

## Important Notes

### Security Considerations
- The plugin uses `bypassPermissions` mode - it can read/write files and execute commands
- API keys are stored in Obsidian's plugin data (not encrypted)
- Consider vault backup before use in production

### Desktop Only
This plugin is desktop-only (`isDesktopOnly: true` in manifest) as it relies on Node.js and file system access.

### Build Output
- `main.js` - Bundled plugin code (generated, do not edit)
- Source maps are inline in development, disabled in production

## Active Technologies
- TypeScript 5.7+ + Obsidian API, @anthropic-ai/claude-agent-sdk (001-quick-action-buttons)
- Obsidian Plugin Settings (JSON file in `.obsidian/plugins/` folder) (001-quick-action-buttons)
- TypeScript 5.7+ (기존 프로젝트와 동일) + @anthropic-ai/claude-agent-sdk ^0.1.5, Obsidian API, Zod ^4.2.1 (001-mcp-server)
- Obsidian 플러그인 설정 (JSON, data.json) (001-mcp-server)

## Recent Changes
- 001-quick-action-buttons: Added TypeScript 5.7+ + Obsidian API, @anthropic-ai/claude-agent-sdk
