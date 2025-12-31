// English translations

// Define the structure for nested translation objects
interface QuickActionTranslations {
	summarize: string;
	summarizePrompt: string;
	improve: string;
	improvePrompt: string;
	analyze: string;
	analyzePrompt: string;
	translate: string;
	translatePrompt: string;
}

interface CommandsTranslations {
	openNoteSage: string;
	startNewChat: string;
	saveConversation: string;
	summarizeDocument: string;
	explainSelection: string;
	improveWriting: string;
	translateToKorean: string;
	translateToEnglish: string;
	reviewCode: string;
}

interface PromptsTranslations {
	summarize: string;
	explain: string;
	improve: string;
	translateKo: string;
	translateEn: string;
	codeReview: string;
}

interface BuiltinToolsTranslations {
	title: string;
	description: string;
	webSearch: string;
	webSearchDesc: string;
	webFetch: string;
	webFetchDesc: string;
}

interface AgentOptionsTranslations {
	title: string;
	description: string;
	maxTurns: string;
	maxTurnsDesc: string;
	maxTurnsPlaceholder: string;
	maxBudgetUsd: string;
	maxBudgetUsdDesc: string;
	maxBudgetUsdPlaceholder: string;
	enableExtendedThinking: string;
	enableExtendedThinkingDesc: string;
	maxThinkingTokens: string;
	maxThinkingTokensDesc: string;
	permissionMode: {
		title: string;
		description: string;
		bypassPermissions: string;
		bypassPermissionsDesc: string;
		acceptEdits: string;
		acceptEditsDesc: string;
		default: string;
		defaultDesc: string;
		plan: string;
		planDesc: string;
	};
	costDisplay: string;
	costLimitReached: string;
	turnLimitReached: string;
}

interface SkillsSettingsTranslations {
	title: string;
	description: string;
	enable: string;
	enableDesc: string;
	createTemplate: string;
	createAIWizard: string;
	aiWizardDesc: string;
	aiPromptLabel: string;
	aiPromptDesc: string;
	aiPromptPlaceholder: string;
	generateBtn: string;
	generating: string;
	invalidName: string;
	noSkills: string;
	noSkillsGuide: string;
	nameLabel: string;
	nameDesc: string;
	descriptionLabel: string;
	descriptionDesc: string;
	descriptionPlaceholder: string;
	instructionsLabel: string;
	instructionsDesc: string;
	instructionsPlaceholder: string;
	examplesLabel: string;
	examplesDesc: string;
	examplesPlaceholder: string;
	preview: string;
	duplicateName: string;
	parseError: string;
	fileNotFound: string;
	loadError: string;
	edit: string;
	delete: string;
	deleteConfirm: string;
	deleteTitle: string;
	deleteConfirmMessage: string;
	deleteUndoHint: string;
	deleteSuccess: string;
	deleteError: string;
	undo: string;
	restoreSuccess: string;
	restoreError: string;
	// AI Validation
	validationFailed: string;
	validationErrors: string;
	retrying: string;
	noContentError: string;
}

interface McpSettingsTranslations {
	title: string;
	description: string;
	addServer: string;
	editServer: string;
	deleteServer: string;
	deleteConfirm: string;
	serverName: string;
	serverNamePlaceholder: string;
	serverType: string;
	typeStdio: string;
	typeSse: string;
	typeHttp: string;
	command: string;
	commandPlaceholder: string;
	args: string;
	argsPlaceholder: string;
	env: string;
	envPlaceholder: string;
	url: string;
	urlPlaceholder: string;
	headers: string;
	headersPlaceholder: string;
	enabled: string;
	save: string;
	cancel: string;
	duplicateName: string;
	invalidJson: string;
	statusConnected: string;
	statusFailed: string;
	statusPending: string;
	statusNeedsAuth: string;
	noServers: string;
	commandNotFound: string;
	commandNotFoundDesc: string;
	commandValidating: string;
	// Panel translations
	panelTitle: string;
	panelNoServers: string;
	panelNoServersDesc: string;
	panelOpenSettings: string;
	panelToolsNotConnected: string;
	panelToolsCount: string;
	panelToggleError: string;
	deleteError: string;
	saveError: string;
}

