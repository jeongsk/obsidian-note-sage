import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MessageFactory } from './MessageFactory';

// i18n 모킹
vi.mock('./i18n', () => ({
	t: (key: string) => key,
}));

describe('MessageFactory', () => {
	describe('generateUUID', () => {
		it('should generate UUID with prefix', () => {
			const uuid = MessageFactory.generateUUID('test');
			expect(uuid).toMatch(/^test-\d+-[a-z0-9]+$/);
		});

		it('should generate unique UUIDs', () => {
			const uuid1 = MessageFactory.generateUUID('test');
			const uuid2 = MessageFactory.generateUUID('test');
			expect(uuid1).not.toBe(uuid2);
		});
	});

	describe('getSessionId', () => {
		it('should return provided session ID if not null', () => {
			const sessionId = 'existing-session';
			expect(MessageFactory.getSessionId(sessionId)).toBe(sessionId);
		});

		it('should generate new session ID if null', () => {
			const sessionId = MessageFactory.getSessionId(null);
			expect(sessionId).toMatch(/^session-\d+$/);
		});
	});

	describe('createSystemMessage', () => {
		it('should create system message with result', () => {
			const message = MessageFactory.createSystemMessage('test result', 'session-123');

			expect(message.type).toBe('system');
			expect(message.result).toBe('test result');
			expect(message.session_id).toBe('session-123');
			expect(message.uuid).toMatch(/^system-/);
			expect(message.timestamp).toBeInstanceOf(Date);
		});

		it('should include subtype when provided', () => {
			const message = MessageFactory.createSystemMessage('test', 'session-123', 'success');

			expect(message.subtype).toBe('success');
		});
	});

	describe('createErrorMessage', () => {
		it('should create error message from Error object', () => {
			const error = new Error('Something went wrong');
			const message = MessageFactory.createErrorMessage(error, 'session-123');

			expect(message.type).toBe('system');
			expect(message.result).toBe('error: Something went wrong');
			expect(message.subtype).toBe('error');
		});

		it('should create error message from string', () => {
			const message = MessageFactory.createErrorMessage('Error message', 'session-123');

			expect(message.result).toBe('error: Error message');
			expect(message.subtype).toBe('error');
		});
	});

	describe('createCancelMessage', () => {
		it('should create cancel message', () => {
			const message = MessageFactory.createCancelMessage('session-123');

			expect(message.type).toBe('system');
			expect(message.result).toBe('executionCancelled');
		});
	});

	describe('createUserInputMessage', () => {
		it('should create user input message', () => {
			const message = MessageFactory.createUserInputMessage('Hello', 'session-123');

			expect(message.type).toBe('user');
			expect(message.isUserInput).toBe(true);
			expect(message.message.role).toBe('user');
			expect(message.message.content).toEqual([{ type: 'text', text: 'Hello' }]);
		});
	});

	describe('convertSDKMessage', () => {
		it('should convert system init message', () => {
			const sdkMessage = {
				type: 'system' as const,
				subtype: 'init' as const,
				session_id: 'sdk-session-123',
			};

			const result = MessageFactory.convertSDKMessage(sdkMessage, null);

			expect(result).not.toBeNull();
			expect(result!.type).toBe('system');
			expect((result as { subtype?: string }).subtype).toBe('init');
			expect(result!.session_id).toBe('sdk-session-123');
		});

		it('should convert assistant message', () => {
			const sdkMessage = {
				type: 'assistant' as const,
				message: {
					id: 'msg-123',
					role: 'assistant' as const,
					content: [{ type: 'text' as const, text: 'Hello' }],
					model: 'claude-3-sonnet',
				},
			};

			const result = MessageFactory.convertSDKMessage(sdkMessage, 'session-123');

			expect(result).not.toBeNull();
			expect(result!.type).toBe('assistant');
		});

		it('should convert user message', () => {
			const sdkMessage = {
				type: 'user' as const,
				message: {
					id: 'msg-123',
					role: 'user' as const,
					content: [{ type: 'tool_result' as const, tool_use_id: 'tool-1', content: 'result' }],
				},
			};

			const result = MessageFactory.convertSDKMessage(sdkMessage, 'session-123');

			expect(result).not.toBeNull();
			expect(result!.type).toBe('user');
		});

		it('should convert result message', () => {
			const sdkMessage = {
				type: 'result' as const,
				duration_ms: 1000,
				duration_api_ms: 800,
				is_error: false,
				num_turns: 2,
				result: 'Success',
			};

			const result = MessageFactory.convertSDKMessage(sdkMessage, 'session-123');

			expect(result).not.toBeNull();
			expect(result!.type).toBe('result');
			expect((result as { duration_ms?: number }).duration_ms).toBe(1000);
		});

		it('should return null for unknown message types', () => {
			const sdkMessage = {
				type: 'unknown' as unknown,
			};

			const result = MessageFactory.convertSDKMessage(sdkMessage as any, 'session-123');

			expect(result).toBeNull();
		});

		it('should return null for assistant message without message content', () => {
			const sdkMessage = {
				type: 'assistant' as const,
				message: undefined,
			};

			const result = MessageFactory.convertSDKMessage(sdkMessage as any, 'session-123');

			expect(result).toBeNull();
		});
	});
});
