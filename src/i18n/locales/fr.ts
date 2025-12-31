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
	extendedThinking: 'Pensée étendue',
	toolResult: 'Résultat de l\'outil',
	usingTool: 'Utilisation de l\'outil',
	noContent: 'Aucun contenu',
	system: 'Système',

	// Todo card
	tasks: 'Tâches',

	// Code block
	copy: 'Copier',
	copied: 'Copié !',
	copyFailed: 'Échec',

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

		// Built-in Tools
		builtinTools: {
			title: 'Outils intégrés',
			description: 'Activer ou désactiver les outils Claude intégrés. Désactivez si vous préférez utiliser des alternatives MCP.',
			webSearch: 'Recherche web',
			webSearchDesc: 'Rechercher des informations actuelles sur le web',
			webFetch: 'Récupération web',
			webFetchDesc: 'Récupérer et analyser le contenu des pages web',
		},

		// Agent Options
		agentOptions: {
			title: 'Options de l\'agent',
			description: 'Configurer les options avancées du Claude Agent SDK',
			maxTurns: 'Tours maximum',
			maxTurnsDesc: 'Nombre maximum de tours de conversation. Définir à 0 pour illimité.',
			maxTurnsPlaceholder: '0 (illimité)',
			maxBudgetUsd: 'Budget maximum (USD)',
			maxBudgetUsdDesc: 'Coût maximum par session en USD. Définir à 0 pour illimité.',
			maxBudgetUsdPlaceholder: '0.00 (illimité)',
			enableExtendedThinking: 'Extended Thinking',
			enableExtendedThinkingDesc: 'Permettre à Claude de réfléchir plus profondément aux problèmes complexes',
			maxThinkingTokens: 'Tokens de réflexion maximum',
			maxThinkingTokensDesc: 'Tokens maximum pour Extended Thinking (1 000 - 100 000)',
			permissionMode: {
				title: 'Mode de permission',
				description: 'Contrôler les permissions d\'accès aux fichiers et au système de Claude',
				bypassPermissions: 'Contourner les permissions',
				bypassPermissionsDesc: 'Autoriser toutes les opérations sans confirmation (commodité maximale)',
				acceptEdits: 'Accepter les modifications',
				acceptEditsDesc: 'Approuver automatiquement uniquement les modifications de fichiers',
				default: 'Par défaut',
				defaultDesc: 'Confirmation requise pour toutes les opérations',
				plan: 'Mode planification',
				planDesc: 'Planification uniquement, pas d\'exécution',
			},
			costDisplay: 'Coût de la session : ${cost}',
			costLimitReached: 'Limite de coût atteinte. Session terminée.',
			turnLimitReached: 'Limite de tours atteinte. Session terminée.',
		},

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
			invalidJson: 'Format JSON invalide',
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
			deleteError: 'Échec de la suppression du serveur',
			saveError: 'Échec de la sauvegarde du serveur',
		},

		// Skills
		skills: {
			title: 'Skills',
			description: 'Gérer les Skills Claude Agent SDK depuis .claude/skills/',
			enable: 'Activer les Skills',
			enableDesc: 'Permettre à Claude d\'utiliser les Skills définies dans le répertoire .claude/skills/',
			createTemplate: 'Créer à partir d\'un modèle',
			createAIWizard: 'Créer avec l\'IA',
			aiWizardDesc: 'Décrivez ce que vous voulez que votre Skill fasse et l\'IA le générera pour vous.',
			aiPromptLabel: 'Décrivez votre Skill',
			aiPromptDesc: 'Expliquez ce que ce Skill doit faire en langage naturel',
			aiPromptPlaceholder: 'Ex: Un skill qui aide à formater les tableaux markdown avec un alignement correct...',
			generateBtn: 'Générer',
			generating: 'Génération du Skill...',
			invalidName: 'Nom de Skill invalide',
			noSkills: 'Aucune Skill trouvée',
			noSkillsGuide: 'Créez une nouvelle Skill en utilisant les boutons ci-dessous ou ajoutez des fichiers SKILL.md à .claude/skills/{skill-name}/',
			nameLabel: 'Nom de la Skill',
			nameDesc: 'Utilisez uniquement des lettres minuscules, des chiffres et des tirets (ex: my-skill)',
			descriptionLabel: 'Description',
			descriptionDesc: 'Décrivez quand Claude doit utiliser cette Skill',
			descriptionPlaceholder: 'Cette Skill aide à...',
			preview: 'Aperçu',
			duplicateName: 'Une Skill avec ce nom existe déjà',
			parseError: 'Erreur d\'analyse',
			fileNotFound: 'Fichier non trouvé',
			loadError: 'Échec du chargement du fichier',
			edit: 'Modifier',
			delete: 'Supprimer',
			deleteConfirm: 'Êtes-vous sûr de vouloir supprimer la Skill "{name}" ?',
			// AI Validation
			validationFailed: 'La validation a échoué après {max} tentatives. Veuillez vérifier et modifier le contenu manuellement.',
			validationErrors: 'Le contenu contient des erreurs de validation:\n{errors}',
			retrying: 'Correction des problèmes... (tentative {attempt}/{max})',
			noContentError: 'Aucun contenu généré. Veuillez d\'abord cliquer sur "Générer".',
		},

		// About
		about: 'À propos',
		aboutText1: 'Ce plugin utilise le Claude Agent SDK pour fournir une assistance alimentée par l\'IA directement dans Obsidian.',
		aboutText2: 'L\'agent peut lire des fichiers, exécuter des commandes et aider avec diverses tâches dans votre vault.',
	},

	// Mention system
	mention: {
		noResults: 'Aucun résultat trouvé',
		file: 'Fichier',
		folder: 'Dossier',
		binaryFile: 'Fichier binaire',
		fileNotFound: 'Fichier non trouvé',
		fileReadError: 'Erreur de lecture du fichier',
		contentTruncated: '... contenu tronqué ...',
		invalidPath: 'Chemin invalide',
	},

	// Large file warning
	largeFileWarningTitle: 'Avertissement fichier volumineux',
	largeFileWarningMessage: "Le fichier '{path}' est supérieur à 100Ko ({size}). Les fichiers volumineux peuvent ralentir la réponse.",
	largeFileWarningQuestion: 'Voulez-vous quand même inclure ce fichier ?',
	includeAnyway: 'Inclure quand même',
	cancel: 'Annuler',

	// Common translations
	common: {
		close: 'Fermer',
		cancel: 'Annuler',
		create: 'Créer',
		save: 'Enregistrer',
		delete: 'Supprimer',
	},
};
