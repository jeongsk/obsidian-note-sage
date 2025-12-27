import { Notice, setIcon } from 'obsidian';
import type { McpServerConfigEntry, McpServerStatus, McpTool } from '../types';
import { t } from '../i18n';
import { McpServerManager } from './McpServerManager';
import type NoteSagePlugin from '../main';

/**
 * MCP 도구 패널 - 헤더 아이콘 클릭 시 표시되는 드롭다운 패널
 *
 * 기능:
 * - 등록된 MCP 서버 목록 표시
 * - 각 서버의 연결 상태 표시
 * - 서버 활성화/비활성화 토글
 * - 서버별 제공 도구 목록 확장/축소
 * - 설정 페이지 바로가기
 */
export class McpToolsPanel {
	private containerEl: HTMLElement;
	private plugin: NoteSagePlugin;
	private mcpServerManager: McpServerManager;
	private panelEl: HTMLElement | null = null;
	private isOpen = false;
	private expandedServers: Set<string> = new Set();
	private unsubscribeStatus?: () => void;

	// Bound event handlers for proper removal
	private boundHandleDocumentClick: (event: MouseEvent) => void;
	private boundHandleKeyDown: (event: KeyboardEvent) => void;

	constructor(
		containerEl: HTMLElement,
		plugin: NoteSagePlugin,
		mcpServerManager: McpServerManager
	) {
		this.containerEl = containerEl;
		this.plugin = plugin;
		this.mcpServerManager = mcpServerManager;

		// Bind event handlers
		this.boundHandleDocumentClick = this.handleDocumentClick.bind(this);
		this.boundHandleKeyDown = this.handleKeyDown.bind(this);
	}

	/**
	 * 패널 열기
	 */
	open(): void {
		if (this.isOpen) return;

		this.isOpen = true;
		this.render();

		// 외부 클릭 감지 (약간의 지연으로 현재 클릭 이벤트 무시)
		setTimeout(() => {
			document.addEventListener('click', this.boundHandleDocumentClick);
		}, 0);

		// ESC 키 감지
		document.addEventListener('keydown', this.boundHandleKeyDown);

		// 상태 변경 구독
		this.unsubscribeStatus = this.mcpServerManager.onStatusChange(() => {
			if (this.isOpen) {
				this.render();
			}
		});
	}

	/**
	 * 패널 닫기
	 */
	close(): void {
		if (!this.isOpen) return;

		this.isOpen = false;

		// 패널 제거
		if (this.panelEl) {
			this.panelEl.remove();
			this.panelEl = null;
		}

		// 이벤트 리스너 해제
		document.removeEventListener('click', this.boundHandleDocumentClick);
		document.removeEventListener('keydown', this.boundHandleKeyDown);

		// 상태 구독 해제
		if (this.unsubscribeStatus) {
			this.unsubscribeStatus();
			this.unsubscribeStatus = undefined;
		}
	}

	/**
	 * 패널 토글
	 */
	toggle(): void {
		if (this.isOpen) {
			this.close();
		} else {
			this.open();
		}
	}

	/**
	 * 리소스 정리
	 */
	destroy(): void {
		this.close();
		this.expandedServers.clear();
	}

	/**
	 * 외부 클릭 감지 핸들러
	 */
	private handleDocumentClick(event: MouseEvent): void {
		if (this.panelEl && !this.panelEl.contains(event.target as Node)) {
			this.close();
		}
	}

