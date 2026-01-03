import { App, Notice, PluginSettingTab, Setting, setIcon } from 'obsidian';
import type NoteSagePlugin from './main';
import {
	AVAILABLE_MODELS,
	QUICK_ACTION_DEFINITIONS,
	DEFAULT_QUICK_ACTIONS,
	TOGGLEABLE_BUILTIN_TOOLS,
	AGENT_OPTIONS_LIMITS,
	AGENT_OPTIONS_DEFAULTS,
	PERMISSION_MODE_OPTIONS,
} from './types';
import type { QuickActionConfig, PermissionMode, NoteSageSettings } from './types';
import { t, setLanguage, AVAILABLE_LANGUAGES, getEffectiveLanguage } from './i18n';
import type { SupportedLanguage } from './i18n';
import { McpSettingsUI } from './mcp/McpSettingsUI';
import { SkillsManager } from './skills/SkillsManager';
import { SkillDetailModal } from './skills/SkillDetailModal';
import { SkillTemplateModal } from './skills/SkillCreatorModal';
import { SkillAIWizardModal } from './skills/SkillAIWizardModal';
import { SkillDeleteModal } from './skills/SkillDeleteModal';
import { SkillEditModal } from './skills/SkillEditModal';
import type { SkillEntry } from './types';
import { CONTENT_LIMITS } from './constants';

/**
 * Claude Code Skills 문서 URL 매핑
 * 지원되는 언어: en, ko, ja, es, fr, de, ru
 * 미지원 언어(pt, zh, ar, hi)는 영어로 폴백
 */
const SKILLS_DOCS_LANGUAGES: Record<string, string> = {
	en: 'en',
	ko: 'ko',
	ja: 'ja',
	es: 'es',
	fr: 'fr',
	de: 'de',
	ru: 'ru',
};

/**
 * 현재 언어에 맞는 Claude Code Skills 문서 URL 반환
 */
