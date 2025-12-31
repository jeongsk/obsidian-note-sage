# Feature Specification: Built-in Tools Toggle

**Feature Branch**: `006-builtin-tools-toggle`
**Created**: 2025-12-28
**Status**: Draft
**Input**: User description: "Claude Agent SDK에서 기본으로 제공되는 도구 WebFetch 와 WebSearch 를 사용자가 필요에 의해 on 또는 off 할 수 있어야 합니다. 그 이유는 사용자가 추가한 mcp server 도구 중에 비슷한 도구가 존재하면 Claude Agent SDK에서 기본으로 제공되는 도구가 우선적으로 사용되기 때문입니다."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Disable Built-in WebSearch to Use MCP Alternative (Priority: P1)

A user has configured an MCP server that provides a custom web search tool (e.g., Exa, Tavily, or a company-internal search). They want to disable the built-in WebSearch tool so Claude exclusively uses their preferred MCP search tool, avoiding confusion and ensuring consistent search behavior.

**Why this priority**: This is the primary use case described by the user. When MCP tools conflict with built-in tools, users need control over which tool takes precedence.

**Independent Test**: Can be fully tested by disabling WebSearch in settings and verifying that only MCP search tools appear in Claude's tool usage during a chat session.

**Acceptance Scenarios**:

1. **Given** the user has an MCP server with a web search tool configured, **When** they disable the built-in WebSearch tool in plugin settings, **Then** Claude will only use the MCP server's search tool for web searches.
2. **Given** WebSearch is disabled in settings, **When** the user starts a new chat session, **Then** the WebSearch tool should not be available to Claude.
3. **Given** WebSearch was disabled, **When** the user re-enables it in settings, **Then** WebSearch becomes available again in subsequent chat sessions.

---

### User Story 2 - Disable Built-in WebFetch to Use MCP Alternative (Priority: P1)

A user has configured an MCP server with a custom web fetching tool that offers better parsing, authentication support, or access to internal URLs. They want to disable the built-in WebFetch tool to ensure Claude uses their MCP tool exclusively.

**Why this priority**: Same importance as WebSearch - users need consistent control over all web-related built-in tools.

**Independent Test**: Can be fully tested by disabling WebFetch in settings and verifying that only MCP fetch tools are used when Claude needs to retrieve web content.

**Acceptance Scenarios**:

1. **Given** the user has an MCP server with a web fetch tool configured, **When** they disable the built-in WebFetch tool in plugin settings, **Then** Claude will only use the MCP server's fetch tool.
2. **Given** WebFetch is disabled in settings, **When** Claude needs to retrieve content from a URL, **Then** it should use the available MCP fetch tool instead.

---

### User Story 3 - View and Manage All Toggleable Built-in Tools (Priority: P2)

A user wants to see all built-in tools that can be toggled and manage them from a single settings interface. This provides visibility into which tools are active and allows quick configuration changes.

**Why this priority**: Important for discoverability and user experience, but secondary to the core toggle functionality.

**Independent Test**: Can be tested by opening settings and verifying all toggleable tools are visible with their current on/off state.

**Acceptance Scenarios**:

1. **Given** the user opens the plugin settings, **When** they navigate to the tools section, **Then** they see a list of all toggleable built-in tools with their current enabled/disabled state.
2. **Given** the user is viewing the tools list, **When** they toggle a tool's state, **Then** the change is saved immediately and reflected in the UI.

---

### User Story 4 - Persist Tool Toggle Settings Across Sessions (Priority: P2)

A user's tool preferences should be saved and persist across Obsidian restarts, ensuring consistent behavior without needing to reconfigure settings each time.

**Why this priority**: Essential for usability but depends on the toggle mechanism being implemented first.

**Independent Test**: Can be tested by changing tool settings, restarting Obsidian, and verifying settings are preserved.

**Acceptance Scenarios**:

1. **Given** the user has disabled WebSearch and WebFetch, **When** they restart Obsidian, **Then** both tools remain disabled.
2. **Given** the user has customized tool settings, **When** they check the plugin's data.json file, **Then** the tool toggle states are correctly stored.

---

### Edge Cases

- What happens when all web-related tools (both built-in and MCP) are disabled? The system should function normally, and Claude should indicate when it cannot perform web-related tasks.
- How does the system handle enabling a tool mid-session? Tool availability changes should take effect on the next message, not retroactively affect ongoing sessions.
- What happens if the user disables a built-in tool but has no MCP alternative configured? Claude should gracefully handle the absence and inform the user when a capability is unavailable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide toggle controls for enabling/disabling the built-in WebSearch tool.
- **FR-002**: System MUST provide toggle controls for enabling/disabling the built-in WebFetch tool.
- **FR-003**: System MUST persist tool toggle settings to the plugin's data.json storage.
- **FR-004**: System MUST apply tool toggle settings when initiating new Claude Agent SDK sessions.
- **FR-005**: System MUST display the current state (enabled/disabled) of each toggleable tool in settings.
- **FR-006**: System MUST default all built-in tools to enabled for backward compatibility with existing users.
- **FR-007**: System MUST update the `disallowedTools` configuration passed to the Claude Agent SDK based on user settings.

### Additional Built-in Tools for Consideration

Based on Claude Agent SDK research, the following additional built-in tools may benefit from toggle controls:

| Tool          | Reason for Toggle                                                              |
|---------------|--------------------------------------------------------------------------------|
| **Bash**      | Users may want to restrict command execution for security, or use MCP shell tools |
| **Write/Edit**| Users may want read-only mode or use MCP-provided file tools                   |
| **Task**      | Users may want to disable subagent spawning                                    |
| **NotebookEdit** | Users who don't use Jupyter notebooks may want to disable this             |

**Assumption**: For this initial implementation, only WebSearch and WebFetch will be toggleable. Other tools can be added in future iterations based on user feedback.

### Key Entities

- **ToolToggleSetting**: Represents the enabled/disabled state of a built-in tool
  - Attributes: toolName (string), enabled (boolean)
- **NoteSageSettings**: Extended to include tool toggle states
  - New attribute: disabledBuiltinTools (array of tool names that are disabled)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can toggle WebSearch and WebFetch tools on/off within 3 clicks from the main settings.
- **SC-002**: Tool toggle changes take effect on the next chat session without requiring plugin reload.
- **SC-003**: Settings persist correctly across 100% of Obsidian restarts.
- **SC-004**: When a built-in tool is disabled and an MCP alternative exists, Claude uses the MCP tool exclusively.
- **SC-005**: No degradation in chat response time when tools are toggled (response time variance < 5%).

## Assumptions

- The Claude Agent SDK's `disallowedTools` option properly excludes tools from Claude's available tool set.
- MCP server tools are automatically discovered and made available alongside built-in tools.
- Users understand the implications of disabling built-in tools without having MCP alternatives.
- The current settings infrastructure supports adding new toggle fields without breaking existing configurations.
