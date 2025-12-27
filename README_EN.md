# Note Sage

[한국어](README.md) | [English](README_EN.md) | [简体中文](README_ZH.md) | [日本語](README_JA.md) | [Deutsch](README_DE.md) | [Français](README_FR.md) | [Español](README_ES.md) | [Português](README_PT.md) | [Русский](README_RU.md) | [हिन्दी](README_HI.md) | [العربية](README_AR.md)

https://github.com/user-attachments/assets/3b251604-cf52-4f38-8c9d-fba67e280b64

Bring AI agents directly into your Obsidian vault. This plugin integrates Claude Code CLI seamlessly with Obsidian - allowing you to chat with AI, edit files, and manage your knowledge base without leaving your workspace.

## Why?

Working with AI shouldn't break your flow or lose context about your vault.

This plugin keeps Claude context-aware of your Obsidian environment while letting you stay in your workspace instead of switching to terminal. It also provides features to help you manage context more effectively.

## Features

- **Direct AI integration**: Chat with Claude Code directly in Obsidian's interface
- **File-first approach**: AI agents can read, edit, and create files in your vault
- **Context-aware**: Automatically includes relevant vault context in conversations
- **Real-time collaboration**: See AI edits happen live in your Obsidian interface
- **Quick Actions**: Execute common tasks quickly with predefined prompts (Summarize, Improve, Analyze, Translate)
- **MCP Server Integration**: Connect external tools and resources to the AI agent
- **Multilingual UI**: Support for 11 languages (English, Korean, Japanese, Chinese, German, French, Spanish, Portuguese, Russian, Hindi, Arabic)
- **Session management**: Maintain conversation continuity and save conversations

## Installation

### Prerequisites

- **Anthropic Account** - Required for Claude API access ([console.anthropic.com](https://console.anthropic.com))
- **Claude Code CLI** - Get it from [Anthropic's Claude Code](https://www.anthropic.com/claude-code)

### Setup

*Coming soon to the Obsidian community plugin store*

1. **Verify CLI access**: Ensure you can run `claude` in your terminal
2. **Download**: Get the latest release (`obsidian-note-sage.zip`) from the [releases page](../../releases)
3. **Install**: Extract and place the folder in `[your_vault]/.obsidian/plugins/obsidian-note-sage`
4. **Enable**: Activate the plugin in Obsidian's Community Plugins settings
5. **Start chatting**: Use the Note Sage panel in your workspace right-sidebar

> [!WARNING]
> **Preview version notice**
>
> This plugin is in active development and will modify files in your vault. It currently uses elevated permissions (`--permission-mode bypassPermissions` and `dangerously-skip-permissions`) for full functionality.
>
> **Recommended**: Back up your vault before use. Fine-grained permission controls are planned for future releases.

## Usage

### Basic Usage

1. Click the Note Sage icon in the right sidebar
2. Type your message in the chat input
3. Press Enter to send (Shift+Enter for new line)
4. Use the "Current page" button to include/exclude current note context

### Quick Actions

Use the quick action buttons above the chat input to execute common tasks quickly:

- **Summarize**: Concisely summarize the current document
- **Improve**: Improve writing style and fix errors
- **Analyze**: Analyze the document and provide insights
- **Translate**: Translate between Korean and English

You can customize each button's prompt in settings.

## Settings

### Basic Settings

| Setting | Description |
|---------|-------------|
| Model | Select Claude model (opus-4-5, sonnet-4-5, haiku-4-5) |
| Language | Interface language (Auto or choose from 11 languages) |

### File Context

| Setting | Description |
|---------|-------------|
| Include file content | Include current file content in context |
| Prefer selected text | Include only selection instead of entire file when text is selected |
| Max content length | Maximum characters to include from file (for token savings) |

### Quick Actions

Customize the prompt for each quick action button in settings. Leave empty to use defaults.

### MCP Servers

Connect MCP (Model Context Protocol) servers to extend the AI agent's capabilities.

| Setting | Description |
|---------|-------------|
| Add Server | Connect stdio, SSE, or HTTP type MCP servers |
| Enable/Disable Server | Toggle individual servers |
| Tools Panel | View available tools from connected MCP servers |

### Advanced Settings

| Setting | Description |
|---------|-------------|
| API Key | Anthropic API key (optional) |
| Claude CLI Path | Path to claude executable (auto-detected if empty) |
| Custom System Prompt | Custom instructions for Claude |
| Debug Mode | Enable debug logging for troubleshooting |

## Troubleshooting

### CLI Issues

**Can't find Claude CLI?**

1. **Verify installation**: Run `claude --version` in your terminal
2. **Manual configuration**: If auto-detection fails, set paths manually in **Settings > Community Plugins > Note Sage**

**Find executable path:**
```bash
# Claude CLI location
echo "$(sed -n 's/^exec "\([^"]*\)".*/\1/p' $(which claude))"
```

**Windows users**: Claude must be installed in WSL. Windows native support is still being tested.

### Debug Mode

**Enable detailed logging:**
1. Go to **Settings > Community Plugins > Note Sage**
2. Enable "Debug mode"
3. Open Developer Console: `Cmd+Opt+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux)

## Roadmap

### Completed Features
- [x] **MCP Server Integration** - Connect external tools and resources
- [x] **Multi-language Support** - 11 languages with RTL support
- [x] **Quick Actions Customization** - Per-button prompt settings
- [x] **Obsidian Plugin Management Tools** - Manage plugins through AI

### Upcoming Features
- [ ] **Interaction modes** - Write mode, Plan mode, and custom workflows
- [ ] **Permission controls** - Fine-grained file access and editing permissions
- [ ] **Cross-platform support** - Enhanced Windows/WSL compatibility
- [ ] **Context menu integration** - "Add to AI context" from file explorer
- [ ] **File linking** - Open the files that were read/edited by the model
- [ ] **Enhanced copy/paste** - Smart context copy/paste

## Privacy & Data Handling

### Remote Services

This plugin uses the **Anthropic Claude API** to process your requests. When you send a message:
- Your prompt text is sent to Anthropic's servers
- If "Current page" context is enabled, file contents are also sent
- Data is processed according to [Anthropic's Privacy Policy](https://www.anthropic.com/privacy)

### Account Requirements

- **Anthropic API Key**: Required for API access
  - Get one at [console.anthropic.com](https://console.anthropic.com)
  - Stored locally in your vault's plugin data (not encrypted)

### File System Access

This plugin accesses locations outside your Obsidian vault:
- **Claude CLI detection**: Searches system paths to locate the Claude executable
  - macOS/Linux: `~/.local/bin/`, `/usr/local/bin/`, `/opt/homebrew/bin/`
  - Windows: `%USERPROFILE%\AppData\`, `C:\Program Files\`
- **Agent permissions**: Uses elevated permissions (`bypassPermissions`) allowing the AI to read/edit files in your vault

### Local Data Storage

- Chat messages are stored in memory only (cleared on restart)
- Settings stored in `.obsidian/plugins/obsidian-note-sage/data.json`
- Conversations can be manually saved to your vault as markdown files

## License

MIT License
