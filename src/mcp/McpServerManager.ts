import type { McpServerConfig } from '@anthropic-ai/claude-agent-sdk';
import type { McpServerConfigEntry, McpServerStatus } from '../types';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { spawnSync } from 'child_process';

/**
 * McpServerManager - MCP 서버 상태를 관리하는 클래스
 *
 * 책임:
 * - MCP 서버 상태 캐싱 및 조회
 * - 상태 변경 리스너 관리
 * - 설정을 SDK 형식으로 변환
 */
export class McpServerManager {
	private statusCache: Map<string, McpServerStatus> = new Map();
	private listeners: Set<(statuses: McpServerStatus[]) => void> = new Set();

	/**
	 * 명령어가 시스템에서 실행 가능한지 확인
	 * @param command - 검사할 명령어
	 * @returns { found: boolean, resolvedPath?: string } - 명령어 존재 여부와 전체 경로
	 */
	static validateCommand(command: string): { found: boolean; resolvedPath?: string } {
		const isWindows = process.platform === 'win32';
		const enhancedPath = McpServerManager.getEnhancedPath();

		// 절대 경로인 경우 직접 확인
		if (path.isAbsolute(command)) {
			try {
				fs.accessSync(command, fs.constants.X_OK);
				return { found: true, resolvedPath: command };
			} catch {
				return { found: false };
			}
		}

		// which/where 명령어로 경로 확인
		const whichCommand = isWindows ? 'where' : 'which';
		const result = spawnSync(whichCommand, [command], {
			env: {
				...process.env,
				PATH: enhancedPath
			},
			encoding: 'utf-8',
			timeout: 5000,
			shell: isWindows
		});

		if (result.status === 0 && result.stdout) {
			const resolvedPath = result.stdout.trim().split('\n')[0];
			return { found: true, resolvedPath };
		}

		// 일반적인 패키지 관리자 경로에서 직접 검색
		const commonPaths = McpServerManager.getCommonPaths();
		for (const basePath of commonPaths) {
			const fullPath = path.join(basePath, command);
			try {
				fs.accessSync(fullPath, fs.constants.X_OK);
				return { found: true, resolvedPath: fullPath };
			} catch {
				// 계속 검색
			}
		}

		return { found: false };
	}

	/**
	 * 일반적인 패키지 관리자 경로 목록 반환
	 */
	static getCommonPaths(): string[] {
		const homeDir = os.homedir();
		const isWindows = process.platform === 'win32';

		return isWindows
			? [
				path.join(homeDir, 'AppData', 'Roaming', 'npm'),
				path.join(homeDir, 'AppData', 'Local', 'pnpm'),
				path.join(homeDir, '.bun', 'bin'),
				path.join(homeDir, '.deno', 'bin'),
				path.join(homeDir, '.cargo', 'bin'),
				path.join(homeDir, 'scoop', 'shims'),
				'C:\\Program Files\\nodejs',
			]
			: [
				path.join(homeDir, '.bun', 'bin'),           // Bun
				path.join(homeDir, '.local', 'bin'),         // pipx, poetry 등
				path.join(homeDir, '.deno', 'bin'),          // Deno
				path.join(homeDir, '.cargo', 'bin'),         // Rust/Cargo
				path.join(homeDir, '.npm-global', 'bin'),    // npm global
				'/opt/homebrew/bin',                          // Homebrew (Apple Silicon)
				'/usr/local/bin',                             // Homebrew (Intel Mac) / 일반 Unix
				'/opt/local/bin',                             // MacPorts
				path.join(homeDir, '.nvm', 'current', 'bin'), // NVM (심볼릭 링크)
				path.join(homeDir, '.volta', 'bin'),          // Volta
				path.join(homeDir, '.asdf', 'shims'),         // asdf
				path.join(homeDir, '.pyenv', 'shims'),        // pyenv
				path.join(homeDir, '.rbenv', 'shims'),        // rbenv
			];
	}

	/**
	 * 일반적인 패키지 관리자 경로를 포함한 확장된 PATH를 생성
	 * Electron/GUI 앱에서는 셸 초기화 스크립트가 로드되지 않아 PATH가 제한적이므로
	 * 일반적으로 사용되는 패키지 관리자 경로를 자동으로 추가
	 */
	static getEnhancedPath(): string {
		const existingPath = process.env.PATH || '';
		const isWindows = process.platform === 'win32';
		const pathSeparator = isWindows ? ';' : ':';

		// 기존 PATH와 일반적인 패키지 관리자 경로를 결합 (중복 제거)
		const pathSet = new Set(existingPath.split(pathSeparator).filter(p => p));
		for (const p of McpServerManager.getCommonPaths()) {
			pathSet.add(p);
		}

		return Array.from(pathSet).join(pathSeparator);
	}

