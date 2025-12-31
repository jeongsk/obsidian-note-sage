import { App, Modal } from 'obsidian';
import { t } from '../i18n';
import type { SkillEntry } from '../types';

/**
 * Skill 삭제 확인 모달
 *
 * @description
 * Obsidian 스타일의 삭제 확인 대화상자입니다.
 * 삭제 전 사용자에게 확인을 요청하고, Undo 가능 여부를 안내합니다.
 */
export class SkillDeleteModal extends Modal {
	private skill: SkillEntry;
	private onConfirm: () => void;
	private resolved = false;

	constructor(app: App, skill: SkillEntry, onConfirm: () => void) {
		super(app);
		this.skill = skill;
		this.onConfirm = onConfirm;
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('sage-skill-delete-modal');

		// 제목
		contentEl.createEl('h3', {
			text: t('settings.skills.deleteTitle'),
			cls: 'sage-modal-title',
		});

		// 경고 메시지 (안전한 DOM 메서드 사용)
		const messageEl = contentEl.createEl('p', {
			cls: 'sage-modal-message',
		});
		const skillName = this.skill.metadata.name || this.skill.id;
		const confirmMessage = t('settings.skills.deleteConfirmMessage', { name: skillName });
		// 메시지에서 {name} 부분을 strong 요소로 대체
		const parts = confirmMessage.split(skillName);
		if (parts.length > 1) {
			messageEl.appendText(parts[0]);
			messageEl.createEl('strong', { text: skillName });
			messageEl.appendText(parts[1]);
		} else {
			messageEl.appendText(confirmMessage);
		}

		// Undo 안내
		contentEl.createEl('p', {
			text: t('settings.skills.deleteUndoHint'),
			cls: 'sage-modal-hint',
		});

		// 버튼 컨테이너
		const buttonContainer = contentEl.createDiv({
			cls: 'modal-button-container',
		});

		// 취소 버튼
		const cancelBtn = buttonContainer.createEl('button', {
			text: t('common.cancel'),
		});
		cancelBtn.addEventListener('click', () => {
			this.close();
		});

		// 삭제 버튼 (위험한 동작이므로 mod-warning 사용)
		const deleteBtn = buttonContainer.createEl('button', {
			text: t('common.delete'),
			cls: 'mod-warning',
		});
		deleteBtn.addEventListener('click', () => {
			this.resolve();
		});
	}

	/**
	 * 확인 처리 (중복 호출 방지)
	 */
	private resolve(): void {
		if (this.resolved) return;
		this.resolved = true;
		this.onConfirm();
		this.close();
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
