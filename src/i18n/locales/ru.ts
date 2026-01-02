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
	extendedThinking: 'Расширенное мышление',
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

		// Built-in Tools
		builtinTools: {
			title: 'Встроенные инструменты',
			description: 'Включить или отключить встроенные инструменты Claude. Отключите, если предпочитаете альтернативы MCP.',
			webSearch: 'Веб-поиск',
			webSearchDesc: 'Поиск актуальной информации в интернете',
			webFetch: 'Веб-загрузка',
			webFetchDesc: 'Загрузка и анализ содержимого веб-страниц',
		},

		// Agent Options
		agentOptions: {
			title: 'Параметры агента',
			description: 'Настроить расширенные параметры Claude Agent SDK',
			maxTurns: 'Максимум ходов',
			maxTurnsDesc: 'Максимальное количество ходов разговора. Установите 0 для неограниченного.',
			maxTurnsPlaceholder: '0 (неограниченно)',
			maxBudgetUsd: 'Максимальный бюджет (USD)',
			maxBudgetUsdDesc: 'Максимальная стоимость за сессию в USD. Установите 0 для неограниченного.',
			maxBudgetUsdPlaceholder: '0.00 (неограниченно)',
			enableExtendedThinking: 'Extended Thinking',
			enableExtendedThinkingDesc: 'Позволить Claude более глубоко обдумывать сложные проблемы',
			maxThinkingTokens: 'Максимум токенов размышления',
			maxThinkingTokensDesc: 'Максимум токенов для Extended Thinking (1 000 - 100 000)',
			permissionMode: {
				title: 'Режим разрешений',
				description: 'Управлять правами доступа Claude к файлам и системе',
				bypassPermissions: 'Обходить разрешения',
				bypassPermissionsDesc: 'Разрешить все операции без подтверждения (максимальное удобство)',
				acceptEdits: 'Принимать редактирование',
				acceptEditsDesc: 'Автоматически одобрять только редактирование файлов',
				default: 'По умолчанию',
				defaultDesc: 'Требуется подтверждение для всех операций',
				plan: 'Режим планирования',
				planDesc: 'Только планирование, без выполнения',
			},
			costDisplay: 'Стоимость сессии: ${cost}',
			costLimitReached: 'Достигнут лимит стоимости. Сессия завершена.',
			turnLimitReached: 'Достигнут лимит ходов. Сессия завершена.',
		},

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
			statusPending: 'Подключается при начале чата',
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

		// Skills
		skills: {
			title: 'Skills',
			description: 'Управление Skills Claude Agent SDK из .claude/skills/',
			enable: 'Включить Skills',
			enableDesc: 'Разрешить Claude использовать Skills, определённые в каталоге .claude/skills/',
			createTemplate: 'Создать из шаблона',
			createAIWizard: 'Создать с помощью ИИ',
			aiWizardDesc: 'Опишите, что должен делать ваш Skill, и ИИ сгенерирует его за вас.',
			aiPromptLabel: 'Опишите ваш Skill',
			aiPromptDesc: 'Объясните на естественном языке, что должен делать этот Skill',
			aiPromptPlaceholder: 'Например: Навык, который помогает форматировать markdown-таблицы с правильным выравниванием...',
			generateBtn: 'Сгенерировать',
			generating: 'Генерация Skill...',
			invalidName: 'Недопустимое имя Skill',
			noSkills: 'Skills не найдены',
			noSkillsGuide: 'Создайте новый Skill с помощью кнопок ниже или добавьте файлы SKILL.md в .claude/skills/{skill-name}/',
			nameLabel: 'Название Skill',
			nameDesc: 'Используйте только строчные буквы, цифры и дефисы (например: my-skill)',
			descriptionLabel: 'Описание',
			descriptionDesc: 'Опишите, когда Claude должен использовать этот Skill',
			descriptionPlaceholder: 'Этот Skill помогает с...',
			instructionsLabel: 'Инструкции',
			instructionsDesc: 'Инструкции, которым Claude должен следовать при выполнении этого Skill',
			instructionsPlaceholder: 'Опишите, как должен работать этот Skill и какие задачи выполнять...',
			examplesLabel: 'Примеры',
			examplesDesc: 'Примеры использования, демонстрирующие этот Skill',
			examplesPlaceholder: 'Напишите примеры входных данных и ожидаемых результатов...',
			preview: 'Предпросмотр',
			duplicateName: 'Skill с таким именем уже существует',
			parseError: 'Ошибка разбора',
			fileNotFound: 'Файл не найден',
			loadError: 'Не удалось загрузить файл',
			edit: 'Редактировать',
			delete: 'Удалить',
			deleteConfirm: 'Вы уверены, что хотите удалить Skill "{name}"?',
			deleteTitle: 'Удалить Skill',
			deleteConfirmMessage: 'Вы уверены, что хотите удалить {name}?',
			deleteUndoHint: 'Вы можете отменить это действие в течение 10 секунд.',
			deleteSuccess: 'Skill "{name}" был удален.',
			deleteError: 'Не удалось удалить Skill: {error}',
			undo: 'Отменить',
			restoreSuccess: 'Skill был восстановлен.',
			restoreError: 'Не удалось восстановить Skill.',
			// AI Validation
			validationFailed: 'Проверка не удалась после {max} попыток. Пожалуйста, проверьте и отредактируйте содержимое вручную.',
			validationErrors: 'Содержимое имеет ошибки валидации:\n{errors}',
			retrying: 'Исправление проблем... (попытка {attempt}/{max})',
			noContentError: 'Содержимое не сгенерировано. Сначала нажмите "Сгенерировать".',
			// Edit Modal
			editTitle: 'Редактировать навык',
			contentLabel: 'Содержимое',
			contentDesc: 'Полный текст в Markdown (свободное редактирование)',
			contentPlaceholder: '# skill-name\n\n## Instructions\n\n...',
			updateSuccess: 'Навык успешно обновлён',
			updateError: 'Ошибка при обновлении навыка',
			skillsCount: '{count} навыков',
			activeCount: '{active} активно',
			// Documentation link
			docsLink: 'Смотреть официальную документацию',
		},

		// About
		about: 'О плагине',
		aboutText1: 'Этот плагин использует Claude Agent SDK для предоставления помощи на основе ИИ непосредственно в Obsidian.',
		aboutText2: 'Агент может читать файлы, выполнять команды и помогать с различными задачами в вашем хранилище.',
	},

	// Mention system
	mention: {
		noResults: 'Результаты не найдены',
		file: 'Файл',
		folder: 'Папка',
		binaryFile: 'Бинарный файл',
		fileNotFound: 'Файл не найден',
		fileReadError: 'Ошибка чтения файла',
		contentTruncated: '... содержимое обрезано ...',
		invalidPath: 'Недействительный путь',
	},

	// Large file warning
	largeFileWarningTitle: 'Предупреждение: большой файл',
	largeFileWarningMessage: "Файл '{path}' больше 100КБ ({size}). Большие файлы могут замедлить ответ.",
	largeFileWarningQuestion: 'Вы все равно хотите включить этот файл?',
	includeAnyway: 'Включить все равно',
	cancel: 'Отмена',

	// Common translations
	common: {
		close: 'Закрыть',
		cancel: 'Отмена',
		create: 'Создать',
		save: 'Сохранить',
		delete: 'Удалить',
	},
};
