/**
 * MentionService
 *
 * 멘션 기능의 핵심 서비스입니다.
 * 파일/폴더 검색, 컨텍스트 생성 등의 기능을 제공합니다.
 *
 * @module mention/MentionService
 */

import { App, TFile, TFolder, TAbstractFile } from 'obsidian';
import type {
	Mention,
	AutocompleteSuggestion,
	ContextAttachment,
	FileContextAttachment,
	FolderContextAttachment,
	FolderItem,
} from './types';
import {
	MENTION_CONSTANTS,
	isBinaryFile,
	isHidden,
	generateMentionId,
} from './types';
import { t } from '../i18n';

/**
 * 파일 확장자에 따른 아이콘 매핑
 */
const FILE_ICON_MAP: Record<string, string> = {
	md: 'file-text',
	txt: 'file-text',
	js: 'file-code',
	ts: 'file-code',
	jsx: 'file-code',
	tsx: 'file-code',
	json: 'file-json',
	css: 'file-code',
	html: 'file-code',
	py: 'file-code',
	java: 'file-code',
	rb: 'file-code',
	go: 'file-code',
	rs: 'file-code',
	c: 'file-code',
	cpp: 'file-code',
	h: 'file-code',
	sh: 'file-terminal',
	bash: 'file-terminal',
	zsh: 'file-terminal',
	yml: 'file-cog',
	yaml: 'file-cog',
	toml: 'file-cog',
	ini: 'file-cog',
	png: 'image',
	jpg: 'image',
	jpeg: 'image',
	gif: 'image',
	svg: 'image',
	webp: 'image',
	pdf: 'file',
	doc: 'file',
	docx: 'file',
	xls: 'file-spreadsheet',
	xlsx: 'file-spreadsheet',
	csv: 'file-spreadsheet',
	mp3: 'file-audio',
	wav: 'file-audio',
	mp4: 'file-video',
	mov: 'file-video',
	zip: 'file-archive',
	tar: 'file-archive',
	gz: 'file-archive',
	rar: 'file-archive',
};

/**
 * 파일 확장자에서 아이콘 이름 가져오기
 */
function getFileIcon(path: string): string {
	const ext = path.split('.').pop()?.toLowerCase() || '';
	return FILE_ICON_MAP[ext] || 'file';
}

/**
 * MentionService 클래스
 *
 * @description
 * Obsidian Vault API를 사용하여 파일 시스템에 접근하고
 * 멘션 관련 비즈니스 로직을 처리합니다.
 */
export class MentionService {
	private app: App;
	private cache: AutocompleteSuggestion[] = [];
	private eventRefs: (() => void)[] = [];

	constructor(app: App) {
		this.app = app;
		this.refreshCache();
		this.registerVaultEvents();
	}

	/**
	 * Vault 이벤트 리스너 등록
	 * 파일 생성/삭제/이름변경 시 캐시 갱신
	 */
	private registerVaultEvents(): void {
		const vault = this.app.vault;

		// 파일 생성
		const createRef = vault.on('create', () => {
			this.refreshCache();
		});

		// 파일 삭제
		const deleteRef = vault.on('delete', () => {
			this.refreshCache();
		});

		// 파일 이름 변경
		const renameRef = vault.on('rename', () => {
			this.refreshCache();
		});

		// 정리를 위해 참조 저장
		this.eventRefs.push(
			() => vault.offref(createRef),
			() => vault.offref(deleteRef),
			() => vault.offref(renameRef)
		);
	}

	/**
	 * 자동완성 제안 목록을 검색합니다.
	 *
	 * @param query - 검색어 (@ 뒤의 문자열)
	 * @returns 검색 결과 목록 (최대 50개, 점수 내림차순)
	 */
	async search(query: string): Promise<AutocompleteSuggestion[]> {
		const lowerQuery = query.toLowerCase().trim();

		// 빈 검색어: 전체 목록 반환 (최대 50개)
		if (!lowerQuery) {
			return this.cache.slice(0, MENTION_CONSTANTS.MAX_SUGGESTIONS);
		}

		// 검색어로 필터링 및 점수 계산
		const results = this.cache
			.map((item) => {
				const score = this.calculateScore(item, lowerQuery);
				return { ...item, score };
			})
			.filter((item) => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, MENTION_CONSTANTS.MAX_SUGGESTIONS);

		return results;
	}

