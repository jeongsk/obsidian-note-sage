# Obsidian AI Agent - User Manual

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installation](#installation)
- [Initial Setup](#initial-setup)
- [Using the Plugin](#using-the-plugin)
  - [Chat Interface](#chat-interface)
  - [Sending Messages](#sending-messages)
  - [File Context](#file-context)
  - [Session Management](#session-management)
- [Settings](#settings)
- [Available Models](#available-models)
- [Features](#features)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

---

## Introduction

**Obsidian AI Agent** is an Obsidian plugin that integrates Claude AI directly into your Obsidian workspace. Using the Claude Agent SDK, it provides an AI chat interface in Obsidian's right sidebar, allowing you to interact with Claude while working in your vault.

### Key Capabilities

- Chat with Claude AI directly within Obsidian
- Include current note context in your conversations
- Maintain conversation continuity with session management
- Real-time streaming of AI responses
- Support for multiple Claude models
- File reading and command execution through the AI agent

---

## Requirements

- **Obsidian**: Version 0.15.0 or higher
- **Platform**: Desktop only (Windows, macOS, Linux)
- **Anthropic API Key**: Required for Claude AI access

---

## Installation

### From Community Plugins (Recommended)

1. Open Obsidian Settings
2. Go to **Community Plugins**
3. Click **Browse** and search for "Obsidian AI Agent"
4. Click **Install**
5. Enable the plugin

### Manual Installation

1. Download the latest release from the GitHub repository
2. Extract the files to your vault's `.obsidian/plugins/obsidian-ai-agent/` directory
3. Reload Obsidian
4. Go to **Settings** → **Community Plugins** and enable "Obsidian AI Agent"

---

## Initial Setup

### Getting an API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Navigate to **API Keys**
4. Create a new API key
5. Copy the key (it starts with `sk-ant-...`)

### Configuring the Plugin

1. Open Obsidian Settings
2. Go to **Obsidian AI Agent** in the left sidebar
3. Paste your Anthropic API Key in the **Anthropic API Key** field
4. Select your preferred Claude model
5. Close settings

---

## Using the Plugin

### Chat Interface

When you enable the plugin, the AI Chat panel opens automatically in the right sidebar. The interface consists of:

- **Header**: Contains the title "AI Agent" and control buttons
- **Message Area**: Displays the conversation history
- **Input Area**: Where you type your messages

#### Header Buttons

| Button | Icon | Description |
|--------|------|-------------|
| Examples | Text | Shows example messages and interactions |
| Settings | ⚙️ | Opens plugin settings |
| New Chat | + | Starts a new conversation |

### Sending Messages

1. Type your message in the text area at the bottom
2. Press **Enter** to send (or click the send button)
3. Use **Shift + Enter** to add a new line without sending

The AI will process your message and stream the response in real-time.

#### Canceling a Response

While the AI is processing:
- The send button changes to a stop icon (■)
- Click the stop button to cancel the current operation
- A loading spinner indicates active processing

### File Context

The plugin can include context from your currently active note in your messages.

#### Toggle File Context

1. Look for the **Current page** toggle above the input field
2. Click to enable/disable (highlighted when active)
3. When enabled, the file path is automatically included with your message

This is useful when asking questions about or requesting modifications to your current note.

### Session Management

The plugin maintains conversation sessions for continuity:

- **Session Persistence**: Your conversation continues even after closing the panel
- **Context Retention**: The AI remembers previous messages in the session
- **New Session**: Click the **+** button to start a fresh conversation

---

## Settings

Access settings via **Obsidian Settings** → **Obsidian AI Agent** or click the ⚙️ button in the chat header.

| Setting | Description |
|---------|-------------|
| **Anthropic API Key** | Your API key from console.anthropic.com |
| **Model** | Select the Claude model to use |
| **Debug mode** | Enable detailed logging in the browser console |

---

## Available Models

| Model | Description | Best For |
|-------|-------------|----------|
| **Claude Opus 4.5** | Most capable model | Complex tasks, detailed analysis |
| **Claude Sonnet 4** | Balanced performance | General use (default) |
| **Claude Sonnet 4.5** | Latest balanced model | Latest features with good performance |
| **Claude Haiku 4.5** | Fastest model | Quick responses, simple tasks |

---

## Features

### AI Agent Capabilities

The Claude AI agent can:

- **Read Files**: Access and analyze files in your vault
- **Execute Commands**: Run terminal commands (with appropriate permissions)
- **Answer Questions**: Provide information and explanations
- **Help with Writing**: Assist with note-taking, summarization, and content creation
- **Code Assistance**: Help with code-related tasks in your notes

### Real-time Streaming

Responses are streamed in real-time, so you can see the AI's output as it's generated. This provides a more interactive experience compared to waiting for complete responses.

### Tool Use Display

When the AI uses tools (like reading files or running commands), the plugin displays:
- Tool name and parameters
- Tool execution results
- Any errors that occur

---

## Troubleshooting

### Common Issues

#### "API Key not configured"
- Ensure you've entered your API key in the plugin settings
- Verify the key is valid and not expired
- Check that the key starts with `sk-ant-`

#### No response from AI
- Check your internet connection
- Verify your API key is valid
- Open the browser console (Ctrl+Shift+I / Cmd+Opt+I) to check for errors

#### Slow responses
- Try switching to a faster model (Haiku)
- Check your internet connection speed
- Large file contexts may increase processing time

### Debug Mode

Enable debug mode to troubleshoot issues:

1. Go to plugin settings
2. Enable **Debug mode**
3. Open Developer Console:
   - **Windows/Linux**: `Ctrl + Shift + I`
   - **macOS**: `Cmd + Option + I`
4. Look for logs starting with `=== DEBUG CONTEXT ===`

Debug mode logs:
- API key configuration status
- Selected model
- Message context (original and with file context)
- Session ID
- Streaming messages

---

## FAQ

### Is my data secure?

- Messages are sent directly to Anthropic's API
- Your API key is stored locally in Obsidian's plugin data
- No data is stored on third-party servers

### Can I use this offline?

No, an internet connection is required to communicate with the Claude API.

### What's the difference between models?

- **Opus**: Most intelligent, best for complex reasoning
- **Sonnet**: Good balance of speed and capability (recommended)
- **Haiku**: Fastest, best for simple tasks

### How do I reset my conversation?

Click the **+** (New Chat) button in the header to start a fresh conversation.

### Can the AI modify my files?

Yes, when using the agent with appropriate permissions, it can read and modify files in your vault. Always review changes before committing them.

### What keyboard shortcuts are available?

| Shortcut | Action |
|----------|--------|
| Enter | Send message |
| Shift + Enter | New line in message |

---

## Support

- **Issues**: Report problems on [GitHub Issues](https://github.com/anpigon/obsidian-ai-agent/issues)
- **Documentation**: Check the project's CLAUDE.md for developer information

---

*Version 0.2.0 | Obsidian AI Agent*
