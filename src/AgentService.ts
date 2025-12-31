import { query } from '@anthropic-ai/claude-agent-sdk';
import type { McpServerConfig } from '@anthropic-ai/claude-agent-sdk';
import type { NoteSageSettings, SDKMessage, ChatMessage, ToolUseBlock } from './types';
import { MessageFactory } from './MessageFactory';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface AgentSession {
	sessionId: string | null;
	isActive: boolean;
}

export interface McpStatusInfo {
	name: string;
	status: 'connected' | 'failed' | 'pending' | 'needs-auth';
	serverInfo?: { name: string; version: string };
	errorMessage?: string;
}

export interface AgentExecutionOptions {
	prompt: string;
	workingDirectory: string;
	sessionId?: string | null;
	onMessage: (message: ChatMessage) => void;
	onError: (error: Error) => void;
	onComplete: () => void;
	onMcpStatus?: (statuses: McpStatusInfo[]) => void;
	/** 에이전트가 파일을 수정할 때 호출되는 콜백 */
	onFileModified?: (filePath: string) => void;
	signal?: AbortSignal;
}

/**
 * AgentService - Claude Agent SDK와의 통신을 담당하는 서비스
 *
 * 책임:
 * - Claude Agent SDK query 함수 래핑
 * - 스트리밍 메시지 처리
 * - 세션 관리
 * - 취소 처리
 */
export class AgentService {
	private settings: NoteSageSettings;
	private currentAbortController: AbortController | null = null;
	private mcpServers: Record<string, McpServerConfig> = {};

	constructor(settings: NoteSageSettings) {
		this.settings = settings;
	}

	updateSettings(settings: NoteSageSettings): void {
		this.settings = settings;
	}

	/**
	 * MCP 서버 설정을 지정합니다.
	 * @param servers - MCP 서버 설정 객체
	 */
	setMcpServers(servers: Record<string, McpServerConfig>): void {
		this.mcpServers = servers;
	}

	/**
	 * MCP 서버 설정을 초기화합니다.
	 */
	clearMcpServers(): void {
		this.mcpServers = {};
	}

	async execute(options: AgentExecutionOptions): Promise<string | null> {
		const { prompt, workingDirectory, sessionId, onMessage, onError, onComplete, onMcpStatus, onFileModified, signal } = options;

		// Validate workingDirectory
		if (!workingDirectory || typeof workingDirectory !== 'string') {
			onError(new Error(`Invalid working directory: ${workingDirectory}`));
			onComplete();
			return sessionId || null;
		}

		this.currentAbortController = new AbortController();

		// 외부 시그널과 내부 abort controller 연결
		if (signal) {
			signal.addEventListener('abort', () => {
				this.currentAbortController?.abort();
			});
		}

		let activeSessionId: string | null = sessionId || null;

		try {
			this.configureApiKey();

			// Claude CLI 경로 찾기
			const claudePath = await this.findClaudeExecutable();
			if (!claudePath) {
				onError(new Error(
					'Claude CLI를 찾을 수 없습니다. 설정에서 Claude CLI 경로를 직접 지정해 주세요.\n' +
					'터미널에서 "which claude" (macOS/Linux) 또는 "where claude" (Windows) 명령으로 경로를 확인할 수 있습니다.'
				));
				onComplete();
				return sessionId || null;
			}

			const queryOptions = this.buildQueryOptions(workingDirectory, sessionId, claudePath);

			const stream = query({
				prompt,
				options: queryOptions,
			});

			for await (const message of stream) {
				if (this.currentAbortController?.signal.aborted) {
					break;
				}

				const chatMessage = MessageFactory.convertSDKMessage(message as SDKMessage, activeSessionId);

				// init 메시지에서 세션 ID 추출 및 MCP 상태 업데이트
				if (message.type === 'system' && (message as SDKMessage).subtype === 'init') {
					activeSessionId = (message as SDKMessage).session_id || activeSessionId;

					// MCP 서버가 설정되어 있으면 연결 성공으로 상태 업데이트
					if (onMcpStatus && Object.keys(this.mcpServers).length > 0) {
						const statuses: McpStatusInfo[] = Object.keys(this.mcpServers).map(name => ({
							name,
							status: 'connected' as const
						}));
						onMcpStatus(statuses);

						if (this.settings.debugContext) {
							console.log('[AgentService] MCP servers connected:', statuses);
						}
					}
				}

				// 파일 수정 도구 사용 감지 (Write, Edit)
				if (onFileModified && message.type === 'assistant') {
					const sdkMessage = message as SDKMessage;
					const content = sdkMessage.message?.content;
					if (content && Array.isArray(content)) {
						for (const block of content) {
							if (block.type === 'tool_use') {
								const filePath = this.extractFilePathFromToolUse(block as ToolUseBlock);
								if (filePath) {
									onFileModified(filePath);
									if (this.settings.debugContext) {
										console.log('[AgentService] File modification detected:', filePath);
									}
								}
							}
						}
					}
				}

				if (chatMessage) {
					onMessage(chatMessage);
				}
			}

			onComplete();
			return activeSessionId;

		} catch (error) {
			this.handleError(error, activeSessionId, onMessage, onError);
			onComplete();
			return activeSessionId;
		} finally {
			this.currentAbortController = null;
		}
	}