	/**
	 * McpServerConfigEntry를 SDK의 McpServerConfig로 변환
	 * stdio 타입의 경우 process.env를 병합하고 확장된 PATH를 사용
	 */
	static toSdkConfig(entry: McpServerConfigEntry): McpServerConfig {
		if (entry.type === 'stdio') {
			const enhancedPath = McpServerManager.getEnhancedPath();
			return {
				type: 'stdio',
				command: entry.command!,
				args: entry.args,
				// Electron 환경에서 PATH 등 시스템 환경변수를 상속하고 확장된 PATH 사용
				env: {
					...process.env as Record<string, string>,
					PATH: enhancedPath,
					...entry.env  // 사용자 설정이 최우선
				}
			};
		} else if (entry.type === 'sse') {
			return {
				type: 'sse',
				url: entry.url!,
				headers: entry.headers
			};
		} else {
			return {
				type: 'http',
				url: entry.url!,
				headers: entry.headers
			};
		}
	}

	/**
	 * 활성화된 서버 목록을 SDK의 mcpServers 객체로 변환
	 */
	static toSdkMcpServers(entries: McpServerConfigEntry[]): Record<string, McpServerConfig> {
		return entries
			.filter(e => e.enabled)
			.reduce((acc, e) => {
				acc[e.name] = McpServerManager.toSdkConfig(e);
				return acc;
			}, {} as Record<string, McpServerConfig>);
	}

	/**
	 * 특정 서버의 상태 조회
	 */
	getStatus(serverName: string): McpServerStatus | undefined {
		return this.statusCache.get(serverName);
	}

	/**
	 * 모든 서버 상태 조회
	 */
	getAllStatuses(): McpServerStatus[] {
		return Array.from(this.statusCache.values());
	}

	/**
	 * 서버 상태 업데이트
	 */
	updateStatus(status: McpServerStatus): void {
		this.statusCache.set(status.name, status);
		this.notifyListeners();
	}

	/**
	 * 여러 서버 상태 일괄 업데이트
	 */
	updateStatuses(statuses: McpServerStatus[]): void {
		for (const status of statuses) {
			this.statusCache.set(status.name, status);
		}
		this.notifyListeners();
	}

	/**
	 * SDK에서 받은 상태 정보로 캐시 갱신
	 * @param sdkStatuses - SDK의 mcpServerStatus() 반환값
	 */
	refreshFromSdk(sdkStatuses: Array<{ name: string; status: string; serverInfo?: { name: string; version: string } }>): void {
		const newStatuses: McpServerStatus[] = sdkStatuses.map(s => ({
			name: s.name,
			status: s.status as McpServerStatus['status'],
			serverInfo: s.serverInfo
		}));
		this.updateStatuses(newStatuses);
	}

	/**
	 * 상태 변경 리스너 등록
	 * @returns 리스너 해제 함수
	 */
	onStatusChange(listener: (statuses: McpServerStatus[]) => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	/**
	 * 모든 리스너에게 상태 변경 알림
	 */
	private notifyListeners(): void {
		const statuses = this.getAllStatuses();
		for (const listener of this.listeners) {
			listener(statuses);
		}
	}

	/**
	 * 캐시 초기화
	 */
	clear(): void {
		this.statusCache.clear();
		this.notifyListeners();
	}

	/**
	 * 리소스 정리
	 */
	destroy(): void {
		this.listeners.clear();
		this.statusCache.clear();
	}

	// ==================== 로컬 검증 ====================

	/**
	 * 검증 결과 타입
	 */
	static ValidationResult: { valid: boolean; errorMessage?: string };

	/**
	 * 단일 MCP 서버 설정을 로컬에서 검증
	 * - stdio: 명령어 존재 여부 확인
	 * - sse/http: URL 형식 유효성 검사
	 * @param entry - 검증할 서버 설정
	 * @returns 검증 결과
	 */
	validateEntry(entry: McpServerConfigEntry): { valid: boolean; errorMessage?: string } {
		if (entry.type === 'stdio') {
			if (!entry.command) {
				return { valid: false, errorMessage: 'Command is required' };
			}
			const result = McpServerManager.validateCommand(entry.command);
			return {
				valid: result.found,
				errorMessage: result.found ? undefined : `Command "${entry.command}" not found`
			};
		} else {
			// sse 또는 http
			if (!entry.url) {
				return { valid: false, errorMessage: 'URL is required' };
			}
			try {
				new URL(entry.url);
				return { valid: true };
			} catch {
				return { valid: false, errorMessage: `Invalid URL: ${entry.url}` };
			}
		}
	}

	/**
	 * 모든 활성화된 MCP 서버를 로컬에서 검증하고 상태 업데이트
	 * @param entries - 검증할 서버 설정 목록
	 */
	validateAllEnabled(entries: McpServerConfigEntry[]): void {
		const enabled = entries.filter(e => e.enabled);

		for (const entry of enabled) {
			const result = this.validateEntry(entry);
			this.updateStatus({
				name: entry.name,
				status: result.valid ? 'pending' : 'failed',
				errorMessage: result.errorMessage
			});
		}
	}
}
