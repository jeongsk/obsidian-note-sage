/**
 * MentionInput
 *
 * 입력창에서 멘션을 감지하고 관리하는 컴포넌트입니다.
 * 자동완성 팝업과 연동하여 파일/폴더 선택을 관리합니다.
 *
 * @module mention/MentionInput
 */

import { setIcon } from 'obsidian';
import type { Mention, MentionInputState, AutocompleteSuggestion } from './types';
import { DEFAULT_MENTION_INPUT_STATE, MENTION_CONSTANTS } from './types';
import type { MentionService } from './MentionService';
import type { AutocompletePopup, PopupPosition } from './AutocompletePopup';

/**
 * MentionInput 이벤트 콜백 타입
 */
export interface MentionInputCallbacks {
	/** 멘션 추가 시 호출 */
	onMentionAdd: (mention: Mention) => void;
	/** 멘션 제거 시 호출 */
	onMentionRemove: (mentionId: string) => void;
	/** 메시지 전송 요청 시 호출 (Enter 키) */
	onSubmit: (text: string, mentions: Mention[]) => void;
	/** 대용량 파일 경고 시 호출 */
	onLargeFileWarning: (path: string, size: number) => Promise<boolean>;
}

/**
 * MentionInput 생성 옵션
 */
export interface MentionInputOptions {
	/** 입력 textarea 요소 */
	inputEl: HTMLTextAreaElement;
	/** 멘션 칩을 표시할 컨테이너 */
	mentionChipsContainer: HTMLElement;
	/** 콜백 함수들 */
	callbacks: MentionInputCallbacks;
	/** 멘션 서비스 */
	mentionService: MentionService;
	/** 자동완성 팝업 */
	autocompletePopup: AutocompletePopup;
}

/**
 * MentionInput 클래스
 *
 * @description
 * textarea 입력창에서 @ 멘션을 감지하고 처리합니다.
 * 자동완성 팝업과 연동하여 파일/폴더 선택을 관리합니다.
 */
export class MentionInput {
	private inputEl: HTMLTextAreaElement;
	private mentionChipsContainer: HTMLElement;
	private callbacks: MentionInputCallbacks;
	private mentionService: MentionService;
	private autocompletePopup: AutocompletePopup;

	private mentions: Mention[] = [];
	private state: MentionInputState = { ...DEFAULT_MENTION_INPUT_STATE };
	private isComposing = false;
	private debounceTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(options: MentionInputOptions) {
		this.inputEl = options.inputEl;
		this.mentionChipsContainer = options.mentionChipsContainer;
		this.callbacks = options.callbacks;
		this.mentionService = options.mentionService;
		this.autocompletePopup = options.autocompletePopup;

		this.setupEventListeners();
	}

	/**
	 * 이벤트 리스너 설정
	 */
	private setupEventListeners(): void {
		// 입력 이벤트
		this.inputEl.addEventListener('input', this.handleInput.bind(this));

		// 키보드 이벤트
		this.inputEl.addEventListener('keydown', this.handleKeyDown.bind(this));

		// IME 조합 이벤트 (한글 입력)
		this.inputEl.addEventListener(
			'compositionstart',
			this.handleCompositionStart.bind(this)
		);
		this.inputEl.addEventListener(
			'compositionend',
			this.handleCompositionEnd.bind(this)
		);

		// 포커스 이벤트
		this.inputEl.addEventListener('blur', this.handleBlur.bind(this));
	}

	/**
	 * 입력 이벤트 핸들러
	 */
	private handleInput(): void {
		// IME 조합 중이면 무시
		if (this.isComposing) return;

		// 디바운스
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}

