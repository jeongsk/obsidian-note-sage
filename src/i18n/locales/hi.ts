// Hindi translations
import type { TranslationKeys } from './en';

export const hi: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: 'उदाहरण',
	pluginSettings: 'प्लगइन सेटिंग्स',
	newChat: 'नई चैट',
	selectModel: 'Claude मॉडल चुनें',

	// Quick actions
	quickAction: {
		summarize: 'सारांश',
		summarizePrompt: 'कृपया इस दस्तावेज़ को संक्षेप में सारांशित करें।',
		improve: 'सुधारें',
		improvePrompt: 'कृपया लेखन शैली में सुधार करें और त्रुटियों को ठीक करें।',
		analyze: 'विश्लेषण',
		analyzePrompt: 'कृपया इस दस्तावेज़ का विश्लेषण करें और अंतर्दृष्टि प्रदान करें।',
		translate: 'अनुवाद',
		translatePrompt: 'कृपया इस पाठ का अंग्रेजी में अनुवाद करें। यदि पहले से अंग्रेजी में है, तो हिंदी में अनुवाद करें।',
	},

	// File context
	currentPage: 'वर्तमान पृष्ठ',
	addCurrentPageContext: 'संदेश में वर्तमान पृष्ठ का संदर्भ जोड़ें',

	// Input
	inputPlaceholder: 'अपना संदेश टाइप करें (भेजने के लिए Enter, नई पंक्ति के लिए Shift+Enter)...',
	sendMessage: 'संदेश भेजें',
	cancelProcessing: 'प्रोसेसिंग रद्द करें',

	// Context building
	currentFile: 'वर्तमान फ़ाइल',
	selectedText: 'चयनित पाठ',
	fileContent: 'फ़ाइल सामग्री',
	truncated: 'कटा हुआ',
	charactersOmitted: 'वर्ण छोड़े गए',

	// Errors
	vaultPathError: 'vault पथ निर्धारित करने में असमर्थ। इस प्लगइन के लिए स्थानीय vault आवश्यक है।',
	executionCancelled: 'संदेश निष्पादन रद्द',
	error: 'त्रुटि',
	errorRenderingMessage: 'संदेश सामग्री प्रदर्शित करने में त्रुटि',

	// Chat messages
	cooking: 'प्रोसेसिंग...',
	thinking: 'सोच रहा हूँ...',
	extendedThinking: 'विस्तृत सोच',
	toolResult: 'टूल परिणाम',
	usingTool: 'टूल का उपयोग कर रहा हूँ',
	noContent: 'कोई सामग्री नहीं',
	system: 'सिस्टम',

	// Todo card
	tasks: 'कार्य',

	// Code block
	copy: 'कॉपी करें',
	copied: 'कॉपी हो गया!',
	copyFailed: 'विफल',

	// Markdown export
	user: 'उपयोगकर्ता',
	assistant: 'सहायक',
	result: 'परिणाम',
	duration: 'अवधि',
	aiChatTitle: 'AI चैट',

	// Commands
	commands: {
		openNoteSage: 'Note Sage खोलें',
		startNewChat: 'नई चैट शुरू करें',
		saveConversation: 'वर्तमान बातचीत सहेजें',
		summarizeDocument: 'Note Sage: दस्तावेज़ सारांश',
		explainSelection: 'Note Sage: चयन की व्याख्या करें',
		improveWriting: 'Note Sage: लेखन सुधारें',
		translateToKorean: 'Note Sage: कोरियाई में अनुवाद करें',
		translateToEnglish: 'Note Sage: अंग्रेजी में अनुवाद करें',
		reviewCode: 'Note Sage: कोड समीक्षा',
	},

	// Quick prompts
	prompts: {
		summarize: 'कृपया इस दस्तावेज़ को संक्षेप में सारांशित करें।',
		explain: 'कृपया चयनित पाठ को विस्तार से समझाएं।',
		improve: 'कृपया लेखन शैली में सुधार करें और व्याकरण या वर्तनी त्रुटियों को ठीक करें।',
		translateKo: 'कृपया इस पाठ का कोरियाई में अनुवाद करें।',
		translateEn: 'कृपया इस पाठ का अंग्रेजी में अनुवाद करें।',
		codeReview: 'कृपया इस कोड की समीक्षा करें और सुधार सुझाएं।',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'Anthropic API कुंजी (वैकल्पिक)',
		apiKeyDesc: 'वैकल्पिक। Claude के लिए आपकी Anthropic API कुंजी। console.anthropic.com पर प्राप्त करें',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'मॉडल',
		modelDesc: 'उपयोग के लिए Claude मॉडल चुनें',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: 'उन्नत',
		claudeCliPath: 'Claude CLI पथ',
		claudeCliPathDesc: 'claude निष्पादन योग्य का पथ। सामान्य इंस्टॉलेशन पथों से स्वतः पहचान के लिए खाली छोड़ें।',
		claudeCliPathPlaceholder: 'स्वतः पहचान (खाली छोड़ें)',
		claudeCliPathInfo: 'सामान्य पथ: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'डिबग मोड',
		debugModeDesc: 'समस्या निवारण के लिए डिबग लॉगिंग सक्षम करें (ब्राउज़र कंसोल में लॉग करता है)',

		// File Context
		fileContext: 'फ़ाइल संदर्भ',
		includeFileContent: 'फ़ाइल सामग्री शामिल करें',
		includeFileContentDesc: 'Claude को भेजे गए संदर्भ में वर्तमान फ़ाइल की सामग्री शामिल करें',
		preferSelectedText: 'चयनित पाठ प्राथमिकता दें',
		preferSelectedTextDesc: 'जब पाठ चयनित हो, पूरी फ़ाइल के बजाय केवल चयन शामिल करें',
		maxContentLength: 'अधिकतम सामग्री लंबाई',
		maxContentLengthDesc: 'फ़ाइल से शामिल करने के लिए अधिकतम वर्णों की संख्या (टोकन बचाने के लिए)',

		// System Prompt
		systemPrompt: 'सिस्टम प्रॉम्प्ट',
		customSystemPrompt: 'कस्टम सिस्टम प्रॉम्प्ट',
		customSystemPromptDesc: 'Claude के लिए कस्टम निर्देश। डिफ़ॉल्ट का उपयोग करने के लिए खाली छोड़ें।',
		customSystemPromptPlaceholder: 'आप एक सहायक सहायक हैं जो विशेषज्ञ हैं...',

		// Conversation Saving
		conversationSaving: 'बातचीत सहेजना',
		autoSave: 'बातचीत स्वतः सहेजें',
		autoSaveDesc: 'बातचीत को markdown फ़ाइलों के रूप में अपने vault में स्वतः सहेजें',
		savePath: 'सहेजने का पथ',
		savePathDesc: 'आपके vault में फ़ोल्डर पथ जहां बातचीत सहेजी जाएगी',

		// Language
		language: 'भाषा',
		languageDesc: 'इंटरफ़ेस भाषा चुनें',
		languageAuto: 'स्वतः (सिस्टम)',

		// Quick Actions
		quickActions: 'त्वरित कार्रवाइयां',
		quickActionsDesc: 'चैट इनपुट फ़ील्ड के ऊपर त्वरित कार्रवाई बटन कॉन्फ़िगर करें',
		customPromptPlaceholder: 'कस्टम प्रॉम्प्ट दर्ज करें (डिफ़ॉल्ट के लिए खाली छोड़ें)',
		resetToDefault: 'डिफ़ॉल्ट पर रीसेट करें',

		// Custom Quick Actions
		customQuickActions: {
			title: 'कस्टम त्वरित कार्रवाइयां',
			add: 'कस्टम त्वरित कार्रवाई जोड़ें',
			name: 'नाम',
			namePlaceholder: 'उदा. कोड समीक्षा',
			prompt: 'प्रॉम्प्ट',
			promptPlaceholder: 'भेजने के लिए प्रॉम्प्ट दर्ज करें...',
			delete: 'हटाएं',
			deleteConfirm: 'क्या आप वाकई "{name}" को हटाना चाहते हैं?',
			moveUp: 'ऊपर ले जाएं',
			moveDown: 'नीचे ले जाएं',
			empty: 'अभी कोई कस्टम त्वरित कार्रवाई नहीं है। एक बनाने के लिए "जोड़ें" पर क्लिक करें।',
			noActions: 'कोई कस्टम त्वरित कार्रवाई नहीं',
			noActionsGuide: 'नई त्वरित कार्रवाई बनाने के लिए नीचे दिए गए बटन पर क्लिक करें।',
			untitled: 'शीर्षकहीन',
		},

		// Plugin Tools
		pluginTools: 'प्लगइन प्रबंधन टूल',
		pluginToolsDesc: 'एजेंट को Obsidian प्लगइन सूचीबद्ध करने, सक्षम और अक्षम करने की अनुमति दें',

		// Built-in Tools
		builtinTools: {
			title: 'बिल्ट-इन टूल्स',
			description: 'बिल्ट-इन Claude टूल्स को सक्षम या अक्षम करें। MCP विकल्पों का उपयोग करना पसंद करें तो अक्षम करें।',
			webSearch: 'वेब खोज',
			webSearchDesc: 'वेब पर वर्तमान जानकारी खोजें',
			webFetch: 'वेब फ़ेच',
			webFetchDesc: 'वेब पेज कंटेंट प्राप्त करें और विश्लेषण करें',
		},

		// Agent Options
		agentOptions: {
			title: 'एजेंट विकल्प',
			description: 'Claude Agent SDK उन्नत विकल्प कॉन्फ़िगर करें',
			maxTurns: 'अधिकतम टर्न',
			maxTurnsDesc: 'अधिकतम वार्तालाप टर्न की संख्या। असीमित के लिए 0 पर सेट करें।',
			maxTurnsPlaceholder: '0 (असीमित)',
			maxBudgetUsd: 'अधिकतम बजट (USD)',
			maxBudgetUsdDesc: 'प्रति सत्र अधिकतम लागत USD में। असीमित के लिए 0 पर सेट करें।',
			maxBudgetUsdPlaceholder: '0.00 (असीमित)',
			enableExtendedThinking: 'Extended Thinking',
			enableExtendedThinkingDesc: 'Claude को जटिल समस्याओं के बारे में गहराई से सोचने की अनुमति दें',
			maxThinkingTokens: 'अधिकतम सोच टोकन',
			maxThinkingTokensDesc: 'Extended Thinking के लिए अधिकतम टोकन (1,000 - 100,000)',
			permissionMode: {
				title: 'अनुमति मोड',
				description: 'Claude की फ़ाइल और सिस्टम एक्सेस अनुमतियों को नियंत्रित करें',
				bypassPermissions: 'अनुमतियाँ बायपास करें',
				bypassPermissionsDesc: 'पुष्टि के बिना सभी ऑपरेशन की अनुमति दें (अधिकतम सुविधा)',
				acceptEdits: 'संपादन स्वीकार करें',
				acceptEditsDesc: 'केवल फ़ाइल संपादन को स्वचालित रूप से स्वीकृत करें',
				default: 'डिफ़ॉल्ट',
				defaultDesc: 'सभी ऑपरेशन के लिए पुष्टि आवश्यक',
				plan: 'प्लान मोड',
				planDesc: 'केवल योजना, कोई निष्पादन नहीं',
			},
			costDisplay: 'सत्र लागत: ${cost}',
			costLimitReached: 'लागत सीमा पहुँच गई। सत्र समाप्त।',
			turnLimitReached: 'टर्न सीमा पहुँच गई। सत्र समाप्त।',
		},

		// MCP Servers
		mcp: {
			title: 'MCP सर्वर',
			description: 'कस्टम टूल और संसाधनों के लिए बाहरी MCP सर्वर कॉन्फ़िगर करें',
			addServer: 'सर्वर जोड़ें',
			editServer: 'सर्वर संपादित करें',
			deleteServer: 'सर्वर हटाएं',
			deleteConfirm: 'क्या आप वाकई इस सर्वर को हटाना चाहते हैं?',
			serverName: 'सर्वर नाम',
			serverNamePlaceholder: 'उदा., filesystem, weather-api',
			serverType: 'सर्वर प्रकार',
			typeStdio: 'stdio (स्थानीय कमांड)',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: 'कमांड',
			commandPlaceholder: 'उदा., npx, python',
			args: 'आर्गुमेंट्स',
			argsPlaceholder: 'उदा., -y, @anthropic/mcp-server-filesystem, /path',
			env: 'पर्यावरण चर (JSON)',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: 'उदा., http://localhost:8080/mcp',
			headers: 'हेडर (JSON)',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: 'सक्षम',
			save: 'सहेजें',
			cancel: 'रद्द करें',
			duplicateName: 'इस नाम का सर्वर पहले से मौजूद है',
			invalidJson: 'अमान्य JSON प्रारूप',
			statusConnected: 'कनेक्टेड',
			statusFailed: 'कनेक्शन विफल',
			statusPending: 'चैट शुरू होने पर कनेक्ट होता है',
			statusNeedsAuth: 'प्रमाणीकरण आवश्यक',
			noServers: 'कोई MCP सर्वर कॉन्फ़िगर नहीं किया गया। शुरू करने के लिए "सर्वर जोड़ें" पर क्लिक करें।',
			commandNotFound: 'कमांड नहीं मिला',
			commandNotFoundDesc: 'कमांड "{command}" नहीं मिला। कृपया पूर्ण पथ दर्ज करें (उदा., /Users/username/.bun/bin/bunx)',
			commandValidating: 'कमांड सत्यापित कर रहा है...',
			// Panel translations
			panelTitle: 'MCP सर्वर',
			panelNoServers: 'कोई सर्वर पंजीकृत नहीं',
			panelNoServersDesc: 'सेटिंग्स में MCP सर्वर जोड़ें',
			panelOpenSettings: 'सेटिंग्स खोलें',
			panelToolsNotConnected: 'उपलब्ध टूल देखने के लिए कनेक्ट करें',
			panelToolsCount: '{count} टूल',
			panelToggleError: 'सर्वर स्थिति बदलने में विफल',
			deleteError: 'सर्वर हटाने में विफल',
			saveError: 'सर्वर सहेजने में विफल',
		},

		// Skills
		skills: {
			title: 'Skills',
			description: '.claude/skills/ से Claude Agent SDK Skills प्रबंधित करें',
			enable: 'Skills सक्षम करें',
			enableDesc: 'Claude को .claude/skills/ निर्देशिका में परिभाषित Skills का उपयोग करने की अनुमति दें',
			createTemplate: 'टेम्पलेट से बनाएं',
			createAIWizard: 'AI से बनाएं',
			aiWizardDesc: 'वर्णन करें कि आप अपने Skill से क्या करवाना चाहते हैं और AI इसे आपके लिए जनरेट करेगा।',
			aiPromptLabel: 'अपने Skill का वर्णन करें',
			aiPromptDesc: 'प्राकृतिक भाषा में बताएं कि यह Skill क्या करना चाहिए',
			aiPromptPlaceholder: 'उदा: एक स्किल जो मार्कडाउन टेबल को सही संरेखण के साथ फॉर्मेट करने में मदद करता है...',
			generateBtn: 'जनरेट करें',
			generating: 'Skill जनरेट हो रहा है...',
			invalidName: 'अमान्य Skill नाम',
			noSkills: 'कोई Skills नहीं मिली',
			noSkillsGuide: 'नीचे दिए गए बटनों का उपयोग करके नई Skill बनाएं या .claude/skills/{skill-name}/ में SKILL.md फ़ाइलें जोड़ें',
			nameLabel: 'Skill का नाम',
			nameDesc: 'केवल लोअरकेस अक्षर, संख्याएं और हाइफ़न का उपयोग करें (उदा.: my-skill)',
			descriptionLabel: 'विवरण',
			descriptionDesc: 'वर्णन करें कि Claude को इस Skill का उपयोग कब करना चाहिए',
			descriptionPlaceholder: 'यह Skill ... में मदद करती है',
			instructionsLabel: 'निर्देश',
			instructionsDesc: 'Claude को इस Skill को निष्पादित करते समय पालन करने के लिए निर्देश',
			instructionsPlaceholder: 'वर्णन करें कि यह Skill कैसे काम करनी चाहिए और क्या कार्य करने हैं...',
			examplesLabel: 'उदाहरण',
			examplesDesc: 'इस Skill को प्रदर्शित करने वाले उपयोग के उदाहरण',
			examplesPlaceholder: 'इनपुट उदाहरण और अपेक्षित आउटपुट लिखें...',
			preview: 'पूर्वावलोकन',
			duplicateName: 'इस नाम की Skill पहले से मौजूद है',
			parseError: 'पार्सिंग त्रुटि',
			fileNotFound: 'फ़ाइल नहीं मिली',
			loadError: 'फ़ाइल लोड करने में विफल',
			edit: 'संपादित करें',
			delete: 'हटाएं',
			deleteConfirm: 'क्या आप वाकई Skill "{name}" को हटाना चाहते हैं?',
			deleteTitle: 'Skill हटाएं',
			deleteConfirmMessage: 'क्या आप वाकई {name} को हटाना चाहते हैं?',
			deleteUndoHint: 'आप 10 सेकंड के भीतर इस कार्रवाई को पूर्ववत कर सकते हैं।',
			deleteSuccess: 'Skill "{name}" हटा दी गई।',
			deleteError: 'Skill हटाने में विफल: {error}',
			undo: 'पूर्ववत करें',
			restoreSuccess: 'Skill पुनर्स्थापित हो गई।',
			restoreError: 'Skill पुनर्स्थापित करने में विफल।',
			// AI Validation
			validationFailed: '{max} प्रयासों के बाद सत्यापन विफल रहा। कृपया सामग्री को मैन्युअल रूप से जांचें और संपादित करें।',
			validationErrors: 'सामग्री में सत्यापन त्रुटियां हैं:\n{errors}',
			retrying: 'समस्याओं को ठीक कर रहे हैं... (प्रयास {attempt}/{max})',
			noContentError: 'कोई सामग्री जनरेट नहीं हुई। कृपया पहले "जनरेट करें" पर क्लिक करें।',
			// Edit Modal
			editTitle: 'Skill संपादित करें',
			contentLabel: 'सामग्री',
			contentDesc: 'पूर्ण Markdown बॉडी (स्वतंत्र संपादन)',
			contentPlaceholder: '# skill-name\n\n## Instructions\n\n...',
			updateSuccess: 'Skill सफलतापूर्वक अपडेट किया गया',
			updateError: 'Skill अपडेट करने में त्रुटि',
			skillsCount: '{count} Skills',
			activeCount: '{active} सक्रिय',
			// Documentation link
			docsLink: 'आधिकारिक दस्तावेज देखें',
		},

		// About
		about: 'के बारे में',
		aboutText1: 'यह प्लगइन Obsidian के भीतर सीधे AI-संचालित सहायता प्रदान करने के लिए Claude Agent SDK का उपयोग करता है।',
		aboutText2: 'एजेंट फ़ाइलें पढ़ सकता है, कमांड निष्पादित कर सकता है, और आपके vault में विभिन्न कार्यों में मदद कर सकता है।',
	},

	// Mention system
	mention: {
		noResults: 'कोई परिणाम नहीं मिला',
		file: 'फ़ाइल',
		folder: 'फ़ोल्डर',
		binaryFile: 'बाइनरी फ़ाइल',
		fileNotFound: 'फ़ाइल नहीं मिली',
		fileReadError: 'फ़ाइल पढ़ने में त्रुटि',
		contentTruncated: '... सामग्री काटी गई ...',
		invalidPath: 'अमान्य पथ',
	},

	// Large file warning
	largeFileWarningTitle: 'बड़ी फ़ाइल चेतावनी',
	largeFileWarningMessage: "फ़ाइल '{path}' 100KB से बड़ी है ({size})। बड़ी फ़ाइलें प्रतिक्रिया को धीमा कर सकती हैं।",
	largeFileWarningQuestion: 'क्या आप फिर भी इस फ़ाइल को शामिल करना चाहते हैं?',
	includeAnyway: 'फिर भी शामिल करें',
	cancel: 'रद्द करें',

	// Common translations
	common: {
		close: 'बंद करें',
		cancel: 'रद्द करें',
		create: 'बनाएं',
		save: 'सहेजें',
		delete: 'हटाएं',
	},
};