	/**
	 * ESC 키 핸들러
	 */
	private handleKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			this.close();
		}
	}

	/**
	 * 패널 렌더링
	 */
	private render(): void {
		// 기존 패널 제거
		if (this.panelEl) {
			this.panelEl.remove();
		}

		// 새 패널 생성
		this.panelEl = this.containerEl.createDiv({ cls: 'sage-mcp-panel' });

		// 패널 헤더
		this.renderPanelHeader();

		// 서버 목록
		this.renderServerList();
	}

	/**
	 * 패널 헤더 렌더링
	 */
	private renderPanelHeader(): void {
		if (!this.panelEl) return;

		const headerEl = this.panelEl.createDiv({ cls: 'sage-mcp-panel-header' });

		// 타이틀
		headerEl.createSpan({ cls: 'sage-mcp-panel-title', text: t('settings.mcp.panelTitle') });

		// 설정 버튼
		const settingsBtn = headerEl.createEl('button', { cls: 'sage-mcp-panel-settings' });
		setIcon(settingsBtn, 'settings');
		settingsBtn.setAttribute('aria-label', t('settings.mcp.panelOpenSettings'));
		settingsBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.openSettings();
			this.close();
		});
	}

	/**
	 * 서버 목록 렌더링
	 */
	private renderServerList(): void {
		if (!this.panelEl) return;

		const listEl = this.panelEl.createDiv({ cls: 'sage-mcp-panel-list' });

		const servers = this.plugin.settings.mcpServers || [];

		if (servers.length === 0) {
			this.renderEmptyState(listEl);
			return;
		}

		for (const server of servers) {
			this.renderServerItem(listEl, server);
		}
	}

	/**
	 * 빈 상태 메시지 렌더링
	 */
	private renderEmptyState(container: HTMLElement): void {
		const emptyEl = container.createDiv({ cls: 'sage-mcp-panel-empty' });
		emptyEl.createDiv({ cls: 'sage-mcp-panel-empty-title', text: t('settings.mcp.panelNoServers') });
		emptyEl.createDiv({ cls: 'sage-mcp-panel-empty-desc', text: t('settings.mcp.panelNoServersDesc') });

		const openSettingsBtn = emptyEl.createEl('button', {
			cls: 'sage-mcp-panel-empty-button',
			text: t('settings.mcp.panelOpenSettings')
		});
		openSettingsBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.openSettings();
			this.close();
		});
	}

	/**
	 * 개별 서버 항목 렌더링
	 */
	private renderServerItem(container: HTMLElement, server: McpServerConfigEntry): void {
		const status = this.mcpServerManager.getStatus(server.name);
		const isExpanded = this.expandedServers.has(server.name);

		const itemEl = container.createDiv({
			cls: `sage-mcp-panel-item ${isExpanded ? 'sage-mcp-panel-item--expanded' : ''}`
		});

		// 서버 헤더 (클릭 시 확장)
		const headerEl = itemEl.createDiv({ cls: 'sage-mcp-panel-item-header' });

		// 상태 아이콘
		const statusEl = headerEl.createSpan({ cls: 'sage-mcp-panel-item-status' });
		this.renderStatusIcon(statusEl, status);

		// 서버 정보
		const infoEl = headerEl.createDiv({ cls: 'sage-mcp-panel-item-info' });
		infoEl.createDiv({ cls: 'sage-mcp-panel-item-name', text: server.name });
		infoEl.createDiv({ cls: 'sage-mcp-panel-item-type', text: this.getTypeLabel(server.type) });

		// 토글 스위치
		const toggleEl = headerEl.createDiv({ cls: 'sage-mcp-panel-item-toggle' });
		const toggleInput = toggleEl.createEl('input', { type: 'checkbox', cls: 'sage-mcp-toggle-input' });
		toggleInput.checked = server.enabled;
		toggleInput.addEventListener('click', (e) => {
			e.stopPropagation();
		});
		toggleInput.addEventListener('change', async () => {
			await this.handleToggle(server, toggleInput.checked);
		});

		// 헤더 클릭 시 확장/축소 (토글 영역 제외)
		headerEl.addEventListener('click', (e) => {
			if (!toggleEl.contains(e.target as Node)) {
				this.toggleExpand(server.name);
			}
		});

		// 도구 목록 (확장 시에만 표시)
		if (isExpanded) {
			this.renderToolsList(itemEl, server, status);
		}
	}

	/**
	 * 상태 아이콘 렌더링
	 */
	private renderStatusIcon(container: HTMLElement, status?: McpServerStatus): void {
		container.empty();

		let iconName: string;
		let statusClass: string;
		let tooltip: string;

		switch (status?.status) {
			case 'connected':
				iconName = 'check-circle';
				statusClass = 'sage-mcp-status-connected';
				tooltip = t('settings.mcp.statusConnected');
				break;
			case 'failed':
				iconName = 'x-circle';
				statusClass = 'sage-mcp-status-failed';
				tooltip = t('settings.mcp.statusFailed');
				break;
			case 'needs-auth':
				iconName = 'key';
				statusClass = 'sage-mcp-status-needs-auth';
				tooltip = t('settings.mcp.statusNeedsAuth');
				break;
			case 'pending':
			default:
				iconName = 'loader';
				statusClass = 'sage-mcp-status-pending';
				tooltip = t('settings.mcp.statusPending');
				break;
		}

		container.addClass(statusClass);
		setIcon(container, iconName);
		container.setAttribute('aria-label', tooltip);
		container.setAttribute('title', tooltip);
	}

	/**
	 * 서버 타입 라벨 반환
	 */
	private getTypeLabel(type: McpServerConfigEntry['type']): string {
		switch (type) {
			case 'stdio':
				return t('settings.mcp.typeStdio');
			case 'sse':
				return t('settings.mcp.typeSse');
			case 'http':
				return t('settings.mcp.typeHttp');
		}
	}

	/**
	 * 서버 활성화/비활성화 토글 핸들러
	 */
	private async handleToggle(server: McpServerConfigEntry, newState: boolean): Promise<void> {
		const previousState = server.enabled;
		server.enabled = newState;

		try {
			await this.plugin.saveSettings();
			// MCP 서버 설정 업데이트 (ChatView의 updateMcpServers 호출)
			if ((this.plugin as any).chatView?.updateMcpServers) {
				(this.plugin as any).chatView.updateMcpServers();
			}
			this.render();
		} catch (error) {
			// 에러 시 롤백
			server.enabled = previousState;
			this.render();
			new Notice(t('settings.mcp.panelToggleError'), 5000);
			console.error('[McpToolsPanel] Toggle error:', error);
		}
	}

	/**
	 * 서버 확장/축소 토글
	 */
	private toggleExpand(serverName: string): void {
		if (this.expandedServers.has(serverName)) {
			this.expandedServers.delete(serverName);
		} else {
			this.expandedServers.add(serverName);
		}
		this.render();
	}

	/**
	 * 도구 목록 렌더링
	 */
	private renderToolsList(container: HTMLElement, server: McpServerConfigEntry, status?: McpServerStatus): void {
		const toolsEl = container.createDiv({ cls: 'sage-mcp-panel-tools' });

		// 연결되지 않은 경우 메시지 표시
		if (!server.enabled || status?.status !== 'connected') {
			toolsEl.createDiv({
				cls: 'sage-mcp-panel-tools-message',
				text: t('settings.mcp.panelToolsNotConnected')
			});
			return;
		}

		// 도구 목록 가져오기
		const tools = status?.tools || [];

		if (tools.length === 0) {
			toolsEl.createDiv({
				cls: 'sage-mcp-panel-tools-message',
				text: t('settings.mcp.panelToolsCount').replace('{count}', '0')
			});
			return;
		}

		// 도구 개수 표시
		toolsEl.createDiv({
			cls: 'sage-mcp-panel-tools-count',
			text: t('settings.mcp.panelToolsCount').replace('{count}', String(tools.length))
		});

		// 개별 도구 목록
		const toolsList = toolsEl.createDiv({ cls: 'sage-mcp-panel-tools-list' });
		for (const tool of tools) {
			const toolItem = toolsList.createDiv({ cls: 'sage-mcp-panel-tool-item' });
			toolItem.createSpan({ cls: 'sage-mcp-panel-tool-name', text: tool.name });
			if (tool.description) {
				toolItem.createSpan({ cls: 'sage-mcp-panel-tool-desc', text: tool.description });
			}
		}
	}

	/**
	 * 설정 페이지 열기
	 */
	private openSettings(): void {
		// Obsidian 설정 페이지 열기
		(this.plugin.app as any).setting?.open();
		// 플러그인 설정 탭으로 이동
		(this.plugin.app as any).setting?.openTabById?.('note-sage');
	}
}