		this.debounceTimer = setTimeout(() => {
			this.processInput();
		}, MENTION_CONSTANTS.DEBOUNCE_MS);
	}

	/**
	 * 입력 처리
	 */
	private async processInput(): Promise<void> {
		const text = this.inputEl.value;
		const cursorPos = this.inputEl.selectionStart || 0;

		// @ 트리거 감지
		const triggerResult = this.detectTrigger(text, cursorPos);

		if (triggerResult) {
			// 멘션 입력 모드 활성화
			this.state = {
				isActive: true,
				startIndex: triggerResult.startIndex,
				query: triggerResult.query,
				selectedIndex: 0,
			};

			// 자동완성 검색
			const suggestions = await this.mentionService.search(
				triggerResult.query
			);

			// 팝업 표시
			const position = this.calculatePopupPosition();
			this.autocompletePopup.show(position, suggestions);
		} else {
			// 멘션 입력 모드 비활성화
			this.resetState();
		}
	}

	/**
	 * @ 트리거 감지
	 */
	private detectTrigger(
		text: string,
		cursorPos: number
	): { startIndex: number; query: string } | null {
		// 커서 위치 이전의 텍스트
		const textBeforeCursor = text.substring(0, cursorPos);

		// 마지막 @ 위치 찾기
		const lastAtIndex = textBeforeCursor.lastIndexOf(
			MENTION_CONSTANTS.TRIGGER_CHAR
		);

		if (lastAtIndex === -1) {
			return null;
		}

		// @ 앞이 공백이거나 시작 위치인지 확인
		if (lastAtIndex > 0 && !/\s/.test(textBeforeCursor[lastAtIndex - 1])) {
			return null;
		}

		// @ 뒤의 텍스트 (검색어)
		const query = textBeforeCursor.substring(lastAtIndex + 1);

		// 검색어에 공백이 있으면 무효 (멘션 종료)
		if (/\s/.test(query)) {
			return null;
		}

		return {
			startIndex: lastAtIndex,
			query,
		};
	}

	/**
	 * 팝업 위치 계산
	 */
	private calculatePopupPosition(): PopupPosition {
		const inputRect = this.inputEl.getBoundingClientRect();
		const containerRect =
			this.inputEl.closest('.sage-chat-input-container')?.getBoundingClientRect() ||
			inputRect;

		return {
			x: 0,
			y: inputRect.top - containerRect.top - MENTION_CONSTANTS.MAX_DROPDOWN_HEIGHT - 8,
			maxWidth: containerRect.width,
			maxHeight: MENTION_CONSTANTS.MAX_DROPDOWN_HEIGHT,
		};
	}

	/**
	 * 키보드 이벤트 핸들러
	 */
	private handleKeyDown(e: KeyboardEvent): void {
		// 자동완성 팝업이 표시 중일 때만 처리
		if (!this.autocompletePopup.isVisible()) {
			return;
		}

		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				this.autocompletePopup.selectPrevious();
				break;

			case 'ArrowDown':
				e.preventDefault();
				this.autocompletePopup.selectNext();
				break;

			case 'Enter':
				e.preventDefault();
				this.handleEnterKey();
				break;

			case 'Escape':
				e.preventDefault();
				this.resetState();
				break;

			case 'Tab':
				e.preventDefault();
				this.handleEnterKey();
				break;
		}
	}

	/**
	 * Enter 키 처리 (항목 선택)
	 */
	private async handleEnterKey(): Promise<void> {
		const selected = this.autocompletePopup.getSelected();
		if (!selected) return;

		await this.selectSuggestion(selected);
	}

	/**
	 * 제안 선택 처리
	 */
	async selectSuggestion(suggestion: AutocompleteSuggestion): Promise<void> {
		// 대용량 파일 경고
		if (suggestion.type === 'file') {
			const isLarge = await this.mentionService.isLargeFile(suggestion.path);
			if (isLarge) {
				const proceed = await this.callbacks.onLargeFileWarning(
					suggestion.path,
					MENTION_CONSTANTS.LARGE_FILE_THRESHOLD
				);
				if (!proceed) {
					this.resetState();
					return;
				}
			}
		}

		// 멘션 생성
		const mention = this.mentionService.createMention(suggestion);
		this.mentions.push(mention);

		// 입력창에서 @ 및 검색어 제거
		const text = this.inputEl.value;
		const before = text.substring(0, this.state.startIndex);
		const after = text.substring(this.state.startIndex + this.state.query.length + 1);
		this.inputEl.value = before + after;

		// 칩 렌더링
		this.renderMentionChip(mention);

		// 콜백 호출
		this.callbacks.onMentionAdd(mention);

		// 상태 초기화
		this.resetState();

		// 포커스 복원
		this.inputEl.focus();
	}

	/**
	 * 멘션 칩 렌더링
	 */
	private renderMentionChip(mention: Mention): void {
		const chipEl = this.mentionChipsContainer.createDiv({
			cls: 'sage-mention-chip',
		});
		chipEl.dataset.mentionId = mention.id;

		// 아이콘
		const iconEl = chipEl.createDiv({ cls: 'sage-mention-chip-icon' });
		setIcon(iconEl, mention.icon);

		// 텍스트
		const textEl = chipEl.createDiv({ cls: 'sage-mention-chip-text' });
		textEl.textContent = mention.displayName;

		// 삭제 버튼
		const removeEl = chipEl.createDiv({ cls: 'sage-mention-chip-remove' });
		setIcon(removeEl, 'x');
		removeEl.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.removeMention(mention.id);
		});
	}

	/**
	 * IME 조합 시작 핸들러
	 */
	private handleCompositionStart(): void {
		this.isComposing = true;
	}

	/**
	 * IME 조합 종료 핸들러
	 */
	private handleCompositionEnd(): void {
		this.isComposing = false;
		this.handleInput();
	}

	/**
	 * 포커스 해제 핸들러
	 */
	private handleBlur(): void {
		// 약간의 딜레이 후 팝업 숨기기 (클릭 이벤트 처리를 위해)
		setTimeout(() => {
			if (!this.autocompletePopup.isVisible()) return;
			this.resetState();
		}, 150);
	}

	/**
	 * 상태 초기화
	 */
	private resetState(): void {
		this.state = { ...DEFAULT_MENTION_INPUT_STATE };
		this.autocompletePopup.hide();

		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
			this.debounceTimer = null;
		}
	}

	/**
	 * 현재 입력 상태를 반환합니다.
	 */
	getState(): MentionInputState {
		return { ...this.state };
	}

	/**
	 * 현재 추가된 멘션 목록을 반환합니다.
	 */
	getMentions(): Mention[] {
		return [...this.mentions];
	}

	/**
	 * 특정 멘션을 제거합니다.
	 */
	removeMention(mentionId: string): void {
		const index = this.mentions.findIndex((m) => m.id === mentionId);
		if (index === -1) return;

		// 배열에서 제거
		this.mentions.splice(index, 1);

		// DOM에서 제거 (애니메이션)
		const chipEl = this.mentionChipsContainer.querySelector(
			`[data-mention-id="${mentionId}"]`
		);
		if (chipEl) {
			chipEl.addClass('removing');
			setTimeout(() => chipEl.remove(), 150);
		}

		// 콜백 호출
		this.callbacks.onMentionRemove(mentionId);
	}

	/**
	 * 모든 멘션을 제거합니다.
	 */
	clearMentions(): void {
		this.mentions = [];
		this.mentionChipsContainer.empty();
	}

	/**
	 * 입력창의 텍스트를 반환합니다.
	 */
	getText(): string {
		return this.inputEl.value;
	}

	/**
	 * 입력창의 텍스트를 설정합니다.
	 */
	setText(text: string): void {
		this.inputEl.value = text;
	}

	/**
	 * 입력창을 초기화합니다.
	 */
	clear(): void {
		this.inputEl.value = '';
		this.clearMentions();
		this.resetState();
	}

	/**
	 * 입력창에 포커스를 설정합니다.
	 */
	focus(): void {
		this.inputEl.focus();
	}

	/**
	 * 입력창을 비활성화합니다.
	 */
	setDisabled(disabled: boolean): void {
		this.inputEl.disabled = disabled;
	}

	/**
	 * 컴포넌트 정리
	 */
	destroy(): void {
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}
		this.resetState();
		this.mentions = [];
	}
}