	cancel(): void {
		if (this.currentAbortController) {
			this.currentAbortController.abort();
		}
	}

	/**
	 * Claude CLI 실행 파일 경로를 찾습니다.
	 * 1. 사용자가 설정한 경로가 있으면 사용
	 * 2. 없으면 일반적인 설치 경로에서 자동 탐지
	 */
	private async findClaudeExecutable(): Promise<string | null> {
		// 사용자가 직접 경로를 지정한 경우
		if (this.settings.claudeExecutablePath && this.settings.claudeExecutablePath.trim()) {
			const userPath = this.settings.claudeExecutablePath.trim();
			try {
				await fs.promises.access(userPath, fs.constants.X_OK);
				return userPath;
			} catch {
				console.warn(`[AgentService] User-specified claude path not found or not executable: ${userPath}`);
			}
		}

		const homeDir = os.homedir();
		const isWindows = process.platform === 'win32';

		// 일반적인 Claude CLI 설치 경로
		const searchPaths = isWindows
			? [
				// Windows 경로
				path.join(homeDir, 'AppData', 'Local', 'Programs', 'claude', 'claude.exe'),
				path.join(homeDir, 'AppData', 'Roaming', 'npm', 'claude.cmd'),
				path.join(homeDir, '.local', 'bin', 'claude.exe'),
				path.join(homeDir, 'scoop', 'shims', 'claude.exe'),
				'C:\\Program Files\\Claude\\claude.exe',
			]
			: [
				// macOS / Linux 경로
				path.join(homeDir, '.local', 'bin', 'claude'),
				path.join(homeDir, '.claude', 'local', 'claude'),
				'/usr/local/bin/claude',
				'/opt/homebrew/bin/claude',
				path.join(homeDir, '.nvm', 'versions', 'node', 'current', 'bin', 'claude'),
			];

		for (const searchPath of searchPaths) {
			try {
				await fs.promises.access(searchPath, fs.constants.X_OK);
				console.log(`[AgentService] Found claude executable at: ${searchPath}`);
				return searchPath;
			} catch {
				// 경로를 찾지 못함, 다음 경로 시도
			}
		}

		console.warn('[AgentService] Could not find claude executable in common paths');
		return null;
	}

	private configureApiKey(): void {
		if (this.settings.apiKey) {
			process.env.ANTHROPIC_API_KEY = this.settings.apiKey;
		}
	}

	/**
	 * 시스템 프롬프트를 구성합니다.
	 * 볼트 경로 컨텍스트를 항상 포함하고, 사용자 커스텀 프롬프트와 병합합니다.
	 */
	private buildSystemPrompt(workingDirectory: string): string | { type: 'preset'; preset: 'claude_code'; append: string } {
		// 볼트 경로 컨텍스트 (항상 포함)
		const vaultContext = [
			`IMPORTANT: You are working in an Obsidian vault.`,
			`Vault path: ${workingDirectory}`,
			`All file operations (create, read, write, delete) must be performed within this vault directory.`,
			`When creating new files, always use paths relative to this vault or absolute paths within the vault.`,
		].join('\n');

		const userPrompt = this.settings.systemPrompt?.trim();

		if (userPrompt) {
			// 사용자 커스텀 프롬프트가 있으면 볼트 컨텍스트와 병합
			return `${vaultContext}\n\n--- User Instructions ---\n${userPrompt}`;
		}

		// 기본: Claude Code preset + 볼트 컨텍스트
		return {
			type: 'preset',
			preset: 'claude_code',
			append: `\n\n${vaultContext}`
		};
	}

