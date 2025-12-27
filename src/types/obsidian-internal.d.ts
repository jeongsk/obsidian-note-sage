/**
 * Obsidian 내부 API 타입 정의
 *
 * 주의: 이 API들은 Obsidian의 공식 API가 아니며,
 * 버전 업데이트 시 변경될 수 있습니다.
 */

import type { PluginManifest, Plugin } from 'obsidian';

declare module 'obsidian' {
	interface App {
		plugins: PluginManager;
	}
}

export interface PluginManager {
	/** 설치된 모든 플러그인의 manifest 정보 */
	manifests: Record<string, PluginManifest>;

	/** 현재 활성화된 플러그인 ID 집합 */
	enabledPlugins: Set<string>;

	/** 로드된 플러그인 인스턴스들 */
	plugins: Record<string, Plugin>;

	/** 플러그인을 활성화하고 설정을 저장합니다 */
	enablePluginAndSave(pluginId: string): Promise<void>;

	/** 플러그인을 비활성화하고 설정을 저장합니다 */
	disablePluginAndSave(pluginId: string): Promise<void>;

	/** 플러그인 인스턴스를 가져옵니다 */
	getPlugin(pluginId: string): Plugin | null;
}
