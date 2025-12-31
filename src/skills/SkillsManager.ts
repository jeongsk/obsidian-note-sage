import { App, TFolder } from 'obsidian';
import type { SkillEntry, SkillMetadata } from '../types';

/**
 * YAML frontmatter 검증 결과
 */
export interface FrontmatterValidationResult {
	valid: boolean;
	metadata?: SkillMetadata;
	errors: string[];
}

/**
 * Skill 삭제 결과
 */
export interface DeleteSkillResult {
	success: boolean;
	error?: string;
	canUndo?: boolean;
}

/**
 * 삭제된 Skill 백업 정보
 */
interface DeletedSkillBackup {
	id: string;
	content: string;
	metadata: SkillMetadata;
	deletedAt: number;
	timerId: ReturnType<typeof setTimeout>;
}

/**
 * Skills 관리자
 *
 * @description
 * .claude/skills/ 디렉토리의 Skills를 탐지, 파싱, 관리합니다.
 * Claude Agent SDK와 통합하여 사용자 정의 Skills를 활성화합니다.
 */
export class SkillsManager {
	private app: App;
	private readonly skillsPath = '.claude/skills';
	private readonly UNDO_TIMEOUT = 10000; // 10초
	private deletedSkillsBackup: Map<string, DeletedSkillBackup> = new Map();

	constructor(app: App) {
		this.app = app;
	}

	/**
	 * Skills 디렉토리 스캔
	 *
	 * @description
	 * .claude/skills/ 디렉토리를 스캔하여 유효한 Skills를 찾습니다.
	 * vault.adapter를 사용하여 파일 시스템을 직접 스캔합니다.
	 *
	 * @returns 탐지된 Skills 목록
	 */
	async scanSkills(): Promise<SkillEntry[]> {
		const skills: SkillEntry[] = [];

		// 파일 시스템에서 직접 Skills 디렉토리 존재 확인
		const skillsDirExists = await this.app.vault.adapter.exists(this.skillsPath);
		if (!skillsDirExists) {
			return skills;
		}

		// 디렉토리 내용 스캔
		const listedFiles = await this.app.vault.adapter.list(this.skillsPath);

		for (const folderPath of listedFiles.folders) {
			const skillName = folderPath.split('/').pop() || '';
			const skillFilePath = `${folderPath}/SKILL.md`;

			// SKILL.md 파일 존재 확인
			const skillFileExists = await this.app.vault.adapter.exists(skillFilePath);
			if (skillFileExists) {
				const entry = await this.parseSkillFileFromPath(skillName, skillFilePath);
				skills.push(entry);
			}
		}

		return skills;
	}

