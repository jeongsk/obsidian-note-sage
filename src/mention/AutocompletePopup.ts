/**
 * AutocompletePopup
 *
 * 자동완성 드롭다운 UI 컴포넌트입니다.
 * 키보드 탐색, 마우스 클릭 등의 상호작용을 처리합니다.
 *
 * @module mention/AutocompletePopup
 */

import { setIcon } from 'obsidian';
import type { AutocompleteSuggestion } from './types';
import { MENTION_CONSTANTS } from './types';
import { t } from '../i18n';

/**
 * 자동완성 콜백 인터페이스
 */
export interface AutocompleteCallbacks {
	/** 항목 선택 시 호출 */
	onSelect: (suggestion: AutocompleteSuggestion) => void;
	/** 드롭다운 닫힘 시 호출 */
	onClose: () => void;
}

/**
 * 드롭다운 위치 정보
 */
export interface PopupPosition {
	/** X 좌표 (px) */
	x: number;
	/** Y 좌표 (px) */
	y: number;
	/** 최대 너비 (px) */
	maxWidth?: number;
	/** 최대 높이 (px) */
	maxHeight?: number;
}

/**
 * AutocompletePopup 생성 옵션
 */
export interface AutocompletePopupOptions {
	/** 콜백 함수들 */
	callbacks: AutocompleteCallbacks;
	/** 부모 요소 (드롭다운이 추가될 컨테이너) */
	parentEl: HTMLElement;
	/** 최대 표시 항목 수 (기본: 50) */
	maxItems?: number;
	/** 최대 높이 (px, 기본: 300) */
	maxHeight?: number;
}

/**
 * AutocompletePopup 클래스
 *
 * @description
 * 자동완성 드롭다운 UI를 관리합니다.
 * 키보드 탐색, 마우스 클릭 등의 상호작용을 처리합니다.
 */
export class AutocompletePopup {
	private containerEl: HTMLElement;
	private suggestions: AutocompleteSuggestion[] = [];
	private selectedIndex = 0;
	private callbacks: AutocompleteCallbacks;
	private maxItems: number;
	private maxHeight: number;

	constructor(options: AutocompletePopupOptions) {
		this.callbacks = options.callbacks;
		this.maxItems = options.maxItems ?? MENTION_CONSTANTS.MAX_SUGGESTIONS;
		this.maxHeight =
			options.maxHeight ?? MENTION_CONSTANTS.MAX_DROPDOWN_HEIGHT;

		// 컨테이너 생성
		this.containerEl = options.parentEl.createDiv({
			cls: 'sage-autocomplete-popup',
		});
		this.containerEl.style.display = 'none';
		this.containerEl.style.maxHeight = `${this.maxHeight}px`;

		// 외부 클릭 시 닫기
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
	}

	/**
	 * 드롭다운을 표시합니다.
	 *
	 * @param position - 드롭다운 위치
	 * @param suggestions - 표시할 제안 목록
	 */
	show(position: PopupPosition, suggestions: AutocompleteSuggestion[]): void {
		this.suggestions = suggestions.slice(0, this.maxItems);
		this.selectedIndex = 0;

		// 위치 설정
		if (position.maxWidth) {
			this.containerEl.style.maxWidth = `${position.maxWidth}px`;
		}

		// 기본: 입력창 위에 표시
		this.containerEl.style.bottom = '100%';
		this.containerEl.style.top = 'auto';

		// 렌더링
		this.render();

		// 표시
		this.containerEl.style.display = 'block';

		// 화면 경계 체크: 팝업이 화면 상단을 벗어나면 아래에 표시
		const popupRect = this.containerEl.getBoundingClientRect();
		if (popupRect.top < 0) {
			this.containerEl.style.bottom = 'auto';
			this.containerEl.style.top = '100%';
		}

		// 외부 클릭 이벤트 등록
		document.addEventListener('click', this.handleOutsideClick, true);
	}

	/**
	 * 드롭다운을 숨깁니다.
	 */
	hide(): void {
		this.containerEl.style.display = 'none';
		this.suggestions = [];
		this.selectedIndex = 0;

		// 외부 클릭 이벤트 해제
		document.removeEventListener('click', this.handleOutsideClick, true);
	}

	/**
	 * 드롭다운이 현재 표시 중인지 확인합니다.
	 */
	isVisible(): boolean {
		return this.containerEl.style.display !== 'none';
	}

	/**
	 * 제안 목록을 업데이트합니다.
	 *
	 * @param suggestions - 새 제안 목록
	 */
	updateSuggestions(suggestions: AutocompleteSuggestion[]): void {
		this.suggestions = suggestions.slice(0, this.maxItems);
		this.selectedIndex = Math.min(
			this.selectedIndex,
			Math.max(0, this.suggestions.length - 1)
		);
		this.render();
	}