	/**
	 * 검색 점수 계산
	 * - 이름 시작 일치: 100점
	 * - 이름 포함: 50점
	 * - 경로 포함: 25점
	 */
	private calculateScore(
		item: AutocompleteSuggestion,
		query: string
	): number {
		const lowerName = item.displayName.toLowerCase();
		const lowerPath = item.path.toLowerCase();

		// 이름이 검색어로 시작
		if (lowerName.startsWith(query)) {
			return 100;
		}

		// 이름에 검색어 포함
		if (lowerName.includes(query)) {
			return 50;
		}

		// 경로에 검색어 포함
		if (lowerPath.includes(query)) {
			return 25;
		}

		return 0;
	}

	/**
	 * 자동완성 제안을 Mention으로 변환합니다.
	 *
	 * @param suggestion - 선택된 자동완성 제안
	 * @returns Mention 객체
	 */
	createMention(suggestion: AutocompleteSuggestion): Mention {
		return {
			id: generateMentionId(),
			type: suggestion.type,
			path: suggestion.path,
			displayName: suggestion.displayName,
			icon: suggestion.icon,
		};
	}

	/**
	 * Mention을 ContextAttachment로 변환합니다.
	 *
	 * @param mention - 변환할 멘션
	 * @returns 컨텍스트 첨부 객체
	 */
	async createContext(mention: Mention): Promise<ContextAttachment> {
		if (mention.type === 'file') {
			return this.createFileContext(mention.path);
		} else {
			return this.createFolderContext(mention.path);
		}
	}

	/**
	 * 파일 컨텍스트 생성
	 */
	private async createFileContext(
		path: string
	): Promise<FileContextAttachment> {
		const file = this.app.vault.getAbstractFileByPath(path);

		if (!(file instanceof TFile)) {
			return {
				type: 'file',
				path,
				content: `[${t('mention.fileNotFound')}]`,
				size: 0,
				truncated: false,
				isBinary: false,
			};
		}

		const isBinary = isBinaryFile(path);
		const stat = await this.app.vault.adapter.stat(path);
		const size = stat?.size || 0;

		if (isBinary) {
			return {
				type: 'file',
				path,
				content: `[${t('mention.binaryFile')}: ${file.extension.toUpperCase()}, ${this.formatSize(size)}]`,
				size,
				truncated: false,
				isBinary: true,
			};
		}

		try {
			let content = await this.app.vault.read(file);
			const truncated = size > MENTION_CONSTANTS.LARGE_FILE_THRESHOLD;

			// 대용량 파일 처리
			if (truncated) {
				content =
					content.substring(0, MENTION_CONSTANTS.LARGE_FILE_THRESHOLD) +
					`\n\n[${t('mention.contentTruncated')}]`;
			}

			return {
				type: 'file',
				path,
				content,
				size,
				truncated,
				isBinary: false,
			};
		} catch (error) {
			return {
				type: 'file',
				path,
				content: `[${t('mention.fileReadError')}: ${error instanceof Error ? error.message : 'Unknown error'}]`,
				size,
				truncated: false,
				isBinary: false,
			};
		}
	}

	/**
	 * 폴더 컨텍스트 생성
	 */
	private async createFolderContext(
		path: string
	): Promise<FolderContextAttachment> {
		const folder = this.app.vault.getAbstractFileByPath(path);

		if (!(folder instanceof TFolder)) {
			return {
				type: 'folder',
				path,
				items: [],
				totalCount: 0,
				displayedCount: 0,
			};
		}

		const items: FolderItem[] = [];
		let totalCount = 0;

		// 재귀적으로 폴더 내용 수집 (최대 깊이 제한)
		this.collectFolderItems(folder, items, 0, path);
		totalCount = items.length;

		return {
			type: 'folder',
			path,
			items,
			totalCount,
			displayedCount: items.length,
		};
	}

