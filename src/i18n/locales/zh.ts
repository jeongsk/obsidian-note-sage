// Chinese (Simplified) translations
import type { TranslationKeys } from './en';

export const zh: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: '示例',
	pluginSettings: '插件设置',
	newChat: '新对话',
	selectModel: '选择Claude模型',

	// Quick actions
	quickAction: {
		summarize: '摘要',
		summarizePrompt: '请简洁地总结这篇文档。',
		improve: '改进',
		improvePrompt: '请改进写作风格并修正错误。',
		analyze: '分析',
		analyzePrompt: '请分析这篇文档并提供见解。',
		translate: '翻译',
		translatePrompt: '请将此文本翻译成英文。如果已经是英文，请翻译成中文。',
	},

	// File context
	currentPage: '当前页面',
	addCurrentPageContext: '将当前页面的上下文添加到消息中',

	// Input
	inputPlaceholder: '输入消息（按Enter发送，Shift+Enter换行）...',
	sendMessage: '发送消息',
	cancelProcessing: '取消处理',

	// Context building
	currentFile: '当前文件',
	selectedText: '选中的文本',
	fileContent: '文件内容',
	truncated: '已截断',
	charactersOmitted: '字符已省略',

	// Errors
	vaultPathError: '无法确定vault路径。此插件需要本地vault。',
	executionCancelled: '消息执行已取消',
	error: '错误',
	errorRenderingMessage: '渲染消息内容时出错',

	// Chat messages
	cooking: '处理中...',
	thinking: '思考中...',
	extendedThinking: '扩展思考',
	toolResult: '工具结果',
	usingTool: '正在使用工具',
	noContent: '无内容',
	system: '系统',

	// Todo card
	tasks: '任务',

	// Code block
	copy: '复制',
	copied: '已复制！',
	copyFailed: '失败',

	// Markdown export
	user: '用户',
	assistant: '助手',
	result: '结果',
	duration: '持续时间',
	aiChatTitle: 'AI对话',

	// Commands
	commands: {
		openNoteSage: '打开Note Sage',
		startNewChat: '开始新对话',
		saveConversation: '保存当前对话',
		summarizeDocument: 'Note Sage: 总结文档',
		explainSelection: 'Note Sage: 解释选中内容',
		improveWriting: 'Note Sage: 改进写作',
		translateToKorean: 'Note Sage: 翻译成韩语',
		translateToEnglish: 'Note Sage: 翻译成英语',
		reviewCode: 'Note Sage: 审查代码',
	},

	// Quick prompts
	prompts: {
		summarize: '请简洁地总结这篇文档。',
		explain: '请详细解释选中的文本。',
		improve: '请改进写作风格并修正语法或拼写错误。',
		translateKo: '请将此文本翻译成韩语。',
		translateEn: '请将此文本翻译成英语。',
		codeReview: '请审查此代码并提出改进建议。',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'Anthropic API密钥（可选）',
		apiKeyDesc: '可选。您的Claude Anthropic API密钥。在console.anthropic.com获取',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: '模型',
		modelDesc: '选择要使用的Claude模型',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: '高级',
		claudeCliPath: 'Claude CLI路径',
		claudeCliPathDesc: 'claude可执行文件的路径。留空以从常见安装路径自动检测。',
		claudeCliPathPlaceholder: '自动检测（留空）',
		claudeCliPathInfo: '常见路径: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: '调试模式',
		debugModeDesc: '启用调试日志以进行故障排除（记录到浏览器控制台）',

		// File Context
		fileContext: '文件上下文',
		includeFileContent: '包含文件内容',
		includeFileContentDesc: '在发送给Claude的上下文中包含当前文件的内容',
		preferSelectedText: '优先选中文本',
		preferSelectedTextDesc: '当有文本被选中时，只包含选中部分而不是整个文件',
		maxContentLength: '最大内容长度',
		maxContentLengthDesc: '从文件中包含的最大字符数（以节省token）',

		// System Prompt
		systemPrompt: '系统提示词',
		customSystemPrompt: '自定义系统提示词',
		customSystemPromptDesc: 'Claude的自定义指令。留空使用默认值。',
		customSystemPromptPlaceholder: '你是一个专门从事...的有用助手',

		// Conversation Saving
		conversationSaving: '对话保存',
		autoSave: '自动保存对话',
		autoSaveDesc: '自动将对话保存到vault中作为markdown文件',
		savePath: '保存路径',
		savePathDesc: 'vault中用于保存对话的文件夹路径',

		// Language
		language: '语言',
		languageDesc: '选择界面语言',
		languageAuto: '自动（系统）',

		// Quick Actions
		quickActions: '快捷操作',
		quickActionsDesc: '配置聊天输入框上方的快捷操作按钮',
		customPromptPlaceholder: '输入自定义提示词（留空使用默认）',
		resetToDefault: '重置为默认值',

		// Plugin Tools
		pluginTools: '插件管理工具',
		pluginToolsDesc: '允许代理列出、启用和禁用Obsidian插件',

		// Built-in Tools
		builtinTools: {
			title: '内置工具',
			description: '启用或禁用内置Claude工具。如果您更喜欢使用MCP替代方案，请禁用。',
			webSearch: '网络搜索',
			webSearchDesc: '在网络上搜索当前信息',
			webFetch: '网页获取',
			webFetchDesc: '获取并分析网页内容',
		},

		// Agent Options
		agentOptions: {
			title: '代理选项',
			description: '配置Claude Agent SDK高级选项',
			maxTurns: '最大轮数',
			maxTurnsDesc: '最大对话轮数。设置为0表示无限制。',
			maxTurnsPlaceholder: '0（无限制）',
			maxBudgetUsd: '最大预算（美元）',
			maxBudgetUsdDesc: '每次会话的最大成本（美元）。设置为0表示无限制。',
			maxBudgetUsdPlaceholder: '0.00（无限制）',
			enableExtendedThinking: 'Extended Thinking',
			enableExtendedThinkingDesc: '使Claude能够更深入地思考复杂问题',
			maxThinkingTokens: '最大思考令牌',
			maxThinkingTokensDesc: 'Extended Thinking的最大令牌数（1,000 - 100,000）',
			permissionMode: {
				title: '权限模式',
				description: '控制Claude的文件和系统访问权限',
				bypassPermissions: '绕过权限',
				bypassPermissionsDesc: '无需确认即可执行所有操作（最大便利性）',
				acceptEdits: '自动批准编辑',
				acceptEditsDesc: '仅自动批准文件编辑',
				default: '默认',
				defaultDesc: '所有操作都需要确认',
				plan: '计划模式',
				planDesc: '仅计划，不执行',
			},
			costDisplay: '会话成本：${cost}',
			costLimitReached: '已达到成本限制。会话已结束。',
			turnLimitReached: '已达到轮数限制。会话已结束。',
		},

		// MCP Servers
		mcp: {
			title: 'MCP服务器',
			description: '配置外部MCP服务器以使用自定义工具和资源',
			addServer: '添加服务器',
			editServer: '编辑服务器',
			deleteServer: '删除服务器',
			deleteConfirm: '确定要删除此服务器吗？',
			serverName: '服务器名称',
			serverNamePlaceholder: '例如: filesystem, weather-api',
			serverType: '服务器类型',
			typeStdio: 'stdio（本地命令）',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: '命令',
			commandPlaceholder: '例如: npx, python',
			args: '参数',
			argsPlaceholder: '例如: -y, @anthropic/mcp-server-filesystem, /path',
			env: '环境变量（JSON）',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: '例如: http://localhost:8080/mcp',
			headers: '请求头（JSON）',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: '已启用',
			save: '保存',
			cancel: '取消',
			duplicateName: '已存在同名服务器',
			invalidJson: 'JSON格式无效',
			statusConnected: '已连接',
			statusFailed: '连接失败',
			statusPending: '连接中...',
			statusNeedsAuth: '需要认证',
			noServers: '未配置MCP服务器。点击"添加服务器"开始。',
			commandNotFound: '命令未找到',
			commandNotFoundDesc: '无法找到命令"{command}"。请输入完整路径（例如: /Users/username/.bun/bin/bunx）',
			commandValidating: '正在验证命令...',
			// Panel translations
			panelTitle: 'MCP服务器',
			panelNoServers: '没有注册的服务器',
			panelNoServersDesc: '在设置中添加MCP服务器',
			panelOpenSettings: '打开设置',
			panelToolsNotConnected: '连接后查看可用工具',
			panelToolsCount: '{count}个工具',
			panelToggleError: '更改服务器状态失败',
			deleteError: '删除服务器失败',
			saveError: '保存服务器失败',
		},

		// Skills
		skills: {
			title: 'Skills',
			description: '从 .claude/skills/ 管理 Claude Agent SDK Skills',
			enable: '启用 Skills',
			enableDesc: '允许 Claude 使用 .claude/skills/ 目录中定义的 Skills',
			createTemplate: '从模板创建',
			createAIWizard: '使用AI创建',
			aiWizardDesc: '描述您希望Skill执行的操作，AI将为您生成。',
			aiPromptLabel: '描述您的Skill',
			aiPromptDesc: '用自然语言解释这个Skill应该做什么',
			aiPromptPlaceholder: '例如：一个帮助格式化markdown表格并正确对齐的技能...',
			generateBtn: '生成',
			generating: '正在生成Skill...',
			invalidName: '无效的Skill名称',
			noSkills: '未找到 Skills',
			noSkillsGuide: '使用下方按钮创建新 Skill，或将 SKILL.md 文件添加到 .claude/skills/{skill-name}/',
			nameLabel: 'Skill 名称',
			nameDesc: '仅使用小写字母、数字和连字符（例如：my-skill）',
			descriptionLabel: '描述',
			descriptionDesc: '描述 Claude 何时应该使用此 Skill',
			descriptionPlaceholder: '此 Skill 有助于...',
			preview: '预览',
			duplicateName: '已存在同名的 Skill',
			parseError: '解析错误',
			fileNotFound: '文件未找到',
			loadError: '加载文件失败',
			edit: '编辑',
			delete: '删除',
			deleteConfirm: '确定要删除 Skill "{name}" 吗？',
			// AI Validation
			validationFailed: '经过 {max} 次尝试后验证失败。请手动检查并编辑内容。',
			validationErrors: '内容存在验证错误:\n{errors}',
			retrying: '正在修复问题... (第 {attempt}/{max} 次尝试)',
			noContentError: '没有生成内容。请先点击"生成"按钮。',
		},

		// About
		about: '关于',
		aboutText1: '此插件使用Claude Agent SDK在Obsidian中直接提供AI驱动的帮助。',
		aboutText2: '代理可以读取文件、执行命令，并帮助处理vault中的各种任务。',
	},

	// Mention system
	mention: {
		noResults: '未找到结果',
		file: '文件',
		folder: '文件夹',
		binaryFile: '二进制文件',
		fileNotFound: '文件未找到',
		fileReadError: '文件读取错误',
		contentTruncated: '... 内容已截断 ...',
		invalidPath: '无效路径',
	},

	// Large file warning
	largeFileWarningTitle: '大文件警告',
	largeFileWarningMessage: "文件 '{path}' 大于100KB ({size})。大文件可能会减慢响应速度。",
	largeFileWarningQuestion: '是否仍要包含此文件？',
	includeAnyway: '仍然包含',
	cancel: '取消',

	// Common translations
	common: {
		close: '关闭',
		cancel: '取消',
		create: '创建',
		save: '保存',
		delete: '删除',
	},
};