interface SettingsTranslations {
	apiKey: string;
	apiKeyDesc: string;
	apiKeyPlaceholder: string;
	model: string;
	modelDesc: string;
	claudeCli: string;
	claudeCliAdvanced: string;
	claudeCliPath: string;
	claudeCliPathDesc: string;
	claudeCliPathPlaceholder: string;
	claudeCliPathInfo: string;
	debugMode: string;
	debugModeDesc: string;
	fileContext: string;
	includeFileContent: string;
	includeFileContentDesc: string;
	preferSelectedText: string;
	preferSelectedTextDesc: string;
	maxContentLength: string;
	maxContentLengthDesc: string;
	systemPrompt: string;
	customSystemPrompt: string;
	customSystemPromptDesc: string;
	customSystemPromptPlaceholder: string;
	conversationSaving: string;
	autoSave: string;
	autoSaveDesc: string;
	savePath: string;
	savePathDesc: string;
	language: string;
	languageDesc: string;
	languageAuto: string;
	// Quick Actions
	quickActions: string;
	quickActionsDesc: string;
	customPromptPlaceholder: string;
	resetToDefault: string;
	// Plugin Tools
	pluginTools: string;
	pluginToolsDesc: string;
	// Built-in Tools
	builtinTools: BuiltinToolsTranslations;
	// Agent Options
	agentOptions: AgentOptionsTranslations;
	// MCP Servers
	mcp: McpSettingsTranslations;
	// Skills
	skills: SkillsSettingsTranslations;
	about: string;
	aboutText1: string;
	aboutText2: string;
}

interface MentionTranslations {
	noResults: string;
	file: string;
	folder: string;
	binaryFile: string;
	fileNotFound: string;
	fileReadError: string;
	contentTruncated: string;
	invalidPath: string;
}

export interface TranslationKeys {
	appTitle: string;
	examples: string;
	pluginSettings: string;
	newChat: string;
	selectModel: string;
	quickAction: QuickActionTranslations;
	currentPage: string;
	addCurrentPageContext: string;
	inputPlaceholder: string;
	sendMessage: string;
	cancelProcessing: string;
	currentFile: string;
	selectedText: string;
	fileContent: string;
	truncated: string;
	charactersOmitted: string;
	vaultPathError: string;
	executionCancelled: string;
	error: string;
	errorRenderingMessage: string;
	cooking: string;
	thinking: string;
	extendedThinking: string;
	toolResult: string;
	usingTool: string;
	noContent: string;
	system: string;
	tasks: string;
	copy: string;
	copied: string;
	copyFailed: string;
	user: string;
	assistant: string;
	result: string;
	duration: string;
	aiChatTitle: string;
	commands: CommandsTranslations;
	prompts: PromptsTranslations;
	settings: SettingsTranslations;
	// Mention system
	mention: MentionTranslations;
	// Large file warning
	largeFileWarningTitle: string;
	largeFileWarningMessage: string;
	largeFileWarningQuestion: string;
	includeAnyway: string;
	cancel: string;
	// Common translations
	common: {
		close: string;
		cancel: string;
		create: string;
		save: string;
		delete: string;
	};
}

