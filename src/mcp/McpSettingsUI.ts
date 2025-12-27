import { Setting, setIcon, Notice } from 'obsidian';
import type { McpServerConfigEntry, McpServerStatus } from '../types';
import { t } from '../i18n';
import { McpServerManager } from './McpServerManager';

/**
 * MCP 서버 설정을 UI로 표시하는 클래스
 * 책임:
 * - 등록된 MCP 서버 목록 렌더링
 * - 서버 추가/편집/삭제 폼 제공
 * - 서버 활성화/비활성화 토글
 * - 중복 이름 검증
 */
export class McpSettingsUI {
	private containerEl: HTMLElement;
	private servers: McpServerConfigEntry[];
	private onSave: (servers: McpServerConfigEntry[]) => Promise<void>;
	private mcpServerManager?: McpServerManager;
	private unsubscribeStatus?: () => void;

	// 현재 편집 중인 서버 (null이면 새 서버 추가)
	private editingServer: McpServerConfigEntry | null = null;
	private isFormVisible = false;

	constructor(
		containerEl: HTMLElement,
		servers: McpServerConfigEntry[],
		onSave: (servers: McpServerConfigEntry[]) => Promise<void>,
		mcpServerManager?: McpServerManager
	) {
		this.containerEl = containerEl;
		this.servers = [...servers];
		this.onSave = onSave;
		this.mcpServerManager = mcpServerManager;
	}

	/**
	 * MCP 설정 섹션 전체 렌더링
	 */
	render(): void {
		this.containerEl.empty();

		// 섹션 헤딩
		new Setting(this.containerEl)
			.setName(t('settings.mcp.title'))
			.setDesc(t('settings.mcp.description'))
			.setHeading();

		// 서버 목록
		this.renderServerList();

		// 추가/편집 폼
		if (this.isFormVisible) {
			this.renderServerForm();
		}

		// 상태 변경 구독
		if (this.mcpServerManager && !this.unsubscribeStatus) {
			this.unsubscribeStatus = this.mcpServerManager.onStatusChange(() => {
				this.renderServerList();
			});
		}
	}

	/**
	 * 등록된 서버 목록 렌더링
	 */
	private renderServerList(): void {
		// 기존 서버 목록 영역 제거
		const existingList = this.containerEl.querySelector('.sage-mcp-server-list');
		if (existingList) {
			existingList.remove();
		}

		const listContainer = this.containerEl.createDiv({ cls: 'sage-mcp-server-list' });

		if (this.servers.length === 0) {
			listContainer.createDiv({
				cls: 'sage-mcp-no-servers',
				text: t('settings.mcp.noServers')
			});
		} else {
			for (const server of this.servers) {
				this.renderServerItem(listContainer, server);
			}
		}

		// 서버 추가 버튼
		new Setting(listContainer)
			.addButton(button => {
				button
					.setButtonText(t('settings.mcp.addServer'))
					.setCta()
					.onClick(() => {
						this.editingServer = null;
						this.isFormVisible = true;
						this.render();
					});
			});
	}

