import { Component, sanitizeHTMLToDom, setIcon } from 'obsidian';
import type {
	ChatMessage,
	ContentBlock,
	TextBlock,
	ToolUseBlock,
	ToolResultBlock,
	UserChatMessage,
	AssistantChatMessage
} from './types';
import { t } from './i18n';

/**
 * ChatRenderer - 채팅 메시지 렌더링을 담당하는 클래스
 *
 * 책임:
 * - 메시지 타입별 렌더링
 * - 콘텐츠 블록 렌더링 (텍스트, 도구 사용, 도구 결과)
 * - 텍스트 포맷팅
 */
export class ChatRenderer {
	private messagesContainer: HTMLElement;
	private component: Component;

	constructor(messagesContainer: HTMLElement, component: Component) {
		this.messagesContainer = messagesContainer;
		this.component = component;
	}

	/**
	 * 메인 렌더링 메서드 - 메시지 타입에 따라 적절한 렌더러 호출
	 */
	renderMessage(chatMessage: ChatMessage): void {
		try {
			const messageEl = this.createMessageElement(chatMessage);

			if (chatMessage.type === 'user' && !chatMessage.isUserInput) {
				this.renderThinkingMessage(messageEl, chatMessage);
			} else if (chatMessage.type === 'assistant') {
				this.renderAssistantThought(messageEl, chatMessage);
			} else if (chatMessage.type === 'result') {
				this.renderFinalResponse(messageEl, chatMessage);
			} else {
				const contentEl = messageEl.createEl('div', { cls: 'sage-message-content' });
				this.renderMessageContent(contentEl, chatMessage);
			}

			this.renderTimestamp(messageEl, chatMessage);
			this.scrollToBottom();
		} catch (error) {
			console.error('Error rendering message:', error, chatMessage);
		}
	}

	/**
	 * 메시지 요소 생성 및 CSS 클래스 적용
	 */
	private createMessageElement(chatMessage: ChatMessage): HTMLElement {
		let cssClass = 'sage-chat-message';

		if (chatMessage.type === 'user' && chatMessage.isUserInput) {
			cssClass += ' sage-chat-message-user';
		} else if (chatMessage.type === 'result') {
			cssClass += ' sage-chat-message-final-response';
		} else {
			cssClass += ' sage-chat-message-assistant';
		}

		return this.messagesContainer.createEl('div', { cls: cssClass });
	}

	/**
	 * 타임스탬프 렌더링
	 */
	private renderTimestamp(messageEl: HTMLElement, chatMessage: ChatMessage): void {
		const showTimestamp =
			chatMessage.timestamp &&
			((chatMessage.type === 'user' && chatMessage.isUserInput) || chatMessage.type === 'result');

		if (showTimestamp) {
			const timestampEl = messageEl.createEl('div', { cls: 'sage-message-timestamp' });
			timestampEl.setText(chatMessage.timestamp!.toLocaleTimeString());
		}
	}

	/**
	 * 스크롤을 메시지 컨테이너 하단으로 이동
	 */
	private scrollToBottom(): void {
		requestAnimationFrame(() => {
			this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
		});
	}

	/**
	 * 메시지 콘텐츠 렌더링 - 콘텐츠 블록 타입별 처리
	 */
	renderMessageContent(container: HTMLElement, chatMessage: ChatMessage): void {
		try {
			if (chatMessage.type === 'user' || chatMessage.type === 'assistant') {
				this.renderContentBlocks(container, chatMessage.message.content);
			} else if (chatMessage.type === 'result' && chatMessage.result) {
				this.renderResult(container, chatMessage.result);
			} else if (chatMessage.type === 'system') {
				if (chatMessage.subtype === 'init') {
					this.renderInitMessage(container);
				} else if (chatMessage.result) {
					this.renderResult(container, chatMessage.result);
				} else if (chatMessage.subtype) {
					container.createEl('div', { text: `${t('system')}: ${chatMessage.subtype}` });
				}
			}
		} catch (error) {
			console.warn('Error rendering message content:', error, chatMessage);
			container.createEl('div', {
				text: t('errorRenderingMessage'),
				cls: 'sage-error-message'
			});
		}
	}

	/**
	 * 콘텐츠 블록 배열 렌더링
	 */
	private renderContentBlocks(container: HTMLElement, contents: ContentBlock[]): void {
		contents.forEach((content: ContentBlock) => {
			switch (content.type) {
				case 'text':
					this.renderTextBlock(container, content);
					break;
				case 'tool_use':
					this.renderToolUseBlock(container, content);
					break;
				case 'tool_result':
					this.renderToolResultBlock(container, content);
					break;
			}
		});
	}

