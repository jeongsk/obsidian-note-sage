// Arabic translations
import type { TranslationKeys } from './en';

export const ar: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: 'أمثلة',
	pluginSettings: 'إعدادات الإضافة',
	newChat: 'محادثة جديدة',
	selectModel: 'اختر نموذج Claude',

	// Quick actions
	quickAction: {
		summarize: 'تلخيص',
		summarizePrompt: 'يرجى تلخيص هذا المستند بإيجاز.',
		improve: 'تحسين',
		improvePrompt: 'يرجى تحسين أسلوب الكتابة وإصلاح الأخطاء.',
		analyze: 'تحليل',
		analyzePrompt: 'يرجى تحليل هذا المستند وتقديم رؤى.',
		translate: 'ترجمة',
		translatePrompt: 'يرجى ترجمة هذا النص إلى الإنجليزية. إذا كان بالإنجليزية بالفعل، يرجى ترجمته إلى العربية.',
	},

	// File context
	currentPage: 'الصفحة الحالية',
	addCurrentPageContext: 'إضافة سياق الصفحة الحالية إلى الرسالة',

	// Input
	inputPlaceholder: 'اكتب رسالتك (Enter للإرسال، Shift+Enter لسطر جديد)...',
	sendMessage: 'إرسال الرسالة',
	cancelProcessing: 'إلغاء المعالجة',

	// Context building
	currentFile: 'الملف الحالي',
	selectedText: 'النص المحدد',
	fileContent: 'محتوى الملف',
	truncated: 'مقتطع',
	charactersOmitted: 'أحرف محذوفة',

	// Errors
	vaultPathError: 'تعذر تحديد مسار الخزنة. هذه الإضافة تتطلب خزنة محلية.',
	executionCancelled: 'تم إلغاء تنفيذ الرسالة',
	error: 'خطأ',
	errorRenderingMessage: 'خطأ في عرض محتوى الرسالة',

	// Chat messages
	cooking: 'جاري المعالجة...',
	thinking: 'جاري التفكير...',
	toolResult: 'نتيجة الأداة',
	usingTool: 'استخدام الأداة',
	noContent: 'لا يوجد محتوى',
	system: 'النظام',

	// Todo card
	tasks: 'المهام',

	// Code block
	copy: 'نسخ',
	copied: 'تم النسخ!',

	// Markdown export
	user: 'المستخدم',
	assistant: 'المساعد',
	result: 'النتيجة',
	duration: 'المدة',
	aiChatTitle: 'محادثة الذكاء الاصطناعي',

	// Commands
	commands: {
		openNoteSage: 'فتح Note Sage',
		startNewChat: 'بدء محادثة جديدة',
		saveConversation: 'حفظ المحادثة الحالية',
		summarizeDocument: 'Note Sage: تلخيص المستند',
		explainSelection: 'Note Sage: شرح التحديد',
		improveWriting: 'Note Sage: تحسين الكتابة',
		translateToKorean: 'Note Sage: ترجمة إلى الكورية',
		translateToEnglish: 'Note Sage: ترجمة إلى الإنجليزية',
		reviewCode: 'Note Sage: مراجعة الكود',
	},

	// Quick prompts
	prompts: {
		summarize: 'يرجى تلخيص هذا المستند بإيجاز.',
		explain: 'يرجى شرح النص المحدد بالتفصيل.',
		improve: 'يرجى تحسين أسلوب الكتابة وإصلاح أي أخطاء نحوية أو إملائية.',
		translateKo: 'يرجى ترجمة هذا النص إلى الكورية.',
		translateEn: 'يرجى ترجمة هذا النص إلى الإنجليزية.',
		codeReview: 'يرجى مراجعة هذا الكود واقتراح تحسينات.',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'مفتاح API لـ Anthropic (اختياري)',
		apiKeyDesc: 'اختياري. مفتاح API الخاص بك لـ Claude من Anthropic. احصل على واحد من console.anthropic.com',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: 'النموذج',
		modelDesc: 'اختر نموذج Claude للاستخدام',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: 'متقدم',
		claudeCliPath: 'مسار Claude CLI',
		claudeCliPathDesc: 'مسار ملف claude التنفيذي. اتركه فارغًا للكشف التلقائي من مسارات التثبيت الشائعة.',
		claudeCliPathPlaceholder: 'كشف تلقائي (اتركه فارغًا)',
		claudeCliPathInfo: 'المسارات الشائعة: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: 'وضع التصحيح',
		debugModeDesc: 'تمكين تسجيل التصحيح لاستكشاف الأخطاء (يسجل في وحدة تحكم المتصفح)',

		// File Context
		fileContext: 'سياق الملف',
		includeFileContent: 'تضمين محتوى الملف',
		includeFileContentDesc: 'تضمين محتوى الملف الحالي في السياق المرسل إلى Claude',
		preferSelectedText: 'تفضيل النص المحدد',
		preferSelectedTextDesc: 'عند تحديد نص، تضمين التحديد فقط بدلاً من الملف بأكمله',
		maxContentLength: 'الحد الأقصى لطول المحتوى',
		maxContentLengthDesc: 'الحد الأقصى لعدد الأحرف المضمنة من الملف (لتوفير الرموز)',

		// System Prompt
		systemPrompt: 'موجه النظام',
		customSystemPrompt: 'موجه نظام مخصص',
		customSystemPromptDesc: 'تعليمات مخصصة لـ Claude. اتركه فارغًا لاستخدام الإعدادات الافتراضية.',
		customSystemPromptPlaceholder: 'أنت مساعد مفيد متخصص في...',

		// Conversation Saving
		conversationSaving: 'حفظ المحادثات',
		autoSave: 'حفظ المحادثات تلقائيًا',
		autoSaveDesc: 'حفظ المحادثات تلقائيًا في خزنتك كملفات markdown',
		savePath: 'مسار الحفظ',
		savePathDesc: 'مسار المجلد في خزنتك حيث سيتم حفظ المحادثات',

		// Language
		language: 'اللغة',
		languageDesc: 'اختر لغة الواجهة',
		languageAuto: 'تلقائي (النظام)',

		// Quick Actions
		quickActions: 'الإجراءات السريعة',
		quickActionsDesc: 'تكوين أزرار الإجراءات السريعة فوق حقل إدخال الدردشة',
		customPromptPlaceholder: 'أدخل موجهًا مخصصًا (اتركه فارغًا للافتراضي)',
		resetToDefault: 'إعادة التعيين للافتراضي',

		// Plugin Tools
		pluginTools: 'أدوات إدارة الإضافات',
		pluginToolsDesc: 'السماح للوكيل بسرد إضافات Obsidian وتمكينها وتعطيلها',

		// MCP Servers
		mcp: {
			title: 'خوادم MCP',
			description: 'تكوين خوادم MCP الخارجية للأدوات والموارد المخصصة',
			addServer: 'إضافة خادم',
			editServer: 'تعديل الخادم',
			deleteServer: 'حذف الخادم',
			deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذا الخادم؟',
			serverName: 'اسم الخادم',
			serverNamePlaceholder: 'مثال: filesystem, weather-api',
			serverType: 'نوع الخادم',
			typeStdio: 'stdio (أمر محلي)',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: 'الأمر',
			commandPlaceholder: 'مثال: npx, python',
			args: 'الوسائط',
			argsPlaceholder: 'مثال: -y, @anthropic/mcp-server-filesystem, /path',
			env: 'متغيرات البيئة (JSON)',
			envPlaceholder: '{"KEY": "value"}',
			url: 'الرابط',
			urlPlaceholder: 'مثال: http://localhost:8080/mcp',
			headers: 'الترويسات (JSON)',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: 'مفعّل',
			save: 'حفظ',
			cancel: 'إلغاء',
			duplicateName: 'خادم بهذا الاسم موجود بالفعل',
			statusConnected: 'متصل',
			statusFailed: 'فشل الاتصال',
			statusPending: 'جاري الاتصال...',
			statusNeedsAuth: 'التوثيق مطلوب',
			noServers: 'لم يتم تكوين خوادم MCP. انقر على "إضافة خادم" للبدء.',
			commandNotFound: 'الأمر غير موجود',
			commandNotFoundDesc: 'تعذر العثور على الأمر "{command}". يرجى إدخال المسار الكامل (مثال: /Users/username/.bun/bin/bunx)',
			commandValidating: 'جاري التحقق من الأمر...',
			// Panel translations
			panelTitle: 'خوادم MCP',
			panelNoServers: 'لا توجد خوادم مسجلة',
			panelNoServersDesc: 'أضف خوادم MCP في الإعدادات',
			panelOpenSettings: 'فتح الإعدادات',
			panelToolsNotConnected: 'اتصل لعرض الأدوات المتاحة',
			panelToolsCount: '{count} أدوات',
			panelToggleError: 'فشل في تغيير حالة الخادم',
		},

		// About
		about: 'حول',
		aboutText1: 'تستخدم هذه الإضافة Claude Agent SDK لتوفير مساعدة مدعومة بالذكاء الاصطناعي مباشرة داخل Obsidian.',
		aboutText2: 'يمكن للوكيل قراءة الملفات وتنفيذ الأوامر والمساعدة في مهام متنوعة في خزنتك.',
	},
};
