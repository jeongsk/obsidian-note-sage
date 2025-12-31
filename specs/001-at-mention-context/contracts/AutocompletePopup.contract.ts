/**
 * AutocompletePopup Contract
 *
 * 자동완성 드롭다운 UI 컴포넌트의 인터페이스를 정의합니다.
 *
 * @module contracts/AutocompletePopup
 */

import type { AutocompleteSuggestion, MentionInputState } from '../data-model';

/**
 * 자동완성 이벤트 콜백 타입
 */
export interface AutocompleteCallbacks {
  /**
   * 항목 선택 시 호출
   * @param suggestion - 선택된 제안
   */
  onSelect: (suggestion: AutocompleteSuggestion) => void;

  /**
   * 드롭다운 닫힘 시 호출
   */
  onClose: () => void;

  /**
   * 검색어 변경 시 호출
   * @param query - 새 검색어
   */
  onQueryChange: (query: string) => void;
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
  maxWidth: number;

  /** 최대 높이 (px) */
  maxHeight: number;
}

/**
 * AutocompletePopup 인터페이스
 *
 * @description
 * 자동완성 드롭다운 UI를 관리합니다.
 * 키보드 탐색, 마우스 클릭 등의 상호작용을 처리합니다.
 */
export interface IAutocompletePopup {
  /**
   * 드롭다운을 표시합니다.
   *
   * @param position - 드롭다운 위치
   * @param suggestions - 표시할 제안 목록
   *
   * @requirements
   * - FR-001: @ 입력 시 드롭다운 표시
   * - FR-004: 파일/폴더 시각적 구분 (아이콘)
   */
  show(position: PopupPosition, suggestions: AutocompleteSuggestion[]): void;

  /**
   * 드롭다운을 숨깁니다.
   *
   * @requirements
   * - Edge Case: ESC 키로 닫기
   */
  hide(): void;

  /**
   * 드롭다운이 현재 표시 중인지 확인합니다.
   */
  isVisible(): boolean;

  /**
   * 제안 목록을 업데이트합니다.
   *
   * @param suggestions - 새 제안 목록
   *
   * @requirements
   * - FR-003: 실시간 필터링
   * - SC-002: 필터링 100ms 이내
   */
  updateSuggestions(suggestions: AutocompleteSuggestion[]): void;

  /**
   * 선택 항목을 위로 이동합니다.
   *
   * @returns 새 선택 인덱스
   *
   * @requirements
   * - FR-010: 키보드 탐색 (위 화살표)
   */
  selectPrevious(): number;

  /**
   * 선택 항목을 아래로 이동합니다.
   *
   * @returns 새 선택 인덱스
   *
   * @requirements
   * - FR-010: 키보드 탐색 (아래 화살표)
   */
  selectNext(): number;

  /**
   * 현재 선택된 항목을 반환합니다.
   *
   * @returns 선택된 제안 또는 null
   */
  getSelected(): AutocompleteSuggestion | null;

  /**
   * 현재 선택 인덱스를 반환합니다.
   */
  getSelectedIndex(): number;

  /**
   * 컴포넌트를 정리하고 DOM에서 제거합니다.
   */
  destroy(): void;
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
 * AutocompletePopup 생성자 타입
 */
export interface AutocompletePopupConstructor {
  new (options: AutocompletePopupOptions): IAutocompletePopup;
}