	/**
	 * 텍스트 블록 렌더링
	 */
	private renderTextBlock(container: HTMLElement, content: TextBlock): void {
		const textEl = container.createEl('div', { cls: 'sage-message-text' });
		const sanitizedDom = sanitizeHTMLToDom(this.formatText(content.text));
		textEl.appendChild(sanitizedDom);

		// Phase 2-G: 복사 버튼 이벤트 리스너 추가
		this.attachCopyButtonListeners(textEl);
	}

	/**
	 * Phase 2-G: 복사 버튼 이벤트 리스너 부착
	 */
	private attachCopyButtonListeners(container: HTMLElement): void {
		const copyButtons = container.querySelectorAll('.sage-copy-button');
		copyButtons.forEach(button => {
			this.component.registerDomEvent(button as HTMLElement, 'click', async (e) => {
				e.preventDefault();
				e.stopPropagation();

				const target = e.target as HTMLElement;
				const code = target.getAttribute('data-code');

				if (code) {
					try {
						// HTML 엔티티 디코딩
						const decodedCode = this.decodeHtmlEntities(code);
						await navigator.clipboard.writeText(decodedCode);

						// 버튼 텍스트 변경
						const originalText = target.textContent;
						target.textContent = t('copied');
						target.classList.add('copied');

						window.setTimeout(() => {
							target.textContent = originalText;
							target.classList.remove('copied');
						}, 2000);
					} catch (error) {
						console.error('Failed to copy:', error);
					}
				}
			});
		});
	}

	/**
	 * HTML 엔티티 디코딩
	 */
	private decodeHtmlEntities(text: string): string {
		const parser = new DOMParser();
		const doc = parser.parseFromString(`<!DOCTYPE html><body>${text}</body>`, 'text/html');
		return doc.body.textContent || '';
	}

	/**
	 * 도구 사용 블록 렌더링
	 */
	private renderToolUseBlock(container: HTMLElement, content: ToolUseBlock): void {
		if (content.name === 'TodoWrite') {
			this.renderTodoCard(container, content);
		} else {
			this.renderCollapsibleTool(container, content);
		}
	}

	/**
	 * 도구 결과 블록 렌더링
	 */
	private renderToolResultBlock(container: HTMLElement, content: ToolResultBlock): void {
		const resultEl = container.createEl('div', { cls: 'sage-tool-result' });
		const pre = resultEl.createEl('pre');
		const resultContent = content.content;
		const resultText = resultContent || t('noContent');
		pre.createEl('code', {
			text: typeof resultText === 'string' ? resultText : JSON.stringify(resultText, null, 2)
		});
	}

	/**
	 * 결과 메시지 렌더링
	 */
	private renderResult(container: HTMLElement, result: string): void {
		const resultEl = container.createEl('div', { cls: 'sage-final-result' });
		const sanitizedDom = sanitizeHTMLToDom(this.formatText(result));
		resultEl.appendChild(sanitizedDom);
	}

	/**
	 * 초기화 메시지 렌더링
	 */
	private renderInitMessage(container: HTMLElement): void {
		container.createEl('div', {
			text: t('cooking'),
			cls: 'sage-system-init'
		});
	}

	/**
	 * Todo 카드 렌더링
	 */
	renderTodoCard(container: HTMLElement, content: ToolUseBlock): void {
		const cardEl = container.createEl('div', { cls: 'sage-todo-card' });
		const headerEl = cardEl.createEl('div', { cls: 'sage-todo-header' });
		headerEl.createEl('span', { text: t('tasks'), cls: 'sage-todo-title' });

		const input = content.input as { todos?: Array<{ status: string; content: string }> };
		if (input?.todos) {
			const todosEl = cardEl.createEl('div', { cls: 'sage-todos-list' });
			input.todos.forEach((todo) => {
				this.renderTodoItem(todosEl, todo);
			});
		}
	}

	/**
	 * 개별 Todo 아이템 렌더링
	 */
	private renderTodoItem(container: HTMLElement, todo: { status: string; content: string }): void {
		const todoEl = container.createEl('div', { cls: 'sage-todo-item' });
		const iconEl = todoEl.createEl('span', { cls: 'sage-todo-status' });

		const iconName = this.getTodoStatusIcon(todo.status);
		setIcon(iconEl, iconName);

		todoEl.createEl('span', { text: todo.content, cls: 'sage-todo-content' });
	}

