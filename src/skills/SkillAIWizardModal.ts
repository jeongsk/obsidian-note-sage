import { App, Modal, Setting, Component, setIcon } from 'obsidian';
import type { SkillEntry, ChatMessage, NoteSageSettings } from '../types';
import type { SkillsManager, FrontmatterValidationResult } from './SkillsManager';
import type NoteSagePlugin from '../main';
import { AgentService } from '../AgentService';
import { t } from '../i18n';

/** AI 재생성 최대 시도 횟수 */
const MAX_RETRY_ATTEMPTS = 3;

/**
 * AI 기반 Skill 생성 마법사 모달
 *
 * @description
 * 자연어 프롬프트를 입력받아 AI가 SKILL.md 내용을 자동 생성합니다.
 * 생성된 내용을 미리보기로 확인한 후 저장할 수 있습니다.
 */
export class SkillAIWizardModal extends Modal {
	private plugin: NoteSagePlugin;
	private skillsManager: SkillsManager;
	private existingSkills: SkillEntry[];
	private onSubmit: (filePath: string) => void;
	private agentService: AgentService;

	// 상태
	private promptValue = '';
	private generatedContent = '';
	private generatedName = '';
	private isGenerating = false;
	private retryCount = 0;
	private lastValidationErrors: string[] = [];

	// UI 요소
	private promptInputEl: HTMLTextAreaElement | null = null;
	private previewContainerEl: HTMLElement | null = null;
	private previewContentEl: HTMLElement | null = null;
	private loadingEl: HTMLElement | null = null;
	private errorEl: HTMLElement | null = null;
	private generateBtnEl: HTMLButtonElement | null = null;
	private saveBtnEl: HTMLButtonElement | null = null;
	private component: Component;
	private abortController: AbortController | null = null;

	constructor(
		app: App,
		plugin: NoteSagePlugin,
		skillsManager: SkillsManager,
		existingSkills: SkillEntry[],
		onSubmit: (filePath: string) => void
	) {
		super(app);
		this.plugin = plugin;
		this.skillsManager = skillsManager;
		this.existingSkills = existingSkills;
		this.onSubmit = onSubmit;
		this.component = new Component();
		// AI Skill 생성을 위한 AgentService 인스턴스 생성
		this.agentService = new AgentService(plugin.settings);
	}

	/**
	 * Vault 경로 가져오기
	 */
	private getVaultPath(): string {
		const adapter = this.app.vault.adapter as { basePath?: string };
		return adapter.basePath || '';
	}

