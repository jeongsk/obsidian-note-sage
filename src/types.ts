// ==================== 설정 ====================

import type { App } from 'obsidian';
import type { SupportedLanguage } from './i18n';

// ==================== Obsidian 확장 타입 ====================

/**
 * Obsidian App의 내부 API 확장 (설정 창 접근용)
 */
export interface ObsidianAppExtended extends App {
	setting?: {
		open: () => void;
		openTabById?: (id: string) => void;
	};
}

// ==================== MCP Server Types ====================

/**
 * MCP 서버 설정 항목 (플러그인 설정에 저장)
 */
export interface McpServerConfigEntry {
	/** 고유 서버 이름 (SDK의 mcpServers 객체 키로 사용) */
	name: string;

	/** 서버 타입: stdio, sse, http */
	type: 'stdio' | 'sse' | 'http';

	/** 서버 활성화 여부 */
	enabled: boolean;

	// stdio 타입 전용 필드
	/** 실행할 명령어 (stdio 타입) */
	command?: string;
	/** 명령어 인자 (stdio 타입) */
	args?: string[];
	/** 환경 변수 (stdio 타입) */
	env?: Record<string, string>;

	// sse/http 타입 전용 필드
	/** 서버 URL (sse/http 타입) */
	url?: string;
	/** HTTP 헤더 (sse/http 타입) */
	headers?: Record<string, string>;
}

/**
 * MCP 서버 연결 상태 (런타임, SDK에서 조회)
 */
export interface McpServerStatus {
	/** 서버 이름 */
	name: string;

	/** 연결 상태 */
	status: 'connected' | 'failed' | 'pending' | 'needs-auth';

	/** 서버 정보 (연결 성공 시) */
	serverInfo?: {
		name: string;
		version: string;
	};

	/** 오류 메시지 (연결 실패 시) */
	errorMessage?: string;

	/** 서버가 제공하는 도구 목록 */
	tools?: McpTool[];
}

/**
 * MCP 서버가 제공하는 개별 도구 정보
 */
export interface McpTool {
	/** 도구 이름 */
	name: string;
	/** 도구 설명 */
	description?: string;
}

// ==================== Built-in Tools Toggle ====================

/**
 * 사용자가 토글할 수 있는 내장 도구 정의
 * Phase 1: WebSearch, WebFetch만 지원
 * 향후: Bash, Write, Edit, Task, NotebookEdit 추가 가능
 */
export const TOGGLEABLE_BUILTIN_TOOLS = [
	{
		name: 'WebSearch',
		labelKey: 'settings.builtinTools.webSearch',
		descriptionKey: 'settings.builtinTools.webSearchDesc'
	},
	{
		name: 'WebFetch',
		labelKey: 'settings.builtinTools.webFetch',
		descriptionKey: 'settings.builtinTools.webFetchDesc'
	}
] as const;

export type ToggleableBuiltinTool = typeof TOGGLEABLE_BUILTIN_TOOLS[number]['name'];

// ==================== Agent Options ====================

/**
 * 권한 모드 타입
 * Claude의 파일/시스템 접근 권한 수준을 결정
 */
export type PermissionMode = 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan';

/**
 * Agent Options 기본값
 */
export const AGENT_OPTIONS_DEFAULTS = {
	maxTurns: 0,                    // 0 = 무제한
	maxBudgetUsd: 0,                // 0 = 무제한
	enableExtendedThinking: false,
	maxThinkingTokens: 10000,
	permissionMode: 'bypassPermissions' as PermissionMode,
} as const;

/**
 * Agent Options 범위 제한
 */
export const AGENT_OPTIONS_LIMITS = {
	maxTurns: { min: 0, max: 100 },
	maxBudgetUsd: { min: 0, max: 100 },
	maxThinkingTokens: { min: 1000, max: 100000 },
} as const;

/**
 * 권한 모드 옵션 목록 (UI 드롭다운용)
 */
export const PERMISSION_MODE_OPTIONS = [
	{ value: 'bypassPermissions' as PermissionMode, labelKey: 'settings.agentOptions.permissionMode.bypassPermissions' },
	{ value: 'acceptEdits' as PermissionMode, labelKey: 'settings.agentOptions.permissionMode.acceptEdits' },
	{ value: 'default' as PermissionMode, labelKey: 'settings.agentOptions.permissionMode.default' },
	{ value: 'plan' as PermissionMode, labelKey: 'settings.agentOptions.permissionMode.plan' },
] as const;

// ==================== Quick Actions ====================

/**
 * Quick Action 사용자 설정 인터페이스
 * 각 빠른 액션 버튼의 활성화 상태와 커스텀 프롬프트를 저장
 */
export interface QuickActionConfig {
	id: string;
	enabled: boolean;
	customPrompt?: string;
}

/**
 * Quick Action 정의 인터페이스 (읽기 전용)
 * 빠른 액션 버튼의 정적 정의 정보
 */
