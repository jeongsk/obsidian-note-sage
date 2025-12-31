/**
 * @ 멘션 컨텍스트 기능 타입 정의
 *
 * @module mention/types
 */

/**
 * 멘션 타입
 */
export type MentionType = 'file' | 'folder';

/**
 * 멘션 엔티티
 * 사용자가 @로 선택한 파일/폴더 참조
 */
export interface Mention {
	/** 고유 식별자 (UUID) */
	id: string;

	/** 멘션 타입: 파일 또는 폴더 */
	type: MentionType;

	/** Vault 내 상대 경로 (예: "notes/readme.md", "src/") */
	path: string;

	/** 표시 이름 (파일명 또는 폴더명) */
	displayName: string;

	/** 아이콘 이름 (Obsidian 아이콘 시스템) */
	icon: string;
}

/**
 * 자동완성 제안 항목
 */
export interface AutocompleteSuggestion {
	/** 멘션 타입 */
	type: MentionType;

	/** Vault 내 상대 경로 */
	path: string;

	/** 표시 이름 (파일명 또는 폴더명) */
	displayName: string;

	/** 부모 폴더 경로 (루트면 빈 문자열) */
	parentPath: string;

	/** 파일 확장자 (폴더는 빈 문자열) */
	extension: string;

	/** 아이콘 이름 */
	icon: string;

	/** 검색 점수 (정렬용, 높을수록 우선) */
	score: number;
}

/**
 * 컨텍스트 첨부 - 파일 타입
 */
export interface FileContextAttachment {
	type: 'file';

	/** 파일 경로 */
	path: string;

	/** 파일 내용 (텍스트) */
	content: string;

	/** 파일 크기 (bytes) */
	size: number;

	/** 내용이 잘렸는지 여부 */
	truncated: boolean;

	/** 바이너리 파일 여부 */
	isBinary: boolean;
}

/**
 * 폴더 내 항목
 */
export interface FolderItem {
	/** 항목 타입 */
	type: 'file' | 'folder';

	/** 상대 경로 (폴더 기준) */
	relativePath: string;

	/** 표시 이름 */
	name: string;

	/** 깊이 (0부터 시작) */
	depth: number;
}

/**
 * 컨텍스트 첨부 - 폴더 타입
 */
export interface FolderContextAttachment {
	type: 'folder';

	/** 폴더 경로 */
	path: string;

	/** 폴더 내 항목 목록 */
	items: FolderItem[];

	/** 총 항목 수 */
	totalCount: number;

	/** 표시된 항목 수 (깊이 제한으로 잘린 경우) */
	displayedCount: number;
}

export type ContextAttachment = FileContextAttachment | FolderContextAttachment;

/**
 * 멘션 입력 상태
 */
export interface MentionInputState {
	/** 현재 멘션 입력 중인지 */
	isActive: boolean;

	/** @ 시작 위치 (커서 인덱스) */
	startIndex: number;

	/** 현재 입력 중인 검색어 */
	query: string;

	/** 선택된 자동완성 항목 인덱스 (-1이면 없음) */
	selectedIndex: number;
}

/**
 * 기본 입력 상태
 */
export const DEFAULT_MENTION_INPUT_STATE: MentionInputState = {
	isActive: false,
	startIndex: -1,
	query: '',
	selectedIndex: -1,
};

/**
 * 멘션 관련 상수
 */
export const MENTION_CONSTANTS = {
	/** 트리거 문자 */
	TRIGGER_CHAR: '@',

	/** 자동완성 최대 항목 수 */
	MAX_SUGGESTIONS: 50,

	/** 폴더 최대 깊이 */
	MAX_FOLDER_DEPTH: 3,

	/** 대용량 파일 기준 (bytes) */
	LARGE_FILE_THRESHOLD: 100 * 1024, // 100KB

	/** 입력 디바운스 (ms) */
	DEBOUNCE_MS: 50,

	/** 자동완성 드롭다운 최대 높이 (px) */
	MAX_DROPDOWN_HEIGHT: 300,

	/** 검색 점수: 정확히 일치 */
	SCORE_EXACT_MATCH: 150,

	/** 검색 점수: 경로/이름 시작 일치 */
	SCORE_STARTS_WITH: 100,

	/** 검색 점수: 경로/이름 포함 */
	SCORE_CONTAINS: 50,

	/** 검색 점수: 경로에만 포함 */
	SCORE_PATH_CONTAINS: 25,

	/** 숨김 파일 접두사 */
	HIDDEN_PREFIX: '.',

	/** 바이너리 파일 확장자 */
	BINARY_EXTENSIONS: [
		// 이미지
		'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.bmp', '.tiff', '.psd',
		// 문서
		'.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
		// 압축
		'.zip', '.tar', '.gz', '.rar', '.7z', '.bz2',
		// 오디오
		'.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a',
		// 비디오
		'.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv',
		// 실행 파일
		'.exe', '.dll', '.so', '.dylib', '.app',
		// 기타 바이너리
		'.wasm', '.bin', '.dat', '.db', '.sqlite', '.sqlite3',
		// 폰트
		'.ttf', '.otf', '.woff', '.woff2', '.eot',
		// 디자인 파일
		'.ai', '.sketch', '.fig', '.xd',
	],
} as const;

/**
 * 파일 컨텍스트인지 확인
 */
export function isFileContext(
	attachment: ContextAttachment
): attachment is FileContextAttachment {
	return attachment.type === 'file';
}

/**
 * 폴더 컨텍스트인지 확인
 */
export function isFolderContext(
	attachment: ContextAttachment
): attachment is FolderContextAttachment {
	return attachment.type === 'folder';
}

/**
 * 바이너리 파일인지 확인 (확장자 기반)
 */
export function isBinaryFile(path: string): boolean {
	const ext = path.substring(path.lastIndexOf('.')).toLowerCase();
	return (MENTION_CONSTANTS.BINARY_EXTENSIONS as readonly string[]).includes(
		ext
	);
}

/**
 * 숨김 파일/폴더인지 확인
 */
export function isHidden(name: string): boolean {
	return name.startsWith(MENTION_CONSTANTS.HIDDEN_PREFIX);
}

/**
 * UUID 생성 유틸리티
 */
export function generateMentionId(): string {
	return crypto.randomUUID();
}
