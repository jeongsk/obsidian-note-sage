import { App, Modal, Setting } from 'obsidian';
import type { SkillEntry } from '../types';
import type { SkillsManager } from './SkillsManager';
import { t } from '../i18n';

/**
 * Skill 템플릿 생성 모달
 *
 * @description
 * 이름과 설명을 입력받아 SKILL.md 파일을 생성합니다.
 * 실시간 미리보기 기능을 제공합니다.
 */
export class SkillTemplateModal extends Modal {
	private skillsManager: SkillsManager;
	private existingSkills: SkillEntry[];
	private onSubmit: (filePath: string) => void;
	private nameValue = '';
	private descriptionValue = '';
	private instructionsValue = '';
	private examplesValue = '';
	private previewEl: HTMLElement | null = null;
	private errorEl: HTMLElement | null = null;
	private nameInputEl: HTMLInputElement | null = null;

	constructor(
		app: App,
		skillsManager: SkillsManager,
		existingSkills: SkillEntry[],
		onSubmit: (filePath: string) => void
	) {
		super(app);
		this.skillsManager = skillsManager;
		this.existingSkills = existingSkills;
		this.onSubmit = onSubmit;
	}

	onOpen(): void {
		const { contentEl } = this;

		// 모달 제목
		this.setTitle(t('settings.skills.createTemplate'));
		contentEl.createEl('div');

		// 이름 입력 필드
		new Setting(contentEl)
			.setName(t('settings.skills.nameLabel'))
			.setDesc(t('settings.skills.nameDesc'))
			.addText((text) => {
				this.nameInputEl = text.inputEl;
				text.setPlaceholder('my-skill').onChange((value) => {
					this.nameValue = value;
					this.validateNameFormat();
					this.updatePreview();
				});

				// 입력 박스 아래에 에러 메시지 영역 생성
				const controlEl = text.inputEl.parentElement;
				if (controlEl) {
					controlEl.style.flexWrap = 'wrap';
				this.errorEl = controlEl.createDiv({
					cls: 'sage-skill-name-error tw-text-obs-text-error tw-text-obs-smallest tw-mt-1 tw-hidden tw-w-full',
				});
				}

				// 포커스
				setTimeout(() => text.inputEl.focus(), 50);
			});

		// 설명 입력 필드
		new Setting(contentEl)
			.setName(t('settings.skills.descriptionLabel'))
			.setDesc(t('settings.skills.descriptionDesc'))
			.addTextArea((text) => {
				text.setPlaceholder(t('settings.skills.descriptionPlaceholder')).onChange(
					(value) => {
						this.descriptionValue = value;
						this.updatePreview();
					}
				);
				text.inputEl.rows = 3;
				text.inputEl.style.width = '100%';
			});

		// Instructions 입력 필드
		new Setting(contentEl)
			.setName(t('settings.skills.instructionsLabel'))
			.setDesc(t('settings.skills.instructionsDesc'))
			.addTextArea((text) => {
				text.setPlaceholder(t('settings.skills.instructionsPlaceholder')).onChange(
					(value) => {
						this.instructionsValue = value;
						this.updatePreview();
					}
				);
				text.inputEl.rows = 4;
				text.inputEl.style.width = '100%';
			});

		// Examples 입력 필드
		new Setting(contentEl)
			.setName(t('settings.skills.examplesLabel'))
			.setDesc(t('settings.skills.examplesDesc'))
			.addTextArea((text) => {
				text.setPlaceholder(t('settings.skills.examplesPlaceholder')).onChange(
					(value) => {
						this.examplesValue = value;
						this.updatePreview();
					}
				);
				text.inputEl.rows = 4;
				text.inputEl.style.width = '100%';
			});

		// 미리보기 섹션
		contentEl.createEl('h3', {
			text: t('settings.skills.preview'),
			cls: 'tw-mt-4',
		});

		this.previewEl = contentEl.createDiv({
			cls: 'sage-skill-creator-preview tw-p-4 tw-rounded tw-bg-obs-bg-secondary tw-font-obs-mono tw-text-obs-small tw-whitespace-pre-wrap tw-overflow-auto tw-max-h-48',
		});

		this.updatePreview();

		// 버튼들
		new Setting(contentEl)
			.addButton((btn) =>
				btn.setButtonText(t('common.cancel')).onClick(() => this.close())
			)
			.addButton((btn) =>
				btn
					.setButtonText(t('common.create'))
					.setCta()
					.onClick(() => this.submit())
			);
	}

	/**
	 * 이름 형식 검증 (동기) - 실시간 입력 시 호출
	 */
	private validateNameFormat(): boolean {
		if (!this.errorEl) return false;

		const validation = this.skillsManager.validateSkillName(this.nameValue);
		if (!validation.valid) {
			this.errorEl.textContent = validation.error || '';
			this.errorEl.removeClass('tw-hidden');
			this.nameInputEl?.addClass('sage-input-error');
			return false;
		}

		this.errorEl.addClass('tw-hidden');
		this.nameInputEl?.removeClass('sage-input-error');
		return true;
	}

	/**
	 * 전체 검증 (비동기) - 제출 시 호출
	 */
	private async validateName(): Promise<boolean> {
		if (!this.errorEl) return false;

		// 형식 검사
		if (!this.validateNameFormat()) {
			return false;
		}

		// 중복 검사 (파일 시스템 확인)
		const isDuplicate = await this.skillsManager.checkDuplicate(this.nameValue, this.existingSkills);
		if (isDuplicate) {
			this.errorEl.textContent = t('settings.skills.duplicateName');
			this.errorEl.removeClass('tw-hidden');
			return false;
		}

		this.errorEl.addClass('tw-hidden');
		return true;
	}

	private updatePreview(): void {
		if (!this.previewEl) return;

		const name = this.nameValue || 'skill-name';
		const description = this.descriptionValue || 'Add your Skill description here';
		const instructions = this.instructionsValue || '<!-- Add your instructions here -->';
		const examples = this.examplesValue || '<!-- Add examples here -->';

		const preview = `---
name: ${name}
description: ${description}
---

# ${name}

## Instructions

${instructions}

## Examples

${examples}`;

		this.previewEl.textContent = preview;
	}

	private async submit(): Promise<void> {
		if (!(await this.validateName())) {
			return;
		}

		try {
			const filePath = await this.skillsManager.createSkillFromTemplate(
				this.nameValue,
				this.descriptionValue,
				this.instructionsValue,
				this.examplesValue
			);
			this.close();
			this.onSubmit(filePath);
		} catch (error) {
			if (this.errorEl) {
				this.errorEl.textContent =
					error instanceof Error ? error.message : String(error);
				this.errorEl.removeClass('tw-hidden');
			}
		}
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}
}
