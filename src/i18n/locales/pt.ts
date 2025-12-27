// Portuguese translations
import type { TranslationKeys } from './en';

export const pt: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: 'Exemplos',
	pluginSettings: 'Configurações do plugin',
	newChat: 'Novo chat',
	selectModel: 'Selecionar modelo Claude',

	// Quick actions
	quickAction: {
		summarize: 'Resumir',
		summarizePrompt: 'Por favor, resuma este documento de forma concisa.',
		improve: 'Melhorar',
		improvePrompt: 'Por favor, melhore o estilo de escrita e corrija os erros.',
		analyze: 'Analisar',
		analyzePrompt: 'Por favor, analise este documento e forneça insights.',
		translate: 'Traduzir',
		translatePrompt: 'Por favor, traduza este texto para inglês. Se já estiver em inglês, traduza para português.',
	},

	// File context
	currentPage: 'Página atual',
	addCurrentPageContext: 'Adicionar contexto da página atual à mensagem',

	// Input
	inputPlaceholder: 'Digite sua mensagem (Enter para enviar, Shift+Enter para nova linha)...',
	sendMessage: 'Enviar mensagem',
	cancelProcessing: 'Cancelar processamento',

	// Context building
	currentFile: 'Arquivo atual',
	selectedText: 'Texto selecionado',
	fileContent: 'Conteúdo do arquivo',
	truncated: 'truncado',
	charactersOmitted: 'caracteres omitidos',

	// Errors
	vaultPathError: 'Não foi possível determinar o caminho do vault. Este plugin requer um vault local.',
	executionCancelled: 'Execução da mensagem cancelada',
	error: 'Erro',
	errorRenderingMessage: 'Erro ao renderizar o conteúdo da mensagem',

	// Chat messages
	cooking: 'Processando...',
	thinking: 'Pensando...',
	toolResult: 'Resultado da ferramenta',
	usingTool: 'Usando ferramenta',
	noContent: 'Sem conteúdo',
	system: 'Sistema',

	// Todo card
	tasks: 'Tarefas',

	// Code block
	copy: 'Copiar',
	copied: 'Copiado!',
	copyFailed: 'Falhou',

	// Markdown export
	user: 'Usuário',
	assistant: 'Assistente',
	result: 'Resultado',
	duration: 'Duração',
	aiChatTitle: 'Chat IA',

	// Commands
	commands: {
		openNoteSage: 'Abrir Note Sage',
		startNewChat: 'Iniciar novo chat',
		saveConversation: 'Salvar conversa atual',
		summarizeDocument: 'Note Sage: Resumir documento',
		explainSelection: 'Note Sage: Explicar seleção',
		improveWriting: 'Note Sage: Melhorar escrita',
		translateToKorean: 'Note Sage: Traduzir para coreano',
		translateToEnglish: 'Note Sage: Traduzir para inglês',
		reviewCode: 'Note Sage: Revisar código',
	},

	// Quick prompts
	prompts: {
		summarize: 'Por favor, resuma este documento de forma concisa.',
		explain: 'Por favor, explique o texto selecionado em detalhes.',
		improve: 'Por favor, melhore o estilo de escrita e corrija erros gramaticais ou de ortografia.',
		translateKo: 'Por favor, traduza este texto para coreano.',
		translateEn: 'Por favor, traduza este texto para inglês.',
		codeReview: 'Por favor, revise este código e sugira melhorias.',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'Chave API Anthropic (Opcional)',
		apiKeyDesc: 'Opcional. Sua chave API Anthropic para Claude. Obtenha uma em console.anthropic.com',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'Modelo',
		modelDesc: 'Selecione o modelo Claude a ser usado',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: 'Avançado',
		claudeCliPath: 'Caminho do Claude CLI',
		claudeCliPathDesc: 'Caminho para o executável claude. Deixe vazio para auto-detecção de caminhos de instalação comuns.',
		claudeCliPathPlaceholder: 'Auto-detectar (deixar vazio)',
		claudeCliPathInfo: 'Caminhos comuns: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'Modo de depuração',
		debugModeDesc: 'Ativar registro de depuração para solução de problemas (registra no console do navegador)',

		// File Context
		fileContext: 'Contexto do arquivo',
		includeFileContent: 'Incluir conteúdo do arquivo',
		includeFileContentDesc: 'Incluir o conteúdo do arquivo atual no contexto enviado ao Claude',
		preferSelectedText: 'Preferir texto selecionado',
		preferSelectedTextDesc: 'Quando há texto selecionado, incluir apenas a seleção em vez do arquivo inteiro',
		maxContentLength: 'Comprimento máximo do conteúdo',
		maxContentLengthDesc: 'Número máximo de caracteres a incluir do arquivo (para economizar tokens)',

		// System Prompt
		systemPrompt: 'Prompt do sistema',
		customSystemPrompt: 'Prompt do sistema personalizado',
		customSystemPromptDesc: 'Instruções personalizadas para Claude. Deixe vazio para usar padrões.',
		customSystemPromptPlaceholder: 'Você é um assistente útil especializado em...',

		// Conversation Saving
		conversationSaving: 'Salvamento de conversas',
		autoSave: 'Salvar conversas automaticamente',
		autoSaveDesc: 'Salvar automaticamente conversas no seu vault como arquivos markdown',
		savePath: 'Caminho de salvamento',
		savePathDesc: 'Caminho da pasta no seu vault onde as conversas serão salvas',

		// Language
		language: 'Idioma',
		languageDesc: 'Selecione o idioma da interface',
		languageAuto: 'Auto (Sistema)',

		// Quick Actions
		quickActions: 'Ações rápidas',
		quickActionsDesc: 'Configurar botões de ação rápida acima do campo de entrada do chat',
		customPromptPlaceholder: 'Digite prompt personalizado (deixar vazio para padrão)',
		resetToDefault: 'Restaurar padrões',

		// Plugin Tools
		pluginTools: 'Ferramentas de gerenciamento de plugins',
		pluginToolsDesc: 'Permitir que o agente liste, ative e desative plugins do Obsidian',

		// MCP Servers
		mcp: {
			title: 'Servidores MCP',
			description: 'Configurar servidores MCP externos para ferramentas e recursos personalizados',
			addServer: 'Adicionar servidor',
			editServer: 'Editar servidor',
			deleteServer: 'Excluir servidor',
			deleteConfirm: 'Tem certeza de que deseja excluir este servidor?',
			serverName: 'Nome do servidor',
			serverNamePlaceholder: 'ex., filesystem, weather-api',
			serverType: 'Tipo de servidor',
			typeStdio: 'stdio (comando local)',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: 'Comando',
			commandPlaceholder: 'ex., npx, python',
			args: 'Argumentos',
			argsPlaceholder: 'ex., -y, @anthropic/mcp-server-filesystem, /path',
			env: 'Variáveis de ambiente (JSON)',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: 'ex., http://localhost:8080/mcp',
			headers: 'Cabeçalhos (JSON)',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: 'Ativado',
			save: 'Salvar',
			cancel: 'Cancelar',
			duplicateName: 'Já existe um servidor com este nome',
			invalidJson: 'Formato JSON inválido',
			statusConnected: 'Conectado',
			statusFailed: 'Conexão falhou',
			statusPending: 'Conectando...',
			statusNeedsAuth: 'Autenticação necessária',
			noServers: 'Nenhum servidor MCP configurado. Clique em "Adicionar servidor" para começar.',
			commandNotFound: 'Comando não encontrado',
			commandNotFoundDesc: 'O comando "{command}" não foi encontrado. Por favor, insira o caminho completo (ex., /Users/username/.bun/bin/bunx)',
			commandValidating: 'Validando comando...',
			// Panel translations
			panelTitle: 'Servidores MCP',
			panelNoServers: 'Nenhum servidor registrado',
			panelNoServersDesc: 'Adicione servidores MCP nas configurações',
			panelOpenSettings: 'Abrir Configurações',
			panelToolsNotConnected: 'Conecte para ver ferramentas disponíveis',
			panelToolsCount: '{count} ferramentas',
			panelToggleError: 'Falha ao alterar status do servidor',
			deleteError: 'Falha ao excluir servidor',
			saveError: 'Falha ao salvar servidor',
		},

		// About
		about: 'Sobre',
		aboutText1: 'Este plugin usa o Claude Agent SDK para fornecer assistência alimentada por IA diretamente no Obsidian.',
		aboutText2: 'O agente pode ler arquivos, executar comandos e ajudar com várias tarefas no seu vault.',
	},
};