	onOpen(): void {
		const { contentEl } = this;
		this.component.load();

		// 모달 너비 설정
		this.modalEl.addClass('sage-skill-ai-wizard-modal');

		// 모달 제목
		this.setTitle(t('settings.skills.createAIWizard'));
		contentEl.createEl('div');

		// 설명
		contentEl.createEl('p', {
			text: t('settings.skills.aiWizardDesc'),
			cls: 'tw-text-sm tw-text-obs-text-muted tw-mb-4',
		});

		// 프롬프트 입력 필드
		new Setting(contentEl)
			.setName(t('settings.skills.aiPromptLabel'))
			.setDesc(t('settings.skills.aiPromptDesc'))
			.addTextArea((text) => {
				text.setPlaceholder(t('settings.skills.aiPromptPlaceholder')).onChange(
					(value) => {
						this.promptValue = value;
						this.updateGenerateButton();
					}
				);
				text.inputEl.rows = 4;
				text.inputEl.style.width = '100%';
				this.promptInputEl = text.inputEl;

				// 포커스
				setTimeout(() => text.inputEl.focus(), 50);
			});

		// 생성 버튼 + 로딩 인디케이터
		const generateSetting = new Setting(contentEl);

		// 로딩 인디케이터를 Setting의 왼쪽 영역에 추가
		this.loadingEl = generateSetting.nameEl.createDiv({
			cls: 'sage-skill-ai-loading tw-hidden tw-flex tw-items-center tw-gap-2',
		});
		const spinnerEl = this.loadingEl.createSpan({ cls: 'tw-animate-spin' });
		setIcon(spinnerEl, 'loader-2');
		this.loadingEl.createSpan({ text: t('settings.skills.generating') });

		generateSetting.addButton((btn) => {
			btn.setButtonText(t('settings.skills.generateBtn'))
				.setCta()
				.onClick(async () => {
					console.log('[SkillAIWizard] Button clicked!');
					console.log('[SkillAIWizard] promptValue:', this.promptValue);
					await this.generateSkill();
				});
			this.generateBtnEl = btn.buttonEl;
		});

		// 에러 메시지 영역
		this.errorEl = contentEl.createDiv({
			cls: 'sage-skill-ai-error tw-text-red-500 tw-text-sm tw-mt-2 tw-hidden',
		});

		// 미리보기 섹션 (초기에는 숨김)
		this.previewContainerEl = contentEl.createDiv({
			cls: 'sage-skill-ai-preview-container tw-hidden tw-mt-4',
		});

		this.previewContainerEl.createEl('h3', {
			text: t('settings.skills.preview'),
			cls: 'tw-mb-2',
		});

		this.previewContentEl = this.previewContainerEl.createDiv({
			cls: 'sage-skill-ai-preview tw-p-4 tw-rounded tw-bg-obs-bg-secondary tw-overflow-auto tw-max-h-64 tw-font-mono tw-text-sm tw-whitespace-pre-wrap',
		});

		// 버튼들 (취소 / 저장)
		new Setting(contentEl)
			.addButton((btn) =>
				btn.setButtonText(t('common.cancel')).onClick(() => this.close())
			)
			.addButton((btn) => {
				btn.setButtonText(t('common.save'))
					.setCta()
					.onClick(async () => {
						console.log('[SkillAIWizard] Save button clicked!');
						await this.saveSkill();
					});
				this.saveBtnEl = btn.buttonEl;
				// 초기 상태: 비활성화 (생성된 내용이 없음)
				this.saveBtnEl.disabled = true;
			});
	}

	/**
	 * 생성 버튼 상태 업데이트
	 */
	private updateGenerateButton(): void {
		if (this.generateBtnEl) {
			this.generateBtnEl.disabled =
				!this.promptValue.trim() || this.isGenerating;
		}
	}

	/**
	 * 저장 버튼 상태 업데이트
	 * - 생성 중이거나 생성된 내용이 없으면 비활성화
	 */
	private updateSaveButton(): void {
		if (this.saveBtnEl) {
			this.saveBtnEl.disabled = this.isGenerating || !this.generatedContent || !this.generatedName;
		}
	}

	/**
	 * AI를 사용하여 Skill 생성 (검증 및 재시도 로직 포함)
	 */
	private async generateSkill(): Promise<void> {
		console.log('[SkillAIWizard] generateSkill called, promptValue:', this.promptValue);

		if (!this.promptValue.trim() || this.isGenerating) {
			console.log('[SkillAIWizard] Early return - promptValue empty or already generating');
			return;
		}

		this.isGenerating = true;
		this.retryCount = 0;
		this.lastValidationErrors = [];
		this.updateGenerateButton();
		this.updateSaveButton();
		this.showLoading(true);
		this.hideError();
		this.hidePreview();

		// 이전 생성 내용 초기화
		this.generatedContent = '';
		this.generatedName = '';

		// 최초 생성 프롬프트로 시작
		await this.executeGeneration(this.buildGenerationPrompt());
	}

