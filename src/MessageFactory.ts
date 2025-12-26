import type {
	ChatMessage,
	SDKMessage,
	ContentBlock,
	SystemChatMessage,
	UserChatMessage,
	AssistantChatMessage,
	ResultChatMessage
} from './types';

/**
 * MessageFactory - 메시지 생성을 담당하는 팩토리 클래스
 *
 * 책임:
 * - UUID 생성
 * - ChatMessage 객체 생성
 * - SDK 메시지 변환
 */
export class MessageFactory {
	/**
	 * UUID 생성
	 */
	static generateUUID(prefix: string): string {
		const timestamp = Date.now();
		const random = Math.random().toString(36).substr(2, 9);
		return `${prefix}-${timestamp}-${random}`;
	}

	/**
	 * 세션 ID 생성 또는 기존 ID 반환
	 */
	static getSessionId(sessionId: string | null): string {
		return sessionId || `session-${Date.now()}`;
	}

	/**
	 * 기본 메시지 속성 생성
	 */
	private static createBaseMessage(sessionId: string | null, prefix: string) {
		return {
			session_id: this.getSessionId(sessionId),
			uuid: this.generateUUID(prefix),
			timestamp: new Date()
		};
	}

	/**
	 * 시스템 메시지 생성
	 */
	static createSystemMessage(
		result: string,
		sessionId: string | null,
		subtype?: 'success' | 'error' | 'init'
	): SystemChatMessage {
		return {
			...this.createBaseMessage(sessionId, 'system'),
			type: 'system',
			result,
			subtype
		};
	}

	/**
	 * 에러 메시지 생성
	 */
	static createErrorMessage(error: Error | string, sessionId: string | null): SystemChatMessage {
		const errorText = error instanceof Error ? error.message : error;
		return {
			...this.createBaseMessage(sessionId, 'error'),
			type: 'system',
			result: `Error: ${errorText}`,
			subtype: 'error'
		};
	}

	/**
	 * 취소 메시지 생성
	 */
	static createCancelMessage(sessionId: string | null): SystemChatMessage {
		return {
			...this.createBaseMessage(sessionId, 'cancel'),
			type: 'system',
			result: 'Message execution cancelled'
		};
	}

	/**
	 * 사용자 입력 메시지 생성
	 */
	static createUserInputMessage(text: string, sessionId: string | null): UserChatMessage {
		return {
			...this.createBaseMessage(sessionId, 'user'),
			type: 'user',
			message: {
				id: `msg-${Date.now()}`,
				role: 'user',
				content: [{ type: 'text', text }]
			},
			isUserInput: true
		};
	}

	/**
	 * SDK 메시지를 ChatMessage로 변환
	 */
	static convertSDKMessage(sdkMessage: SDKMessage, sessionId: string | null): ChatMessage | null {
		const baseMessage = this.createBaseMessage(
			sdkMessage.session_id || sessionId,
			sdkMessage.type
		);

		switch (sdkMessage.type) {
			case 'system':
				return this.convertSystemMessage(sdkMessage, baseMessage);

			case 'assistant':
				return this.convertAssistantMessage(sdkMessage, baseMessage);

			case 'user':
				return this.convertUserMessage(sdkMessage, baseMessage);

			case 'result':
				return this.convertResultMessage(sdkMessage, baseMessage);

			default:
				return null;
		}
	}

	/**
	 * 시스템 SDK 메시지 변환
	 */
	private static convertSystemMessage(
		sdkMessage: SDKMessage,
		baseMessage: { session_id: string; uuid: string; timestamp: Date }
	): SystemChatMessage | null {
		if (sdkMessage.subtype === 'init') {
			return {
				...baseMessage,
				type: 'system',
				subtype: 'init',
				session_id: sdkMessage.session_id || baseMessage.session_id
			};
		}
		return null;
	}

	/**
	 * Assistant SDK 메시지 변환
	 */
	private static convertAssistantMessage(
		sdkMessage: SDKMessage,
		baseMessage: { session_id: string; uuid: string; timestamp: Date }
	): AssistantChatMessage | null {
		if (!sdkMessage.message) return null;

		return {
			...baseMessage,
			type: 'assistant',
			message: {
				id: sdkMessage.message.id || `msg-${Date.now()}`,
				role: 'assistant',
				content: (sdkMessage.message.content || []) as ContentBlock[],
				model: sdkMessage.message.model,
				usage: sdkMessage.message.usage
			}
		};
	}

	/**
	 * User SDK 메시지 변환 (도구 결과)
	 */
	private static convertUserMessage(
		sdkMessage: SDKMessage,
		baseMessage: { session_id: string; uuid: string; timestamp: Date }
	): UserChatMessage | null {
		if (!sdkMessage.message) return null;

		return {
			...baseMessage,
			type: 'user',
			message: {
				id: sdkMessage.message.id || `msg-${Date.now()}`,
				role: 'user',
				content: (sdkMessage.message.content || []) as ContentBlock[]
			}
		};
	}

	/**
	 * Result SDK 메시지 변환
	 */
	private static convertResultMessage(
		sdkMessage: SDKMessage,
		baseMessage: { session_id: string; uuid: string; timestamp: Date }
	): ResultChatMessage {
		return {
			...baseMessage,
			type: 'result',
			subtype: sdkMessage.subtype === 'error' ? 'error' : 'success',
			duration_ms: sdkMessage.duration_ms,
			duration_api_ms: sdkMessage.duration_api_ms,
			is_error: sdkMessage.is_error,
			num_turns: sdkMessage.num_turns,
			result: sdkMessage.result,
			total_cost_usd: sdkMessage.total_cost_usd
		};
	}
}
