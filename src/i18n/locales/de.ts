// German translations
import type { TranslationKeys } from './en';

export const de: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: 'Beispiele',
	pluginSettings: 'Plugin-Einstellungen',
	newChat: 'Neuer Chat',
	selectModel: 'Claude-Modell auswählen',

	// Quick actions
	quickAction: {
		summarize: 'Zusammenfassen',
		summarizePrompt: 'Bitte fassen Sie dieses Dokument prägnant zusammen.',
		improve: 'Verbessern',
		improvePrompt: 'Bitte verbessern Sie den Schreibstil und korrigieren Sie Fehler.',
		analyze: 'Analysieren',
		analyzePrompt: 'Bitte analysieren Sie dieses Dokument und geben Sie Einblicke.',
		translate: 'Übersetzen',
		translatePrompt: 'Bitte übersetzen Sie diesen Text ins Englische. Falls bereits auf Englisch, übersetzen Sie ins Deutsche.',
	},

	// File context
	currentPage: 'Aktuelle Seite',
	addCurrentPageContext: 'Kontext der aktuellen Seite zur Nachricht hinzufügen',

	// Input
	inputPlaceholder: 'Nachricht eingeben (Enter zum Senden, Umschalt+Enter für neue Zeile)...',
	sendMessage: 'Nachricht senden',
	cancelProcessing: 'Verarbeitung abbrechen',

	// Context building
	currentFile: 'Aktuelle Datei',
	selectedText: 'Ausgewählter Text',
	fileContent: 'Dateiinhalt',
	truncated: 'gekürzt',
	charactersOmitted: 'Zeichen ausgelassen',

	// Errors
	vaultPathError: 'Vault-Pfad konnte nicht ermittelt werden. Dieses Plugin erfordert einen lokalen Vault.',
	executionCancelled: 'Nachrichtenausführung abgebrochen',
	error: 'Fehler',
	errorRenderingMessage: 'Fehler beim Rendern des Nachrichteninhalts',

	// Chat messages
	cooking: 'Verarbeitung...',
	thinking: 'Nachdenken...',
	toolResult: 'Werkzeugergebnis',
	usingTool: 'Werkzeug wird verwendet',
	noContent: 'Kein Inhalt',
	system: 'System',

	// Todo card
	tasks: 'Aufgaben',

	// Code block
	copy: 'Kopieren',
	copied: 'Kopiert!',
	copyFailed: 'Fehler',

	// Markdown export
	user: 'Benutzer',
	assistant: 'Assistent',
	result: 'Ergebnis',
	duration: 'Dauer',
	aiChatTitle: 'KI-Chat',

	// Commands
	commands: {
		openNoteSage: 'Note Sage öffnen',
		startNewChat: 'Neuen Chat starten',
		saveConversation: 'Aktuelle Unterhaltung speichern',
		summarizeDocument: 'Note Sage: Dokument zusammenfassen',
		explainSelection: 'Note Sage: Auswahl erklären',
		improveWriting: 'Note Sage: Schreiben verbessern',
		translateToKorean: 'Note Sage: Ins Koreanische übersetzen',
		translateToEnglish: 'Note Sage: Ins Englische übersetzen',
		reviewCode: 'Note Sage: Code überprüfen',
	},

	// Quick prompts
	prompts: {
		summarize: 'Bitte fassen Sie dieses Dokument prägnant zusammen.',
		explain: 'Bitte erklären Sie den ausgewählten Text ausführlich.',
		improve: 'Bitte verbessern Sie den Schreibstil und korrigieren Sie Grammatik- oder Rechtschreibfehler.',
		translateKo: 'Bitte übersetzen Sie diesen Text ins Koreanische.',
		translateEn: 'Bitte übersetzen Sie diesen Text ins Englische.',
		codeReview: 'Bitte überprüfen Sie diesen Code und schlagen Sie Verbesserungen vor.',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'Anthropic API-Schlüssel (Optional)',
		apiKeyDesc: 'Optional. Ihr Anthropic API-Schlüssel für Claude. Erhalten Sie einen unter console.anthropic.com',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'Modell',
		modelDesc: 'Wählen Sie das zu verwendende Claude-Modell',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: 'Erweitert',
		claudeCliPath: 'Claude CLI-Pfad',
		claudeCliPathDesc: 'Pfad zur claude-Ausführungsdatei. Leer lassen für automatische Erkennung aus üblichen Installationspfaden.',
		claudeCliPathPlaceholder: 'Automatische Erkennung (leer lassen)',
		claudeCliPathInfo: 'Übliche Pfade: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'Debug-Modus',
		debugModeDesc: 'Debug-Protokollierung zur Fehlerbehebung aktivieren (protokolliert in Browser-Konsole)',

		// File Context
		fileContext: 'Dateikontext',
		includeFileContent: 'Dateiinhalt einschließen',
		includeFileContentDesc: 'Den Inhalt der aktuellen Datei in den an Claude gesendeten Kontext einschließen',
		preferSelectedText: 'Ausgewählten Text bevorzugen',
		preferSelectedTextDesc: 'Wenn Text ausgewählt ist, nur die Auswahl anstelle der gesamten Datei einschließen',
		maxContentLength: 'Maximale Inhaltslänge',
		maxContentLengthDesc: 'Maximale Anzahl von Zeichen, die aus der Datei eingeschlossen werden sollen (um Tokens zu sparen)',

		// System Prompt
		systemPrompt: 'System-Prompt',
		customSystemPrompt: 'Benutzerdefinierter System-Prompt',
		customSystemPromptDesc: 'Benutzerdefinierte Anweisungen für Claude. Leer lassen für Standardwerte.',
		customSystemPromptPlaceholder: 'Sie sind ein hilfreicher Assistent, spezialisiert auf...',

		// Conversation Saving
		conversationSaving: 'Unterhaltungen speichern',
		autoSave: 'Unterhaltungen automatisch speichern',
		autoSaveDesc: 'Unterhaltungen automatisch als Markdown-Dateien in Ihrem Vault speichern',
		savePath: 'Speicherpfad',
		savePathDesc: 'Ordnerpfad in Ihrem Vault, wo Unterhaltungen gespeichert werden',

		// Language
		language: 'Sprache',
		languageDesc: 'Wählen Sie die Sprache der Benutzeroberfläche',
		languageAuto: 'Auto (System)',

		// Quick Actions
		quickActions: 'Schnellaktionen',
		quickActionsDesc: 'Schnellaktionsschaltflächen über dem Chat-Eingabefeld konfigurieren',
		customPromptPlaceholder: 'Benutzerdefinierten Prompt eingeben (leer für Standard)',
		resetToDefault: 'Auf Standard zurücksetzen',

		// Plugin Tools
		pluginTools: 'Plugin-Verwaltungswerkzeuge',
		pluginToolsDesc: 'Dem Agenten erlauben, Obsidian-Plugins aufzulisten, zu aktivieren und zu deaktivieren',

		// MCP Servers
		mcp: {
			title: 'MCP-Server',
			description: 'Externe MCP-Server für benutzerdefinierte Werkzeuge und Ressourcen konfigurieren',
			addServer: 'Server hinzufügen',
			editServer: 'Server bearbeiten',
			deleteServer: 'Server löschen',
			deleteConfirm: 'Sind Sie sicher, dass Sie diesen Server löschen möchten?',
			serverName: 'Servername',
			serverNamePlaceholder: 'z.B., filesystem, weather-api',
			serverType: 'Servertyp',
			typeStdio: 'stdio (lokaler Befehl)',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: 'Befehl',
			commandPlaceholder: 'z.B., npx, python',
			args: 'Argumente',
			argsPlaceholder: 'z.B., -y, @anthropic/mcp-server-filesystem, /path',
			env: 'Umgebungsvariablen (JSON)',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: 'z.B., http://localhost:8080/mcp',
			headers: 'Header (JSON)',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: 'Aktiviert',
			save: 'Speichern',
			cancel: 'Abbrechen',
			duplicateName: 'Ein Server mit diesem Namen existiert bereits',
			invalidJson: 'Ungültiges JSON-Format',
			statusConnected: 'Verbunden',
			statusFailed: 'Verbindung fehlgeschlagen',
			statusPending: 'Verbinde...',
			statusNeedsAuth: 'Authentifizierung erforderlich',
			noServers: 'Keine MCP-Server konfiguriert. Klicken Sie auf "Server hinzufügen", um zu beginnen.',
			commandNotFound: 'Befehl nicht gefunden',
			commandNotFoundDesc: 'Der Befehl "{command}" konnte nicht gefunden werden. Bitte geben Sie den vollständigen Pfad ein (z.B., /Users/username/.bun/bin/bunx)',
			commandValidating: 'Befehl wird validiert...',
			// Panel translations
			panelTitle: 'MCP-Server',
			panelNoServers: 'Keine Server registriert',
			panelNoServersDesc: 'MCP-Server in den Einstellungen hinzufügen',
			panelOpenSettings: 'Einstellungen öffnen',
			panelToolsNotConnected: 'Verbinden, um verfügbare Werkzeuge anzuzeigen',
			panelToolsCount: '{count} Werkzeuge',
			panelToggleError: 'Serverstatus konnte nicht geändert werden',
			deleteError: 'Server konnte nicht gelöscht werden',
			saveError: 'Server konnte nicht gespeichert werden',
		},

		// About
		about: 'Über',
		aboutText1: 'Dieses Plugin verwendet das Claude Agent SDK, um KI-gestützte Unterstützung direkt in Obsidian bereitzustellen.',
		aboutText2: 'Der Agent kann Dateien lesen, Befehle ausführen und bei verschiedenen Aufgaben in Ihrem Vault helfen.',
	},
};