	/**
	 * 개별 서버 항목 렌더링
	 */
	private renderServerItem(container: HTMLElement, server: McpServerConfigEntry): void {
		const itemEl = container.createDiv({ cls: 'sage-mcp-server-item' });

		// 상태 아이콘
		const status = this.mcpServerManager?.getStatus(server.name);
		const statusEl = itemEl.createSpan({ cls: 'sage-mcp-status-icon' });
		this.renderStatusIcon(statusEl, status, server.enabled);

		// 서버 정보
		const infoEl = itemEl.createDiv({ cls: 'sage-mcp-server-info' });
		infoEl.createDiv({ cls: 'sage-mcp-server-name', text: server.name });
		infoEl.createDiv({
			cls: 'sage-mcp-server-type',
			text: this.getTypeLabel(server.type)
		});

		// 컨트롤 버튼들
		const controlsEl = itemEl.createDiv({ cls: 'sage-mcp-server-controls' });

		// 활성화/비활성화 토글
		const toggleLabel = controlsEl.createEl('label', { cls: 'sage-mcp-toggle' });
		const toggleInput = toggleLabel.createEl('input', {
			type: 'checkbox',
			cls: 'sage-mcp-toggle-checkbox'
		});
		toggleInput.checked = server.enabled;
		toggleLabel.createSpan({ cls: 'sage-mcp-toggle-slider' });
		toggleInput.addEventListener('change', async () => {
			try {
				server.enabled = toggleInput.checked;
				await this.onSave(this.servers);

				// 활성화 시 로컬 검증 수행
				if (toggleInput.checked && this.mcpServerManager) {
					const result = this.mcpServerManager.validateEntry(server);
					this.mcpServerManager.updateStatus({
						name: server.name,
						status: result.valid ? 'pending' : 'failed',
						errorMessage: result.errorMessage
					});
				}

				this.render();
			} catch (error) {
				console.error('[McpSettingsUI] Toggle error:', error);
				new Notice(t('settings.mcp.panelToggleError'), 5000);
			}
		});

		// 편집 버튼
		const editBtn = controlsEl.createEl('button', { cls: 'sage-mcp-btn sage-mcp-btn-edit' });
		setIcon(editBtn, 'pencil');
		editBtn.setAttribute('aria-label', t('settings.mcp.editServer'));
		editBtn.addEventListener('click', () => {
			this.editingServer = server;
			this.isFormVisible = true;
			this.render();
		});

		// 삭제 버튼
		const deleteBtn = controlsEl.createEl('button', { cls: 'sage-mcp-btn sage-mcp-btn-delete' });
		setIcon(deleteBtn, 'trash');
		deleteBtn.setAttribute('aria-label', t('settings.mcp.deleteServer'));
		deleteBtn.addEventListener('click', async () => {
			if (confirm(t('settings.mcp.deleteConfirm'))) {
				try {
					this.servers = this.servers.filter(s => s.name !== server.name);
					await this.onSave(this.servers);
					this.render();
				} catch (error) {
					console.error('[McpSettingsUI] Delete error:', error);
					new Notice(t('settings.mcp.deleteError'), 5000);
				}
			}
		});

		// 에러 메시지 표시
		if (status?.status === 'failed' && status.errorMessage) {
			const errorEl = itemEl.createDiv({ cls: 'sage-mcp-error-message' });
			errorEl.setText(status.errorMessage);
		}
	}

