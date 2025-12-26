import { App, PluginSettingTab, Setting } from 'obsidian';
import type NoteSagePlugin from './main';
import { AVAILABLE_MODELS } from './types';

export class NoteSageSettingTab extends PluginSettingTab {
	plugin: NoteSagePlugin;

	constructor(app: App, plugin: NoteSagePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Note Sage Settings' });

		// API Key setting
		new Setting(containerEl)
			.setName('Anthropic API Key')
			.setDesc('Your Anthropic API key for Claude. Get one at console.anthropic.com')
			.addText(text => text
				.setPlaceholder('sk-ant-...')
				.setValue(this.plugin.settings.apiKey || '')
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		// Model selection
		new Setting(containerEl)
			.setName('Model')
			.setDesc('Select the Claude model to use')
			.addDropdown(dropdown => {
				AVAILABLE_MODELS.forEach(model => {
					dropdown.addOption(model.value, model.label);
				});
				dropdown
					.setValue(this.plugin.settings.model || 'claude-sonnet-4-20250514')
					.onChange(async (value) => {
						this.plugin.settings.model = value;
						await this.plugin.saveSettings();
						this.updateViews();
					});
			});

		// ==================== Claude CLI 설정 ====================
		containerEl.createEl('h3', { text: 'Claude CLI' });

		new Setting(containerEl)
			.setName('Claude CLI path')
			.setDesc('Path to the claude executable. Leave empty to auto-detect from common installation paths.')
			.addText(text => text
				.setPlaceholder('Auto-detect (leave empty)')
				.setValue(this.plugin.settings.claudeExecutablePath || '')
				.onChange(async (value) => {
					this.plugin.settings.claudeExecutablePath = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		const cliInfoEl = containerEl.createEl('div', { cls: 'setting-item-description' });
		cliInfoEl.createEl('small', {
			text: 'Common paths: ~/.local/bin/claude (macOS/Linux), %USERPROFILE%\\.local\\bin\\claude.exe (Windows)'
		});
		cliInfoEl.style.marginTop = '-10px';
		cliInfoEl.style.marginBottom = '10px';

		// Debug context
		new Setting(containerEl)
			.setName('Debug mode')
			.setDesc('Enable debug logging for troubleshooting (logs to browser console)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.debugContext || false)
				.onChange(async (value) => {
					this.plugin.settings.debugContext = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		// ==================== Phase 1-A: 파일 컨텍스트 설정 ====================
		containerEl.createEl('h3', { text: 'File Context' });

		new Setting(containerEl)
			.setName('Include file content')
			.setDesc('Include the content of the current file in the context sent to Claude')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeFileContent ?? true)
				.onChange(async (value) => {
					this.plugin.settings.includeFileContent = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		new Setting(containerEl)
			.setName('Prefer selected text')
			.setDesc('When text is selected, include only the selection instead of the entire file')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeSelection ?? true)
				.onChange(async (value) => {
					this.plugin.settings.includeSelection = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		new Setting(containerEl)
			.setName('Max content length')
			.setDesc('Maximum number of characters to include from the file (to save tokens)')
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
		containerEl.createEl('h3', { text: 'System Prompt' });

		new Setting(containerEl)
			.setName('Custom system prompt')
			.setDesc('Custom instructions for Claude. Leave empty to use defaults.')
			.addTextArea(text => {
				text
					.setPlaceholder('You are a helpful assistant specialized in...')
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
		containerEl.createEl('h3', { text: 'Conversation Saving' });

		new Setting(containerEl)
			.setName('Auto-save conversations')
			.setDesc('Automatically save conversations to your vault as markdown files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoSaveConversations ?? false)
				.onChange(async (value) => {
					this.plugin.settings.autoSaveConversations = value;
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		new Setting(containerEl)
			.setName('Save path')
			.setDesc('Folder path in your vault where conversations will be saved')
			.addText(text => text
				.setPlaceholder('AI-Chats')
				.setValue(this.plugin.settings.conversationSavePath || 'AI-Chats')
				.onChange(async (value) => {
					this.plugin.settings.conversationSavePath = value || 'AI-Chats';
					await this.plugin.saveSettings();
					this.updateViews();
				}));

		// Info section
		containerEl.createEl('h3', { text: 'About' });
		const infoEl = containerEl.createEl('div', { cls: 'sage-settings-info' });
		infoEl.createEl('p', {
			text: 'This plugin uses the Claude Agent SDK to provide AI-powered assistance directly within Obsidian.'
		});
		infoEl.createEl('p', {
			text: 'The agent can read files, execute commands, and help with various tasks in your vault.'
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
