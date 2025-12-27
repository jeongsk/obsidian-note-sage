import { ItemView, WorkspaceLeaf, setIcon, MarkdownView, TFile } from 'obsidian';
import type { NoteSageSettings, ChatMessage, QuickActionConfig, McpServerStatus } from './types';
import { AVAILABLE_MODELS, QUICK_ACTION_DEFINITIONS, DEFAULT_QUICK_ACTIONS } from './types';
import { AgentService } from './AgentService';
import { ChatRenderer } from './ChatRenderer';
import { MessageFactory } from './MessageFactory';
import { createExampleMessages } from './exampleMessages';
import { createObsidianPluginToolsServer } from './tools/ObsidianPluginTools';
import { McpServerManager } from './mcp/McpServerManager';
import { McpToolsPanel } from './mcp/McpToolsPanel';
import { t, setLanguage } from './i18n';
import type NoteSagePlugin from './main';

export const VIEW_TYPE_NOTE_SAGE = 'note-sage-view';

/**
 * NoteSageView - AI 채팅 인터페이스의 메인 뷰 클래스
 *
 * 책임:
 * - Obsidian ItemView 라이프사이클 관리
 * - 채팅 UI 초기화 및 이벤트 핸들링
 * - 메시지 상태 관리
 * - AgentService와의 통신 조율
 */
export class NoteSageView extends ItemView {
	// 플러그인 및 서비스
	private plugin: NoteSagePlugin;
	private settings: NoteSageSettings;
	private agentService: AgentService;
	private renderer: ChatRenderer;

	// 상태
	private messages: ChatMessage[] = [];
	private currentSessionId: string | null = null;
	private includeFileContext: boolean = true;
	private isProcessing: boolean = false;

	// DOM 요소
	private chatContainer: HTMLElement;
	private messagesContainer: HTMLElement;
	private inputContainer: HTMLElement;
	private inputField: HTMLTextAreaElement;
	private sendButton: HTMLButtonElement;
	private loadingIndicator: HTMLElement;
	private fileContextHeader: HTMLElement;
	private modelSelector: HTMLSelectElement;
	private quickActionsContainer: HTMLElement;
	private mcpStatusContainer: HTMLElement;

	// MCP 상태 구독 해제 함수
	private unsubscribeMcpStatus?: () => void;

	// MCP 도구 패널
	private mcpToolsPanel?: McpToolsPanel;

	constructor(leaf: WorkspaceLeaf, plugin: NoteSagePlugin) {
		super(leaf);
		this.plugin = plugin;
		this.settings = plugin.settings;
		this.agentService = new AgentService(this.settings);

		// Initialize language from settings
		if (this.settings.language) {
			setLanguage(this.settings.language);
		}

		// Initialize MCP servers if plugin tools are enabled
		this.updateMcpServers();
	}

	/**
	 * 설정에 따라 MCP 서버를 업데이트합니다.
	 */
	private updateMcpServers(): void {
		const servers: Record<string, import('@anthropic-ai/claude-agent-sdk').McpServerConfig> = {};

		// 플러그인 도구 서버 추가
		if (this.settings.enablePluginTools) {
			const pluginToolsServer = createObsidianPluginToolsServer(this.app);
			servers['obsidian-plugins'] = pluginToolsServer;
		}

		// 사용자 설정 MCP 서버 추가
		if (this.settings.mcpServers && this.settings.mcpServers.length > 0) {
			const userServers = McpServerManager.toSdkMcpServers(this.settings.mcpServers);
			Object.assign(servers, userServers);

			if (this.settings.debugContext) {
				console.log('[NoteSageView] User MCP servers:', JSON.stringify(userServers, null, 2));
			}
		}

		// AgentService에 설정
		if (Object.keys(servers).length > 0) {
			this.agentService.setMcpServers(servers);
			if (this.settings.debugContext) {
				console.log('[NoteSageView] Total MCP servers set:', Object.keys(servers));
			}
		} else {
			this.agentService.clearMcpServers();
		}
	}

