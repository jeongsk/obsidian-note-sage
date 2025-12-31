/**
 * @ 멘션 컨텍스트 모듈
 *
 * 이 모듈은 채팅 입력에서 @를 사용하여 파일/폴더를 멘션하고
 * AI 컨텍스트에 포함시키는 기능을 제공합니다.
 *
 * @module mention
 */

// 타입 정의
export type {
	MentionType,
	Mention,
	AutocompleteSuggestion,
	FileContextAttachment,
	FolderItem,
	FolderContextAttachment,
	ContextAttachment,
	MentionInputState,
} from './types';

// 상수 및 유틸리티
export {
	DEFAULT_MENTION_INPUT_STATE,
	MENTION_CONSTANTS,
	isFileContext,
	isFolderContext,
	isBinaryFile,
	isHidden,
	generateMentionId,
} from './types';

// 서비스
export { MentionService } from './MentionService';

// UI 컴포넌트
export { AutocompletePopup } from './AutocompletePopup';
export type {
	AutocompleteCallbacks,
	PopupPosition,
	AutocompletePopupOptions,
} from './AutocompletePopup';

export { MentionInput } from './MentionInput';
export type {
	MentionInputCallbacks,
	MentionInputOptions,
} from './MentionInput';