	private buildQueryOptions(workingDirectory: string, sessionId: string | null | undefined, claudePath: string): Record<string, unknown> {
		// T005: permissionMode 설정에서 읽기
		const permissionMode = this.settings.permissionMode || 'bypassPermissions';

		const options: Record<string, unknown> = {
			model: this.settings.model || 'claude-sonnet-4-5',
			cwd: workingDirectory,
			permissionMode: permissionMode,
			allowDangerouslySkipPermissions: permissionMode === 'bypassPermissions',
			pathToClaudeCodeExecutable: claudePath,
		};

		if (sessionId) {
			options.resume = sessionId;
		}

		// 시스템 프롬프트 적용 (볼트 경로 컨텍스트 항상 포함)
		options.systemPrompt = this.buildSystemPrompt(workingDirectory);

		// T006: maxTurns 옵션 적용 (0보다 클 때만)
		if (this.settings.maxTurns && this.settings.maxTurns > 0) {
			options.maxTurns = this.settings.maxTurns;

			if (this.settings.debugContext) {
				console.log('[AgentService] Max turns set to:', this.settings.maxTurns);
			}
		}

		// T007: maxBudgetUsd 옵션 적용 (API 키가 설정되어 있고, 0보다 클 때만)
		if (this.settings.apiKey && this.settings.maxBudgetUsd && this.settings.maxBudgetUsd > 0) {
			options.maxBudgetUsd = this.settings.maxBudgetUsd;

			if (this.settings.debugContext) {
				console.log('[AgentService] Max budget set to:', this.settings.maxBudgetUsd);
			}
		}

		// T008: Extended Thinking 옵션 적용 (활성화되어 있을 때)
		if (this.settings.enableExtendedThinking) {
			const maxThinkingTokens = this.settings.maxThinkingTokens || 10000;
			options.maxThinkingTokens = maxThinkingTokens;

			if (this.settings.debugContext) {
				console.log('[AgentService] Extended thinking enabled with max tokens:', maxThinkingTokens);
			}
		}

		// MCP 서버 설정 적용
		if (Object.keys(this.mcpServers).length > 0) {
			options.mcpServers = this.mcpServers;

			if (this.settings.debugContext) {
				console.log('[AgentService] MCP servers being passed to SDK:', JSON.stringify(this.mcpServers, null, 2));
			}
		}

		// 비활성화된 내장 도구 적용
		if (this.settings.disabledBuiltinTools && this.settings.disabledBuiltinTools.length > 0) {
			options.disallowedTools = this.settings.disabledBuiltinTools;

			if (this.settings.debugContext) {
				console.log('[AgentService] Disabled built-in tools:', this.settings.disabledBuiltinTools);
			}
		}

		// Skills 기능 활성화
		if (this.settings.enableSkills) {
			// Skills 로드를 위한 settingSources 설정
			options.settingSources = ['project', 'local'];

			// allowedTools에 'Skill' 추가
			const currentAllowedTools = (options.allowedTools as string[]) || [];
			options.allowedTools = [...currentAllowedTools, 'Skill'];

			if (this.settings.debugContext) {
				console.log('[AgentService] Skills enabled with settingSources:', options.settingSources);
				console.log('[AgentService] Allowed tools:', options.allowedTools);
			}
		}

		if (this.settings.debugContext) {
			console.log('[AgentService] Permission mode:', permissionMode);
			console.log('[AgentService] System prompt configured:',
				typeof options.systemPrompt === 'string'
					? options.systemPrompt.substring(0, 300) + '...'
					: JSON.stringify(options.systemPrompt));
		}

		return options;
	}

	/**
	 * tool_use 블록에서 파일 경로를 추출합니다.
	 * Write, Edit 도구의 file_path 파라미터를 확인합니다.
	 */
	private extractFilePathFromToolUse(block: ToolUseBlock): string | null {
		// 파일 수정 도구 목록
		const fileModifyingTools = ['Write', 'Edit'];

		if (fileModifyingTools.includes(block.name)) {
			const input = block.input as Record<string, unknown>;
			const filePath = input.file_path as string | undefined;
			return filePath || null;
		}
		return null;
	}

	private handleError(
		error: unknown,
		sessionId: string | null,
		onMessage: (message: ChatMessage) => void,
		onError: (error: Error) => void
	): void {
		// Log full error for debugging
		console.error('AgentService error:', error);
		if (error instanceof Error && error.stack) {
			console.error('Stack trace:', error.stack);
		}

		if (error instanceof Error && error.name === 'AbortError') {
			const cancelMessage = MessageFactory.createCancelMessage(sessionId);
			onMessage(cancelMessage);
		} else {
			onError(error instanceof Error ? error : new Error(String(error)));
		}
	}
}
