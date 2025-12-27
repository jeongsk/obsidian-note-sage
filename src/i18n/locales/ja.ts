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

		// Plugin Tools
		pluginTools: 'プラグイン管理ツール',
		pluginToolsDesc: 'エージェントがObsidianプラグインの一覧表示、有効化、無効化を行うことを許可',

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
			statusPending: '接続中...',
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

		// About
		about: '概要',
		aboutText1: 'このプラグインはClaude Agent SDKを使用して、Obsidian内で直接AIアシスタンスを提供します。',
		aboutText2: 'エージェントはファイルの読み取り、コマンドの実行、vault内のさまざまなタスクを支援できます。',
	},
};