export interface QuickActionDefinition {
	id: string;
	icon: string;
	labelKey: string;
	promptKey: string;
}

/**
 * 빠른 액션 정의 목록
 * 4개의 기본 빠른 액션 버튼 정의
 */
export const QUICK_ACTION_DEFINITIONS: QuickActionDefinition[] = [
	{ id: 'summarize', icon: 'file-text', labelKey: 'quickAction.summarize', promptKey: 'quickAction.summarizePrompt' },
	{ id: 'improve', icon: 'edit', labelKey: 'quickAction.improve', promptKey: 'quickAction.improvePrompt' },
	{ id: 'analyze', icon: 'search', labelKey: 'quickAction.analyze', promptKey: 'quickAction.analyzePrompt' },
	{ id: 'translate', icon: 'languages', labelKey: 'quickAction.translate', promptKey: 'quickAction.translatePrompt' },
];

/**
 * Quick Actions 기본 설정 생성
 * 모든 버튼이 활성화된 상태로 시작
 */
export const DEFAULT_QUICK_ACTIONS: QuickActionConfig[] = QUICK_ACTION_DEFINITIONS.map(def => ({
	id: def.id,
	enabled: true,
	customPrompt: undefined,
}));

/**
 * 사용자 정의 빠른 액션
 * 사용자가 생성한 커스텀 프롬프트 버튼
 */
export interface CustomQuickAction {
	/** 고유 식별자 (UUID) */
	id: string;

	/** 버튼에 표시될 이름 */
	name: string;

	/** 클릭 시 전송될 프롬프트 */
	prompt: string;

	/** 활성화 상태 (채팅 뷰에 표시 여부) */
	enabled: boolean;

	/** 표시 순서 (0부터 시작, 낮을수록 앞에 표시) */
	order: number;
}


// ==================== Skills Types ====================

/**
 * SKILL.md 파일의 YAML frontmatter에서 추출한 메타데이터
 */
export interface SkillMetadata {
	/** Skill 식별자 (kebab-case, 예: "processing-pdfs") */
	name: string;

	/** Skill 설명 - Claude가 자동 호출 판단에 사용 */
	description: string;
}

/**
 * Vault 내 탐지된 Skill
 */
export interface SkillEntry {
	/** Skill 디렉토리명 (예: "my-skill") */
	id: string;

	/** SKILL.md 파일의 경로 */
	path: string;

	/** SKILL.md에서 추출한 메타데이터 */
	metadata: SkillMetadata;

	/** 활성화 상태 (기본값: true) */
	enabled: boolean;

	/** 파싱 오류 여부 */
	hasError: boolean;

	/** 오류 메시지 (hasError가 true일 때) */
	errorMessage?: string;
}

export interface NoteSageSettings {
	apiKey?: string;
	model?: string;
	debugContext?: boolean;
	// Claude CLI 경로 설정
	claudeExecutablePath?: string;
	// Phase 1-A: 파일 내용 컨텍스트 설정
	includeFileContent?: boolean;
	maxContentLength?: number;
	includeSelection?: boolean;
	// Phase 1-E: 시스템 프롬프트 설정
	systemPrompt?: string;
	// Phase 2-B: 대화 저장 설정
	autoSaveConversations?: boolean;
	conversationSavePath?: string;
	// 다국어 지원 설정
	language?: SupportedLanguage;
	// Quick Actions 설정
	quickActions?: QuickActionConfig[];
	// Custom Quick Actions 설정
	customQuickActions?: CustomQuickAction[];
	// 플러그인 관리 도구 설정
	enablePluginTools?: boolean;
	// MCP 서버 설정
	mcpServers?: McpServerConfigEntry[];
	// 비활성화된 내장 도구 목록
	disabledBuiltinTools?: string[];
	// Agent Options 설정
	maxTurns?: number;
	maxBudgetUsd?: number;
	enableExtendedThinking?: boolean;
	maxThinkingTokens?: number;
	permissionMode?: PermissionMode;
	// Skills 설정
	enableSkills?: boolean;
	disabledSkills?: string[];
}

