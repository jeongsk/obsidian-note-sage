import type { McpServerConfig } from '@anthropic-ai/claude-agent-sdk';
import type { McpServerConfigEntry, McpServerStatus } from '../types';

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
	 * McpServerConfigEntry를 SDK의 McpServerConfig로 변환
	 * stdio 타입의 경우 process.env를 병합하여 PATH 등 시스템 환경변수를 상속
	 */
	static toSdkConfig(entry: McpServerConfigEntry): McpServerConfig {
		if (entry.type === 'stdio') {
			return {
				type: 'stdio',
				command: entry.command!,
				args: entry.args,
				// Electron 환경에서 PATH 등 시스템 환경변수를 상속하기 위해 process.env 병합
				env: {
					...process.env as Record<string, string>,
					...entry.env
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
}
