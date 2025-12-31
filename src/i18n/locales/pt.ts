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
	extendedThinking: 'Pensamento estendido',
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

		// Built-in Tools
		builtinTools: {
			title: 'Ferramentas integradas',
			description: 'Ativar ou desativar ferramentas Claude integradas. Desative se preferir usar alternativas MCP.',
			webSearch: 'Pesquisa web',
			webSearchDesc: 'Pesquisar informações atuais na web',
			webFetch: 'Buscar web',
			webFetchDesc: 'Buscar e analisar conteúdo de páginas web',
		},

		// Agent Options
		agentOptions: {
			title: 'Opções do agente',
			description: 'Configurar opções avançadas do Claude Agent SDK',
			maxTurns: 'Turnos máximos',
			maxTurnsDesc: 'Número máximo de turnos de conversa. Defina como 0 para ilimitado.',
			maxTurnsPlaceholder: '0 (ilimitado)',
			maxBudgetUsd: 'Orçamento máximo (USD)',
			maxBudgetUsdDesc: 'Custo máximo por sessão em USD. Defina como 0 para ilimitado.',
			maxBudgetUsdPlaceholder: '0.00 (ilimitado)',
			enableExtendedThinking: 'Extended Thinking',
			enableExtendedThinkingDesc: 'Permitir que Claude pense mais profundamente sobre problemas complexos',
			maxThinkingTokens: 'Tokens de pensamento máximos',
			maxThinkingTokensDesc: 'Máximo de tokens para Extended Thinking (1.000 - 100.000)',
			permissionMode: {
				title: 'Modo de permissão',
				description: 'Controlar as permissões de acesso a arquivos e sistema do Claude',
				bypassPermissions: 'Ignorar permissões',
				bypassPermissionsDesc: 'Permitir todas as operações sem confirmação (máxima conveniência)',
				acceptEdits: 'Aceitar edições',
				acceptEditsDesc: 'Aprovar automaticamente apenas edições de arquivos',
				default: 'Padrão',
				defaultDesc: 'Requer confirmação para todas as operações',
				plan: 'Modo planejamento',
				planDesc: 'Apenas planejamento, sem execução',
			},
			costDisplay: 'Custo da sessão: ${cost}',
			costLimitReached: 'Limite de custo atingido. Sessão encerrada.',
			turnLimitReached: 'Limite de turnos atingido. Sessão encerrada.',
		},

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

		// Skills
		skills: {
			title: 'Skills',
			description: 'Gerenciar Skills do Claude Agent SDK de .claude/skills/',
			enable: 'Ativar Skills',
			enableDesc: 'Permitir que Claude use Skills definidas no diretório .claude/skills/',
			createTemplate: 'Criar a partir de modelo',
			createAIWizard: 'Criar com IA',
			aiWizardDesc: 'Descreva o que você quer que seu Skill faça e a IA irá gerá-lo para você.',
			aiPromptLabel: 'Descreva seu Skill',
			aiPromptDesc: 'Explique o que este Skill deve fazer em linguagem natural',
			aiPromptPlaceholder: 'Ex: Um skill que ajuda a formatar tabelas markdown com alinhamento correto...',
			generateBtn: 'Gerar',
			generating: 'Gerando Skill...',
			invalidName: 'Nome de Skill inválido',
			noSkills: 'Nenhuma Skill encontrada',
			noSkillsGuide: 'Crie uma nova Skill usando os botões abaixo ou adicione arquivos SKILL.md a .claude/skills/{skill-name}/',
			nameLabel: 'Nome da Skill',
			nameDesc: 'Use apenas letras minúsculas, números e hífens (ex: my-skill)',
			descriptionLabel: 'Descrição',
			descriptionDesc: 'Descreva quando Claude deve usar esta Skill',
			descriptionPlaceholder: 'Esta Skill ajuda com...',
			instructionsLabel: 'Instruções',
			instructionsDesc: 'Instruções que Claude deve seguir ao executar esta Skill',
			instructionsPlaceholder: 'Descreva como esta Skill deve funcionar e quais tarefas executar...',
			examplesLabel: 'Exemplos',
			examplesDesc: 'Exemplos de uso que demonstram esta Skill',
			examplesPlaceholder: 'Escreva exemplos de entradas e saídas esperadas...',
			preview: 'Visualização',
			duplicateName: 'Uma Skill com este nome já existe',
			parseError: 'Erro de análise',
			fileNotFound: 'Arquivo não encontrado',
			loadError: 'Falha ao carregar arquivo',
			edit: 'Editar',
			delete: 'Excluir',
			deleteConfirm: 'Tem certeza de que deseja excluir a Skill "{name}"?',
			// AI Validation
			validationFailed: 'A validação falhou após {max} tentativas. Por favor, verifique e edite o conteúdo manualmente.',
			validationErrors: 'O conteúdo tem erros de validação:\n{errors}',
			retrying: 'Corrigindo problemas... (tentativa {attempt}/{max})',
			noContentError: 'Nenhum conteúdo gerado. Por favor, clique em "Gerar" primeiro.',
		},

		// About
		about: 'Sobre',
		aboutText1: 'Este plugin usa o Claude Agent SDK para fornecer assistência alimentada por IA diretamente no Obsidian.',
		aboutText2: 'O agente pode ler arquivos, executar comandos e ajudar com várias tarefas no seu vault.',
	},

	// Mention system
	mention: {
		noResults: 'Nenhum resultado encontrado',
		file: 'Arquivo',
		folder: 'Pasta',
		binaryFile: 'Arquivo binário',
		fileNotFound: 'Arquivo não encontrado',
		fileReadError: 'Erro ao ler arquivo',
		contentTruncated: '... conteúdo truncado ...',
		invalidPath: 'Caminho inválido',
	},

	// Large file warning
	largeFileWarningTitle: 'Aviso de arquivo grande',
	largeFileWarningMessage: "O arquivo '{path}' é maior que 100KB ({size}). Arquivos grandes podem retardar a resposta.",
	largeFileWarningQuestion: 'Deseja incluir este arquivo mesmo assim?',
	includeAnyway: 'Incluir mesmo assim',
	cancel: 'Cancelar',

	// Common translations
	common: {
		close: 'Fechar',
		cancel: 'Cancelar',
		create: 'Criar',
		save: 'Salvar',
		delete: 'Excluir',
	},
};