	/**
	 * 선택 항목을 위로 이동합니다.
	 *
	 * @returns 새 선택 인덱스
	 */
	selectPrevious(): number {
		if (this.suggestions.length === 0) return -1;

		this.selectedIndex =
			this.selectedIndex <= 0
				? this.suggestions.length - 1
				: this.selectedIndex - 1;

		this.updateSelectedItem();
		this.scrollToSelected();
		return this.selectedIndex;
	}

	/**
	 * 선택 항목을 아래로 이동합니다.
	 *
	 * @returns 새 선택 인덱스
	 */
	selectNext(): number {
		if (this.suggestions.length === 0) return -1;

		this.selectedIndex =
			this.selectedIndex >= this.suggestions.length - 1
				? 0
				: this.selectedIndex + 1;

		this.updateSelectedItem();
		this.scrollToSelected();
		return this.selectedIndex;
	}

	/**
	 * 현재 선택된 항목을 반환합니다.
	 *
	 * @returns 선택된 제안 또는 null
	 */
	getSelected(): AutocompleteSuggestion | null {
		if (
			this.selectedIndex < 0 ||
			this.selectedIndex >= this.suggestions.length
		) {
			return null;
		}
		return this.suggestions[this.selectedIndex];
	}

	/**
	 * 현재 선택 인덱스를 반환합니다.
	 */
	getSelectedIndex(): number {
		return this.selectedIndex;
	}

	/**
	 * 드롭다운 렌더링
	 */
	private render(): void {
		this.containerEl.empty();

		if (this.suggestions.length === 0) {
			this.renderEmptyState();
			return;
		}

		for (let i = 0; i < this.suggestions.length; i++) {
			this.renderItem(this.suggestions[i], i);
		}
	}

	/**
	 * 결과 없음 상태 렌더링
	 */
	private renderEmptyState(): void {
		const emptyEl = this.containerEl.createDiv({
			cls: 'sage-autocomplete-empty',
		});
		emptyEl.textContent = t('mention.noResults');
	}

	/**
	 * 개별 항목 렌더링
	 */
	private renderItem(suggestion: AutocompleteSuggestion, index: number): void {
		const itemEl = this.containerEl.createDiv({
			cls: 'sage-autocomplete-item',
		});

		if (index === this.selectedIndex) {
			itemEl.addClass('selected');
		}

		// 아이콘
		const iconEl = itemEl.createDiv({
			cls: 'sage-autocomplete-item-icon',
		});
		setIcon(iconEl, suggestion.icon);

		// 정보
		const infoEl = itemEl.createDiv({
			cls: 'sage-autocomplete-item-info',
		});

		const nameEl = infoEl.createDiv({
			cls: 'sage-autocomplete-item-name',
		});
		nameEl.textContent = suggestion.displayName;

		if (suggestion.parentPath) {
			const pathEl = infoEl.createDiv({
				cls: 'sage-autocomplete-item-path',
			});
			pathEl.textContent = suggestion.parentPath;
		}

		// 타입 배지
		const typeEl = itemEl.createDiv({
			cls: 'sage-autocomplete-item-type',
		});
		typeEl.textContent = suggestion.type === 'folder' ? t('mention.folder') : t('mention.file');

		// 클릭 이벤트
		itemEl.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.callbacks.onSelect(suggestion);
		});

		// 호버 시 선택
		itemEl.addEventListener('mouseenter', () => {
			this.selectedIndex = index;
			this.updateSelectedItem();
		});
	}

	/**
	 * 선택 상태 업데이트
	 */
	private updateSelectedItem(): void {
		const items = this.containerEl.querySelectorAll('.sage-autocomplete-item');
		items.forEach((item, index) => {
			if (index === this.selectedIndex) {
				item.addClass('selected');
			} else {
				item.removeClass('selected');
			}
		});
	}

	/**
	 * 선택된 항목으로 스크롤
	 */
	private scrollToSelected(): void {
		const items = this.containerEl.querySelectorAll('.sage-autocomplete-item');
		const selectedItem = items[this.selectedIndex] as HTMLElement | undefined;

		if (selectedItem) {
			selectedItem.scrollIntoView({ block: 'nearest' });
		}
	}

	/**
	 * 외부 클릭 핸들러
	 */
	private handleOutsideClick(e: MouseEvent): void {
		if (!this.containerEl.contains(e.target as Node)) {
			this.hide();
			this.callbacks.onClose();
		}
	}

	/**
	 * 컴포넌트 정리
	 */
	destroy(): void {
		document.removeEventListener('click', this.handleOutsideClick, true);
		this.containerEl.remove();
	}
}
