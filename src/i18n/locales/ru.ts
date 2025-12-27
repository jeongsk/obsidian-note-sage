// Russian translations
import type { TranslationKeys } from './en';

export const ru: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: 'Примеры',
	pluginSettings: 'Настройки плагина',
	newChat: 'Новый чат',
	selectModel: 'Выбрать модель Claude',

	// Quick actions
	quickAction: {
		summarize: 'Резюме',
		summarizePrompt: 'Пожалуйста, кратко изложите этот документ.',
		improve: 'Улучшить',
		improvePrompt: 'Пожалуйста, улучшите стиль написания и исправьте ошибки.',
		analyze: 'Анализ',
		analyzePrompt: 'Пожалуйста, проанализируйте этот документ и предоставьте выводы.',
		translate: 'Перевод',
		translatePrompt: 'Пожалуйста, переведите этот текст на английский. Если уже на английском, переведите на русский.',
	},

	// File context
	currentPage: 'Текущая страница',
	addCurrentPageContext: 'Добавить контекст текущей страницы к сообщению',

	// Input
	inputPlaceholder: 'Введите сообщение (Enter для отправки, Shift+Enter для новой строки)...',
	sendMessage: 'Отправить сообщение',
	cancelProcessing: 'Отменить обработку',

	// Context building
	currentFile: 'Текущий файл',
	selectedText: 'Выделенный текст',
	fileContent: 'Содержимое файла',
	truncated: 'усечено',
	charactersOmitted: 'символов опущено',

	// Errors
	vaultPathError: 'Не удалось определить путь к хранилищу. Этот плагин требует локальное хранилище.',
	executionCancelled: 'Выполнение сообщения отменено',
	error: 'Ошибка',
	errorRenderingMessage: 'Ошибка при отображении содержимого сообщения',

	// Chat messages
	cooking: 'Обработка...',
	thinking: 'Думаю...',
	toolResult: 'Результат инструмента',
	usingTool: 'Использую инструмент',
	noContent: 'Нет содержимого',
	system: 'Система',

	// Todo card
	tasks: 'Задачи',

	// Code block
	copy: 'Копировать',
	copied: 'Скопировано!',
	copyFailed: 'Ошибка',

	// Markdown export
	user: 'Пользователь',
	assistant: 'Ассистент',
	result: 'Результат',
	duration: 'Длительность',
	aiChatTitle: 'ИИ Чат',

	// Commands
	commands: {
		openNoteSage: 'Открыть Note Sage',
		startNewChat: 'Начать новый чат',
		saveConversation: 'Сохранить текущий разговор',
		summarizeDocument: 'Note Sage: Резюмировать документ',
		explainSelection: 'Note Sage: Объяснить выделение',
		improveWriting: 'Note Sage: Улучшить текст',
		translateToKorean: 'Note Sage: Перевести на корейский',
		translateToEnglish: 'Note Sage: Перевести на английский',
		reviewCode: 'Note Sage: Проверить код',
	},

	// Quick prompts
	prompts: {
		summarize: 'Пожалуйста, кратко изложите этот документ.',
		explain: 'Пожалуйста, подробно объясните выделенный текст.',
		improve: 'Пожалуйста, улучшите стиль написания и исправьте грамматические или орфографические ошибки.',
		translateKo: 'Пожалуйста, переведите этот текст на корейский.',
		translateEn: 'Пожалуйста, переведите этот текст на английский.',
		codeReview: 'Пожалуйста, проверьте этот код и предложите улучшения.',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'API ключ Anthropic (Необязательно)',
		apiKeyDesc: 'Необязательно. Ваш API ключ Anthropic для Claude. Получите на console.anthropic.com',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'Модель',
		modelDesc: 'Выберите модель Claude для использования',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: 'Дополнительно',
		claudeCliPath: 'Путь к Claude CLI',
		claudeCliPathDesc: 'Путь к исполняемому файлу claude. Оставьте пустым для автоматического определения из стандартных путей установки.',
		claudeCliPathPlaceholder: 'Автоопределение (оставьте пустым)',
		claudeCliPathInfo: 'Стандартные пути: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'Режим отладки',
		debugModeDesc: 'Включить отладочное логирование для устранения неполадок (записывает в консоль браузера)',

		// File Context
		fileContext: 'Контекст файла',
		includeFileContent: 'Включить содержимое файла',
		includeFileContentDesc: 'Включить содержимое текущего файла в контекст, отправляемый Claude',
		preferSelectedText: 'Предпочитать выделенный текст',
		preferSelectedTextDesc: 'Если текст выделен, включать только выделение вместо всего файла',
		maxContentLength: 'Максимальная длина содержимого',
		maxContentLengthDesc: 'Максимальное количество символов для включения из файла (для экономии токенов)',

		// System Prompt
		systemPrompt: 'Системный промпт',
		customSystemPrompt: 'Пользовательский системный промпт',
		customSystemPromptDesc: 'Пользовательские инструкции для Claude. Оставьте пустым для использования значений по умолчанию.',
		customSystemPromptPlaceholder: 'Вы — полезный ассистент, специализирующийся на...',

		// Conversation Saving
		conversationSaving: 'Сохранение разговоров',
		autoSave: 'Автосохранение разговоров',
		autoSaveDesc: 'Автоматически сохранять разговоры в хранилище как markdown файлы',
		savePath: 'Путь сохранения',
		savePathDesc: 'Путь к папке в хранилище, где будут сохраняться разговоры',

		// Language
		language: 'Язык',
		languageDesc: 'Выберите язык интерфейса',
		languageAuto: 'Авто (Система)',

		// Quick Actions
		quickActions: 'Быстрые действия',
		quickActionsDesc: 'Настроить кнопки быстрых действий над полем ввода чата',
		customPromptPlaceholder: 'Введите пользовательский промпт (оставьте пустым для значения по умолчанию)',
		resetToDefault: 'Сбросить к значениям по умолчанию',

		// Plugin Tools
		pluginTools: 'Инструменты управления плагинами',
		pluginToolsDesc: 'Разрешить агенту перечислять, включать и отключать плагины Obsidian',

		// MCP Servers
		mcp: {
			title: 'MCP Серверы',
			description: 'Настроить внешние MCP серверы для пользовательских инструментов и ресурсов',
			addServer: 'Добавить сервер',
			editServer: 'Редактировать сервер',
			deleteServer: 'Удалить сервер',
			deleteConfirm: 'Вы уверены, что хотите удалить этот сервер?',
			serverName: 'Имя сервера',
			serverNamePlaceholder: 'напр., filesystem, weather-api',
			serverType: 'Тип сервера',
			typeStdio: 'stdio (локальная команда)',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: 'Команда',
			commandPlaceholder: 'напр., npx, python',
			args: 'Аргументы',
			argsPlaceholder: 'напр., -y, @anthropic/mcp-server-filesystem, /path',
			env: 'Переменные окружения (JSON)',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: 'напр., http://localhost:8080/mcp',
			headers: 'Заголовки (JSON)',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: 'Включено',
			save: 'Сохранить',
			cancel: 'Отмена',
			duplicateName: 'Сервер с таким именем уже существует',
			invalidJson: 'Неверный формат JSON',
			statusConnected: 'Подключено',
			statusFailed: 'Ошибка подключения',
			statusPending: 'Подключение...',
			statusNeedsAuth: 'Требуется аутентификация',
			noServers: 'MCP серверы не настроены. Нажмите "Добавить сервер" для начала.',
			commandNotFound: 'Команда не найдена',
			commandNotFoundDesc: 'Команда "{command}" не найдена. Пожалуйста, введите полный путь (напр., /Users/username/.bun/bin/bunx)',
			commandValidating: 'Проверка команды...',
			// Panel translations
			panelTitle: 'MCP Серверы',
			panelNoServers: 'Нет зарегистрированных серверов',
			panelNoServersDesc: 'Добавьте MCP серверы в настройках',
			panelOpenSettings: 'Открыть настройки',
			panelToolsNotConnected: 'Подключитесь для просмотра доступных инструментов',
			panelToolsCount: '{count} инструментов',
			panelToggleError: 'Не удалось изменить статус сервера',
			deleteError: 'Не удалось удалить сервер',
			saveError: 'Не удалось сохранить сервер',
		},

		// About
		about: 'О плагине',
		aboutText1: 'Этот плагин использует Claude Agent SDK для предоставления помощи на основе ИИ непосредственно в Obsidian.',
		aboutText2: 'Агент может читать файлы, выполнять команды и помогать с различными задачами в вашем хранилище.',
	},
};
