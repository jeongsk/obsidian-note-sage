/**
 * Obsidian 플러그인 관리 MCP 도구
 *
 * Claude 에이전트가 Obsidian 플러그인을 조회하고 관리할 수 있는 도구를 제공합니다.
 */

import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { App, PluginManifest } from 'obsidian';
import type { PluginManager } from '../types/obsidian-internal';

/** 보호된 플러그인 ID 목록 (비활성화 불가) */
const PROTECTED_PLUGINS = ['obsidian-note-sage'];

/** 플러그인 정보 인터페이스 */
interface PluginInfo {
	id: string;
	name: string;
	version: string;
	description: string;
	author: string;
	enabled: boolean;
}

/**
 * Obsidian 플러그인 관리 MCP 서버를 생성합니다.
 *
 * @param app - Obsidian App 인스턴스
 * @returns MCP 서버 설정 객체
 */
export function createObsidianPluginToolsServer(app: App) {
	const pluginsApi = (app as unknown as { plugins: PluginManager }).plugins;

	return createSdkMcpServer({
		name: 'obsidian-plugins',
		version: '1.0.0',
		tools: [
			// list_plugins: 플러그인 목록 조회
			tool(
				'list_plugins',
				'List all installed Obsidian plugins with their status. Returns plugin id, name, version, description, author, and enabled status.',
				{
					filter: z
						.enum(['all', 'enabled', 'disabled'])
						.optional()
						.describe('Filter plugins by status. Default: all'),
				},
				async (args) => {
					const manifests = pluginsApi.manifests;
					const enabledPlugins = pluginsApi.enabledPlugins;
					const filter = args.filter || 'all';

					const plugins: PluginInfo[] = Object.entries(manifests)
						.map(([id, manifest]: [string, PluginManifest]) => ({
							id,
							name: manifest.name,
							version: manifest.version,
							description: manifest.description,
							author: manifest.author,
							enabled: enabledPlugins.has(id),
						}))
						.filter((p) => {
							if (filter === 'enabled') return p.enabled;
							if (filter === 'disabled') return !p.enabled;
							return true;
						})
						.sort((a, b) => a.name.localeCompare(b.name));

					return {
						content: [
							{
								type: 'text' as const,
								text: JSON.stringify(
									{
										count: plugins.length,
										plugins,
									},
									null,
									2
								),
							},
						],
					};
				}
			),

			// get_plugin_info: 특정 플러그인 상세 정보 조회
			tool(
				'get_plugin_info',
				'Get detailed information about a specific Obsidian plugin including id, name, version, description, author, authorUrl, isDesktopOnly, minAppVersion, and enabled status.',
				{
					pluginId: z.string().describe('The plugin ID to get info for'),
				},
				async (args) => {
					const manifest = pluginsApi.manifests[args.pluginId];
					if (!manifest) {
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										error: `Plugin "${args.pluginId}" not found`,
									}),
								},
							],
						};
					}

					const enabled = pluginsApi.enabledPlugins.has(args.pluginId);

					return {
						content: [
							{
								type: 'text' as const,
								text: JSON.stringify(
									{
										id: args.pluginId,
										name: manifest.name,
										version: manifest.version,
										description: manifest.description,
										author: manifest.author,
										authorUrl: manifest.authorUrl,
										isDesktopOnly: manifest.isDesktopOnly,
										minAppVersion: manifest.minAppVersion,
										enabled,
									},
									null,
									2
								),
							},
						],
					};
				}
			),

			// enable_plugin: 플러그인 활성화
			tool(
				'enable_plugin',
				'Enable a disabled Obsidian plugin. The plugin will be activated and the setting will be saved.',
				{
					pluginId: z.string().describe('The plugin ID to enable'),
				},
				async (args) => {
					const manifest = pluginsApi.manifests[args.pluginId];
					if (!manifest) {
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										success: false,
										error: `Plugin "${args.pluginId}" not found`,
									}),
								},
							],
						};
					}

					if (pluginsApi.enabledPlugins.has(args.pluginId)) {
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										success: true,
										message: `Plugin "${manifest.name}" is already enabled`,
									}),
								},
							],
						};
					}

					try {
						await pluginsApi.enablePluginAndSave(args.pluginId);
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										success: true,
										message: `Plugin "${manifest.name}" has been enabled`,
									}),
								},
							],
						};
					} catch (error) {
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										success: false,
										error: String(error),
									}),
								},
							],
						};
					}
				}
			),

			// disable_plugin: 플러그인 비활성화
			tool(
				'disable_plugin',
				'Disable an enabled Obsidian plugin. The plugin will be deactivated and the setting will be saved. Note: Some core plugins cannot be disabled.',
				{
					pluginId: z.string().describe('The plugin ID to disable'),
				},
				async (args) => {
					// 보호된 플러그인 체크
					if (PROTECTED_PLUGINS.includes(args.pluginId)) {
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										success: false,
										error: `Plugin "${args.pluginId}" is protected and cannot be disabled`,
									}),
								},
							],
						};
					}

					const manifest = pluginsApi.manifests[args.pluginId];
					if (!manifest) {
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										success: false,
										error: `Plugin "${args.pluginId}" not found`,
									}),
								},
							],
						};
					}

					if (!pluginsApi.enabledPlugins.has(args.pluginId)) {
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										success: true,
										message: `Plugin "${manifest.name}" is already disabled`,
									}),
								},
							],
						};
					}

					try {
						await pluginsApi.disablePluginAndSave(args.pluginId);
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										success: true,
										message: `Plugin "${manifest.name}" has been disabled`,
									}),
								},
							],
						};
					} catch (error) {
						return {
							content: [
								{
									type: 'text' as const,
									text: JSON.stringify({
										success: false,
										error: String(error),
									}),
								},
							],
						};
					}
				}
			),
		],
	});
}
