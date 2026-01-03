// Japanese translations
import type { TranslationKeys } from './en';

export const ja: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: '例',
	pluginSettings: 'プラグイン設定',
	newChat: '新しいチャット',
	selectModel: 'Claudeモデルを選択',

	// Quick actions
	quickAction: {
		summarize: '要約',
		summarizePrompt: 'この文書を簡潔に要約してください。',
		improve: '改善',
		improvePrompt: '文章のスタイルを改善し、エラーを修正してください。',
		analyze: '分析',
		analyzePrompt: 'この文書を分析し、洞察を提供してください。',
		translate: '翻訳',
		translatePrompt: 'このテキストを英語に翻訳してください。すでに英語の場合は、日本語に翻訳してください。',
	},

	// File context
	currentPage: '現在のページ',
	addCurrentPageContext: '現在のページのコンテキストをメッセージに追加',

	// Input
	inputPlaceholder: 'メッセージを入力（Enterで送信、Shift+Enterで改行）...',
	sendMessage: 'メッセージを送信',
	cancelProcessing: '処理をキャンセル',

	// Context building
	currentFile: '現在のファイル',
	selectedText: '選択されたテキスト',
	fileContent: 'ファイルの内容',
	truncated: '切り詰め',
	charactersOmitted: '文字省略',

	// Errors
	vaultPathError: 'vaultパスを特定できません。このプラグインはローカルvaultが必要です。',
	executionCancelled: 'メッセージの実行がキャンセルされました',
	error: 'エラー',
	errorRenderingMessage: 'メッセージ内容のレンダリング中にエラーが発生しました',

	// Chat messages
	cooking: '処理中...',
	thinking: '考え中...',
	extendedThinking: '拡張思考',
	toolResult: 'ツールの結果',
	usingTool: 'ツールを使用中',
	noContent: 'コンテンツなし',
	system: 'システム',

	// Todo card
	tasks: 'タスク',

	// Code block
	copy: 'コピー',
	copied: 'コピーしました！',
	copyFailed: '失敗',

	// Markdown export
	user: 'ユーザー',
	assistant: 'アシスタント',
	result: '結果',
	duration: '所要時間',
	aiChatTitle: 'AIチャット',

	// Commands
	commands: {
		openNoteSage: 'Note Sageを開く',
		startNewChat: '新しいチャットを開始',
		saveConversation: '現在の会話を保存',
		summarizeDocument: 'Note Sage: ドキュメントを要約',
		explainSelection: 'Note Sage: 選択範囲を説明',
		improveWriting: 'Note Sage: 文章を改善',
		translateToKorean: 'Note Sage: 韓国語に翻訳',
		translateToEnglish: 'Note Sage: 英語に翻訳',
		reviewCode: 'Note Sage: コードをレビュー',
	},

	// Quick prompts
	prompts: {
		summarize: 'この文書を簡潔に要約してください。',
		explain: '選択されたテキストを詳しく説明してください。',
		improve: '文章のスタイルを改善し、文法やスペルのエラーを修正してください。',
		translateKo: 'このテキストを韓国語に翻訳してください。',
		translateEn: 'このテキストを英語に翻訳してください。',
		codeReview: 'このコードをレビューし、改善点を提案してください。',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'Anthropic APIキー（オプション）',
		apiKeyDesc: 'オプション。Claude用のAnthropic APIキー。console.anthropic.comで取得してください',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'モデル',
		modelDesc: '使用するClaudeモデルを選択',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: '詳細設定',
		claudeCliPath: 'Claude CLIパス',
		claudeCliPathDesc: 'claude実行ファイルへのパス。一般的なインストールパスから自動検出するには空のままにしてください。',
		claudeCliPathPlaceholder: '自動検出（空のまま）',
		claudeCliPathInfo: '一般的なパス: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'デバッグモード',
		debugModeDesc: 'トラブルシューティング用のデバッグログを有効にする（ブラウザコンソールに記録）',

		// File Context
		fileContext: 'ファイルコンテキスト',
		includeFileContent: 'ファイル内容を含める',
		includeFileContentDesc: 'Claudeに送信するコンテキストに現在のファイルの内容を含める',
		preferSelectedText: '選択テキストを優先',
		preferSelectedTextDesc: 'テキストが選択されている場合、ファイル全体ではなく選択部分のみを含める',
		maxContentLength: '最大コンテンツ長',
		maxContentLengthDesc: 'ファイルから含める最大文字数（トークン節約のため）',

		// System Prompt
		systemPrompt: 'システムプロンプト',
		customSystemPrompt: 'カスタムシステムプロンプト',
		customSystemPromptDesc: 'Claude用のカスタム指示。デフォルトを使用するには空のままにしてください。',
		customSystemPromptPlaceholder: 'あなたは...に特化した有能なアシスタントです',

		// Conversation Saving
		conversationSaving: '会話の保存',
		autoSave: '会話を自動保存',
		autoSaveDesc: 'vaultにマークダウンファイルとして会話を自動保存する',
		savePath: '保存パス',
		savePathDesc: '会話が保存されるvault内のフォルダパス',

		// Language
		language: '言語',
		languageDesc: 'インターフェースの言語を選択',
		languageAuto: '自動（システム）',

		// Quick Actions
		quickActions: 'クイックアクション',
		quickActionsDesc: 'チャット入力欄の上にあるクイックアクションボタンを設定',
		customPromptPlaceholder: 'カスタムプロンプトを入力（デフォルトは空のまま）',
		resetToDefault: 'デフォルトにリセット',

		// Custom Quick Actions
		customQuickActions: {
			title: 'カスタムクイックアクション',
			add: 'カスタムクイックアクションを追加',
			name: '名前',
			namePlaceholder: '例: コードレビュー',
			prompt: 'プロンプト',
			promptPlaceholder: '送信するプロンプトを入力...',
			delete: '削除',
			deleteConfirm: '「{name}」を削除してもよろしいですか？',
			moveUp: '上に移動',
			moveDown: '下に移動',
			empty: 'カスタムクイックアクションはありません。「追加」をクリックして作成してください。',
			noActions: 'カスタムクイックアクションなし',
			noActionsGuide: '下のボタンをクリックして新しいクイックアクションを作成してください。',
			untitled: '無題',
		},

		// Plugin Tools
		pluginTools: 'プラグイン管理ツール',
		pluginToolsDesc: 'エージェントがObsidianプラグインの一覧表示、有効化、無効化を行うことを許可',

		// Built-in Tools
		builtinTools: {
			title: '組み込みツール',
			description: '組み込みClaudeツールを有効または無効にします。MCP代替を使用したい場合は無効にしてください。',
			webSearch: 'Web検索',
			webSearchDesc: 'Web上の最新情報を検索',
			webFetch: 'Webフェッチ',
			webFetchDesc: 'Webページのコンテンツを取得して分析',
		},

		// Agent Options
		agentOptions: {
			title: 'エージェントオプション',
			description: 'Claude Agent SDKの詳細オプションを設定',
			maxTurns: '最大ターン数',
			maxTurnsDesc: '最大会話ターン数。0で無制限。',
			maxTurnsPlaceholder: '0（無制限）',
			maxBudgetUsd: '最大予算（USD）',
			maxBudgetUsdDesc: 'セッションあたりの最大コスト（USD）。0で無制限。',
			maxBudgetUsdPlaceholder: '0.00（無制限）',
			enableExtendedThinking: 'Extended Thinking',
			enableExtendedThinkingDesc: 'Claudeが複雑な問題についてより深く考えるようにします',
			maxThinkingTokens: '最大思考トークン',
			maxThinkingTokensDesc: 'Extended Thinkingの最大トークン数（1,000 - 100,000）',
			permissionMode: {
				title: '権限モード',
				description: 'Claudeのファイルおよびシステムアクセス権限を制御',
				bypassPermissions: '権限をバイパス',
				bypassPermissionsDesc: '確認なしですべての操作を許可（最大の利便性）',
				acceptEdits: '編集を自動承認',
				acceptEditsDesc: 'ファイル編集のみ自動承認',
				default: 'デフォルト',
				defaultDesc: 'すべての操作に確認が必要',
				plan: 'プランモード',
				planDesc: '計画のみ、実行なし',
			},
			costDisplay: 'セッションコスト: ${cost}',
			costLimitReached: 'コスト上限に達しました。セッションが終了しました。',
			turnLimitReached: 'ターン上限に達しました。セッションが終了しました。',
		},

		// MCP Servers
		mcp: {
			title: 'MCPサーバー',
			description: 'カスタムツールとリソース用の外部MCPサーバーを設定',
			addServer: 'サーバーを追加',
			editServer: 'サーバーを編集',
			deleteServer: 'サーバーを削除',
			deleteConfirm: 'このサーバーを削除してもよろしいですか？',
			serverName: 'サーバー名',
			serverNamePlaceholder: '例: filesystem, weather-api',
			serverType: 'サーバータイプ',
			typeStdio: 'stdio（ローカルコマンド）',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: 'コマンド',
			commandPlaceholder: '例: npx, python',
			args: '引数',
			argsPlaceholder: '例: -y, @anthropic/mcp-server-filesystem, /path',
			env: '環境変数（JSON）',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: '例: http://localhost:8080/mcp',
			headers: 'ヘッダー（JSON）',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: '有効',
			save: '保存',
			cancel: 'キャンセル',
			duplicateName: 'この名前のサーバーは既に存在します',
			invalidJson: 'JSON形式が無効です',
			statusConnected: '接続済み',
			statusFailed: '接続失敗',
			statusPending: 'チャット開始時に接続します',
			statusNeedsAuth: '認証が必要',
			noServers: 'MCPサーバーが設定されていません。「サーバーを追加」をクリックして開始してください。',
			commandNotFound: 'コマンドが見つかりません',
			commandNotFoundDesc: 'コマンド「{command}」が見つかりませんでした。完全なパスを入力してください（例: /Users/username/.bun/bin/bunx）',
			commandValidating: 'コマンドを検証中...',
			// Panel translations
			panelTitle: 'MCPサーバー',
			panelNoServers: '登録されたサーバーがありません',
			panelNoServersDesc: '設定でMCPサーバーを追加してください',
			panelOpenSettings: '設定を開く',
			panelToolsNotConnected: '接続して利用可能なツールを表示',
			panelToolsCount: '{count}個のツール',
			panelToggleError: 'サーバーステータスの変更に失敗しました',
			deleteError: 'サーバーの削除に失敗しました',
			saveError: 'サーバーの保存に失敗しました',
		},

		// Skills
		skills: {
			title: 'Skills',
			description: '.claude/skills/からClaude Agent SDK Skillsを管理',
			enable: 'Skillsを有効化',
			enableDesc: '.claude/skills/ディレクトリで定義されたSkillsをClaudeが使用できるようにする',
			createTemplate: 'テンプレートから作成',
			createAIWizard: 'AIで作成',
			aiWizardDesc: 'Skillの動作を説明すると、AIが自動的に生成します。',
			aiPromptLabel: 'Skillの説明',
			aiPromptDesc: 'このSkillが何をすべきかを自然言語で説明してください',
			aiPromptPlaceholder: '例：マークダウンテーブルを適切に整列してフォーマットするスキル...',
			generateBtn: '生成',
			generating: 'Skillを生成中...',
			invalidName: '無効なSkill名です',
			noSkills: 'Skillsが見つかりません',
			noSkillsGuide: '下のボタンで新しいSkillを作成するか、.claude/skills/{skill-name}/にSKILL.mdファイルを追加してください',
			nameLabel: 'Skill名',
			nameDesc: '英小文字、数字、ハイフンのみ使用可能（例：my-skill）',
			descriptionLabel: '説明',
			descriptionDesc: 'ClaudeがこのSkillを使用すべき状況を説明',
			descriptionPlaceholder: 'このSkillは...に役立ちます',
			instructionsLabel: 'Instructions',
			instructionsDesc: 'ClaudeがこのSkillを実行する際に従うべき指示',
			instructionsPlaceholder: 'Skillの動作方法と実行すべきタスクを説明してください...',
			examplesLabel: 'Examples',
			examplesDesc: 'このSkillの使用例を示すサンプル',
			examplesPlaceholder: '入力例と予想される出力を記述してください...',
			preview: 'プレビュー',
			duplicateName: 'この名前のSkillは既に存在します',
			parseError: 'パースエラー',
			fileNotFound: 'ファイルが見つかりません',
			loadError: 'ファイルの読み込みに失敗しました',
			edit: '編集',
			delete: '削除',
			deleteConfirm: 'Skill「{name}」を削除してもよろしいですか？',
			deleteTitle: 'Skillを削除',
			deleteConfirmMessage: '{name}を削除してもよろしいですか？',
			deleteUndoHint: '10秒以内にこの操作を取り消すことができます。',
			deleteSuccess: 'Skill「{name}」が削除されました。',
			deleteError: 'Skillの削除に失敗しました: {error}',
			undo: '元に戻す',
			restoreSuccess: 'Skillが復元されました。',
			restoreError: 'Skillの復元に失敗しました。',
			// AI Validation
			validationFailed: '{max}回の試行後、検証に失敗しました。内容を手動で確認して修正してください。',
			validationErrors: 'コンテンツに検証エラーがあります:\n{errors}',
			retrying: '問題を修正中... ({attempt}/{max}回目)',
			noContentError: '生成されたコンテンツがありません。まず「生成」ボタンをクリックしてください。',
			// Edit Modal
			editTitle: 'Skillを編集',
			contentLabel: 'コンテンツ',
			contentDesc: 'マークダウン本文全体（自由編集）',
			contentPlaceholder: '# skill-name\n\n## Instructions\n\n...',
			updateSuccess: 'Skillが更新されました',
			updateError: 'Skillの更新中にエラーが発生しました',
			skillsCount: '{count}個のSkill',
			activeCount: '{active}個が有効',
			// Documentation link
			docsLink: '公式ドキュメントを見る',
		},

		// About
		about: '概要',
		aboutText1: 'このプラグインはClaude Agent SDKを使用して、Obsidian内で直接AIアシスタンスを提供します。',
		aboutText2: 'エージェントはファイルの読み取り、コマンドの実行、vault内のさまざまなタスクを支援できます。',
	},

	// Mention system
	mention: {
		noResults: '検索結果がありません',
		file: 'ファイル',
		folder: 'フォルダ',
		binaryFile: 'バイナリファイル',
		fileNotFound: 'ファイルが見つかりません',
		fileReadError: 'ファイル読み取りエラー',
		contentTruncated: '... コンテンツが切り捨てられました ...',
		invalidPath: '無効なパス',
	},

	// Large file warning
	largeFileWarningTitle: '大容量ファイル警告',
	largeFileWarningMessage: "ファイル '{path}' は100KB以上です ({size})。大容量ファイルは応答速度を低下させる可能性があります。",
	largeFileWarningQuestion: 'それでもこのファイルを含めますか？',
	includeAnyway: 'それでも含める',
	cancel: 'キャンセル',

	// Common translations
	common: {
		close: '閉じる',
		cancel: 'キャンセル',
		create: '作成',
		save: '保存',
		delete: '削除',
	},
};