	/**
	 * AI 생성 실행 (재귀적 재시도)
	 * @param prompt AI에게 전달할 프롬프트
	 */
	private async executeGeneration(prompt: string): Promise<void> {
		// AbortController 생성
		this.abortController = new AbortController();

		try {
			const workingDir = this.getVaultPath();

			console.log('[SkillAIWizard] Calling agentService.execute');
			console.log('[SkillAIWizard] workingDirectory:', workingDir);
			console.log('[SkillAIWizard] retryCount:', this.retryCount);

			// 스트리밍 응답 수집
			let fullContent = '';

			await this.agentService.execute({
				prompt,
				workingDirectory: workingDir,
				sessionId: null,
				signal: this.abortController.signal,
				onMessage: (message: ChatMessage) => {
					console.log('[SkillAIWizard] onMessage:', message.type, message);
					// assistant 메시지에서 텍스트 추출
					if (message.type === 'assistant' && message.message?.content) {
						for (const block of message.message.content) {
							if (block.type === 'text') {
								// SDK는 전체 텍스트를 매번 전달하므로 덮어쓰기
								fullContent = block.text;
								console.log('[SkillAIWizard] text block:', block.text.substring(0, 200));
								// 실시간 미리보기 업데이트
								this.updatePreviewContent(fullContent);
							}
						}
					}
				},
				onError: (error: Error) => {
					console.error('[SkillAIWizard] onError:', error);
					this.handleGenerationError(error);
				},
				onComplete: () => {
					console.log('[SkillAIWizard] onComplete');
					console.log('[SkillAIWizard] fullContent:', fullContent);
					this.handleGenerationComplete(fullContent);
				},
			});
		} catch (error) {
			console.error('[SkillAIWizard] catch error:', error);
			this.handleGenerationError(error instanceof Error ? error : new Error(String(error)));
		}
	}

	/**
	 * 생성 완료 후 처리 (검증 및 재시도 로직)
	 * @param fullContent AI가 생성한 전체 콘텐츠
	 */
	private async handleGenerationComplete(fullContent: string): Promise<void> {
		if (!fullContent) {
			this.finishGeneration();
			return;
		}

		// SKILL.md 내용만 추출
		const skillContent = this.extractSkillContent(fullContent);
		console.log('[SkillAIWizard] extracted skillContent:', skillContent);

		// 검증
		const validation = this.validateGeneratedContent(skillContent);
		console.log('[SkillAIWizard] validation result:', validation);

		if (validation.valid) {
			// 검증 성공
			this.generatedContent = skillContent;
			this.generatedName = this.extractNameFromContent(skillContent);
			console.log('[SkillAIWizard] extracted name:', this.generatedName);
			this.updatePreviewContent(skillContent);
			this.showPreview();
			this.finishGeneration();
		} else {
			// 검증 실패 - 재시도 또는 에러 표시
			this.lastValidationErrors = validation.errors;
			this.retryCount++;

			if (this.retryCount < MAX_RETRY_ATTEMPTS) {
				// 재시도: 수정 프롬프트로 다시 생성
				console.log('[SkillAIWizard] Retrying generation, attempt:', this.retryCount);
				this.updateLoadingMessage(
					t('settings.skills.retrying')
						.replace('{attempt}', String(this.retryCount))
						.replace('{max}', String(MAX_RETRY_ATTEMPTS))
				);
				const correctionPrompt = this.buildCorrectionPrompt(skillContent, validation.errors);
				await this.executeGeneration(correctionPrompt);
			} else {
				// 최대 재시도 초과 - 에러 표시 및 수동 수정 안내
				console.log('[SkillAIWizard] Max retry attempts reached');
				const errorMessage = t('settings.skills.validationFailed')
					.replace('{max}', String(MAX_RETRY_ATTEMPTS));
				this.showError(errorMessage);

				// 미리보기에 원본 콘텐츠 표시 (사용자가 수동으로 확인 가능)
				this.generatedContent = skillContent;
				this.generatedName = this.extractNameFromContent(skillContent);
				this.updatePreviewContent(skillContent);
				this.showPreview();
				this.finishGeneration();
			}
		}
	}

	/**
	 * 생성 종료 처리
	 */
	private finishGeneration(): void {
		this.isGenerating = false;
		this.showLoading(false);
		this.updateGenerateButton();
		this.updateSaveButton();
	}

