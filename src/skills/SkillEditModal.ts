import { App, Modal, Notice, Setting } from 'obsidian';
import type { SkillEntry } from '../types';
import type { SkillsManager } from './SkillsManager';
import { t } from '../i18n';

/**
 * Skill 편집 모달
 *
 * @description
 * 기존 Skill의 내용을 편집합니다.
 * - Name: 읽기 전용
 * - Description: 편집 가능
 * - Content: YAML frontmatter 제외한 전체 본문 편집
 */
export class SkillEditModal extends Modal {
	private skillsManager: SkillsManager;
	private skill: SkillEntry;
	private onSubmit: () => void;
	private descriptionValue = '';
	private contentValue = '';
	private errorEl: HTMLElement | null = null;

	constructor(
		app: App,
		skillsManager: SkillsManager,
		skill: SkillEntry,
		onSubmit: () => void
	) {
		super(app);
		this.skillsManager = skillsManager;
		this.skill = skill;
		this.onSubmit = onSubmit;
	}

	async onOpen(): Promise<void> {
		const { contentEl } = this;

		// 모달 제목
		this.setTitle(t('settings.skills.editTitle'));
		contentEl.createEl('div');

		// 기존 파일 내용 로드
		try {
			const fileContent = await this.skillsManager.readSkillFile(this.skill.id);
			this.descriptionValue = this.skill.metadata.description || '';
			this.contentValue = this.skillsManager.parseSkillBody(fileContent);
		} catch (error) {
			new Notice(t('settings.skills.loadError'));
			this.close();
			return;
		}

		// Name 필드 (읽기 전용)
		new Setting(contentEl)
			.setName(t('settings.skills.nameLabel'))
			.setDesc(t('settings.skills.nameDesc'))
			.addText((text) => {
				text.setValue(this.skill.metadata.name || this.skill.id);
				text.inputEl.disabled = true;
				text.inputEl.style.opacity = '0.7';
			});

		// Description 필드
		new Setting(contentEl)
			.setName(t('settings.skills.descriptionLabel'))
			.setDesc(t('settings.skills.descriptionDesc'))
			.addTextArea((text) => {
				text.setValue(this.descriptionValue);
				text.setPlaceholder(t('settings.skills.descriptionPlaceholder'));
				text.onChange((value) => {
					this.descriptionValue = value;
				});
				text.inputEl.rows = 3;
				text.inputEl.style.width = '100%';
			});

		// Content 필드 (전체 본문)
		new Setting(contentEl)
			.setName(t('settings.skills.contentLabel'))
			.setDesc(t('settings.skills.contentDesc'))
			.addTextArea((text) => {
				text.setValue(this.contentValue);
				text.setPlaceholder(t('settings.skills.contentPlaceholder'));
				text.onChange((value) => {
					this.contentValue = value;
				});
				text.inputEl.rows = 12;
				text.inputEl.style.width = '100%';
				text.inputEl.style.fontFamily = 'monospace';
			});

		// 에러 메시지 영역
		this.errorEl = contentEl.createDiv({
			cls: 'sage-skill-creator-error tw-text-obs-text-error tw-text-obs-small tw-mt-2 tw-hidden',
		});

		// 버튼들
		new Setting(contentEl)
			.addButton((btn) =>
				btn.setButtonText(t('common.cancel')).onClick(() => this.close())
			)
			.addButton((btn) =>
				btn
					.setButtonText(t('common.save'))
					.setCta()
					.onClick(() => this.submit())
			);
	}

	private async submit(): Promise<void> {
		try {
			await this.skillsManager.updateSkillFile(
				this.skill.id,
				this.skill.metadata.name || this.skill.id,
				this.descriptionValue,
				this.contentValue
			);
			new Notice(t('settings.skills.updateSuccess'));
			this.close();
			this.onSubmit();
		} catch (error) {
			if (this.errorEl) {
				this.errorEl.textContent =
					error instanceof Error ? error.message : String(error);
				this.errorEl.removeClass('tw-hidden');
			}
			new Notice(t('settings.skills.updateError'));
		}
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}
}
