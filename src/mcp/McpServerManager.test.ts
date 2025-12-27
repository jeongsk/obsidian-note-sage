import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpServerManager } from './McpServerManager';
import type { McpServerConfigEntry, McpServerStatus } from '../types';

describe('McpServerManager', () => {
	let manager: McpServerManager;

	beforeEach(() => {
		manager = new McpServerManager();
	});

	describe('Status Management', () => {
		it('should start with empty status cache', () => {
			expect(manager.getAllStatuses()).toEqual([]);
		});

		it('should update and retrieve status', () => {
			const status: McpServerStatus = {
				name: 'test-server',
				status: 'connected',
			};

			manager.updateStatus(status);

			expect(manager.getStatus('test-server')).toEqual(status);
		});

		it('should update multiple statuses', () => {
			const statuses: McpServerStatus[] = [
				{ name: 'server-1', status: 'connected' },
				{ name: 'server-2', status: 'pending' },
			];

			manager.updateStatuses(statuses);

			expect(manager.getAllStatuses()).toHaveLength(2);
			expect(manager.getStatus('server-1')?.status).toBe('connected');
			expect(manager.getStatus('server-2')?.status).toBe('pending');
		});

		it('should return undefined for unknown server', () => {
			expect(manager.getStatus('unknown')).toBeUndefined();
		});

		it('should clear all statuses', () => {
			manager.updateStatus({ name: 'test', status: 'connected' });
			manager.clear();

			expect(manager.getAllStatuses()).toEqual([]);
		});
	});

	describe('Status Change Listeners', () => {
		it('should notify listeners on status update', () => {
			const listener = vi.fn();
			manager.onStatusChange(listener);

			manager.updateStatus({ name: 'test', status: 'connected' });

			expect(listener).toHaveBeenCalledWith([{ name: 'test', status: 'connected' }]);
		});

		it('should unsubscribe listener when calling unsubscribe function', () => {
			const listener = vi.fn();
			const unsubscribe = manager.onStatusChange(listener);

			unsubscribe();
			manager.updateStatus({ name: 'test', status: 'connected' });

			expect(listener).not.toHaveBeenCalled();
		});

		it('should notify multiple listeners', () => {
			const listener1 = vi.fn();
			const listener2 = vi.fn();

			manager.onStatusChange(listener1);
			manager.onStatusChange(listener2);

			manager.updateStatus({ name: 'test', status: 'connected' });

			expect(listener1).toHaveBeenCalled();
			expect(listener2).toHaveBeenCalled();
		});
	});

	describe('SDK Conversion', () => {
		it('should convert stdio entry to SDK config', () => {
			const entry: McpServerConfigEntry = {
				name: 'test-server',
				type: 'stdio',
				enabled: true,
				command: 'npx',
				args: ['-y', '@test/server'],
			};

			const config = McpServerManager.toSdkConfig(entry);

			expect(config.type).toBe('stdio');
			expect((config as { command: string }).command).toBe('npx');
			expect((config as { args?: string[] }).args).toEqual(['-y', '@test/server']);
		});

		it('should convert sse entry to SDK config', () => {
			const entry: McpServerConfigEntry = {
				name: 'test-server',
				type: 'sse',
				enabled: true,
				url: 'http://localhost:8080/sse',
				headers: { Authorization: 'Bearer token' },
			};

			const config = McpServerManager.toSdkConfig(entry);

			expect(config.type).toBe('sse');
			expect((config as { url: string }).url).toBe('http://localhost:8080/sse');
			expect((config as { headers?: Record<string, string> }).headers).toEqual({
				Authorization: 'Bearer token',
			});
		});

		it('should convert http entry to SDK config', () => {
			const entry: McpServerConfigEntry = {
				name: 'test-server',
				type: 'http',
				enabled: true,
				url: 'http://localhost:8080/mcp',
			};

			const config = McpServerManager.toSdkConfig(entry);

			expect(config.type).toBe('http');
			expect((config as { url: string }).url).toBe('http://localhost:8080/mcp');
		});

		it('should only include enabled servers in toSdkMcpServers', () => {
			const entries: McpServerConfigEntry[] = [
				{ name: 'enabled-server', type: 'http', enabled: true, url: 'http://localhost:8080' },
				{ name: 'disabled-server', type: 'http', enabled: false, url: 'http://localhost:8081' },
			];

			const result = McpServerManager.toSdkMcpServers(entries);

			expect(Object.keys(result)).toEqual(['enabled-server']);
		});
	});

	describe('Validation', () => {
		it('should validate stdio entry without command', () => {
			const entry: McpServerConfigEntry = {
				name: 'test',
				type: 'stdio',
				enabled: true,
				command: '',
			};

			const result = manager.validateEntry(entry);

			expect(result.valid).toBe(false);
			expect(result.errorMessage).toBe('Command is required');
		});

		it('should validate sse entry without URL', () => {
			const entry: McpServerConfigEntry = {
				name: 'test',
				type: 'sse',
				enabled: true,
				url: '',
			};

			const result = manager.validateEntry(entry);

			expect(result.valid).toBe(false);
			expect(result.errorMessage).toBe('URL is required');
		});

		it('should validate sse entry with invalid URL', () => {
			const entry: McpServerConfigEntry = {
				name: 'test',
				type: 'sse',
				enabled: true,
				url: 'not-a-valid-url',
			};

			const result = manager.validateEntry(entry);

			expect(result.valid).toBe(false);
			expect(result.errorMessage).toContain('Invalid URL');
		});

		it('should validate sse entry with valid URL', () => {
			const entry: McpServerConfigEntry = {
				name: 'test',
				type: 'sse',
				enabled: true,
				url: 'http://localhost:8080/sse',
			};

			const result = manager.validateEntry(entry);

			expect(result.valid).toBe(true);
		});
	});

	describe('SDK Status Refresh', () => {
		it('should refresh statuses from SDK format', () => {
			const sdkStatuses = [
				{ name: 'server-1', status: 'connected', serverInfo: { name: 'Test', version: '1.0' } },
				{ name: 'server-2', status: 'failed' },
			];

			manager.refreshFromSdk(sdkStatuses);

			expect(manager.getStatus('server-1')?.status).toBe('connected');
			expect(manager.getStatus('server-1')?.serverInfo).toEqual({ name: 'Test', version: '1.0' });
			expect(manager.getStatus('server-2')?.status).toBe('failed');
		});
	});

	describe('Resource Cleanup', () => {
		it('should clear listeners and cache on destroy', () => {
			const listener = vi.fn();
			manager.onStatusChange(listener);
			manager.updateStatus({ name: 'test', status: 'connected' });

			manager.destroy();

			// Listener should not be notified after destroy
			// (although technically it won't be called since listeners are cleared)
			expect(manager.getAllStatuses()).toEqual([]);
		});
	});

	describe('Static Helper Methods', () => {
		it('should return common paths for the current platform', () => {
			const paths = McpServerManager.getCommonPaths();

			expect(Array.isArray(paths)).toBe(true);
			expect(paths.length).toBeGreaterThan(0);
		});

		it('should return enhanced PATH', () => {
			const enhancedPath = McpServerManager.getEnhancedPath();

			expect(typeof enhancedPath).toBe('string');
			expect(enhancedPath.length).toBeGreaterThan(0);
		});
	});
});
