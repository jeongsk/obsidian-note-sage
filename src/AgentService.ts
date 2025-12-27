import { query } from '@anthropic-ai/claude-agent-sdk';
import type { McpServerConfig } from '@anthropic-ai/claude-agent-sdk';
import type { NoteSageSettings, SDKMessage, ChatMessage } from './types';
import { MessageFactory } from './MessageFactory';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface AgentSession {
	sessionId: string | null;
	isActive: boolean;
}

export interface AgentExecutionOptions {
	prompt: string;
	workingDirectory: string;
	sessionId?: string | null;
	onMessage: (message: ChatMessage) => void;
	onError: (error: Error) => void;
	onComplete: () => void;
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
		const { prompt, workingDirectory, sessionId, onMessage, onError, onComplete, signal } = options;

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

				// init 메시지에서 세션 ID 추출
				if (message.type === 'system' && (message as SDKMessage).subtype === 'init') {
					activeSessionId = (message as SDKMessage).session_id || activeSessionId;
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

	private buildQueryOptions(workingDirectory: string, sessionId: string | null | undefined, claudePath: string): Record<string, unknown> {
		const options: Record<string, unknown> = {
			model: this.settings.model || 'claude-sonnet-4-5',
			cwd: workingDirectory,
			permissionMode: 'bypassPermissions' as const,
			allowDangerouslySkipPermissions: true,
			pathToClaudeCodeExecutable: claudePath,
		};

		if (sessionId) {
			options.resume = sessionId;
		}

		// Phase 1-E: 시스템 프롬프트 적용
		if (this.settings.systemPrompt && this.settings.systemPrompt.trim()) {
			options.systemPrompt = this.settings.systemPrompt.trim();
		}

		// MCP 서버 설정 적용
		if (Object.keys(this.mcpServers).length > 0) {
			options.mcpServers = this.mcpServers;
		}

		return options;
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