export const en: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: 'Examples',
	pluginSettings: 'Plugin settings',
	newChat: 'New chat',
	selectModel: 'Select Claude model',

	// Quick actions
	quickAction: {
		summarize: 'Summarize',
		summarizePrompt: 'Please summarize this document concisely.',
		improve: 'Improve',
		improvePrompt: 'Please improve the writing style and fix any errors.',
		analyze: 'Analyze',
		analyzePrompt: 'Please analyze this document and provide insights.',
		translate: 'Translate',
		translatePrompt: 'Please translate this text to English. If already in English, translate to Korean.',
	},

	// File context
	currentPage: 'Current page',
	addCurrentPageContext: "Add current page's context to message",

	// Input
	inputPlaceholder: 'Type your message (press Enter to send and Shift+Enter for a new line)...',
	sendMessage: 'Send message',
	cancelProcessing: 'Cancel processing',

	// Context building
	currentFile: 'Current file',
	selectedText: 'Selected text',
	fileContent: 'File content',
	truncated: 'truncated',
	charactersOmitted: 'characters omitted',

	// Errors
	vaultPathError: 'Unable to determine vault path. This plugin requires a local vault.',
	executionCancelled: 'Message execution cancelled',
	error: 'Error',
	errorRenderingMessage: 'Error rendering message content',

	// Chat messages
	cooking: 'Cooking...',
	thinking: 'Thinking...',
	extendedThinking: 'Extended Thinking',
	toolResult: 'Tool result',
	usingTool: 'Using tool',
	noContent: 'No content',
	system: 'System',

	// Todo card
	tasks: 'Tasks',

	// Code block
	copy: 'Copy',
	copied: 'Copied!',
	copyFailed: 'Failed',

	// Markdown export
	user: 'User',
	assistant: 'Assistant',
	result: 'Result',
	duration: 'Duration',
	aiChatTitle: 'AI Chat',

	// Commands
	commands: {
		openNoteSage: 'Open Note Sage',
		startNewChat: 'Start new chat',
		saveConversation: 'Save current conversation',
		summarizeDocument: 'Note Sage: Summarize document',
		explainSelection: 'Note Sage: Explain selection',
		improveWriting: 'Note Sage: Improve writing',
		translateToKorean: 'Note Sage: Translate to Korean',
		translateToEnglish: 'Note Sage: Translate to English',
		reviewCode: 'Note Sage: Review code',
	},

	// Quick prompts
	prompts: {
		summarize: 'Please summarize this document concisely.',
		explain: 'Please explain the selected text in detail.',
		improve: 'Please improve the writing style and fix any grammar or spelling errors.',
		translateKo: 'Please translate this text to Korean.',
		translateEn: 'Please translate this text to English.',
		codeReview: 'Please review this code and suggest improvements.',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'Anthropic API Key (Optional)',
		apiKeyDesc: 'Optional. Your Anthropic API key for Claude. Get one at console.anthropic.com',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'Model',
		modelDesc: 'Select the Claude model to use',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: 'Advanced',
		claudeCliPath: 'Claude CLI path',
		claudeCliPathDesc: 'Path to the claude executable. Leave empty to auto-detect from common installation paths.',
		claudeCliPathPlaceholder: 'Auto-detect (leave empty)',
		claudeCliPathInfo: 'Common paths: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'Debug mode',
		debugModeDesc: 'Enable debug logging for troubleshooting (logs to browser console)',

		// File Context
		fileContext: 'File context',
		includeFileContent: 'Include file content',
		includeFileContentDesc: 'Include the content of the current file in the context sent to Claude',
		preferSelectedText: 'Prefer selected text',
		preferSelectedTextDesc: 'When text is selected, include only the selection instead of the entire file',
		maxContentLength: 'Max content length',
		maxContentLengthDesc: 'Maximum number of characters to include from the file (to save tokens)',

		// System Prompt
		systemPrompt: 'System prompt',
		customSystemPrompt: 'Custom system prompt',
		customSystemPromptDesc: 'Custom instructions for Claude. Leave empty to use defaults.',
		customSystemPromptPlaceholder: 'You are a helpful assistant specialized in...',

		// Conversation Saving
		conversationSaving: 'Conversation saving',
		autoSave: 'Auto-save conversations',
		autoSaveDesc: 'Automatically save conversations to your vault as markdown files',
		savePath: 'Save path',
		savePathDesc: 'Folder path in your vault where conversations will be saved',

		// Language
		language: 'Language',
		languageDesc: 'Select the interface language',
		languageAuto: 'Auto (System)',

		// Quick Actions
		quickActions: 'Quick Actions',
		quickActionsDesc: 'Configure quick action buttons above the chat input',
		customPromptPlaceholder: 'Enter custom prompt (leave empty for default)',
		resetToDefault: 'Reset to default',

		// Plugin Tools
		pluginTools: 'Plugin management tools',
		pluginToolsDesc: 'Allow agent to list, enable, and disable Obsidian plugins',

		// Built-in Tools
		builtinTools: {
			title: 'Built-in Tools',
			description: 'Enable or disable built-in Claude tools. Disable if you prefer using MCP alternatives.',
			webSearch: 'Web Search',
			webSearchDesc: 'Search the web for current information',
			webFetch: 'Web Fetch',
			webFetchDesc: 'Fetch and analyze web page content',
		},

		// Agent Options
		agentOptions: {
			title: 'Agent Options',
			description: 'Configure Claude Agent SDK advanced options',
			maxTurns: 'Max turns',
			maxTurnsDesc: 'Maximum number of conversation turns. Set to 0 for unlimited.',
			maxTurnsPlaceholder: '0 (unlimited)',
			maxBudgetUsd: 'Max budget (USD)',
			maxBudgetUsdDesc: 'Maximum cost per session in USD. Set to 0 for unlimited.',
			maxBudgetUsdPlaceholder: '0.00 (unlimited)',
			enableExtendedThinking: 'Extended Thinking',
			enableExtendedThinkingDesc: 'Enable Claude to think more deeply about complex problems',
			maxThinkingTokens: 'Max thinking tokens',
			maxThinkingTokensDesc: 'Maximum tokens for extended thinking (1,000 - 100,000)',
			permissionMode: {
				title: 'Permission mode',
				description: 'Control Claude\'s file and system access permissions',
				bypassPermissions: 'Bypass permissions',
				bypassPermissionsDesc: 'Allow all operations without confirmation (maximum convenience)',
				acceptEdits: 'Accept edits',
				acceptEditsDesc: 'Auto-approve file edits only',
				default: 'Default',
				defaultDesc: 'Require confirmation for all operations',
				plan: 'Plan mode',
				planDesc: 'Planning only, no execution',
			},
			costDisplay: 'Session cost: ${cost}',
			costLimitReached: 'Cost limit reached. Session ended.',
			turnLimitReached: 'Turn limit reached. Session ended.',
		},

		// MCP Servers
		mcp: {
			title: 'MCP Servers',
			description: 'Configure external MCP servers for custom tools and resources',
			addServer: 'Add server',
			editServer: 'Edit server',
			deleteServer: 'Delete server',
			deleteConfirm: 'Are you sure you want to delete this server?',
			serverName: 'Server name',
			serverNamePlaceholder: 'e.g., filesystem, weather-api',
			serverType: 'Server type',
			typeStdio: 'stdio (local command)',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: 'Command',
			commandPlaceholder: 'e.g., npx, python',
			args: 'Arguments',
			argsPlaceholder: 'e.g., -y, @anthropic/mcp-server-filesystem, /path',
			env: 'Environment variables (JSON)',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: 'e.g., http://localhost:8080/mcp',
			headers: 'Headers (JSON)',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: 'Enabled',
			save: 'Save',
			cancel: 'Cancel',
			duplicateName: 'A server with this name already exists',
			invalidJson: 'Invalid JSON format',
			statusConnected: 'Connected',
			statusFailed: 'Connection failed',
			statusPending: 'Connecting...',
			statusNeedsAuth: 'Authentication required',
			noServers: 'No MCP servers configured. Click "Add server" to get started.',
			commandNotFound: 'Command not found',
			commandNotFoundDesc: 'The command "{command}" could not be found. Please enter the full path (e.g., /Users/username/.bun/bin/bunx)',
			commandValidating: 'Validating command...',
			// Panel translations
			panelTitle: 'MCP Servers',
			panelNoServers: 'No servers registered',
			panelNoServersDesc: 'Add MCP servers in settings',
			panelOpenSettings: 'Open Settings',
			panelToolsNotConnected: 'Connect to view available tools',
			panelToolsCount: '{count} tools',
			panelToggleError: 'Failed to change server status',
			deleteError: 'Failed to delete server',
			saveError: 'Failed to save server',
		},

		// Skills
		skills: {
			title: 'Skills',
			description: 'Manage Claude Agent SDK Skills from .claude/skills/',
			enable: 'Enable Skills',
			enableDesc: 'Allow Claude to use Skills defined in .claude/skills/ directory',
			createTemplate: 'Create from Template',
			createAIWizard: 'Create with AI',
			aiWizardDesc: 'Describe what you want your Skill to do and AI will generate it for you.',
			aiPromptLabel: 'Describe your Skill',
			aiPromptDesc: 'Explain what this Skill should do in natural language',
			aiPromptPlaceholder: 'e.g., A skill that helps format markdown tables with proper alignment...',
			generateBtn: 'Generate',
			generating: 'Generating Skill...',
			invalidName: 'Invalid Skill name',
			noSkills: 'No Skills found',
			noSkillsGuide: 'Create a new Skill using the buttons below or add SKILL.md files to .claude/skills/{skill-name}/',
			nameLabel: 'Skill Name',
			nameDesc: 'Use lowercase letters, numbers, and hyphens only (e.g., my-skill)',
			descriptionLabel: 'Description',
			descriptionDesc: 'Describe when Claude should use this Skill',
			descriptionPlaceholder: 'This Skill helps with...',
			instructionsLabel: 'Instructions',
			instructionsDesc: 'Instructions for Claude to follow when executing this Skill',
			instructionsPlaceholder: 'Describe how this Skill should work and what tasks to perform...',
			examplesLabel: 'Examples',
			examplesDesc: 'Example usages demonstrating this Skill',
			examplesPlaceholder: 'Write example inputs and expected outputs...',
			preview: 'Preview',
			duplicateName: 'A Skill with this name already exists',
			parseError: 'Parse error',
			fileNotFound: 'File not found',
			loadError: 'Failed to load file',
			edit: 'Edit',
			delete: 'Delete',
			deleteConfirm: 'Are you sure you want to delete the Skill "{name}"?',
			deleteTitle: 'Delete Skill',
			deleteConfirmMessage: 'Are you sure you want to delete {name}?',
			deleteUndoHint: 'You can undo this action within 10 seconds.',
			deleteSuccess: 'Skill "{name}" has been deleted.',
			deleteError: 'Failed to delete Skill: {error}',
			undo: 'Undo',
			restoreSuccess: 'Skill has been restored.',
			restoreError: 'Failed to restore Skill.',
			// AI Validation
			validationFailed: 'Validation failed after {max} attempts. Please check and edit the content manually.',
			validationErrors: 'Content has validation errors:\n{errors}',
			retrying: 'Fixing issues... (attempt {attempt}/{max})',
			noContentError: 'No content generated. Please click "Generate" first.',
		},

		// About
		about: 'About',
		aboutText1: 'This plugin uses the Claude Agent SDK to provide AI-powered assistance directly within Obsidian.',
		aboutText2: 'The agent can read files, execute commands, and help with various tasks in your vault.',
	},

	// Mention system
	mention: {
		noResults: 'No results found',
		file: 'File',
		folder: 'Folder',
		binaryFile: 'Binary file',
		fileNotFound: 'File not found',
		fileReadError: 'File read error',
		contentTruncated: '... content truncated ...',
		invalidPath: 'Invalid path',
	},

	// Large file warning
	largeFileWarningTitle: 'Large File Warning',
	largeFileWarningMessage: "The file '{path}' is larger than 100KB ({size}). Large files may slow down the response.",
	largeFileWarningQuestion: 'Do you want to include this file anyway?',
	includeAnyway: 'Include Anyway',
	cancel: 'Cancel',

	// Common translations
	common: {
		close: 'Close',
		cancel: 'Cancel',
		create: 'Create',
		save: 'Save',
		delete: 'Delete',
	},
};