	/**
	 * SKILL.md 파일 파싱 (파일 경로 사용)
	 *
	 * @description
	 * vault.adapter를 사용하여 파일을 직접 읽고 파싱합니다.
	 *
	 * @param id Skill 디렉토리명
	 * @param filePath SKILL.md 파일 경로
	 * @returns SkillEntry
	 */
	private async parseSkillFileFromPath(id: string, filePath: string): Promise<SkillEntry> {
		try {
			const content = await this.app.vault.adapter.read(filePath);
			const metadata = this.parseMetadata(content);

			return {
				id,
				path: filePath,
				metadata,
				enabled: true,
				hasError: false,
			};
		} catch (error) {
			return {
				id,
				path: filePath,
				metadata: { name: id, description: '' },
				enabled: false,
				hasError: true,
				errorMessage: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * YAML frontmatter 파싱
	 *
	 * @param content SKILL.md 파일 내용
	 * @returns SkillMetadata
	 * @throws Error YAML frontmatter가 없거나 name 필드가 없는 경우
	 */
	parseMetadata(content: string): SkillMetadata {
		const match = content.match(/^---\n([\s\S]*?)\n---/);
		if (!match) {
			throw new Error('YAML frontmatter not found');
		}

		const frontmatter = match[1];
		const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim() || '';
		const description =
			frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim() || '';

		if (!name) {
			throw new Error('name field is required');
		}

		return { name, description };
	}

	/**
	 * SKILL.md 콘텐츠의 YAML frontmatter 유효성 검사
	 *
	 * @description
	 * name과 description 필드의 존재 및 형식을 검증합니다.
	 * AI 생성 콘텐츠의 품질을 보장하기 위해 사용됩니다.
	 *
	 * @param content SKILL.md 파일 내용
	 * @returns 검증 결과 (유효 여부, 메타데이터, 에러 목록)
	 */
	validateFrontmatter(content: string): FrontmatterValidationResult {
		const errors: string[] = [];

		// 1. YAML frontmatter 존재 확인
		const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
		if (!frontmatterMatch) {
			errors.push('YAML frontmatter not found (must start with --- and end with ---)');
			return { valid: false, errors };
		}

		const frontmatter = frontmatterMatch[1];

		// 2. name 필드 검증
		const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
		if (!nameMatch) {
			errors.push('Required field "name" is missing in frontmatter');
		} else {
			const name = nameMatch[1].trim().replace(/['"]/g, '');
			if (!name) {
				errors.push('Field "name" cannot be empty');
			} else {
				// kebab-case 검증
				const nameValidation = this.validateSkillName(name);
				if (!nameValidation.valid) {
					errors.push(`Invalid name format: ${nameValidation.error}`);
				}
			}
		}

		// 3. description 필드 검증
		const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
		if (!descMatch) {
			errors.push('Required field "description" is missing in frontmatter');
		} else {
			const description = descMatch[1].trim().replace(/['"]/g, '');
			if (!description || description.length < 20) {
				errors.push('Field "description" must be at least 20 characters');
			}
		}

		// 결과 반환
		if (errors.length > 0) {
			return { valid: false, errors };
		}

		try {
			const metadata = this.parseMetadata(content);
			return { valid: true, metadata, errors: [] };
		} catch (e) {
			return { valid: false, errors: [e instanceof Error ? e.message : String(e)] };
		}
	}

	/**
	 * Skills 디렉토리 존재 확인 및 생성
	 *
	 * @description
	 * .claude/skills/ 디렉토리가 없으면 자동으로 생성합니다.
	 * 이미 존재하는 경우 에러를 무시합니다.
	 */
	async ensureSkillsDirectory(): Promise<void> {
		// .claude 디렉토리 확인/생성
		const claudeDir = '.claude';
		const claudeFolder = this.app.vault.getAbstractFileByPath(claudeDir);
		if (!(claudeFolder instanceof TFolder)) {
			try {
				await this.app.vault.createFolder(claudeDir);
			} catch (error) {
				// 폴더가 이미 존재하는 경우 무시 (race condition 방지)
				if (!(error instanceof Error && error.message.includes('already exists'))) {
					throw error;
				}
			}
		}

		// .claude/skills 디렉토리 확인/생성
		const skillsFolder = this.app.vault.getAbstractFileByPath(this.skillsPath);
		if (!(skillsFolder instanceof TFolder)) {
			try {
				await this.app.vault.createFolder(this.skillsPath);
			} catch (error) {
				// 폴더가 이미 존재하는 경우 무시 (race condition 방지)
				if (!(error instanceof Error && error.message.includes('already exists'))) {
					throw error;
				}
			}
		}
	}

	/**
	 * 템플릿으로 Skill 생성
	 *
	 * @param name Skill 이름 (kebab-case)
	 * @param description Skill 설명 (선택)
	 * @param instructions Instructions 섹션 내용 (선택)
	 * @param examples Examples 섹션 내용 (선택)
	 * @returns 생성된 SKILL.md 파일 경로
	 * @throws Error SKILL.md 파일이 이미 존재하는 경우
	 */
	async createSkillFromTemplate(
		name: string,
		description = '',
		instructions = '',
		examples = ''
	): Promise<string> {
		await this.ensureSkillsDirectory();

		const skillPath = `${this.skillsPath}/${name}`;
		const filePath = `${skillPath}/SKILL.md`;

		// 파일 시스템에서 직접 SKILL.md 파일 존재 여부 확인
		const fileExists = await this.app.vault.adapter.exists(filePath);
		if (fileExists) {
			throw new Error(`Skill "${name}" already exists`);
		}

		// 폴더 생성 (이미 존재하면 무시)
		const folderExists = await this.app.vault.adapter.exists(skillPath);
		if (!folderExists) {
			try {
				await this.app.vault.createFolder(skillPath);
			} catch (error) {
				// 폴더가 이미 존재하는 경우 무시 (race condition 방지)
				if (!(error instanceof Error && error.message.includes('already exists'))) {
					throw error;
				}
			}
		}

		const content = this.generateTemplate(name, description, instructions, examples);

		try {
			await this.app.vault.create(filePath, content);
		} catch (error) {
			// 파일이 이미 존재하는 경우 명확한 에러 메시지
			if (error instanceof Error && error.message.includes('already exists')) {
				throw new Error(`Skill "${name}" already exists`);
			}
			throw error;
		}

		return filePath;
	}

	/**
	 * AI가 생성한 내용으로 Skill 파일 생성
	 *
	 * @param name Skill 이름 (kebab-case)
	 * @param content 전체 SKILL.md 내용 (frontmatter 포함)
	 */
	async createSkillFromContent(name: string, content: string): Promise<string> {
		await this.ensureSkillsDirectory();

		const skillPath = `${this.skillsPath}/${name}`;
		const filePath = `${skillPath}/SKILL.md`;

		// 파일 시스템에서 직접 SKILL.md 파일 존재 여부 확인
		const fileExists = await this.app.vault.adapter.exists(filePath);
		if (fileExists) {
			throw new Error(`Skill "${name}" already exists`);
		}

		// 폴더 생성 (이미 존재하면 무시)
		const folderExists = await this.app.vault.adapter.exists(skillPath);
		if (!folderExists) {
			try {
				await this.app.vault.createFolder(skillPath);
			} catch (error) {
				// 폴더가 이미 존재하는 경우 무시 (race condition 방지)
				if (!(error instanceof Error && error.message.includes('already exists'))) {
					throw error;
				}
			}
		}

		try {
			await this.app.vault.create(filePath, content);
		} catch (error) {
			// 파일이 이미 존재하는 경우 명확한 에러 메시지
			if (error instanceof Error && error.message.includes('already exists')) {
				throw new Error(`Skill "${name}" already exists`);
			}
			throw error;
		}

		return filePath;
	}

	/**
	 * Skill 삭제 (기본)
	 *
	 * @param id Skill 디렉토리명
	 * @returns 삭제 결과
	 */
	async deleteSkill(id: string): Promise<DeleteSkillResult> {
		const skillPath = `${this.skillsPath}/${id}`;

		// 파일 시스템에서 존재 확인
		const exists = await this.app.vault.adapter.exists(skillPath);
		if (!exists) {
			return { success: false, error: 'Skill folder not found' };
		}

		try {
			// .claude/skills/는 숨김 폴더이므로 vault.adapter를 직접 사용하여 삭제
			await this.deleteSkillFolder(skillPath);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * Skill 삭제 (Undo 지원)
	 *
	 * @description
	 * Skill을 삭제하고 백업을 저장합니다.
	 * UNDO_TIMEOUT(10초) 내에 undoDelete()를 호출하면 복원할 수 있습니다.
	 *
	 * @param id Skill 디렉토리명
	 * @returns 삭제 결과 (canUndo: true면 Undo 가능)
	 */
	async deleteSkillWithUndo(id: string): Promise<DeleteSkillResult> {
		const skillPath = `${this.skillsPath}/${id}`;
		const skillFilePath = `${skillPath}/SKILL.md`;

		// 파일 시스템에서 존재 확인
		const exists = await this.app.vault.adapter.exists(skillFilePath);
		if (!exists) {
			return { success: false, error: 'Skill file not found' };
		}

		try {
			// 파일 내용 백업
			const content = await this.app.vault.adapter.read(skillFilePath);

			// 메타데이터 파싱 시도 (에러가 있는 스킬도 삭제 가능하도록)
			let metadata: SkillMetadata;
			try {
				metadata = this.parseMetadata(content);
			} catch {
				// 파싱 실패 시 기본 메타데이터 사용
				metadata = { name: id, description: '' };
			}

			// .claude/skills/는 숨김 폴더이므로 vault.adapter를 직접 사용하여 삭제
			await this.deleteSkillFolder(skillPath);

			// 기존 백업이 있으면 타이머 취소
			const existingBackup = this.deletedSkillsBackup.get(id);
			if (existingBackup) {
				clearTimeout(existingBackup.timerId);
			}

			// 백업 저장
			const backup: DeletedSkillBackup = {
				id,
				content,
				metadata,
				deletedAt: Date.now(),
				timerId: setTimeout(() => {
					this.deletedSkillsBackup.delete(id);
				}, this.UNDO_TIMEOUT),
			};
			this.deletedSkillsBackup.set(id, backup);

			return { success: true, canUndo: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * Skill 폴더 삭제 (재귀적)
	 *
	 * @description
	 * .claude/skills/ 폴더는 숨김 폴더이므로 vault.getAbstractFileByPath()가 인식하지 못합니다.
	 * 따라서 vault.adapter를 직접 사용하여 파일 시스템에서 삭제합니다.
	 *
	 * @param folderPath 삭제할 폴더 경로
	 */
	private async deleteSkillFolder(folderPath: string): Promise<void> {
		const adapter = this.app.vault.adapter;

		// 폴더 내용 확인
		const folderExists = await adapter.exists(folderPath);
		if (!folderExists) {
			return;
		}

		// 폴더 내 파일/폴더 목록 가져오기
		const listed = await adapter.list(folderPath);

		// 파일 먼저 삭제
		for (const file of listed.files) {
			await adapter.remove(file);
		}

		// 하위 폴더 재귀 삭제
		for (const subfolder of listed.folders) {
			await this.deleteSkillFolder(subfolder);
		}

		// 빈 폴더 삭제
		await adapter.rmdir(folderPath, false);
	}

	/**
	 * 삭제된 Skill 복원
	 *
	 * @description
	 * deleteSkillWithUndo()로 삭제된 Skill을 복원합니다.
	 * UNDO_TIMEOUT(10초) 내에 호출해야 합니다.
	 *
	 * @param id Skill 디렉토리명
	 * @returns 복원 성공 여부
	 */
	async undoDelete(id: string): Promise<DeleteSkillResult> {
		const backup = this.deletedSkillsBackup.get(id);
		if (!backup) {
			return { success: false, error: 'No backup found or undo timeout expired' };
		}

		try {
			// 타이머 취소
			clearTimeout(backup.timerId);

			// 폴더 및 파일 복원
			await this.ensureSkillsDirectory();
			const skillPath = `${this.skillsPath}/${id}`;

			// 폴더가 이미 존재하는지 확인
			const folderExists = await this.app.vault.adapter.exists(skillPath);
			if (!folderExists) {
				await this.app.vault.createFolder(skillPath);
			}

			// 파일 생성
			const filePath = `${skillPath}/SKILL.md`;
			await this.app.vault.create(filePath, backup.content);

			// 백업 제거
			this.deletedSkillsBackup.delete(id);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * Undo 가능 여부 확인
	 *
	 * @param id Skill 디렉토리명
	 * @returns Undo 가능 여부
	 */
	canUndoDelete(id: string): boolean {
		return this.deletedSkillsBackup.has(id);
	}

	/**
	 * Skill 이름 유효성 검사
	 *
	 * @param name Skill 이름
	 * @returns 유효성 검사 결과
	 */
	validateSkillName(name: string): { valid: boolean; error?: string } {
		if (!name || name.length === 0) {
			return { valid: false, error: 'Skill 이름은 필수입니다' };
		}

		if (name.length > 50) {
			return { valid: false, error: 'Skill 이름은 50자 이하여야 합니다' };
		}

		const SKILL_NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
		if (!SKILL_NAME_REGEX.test(name)) {
			return {
				valid: false,
				error: '영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다',
			};
		}

		return { valid: true };
	}

	/**
	 * 중복 Skill 이름 검사
	 *
	 * @param name Skill 이름
	 * @param existingSkills 기존 Skills 목록
	 * @returns 중복 여부
	 */
	async checkDuplicate(name: string, existingSkills: SkillEntry[]): Promise<boolean> {
		// 스캔된 Skills 목록에서 확인
		if (existingSkills.some((skill) => skill.id === name)) {
			return true;
		}

		// 파일 시스템에서 직접 폴더/파일 존재 여부 확인
		const skillPath = `${this.skillsPath}/${name}`;
		const filePath = `${skillPath}/SKILL.md`;

		// SKILL.md 파일 또는 폴더가 존재하면 중복
		const fileExists = await this.app.vault.adapter.exists(filePath);
		if (fileExists) {
			return true;
		}

		const folderExists = await this.app.vault.adapter.exists(skillPath);
		return folderExists;
	}

	/**
	 * SKILL.md 템플릿 생성
	 *
	 * @param name Skill 이름
	 * @param description Skill 설명
	 * @param instructions Instructions 섹션 내용
	 * @param examples Examples 섹션 내용
	 * @returns SKILL.md 파일 내용
	 */
	private generateTemplate(
		name: string,
		description = '',
		instructions = '',
		examples = ''
	): string {
		const instructionsContent = instructions || '<!-- Add your instructions here -->';
		const examplesContent = examples || '<!-- Add examples here -->';

		return `---
name: ${name}
description: ${description || 'Add your Skill description here'}
---

# ${name}

## Instructions

${instructionsContent}

## Examples

${examplesContent}
`;
	}

	/**
	 * Skills 디렉토리 경로 반환
	 */
	getSkillsPath(): string {
		return this.skillsPath;
	}
}
