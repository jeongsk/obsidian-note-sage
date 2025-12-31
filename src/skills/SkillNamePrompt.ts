import { App, Modal, Setting } from 'obsidian';
import type { SkillEntry } from '../types';
import type { SkillsManager } from './SkillsManager';
import { t } from '../i18n';

/**
 * Skill 이름 입력 프롬프트
 *
 * @description
 * 빠른 생성을 위한 간단한 이름 입력 모달입니다.
 * 기본 SKILL.md 템플릿을 생성합니다.
 */
export class SkillNamePrompt extends Modal {
	private skillsManager: SkillsManager;
	private existingSkills: SkillEntry[];
	private onSubmit: (filePath: string) => void;
	private nameValue = '';
	private errorEl: HTMLElement | null = null;

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
		contentEl.createEl('h2', { text: t('settings.skills.createTemplate') });

		// 이름 입력 필드
		new Setting(contentEl)
			.setName(t('settings.skills.nameLabel'))
			.setDesc(t('settings.skills.nameDesc'))
			.addText((text) => {
				text
					.setPlaceholder('my-skill')
					.onChange((value) => {
						this.nameValue = value;
						this.validateNameFormat();
					});

				// Enter 키로 제출
				text.inputEl.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						this.submit();
					}
				});

				// 포커스
				setTimeout(() => text.inputEl.focus(), 50);
			});

		// 에러 메시지 영역
		this.errorEl = contentEl.createDiv({
			cls: 'sage-skill-name-error tw-text-red-500 tw-text-sm tw-mt-2 tw-hidden',
		});

		// 버튼들
		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText(t('common.cancel'))
					.onClick(() => this.close())
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
			return false;
		}

		this.errorEl.addClass('tw-hidden');
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

	private async submit(): Promise<void> {
		if (!(await this.validateName())) {
			return;
		}

		try {
			const filePath = await this.skillsManager.createSkillFromTemplate(
				this.nameValue
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