	/**
	 * 생성 에러 처리
	 */
	private handleGenerationError(error: Error): void {
		this.showError(error.message);
		this.finishGeneration();
	}

	/**
	 * 로딩 메시지 업데이트
	 */
	private updateLoadingMessage(message: string): void {
		if (this.loadingEl) {
			const textSpan = this.loadingEl.querySelector('span:last-child');
			if (textSpan) {
				textSpan.textContent = message;
			}
		}
	}

	/**
	 * 생성된 콘텐츠 검증
	 * @param content AI가 생성한 콘텐츠
	 * @returns 검증 결과
	 */
	private validateGeneratedContent(content: string): FrontmatterValidationResult {
		return this.skillsManager.validateFrontmatter(content);
	}

	/**
	 * AI에게 수정 요청 프롬프트 구성
	 * @param originalContent 원본 생성 콘텐츠
	 * @param errors 검증 에러 목록
	 */
	private buildCorrectionPrompt(originalContent: string, errors: string[]): string {
		return `You previously generated a SKILL.md file, but it has validation errors that need to be fixed.

ORIGINAL CONTENT:
${originalContent}

VALIDATION ERRORS:
${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}

Please fix these errors and regenerate the SKILL.md content.

REQUIREMENTS:
1. The file MUST start with valid YAML frontmatter (--- at the beginning and end)
2. The "name" field is REQUIRED and must be in kebab-case (lowercase letters, numbers, and hyphens only)
3. The "description" field is REQUIRED and must be at least 20 characters
4. Output ONLY the corrected SKILL.md content, no explanations

Example of correct format:
---
name: my-skill-name
description: A clear description of when Claude should use this skill (at least 20 characters)
---

# Skill Title

## Instructions
...`;
	}

	/**
	 * AI에게 전달할 프롬프트 구성
	 */
	private buildGenerationPrompt(): string {
		return `You are a SKILL.md file generator for Claude Agent SDK.
Generate a SKILL.md file based on the user's description.

IMPORTANT: Output ONLY the SKILL.md content. Do not include any explanations, markdown code blocks, or additional text.

The file must follow this EXACT format:

<format>
---
name: skill-name-in-kebab-case
description: One sentence describing when Claude should use this skill
---

# Skill Title

## Instructions

[Detailed instructions for the AI]

## Examples

[Usage examples]
</format>

## Requirements:
1. Use kebab-case for the name field (e.g., "code-reviewer", "table-formatter")
2. Description should be concise but informative (used by Claude to decide when to invoke this skill)
3. Instructions should be clear, actionable, and detailed
4. Include practical examples showing input/output or usage scenarios
5. Write in the same language as the user's request

User's request: ${this.promptValue}`;
	}

	/**
	 * 생성된 내용에서 SKILL.md 내용만 추출
	 */
	private extractSkillContent(content: string): string {
		console.log('[SkillAIWizard] extractSkillContent input:', content.substring(0, 500));
		
		// 마크다운 코드 블록에서 추출 (```markdown 또는 ```md 또는 ``` 만)
		const codeBlockMatch = content.match(/```(?:markdown|md|yaml)?\s*\n([\s\S]*?)\n```/);
		if (codeBlockMatch) {
			console.log('[SkillAIWizard] Found code block');
			return codeBlockMatch[1].trim();
		}

		// YAML frontmatter로 시작하는 부분 찾기 (---로 시작하고 ---로 끝나는 부분 + 나머지 내용)
		const frontmatterMatch = content.match(/(---[\s\S]*?---[\s\S]*)/);
		if (frontmatterMatch) {
			console.log('[SkillAIWizard] Found frontmatter');
			return frontmatterMatch[1].trim();
		}

		console.log('[SkillAIWizard] No pattern matched, returning raw content');
		return content.trim();
	}

