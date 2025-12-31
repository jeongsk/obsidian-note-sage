// Korean translations
import type { TranslationKeys } from './en';

export const ko: TranslationKeys = {
	// App title
	appTitle: 'Note Sage',

	// Header buttons
	examples: '예시',
	pluginSettings: '플러그인 설정',
	newChat: '새 채팅',
	selectModel: 'Claude 모델 선택',

	// Quick actions
	quickAction: {
		summarize: '요약',
		summarizePrompt: '이 문서를 간결하게 요약해 주세요.',
		improve: '개선',
		improvePrompt: '문체를 개선하고 오류를 수정해 주세요.',
		analyze: '분석',
		analyzePrompt: '이 문서를 분석하고 인사이트를 제공해 주세요.',
		translate: '번역',
		translatePrompt: '이 텍스트를 한국어로 번역해 주세요. 이미 한국어라면 영어로 번역해 주세요.',
	},

	// File context
	currentPage: '현재 페이지',
	addCurrentPageContext: '현재 페이지의 컨텍스트를 메시지에 추가',

	// Input
	inputPlaceholder: '메시지를 입력하세요 (Enter로 전송, Shift+Enter로 줄바꿈)...',
	sendMessage: '메시지 전송',
	cancelProcessing: '처리 취소',

	// Context building
	currentFile: '현재 파일',
	selectedText: '선택된 텍스트',
	fileContent: '파일 내용',
	truncated: '잘림',
	charactersOmitted: '자 생략됨',

	// Errors
	vaultPathError: 'vault 경로를 확인할 수 없습니다. 이 플러그인은 로컬 vault가 필요합니다.',
	executionCancelled: '메시지 실행이 취소되었습니다',
	error: '오류',
	errorRenderingMessage: '메시지 렌더링 중 오류 발생',

	// Chat messages
	cooking: '생각 중...',
	thinking: '생각 중...',
	extendedThinking: '확장 사고',
	toolResult: '도구 결과',
	usingTool: '도구 사용 중',
	noContent: '내용 없음',
	system: '시스템',

	// Todo card
	tasks: '작업 목록',

	// Code block
	copy: '복사',
	copied: '복사됨!',
	copyFailed: '실패',

	// Markdown export
	user: '사용자',
	assistant: '어시스턴트',
	result: '결과',
	duration: '소요 시간',
	aiChatTitle: 'AI 채팅',

	// Commands
	commands: {
		openNoteSage: 'Note Sage 열기',
		startNewChat: '새 채팅 시작',
		saveConversation: '현재 대화 저장',
		summarizeDocument: 'Note Sage: 문서 요약',
		explainSelection: 'Note Sage: 선택 영역 설명',
		improveWriting: 'Note Sage: 글쓰기 개선',
		translateToKorean: 'Note Sage: 한국어로 번역',
		translateToEnglish: 'Note Sage: 영어로 번역',
		reviewCode: 'Note Sage: 코드 리뷰',
	},

	// Quick prompts
	prompts: {
		summarize: '이 문서를 간결하게 요약해 주세요.',
		explain: '선택된 텍스트를 자세히 설명해 주세요.',
		improve: '문체를 개선하고 문법 및 맞춤법 오류를 수정해 주세요.',
		translateKo: '이 텍스트를 한국어로 번역해 주세요.',
		translateEn: '이 텍스트를 영어로 번역해 주세요.',
		codeReview: '이 코드를 검토하고 개선 사항을 제안해 주세요.',
	},

	// Settings
	settings: {
		// API Key
		apiKey: 'Anthropic API 키 (선택사항)',
		apiKeyDesc: '선택사항. Claude용 Anthropic API 키입니다. console.anthropic.com에서 발급받으세요',
		apiKeyPlaceholder: 'sk-ant-...',

		// Model
		model: '모델',
		modelDesc: '사용할 Claude 모델을 선택하세요',

		// Claude CLI
		claudeCli: 'Claude CLI',
		claudeCliAdvanced: '고급 옵션',
		claudeCliPath: 'Claude CLI 경로',
		claudeCliPathDesc: 'claude 실행 파일의 경로입니다. 비워두면 일반적인 설치 경로에서 자동 탐지합니다.',
		claudeCliPathPlaceholder: '자동 탐지 (비워두기)',
		claudeCliPathInfo: '일반적인 경로: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)',

		// Debug
		debugMode: '디버그 모드',
		debugModeDesc: '문제 해결을 위한 디버그 로깅을 활성화합니다 (브라우저 콘솔에 기록)',

		// File Context
		fileContext: '파일 컨텍스트',
		includeFileContent: '파일 내용 포함',
		includeFileContentDesc: 'Claude에 전송되는 컨텍스트에 현재 파일의 내용을 포함합니다',
		preferSelectedText: '선택된 텍스트 우선',
		preferSelectedTextDesc: '텍스트가 선택되어 있으면 전체 파일 대신 선택 영역만 포함합니다',
		maxContentLength: '최대 내용 길이',
		maxContentLengthDesc: '파일에서 포함할 최대 문자 수입니다 (토큰 절약용)',

		// System Prompt
		systemPrompt: '시스템 프롬프트',
		customSystemPrompt: '사용자 지정 시스템 프롬프트',
		customSystemPromptDesc: 'Claude에 대한 사용자 지정 지시사항입니다. 기본값을 사용하려면 비워두세요.',
		customSystemPromptPlaceholder: '당신은 ... 전문 어시스턴트입니다',

		// Conversation Saving
		conversationSaving: '대화 저장',
		autoSave: '대화 자동 저장',
		autoSaveDesc: 'vault에 대화를 마크다운 파일로 자동 저장합니다',
		savePath: '저장 경로',
		savePathDesc: '대화가 저장될 vault 내 폴더 경로입니다',

		// Language
		language: '언어',
		languageDesc: '인터페이스 언어를 선택하세요',
		languageAuto: '자동 (시스템)',

		// Quick Actions
		quickActions: '빠른 액션',
		quickActionsDesc: '채팅 입력창 위의 빠른 액션 버튼을 설정합니다',
		customPromptPlaceholder: '사용자 지정 프롬프트 입력 (기본값 사용 시 비워두세요)',
		resetToDefault: '기본값으로 리셋',

		// Plugin Tools
		pluginTools: '플러그인 관리 도구',
		pluginToolsDesc: '에이전트가 Obsidian 플러그인을 조회하고 활성화/비활성화할 수 있습니다',

		// Built-in Tools
		builtinTools: {
			title: '내장 도구',
			description: '내장 Claude 도구를 활성화하거나 비활성화합니다. MCP 대안을 사용하려면 비활성화하세요.',
			webSearch: '웹 검색',
			webSearchDesc: '최신 정보를 웹에서 검색합니다',
			webFetch: '웹 가져오기',
			webFetchDesc: '웹 페이지 콘텐츠를 가져와 분석합니다',
		},

		// Agent Options
		agentOptions: {
			title: 'Agent 옵션',
			description: 'Claude Agent SDK 고급 옵션을 설정합니다',
			maxTurns: '최대 턴 수',
			maxTurnsDesc: '최대 대화 턴 수입니다. 0으로 설정하면 무제한입니다.',
			maxTurnsPlaceholder: '0 (무제한)',
			maxBudgetUsd: '최대 비용 (USD)',
			maxBudgetUsdDesc: '세션당 최대 비용입니다 (USD). 0으로 설정하면 무제한입니다.',
			maxBudgetUsdPlaceholder: '0.00 (무제한)',
			enableExtendedThinking: 'Extended Thinking',
			enableExtendedThinkingDesc: 'Claude가 복잡한 문제에 대해 더 깊이 생각하도록 합니다',
			maxThinkingTokens: '최대 사고 토큰',
			maxThinkingTokensDesc: 'Extended Thinking의 최대 토큰 수 (1,000 - 100,000)',
			permissionMode: {
				title: '권한 모드',
				description: 'Claude의 파일 및 시스템 접근 권한을 제어합니다',
				bypassPermissions: '권한 우회',
				bypassPermissionsDesc: '확인 없이 모든 작업을 허용합니다 (최대 편의성)',
				acceptEdits: '편집 자동 승인',
				acceptEditsDesc: '파일 편집만 자동으로 승인합니다',
				default: '기본',
				defaultDesc: '모든 작업에 확인이 필요합니다',
				plan: '계획 모드',
				planDesc: '계획만 수립하고 실행하지 않습니다',
			},
			costDisplay: '세션 비용: ${cost}',
			costLimitReached: '비용 한도에 도달했습니다. 세션이 종료되었습니다.',
			turnLimitReached: '턴 한도에 도달했습니다. 세션이 종료되었습니다.',
		},

		// MCP Servers
		mcp: {
			title: 'MCP 서버',
			description: '커스텀 도구와 리소스를 위한 외부 MCP 서버를 설정합니다',
			addServer: '서버 추가',
			editServer: '서버 편집',
			deleteServer: '서버 삭제',
			deleteConfirm: '이 서버를 삭제하시겠습니까?',
			serverName: '서버 이름',
			serverNamePlaceholder: '예: filesystem, weather-api',
			serverType: '서버 타입',
			typeStdio: 'stdio (로컬 명령어)',
			typeSse: 'SSE (Server-Sent Events)',
			typeHttp: 'HTTP',
			command: '명령어',
			commandPlaceholder: '예: npx, python',
			args: '인자',
			argsPlaceholder: '예: -y, @anthropic/mcp-server-filesystem, /path',
			env: '환경 변수 (JSON)',
			envPlaceholder: '{"KEY": "value"}',
			url: 'URL',
			urlPlaceholder: '예: http://localhost:8080/mcp',
			headers: '헤더 (JSON)',
			headersPlaceholder: '{"Authorization": "Bearer ..."}',
			enabled: '활성화',
			save: '저장',
			cancel: '취소',
			duplicateName: '같은 이름의 서버가 이미 존재합니다',
			invalidJson: '잘못된 JSON 형식입니다',
			statusConnected: '연결됨',
			statusFailed: '연결 실패',
			statusPending: '연결 중...',
			statusNeedsAuth: '인증 필요',
			noServers: 'MCP 서버가 설정되지 않았습니다. "서버 추가"를 클릭하여 시작하세요.',
			commandNotFound: '명령어를 찾을 수 없음',
			commandNotFoundDesc: '"{command}" 명령어를 찾을 수 없습니다. 전체 경로를 입력해 주세요 (예: /Users/username/.bun/bin/bunx)',
			commandValidating: '명령어 확인 중...',
			// Panel translations
			panelTitle: 'MCP 서버',
			panelNoServers: '등록된 서버가 없습니다',
			panelNoServersDesc: '설정에서 MCP 서버를 추가하세요',
			panelOpenSettings: '설정 열기',
			panelToolsNotConnected: '연결 후 도구 목록을 확인할 수 있습니다',
			panelToolsCount: '{count}개 도구',
			panelToggleError: '서버 상태 변경에 실패했습니다',
			deleteError: '서버 삭제에 실패했습니다',
			saveError: '서버 저장에 실패했습니다',
		},

		// Skills
		skills: {
			title: 'Skills',
			description: '.claude/skills/에서 Claude Agent SDK Skills 관리',
			enable: 'Skills 활성화',
			enableDesc: '.claude/skills/ 디렉토리에 정의된 Skills를 Claude가 사용할 수 있도록 허용',
			createTemplate: '템플릿으로 생성',
			createAIWizard: 'AI로 생성',
			aiWizardDesc: 'Skill이 수행할 작업을 설명하면 AI가 자동으로 생성합니다.',
			aiPromptLabel: 'Skill 설명',
			aiPromptDesc: '이 Skill이 무엇을 해야 하는지 자연어로 설명하세요',
			aiPromptPlaceholder: '예: 마크다운 테이블을 정렬하여 포맷팅하는 스킬...',
			generateBtn: '생성하기',
			generating: 'Skill 생성 중...',
			invalidName: '유효하지 않은 Skill 이름입니다',
			noSkills: 'Skills가 없습니다',
			noSkillsGuide: '아래 버튼을 사용하여 새 Skill을 만들거나 .claude/skills/{skill-name}/에 SKILL.md 파일을 추가하세요',
			nameLabel: 'Skill 이름',
			nameDesc: '영문 소문자, 숫자, 하이픈만 사용 (예: my-skill)',
			descriptionLabel: '설명',
			descriptionDesc: 'Claude가 이 Skill을 언제 사용해야 하는지 설명',
			descriptionPlaceholder: '이 Skill은 ...을 도와줍니다',
			preview: '미리보기',
			duplicateName: '이 이름의 Skill이 이미 존재합니다',
			parseError: '파싱 오류',
			fileNotFound: '파일을 찾을 수 없습니다',
			loadError: '파일 로드에 실패했습니다',
			edit: '편집',
			delete: '삭제',
			deleteConfirm: 'Skill "{name}"을(를) 삭제하시겠습니까?',
			// AI Validation
			validationFailed: '{max}번의 시도 후 검증에 실패했습니다. 내용을 직접 확인하고 수정해 주세요.',
			validationErrors: '콘텐츠에 검증 오류가 있습니다:\n{errors}',
			retrying: '문제 수정 중... ({attempt}/{max}번째 시도)',
			noContentError: '생성된 내용이 없습니다. 먼저 "생성하기" 버튼을 클릭하세요.',
		},

		// About
		about: '정보',
		aboutText1: '이 플러그인은 Claude Agent SDK를 사용하여 Obsidian 내에서 AI 지원 기능을 제공합니다.',
		aboutText2: '에이전트는 파일을 읽고, 명령을 실행하고, vault에서 다양한 작업을 도울 수 있습니다.',
	},

	// Mention system
	mention: {
		noResults: '검색 결과가 없습니다',
		file: '파일',
		folder: '폴더',
		binaryFile: '바이너리 파일',
		fileNotFound: '파일을 찾을 수 없습니다',
		fileReadError: '파일 읽기 오류',
		contentTruncated: '... 내용이 잘렸습니다 ...',
		invalidPath: '잘못된 경로',
	},

	// Large file warning
	largeFileWarningTitle: '대용량 파일 경고',
	largeFileWarningMessage: "'{path}' 파일이 100KB보다 큽니다 ({size}). 대용량 파일은 응답 속도를 늦출 수 있습니다.",
	largeFileWarningQuestion: '그래도 이 파일을 포함하시겠습니까?',
	includeAnyway: '그래도 포함',
	cancel: '취소',

	// Common translations
	common: {
		close: '닫기',
		cancel: '취소',
		create: '만들기',
		save: '저장',
		delete: '삭제',
	},
};
