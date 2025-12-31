import { App, Modal } from 'obsidian';
import type { SkillEntry } from '../types';
import { t } from '../i18n';

/**
 * Skill 상세 보기 모달
 *
 * @description
 * SKILL.md 파일의 전체 내용을 마크다운으로 렌더링하여 표시합니다.
 */
export class SkillDetailModal extends Modal {
	private skill: SkillEntry;

	constructor(app: App, skill: SkillEntry) {
		super(app);
		this.skill = skill;
	}

	async onOpen(): Promise<void> {
		const { contentEl } = this;

		// 모달 제목
		this.setTitle(this.skill.metadata.name || this.skill.id);
		contentEl.createEl('div');

		// 경로 표시
		contentEl.createEl('p', {
			text: this.skill.path,
			cls: 'sage-skill-detail-path tw-text-sm tw-text-obs-text-muted tw-mb-4',
		});

		// 에러 상태인 경우 에러 메시지 표시
		if (this.skill.hasError) {
			const errorEl = contentEl.createDiv({
				cls: 'sage-skill-detail-error tw-p-4 tw-rounded tw-bg-red-100 tw-text-red-700 tw-mb-4',
			});
			errorEl.createEl('strong', { text: t('settings.skills.parseError') });
			if (this.skill.errorMessage) {
				errorEl.createEl('p', { text: this.skill.errorMessage });
			}
		}

		// SKILL.md 파일 내용 로드 및 렌더링
		const contentContainer = contentEl.createDiv({
			cls: 'sage-skill-detail-content tw-mt-4',
		});

		try {
			// .claude 폴더는 숨김 폴더라서 vault가 인덱싱하지 않으므로
			// adapter를 직접 사용하여 파일을 읽습니다
			const exists = await this.app.vault.adapter.exists(this.skill.path);
			if (exists) {
				const content = await this.app.vault.adapter.read(this.skill.path);
				// 원문 그대로 표시 (코드 블록 스타일)
				const preEl = contentContainer.createEl('pre', {
					cls: 'sage-skill-detail-pre tw-bg-obs-bg-secondary tw-p-4 tw-rounded tw-overflow-auto tw-text-sm',
				});
				preEl.createEl('code', {
					text: content,
					cls: 'tw-whitespace-pre-wrap tw-break-words',
				});
			} else {
				contentContainer.createEl('p', {
					text: t('settings.skills.fileNotFound'),
					cls: 'tw-text-obs-text-muted',
				});
			}
		} catch (error) {
			contentContainer.createEl('p', {
				text: t('settings.skills.loadError'),
				cls: 'tw-text-red-500',
			});
		}

		// 닫기 버튼
		const buttonContainer = contentEl.createDiv({
			cls: 'sage-skill-detail-buttons tw-flex tw-justify-end tw-mt-4',
		});

		const closeBtn = buttonContainer.createEl('button', {
			text: t('common.close'),
			cls: 'mod-cta',
		});
		closeBtn.addEventListener('click', () => this.close());
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}
}
