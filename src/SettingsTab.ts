import { App, PluginSettingTab, Setting } from 'obsidian';
import type NoteSagePlugin from './main';
import {
	AVAILABLE_MODELS,
	QUICK_ACTION_DEFINITIONS,
	DEFAULT_QUICK_ACTIONS,
	QuickActionConfig,
	TOGGLEABLE_BUILTIN_TOOLS,
	AGENT_OPTIONS_LIMITS,
	AGENT_OPTIONS_DEFAULTS,
	PERMISSION_MODE_OPTIONS,
	PermissionMode
} from './types';
import { t, setLanguage, AVAILABLE_LANGUAGES, SupportedLanguage } from './i18n';
import { McpSettingsUI } from './mcp/McpSettingsUI';
import { SkillsManager } from './skills/SkillsManager';
import { SkillDetailModal } from './skills/SkillDetailModal';
import { SkillCreatorModal } from './skills/SkillCreatorModal';
import { SkillNamePrompt } from './skills/SkillNamePrompt';
import type { SkillEntry } from './types';
import { CONTENT_LIMITS } from './constants';

export class NoteSageSettingTab extends PluginSettingTab {
	plugin: NoteSagePlugin;
	private mcpSettingsUI?: McpSettingsUI;
	private skillsManager: SkillsManager;
	private skills: SkillEntry[] = [];

