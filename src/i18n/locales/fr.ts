// French translations
import type { TranslationKeys } from './en';

export const fr: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: 'Exemples',
	pluginSettings: 'Paramètres du plugin',
	newChat: 'Nouvelle discussion',
	selectModel: 'Sélectionner le modèle Claude',

	// Quick actions
	quickAction: {
		summarize: 'Résumer',
		summarizePrompt: 'Veuillez résumer ce document de manière concise.',
		improve: 'Améliorer',
		improvePrompt: 'Veuillez améliorer le style d\'écriture et corriger les erreurs.',
		analyze: 'Analyser',
		analyzePrompt: 'Veuillez analyser ce document et fournir des informations.',
		translate: 'Traduire',
		translatePrompt: 'Veuillez traduire ce texte en anglais. S\'il est déjà en anglais, traduisez-le en français.',
	},

	// File context
	currentPage: 'Page actuelle',
	addCurrentPageContext: 'Ajouter le contexte de la page actuelle au message',

	// Input
	inputPlaceholder: 'Tapez votre message (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)...',
	sendMessage: 'Envoyer le message',
	cancelProcessing: 'Annuler le traitement',

	// Context building
	currentFile: 'Fichier actuel',
	selectedText: 'Texte sélectionné',
	fileContent: 'Contenu du fichier',
	truncated: 'tronqué',
	charactersOmitted: 'caractères omis',

	// Errors
	vaultPathError: 'Impossible de déterminer le chemin du vault. Ce plugin nécessite un vault local.',
	executionCancelled: 'Exécution du message annulée',
	error: 'Erreur',
	errorRenderingMessage: 'Erreur lors du rendu du contenu du message',

	// Chat messages
	cooking: 'Traitement en cours...',
	thinking: 'Réflexion...',
	toolResult: 'Résultat de l\'outil',
	usingTool: 'Utilisation de l\'outil',
	noContent: 'Aucun contenu',
	system: 'Système',

	// Todo card
	tasks: 'Tâches',

	// Code block
	copy: 'Copier',
	copied: 'Copié !',

	// Markdown export
	user: 'Utilisateur',
	assistant: 'Assistant',
	result: 'Résultat',
	duration: 'Durée',
	aiChatTitle: 'Discussion IA',

	// Commands
	commands: {
		openNoteSage: 'Ouvrir Note Sage',
		startNewChat: 'Démarrer une nouvelle discussion',
		saveConversation: 'Sauvegarder la conversation actuelle',
		summarizeDocument: 'Note Sage: Résumer le document',
		explainSelection: 'Note Sage: Expliquer la sélection',
		improveWriting: 'Note Sage: Améliorer l\'écriture',
		translateToKorean: 'Note Sage: Traduire en coréen',
		translateToEnglish: 'Note Sage: Traduire en anglais',
		reviewCode: 'Note Sage: Réviser le code',
	},

	// Quick prompts
	prompts: {
		summarize: 'Veuillez résumer ce document de manière concise.',
		explain: 'Veuillez expliquer le texte sélectionné en détail.',
		improve: 'Veuillez améliorer le style d\'écriture et corriger les erreurs de grammaire ou d\'orthographe.',
		translateKo: 'Veuillez traduire ce texte en coréen.',
		translateEn: 'Veuillez traduire ce texte en anglais.',
		codeReview: 'Veuillez réviser ce code et suggérer des améliorations.',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'Clé API Anthropic (Optionnel)',
		apiKeyDesc: 'Optionnel. Votre clé API Anthropic pour Claude. Obtenez-en une sur console.anthropic.com',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'Modèle',
		modelDesc: 'Sélectionnez le modèle Claude à utiliser',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: 'Avancé',
		claudeCliPath: 'Chemin Claude CLI',
		claudeCliPathDesc: 'Chemin vers l\'exécutable claude. Laissez vide pour auto-détection depuis les chemins d\'installation courants.',
		claudeCliPathPlaceholder: 'Auto-détection (laisser vide)',
		claudeCliPathInfo: 'Chemins courants: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'Mode débogage',
		debugModeDesc: 'Activer la journalisation de débogage pour le dépannage (journalise dans la console du navigateur)',

		// File Context
		fileContext: 'Contexte de fichier',
		includeFileContent: 'Inclure le contenu du fichier',
		includeFileContentDesc: 'Inclure le contenu du fichier actuel dans le contexte envoyé à Claude',
		preferSelectedText: 'Préférer le texte sélectionné',
		preferSelectedTextDesc: 'Lorsqu\'un texte est sélectionné, inclure uniquement la sélection au lieu du fichier entier',
		maxContentLength: 'Longueur maximale du contenu',
		maxContentLengthDesc: 'Nombre maximum de caractères à inclure du fichier (pour économiser les tokens)',

		// System Prompt
		systemPrompt: 'Invite système',
		customSystemPrompt: 'Invite système personnalisée',
		customSystemPromptDesc: 'Instructions personnalisées pour Claude. Laissez vide pour utiliser les valeurs par défaut.',
		customSystemPromptPlaceholder: 'Vous êtes un assistant utile spécialisé dans...',

		// Conversation Saving
		conversationSaving: 'Sauvegarde des conversations',
		autoSave: 'Sauvegarde automatique des conversations',
		autoSaveDesc: 'Sauvegarder automatiquement les conversations dans votre vault en fichiers markdown',
		savePath: 'Chemin de sauvegarde',
		savePathDesc: 'Chemin du dossier dans votre vault où les conversations seront sauvegardées',

		// Language
		language: 'Langue',
		languageDesc: 'Sélectionnez la langue de l\'interface',
		languageAuto: 'Auto (Système)',

		// Quick Actions
		quickActions: 'Actions rapides',
		quickActionsDesc: 'Configurer les boutons d\'action rapide au-dessus du champ de saisie du chat',
		customPromptPlaceholder: 'Entrez une invite personnalisée (laisser vide pour défaut)',
		resetToDefault: 'Rétablir les valeurs par défaut',

		// Plugin Tools
		pluginTools: 'Outils de gestion des plugins',
		pluginToolsDesc: 'Permettre à l\'agent de lister, activer et désactiver les plugins Obsidian',

		// MCP Servers
		mcp: {
			title: 'Serveurs MCP',
			description: 'Configurer les serveurs MCP externes pour les outils et ressources personnalisés',
			addServer: 'Ajouter un serveur',
			editServer: 'Modifier le serveur',
			deleteServer: 'Supprimer le serveur',
			deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce serveur ?',
			serverName: 'Nom du serveur',
			serverNamePlaceholder: 'ex., filesystem, weather-api',
			serverType: 'Type de serveur',
			typeStdio: 'stdio (commande locale)',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: 'Commande',
			commandPlaceholder: 'ex., npx, python',
			args: 'Arguments',
			argsPlaceholder: 'ex., -y, @anthropic/mcp-server-filesystem, /path',
			env: 'Variables d\'environnement (JSON)',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: 'ex., http://localhost:8080/mcp',
			headers: 'En-têtes (JSON)',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: 'Activé',
			save: 'Sauvegarder',
			cancel: 'Annuler',
			duplicateName: 'Un serveur avec ce nom existe déjà',
			statusConnected: 'Connecté',
			statusFailed: 'Connexion échouée',
			statusPending: 'Connexion en cours...',
			statusNeedsAuth: 'Authentification requise',
			noServers: 'Aucun serveur MCP configuré. Cliquez sur "Ajouter un serveur" pour commencer.',
			commandNotFound: 'Commande non trouvée',
			commandNotFoundDesc: 'La commande "{command}" n\'a pas pu être trouvée. Veuillez entrer le chemin complet (ex., /Users/username/.bun/bin/bunx)',
			commandValidating: 'Validation de la commande...',
			// Panel translations
			panelTitle: 'Serveurs MCP',
			panelNoServers: 'Aucun serveur enregistré',
			panelNoServersDesc: 'Ajoutez des serveurs MCP dans les paramètres',
			panelOpenSettings: 'Ouvrir les paramètres',
			panelToolsNotConnected: 'Connectez-vous pour voir les outils disponibles',
			panelToolsCount: '{count} outils',
			panelToggleError: 'Échec du changement d\'état du serveur',
		},

		// About
		about: 'À propos',
		aboutText1: 'Ce plugin utilise le Claude Agent SDK pour fournir une assistance alimentée par l\'IA directement dans Obsidian.',
		aboutText2: 'L\'agent peut lire des fichiers, exécuter des commandes et aider avec diverses tâches dans votre vault.',
	},
};