export const DEFAULT_SETTINGS: NoteSageSettings = {
	apiKey: '',
	model: 'claude-sonnet-4-5',
	debugContext: false,
	// Claude CLI 경로 (빈 값이면 자동 탐지)
	claudeExecutablePath: '',
	// Phase 1-A: 파일 내용 컨텍스트 기본값
	includeFileContent: true,
	maxContentLength: 10000,
	includeSelection: true,
	// Phase 1-E: 시스템 프롬프트 기본값
	systemPrompt: '',
	// Phase 2-B: 대화 저장 기본값
	autoSaveConversations: false,
	conversationSavePath: 'AI-Chats',
	// 다국어 지원 기본값
	language: 'auto',
	// Quick Actions 기본값
	quickActions: DEFAULT_QUICK_ACTIONS,
	// Custom Quick Actions 기본값
	customQuickActions: [],
	// 플러그인 관리 도구 기본값
	enablePluginTools: false,
	// MCP 서버 기본값
	mcpServers: [],
	// 비활성화된 내장 도구 기본값 (빈 배열 = 모두 활성화)
	disabledBuiltinTools: [],
	// Agent Options 기본값
	maxTurns: AGENT_OPTIONS_DEFAULTS.maxTurns,
	maxBudgetUsd: AGENT_OPTIONS_DEFAULTS.maxBudgetUsd,
	enableExtendedThinking: AGENT_OPTIONS_DEFAULTS.enableExtendedThinking,
	maxThinkingTokens: AGENT_OPTIONS_DEFAULTS.maxThinkingTokens,
	permissionMode: AGENT_OPTIONS_DEFAULTS.permissionMode,
	// Skills 기본값
	enableSkills: false,
	disabledSkills: [],
};

// 사용 가능한 모델 목록 (4.5 시리즈만)
export const AVAILABLE_MODELS = [
	{ value: 'claude-opus-4-5', label: 'Claude Opus 4.5' },
	{ value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
	{ value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' }
] as const;

// ==================== 콘텐츠 블록 타입 ====================

export interface TextBlock {
	type: 'text';
	text: string;
}

export interface ToolUseBlock {
	type: 'tool_use';
	id: string;
	name: string;
	input: Record<string, unknown>;
}

export interface ToolResultBlock {
	type: 'tool_result';
	tool_use_id: string;
	content?: string;
	is_error?: boolean;
}

/**
 * T018: Extended Thinking 블록 타입
 * Claude가 Extended Thinking 모드에서 반환하는 사고 과정 블록
 */
export interface ThinkingBlock {
	type: 'thinking';
	thinking: string;
}

export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock | ThinkingBlock;

// ==================== 메시지 타입 ====================

export interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: ContentBlock[];
	model?: string;
	usage?: MessageUsage;
}

export interface MessageUsage {
	input_tokens?: number;
	output_tokens?: number;
	service_tier?: string;
}

// ==================== ChatMessage Discriminated Union ====================

/**
 * 기본 메시지 속성 (모든 메시지 타입에 공통)
 */
interface BaseChatMessage {
	session_id: string;
	uuid: string;
	timestamp?: Date;
}

/**
 * 시스템 메시지 - 초기화, 에러, 취소 등
 */
export interface SystemChatMessage extends BaseChatMessage {
	type: 'system';
	subtype?: 'init' | 'error' | 'success';
	result?: string;
}

/**
 * 사용자 메시지 - 사용자 입력 또는 도구 결과
 */
export interface UserChatMessage extends BaseChatMessage {
	type: 'user';
	message: Message;
	isUserInput?: boolean;
}

/**
 * Assistant 메시지 - AI 응답
 */
export interface AssistantChatMessage extends BaseChatMessage {
	type: 'assistant';
	message: Message;
}

/**
 * 결과 메시지 - 최종 응답
 */
export interface ResultChatMessage extends BaseChatMessage {
	type: 'result';
	subtype?: 'success' | 'error';
	result?: string;
	duration_ms?: number;
	duration_api_ms?: number;
	is_error?: boolean;
	num_turns?: number;
	total_cost_usd?: number;
}

/**
 * ChatMessage - Discriminated Union 타입
 * type 필드로 각 메시지 유형을 구분
 */
export type ChatMessage =
	| SystemChatMessage
	| UserChatMessage
	| AssistantChatMessage
	| ResultChatMessage;

// ==================== SDK 메시지 타입 ====================

/**
 * Claude Agent SDK에서 전달되는 메시지 타입
 */
export interface SDKMessage {
	type: 'assistant' | 'user' | 'result' | 'system';
	subtype?: 'success' | 'error' | 'init';
	session_id?: string;
	message?: {
		id?: string;
		role?: 'user' | 'assistant';
		content?: ContentBlock[];
		model?: string;
		usage?: MessageUsage;
	};
	duration_ms?: number;
	duration_api_ms?: number;
	is_error?: boolean;
	num_turns?: number;
	result?: string;
	total_cost_usd?: number;
}

// ==================== 타입 가드 함수 ====================

export function isSystemMessage(msg: ChatMessage): msg is SystemChatMessage {
	return msg.type === 'system';
}

export function isUserMessage(msg: ChatMessage): msg is UserChatMessage {
	return msg.type === 'user';
}

export function isAssistantMessage(msg: ChatMessage): msg is AssistantChatMessage {
	return msg.type === 'assistant';
}

export function isResultMessage(msg: ChatMessage): msg is ResultChatMessage {
	return msg.type === 'result';
}

export function hasMessageContent(msg: ChatMessage): msg is UserChatMessage | AssistantChatMessage {
	return msg.type === 'user' || msg.type === 'assistant';
}