function getSkillsDocsUrl(): string {
	const effectiveLang = getEffectiveLanguage();
	const docsLang = SKILLS_DOCS_LANGUAGES[effectiveLang] || 'en';
	return `https://code.claude.com/docs/${docsLang}/skills`;
}

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
		const settings = this.plugin.settings;
		this.app.workspace.getLeavesOfType('note-sage-view').forEach(leaf => {
			const view = leaf.view;
			if (view && 'updateSettings' in view && typeof view.updateSettings === 'function') {
				(view as { updateSettings: (settings: NoteSageSettings) => void }).updateSettings(settings);
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

		// 헤더 섹션 (description에 문서 링크 포함)
		const descFragment = document.createDocumentFragment();
		descFragment.appendText(t('settings.skills.description') + ' · ');
		const docsLink = descFragment.createEl('a', {
			cls: 'sage-skills-docs-link',
			text: t('settings.skills.docsLink'),
		});
		docsLink.setAttr('href', getSkillsDocsUrl());
		docsLink.setAttr('target', '_blank');
		docsLink.setAttr('rel', 'noopener noreferrer');
		const docsIconSpan = docsLink.createSpan({ cls: 'sage-skills-docs-link-icon' });
		setIcon(docsIconSpan, 'external-link');

		const headerSetting = new Setting(containerEl)
			.setName(t('settings.skills.title'))
			.setDesc(descFragment)
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

		// Skills 목록 컨테이너
		const listContainer = containerEl.createDiv({ cls: 'sage-skills-list' });

		// Skills 목록 렌더링 (비동기로 스탯 업데이트)
		this.renderSkillsList(listContainer).then(() => {
			// 스탯 배지 업데이트
			const activeCount = this.skills.filter(s => s.enabled && !s.hasError).length;
			const totalCount = this.skills.length;

			// 기존 배지 제거
			const existingBadge = headerSetting.settingEl.querySelector('.sage-skills-stats-badge');
			if (existingBadge) existingBadge.remove();

			// 스킬이 있을 때만 배지 표시
			if (totalCount > 0) {
				const badgeEl = headerSetting.nameEl.createSpan({ cls: 'sage-skills-stats-badge' });
				badgeEl.setText(`${activeCount}/${totalCount}`);
				badgeEl.setAttribute('aria-label', t('settings.skills.activeCount', { active: String(activeCount) }));
			}
		});

		// 생성 버튼들
		const buttonContainer = containerEl.createDiv({
			cls: 'sage-skills-buttons',
		});

		// 템플릿 버튼
		const templateBtn = buttonContainer.createEl('button', {
			cls: 'sage-skills-create-btn',
		});
		const templateIconSpan = templateBtn.createSpan({ cls: 'sage-skills-create-btn-icon' });
		setIcon(templateIconSpan, 'file-plus');
		templateBtn.createSpan({ text: t('settings.skills.createTemplate') });
		templateBtn.addEventListener('click', () => {
			new SkillTemplateModal(
				this.plugin.app,
				this.skillsManager,
				this.skills,
				async (filePath) => {
					const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
					if (file) {
						await this.plugin.app.workspace.openLinkText(filePath, '', false);
					}
					this.renderSkillsSettings(containerEl);
				}
			).open();
		});

		// AI 생성 버튼 (CTA)
		const aiBtn = buttonContainer.createEl('button', {
			cls: 'sage-skills-create-btn sage-skills-create-btn--cta',
		});
		const aiIconSpan = aiBtn.createSpan({ cls: 'sage-skills-create-btn-icon' });
		setIcon(aiIconSpan, 'sparkles');
		aiBtn.createSpan({ text: t('settings.skills.createAIWizard') });
		aiBtn.addEventListener('click', () => {
			new SkillAIWizardModal(
				this.plugin.app,
				this.plugin,
				this.skillsManager,
				this.skills,
				async (filePath) => {
					const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
					if (file) {
						await this.plugin.app.workspace.openLinkText(filePath, '', false);
					}
					this.renderSkillsSettings(containerEl);
				}
			).open();
		});
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
			// Skills 없음 - 개선된 빈 상태 디자인
			const emptyEl = containerEl.createDiv({ cls: 'sage-skills-empty' });

			// 아이콘
			const iconEl = emptyEl.createDiv({ cls: 'sage-skills-empty-icon' });
			setIcon(iconEl, 'wand-2');

			// 메시지
			emptyEl.createEl('p', {
				text: t('settings.skills.noSkills'),
				cls: 'sage-skills-empty-title',
			});
			emptyEl.createEl('p', {
				text: t('settings.skills.noSkillsGuide'),
				cls: 'sage-skills-empty-desc',
			});
			return;
		}

		// Skills 목록 렌더링
		for (const skill of this.skills) {
			this.renderSkillItem(containerEl, skill);
		}
	}

	/**
	 * 개별 Skill 아이템 렌더링
	 */
	private renderSkillItem(container: HTMLElement, skill: SkillEntry): void {
		// 상태에 따른 클래스 결정
		const statusClass = skill.hasError
			? 'sage-skill-item--error'
			: skill.enabled
				? 'sage-skill-item--active'
				: 'sage-skill-item--disabled';

		const itemEl = container.createDiv({
			cls: `sage-skill-item ${statusClass}`,
		});

		// 상태 아이콘 (에러/활성/비활성)
		const iconEl = itemEl.createSpan({ cls: 'sage-skill-icon' });
		if (skill.hasError) {
			setIcon(iconEl, 'alert-circle');
			iconEl.addClass('sage-skill-icon--error');
		} else if (skill.enabled) {
			setIcon(iconEl, 'wand-2');
			iconEl.addClass('sage-skill-icon--active');
		} else {
			setIcon(iconEl, 'wand');
			iconEl.addClass('sage-skill-icon--disabled');
		}

		// 스킬 정보
		const infoEl = itemEl.createDiv({ cls: 'sage-skill-info' });

		// 이름 행 (이름 + 상태 배지)
		const nameRow = infoEl.createDiv({ cls: 'sage-skill-name-row' });
		const nameEl = nameRow.createSpan({
			cls: 'sage-skill-name',
			text: skill.metadata.name || skill.id,
		});

		// 이름 클릭 시 상세 보기 모달
		nameEl.addEventListener('click', () => {
			new SkillDetailModal(this.plugin.app, skill).open();
		});

		// 설명
		if (skill.metadata.description) {
			infoEl.createDiv({
				cls: 'sage-skill-desc',
				text: skill.metadata.description,
			});
		}

		// 컨트롤 버튼들
		const controlsEl = itemEl.createDiv({ cls: 'sage-skill-controls' });

		// 활성화/비활성화 토글 (에러가 없는 경우에만)
		if (!skill.hasError) {
			const toggleLabel = controlsEl.createEl('label', { cls: 'sage-toggle-sm' });
			const toggleInput = toggleLabel.createEl('input', {
				type: 'checkbox',
				cls: 'sage-toggle-sm-checkbox',
			});
			toggleInput.checked = skill.enabled;
			toggleLabel.createSpan({ cls: 'sage-toggle-sm-slider' });
			toggleInput.addEventListener('change', async () => {
				const disabledSkills = this.plugin.settings.disabledSkills || [];
				if (toggleInput.checked) {
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
				// 부모 컨테이너를 찾아 전체 섹션 갱신 (카운트 배지 업데이트)
				const settingsContainer = container.closest('.sage-skills-settings');
				if (settingsContainer instanceof HTMLElement) {
					this.renderSkillsSettings(settingsContainer);
				} else {
					await this.renderSkillsList(container);
				}
			});
		}

		// 편집 버튼
		const editBtn = controlsEl.createEl('button', { cls: 'sage-skill-btn', attr: { 'aria-label': t('settings.skills.edit') } });
		setIcon(editBtn, 'pencil');
		editBtn.addEventListener('click', () => {
			new SkillEditModal(
				this.app,
				this.skillsManager,
				skill,
				async () => {
					const settingsContainer = container.closest('.sage-skills-settings');
					if (settingsContainer instanceof HTMLElement) {
						this.renderSkillsSettings(settingsContainer);
					} else {
						await this.renderSkillsList(container);
					}
				}
			).open();
		});

		// 삭제 버튼
		const deleteBtn = controlsEl.createEl('button', { cls: 'sage-skill-btn sage-skill-btn-delete', attr: { 'aria-label': t('settings.skills.delete') } });
		setIcon(deleteBtn, 'trash-2');
		deleteBtn.addEventListener('click', () => {
			const modal = new SkillDeleteModal(this.app, skill, async () => {
				const skillName = skill.metadata.name || skill.id;
				const result = await this.skillsManager.deleteSkillWithUndo(skill.id);

				if (result.success) {
					if (result.canUndo) {
						// 부모 컨테이너를 찾아 전달
						const settingsContainer = container.closest('.sage-skills-settings');
						if (settingsContainer instanceof HTMLElement) {
							this.showUndoNotice(skill.id, skillName, settingsContainer);
							this.renderSkillsSettings(settingsContainer);
						} else {
							this.showUndoNotice(skill.id, skillName, container);
							await this.renderSkillsList(container);
						}
					} else {
						new Notice(t('settings.skills.deleteSuccess', { name: skillName }));
						const settingsContainer = container.closest('.sage-skills-settings');
						if (settingsContainer instanceof HTMLElement) {
							this.renderSkillsSettings(settingsContainer);
						} else {
							await this.renderSkillsList(container);
						}
					}
				} else {
					new Notice(t('settings.skills.deleteError', { error: result.error || '' }), 5000);
				}
			});
			modal.open();
		});

		// 에러 메시지 표시
		if (skill.hasError && skill.errorMessage) {
			const errorEl = itemEl.createDiv({ cls: 'sage-skill-error-message' });
			errorEl.setText(skill.errorMessage || t('settings.skills.parseError'));
		}
	}

	/**
	 * Undo 버튼이 있는 Notice 표시
	 *
	 * @param skillId 삭제된 Skill ID
	 * @param skillName 삭제된 Skill 이름
	 * @param container Skills 설정 컨테이너 (갱신용)
	 */
	private showUndoNotice(skillId: string, skillName: string, container: HTMLElement): void {
		const notice = new Notice('', 10000);
		const noticeEl = notice.noticeEl;
		noticeEl.empty();
		noticeEl.addClass('sage-skill-undo-notice');

		// 삭제 메시지
		noticeEl.createSpan({
			text: t('settings.skills.deleteSuccess', { name: skillName }),
		});

		// Undo 버튼
		const undoBtn = noticeEl.createEl('button', {
			text: t('settings.skills.undo'),
			cls: 'sage-notice-undo-btn',
		});
		undoBtn.addEventListener('click', async () => {
			const result = await this.skillsManager.undoDelete(skillId);
			if (result.success) {
				new Notice(t('settings.skills.restoreSuccess'));
				// 전체 섹션 갱신
				if (container.classList.contains('sage-skills-settings')) {
					this.renderSkillsSettings(container);
				} else {
					await this.renderSkillsList(container);
				}
			} else {
				new Notice(t('settings.skills.restoreError'), 5000);
			}
			notice.hide();
		});
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