	/**
	 * 생성된 내용에서 name 필드 추출
	 */
	private extractNameFromContent(content: string): string {
		console.log('[SkillAIWizard] extractNameFromContent input:', content.substring(0, 300));
		
		// YAML frontmatter에서 name 추출 (여러 패턴 시도)
		// 패턴 1: name: value
		let match = content.match(/name:\s*([^\n]+)/);
		if (match) {
			const name = match[1].trim().replace(/['"]/g, '');
			console.log('[SkillAIWizard] Found name:', name);
			return name;
		}
		
		// 폴백: 타임스탬프로 이름 생성
		const fallbackName = `ai-skill-${Date.now()}`;
		console.log('[SkillAIWizard] Using fallback name:', fallbackName);
		return fallbackName;
	}

	/**
	 * 미리보기 내용 업데이트
	 */
	private updatePreviewContent(content: string): void {
		if (!this.previewContentEl) return;
		this.previewContentEl.textContent = content;
		this.showPreview();
	}

	/**
	 * 미리보기 표시
	 */
	private showPreview(): void {
		this.previewContainerEl?.removeClass('tw-hidden');
	}

	/**
	 * 미리보기 숨김
	 */
	private hidePreview(): void {
		this.previewContainerEl?.addClass('tw-hidden');
		if (this.previewContentEl) {
			this.previewContentEl.textContent = '';
		}
	}

	/**
	 * 로딩 상태 표시/숨김
	 */
	private showLoading(show: boolean): void {
		if (show) {
			this.loadingEl?.removeClass('tw-hidden');
		} else {
			this.loadingEl?.addClass('tw-hidden');
		}
	}

	/**
	 * 에러 메시지 표시
	 */
	private showError(message: string): void {
		if (this.errorEl) {
			this.errorEl.textContent = message;
			this.errorEl.removeClass('tw-hidden');
		}
	}

	/**
	 * 에러 메시지 숨김
	 */
	private hideError(): void {
		this.errorEl?.addClass('tw-hidden');
	}

	/**
	 * 생성된 Skill 저장 (저장 전 최종 검증 포함)
	 */
	private async saveSkill(): Promise<void> {
		if (!this.generatedContent || !this.generatedName) {
			console.log('[SkillAIWizard] saveSkill - missing content or name');
			console.log('[SkillAIWizard] generatedContent:', !!this.generatedContent);
			console.log('[SkillAIWizard] generatedName:', this.generatedName);
			this.showError(t('settings.skills.noContentError'));
			return;
		}

		try {
			console.log('[SkillAIWizard] Saving skill:', this.generatedName);

			// 저장 전 최종 frontmatter 검증
			const frontmatterValidation = this.skillsManager.validateFrontmatter(this.generatedContent);
			if (!frontmatterValidation.valid) {
				const errorMessage = t('settings.skills.validationErrors')
					.replace('{errors}', frontmatterValidation.errors.join('\n- '));
				this.showError(errorMessage);
				return;
			}

			// 이름 유효성 검사
			const nameValidation = this.skillsManager.validateSkillName(this.generatedName);
			if (!nameValidation.valid) {
				this.showError(nameValidation.error || t('settings.skills.invalidName'));
				return;
			}

			// 중복 검사
			const isDuplicate = await this.skillsManager.checkDuplicate(
				this.generatedName,
				this.existingSkills
			);
			if (isDuplicate) {
				this.showError(t('settings.skills.duplicateName'));
				return;
			}

			// Skill 파일 생성
			const filePath = await this.skillsManager.createSkillFromContent(
				this.generatedName,
				this.generatedContent
			);

			this.close();
			this.onSubmit(filePath);
		} catch (error) {
			this.showError(error instanceof Error ? error.message : String(error));
		}
	}

	onClose(): void {
		// 생성 중이면 취소
		if (this.abortController) {
			this.abortController.abort();
			this.abortController = null;
		}

		const { contentEl } = this;
		contentEl.empty();
		this.component.unload();
	}
}
