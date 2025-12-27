import { Plugin, WorkspaceLeaf, MarkdownView } from 'obsidian';
import { NoteSageView, VIEW_TYPE_NOTE_SAGE } from './ChatView';
import { NoteSageSettingTab } from './SettingsTab';
import { NoteSageSettings, DEFAULT_SETTINGS, DEFAULT_QUICK_ACTIONS } from './types';
import { t, setLanguage } from './i18n';

// 빠른 프롬프트 타입
interface QuickPrompt {
	id: string;
	nameKey: string;
	promptKey: string;
	icon?: string;
}

export default class NoteSagePlugin extends Plugin {
	settings: NoteSageSettings;
	isAgentExecuting: boolean = false;

	setAgentExecuting(value: boolean): void {
		this.isAgentExecuting = value;
	}

	// Phase 1-D: 빠른 프롬프트 정의 (i18n 키 사용)
	private quickPrompts: QuickPrompt[] = [
		{ id: 'summarize', nameKey: 'commands.summarizeDocument', promptKey: 'prompts.summarize', icon: 'file-text' },
		{ id: 'explain', nameKey: 'commands.explainSelection', promptKey: 'prompts.explain', icon: 'help-circle' },
		{ id: 'improve', nameKey: 'commands.improveWriting', promptKey: 'prompts.improve', icon: 'edit' },
		{ id: 'translate-ko', nameKey: 'commands.translateToKorean', promptKey: 'prompts.translateKo', icon: 'languages' },
		{ id: 'translate-en', nameKey: 'commands.translateToEnglish', promptKey: 'prompts.translateEn', icon: 'languages' },
		{ id: 'code-review', nameKey: 'commands.reviewCode', promptKey: 'prompts.codeReview', icon: 'code' },
	];

	async onload() {
		await this.loadSettings();

		// Initialize language from settings
		if (this.settings.language) {
			setLanguage(this.settings.language);
		}

		// 파일 변경 감지: Agent SDK가 fs로 직접 수정한 파일을 에디터에 반영
		// 에이전트 실행 중일 때만 rebuildView() 호출 (사용자 직접 수정 시에는 무시)
		this.registerEvent(
			this.app.vault.on('modify', (file) => {
				if (!this.isAgentExecuting) return;

				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (activeView && activeView.file?.path === file.path) {
					// rebuildView()는 내부 API이므로 타입 단언 사용
					(activeView.leaf as unknown as { rebuildView: () => void }).rebuildView();
				}
			})
		);

		// Register the custom view
		this.registerView(
			VIEW_TYPE_NOTE_SAGE,
			(leaf) => new NoteSageView(leaf, this)
		);

		// Open the view in the right sidebar by default
		if (this.app.workspace.layoutReady) {
			await this.activateView();
		} else {
			this.app.workspace.onLayoutReady(async () => {
				await this.activateView();
			});
		}

		// Phase 1-D: 명령어 팔레트 통합
		this.registerCommands();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new NoteSageSettingTab(this.app, this));
	}

	// Phase 1-D: 명령어 등록
	private registerCommands(): void {
		// 기본 명령어
		this.addCommand({
			id: 'open-note-sage',
			name: t('commands.openNoteSage'),
			callback: () => this.activateView()
		});

		this.addCommand({
			id: 'new-chat',
			name: t('commands.startNewChat'),
			callback: () => this.startNewChat()
		});

		this.addCommand({
			id: 'save-conversation',
			name: t('commands.saveConversation'),
			callback: () => this.saveCurrentConversation()
		});

		// 빠른 프롬프트 명령어 등록
		for (const prompt of this.quickPrompts) {
			this.addCommand({
				id: `quick-${prompt.id}`,
				name: t(prompt.nameKey),
				editorCallback: (editor) => {
					const selection = editor.getSelection();
					this.sendQuickPrompt(t(prompt.promptKey), selection);
				}
			});
		}
	}

	// Phase 1-D: 빠른 프롬프트 전송
	private async sendQuickPrompt(prompt: string, selection?: string): Promise<void> {
		await this.activateView();

		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_NOTE_SAGE);
		if (leaves.length > 0) {
			const view = leaves[0].view as NoteSageView;
			const fullPrompt = selection
				? `${prompt}\n\nText:\n${selection}`
				: prompt;
			view.sendMessage(fullPrompt);
		}
	}

	// Phase 1-D: 새 채팅 시작
	private startNewChat(): void {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_NOTE_SAGE);
		if (leaves.length > 0) {
			const view = leaves[0].view as NoteSageView;
			view.startNewChatFromCommand();
		}
	}

	// Phase 2-B: 현재 대화 저장
	private saveCurrentConversation(): void {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_NOTE_SAGE);
		if (leaves.length > 0) {
			const view = leaves[0].view as NoteSageView;
			view.saveConversation();
		}
	}

	onunload() {
		// Detach leaves with our view type when unloading
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_NOTE_SAGE);
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_NOTE_SAGE);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use it
			leaf = leaves[0];
		} else {
			// Our view doesn't exist, create a new leaf in the right sidebar
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({ type: VIEW_TYPE_NOTE_SAGE, active: true });
			}
		}

		// Reveal the leaf in case it's hidden
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		// 마이그레이션: 기존 모델을 4.5 시리즈로 업데이트
		const oldModels = [
			'claude-sonnet-4-20250514',
			'claude-opus-4-5-20251101',
			'claude-sonnet-4-5-20250929',
			'claude-haiku-4-5-20251001'
		];
		if (this.settings.model && oldModels.includes(this.settings.model)) {
			// 날짜가 붙은 모델명을 짧은 형식으로 변환
			if (this.settings.model.includes('opus')) {
				this.settings.model = 'claude-opus-4-5';
			} else if (this.settings.model.includes('haiku')) {
				this.settings.model = 'claude-haiku-4-5';
			} else {
				this.settings.model = 'claude-sonnet-4-5';
			}
			await this.saveSettings();
		}

		// 마이그레이션: quickActions가 없는 기존 사용자를 위해 기본값 설정
		if (!this.settings.quickActions) {
			this.settings.quickActions = [...DEFAULT_QUICK_ACTIONS];
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
