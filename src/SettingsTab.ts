import { App, PluginSettingTab, Setting } from 'obsidian';
import type NoteSagePlugin from './main';
import { AVAILABLE_MODELS } from './types';
import { t, setLanguage, AVAILABLE_LANGUAGES, SupportedLanguage } from './i18n';

export class NoteSageSettingTab extends PluginSettingTab {
	plugin: NoteSagePlugin;

	constructor(app: App, plugin: NoteSagePlugin) {
		super(app, plugin);
		this.plugin = plugin;
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
				.setPlaceholder('10000')
				.setValue(String(this.plugin.settings.maxContentLength || 10000))
				.onChange(async (value) => {
					const numValue = parseInt(value) || 10000;
					this.plugin.settings.maxContentLength = Math.max(1000, Math.min(100000, numValue));
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

		// ==================== Claude CLI 고급 설정 ====================
		new Setting(containerEl)
			.setName(t('settings.claudeCliAdvanced'))
			.setHeading();

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
}
