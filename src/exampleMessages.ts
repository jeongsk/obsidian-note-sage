import type { ChatMessage } from './types';

/**
 * 예제 메시지 데이터
 *
 * 데모 및 테스트 목적으로 사용되는 예제 대화 메시지들
 */

const EXAMPLE_SESSION_ID = '4e639301-8fe0-4d70-a47e-db0b0605effa';

/**
 * 예제 메시지 생성 함수
 * 매번 새로운 타임스탬프로 메시지를 생성합니다
 */
export function createExampleMessages(): ChatMessage[] {
	const now = new Date();

	return [
		// 사용자 질문
		{
			type: 'user',
			message: {
				id: 'msg-user-001',
				role: 'user',
				content: [{
					type: 'text',
					text: 'Could you make a plan for finding the date, execute the necessary steps, and then tell me the current datetime?'
				}]
			},
			session_id: EXAMPLE_SESSION_ID,
			uuid: 'user-example-001',
			timestamp: now,
			isUserInput: true
		},

		// 시스템 초기화
		{
			type: 'system',
			subtype: 'init',
			session_id: EXAMPLE_SESSION_ID,
			uuid: 'system-init-001',
			timestamp: now
		},

		// Assistant 텍스트 응답
		{
			type: 'assistant',
			message: {
				id: 'msg_01QKejYVNzKEvJiLdgsjDnX8',
				role: 'assistant',
				content: [{
					type: 'text',
					text: "I'll help you find the current datetime. Let me create a plan and execute it."
				}],
				model: 'claude-sonnet-4-20250514',
				usage: {
					input_tokens: 4,
					output_tokens: 7,
					service_tier: 'standard'
				}
			},
			session_id: EXAMPLE_SESSION_ID,
			uuid: 'assistant-text-001',
			timestamp: now
		},

		// Todo 도구 사용
		{
			type: 'assistant',
			message: {
				id: 'msg_01TodoExample',
				role: 'assistant',
				content: [{
					type: 'tool_use',
					id: 'toolu_01XraaAU5TbdkpPhUq9Gepry',
					name: 'TodoWrite',
					input: {
						todos: [
							{
								content: 'Get current datetime using system command',
								status: 'pending',
								activeForm: 'Getting current datetime using system command'
							},
							{
								content: 'Format and display the result',
								status: 'pending',
								activeForm: 'Formatting and displaying the result'
							}
						]
					}
				}],
				model: 'claude-sonnet-4-20250514'
			},
			session_id: EXAMPLE_SESSION_ID,
			uuid: 'todo-tool-001',
			timestamp: now
		},

		// Todo 도구 결과
		{
			type: 'user',
			message: {
				id: 'msg-tool-result-001',
				role: 'user',
				content: [{
					type: 'tool_result',
					tool_use_id: 'toolu_01XraaAU5TbdkpPhUq9Gepry',
					content: 'Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable'
				}]
			},
			session_id: EXAMPLE_SESSION_ID,
			uuid: 'tool-result-001',
			timestamp: now
		},

		// Bash 도구 사용
		{
			type: 'assistant',
			message: {
				id: 'msg_01BashExample',
				role: 'assistant',
				content: [{
					type: 'tool_use',
					id: 'toolu_0145mNNv4HW3V7LUTNwitdwd',
					name: 'Bash',
					input: {
						command: 'date',
						description: 'Get current date and time'
					}
				}],
				model: 'claude-sonnet-4-20250514'
			},
			session_id: EXAMPLE_SESSION_ID,
			uuid: 'bash-tool-001',
			timestamp: now
		},

		// Bash 도구 결과
		{
			type: 'user',
			message: {
				id: 'msg-bash-result-001',
				role: 'user',
				content: [{
					type: 'tool_result',
					tool_use_id: 'toolu_0145mNNv4HW3V7LUTNwitdwd',
					content: 'Wed 27 Aug 2025 09:54:15 EDT',
					is_error: false
				}]
			},
			session_id: EXAMPLE_SESSION_ID,
			uuid: 'bash-result-001',
			timestamp: now
		},

		// Todo 업데이트
		{
			type: 'assistant',
			message: {
				id: 'msg_01TodoUpdate',
				role: 'assistant',
				content: [{
					type: 'tool_use',
					id: 'toolu_01TodoComplete',
					name: 'TodoWrite',
					input: {
						todos: [
							{
								content: 'Get current datetime using system command',
								status: 'completed',
								activeForm: 'Getting current datetime using system command'
							},
							{
								content: 'Format and display the result',
								status: 'in_progress',
								activeForm: 'Formatting and displaying the result'
							}
						]
					}
				}],
				model: 'claude-sonnet-4-20250514'
			},
			session_id: EXAMPLE_SESSION_ID,
			uuid: 'todo-update-001',
			timestamp: now
		},

		// 최종 결과
		{
			type: 'result',
			result: 'The current datetime is: **Wednesday, August 27, 2025 at 9:54:15 AM EDT**',
			session_id: EXAMPLE_SESSION_ID,
			uuid: 'final-result-001',
			timestamp: now
		}
	];
}