	/**
	 * Todo 상태에 따른 아이콘 이름 반환
	 */
	private getTodoStatusIcon(status: string): string {
		switch (status) {
			case 'completed':
				return 'circle-check';
			case 'in_progress':
				return 'circle-ellipsis';
			default:
				return 'circle';
		}
	}

	/**
	 * 접을 수 있는 도구 블록 렌더링
	 */
	renderCollapsibleTool(container: HTMLElement, content: ToolUseBlock): void {
		const toolEl = container.createEl('div', { cls: 'sage-tool-collapsible' });
		const headerEl = toolEl.createEl('div', { cls: 'sage-tool-header clickable' });

		headerEl.createEl('span', {
			text: `${t('usingTool')}: ${content.name || 'Unknown'}`,
			cls: 'sage-tool-name'
		});

		const contentEl = toolEl.createEl('div', { cls: 'sage-tool-content collapsed' });
		if (content.input) {
			const pre = contentEl.createEl('pre');
			pre.createEl('code', { text: JSON.stringify(content.input, null, 2) });
		}

		this.addCollapseToggle(headerEl, contentEl);
	}

	/**
	 * Thinking 메시지 렌더링 (접을 수 있는 형태)
	 */
	renderThinkingMessage(messageEl: HTMLElement, chatMessage: UserChatMessage): void {
		const hasToolResults = chatMessage.message.content.some(
			content => content.type === 'tool_result'
		);
		const headerText = hasToolResults ? t('toolResult') : t('thinking');

		const headerEl = messageEl.createEl('div', { cls: 'sage-thinking-header clickable' });
		headerEl.createEl('span', { text: headerText, cls: 'sage-thinking-label' });

		const contentEl = messageEl.createEl('div', { cls: 'sage-thinking-content collapsed' });
		this.renderMessageContent(contentEl, chatMessage);

		this.addCollapseToggle(headerEl, contentEl);
	}

	/**
	 * Assistant 사고 메시지 렌더링
	 */
	renderAssistantThought(messageEl: HTMLElement, chatMessage: AssistantChatMessage): void {
		const contentEl = messageEl.createEl('div', { cls: 'sage-message-content sage-self-thought' });
		this.renderMessageContent(contentEl, chatMessage);
	}

	/**
	 * 최종 응답 렌더링
	 */
	renderFinalResponse(messageEl: HTMLElement, chatMessage: ChatMessage): void {
		const contentEl = messageEl.createEl('div', { cls: 'sage-message-content sage-final-response' });
		this.renderMessageContent(contentEl, chatMessage);
	}

	/**
	 * 접기/펼치기 토글 이벤트 추가
	 */
	private addCollapseToggle(headerEl: HTMLElement, contentEl: HTMLElement): void {
		this.component.registerDomEvent(headerEl, 'click', () => {
			contentEl.toggleClass('collapsed', !contentEl.hasClass('collapsed'));
		});
	}

	/**
	 * 텍스트 마크다운 포맷팅
	 */
	formatText(text: string): string {
		// Phase 2-G: 코드 블록을 복사 버튼이 있는 형태로 변환
		let formatted = text;

		// 멀티라인 코드 블록 처리 (```language ... ```)
		formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
			const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const escapedCode = this.escapeHtml(code.trim());
			const languageLabel = lang || 'code';
			return `<div class="sage-code-block" data-code-id="${codeId}">
				<div class="sage-code-header">
					<span class="sage-code-language">${languageLabel}</span>
					<button class="sage-copy-button" data-code="${this.escapeForAttribute(code.trim())}">${t('copy')}</button>
				</div>
				<pre><code class="language-${lang}">${escapedCode}</code></pre>
			</div>`;
		});

		// 인라인 포맷팅
		formatted = formatted
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/`([^`]+)`/g, '<code class="sage-inline-code">$1</code>')
			.replace(/\n/g, '<br>');

		return formatted;
	}

	/**
	 * HTML 이스케이프
	 */
	private escapeHtml(text: string): string {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}

	/**
	 * 속성값용 이스케이프
	 */
	private escapeForAttribute(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	/**
	 * 메시지 컨테이너 업데이트
	 */
	updateContainer(messagesContainer: HTMLElement, component?: Component): void {
		this.messagesContainer = messagesContainer;
		if (component) {
			this.component = component;
		}
	}

	/**
	 * 메시지 컨테이너 비우기
	 */
	clear(): void {
		this.messagesContainer.empty();
	}
}
