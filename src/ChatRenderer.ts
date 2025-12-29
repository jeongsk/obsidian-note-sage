import { App, Component, MarkdownRenderer, setIcon } from 'obsidian';
import type {
	ChatMessage,
	ContentBlock,
	TextBlock,
	ToolUseBlock,
	ToolResultBlock,
	ThinkingBlock,
	UserChatMessage,
	AssistantChatMessage,
	ResultChatMessage
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
	private app: App;

	constructor(messagesContainer: HTMLElement, component: Component, app: App) {
		this.messagesContainer = messagesContainer;
		this.component = component;
		this.app = app;
	}

	/**
	 * 메인 렌더링 메서드 - 메시지 타입에 따라 적절한 렌더러 호출
	 */
	async renderMessage(chatMessage: ChatMessage): Promise<void> {
		try {
			// assistant 메시지 중 텍스트 블록만 있는 경우 건너뛰기 (result와 중복 방지)
			if (chatMessage.type === 'assistant') {
				const hasOnlyText = this.hasOnlyTextBlocks(chatMessage);
				if (hasOnlyText) {
					return; // result 메시지에서 표시하므로 건너뛰기
				}
			}

			const messageEl = this.createMessageElement(chatMessage);

			if (chatMessage.type === 'user' && !chatMessage.isUserInput) {
				await this.renderThinkingMessage(messageEl, chatMessage);
			} else if (chatMessage.type === 'assistant') {
				await this.renderAssistantThought(messageEl, chatMessage);
			} else if (chatMessage.type === 'result') {
				await this.renderFinalResponse(messageEl, chatMessage);
			} else {
				const contentEl = messageEl.createEl('div', { cls: 'sage-message-content' });
				await this.renderMessageContent(contentEl, chatMessage);
			}

			this.renderTimestamp(messageEl, chatMessage);
			this.scrollToBottom();
		} catch (error) {
			console.error('Error rendering message:', error, chatMessage);
		}
	}

	/**
	 * assistant 메시지가 텍스트 블록만 포함하는지 확인
	 * (tool_use, thinking 등이 없는 경우 true)
	 */
	private hasOnlyTextBlocks(chatMessage: ChatMessage): boolean {
		if (chatMessage.type !== 'assistant') return false;
		const content = chatMessage.message?.content || [];
		return content.length > 0 && content.every(block => block.type === 'text');
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
	 * 타임스탬프 렌더링 (result 메시지의 경우 비용도 함께 표시)
	 */
	private renderTimestamp(messageEl: HTMLElement, chatMessage: ChatMessage): void {
		const showTimestamp =
			chatMessage.timestamp &&
			((chatMessage.type === 'user' && chatMessage.isUserInput) || chatMessage.type === 'result');

		if (showTimestamp && chatMessage.timestamp) {
			const footerEl = messageEl.createEl('div', { cls: 'sage-message-footer' });

			// 타임스탬프
			footerEl.createEl('span', {
				text: chatMessage.timestamp.toLocaleTimeString(),
				cls: 'sage-message-timestamp'
			});

			// result 메시지인 경우 비용 배지 표시
			if (chatMessage.type === 'result') {
				const resultMessage = chatMessage as ResultChatMessage;
				if (resultMessage.total_cost_usd !== undefined && resultMessage.total_cost_usd > 0) {
					footerEl.createEl('span', {
						text: `$${resultMessage.total_cost_usd.toFixed(4)}`,
						cls: 'sage-cost-badge'
					});
				}
			}
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
	async renderMessageContent(container: HTMLElement, chatMessage: ChatMessage): Promise<void> {
		try {
			if (chatMessage.type === 'user' || chatMessage.type === 'assistant') {
				await this.renderContentBlocks(container, chatMessage.message.content);
			} else if (chatMessage.type === 'result' && chatMessage.result) {
				await this.renderResult(container, chatMessage.result);
			} else if (chatMessage.type === 'system') {
				if (chatMessage.subtype === 'init') {
					this.renderInitMessage(container);
				} else if (chatMessage.result) {
					await this.renderResult(container, chatMessage.result);
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
	private async renderContentBlocks(container: HTMLElement, contents: ContentBlock[]): Promise<void> {
		for (const content of contents) {
			switch (content.type) {
				case 'text':
					await this.renderTextBlock(container, content);
					break;
				case 'tool_use':
					this.renderToolUseBlock(container, content);
					break;
				case 'tool_result':
					this.renderToolResultBlock(container, content);
					break;
				case 'thinking':
					// T018: Extended Thinking 블록 렌더링
					await this.renderThinkingBlock(container, content);
					break;
			}
		}
	}

	/**
	 * 텍스트 블록 렌더링 (Obsidian MarkdownRenderer 사용)
	 */
	private async renderTextBlock(container: HTMLElement, content: TextBlock): Promise<void> {
		const textEl = container.createEl('div', { cls: 'sage-message-text' });
		await MarkdownRenderer.render(this.app, content.text, textEl, '', this.component);

		// 코드 블럭에 복사 버튼 주입
		this.injectCopyButtons(textEl);
	}

	/**
	 * 코드 블럭에 복사 버튼 주입
	 * MarkdownRenderer로 렌더링된 pre > code 요소에 복사 버튼 추가
	 */
	private injectCopyButtons(container: HTMLElement): void {
		const codeBlocks = container.querySelectorAll('pre > code');
		codeBlocks.forEach((codeEl) => {
			const preEl = codeEl.parentElement;
			if (!preEl || preEl.parentElement?.classList.contains('sage-code-wrapper')) return;

			// 래퍼 생성
			const wrapper = createEl('div', { cls: 'sage-code-wrapper' });
			preEl.parentElement?.insertBefore(wrapper, preEl);
			wrapper.appendChild(preEl);

			// 복사 버튼 생성
			const copyBtn = wrapper.createEl('button', { cls: 'sage-copy-button' });
			const iconSpan = copyBtn.createSpan({ cls: 'sage-copy-icon' });
			setIcon(iconSpan, 'copy');
			copyBtn.createSpan({ cls: 'sage-copy-text', text: t('copy') });

			// 복사 이벤트 리스너
			this.component.registerDomEvent(copyBtn, 'click', async (e) => {
				e.preventDefault();
				e.stopPropagation();

				const codeText = codeEl.textContent || '';
				const iconSpanEl = copyBtn.querySelector('.sage-copy-icon') as HTMLElement;
				const textSpanEl = copyBtn.querySelector('.sage-copy-text') as HTMLElement;

				try {
					await navigator.clipboard.writeText(codeText);

					// 성공 피드백
					copyBtn.classList.add('copied');
					if (iconSpanEl) {
						iconSpanEl.empty();
						setIcon(iconSpanEl, 'check');
					}
					if (textSpanEl) textSpanEl.textContent = t('copied');

					window.setTimeout(() => {
						copyBtn.classList.remove('copied');
						if (iconSpanEl) {
							iconSpanEl.empty();
							setIcon(iconSpanEl, 'copy');
						}
						if (textSpanEl) textSpanEl.textContent = t('copy');
					}, 2000);
				} catch (error) {
					console.error('Failed to copy:', error);

					// 실패 피드백
					copyBtn.classList.add('copy-failed');
					if (textSpanEl) textSpanEl.textContent = t('copyFailed');

					window.setTimeout(() => {
						copyBtn.classList.remove('copy-failed');
						if (iconSpanEl) {
							iconSpanEl.empty();
							setIcon(iconSpanEl, 'copy');
						}
						if (textSpanEl) textSpanEl.textContent = t('copy');
					}, 2000);
				}
			});
		});
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
	 * T018: Extended Thinking 블록 렌더링
	 * 접을 수 있는 형태로 Claude의 사고 과정을 표시
	 */
	private async renderThinkingBlock(container: HTMLElement, content: ThinkingBlock): Promise<void> {
		const thinkingEl = container.createEl('div', { cls: 'sage-thinking-block' });

		const headerEl = thinkingEl.createEl('div', { cls: 'sage-thinking-block-header clickable' });
		const iconEl = headerEl.createEl('span', { cls: 'sage-thinking-block-icon' });
		setIcon(iconEl, 'brain');
		headerEl.createEl('span', { text: t('extendedThinking'), cls: 'sage-thinking-block-label' });

		const contentEl = thinkingEl.createEl('div', { cls: 'sage-thinking-block-content collapsed' });
		await MarkdownRenderer.render(this.app, content.thinking, contentEl, '', this.component);
		this.injectCopyButtons(contentEl);

		this.addCollapseToggle(headerEl, contentEl);
	}

	/**
	 * 결과 메시지 렌더링 (Obsidian MarkdownRenderer 사용)
	 */
	private async renderResult(container: HTMLElement, result: string): Promise<void> {
		const resultEl = container.createEl('div', { cls: 'sage-final-result' });
		await MarkdownRenderer.render(this.app, result, resultEl, '', this.component);
		this.injectCopyButtons(resultEl);
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
	async renderThinkingMessage(messageEl: HTMLElement, chatMessage: UserChatMessage): Promise<void> {
		const hasToolResults = chatMessage.message.content.some(
			content => content.type === 'tool_result'
		);
		const headerText = hasToolResults ? t('toolResult') : t('thinking');

		const headerEl = messageEl.createEl('div', { cls: 'sage-thinking-header clickable' });
		headerEl.createEl('span', { text: headerText, cls: 'sage-thinking-label' });

		const contentEl = messageEl.createEl('div', { cls: 'sage-thinking-content collapsed' });
		await this.renderMessageContent(contentEl, chatMessage);

		this.addCollapseToggle(headerEl, contentEl);
	}

	/**
	 * Assistant 사고 메시지 렌더링
	 */
	async renderAssistantThought(messageEl: HTMLElement, chatMessage: AssistantChatMessage): Promise<void> {
		const contentEl = messageEl.createEl('div', { cls: 'sage-message-content sage-self-thought' });
		await this.renderMessageContent(contentEl, chatMessage);
	}

	/**
	 * 최종 응답 렌더링
	 */
	async renderFinalResponse(messageEl: HTMLElement, chatMessage: ChatMessage): Promise<void> {
		const contentEl = messageEl.createEl('div', { cls: 'sage-message-content sage-final-response' });
		await this.renderMessageContent(contentEl, chatMessage);
		// 비용은 renderTimestamp에서 타임스탬프와 함께 표시됨
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
