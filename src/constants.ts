/**
 * 프로젝트 전역 상수 정의
 */

/**
 * UI 관련 상수
 */
export const UI_CONSTANTS = {
	/** MCP 상태 렌더링 디바운스 시간 (ms) */
	MCP_STATUS_DEBOUNCE_MS: 100,

	/** Notice 표시 시간 (ms) */
	NOTICE_DURATION_MS: 5000,

	/** 복사 버튼 피드백 표시 시간 (ms) */
	COPY_FEEDBACK_DURATION_MS: 2000,
} as const;

/**
 * 콘텐츠 관련 상수
 */
export const CONTENT_LIMITS = {
	/** 기본 최대 콘텐츠 길이 */
	DEFAULT_MAX_CONTENT_LENGTH: 10000,

	/** 최소 콘텐츠 길이 */
	MIN_CONTENT_LENGTH: 1000,

	/** 최대 콘텐츠 길이 */
	MAX_CONTENT_LENGTH: 100000,
} as const;

/**
 * Unicode 관련 상수
 */
export const UNICODE_CONSTANTS = {
	/** High surrogate 시작 코드포인트 */
	HIGH_SURROGATE_START: 0xD800,

	/** High surrogate 끝 코드포인트 */
	HIGH_SURROGATE_END: 0xDBFF,
} as const;

/**
 * 세션 관련 상수
 */
export const SESSION_CONSTANTS = {
	/** 세션 ID 프리픽스 */
	SESSION_PREFIX: 'session',

	/** 메시지 ID 프리픽스 */
	MESSAGE_PREFIX: 'msg',
} as const;