	/**
	 * 상태 아이콘 렌더링
	 */
	private renderStatusIcon(container: HTMLElement, status?: McpServerStatus, enabled: boolean = true): void {
		container.empty();

		let iconName: string;
		let statusClass: string;
		let tooltip: string;

		// 비활성화된 서버는 비활성화 상태로 표시
		if (!enabled) {
			iconName = 'circle';
			statusClass = 'sage-mcp-status-disabled';
			tooltip = t('settings.mcp.enabled');
		} else {
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
		}

		container.addClass(statusClass);
		setIcon(container, iconName);
		container.setAttribute('aria-label', tooltip);
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
			default: {
				// TypeScript exhaustiveness check
				const _exhaustiveCheck: never = type;
				return `Unknown: ${_exhaustiveCheck}`;
			}
		}
	}

	/**
	 * 서버 추가/편집 폼 렌더링
	 */
	private renderServerForm(): void {
		const formContainer = this.containerEl.createDiv({ cls: 'sage-mcp-form' });
		const isEditing = this.editingServer !== null;

		// 폼 제목
		formContainer.createEl('h4', {
			text: isEditing ? t('settings.mcp.editServer') : t('settings.mcp.addServer')
		});

		// 폼 상태 관리
		const formState: Partial<McpServerConfigEntry> = isEditing
			? { ...this.editingServer }
			: { type: 'stdio', enabled: true };

		// 서버 이름
		const nameContainer = formContainer.createDiv({ cls: 'sage-mcp-form-field' });
		new Setting(nameContainer)
			.setName(t('settings.mcp.serverName'))
			.addText(text => {
				text
					.setPlaceholder(t('settings.mcp.serverNamePlaceholder'))
					.setValue(formState.name || '')
					.onChange(value => {
						formState.name = value.trim();
					});
				text.inputEl.required = true;
			});

		// 중복 이름 경고
		const nameWarning = nameContainer.createDiv({
			cls: 'sage-mcp-warning',
			text: t('settings.mcp.duplicateName')
		});
		nameWarning.style.display = 'none';

		// 서버 타입 선택
		new Setting(formContainer)
			.setName(t('settings.mcp.serverType'))
			.addDropdown(dropdown => {
				dropdown
					.addOption('stdio', t('settings.mcp.typeStdio'))
					.addOption('sse', t('settings.mcp.typeSse'))
					.addOption('http', t('settings.mcp.typeHttp'))
					.setValue(formState.type || 'stdio')
					.onChange(value => {
						formState.type = value as McpServerConfigEntry['type'];
						// 타입 변경 시 관련 필드 초기화
						if (value === 'stdio') {
							delete formState.url;
							delete formState.headers;
						} else {
							delete formState.command;
							delete formState.args;
							delete formState.env;
						}
						this.renderDynamicFields(dynamicFieldsContainer, formState);
					});
			});

		// 동적 필드 컨테이너
		const dynamicFieldsContainer = formContainer.createDiv({ cls: 'sage-mcp-dynamic-fields' });
		this.renderDynamicFields(dynamicFieldsContainer, formState);

		// 버튼 영역
		const buttonContainer = formContainer.createDiv({ cls: 'sage-mcp-form-buttons' });

		// 저장 버튼
		const saveBtn = buttonContainer.createEl('button', {
			cls: 'mod-cta',
			text: t('settings.mcp.save')
		});
		saveBtn.addEventListener('click', async () => {
			// 유효성 검사
			if (!formState.name?.trim()) {
				return;
			}

			// 중복 이름 검사 (편집 시 자기 자신은 제외)
			const isDuplicate = this.servers.some(s =>
				s.name === formState.name && s.name !== this.editingServer?.name
			);

			if (isDuplicate) {
				nameWarning.style.display = 'block';
				return;
			}

			// stdio 타입 필수 필드 검사
			if (formState.type === 'stdio' && !formState.command?.trim()) {
				return;
			}

			// sse/http 타입 필수 필드 검사
			if ((formState.type === 'sse' || formState.type === 'http') && !formState.url?.trim()) {
				return;
			}

			// stdio 타입일 경우 명령어 유효성 검사
			if (formState.type === 'stdio' && formState.command) {
				const commandField = dynamicFieldsContainer.querySelector('.sage-mcp-form-field');
				const existingError = commandField?.querySelector('.sage-mcp-command-error');
				if (existingError) {
					existingError.remove();
				}

				const validation = McpServerManager.validateCommand(formState.command);
				if (!validation.found) {
					// 에러 메시지 표시
					if (commandField) {
						const errorEl = commandField.createDiv({ cls: 'sage-mcp-command-error' });
						errorEl.createDiv({
							cls: 'sage-mcp-command-error-title',
							text: t('settings.mcp.commandNotFound')
						});
						errorEl.createDiv({
							cls: 'sage-mcp-command-error-desc',
							text: t('settings.mcp.commandNotFoundDesc').replace('{command}', formState.command)
						});
					}
					return;
				}

				// 검증된 전체 경로가 있으면 사용
				if (validation.resolvedPath && validation.resolvedPath !== formState.command) {
					console.log(`[McpSettingsUI] Command "${formState.command}" resolved to "${validation.resolvedPath}"`);
					formState.command = validation.resolvedPath;
				}
			}

			try {
				const newServer: McpServerConfigEntry = {
					name: formState.name!,
					type: formState.type!,
					enabled: formState.enabled ?? true,
					...(formState.type === 'stdio' && {
						command: formState.command,
						args: formState.args,
						env: formState.env
					}),
					...((formState.type === 'sse' || formState.type === 'http') && {
						url: formState.url,
						headers: formState.headers
					})
				};

				if (isEditing) {
					// 기존 서버 수정
					const index = this.servers.findIndex(s => s.name === this.editingServer!.name);
					if (index >= 0) {
						this.servers[index] = newServer;
					}
				} else {
					// 새 서버 추가
					this.servers.push(newServer);
				}

				await this.onSave(this.servers);
				this.isFormVisible = false;
				this.editingServer = null;
				this.render();
			} catch (error) {
				console.error('[McpSettingsUI] Save error:', error);
				new Notice(t('settings.mcp.saveError'), 5000);
			}
		});

		// 취소 버튼
		const cancelBtn = buttonContainer.createEl('button', {
			text: t('settings.mcp.cancel')
		});
		cancelBtn.addEventListener('click', () => {
			this.isFormVisible = false;
			this.editingServer = null;
			this.render();
		});
	}

	/**
	 * 서버 타입에 따른 동적 필드 렌더링
	 */
	private renderDynamicFields(container: HTMLElement, formState: Partial<McpServerConfigEntry>): void {
		container.empty();

		if (formState.type === 'stdio') {
			this.renderStdioFields(container, formState);
		} else {
			this.renderHttpFields(container, formState);
		}
	}

	/**
	 * stdio 타입 전용 필드 렌더링
	 */
	private renderStdioFields(container: HTMLElement, formState: Partial<McpServerConfigEntry>): void {
		// 명령어
		const commandContainer = container.createDiv({ cls: 'sage-mcp-form-field' });
		new Setting(commandContainer)
			.setName(t('settings.mcp.command'))
			.addText(text => {
				text
					.setPlaceholder(t('settings.mcp.commandPlaceholder'))
					.setValue(formState.command || '')
					.onChange(value => {
						formState.command = value.trim();
						// 입력 시 에러 메시지 숨기기
						const errorEl = commandContainer.querySelector('.sage-mcp-command-error');
						if (errorEl) {
							errorEl.remove();
						}
					});
				text.inputEl.required = true;
			});

		// 인자
		new Setting(container)
			.setName(t('settings.mcp.args'))
			.addText(text => {
				text
					.setPlaceholder(t('settings.mcp.argsPlaceholder'))
					.setValue(formState.args?.join(', ') || '')
					.onChange(value => {
						formState.args = value
							.split(',')
							.map(s => s.trim())
							.filter(s => s.length > 0);
					});
			});

		// 환경 변수
		const envContainer = container.createDiv({ cls: 'sage-mcp-form-field' });
		new Setting(envContainer)
			.setName(t('settings.mcp.env'))
			.addTextArea(text => {
				text
					.setPlaceholder(t('settings.mcp.envPlaceholder'))
					.setValue(formState.env ? JSON.stringify(formState.env, null, 2) : '')
					.onChange(value => {
						const existingError = envContainer.querySelector('.sage-mcp-json-error');
						try {
							formState.env = value.trim() ? JSON.parse(value) : undefined;
							if (existingError) existingError.remove();
							text.inputEl.removeClass('sage-input-error');
						} catch {
							if (!existingError && value.trim()) {
								envContainer.createDiv({
									cls: 'sage-mcp-json-error',
									text: t('settings.mcp.invalidJson')
								});
							}
							text.inputEl.addClass('sage-input-error');
						}
					});
				text.inputEl.rows = 3;
				text.inputEl.style.width = '100%';
			});
	}

	/**
	 * SSE/HTTP 타입 전용 필드 렌더링
	 */
	private renderHttpFields(container: HTMLElement, formState: Partial<McpServerConfigEntry>): void {
		// URL
		new Setting(container)
			.setName(t('settings.mcp.url'))
			.addText(text => {
				text
					.setPlaceholder(t('settings.mcp.urlPlaceholder'))
					.setValue(formState.url || '')
					.onChange(value => {
						formState.url = value.trim();
					});
				text.inputEl.required = true;
				text.inputEl.type = 'url';
			});

		// 헤더
		const headersContainer = container.createDiv({ cls: 'sage-mcp-form-field' });
		new Setting(headersContainer)
			.setName(t('settings.mcp.headers'))
			.addTextArea(text => {
				text
					.setPlaceholder(t('settings.mcp.headersPlaceholder'))
					.setValue(formState.headers ? JSON.stringify(formState.headers, null, 2) : '')
					.onChange(value => {
						const existingError = headersContainer.querySelector('.sage-mcp-json-error');
						try {
							formState.headers = value.trim() ? JSON.parse(value) : undefined;
							if (existingError) existingError.remove();
							text.inputEl.removeClass('sage-input-error');
						} catch {
							if (!existingError && value.trim()) {
								headersContainer.createDiv({
									cls: 'sage-mcp-json-error',
									text: t('settings.mcp.invalidJson')
								});
							}
							text.inputEl.addClass('sage-input-error');
						}
					});
				text.inputEl.rows = 3;
				text.inputEl.style.width = '100%';
			});
	}

	/**
	 * 리소스 정리
	 */
	destroy(): void {
		if (this.unsubscribeStatus) {
			this.unsubscribeStatus();
			this.unsubscribeStatus = undefined;
		}
	}
}
