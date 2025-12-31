import { App, TFolder } from 'obsidian';
import type { SkillEntry, SkillMetadata } from '../types';

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
	 * @returns 생성된 SKILL.md 파일 경로
	 * @throws Error SKILL.md 파일이 이미 존재하는 경우
	 */
	async createSkillFromTemplate(
		name: string,
		description = ''
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

		const content = this.generateTemplate(name, description);

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
	 * Skill 삭제
	 *
	 * @param id Skill 디렉토리명
	 */
	async deleteSkill(id: string): Promise<void> {
		const skillPath = `${this.skillsPath}/${id}`;
		const folder = this.app.vault.getAbstractFileByPath(skillPath);
		if (folder instanceof TFolder) {
			await this.app.vault.delete(folder, true);
		}
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
	 * @returns SKILL.md 파일 내용
	 */
	private generateTemplate(name: string, description = ''): string {
		return `---
name: ${name}
description: ${description || 'Add your Skill description here'}
---

# ${name}

## Instructions

<!-- Add your instructions here -->

## Examples

<!-- Add examples here -->
`;
	}

	/**
	 * Skills 디렉토리 경로 반환
	 */
	getSkillsPath(): string {
		return this.skillsPath;
	}
}
