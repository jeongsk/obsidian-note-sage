// Spanish translations
import type { TranslationKeys } from './en';

export const es: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: 'Ejemplos',
	pluginSettings: 'Configuración del plugin',
	newChat: 'Nuevo chat',
	selectModel: 'Seleccionar modelo Claude',

	// Quick actions
	quickAction: {
		summarize: 'Resumir',
		summarizePrompt: 'Por favor, resume este documento de forma concisa.',
		improve: 'Mejorar',
		improvePrompt: 'Por favor, mejora el estilo de escritura y corrige los errores.',
		analyze: 'Analizar',
		analyzePrompt: 'Por favor, analiza este documento y proporciona información.',
		translate: 'Traducir',
		translatePrompt: 'Por favor, traduce este texto al inglés. Si ya está en inglés, tradúcelo al español.',
	},

	// File context
	currentPage: 'Página actual',
	addCurrentPageContext: 'Agregar contexto de la página actual al mensaje',

	// Input
	inputPlaceholder: 'Escribe tu mensaje (Enter para enviar, Shift+Enter para nueva línea)...',
	sendMessage: 'Enviar mensaje',
	cancelProcessing: 'Cancelar procesamiento',

	// Context building
	currentFile: 'Archivo actual',
	selectedText: 'Texto seleccionado',
	fileContent: 'Contenido del archivo',
	truncated: 'truncado',
	charactersOmitted: 'caracteres omitidos',

	// Errors
	vaultPathError: 'No se puede determinar la ruta del vault. Este plugin requiere un vault local.',
	executionCancelled: 'Ejecución del mensaje cancelada',
	error: 'Error',
	errorRenderingMessage: 'Error al renderizar el contenido del mensaje',

	// Chat messages
	cooking: 'Procesando...',
	thinking: 'Pensando...',
	toolResult: 'Resultado de herramienta',
	usingTool: 'Usando herramienta',
	noContent: 'Sin contenido',
	system: 'Sistema',

	// Todo card
	tasks: 'Tareas',

	// Code block
	copy: 'Copiar',
	copied: '¡Copiado!',

	// Markdown export
	user: 'Usuario',
	assistant: 'Asistente',
	result: 'Resultado',
	duration: 'Duración',
	aiChatTitle: 'Chat IA',

	// Commands
	commands: {
		openNoteSage: 'Abrir Note Sage',
		startNewChat: 'Iniciar nuevo chat',
		saveConversation: 'Guardar conversación actual',
		summarizeDocument: 'Note Sage: Resumir documento',
		explainSelection: 'Note Sage: Explicar selección',
		improveWriting: 'Note Sage: Mejorar escritura',
		translateToKorean: 'Note Sage: Traducir al coreano',
		translateToEnglish: 'Note Sage: Traducir al inglés',
		reviewCode: 'Note Sage: Revisar código',
	},

	// Quick prompts
	prompts: {
		summarize: 'Por favor, resume este documento de forma concisa.',
		explain: 'Por favor, explica el texto seleccionado en detalle.',
		improve: 'Por favor, mejora el estilo de escritura y corrige errores gramaticales u ortográficos.',
		translateKo: 'Por favor, traduce este texto al coreano.',
		translateEn: 'Por favor, traduce este texto al inglés.',
		codeReview: 'Por favor, revisa este código y sugiere mejoras.',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'Clave API de Anthropic (Opcional)',
		apiKeyDesc: 'Opcional. Tu clave API de Anthropic para Claude. Obtén una en console.anthropic.com',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'Modelo',
		modelDesc: 'Selecciona el modelo Claude a usar',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: 'Avanzado',
		claudeCliPath: 'Ruta de Claude CLI',
		claudeCliPathDesc: 'Ruta al ejecutable claude. Déjalo vacío para auto-detectar desde rutas de instalación comunes.',
		claudeCliPathPlaceholder: 'Auto-detectar (dejar vacío)',
		claudeCliPathInfo: 'Rutas comunes: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'Modo depuración',
		debugModeDesc: 'Habilitar registro de depuración para solución de problemas (registra en consola del navegador)',

		// File Context
		fileContext: 'Contexto de archivo',
		includeFileContent: 'Incluir contenido del archivo',
		includeFileContentDesc: 'Incluir el contenido del archivo actual en el contexto enviado a Claude',
		preferSelectedText: 'Preferir texto seleccionado',
		preferSelectedTextDesc: 'Cuando hay texto seleccionado, incluir solo la selección en lugar del archivo completo',
		maxContentLength: 'Longitud máxima de contenido',
		maxContentLengthDesc: 'Número máximo de caracteres a incluir del archivo (para ahorrar tokens)',

		// System Prompt
		systemPrompt: 'Prompt del sistema',
		customSystemPrompt: 'Prompt del sistema personalizado',
		customSystemPromptDesc: 'Instrucciones personalizadas para Claude. Déjalo vacío para usar valores predeterminados.',
		customSystemPromptPlaceholder: 'Eres un asistente útil especializado en...',

		// Conversation Saving
		conversationSaving: 'Guardado de conversaciones',
		autoSave: 'Auto-guardar conversaciones',
		autoSaveDesc: 'Guardar automáticamente conversaciones en tu vault como archivos markdown',
		savePath: 'Ruta de guardado',
		savePathDesc: 'Ruta de carpeta en tu vault donde se guardarán las conversaciones',

		// Language
		language: 'Idioma',
		languageDesc: 'Selecciona el idioma de la interfaz',
		languageAuto: 'Auto (Sistema)',

		// Quick Actions
		quickActions: 'Acciones rápidas',
		quickActionsDesc: 'Configurar botones de acción rápida sobre el campo de entrada del chat',
		customPromptPlaceholder: 'Ingresa prompt personalizado (dejar vacío para predeterminado)',
		resetToDefault: 'Restablecer valores predeterminados',

		// Plugin Tools
		pluginTools: 'Herramientas de gestión de plugins',
		pluginToolsDesc: 'Permitir al agente listar, habilitar y deshabilitar plugins de Obsidian',

		// MCP Servers
		mcp: {
			title: 'Servidores MCP',
			description: 'Configurar servidores MCP externos para herramientas y recursos personalizados',
			addServer: 'Agregar servidor',
			editServer: 'Editar servidor',
			deleteServer: 'Eliminar servidor',
			deleteConfirm: '¿Estás seguro de que quieres eliminar este servidor?',
			serverName: 'Nombre del servidor',
			serverNamePlaceholder: 'ej., filesystem, weather-api',
			serverType: 'Tipo de servidor',
			typeStdio: 'stdio (comando local)',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: 'Comando',
			commandPlaceholder: 'ej., npx, python',
			args: 'Argumentos',
			argsPlaceholder: 'ej., -y, @anthropic/mcp-server-filesystem, /path',
			env: 'Variables de entorno (JSON)',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: 'ej., http://localhost:8080/mcp',
			headers: 'Encabezados (JSON)',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: 'Habilitado',
			save: 'Guardar',
			cancel: 'Cancelar',
			duplicateName: 'Ya existe un servidor con este nombre',
			statusConnected: 'Conectado',
			statusFailed: 'Conexión fallida',
			statusPending: 'Conectando...',
			statusNeedsAuth: 'Autenticación requerida',
			noServers: 'No hay servidores MCP configurados. Haz clic en "Agregar servidor" para comenzar.',
			commandNotFound: 'Comando no encontrado',
			commandNotFoundDesc: 'El comando "{command}" no se pudo encontrar. Por favor ingresa la ruta completa (ej., /Users/username/.bun/bin/bunx)',
			commandValidating: 'Validando comando...',
			// Panel translations
			panelTitle: 'Servidores MCP',
			panelNoServers: 'No hay servidores registrados',
			panelNoServersDesc: 'Agrega servidores MCP en configuración',
			panelOpenSettings: 'Abrir Configuración',
			panelToolsNotConnected: 'Conéctate para ver herramientas disponibles',
			panelToolsCount: '{count} herramientas',
			panelToggleError: 'Error al cambiar estado del servidor',
		},

		// About
		about: 'Acerca de',
		aboutText1: 'Este plugin usa el Claude Agent SDK para proporcionar asistencia impulsada por IA directamente dentro de Obsidian.',
		aboutText2: 'El agente puede leer archivos, ejecutar comandos y ayudar con varias tareas en tu vault.',
	},
};