	/**
	 * 폴더 항목 재귀 수집
	 */
	private collectFolderItems(
		folder: TFolder,
		items: FolderItem[],
		depth: number,
		basePath: string
	): void {
		if (depth >= MENTION_CONSTANTS.MAX_FOLDER_DEPTH) {
			return;
		}

		for (const child of folder.children) {
			// 숨김 파일/폴더 제외
			if (isHidden(child.name)) {
				continue;
			}

			const relativePath = child.path.replace(basePath, '').replace(/^\//, '');

			if (child instanceof TFile) {
				items.push({
					type: 'file',
					relativePath,
					name: child.name,
					depth,
				});
			} else if (child instanceof TFolder) {
				items.push({
					type: 'folder',
					relativePath: relativePath + '/',
					name: child.name,
					depth,
				});
				// 재귀 호출
				this.collectFolderItems(child, items, depth + 1, basePath);
			}
		}
	}

	/**
	 * 여러 Mention을 하나의 컨텍스트 문자열로 변환합니다.
	 *
	 * @param mentions - 멘션 목록
	 * @returns 포맷된 컨텍스트 문자열
	 */
	async buildContextString(mentions: Mention[]): Promise<string> {
		if (mentions.length === 0) {
			return '';
		}

		// 중복 제거 (경로 기준)
		const uniqueMentions = mentions.filter(
			(mention, index, self) =>
				index === self.findIndex((m) => m.path === mention.path)
		);

		const contextParts: string[] = [];

		for (const mention of uniqueMentions) {
			const context = await this.createContext(mention);

			if (context.type === 'file') {
				contextParts.push(this.formatFileContext(context));
			} else {
				contextParts.push(this.formatFolderContext(context));
			}
		}

		return contextParts.join('\n\n');
	}

	/**
	 * 파일 컨텍스트를 XML 형식으로 포맷
	 */
	private formatFileContext(context: FileContextAttachment): string {
		const attrs: string[] = [`path="${context.path}"`];

		if (context.isBinary) {
			attrs.push('type="binary"');
		}
		if (context.truncated) {
			attrs.push('truncated="true"');
		}

		return `<mentioned_file ${attrs.join(' ')}>\n${context.content}\n</mentioned_file>`;
	}

	/**
	 * 폴더 컨텍스트를 XML 형식으로 포맷
	 */
	private formatFolderContext(context: FolderContextAttachment): string {
		const fileList = context.items
			.map((item) => {
				const indent = '  '.repeat(item.depth);
				const prefix = item.type === 'folder' ? '📁 ' : '📄 ';
				return `${indent}${prefix}${item.name}`;
			})
			.join('\n');

		return `<mentioned_folder path="${context.path}" count="${context.totalCount}">\n${fileList}\n</mentioned_folder>`;
	}

	/**
	 * 파일 크기가 대용량인지 확인합니다.
	 *
	 * @param path - 파일 경로
	 * @returns 100KB 초과 여부
	 */
	async isLargeFile(path: string): Promise<boolean> {
		const stat = await this.app.vault.adapter.stat(path);
		return (stat?.size || 0) > MENTION_CONSTANTS.LARGE_FILE_THRESHOLD;
	}

	/**
	 * 파일/폴더 존재 여부를 확인합니다.
	 *
	 * @param path - 파일/폴더 경로
	 * @returns 존재 여부
	 */
	exists(path: string): boolean {
		return this.app.vault.getAbstractFileByPath(path) !== null;
	}

	/**
	 * 파일 캐시를 갱신합니다.
	 */
	refreshCache(): void {
		this.cache = this.buildSuggestionList();
	}

	/**
	 * 자동완성 제안 목록 생성
	 */
	private buildSuggestionList(): AutocompleteSuggestion[] {
		const suggestions: AutocompleteSuggestion[] = [];
		const files = this.app.vault.getAllLoadedFiles();

		for (const file of files) {
			// 숨김 파일/폴더 제외
			if (isHidden(file.name)) {
				continue;
			}

			if (file instanceof TFile) {
				suggestions.push(this.fileToSuggestion(file));
			} else if (file instanceof TFolder && file.path !== '/') {
				suggestions.push(this.folderToSuggestion(file));
			}
		}

		// 이름순 정렬
		suggestions.sort((a, b) =>
			a.displayName.localeCompare(b.displayName)
		);

		return suggestions;
	}

	/**
	 * TFile을 AutocompleteSuggestion으로 변환
	 */
	private fileToSuggestion(file: TFile): AutocompleteSuggestion {
		return {
			type: 'file',
			path: file.path,
			displayName: file.name,
			parentPath: file.parent?.path || '',
			extension: file.extension,
			icon: getFileIcon(file.path),
			score: 0,
		};
	}

	/**
	 * TFolder를 AutocompleteSuggestion으로 변환
	 */
	private folderToSuggestion(folder: TFolder): AutocompleteSuggestion {
		return {
			type: 'folder',
			path: folder.path + '/',
			displayName: folder.name,
			parentPath: folder.parent?.path || '',
			extension: '',
			icon: 'folder',
			score: 0,
		};
	}

	/**
	 * 파일 크기 포맷팅
	 */
	private formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	/**
	 * 리소스 정리
	 */
	destroy(): void {
		// 이벤트 리스너 해제
		for (const unref of this.eventRefs) {
			unref();
		}
		this.eventRefs = [];
		this.cache = [];
	}
}