	constructor(app: App, plugin: NoteSagePlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.skillsManager = new SkillsManager(app);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// Model selection
		new Setting(containerEl)
			.setName(t('settings.model'))
			.setDesc(t('settings.modelDesc'))
			.addDropdown(dropdown => {
				AVAILABLE_MODELS.forEach(model => {
					dropdown.addOption(model.value, model.label);
				});
				dropdown
					.setValue(this.plugin.settings.model || 'claude-sonnet-4-5')
					.onChange(async (value) => {
						this.plugin.settings.model = value;
						await this.plugin.saveSettings();
						this.updateViews();
					});
			});

		// ==================== Phase 1-A: 파일 컨텍스트 설정 ====================
		new Setting(containerEl)
			.setName(t('settings.fileContext'))
			.setHeading();

		new Setting(containerEl)
			.setName(t('settings.includeFileContent'))
			.setDesc(t('settings.includeFileContentDesc'))
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeFileContent ?? true)
				.onChange(async (value) => {
					this.plugin.settings.includeFileContent = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		new Setting(containerEl)
			.setName(t('settings.preferSelectedText'))
			.setDesc(t('settings.preferSelectedTextDesc'))
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeSelection ?? true)
				.onChange(async (value) => {
					this.plugin.settings.includeSelection = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		new Setting(containerEl)
			.setName(t('settings.maxContentLength'))
			.setDesc(t('settings.maxContentLengthDesc'))
			.addText(text => text
				.setPlaceholder(String(CONTENT_LIMITS.DEFAULT_MAX_CONTENT_LENGTH))
				.setValue(String(this.plugin.settings.maxContentLength || CONTENT_LIMITS.DEFAULT_MAX_CONTENT_LENGTH))
				.onChange(async (value) => {
					const parsed = parseInt(value, 10);
					const numValue = Number.isNaN(parsed) ? CONTENT_LIMITS.DEFAULT_MAX_CONTENT_LENGTH : parsed;
					this.plugin.settings.maxContentLength = Math.max(
						CONTENT_LIMITS.MIN_CONTENT_LENGTH,
						Math.min(CONTENT_LIMITS.MAX_CONTENT_LENGTH, numValue)
					);
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		// ==================== Phase 1-E: 시스템 프롬프트 설정 ====================
		new Setting(containerEl)
			.setName(t('settings.systemPrompt'))
			.setHeading();

		new Setting(containerEl)
			.setName(t('settings.customSystemPrompt'))
			.setDesc(t('settings.customSystemPromptDesc'))
			.addTextArea(text => {
				text
					.setPlaceholder(t('settings.customSystemPromptPlaceholder'))
					.setValue(this.plugin.settings.systemPrompt || '')
					.onChange(async (value) => {
						this.plugin.settings.systemPrompt = value;
						await this.plugin.saveSettings();
						this.updateViews();
					});
				text.inputEl.rows = 4;
				text.inputEl.style.width = '100%';
			});

		// ==================== Phase 2-B: 대화 저장 설정 ====================
		new Setting(containerEl)
			.setName(t('settings.conversationSaving'))
			.setHeading();

		new Setting(containerEl)
			.setName(t('settings.autoSave'))
			.setDesc(t('settings.autoSaveDesc'))
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoSaveConversations ?? false)
				.onChange(async (value) => {
					this.plugin.settings.autoSaveConversations = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		new Setting(containerEl)
			.setName(t('settings.savePath'))
			.setDesc(t('settings.savePathDesc'))
			.addText(text => text
				.setPlaceholder('AI-Chats')
				.setValue(this.plugin.settings.conversationSavePath || 'AI-Chats')
				.onChange(async (value) => {
					this.plugin.settings.conversationSavePath = value || 'AI-Chats';
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		// ==================== Quick Actions 설정 ====================
		new Setting(containerEl)
			.setName(t('settings.quickActions'))
			.setDesc(t('settings.quickActionsDesc'))
			.setHeading();

		this.renderQuickActionsSettings(containerEl);

		// ==================== 내장 도구 설정 ====================
		new Setting(containerEl)
			.setName(t('settings.builtinTools.title'))
			.setDesc(t('settings.builtinTools.description'))
			.setHeading();

		this.renderBuiltinToolsSettings(containerEl);

		// ==================== Agent Options 설정 ====================
		new Setting(containerEl)
			.setName(t('settings.agentOptions.title'))
			.setDesc(t('settings.agentOptions.description'))
			.setHeading();

		this.renderAgentOptionsSettings(containerEl);

		// ==================== MCP 서버 설정 ====================
		const mcpContainer = containerEl.createDiv({ cls: 'sage-mcp-settings' });
		this.renderMcpSettings(mcpContainer);

		// ==================== Skills 설정 ====================
		const skillsContainer = containerEl.createDiv({ cls: 'sage-skills-settings' });
		this.renderSkillsSettings(skillsContainer);

		// ==================== Claude CLI 고급 설정 ====================
		new Setting(containerEl)
			.setName(t('settings.claudeCliAdvanced'))
			.setHeading();

		// Language setting
		new Setting(containerEl)
			.setName(t('settings.language'))
			.setDesc(t('settings.languageDesc'))
			.addDropdown(dropdown => {
				AVAILABLE_LANGUAGES.forEach(lang => {
					dropdown.addOption(lang.value, lang.label);
				});
				dropdown
					.setValue(this.plugin.settings.language || 'auto')
					.onChange(async (value) => {
						this.plugin.settings.language = value as SupportedLanguage;
						setLanguage(value as SupportedLanguage);
						await this.plugin.saveSettings();
						this.updateViews();
						// Refresh the settings display with new language
						this.display();
					});
			});

		// API Key setting
		new Setting(containerEl)
			.setName(t('settings.apiKey'))
			.setDesc(t('settings.apiKeyDesc'))
			.addText(text => text
				.setPlaceholder(t('settings.apiKeyPlaceholder'))
				.setValue(this.plugin.settings.apiKey || '')
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		new Setting(containerEl)
			.setName(t('settings.claudeCliPath'))
			.setDesc(t('settings.claudeCliPathDesc'))
			.addText(text => text
				.setPlaceholder(t('settings.claudeCliPathPlaceholder'))
				.setValue(this.plugin.settings.claudeExecutablePath || '')
				.onChange(async (value) => {
					this.plugin.settings.claudeExecutablePath = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		const cliInfoEl = containerEl.createEl('div', { cls: 'setting-item-description' });
		cliInfoEl.createEl('small', {
			text: t('settings.claudeCliPathInfo')
		});
		cliInfoEl.style.marginTop = '-10px';
		cliInfoEl.style.marginBottom = '10px';

		// Debug context
		new Setting(containerEl)
			.setName(t('settings.debugMode'))
			.setDesc(t('settings.debugModeDesc'))
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.debugContext || false)
				.onChange(async (value) => {
					this.plugin.settings.debugContext = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		// Plugin management tools
		new Setting(containerEl)
			.setName(t('settings.pluginTools'))
			.setDesc(t('settings.pluginToolsDesc'))
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enablePluginTools ?? false)
				.onChange(async (value) => {
					this.plugin.settings.enablePluginTools = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		// Info section
		new Setting(containerEl)
			.setName(t('settings.about'))
			.setHeading();

		const infoEl = containerEl.createEl('div', { cls: 'sage-settings-info' });
		infoEl.createEl('p', {
			text: t('settings.aboutText1')
		});
		infoEl.createEl('p', {
			text: t('settings.aboutText2')
		});
	}

	private updateViews(): void {
		// Update all open chat views with new settings
		this.app.workspace.getLeavesOfType('note-sage-view').forEach(leaf => {
			const view = leaf.view;
			if (view && 'updateSettings' in view && typeof view.updateSettings === 'function') {
				(view as { updateSettings: (settings: typeof this.plugin.settings) => void }).updateSettings(this.plugin.settings);
			}
		});
	}

	// Quick Action 설정 헬퍼
	private getQuickActionConfig(id: string): QuickActionConfig {
		const config = this.plugin.settings.quickActions?.find(c => c.id === id);
		return config || DEFAULT_QUICK_ACTIONS.find(c => c.id === id) || { id, enabled: true, customPrompt: undefined };
	}

	// Quick Action 설정 업데이트
	private async updateQuickActionConfig(id: string, updates: Partial<QuickActionConfig>): Promise<void> {
		// quickActions 배열이 없으면 기본값으로 초기화
		if (!this.plugin.settings.quickActions) {
			this.plugin.settings.quickActions = [...DEFAULT_QUICK_ACTIONS];
		}

		const index = this.plugin.settings.quickActions.findIndex(c => c.id === id);
		if (index >= 0) {
			this.plugin.settings.quickActions[index] = {
				...this.plugin.settings.quickActions[index],
				...updates
			};
		} else {
			// 해당 id가 없으면 새로 추가
			this.plugin.settings.quickActions.push({
				id,
				enabled: true,
				customPrompt: undefined,
				...updates
			});
		}

		await this.plugin.saveSettings();
		this.updateViews();
	}

	// MCP 설정 UI 렌더링
	private renderMcpSettings(containerEl: HTMLElement): void {
		// 기존 UI 정리
		if (this.mcpSettingsUI) {
			this.mcpSettingsUI.destroy();
		}

		this.mcpSettingsUI = new McpSettingsUI(
			containerEl,
			this.plugin.settings.mcpServers || [],
			async (servers) => {
				this.plugin.settings.mcpServers = servers;
				await this.plugin.saveSettings();
				this.updateViews();
			},
			this.plugin.mcpServerManager
		);

		this.mcpSettingsUI.render();
	}


	/**
	 * Skills 설정 섹션 렌더링
	 */
	private renderSkillsSettings(containerEl: HTMLElement): void {
		containerEl.empty();

		new Setting(containerEl)
			.setName(t('settings.skills.title'))
			.setDesc(t('settings.skills.description'))
			.setHeading();

		// Skills 활성화 토글
		new Setting(containerEl)
			.setName(t('settings.skills.enable'))
			.setDesc(t('settings.skills.enableDesc'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableSkills ?? false)
					.onChange(async (value) => {
						this.plugin.settings.enableSkills = value;
						await this.plugin.saveSettings();
						this.updateViews();
						// Skills 활성화 시 디렉토리 자동 생성
						if (value) {
							await this.skillsManager.ensureSkillsDirectory();
						}
						// UI 갱신
						this.renderSkillsSettings(containerEl);
					})
			);

		// Skills가 비활성화되어 있으면 목록과 버튼을 표시하지 않음
		if (!this.plugin.settings.enableSkills) {
			return;
		}

		// Skills 목록 렌더링
		const listContainer = containerEl.createDiv({ cls: 'sage-skills-list' });
		this.renderSkillsList(listContainer);

		// 생성 버튼들
		const buttonContainer = containerEl.createDiv({
			cls: 'sage-skills-buttons tw-flex tw-gap-2 tw-mt-4',
		});

		new Setting(buttonContainer)
			.addButton((btn) =>
				btn.setButtonText(t('settings.skills.createTemplate')).onClick(() => {
					new SkillNamePrompt(
						this.plugin.app,
						this.skillsManager,
						this.skills,
						async (filePath) => {
							// 생성된 파일을 편집기에서 열기
							const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
							if (file) {
								await this.plugin.app.workspace.openLinkText(filePath, '', false);
							}
							// 목록 갱신
							this.renderSkillsSettings(containerEl);
						}
					).open();
				})
			)
			.addButton((btn) =>
				btn
					.setButtonText(t('settings.skills.createWizard'))
					.setCta()
					.onClick(() => {
						new SkillCreatorModal(
							this.plugin.app,
							this.skillsManager,
							this.skills,
							async (filePath) => {
								// 생성된 파일을 편집기에서 열기
								const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
								if (file) {
									await this.plugin.app.workspace.openLinkText(filePath, '', false);
								}
								// 목록 갱신
								this.renderSkillsSettings(containerEl);
							}
						).open();
					})
			);
	}

	/**
	 * Skills 목록 렌더링
	 */
	private async renderSkillsList(containerEl: HTMLElement): Promise<void> {
		containerEl.empty();

		// Skills 스캔
		this.skills = await this.skillsManager.scanSkills();

		// 비활성화된 Skills 적용
		const disabledSkills = this.plugin.settings.disabledSkills || [];
		this.skills = this.skills.map((skill) => ({
			...skill,
			enabled: skill.hasError ? false : !disabledSkills.includes(skill.id),
		}));

		if (this.skills.length === 0) {
			// Skills 없음 메시지
			const emptyEl = containerEl.createDiv({
				cls: 'sage-skills-empty tw-text-center tw-py-4 tw-text-obs-text-muted',
			});
			emptyEl.createEl('p', { text: t('settings.skills.noSkills') });
			emptyEl.createEl('p', {
				text: t('settings.skills.noSkillsGuide'),
				cls: 'tw-text-sm tw-opacity-70',
			});
			return;
		}

		// Skills 목록 렌더링
		for (const skill of this.skills) {
			const itemEl = containerEl.createDiv({
				cls: `sage-skill-item tw-flex tw-items-center tw-justify-between tw-p-2 tw-rounded tw-mb-2 ${
					skill.enabled ? '' : 'sage-skill-item--disabled tw-opacity-50'
				} ${skill.hasError ? 'sage-skill-item--error' : ''}`,
			});

			// 왼쪽: 이름과 설명
			const infoEl = itemEl.createDiv({ cls: 'sage-skill-info tw-flex-1' });

			const nameEl = infoEl.createEl('span', {
				text: skill.metadata.name || skill.id,
				cls: 'sage-skill-name tw-font-medium tw-cursor-pointer hover:tw-underline',
			});

			// 이름 클릭 시 상세 보기 모달
			nameEl.addEventListener('click', () => {
				new SkillDetailModal(this.plugin.app, skill).open();
			});

			if (skill.metadata.description) {
				infoEl.createEl('span', {
					text: ` - ${skill.metadata.description}`,
					cls: 'sage-skill-desc tw-text-sm tw-text-obs-text-muted',
				});
			}

			// 에러 표시
			if (skill.hasError) {
				const errorEl = infoEl.createEl('span', {
					text: ` ⚠️ ${skill.errorMessage || t('settings.skills.parseError')}`,
					cls: 'sage-skill-error tw-text-sm tw-text-red-500',
				});
				errorEl.setAttribute('title', skill.errorMessage || '');
			}

			// 오른쪽: 토글과 삭제 버튼
			const actionsEl = itemEl.createDiv({
				cls: 'sage-skill-actions tw-flex tw-items-center tw-gap-2',
			});

			// 활성화 토글 (에러가 없는 경우에만)
			if (!skill.hasError) {
				const toggleEl = actionsEl.createEl('div', { cls: 'checkbox-container' });
				const toggle = toggleEl.createEl('input', { type: 'checkbox' });
				toggle.checked = skill.enabled;
				toggle.addEventListener('change', async () => {
					const disabledSkills = this.plugin.settings.disabledSkills || [];
					if (toggle.checked) {
						// 활성화: 목록에서 제거
						this.plugin.settings.disabledSkills = disabledSkills.filter(
							(id) => id !== skill.id
						);
					} else {
						// 비활성화: 목록에 추가
						if (!disabledSkills.includes(skill.id)) {
							this.plugin.settings.disabledSkills = [...disabledSkills, skill.id];
						}
					}
					await this.plugin.saveSettings();
					this.updateViews();
					// UI 업데이트
					await this.renderSkillsList(containerEl);
				});
			}

			// 삭제 버튼
			const deleteBtn = actionsEl.createEl('button', {
				cls: 'sage-skill-delete tw-p-1 tw-rounded hover:tw-bg-obs-bg-secondary',
				attr: { 'aria-label': t('settings.skills.delete') },
			});
			deleteBtn.innerHTML = '🗑️';
			deleteBtn.addEventListener('click', async () => {
				// 확인 다이얼로그
				const confirmed = confirm(
					t('settings.skills.deleteConfirm', { name: skill.metadata.name || skill.id })
				);
				if (confirmed) {
					await this.skillsManager.deleteSkill(skill.id);
					// 목록 갱신
					await this.renderSkillsList(containerEl);
				}
			});
		}
	}

	// 내장 도구 설정 UI 렌더링
	private renderBuiltinToolsSettings(containerEl: HTMLElement): void {
		const disabledTools = this.plugin.settings.disabledBuiltinTools || [];

		for (const tool of TOGGLEABLE_BUILTIN_TOOLS) {
			const isEnabled = !disabledTools.includes(tool.name);

			new Setting(containerEl)
				.setName(t(tool.labelKey))
				.setDesc(t(tool.descriptionKey))
				.addToggle(toggle => {
					toggle
						.setValue(isEnabled)
						.onChange(async (value) => {
							await this.updateBuiltinToolConfig(tool.name, value);
						});
				});
		}
	}

	// 내장 도구 설정 업데이트
	private async updateBuiltinToolConfig(toolName: string, enabled: boolean): Promise<void> {
		// disabledBuiltinTools 배열이 없으면 초기화
		if (!this.plugin.settings.disabledBuiltinTools) {
			this.plugin.settings.disabledBuiltinTools = [];
		}

		const index = this.plugin.settings.disabledBuiltinTools.indexOf(toolName);

		if (enabled && index >= 0) {
			// 도구 활성화: 배열에서 제거
			this.plugin.settings.disabledBuiltinTools.splice(index, 1);
		} else if (!enabled && index < 0) {
			// 도구 비활성화: 배열에 추가
			this.plugin.settings.disabledBuiltinTools.push(toolName);
		}

		await this.plugin.saveSettings();
		this.updateViews();
	}

	// Quick Actions 설정 UI 렌더링
	private renderQuickActionsSettings(containerEl: HTMLElement): void {
		for (const def of QUICK_ACTION_DEFINITIONS) {
			const config = this.getQuickActionConfig(def.id);

			const setting = new Setting(containerEl)
				.setName(t(def.labelKey))
				.addToggle(toggle => {
					toggle
						.setValue(config.enabled)
						.onChange(async (value) => {
							await this.updateQuickActionConfig(def.id, { enabled: value });
						});
				})
				.addTextArea(text => {
					text
						.setPlaceholder(t(def.promptKey))
						.setValue(config.customPrompt || '')
						.onChange(async (value) => {
							// 빈 문자열은 undefined로 처리
							await this.updateQuickActionConfig(def.id, {
								customPrompt: value.trim() || undefined
							});
						});
					text.inputEl.rows = 2;
					text.inputEl.style.width = '100%';
				})
				.addExtraButton(button => {
					button
						.setIcon('reset')
						.setTooltip(t('settings.resetToDefault'))
						.onClick(async () => {
							await this.updateQuickActionConfig(def.id, { customPrompt: undefined });
							// 설정 탭 다시 렌더링하여 UI 업데이트
							this.display();
						});
				});

			// 설정 컨테이너에 클래스 추가
			setting.settingEl.addClass('sage-quick-action-setting');
		}
	}

	// T010: API 키 설정 여부 확인 헬퍼
	private hasApiKey(): boolean {
		return !!(this.plugin.settings.apiKey && this.plugin.settings.apiKey.trim());
	}

	// Agent Options 설정 UI 렌더링
	private renderAgentOptionsSettings(containerEl: HTMLElement): void {
		// T013, T014: maxTurns 설정 UI
		new Setting(containerEl)
			.setName(t('settings.agentOptions.maxTurns'))
			.setDesc(t('settings.agentOptions.maxTurnsDesc'))
			.addText(text => {
				text
					.setPlaceholder(t('settings.agentOptions.maxTurnsPlaceholder'))
					.setValue(String(this.plugin.settings.maxTurns ?? AGENT_OPTIONS_DEFAULTS.maxTurns))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						const numValue = Number.isNaN(parsed) ? AGENT_OPTIONS_DEFAULTS.maxTurns : parsed;
						// T014: 범위 검증 (0-100)
						this.plugin.settings.maxTurns = Math.max(
							AGENT_OPTIONS_LIMITS.maxTurns.min,
							Math.min(AGENT_OPTIONS_LIMITS.maxTurns.max, numValue)
						);
						await this.plugin.saveSettings();
						this.updateViews();
					});
				text.inputEl.type = 'number';
				text.inputEl.min = String(AGENT_OPTIONS_LIMITS.maxTurns.min);
				text.inputEl.max = String(AGENT_OPTIONS_LIMITS.maxTurns.max);
				text.inputEl.style.width = '80px';
			});

		// T009: maxBudgetUsd 설정 UI (조건부: API 키가 설정된 경우만)
		if (this.hasApiKey()) {
			new Setting(containerEl)
				.setName(t('settings.agentOptions.maxBudgetUsd'))
				.setDesc(t('settings.agentOptions.maxBudgetUsdDesc'))
				.addText(text => {
					text
						.setPlaceholder(t('settings.agentOptions.maxBudgetUsdPlaceholder'))
						.setValue(String(this.plugin.settings.maxBudgetUsd ?? AGENT_OPTIONS_DEFAULTS.maxBudgetUsd))
						.onChange(async (value) => {
							const parsed = parseFloat(value);
							const numValue = Number.isNaN(parsed) ? AGENT_OPTIONS_DEFAULTS.maxBudgetUsd : parsed;
							// 소수점 2자리까지, 범위 검증 (0-100)
							this.plugin.settings.maxBudgetUsd = Math.max(
								AGENT_OPTIONS_LIMITS.maxBudgetUsd.min,
								Math.min(AGENT_OPTIONS_LIMITS.maxBudgetUsd.max, Math.round(numValue * 100) / 100)
							);
							await this.plugin.saveSettings();
							this.updateViews();
						});
					text.inputEl.type = 'number';
					text.inputEl.min = String(AGENT_OPTIONS_LIMITS.maxBudgetUsd.min);
					text.inputEl.max = String(AGENT_OPTIONS_LIMITS.maxBudgetUsd.max);
					text.inputEl.step = '0.01';
					text.inputEl.style.width = '80px';
				});
		}

		// T016: Extended Thinking 토글
		new Setting(containerEl)
			.setName(t('settings.agentOptions.enableExtendedThinking'))
			.setDesc(t('settings.agentOptions.enableExtendedThinkingDesc'))
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.enableExtendedThinking ?? AGENT_OPTIONS_DEFAULTS.enableExtendedThinking)
					.onChange(async (value) => {
						this.plugin.settings.enableExtendedThinking = value;
						await this.plugin.saveSettings();
						this.updateViews();
						// 설정 탭 다시 렌더링하여 조건부 UI 업데이트
						this.display();
					});
			});

		// T017: maxThinkingTokens 설정 (조건부: Extended Thinking이 ON일 때만)
		if (this.plugin.settings.enableExtendedThinking) {
			new Setting(containerEl)
				.setName(t('settings.agentOptions.maxThinkingTokens'))
				.setDesc(t('settings.agentOptions.maxThinkingTokensDesc'))
				.addSlider(slider => {
					slider
						.setLimits(
							AGENT_OPTIONS_LIMITS.maxThinkingTokens.min,
							AGENT_OPTIONS_LIMITS.maxThinkingTokens.max,
							1000
						)
						.setValue(this.plugin.settings.maxThinkingTokens ?? AGENT_OPTIONS_DEFAULTS.maxThinkingTokens)
						.setDynamicTooltip()
						.onChange(async (value) => {
							this.plugin.settings.maxThinkingTokens = value;
							await this.plugin.saveSettings();
							this.updateViews();
						});
				})
				.addText(text => {
					text
						.setValue(String(this.plugin.settings.maxThinkingTokens ?? AGENT_OPTIONS_DEFAULTS.maxThinkingTokens))
						.onChange(async (value) => {
							const parsed = parseInt(value, 10);
							const numValue = Number.isNaN(parsed) ? AGENT_OPTIONS_DEFAULTS.maxThinkingTokens : parsed;
							this.plugin.settings.maxThinkingTokens = Math.max(
								AGENT_OPTIONS_LIMITS.maxThinkingTokens.min,
								Math.min(AGENT_OPTIONS_LIMITS.maxThinkingTokens.max, numValue)
							);
							await this.plugin.saveSettings();
							this.updateViews();
							// 슬라이더 값 동기화를 위해 다시 렌더링
							this.display();
						});
					text.inputEl.type = 'number';
					text.inputEl.min = String(AGENT_OPTIONS_LIMITS.maxThinkingTokens.min);
					text.inputEl.max = String(AGENT_OPTIONS_LIMITS.maxThinkingTokens.max);
					text.inputEl.style.width = '80px';
				});
		}

		// T019, T020: Permission Mode 드롭다운
		new Setting(containerEl)
			.setName(t('settings.agentOptions.permissionMode.title'))
			.setDesc(t('settings.agentOptions.permissionMode.description'))
			.addDropdown(dropdown => {
				for (const option of PERMISSION_MODE_OPTIONS) {
					// 라벨에 설명 추가
					const label = t(option.labelKey);
					dropdown.addOption(option.value, label);
				}
				dropdown
					.setValue(this.plugin.settings.permissionMode ?? AGENT_OPTIONS_DEFAULTS.permissionMode)
					.onChange(async (value) => {
						this.plugin.settings.permissionMode = value as PermissionMode;
						await this.plugin.saveSettings();
						this.updateViews();
					});
			});

		// 선택된 권한 모드의 설명 표시
		const currentMode = this.plugin.settings.permissionMode ?? AGENT_OPTIONS_DEFAULTS.permissionMode;
		const modeDescKey = `settings.agentOptions.permissionMode.${currentMode}Desc`;
		const modeDescEl = containerEl.createEl('div', { cls: 'setting-item-description' });
		modeDescEl.createEl('small', {
			text: t(modeDescKey)
		});
		modeDescEl.style.marginTop = '-10px';
		modeDescEl.style.marginBottom = '10px';
		modeDescEl.style.paddingLeft = '10px';
		modeDescEl.style.fontStyle = 'italic';
	}
}
