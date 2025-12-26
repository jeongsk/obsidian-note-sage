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

interface SettingsTranslations {
	title: string;
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
	about: string;
	aboutText1: string;
	aboutText2: string;
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
	toolResult: string;
	usingTool: string;
	noContent: string;
	system: string;
	tasks: string;
	copy: string;
	copied: string;
	user: string;
	assistant: string;
	result: string;
	duration: string;
	aiChatTitle: string;
	commands: CommandsTranslations;
	prompts: PromptsTranslations;
	settings: SettingsTranslations;
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
	toolResult: 'Tool result',
	usingTool: 'Using tool',
	noContent: 'No content',
	system: 'System',

	// Todo card
	tasks: 'Tasks',

	// Code block
	copy: 'Copy',
	copied: 'Copied!',

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
		title: 'Note Sage Settings',

		// API Key
		apiKey: 'Anthropic API Key (Optional)',
		apiKeyDesc: 'Optional. Your Anthropic API key for Claude. Get one at console.anthropic.com',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'Model',
		modelDesc: 'Select the Claude model to use',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: 'Advanced Options',
		claudeCliPath: 'Claude CLI path',
		claudeCliPathDesc: 'Path to the claude executable. Leave empty to auto-detect from common installation paths.',
		claudeCliPathPlaceholder: 'Auto-detect (leave empty)',
		claudeCliPathInfo: 'Common paths: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'Debug mode',
		debugModeDesc: 'Enable debug logging for troubleshooting (logs to browser console)',

		// File Context
		fileContext: 'File Context',
		includeFileContent: 'Include file content',
		includeFileContentDesc: 'Include the content of the current file in the context sent to Claude',
		preferSelectedText: 'Prefer selected text',
		preferSelectedTextDesc: 'When text is selected, include only the selection instead of the entire file',
		maxContentLength: 'Max content length',
		maxContentLengthDesc: 'Maximum number of characters to include from the file (to save tokens)',

		// System Prompt
		systemPrompt: 'System Prompt',
		customSystemPrompt: 'Custom system prompt',
		customSystemPromptDesc: 'Custom instructions for Claude. Leave empty to use defaults.',
		customSystemPromptPlaceholder: 'You are a helpful assistant specialized in...',

		// Conversation Saving
		conversationSaving: 'Conversation Saving',
		autoSave: 'Auto-save conversations',
		autoSaveDesc: 'Automatically save conversations to your vault as markdown files',
		savePath: 'Save path',
		savePathDesc: 'Folder path in your vault where conversations will be saved',

		// Language
		language: 'Language',
		languageDesc: 'Select the interface language',
		languageAuto: 'Auto (System)',

		// About
		about: 'About',
		aboutText1: 'This plugin uses the Claude Agent SDK to provide AI-powered assistance directly within Obsidian.',
		aboutText2: 'The agent can read files, execute commands, and help with various tasks in your vault.',
	},
};
