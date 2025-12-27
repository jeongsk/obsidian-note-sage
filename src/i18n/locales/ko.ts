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
	cooking: '처리 중...',
	thinking: '생각 중...',
	toolResult: '도구 결과',
	usingTool: '도구 사용 중',
	noContent: '내용 없음',
	system: '시스템',

	// Todo card
	tasks: '작업 목록',

	// Code block
	copy: '복사',
	copied: '복사됨!',

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
			statusConnected: '연결됨',
			statusFailed: '연결 실패',
			statusPending: '연결 중...',
			statusNeedsAuth: '인증 필요',
			noServers: 'MCP 서버가 설정되지 않았습니다. "서버 추가"를 클릭하여 시작하세요.',
		},

		// About
		about: '정보',
		aboutText1: '이 플러그인은 Claude Agent SDK를 사용하여 Obsidian 내에서 AI 지원 기능을 제공합니다.',
		aboutText2: '에이전트는 파일을 읽고, 명령을 실행하고, vault에서 다양한 작업을 도울 수 있습니다.',
	},
};