	getViewType(): string {
		return VIEW_TYPE_NOTE_SAGE;
	}

	getDisplayText(): string {
		return t('appTitle');
	}

	getIcon(): string {
		return 'sparkles';
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1] as HTMLElement;
		container.empty();
		container.addClass('sage-chat-container');

		this.createChatInterface(container);
		this.renderer = new ChatRenderer(this.messagesContainer, this);
	}

	async onClose(): Promise<void> {
		if (this.isProcessing) {
			this.agentService.cancel();
		}

		// MCP 상태 구독 해제
		if (this.unsubscribeMcpStatus) {
			this.unsubscribeMcpStatus();
			this.unsubscribeMcpStatus = undefined;
		}

		// MCP 도구 패널 정리
		if (this.mcpToolsPanel) {
			this.mcpToolsPanel.destroy();
			this.mcpToolsPanel = undefined;
		}
	}

	// ==================== UI 생성 ====================

	private createChatInterface(container: HTMLElement): void {
		this.createHeader(container);
		this.createChatBody(container);
		this.createInputArea(container);
	}

	private createHeader(container: HTMLElement): void {
		const headerEl = container.createEl('div', { cls: 'sage-chat-header' });

		headerEl.createEl('div', {
			text: t('appTitle'),
			cls: 'sage-chat-title'
		});

		// 모델 선택기
		this.createModelSelector(headerEl);

		// MCP 상태 아이콘
		this.createMcpStatusIcon(headerEl);

		const buttonGroupEl = headerEl.createEl('div', { cls: 'sage-header-buttons' });

		// Examples 버튼
		const examplesButton = buttonGroupEl.createEl('button', {
			text: t('examples'),
			cls: 'sage-examples-button'
		});
		this.registerDomEvent(examplesButton, 'click', () => this.showExamples());

		// Settings 버튼
		const settingsButton = buttonGroupEl.createEl('button', {
			cls: 'sage-settings-button',
			attr: { 'aria-label': t('pluginSettings') }
		});
		setIcon(settingsButton, 'settings');
		this.registerDomEvent(settingsButton, 'click', () => this.openSettings());

		// New Chat 버튼
		const newChatButton = buttonGroupEl.createEl('button', {
			cls: 'sage-new-chat-button',
			attr: { 'aria-label': t('newChat') }
		});
		setIcon(newChatButton, 'plus');
		this.registerDomEvent(newChatButton, 'click', () => this.startNewChat());
	}

	private createModelSelector(headerEl: HTMLElement): void {
		const selectorContainer = headerEl.createEl('div', { cls: 'sage-model-selector-container' });

		this.modelSelector = selectorContainer.createEl('select', {
			cls: 'sage-model-selector dropdown',
			attr: { 'aria-label': t('selectModel') }
		}) as HTMLSelectElement;

		// AVAILABLE_MODELS에서 옵션 생성
		for (const model of AVAILABLE_MODELS) {
			this.modelSelector.createEl('option', {
				text: model.label,
				attr: { value: model.value }
			});
		}

		// 현재 설정값으로 선택
		this.modelSelector.value = this.settings.model || AVAILABLE_MODELS[0].value;

		// 변경 이벤트 핸들러
		this.registerDomEvent(this.modelSelector, 'change', () => {
			this.handleModelChange(this.modelSelector.value);
		});
	}

	private async handleModelChange(newModel: string): Promise<void> {
		this.settings.model = newModel;

		// 플러그인 설정에 저장
		const app = this.app as unknown as {
			plugins: { plugins: Record<string, { settings: NoteSageSettings; saveSettings: () => Promise<void> }> }
		};

		const plugin = app.plugins.plugins['obsidian-note-sage'];
		if (plugin) {
			plugin.settings.model = newModel;
			await plugin.saveSettings();
		}

		// AgentService 설정 업데이트
		this.agentService.updateSettings(this.settings);

		if (this.settings.debugContext) {
			console.log('[NoteSageView] Model changed to:', newModel);
		}
	}

	/**
	 * MCP 상태 아이콘 컨테이너 생성
	 */
	private createMcpStatusIcon(headerEl: HTMLElement): void {
		this.mcpStatusContainer = headerEl.createEl('div', { cls: 'sage-mcp-header-status' });

		// MCP 서버가 설정되어 있으면 표시
		this.renderMcpStatusIcon();

		// 상태 변경 구독
		if (this.plugin.mcpServerManager) {
			this.unsubscribeMcpStatus = this.plugin.mcpServerManager.onStatusChange(() => {
				this.renderMcpStatusIcon();
			});

			// McpToolsPanel 인스턴스 생성
			this.mcpToolsPanel = new McpToolsPanel(
				this.mcpStatusContainer,
				this.plugin,
				this.plugin.mcpServerManager
			);
		}
	}

	/**
	 * MCP 상태 아이콘 렌더링
	 */
	private renderMcpStatusIcon(): void {
		if (!this.mcpStatusContainer) return;

		this.mcpStatusContainer.empty();

		// 활성화된 MCP 서버가 있는지 확인
		const enabledServers = this.settings.mcpServers?.filter(s => s.enabled) || [];
		if (enabledServers.length === 0) {
			this.mcpStatusContainer.style.display = 'none';
			return;
		}

		this.mcpStatusContainer.style.display = 'flex';

		// 상태 집계
		const statuses = this.plugin.mcpServerManager?.getAllStatuses() || [];
		const statusMap = new Map<string, McpServerStatus>();
		for (const status of statuses) {
			statusMap.set(status.name, status);
		}

		let connectedCount = 0;
		let failedCount = 0;
		let pendingCount = 0;

		for (const server of enabledServers) {
			const status = statusMap.get(server.name);
			switch (status?.status) {
				case 'connected':
					connectedCount++;
					break;
				case 'failed':
					failedCount++;
					break;
				default:
					pendingCount++;
					break;
			}
		}

		// 아이콘 결정
		let iconName: string;
		let statusClass: string;
		let tooltip: string;

		if (failedCount > 0) {
			iconName = 'plug-zap';
			statusClass = 'sage-mcp-header-failed';
			tooltip = `MCP: ${failedCount} ${t('settings.mcp.statusFailed')}`;
		} else if (pendingCount > 0) {
			iconName = 'plug';
			statusClass = 'sage-mcp-header-pending';
			tooltip = `MCP: ${t('settings.mcp.statusPending')}`;
		} else if (connectedCount > 0) {
			iconName = 'plug';
			statusClass = 'sage-mcp-header-connected';
			tooltip = `MCP: ${connectedCount} ${t('settings.mcp.statusConnected')}`;
		} else {
			iconName = 'plug';
			statusClass = 'sage-mcp-header-pending';
			tooltip = `MCP: ${enabledServers.length} servers`;
		}

		const iconEl = this.mcpStatusContainer.createSpan({
			cls: `sage-mcp-header-icon ${statusClass}`,
			attr: { 'aria-label': tooltip }
		});
		setIcon(iconEl, iconName);

		// 클릭 시 패널 토글
		iconEl.addEventListener('click', (e) => {
			e.stopPropagation();
			this.mcpToolsPanel?.toggle();
		});
	}

	private createChatBody(container: HTMLElement): void {
		this.chatContainer = container.createEl('div', { cls: 'sage-chat-body' });
		this.messagesContainer = this.chatContainer.createEl('div', { cls: 'sage-chat-messages' });
	}

	private createInputArea(container: HTMLElement): void {
		this.inputContainer = container.createEl('div', { cls: 'sage-chat-input-container' });

		this.createQuickActions();
		this.createFileContextToggle();
		this.createInputField();
		this.createButtonContainer();
	}

	// Quick Actions 설정 헬퍼
	private getQuickActionConfig(id: string): QuickActionConfig {
		const config = this.settings.quickActions?.find(c => c.id === id);
		return config || DEFAULT_QUICK_ACTIONS.find(c => c.id === id) || { id, enabled: true, customPrompt: undefined };
	}

	// Phase 2-F: 빠른 액션 버튼 생성 (설정 기반)
	private createQuickActions(): void {
		this.quickActionsContainer = this.inputContainer.createEl('div', { cls: 'sage-quick-actions' });
		this.renderQuickActions();
	}

	// Quick Actions 버튼 렌더링 (설정 변경 시 재호출)
	private renderQuickActions(): void {
		this.quickActionsContainer.empty();

		// 활성화된 버튼만 필터링
		const enabledActions = QUICK_ACTION_DEFINITIONS.filter(def => {
			const config = this.getQuickActionConfig(def.id);
			return config.enabled;
		});

		// 모든 버튼이 비활성화되면 컨테이너 숨김
		if (enabledActions.length === 0) {
			this.quickActionsContainer.addClass('hidden');
			return;
		}

		this.quickActionsContainer.removeClass('hidden');

		for (const action of enabledActions) {
			const config = this.getQuickActionConfig(action.id);
			// customPrompt가 있으면 사용, 없으면 기본 프롬프트 사용
			const prompt = config.customPrompt || t(action.promptKey);

			const button = this.quickActionsContainer.createEl('button', {
				cls: 'sage-quick-action-button',
				attr: { 'aria-label': t(action.labelKey) }
			});

			const iconEl = button.createEl('span', { cls: 'sage-quick-action-icon' });
			setIcon(iconEl, action.icon);

			button.createEl('span', { text: t(action.labelKey), cls: 'sage-quick-action-label' });

			this.registerDomEvent(button, 'click', () => {
				if (!this.isProcessing) {
					this.sendMessage(prompt);
				}
			});
		}
	}

	private createFileContextToggle(): void {
		this.fileContextHeader = this.inputContainer.createEl('div', { cls: 'sage-file-context-header' });
		const fileContextToggle = this.fileContextHeader.createEl('div', {
			cls: 'sage-file-context-toggle',
			attr: { 'aria-label': t('addCurrentPageContext') }
		});

		const fileIcon = fileContextToggle.createEl('span', { cls: 'sage-file-context-icon' });
		setIcon(fileIcon, 'file-text');

		const fileContextText = fileContextToggle.createEl('span', { cls: 'sage-file-context-text' });
		fileContextText.setText(t('currentPage'));

		fileContextToggle.toggleClass('active', this.includeFileContext);

		this.registerDomEvent(fileContextToggle, 'click', () => {
			this.includeFileContext = !this.includeFileContext;
			fileContextToggle.toggleClass('active', this.includeFileContext);
		});
	}

	private createInputField(): void {
		this.inputField = this.inputContainer.createEl('textarea', {
			cls: 'sage-chat-input',
			attr: {
				placeholder: t('inputPlaceholder'),
				rows: '3'
			}
		}) as HTMLTextAreaElement;

		this.registerDomEvent(this.inputField, 'keydown', (e: KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				this.handleButtonClick();
			}
		});

		this.registerDomEvent(this.inputField, 'input', () => this.autoResizeTextarea());
		this.autoResizeTextarea();
	}

	private createButtonContainer(): void {
		const buttonContainer = this.inputContainer.createEl('div', { cls: 'sage-chat-button-container' });

		this.loadingIndicator = buttonContainer.createEl('div', { cls: 'sage-loading-indicator hidden' });
		this.loadingIndicator.createEl('div', { cls: 'sage-loading-spinner' });

		this.sendButton = buttonContainer.createEl('button', {
			cls: 'sage-chat-send-button',
			attr: { 'aria-label': t('sendMessage') }
		}) as HTMLButtonElement;
		setIcon(this.sendButton, 'corner-down-right');
		this.registerDomEvent(this.sendButton, 'click', () => this.handleButtonClick());
	}

	// ==================== 상태 관리 ====================

	private setProcessingState(processing: boolean): void {
		this.isProcessing = processing;

		if (processing) {
			this.sendButton.empty();
			setIcon(this.sendButton, 'square');
			this.sendButton.setAttribute('aria-label', t('cancelProcessing'));
			this.sendButton.addClass('sage-cancel-button');
			this.loadingIndicator.removeClass('hidden');
			this.inputField.disabled = true;
		} else {
			this.sendButton.empty();
			setIcon(this.sendButton, 'corner-down-right');
			this.sendButton.setAttribute('aria-label', t('sendMessage'));
			this.sendButton.removeClass('sage-cancel-button');
			this.loadingIndicator.addClass('hidden');
			this.inputField.disabled = false;
		}
	}

	// ==================== 메시지 처리 ====================

	private addMessage(message: ChatMessage): void {
		this.messages.push(message);
		this.renderer.renderMessage(message);
	}

	private handleButtonClick(): void {
		if (this.isProcessing) {
			this.cancelExecution();
		} else {
			this.handleSendMessage();
		}
	}

	private async handleSendMessage(): Promise<void> {
		const messageText = this.inputField.value.trim();
		if (!messageText || this.isProcessing) return;

		const finalMessage = await this.buildFinalMessage(messageText);
		this.logDebugContext(messageText, finalMessage);

		const userMessage = MessageFactory.createUserInputMessage(messageText, this.currentSessionId);
		this.addMessage(userMessage);

		this.inputField.value = '';
		this.autoResizeTextarea();
		this.setProcessingState(true);

		await this.executeCommand(finalMessage);
		this.setProcessingState(false);
	}

	private async buildFinalMessage(messageText: string): Promise<string> {
		if (!this.includeFileContext) {
			return messageText;
		}

		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			return messageText;
		}

		const contextParts: string[] = [];
		const vaultPath = this.getVaultBasePath();
		const filePath = vaultPath ? `${vaultPath}/${activeFile.path}` : activeFile.path;

		// 파일 경로 추가
		contextParts.push(`${t('currentFile')}: ${filePath}`);

		// Phase 1-A: 파일 내용 컨텍스트
		if (this.settings.includeFileContent) {
			try {
				// 선택 영역이 있는 경우 선택 영역만 포함
				if (this.settings.includeSelection) {
					const selection = this.getActiveSelection();
					if (selection) {
						contextParts.push(`\n${t('selectedText')}:\n\`\`\`\n${selection}\n\`\`\``);
					} else {
						// 선택 영역이 없으면 전체 파일 내용 포함
						const content = await this.getFileContent(activeFile);
						if (content) {
							contextParts.push(`\n${t('fileContent')}:\n\`\`\`\n${content}\n\`\`\``);
						}
					}
				} else {
					// 선택 영역 옵션이 비활성화된 경우 전체 파일 내용 포함
					const content = await this.getFileContent(activeFile);
					if (content) {
						contextParts.push(`\n${t('fileContent')}:\n\`\`\`\n${content}\n\`\`\``);
					}
				}
			} catch (error) {
				console.warn('Failed to read file content:', error);
			}
		}

		return `${contextParts.join('\n')}\n\n${messageText}`;
	}

	private getActiveSelection(): string | null {
		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);

		if (markdownView?.editor) {
			const selection = markdownView.editor.getSelection();
			if (selection && selection.trim().length > 0) {
				return selection;
			}
		}

		return null;
	}

	private async getFileContent(file: TFile): Promise<string | null> {
		try {
			const content = await this.app.vault.read(file);
			const maxLength = this.settings.maxContentLength || 10000;

			if (content.length > maxLength) {
				return content.substring(0, maxLength) + `\n\n... (${t('truncated')}, ${content.length - maxLength} ${t('charactersOmitted')})`;
			}

			return content;
		} catch (error) {
			console.warn('Failed to read file:', error);
			return null;
		}
	}

	private logDebugContext(originalMessage: string, finalMessage: string): void {
		if (!this.settings.debugContext) return;

		console.log('=== DEBUG CONTEXT START ===');
		console.log('API Key configured:', !!this.settings.apiKey);
		console.log('Model:', this.settings.model);
		console.log('New message context:', {
			originalMessage,
			finalMessage,
			includeFileContext: this.includeFileContext,
			currentFile: this.includeFileContext ? this.getCurrentFilePath() : null,
			sessionId: this.currentSessionId
		});
		console.log('=== DEBUG CONTEXT END ===');
	}

	private async executeCommand(prompt: string): Promise<void> {
		const vaultPath = this.getVaultBasePath();
		if (!vaultPath) {
			const errorMessage = MessageFactory.createErrorMessage(
				new Error(t('vaultPathError')),
				this.currentSessionId
			);
			this.addMessage(errorMessage);
			return;
		}

		// 에이전트 실행 시작 - 파일 수정 시 에디터 재렌더링 활성화
		this.plugin.setAgentExecuting(true);

		try {
			const sessionId = await this.agentService.execute({
				prompt,
				workingDirectory: vaultPath,
				sessionId: this.currentSessionId,
				onMessage: (message: ChatMessage) => {
					if (message.type === 'system' && message.subtype === 'init' && message.session_id) {
						this.currentSessionId = message.session_id;
					}

					if (this.settings.debugContext) {
						console.log('=== STREAMING MESSAGE DEBUG ===');
						console.log('Received message:', message);
					}

					this.addMessage(message);
				},
				onError: (error: Error) => {
					console.error('AgentService onError:', error);
					if (error.stack) {
						console.error('Stack trace:', error.stack);
					}
					const errorMessage = MessageFactory.createErrorMessage(error, this.currentSessionId);
					this.addMessage(errorMessage);
				},
				onComplete: () => {
					// Processing complete
				},
				onMcpStatus: (statuses) => {
					// MCP 서버 상태 업데이트
					if (this.plugin.mcpServerManager) {
						this.plugin.mcpServerManager.updateStatuses(statuses);
					}
					// 상태 아이콘 다시 렌더링
					this.renderMcpStatusIcon();
				}
			});

			if (sessionId) {
				this.currentSessionId = sessionId;
			}
		} catch (error) {
			console.error('executeCommand error:', error);
			if (error instanceof Error && error.stack) {
				console.error('Stack trace:', error.stack);
			}
			const errorMessage = MessageFactory.createErrorMessage(
				error instanceof Error ? error : new Error(String(error)),
				this.currentSessionId
			);
			this.addMessage(errorMessage);
		} finally {
			// 에이전트 실행 완료 - 파일 수정 시 에디터 재렌더링 비활성화
			this.plugin.setAgentExecuting(false);
		}
	}

	private cancelExecution(): void {
		this.agentService.cancel();
		this.setProcessingState(false);

		const cancelMessage = MessageFactory.createCancelMessage(this.currentSessionId);
		this.addMessage(cancelMessage);
	}

	// ==================== 유틸리티 ====================

	/**
	 * vault의 기본 경로를 안전하게 가져옵니다.
	 * basePath가 undefined인 경우 빈 문자열을 반환합니다.
	 */
	private getVaultBasePath(): string {
		const adapter = this.app.vault.adapter as { basePath?: string };
		return adapter.basePath || '';
	}

	private autoResizeTextarea(): void {
		this.inputField.style.height = 'auto';

		const computedStyle = getComputedStyle(this.inputField);
		const minHeight = parseFloat(computedStyle.minHeight);

		const newHeight = Math.max(this.inputField.scrollHeight, minHeight);
		this.inputField.style.height = newHeight + 'px';

		const maxHeight = window.innerHeight * 0.5;
		if (newHeight > maxHeight) {
			this.inputField.style.height = maxHeight + 'px';
		}
	}

	private getCurrentFilePath(): string | null {
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile) {
			const vaultPath = this.getVaultBasePath();
			return vaultPath ? `${vaultPath}/${activeFile.path}` : activeFile.path;
		}
		return null;
	}

	private startNewChat(): void {
		if (this.isProcessing) {
			this.cancelExecution();
		}

		this.currentSessionId = null;
		this.messages = [];
		this.renderer.clear();
	}

	private showExamples(): void {
		this.startNewChat();
		const exampleMessages = createExampleMessages();
		exampleMessages.forEach(message => this.addMessage(message));
	}

	private openSettings(): void {
		const app = this.app as unknown as {
			setting: { open: () => void; openTabById: (id: string) => void }
		};
		app.setting.open();
		app.setting.openTabById('obsidian-note-sage');
	}

	// ==================== 공개 메서드 ====================

	updateSettings(settings: NoteSageSettings): void {
		this.settings = settings;
		this.agentService.updateSettings(settings);

		// Update language if changed
		if (settings.language) {
			setLanguage(settings.language);
		}

		// 모델 선택기 동기화
		if (this.modelSelector && settings.model) {
			this.modelSelector.value = settings.model;
		}

		// Quick Actions 다시 렌더링 (설정 변경 반영)
		if (this.quickActionsContainer) {
			this.renderQuickActions();
		}

		// MCP 서버 설정 업데이트
		this.updateMcpServers();
	}

	// Phase 1-D: 외부에서 메시지 전송
	async sendMessage(message: string): Promise<void> {
		if (this.isProcessing) return;

		this.inputField.value = message;
		await this.handleSendMessage();
	}

	// Phase 1-D: 외부에서 새 채팅 시작
	startNewChatFromCommand(): void {
		this.startNewChat();
	}

	// Phase 2-B: 대화 저장
	async saveConversation(): Promise<void> {
		if (this.messages.length === 0) {
			return;
		}

		const savePath = this.settings.conversationSavePath || 'AI-Chats';
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
		const fileName = `${savePath}/chat-${timestamp}.md`;

		// 폴더 생성
		try {
			const folder = this.app.vault.getAbstractFileByPath(savePath);
			if (!folder) {
				await this.app.vault.createFolder(savePath);
			}
		} catch {
			// 폴더가 이미 존재하면 무시
		}

		// 마크다운 생성
		const markdown = this.generateMarkdown();

		// 파일 저장
		try {
			await this.app.vault.create(fileName, markdown);
			console.log(`Conversation saved to ${fileName}`);
		} catch (error) {
			console.error('Failed to save conversation:', error);
		}
	}

	// Phase 2-B: 마크다운 생성
	private generateMarkdown(): string {
		const lines: string[] = [];
		const now = new Date();

		// 프론트매터
		lines.push('---');
		lines.push(`date: ${now.toISOString().slice(0, 10)}`);
		lines.push(`time: ${now.toLocaleTimeString()}`);
		lines.push(`model: ${this.settings.model || 'unknown'}`);
		if (this.currentSessionId) {
			lines.push(`session_id: ${this.currentSessionId}`);
		}
		lines.push('---');
		lines.push('');
		lines.push(`# ${t('aiChatTitle')} - ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
		lines.push('');

		// 메시지 변환
		for (const msg of this.messages) {
			if (msg.type === 'user' && 'isUserInput' in msg && msg.isUserInput) {
				lines.push(`## ${t('user')}`);
				const content = msg.message.content;
				for (const block of content) {
					if (block.type === 'text') {
						lines.push(block.text);
					}
				}
				lines.push('');
			} else if (msg.type === 'assistant') {
				lines.push(`## ${t('assistant')}`);
				const content = msg.message.content;
				for (const block of content) {
					if (block.type === 'text') {
						lines.push(block.text);
					} else if (block.type === 'tool_use') {
						lines.push(`> ${t('usingTool')}: ${block.name}`);
					}
				}
				lines.push('');
			} else if (msg.type === 'result' && msg.result) {
				lines.push(`## ${t('result')}`);
				lines.push(msg.result);
				lines.push('');
				if (msg.duration_ms) {
					lines.push(`*${t('duration')}: ${(msg.duration_ms / 1000).toFixed(2)}s*`);
				}
				lines.push('');
			}
		}

		return lines.join('\n');
	}
}
