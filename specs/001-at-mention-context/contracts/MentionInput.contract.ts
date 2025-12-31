/**
 * MentionInput Contract
 *
 * 입력창에서 멘션을 감지하고 관리하는 컴포넌트의 인터페이스를 정의합니다.
 *
 * @module contracts/MentionInput
 */

import type { Mention, MentionInputState } from '../data-model';
import type { IAutocompletePopup } from './AutocompletePopup.contract';
import type { IMentionService } from './MentionService.contract';

/**
 * MentionInput 이벤트 콜백 타입
 */
export interface MentionInputCallbacks {
  /**
   * 멘션 추가 시 호출
   * @param mention - 추가된 멘션
   */
  onMentionAdd: (mention: Mention) => void;

  /**
   * 멘션 제거 시 호출
   * @param mentionId - 제거된 멘션 ID
   */
  onMentionRemove: (mentionId: string) => void;

  /**
   * 메시지 전송 요청 시 호출 (Enter 키)
   * @param text - 입력된 텍스트 (멘션 제외)
   * @param mentions - 포함된 멘션 목록
   */
  onSubmit: (text: string, mentions: Mention[]) => void;

  /**
   * 대용량 파일 경고 시 호출
   * @param path - 파일 경로
   * @param size - 파일 크기 (bytes)
   * @returns 포함 여부 (true: 포함, false: 제외)
   */
  onLargeFileWarning: (path: string, size: number) => Promise<boolean>;
}

/**
 * MentionInput 인터페이스
 *
 * @description
 * textarea 입력창에서 @ 멘션을 감지하고 처리합니다.
 * 자동완성 팝업과 연동하여 파일/폴더 선택을 관리합니다.
 */
export interface IMentionInput {
  /**
   * 현재 입력 상태를 반환합니다.
   */
  getState(): MentionInputState;

  /**
   * 현재 추가된 멘션 목록을 반환합니다.
   */
  getMentions(): Mention[];

  /**
   * 특정 멘션을 제거합니다.
   *
   * @param mentionId - 제거할 멘션 ID
   *
   * @requirements
   * - FR-009: 멘션 삭제 방법 제공
   */
  removeMention(mentionId: string): void;

  /**
   * 모든 멘션을 제거합니다.
   */
  clearMentions(): void;

  /**
   * 입력창의 텍스트를 반환합니다 (멘션 제외).
   */
  getText(): string;

  /**
   * 입력창의 텍스트를 설정합니다.
   *
   * @param text - 설정할 텍스트
   */
  setText(text: string): void;

  /**
   * 입력창을 초기화합니다 (텍스트와 멘션 모두 제거).
   */
  clear(): void;

  /**
   * 입력창에 포커스를 설정합니다.
   */
  focus(): void;

  /**
   * 입력창을 비활성화합니다.
   *
   * @param disabled - 비활성화 여부
   */
  setDisabled(disabled: boolean): void;

  /**
   * 컴포넌트를 정리합니다.
   */
  destroy(): void;
}

/**
 * MentionInput 생성 옵션
 */
export interface MentionInputOptions {
  /** 입력 textarea 요소 */
  inputEl: HTMLTextAreaElement;

  /** 멘션 칩을 표시할 컨테이너 (입력창 상단) */
  mentionChipsContainer: HTMLElement;

  /** 콜백 함수들 */
  callbacks: MentionInputCallbacks;

  /** 멘션 서비스 */
  mentionService: IMentionService;

  /** 자동완성 팝업 */
  autocompletePopup: IAutocompletePopup;
}

/**
 * MentionInput 생성자 타입
 */
export interface MentionInputConstructor {
  new (options: MentionInputOptions): IMentionInput;
}

/**
 * 멘션 칩 UI 요소 인터페이스
 */
export interface MentionChipElement {
  /** 칩 컨테이너 요소 */
  container: HTMLElement;

  /** 아이콘 요소 */
  icon: HTMLElement;

  /** 텍스트 요소 */
  text: HTMLElement;

  /** 삭제 버튼 요소 */
  removeButton: HTMLElement;
}
