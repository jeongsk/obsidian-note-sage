# Quickstart: Skills 관리 기능 구현

**Feature**: 001-skills-management
**Date**: 2025-12-31

---

## 개발 환경 설정

```bash
# 프로젝트 클론 및 설치
cd obsidian-note-sage
npm install

# 개발 모드 실행
npm run dev

# 테스트
npm run test
```

---

## 구현 순서

### Phase 1: 타입 정의

**파일**: `src/types.ts`

```typescript
// 1. 인터페이스 추가
export interface SkillMetadata {
  name: string;
  description: string;
}

export interface SkillEntry {
  id: string;
  path: string;
  metadata: SkillMetadata;
  enabled: boolean;
  hasError: boolean;
  errorMessage?: string;
}

// 2. NoteSageSettings 확장
export interface NoteSageSettings {
  // ... 기존 필드
  enableSkills?: boolean;
  disabledSkills?: string[];
}

// 3. DEFAULT_SETTINGS 업데이트
export const DEFAULT_SETTINGS: Partial<NoteSageSettings> = {
  // ... 기존 값
  enableSkills: false,
  disabledSkills: []
};
```

---

### Phase 2: SkillsManager 구현

**파일**: `src/skills/SkillsManager.ts`

```typescript
import { App, TFolder, TFile } from 'obsidian';
import { SkillEntry, SkillMetadata } from '../types';

export class SkillsManager {
  private app: App;
  private skillsPath = '.claude/skills';

  constructor(app: App) {
    this.app = app;
  }

  /**
   * Skills 디렉토리 스캔
   */
  async scanSkills(): Promise<SkillEntry[]> {
    const skills: SkillEntry[] = [];
    const skillsFolder = this.app.vault.getAbstractFileByPath(this.skillsPath);

    if (!(skillsFolder instanceof TFolder)) {
      return skills;
    }

    for (const child of skillsFolder.children) {
      if (child instanceof TFolder) {
        const skillFile = this.app.vault.getAbstractFileByPath(
          `${child.path}/SKILL.md`
        );
        if (skillFile instanceof TFile) {
          const entry = await this.parseSkillFile(child.name, skillFile);
          skills.push(entry);
        }
      }
    }

    return skills;
  }

  /**
   * SKILL.md 파싱
   */
  private async parseSkillFile(id: string, file: TFile): Promise<SkillEntry> {
    try {
      const content = await this.app.vault.read(file);
      const metadata = this.parseMetadata(content);

      return {
        id,
        path: file.path,
        metadata,
        enabled: true,
        hasError: false
      };
    } catch (error) {
      return {
        id,
        path: file.path,
        metadata: { name: id, description: '' },
        enabled: false,
        hasError: true,
        errorMessage: error.message
      };
    }
  }

  /**
   * YAML frontmatter 파싱
   */
  private parseMetadata(content: string): SkillMetadata {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      throw new Error('YAML frontmatter not found');
    }

    const frontmatter = match[1];
    const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim() || '';
    const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim() || '';

    if (!name) {
      throw new Error('name field is required');
    }

    return { name, description };
  }

  /**
   * Skills 디렉토리 생성
   */
  async ensureSkillsDirectory(): Promise<void> {
    const exists = this.app.vault.getAbstractFileByPath(this.skillsPath);
    if (!exists) {
      await this.app.vault.createFolder(this.skillsPath);
    }
  }

  /**
   * Skill 생성 (템플릿)
   */
  async createSkillFromTemplate(name: string): Promise<string> {
    await this.ensureSkillsDirectory();

    const skillPath = `${this.skillsPath}/${name}`;
    await this.app.vault.createFolder(skillPath);

    const content = this.generateTemplate(name);
    const filePath = `${skillPath}/SKILL.md`;
    await this.app.vault.create(filePath, content);

    return filePath;
  }

  /**
   * Skill 삭제
   */
  async deleteSkill(id: string): Promise<void> {
    const skillPath = `${this.skillsPath}/${id}`;
    const folder = this.app.vault.getAbstractFileByPath(skillPath);
    if (folder instanceof TFolder) {
      await this.app.vault.delete(folder, true);
    }
  }

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
}
```

---

### Phase 3: 설정 UI 구현

**파일**: `src/SettingsTab.ts` (메서드 추가)

```typescript
private renderSkillsSettings(containerEl: HTMLElement): void {
  containerEl.createEl('h3', { text: t('settings.skills.title') });

  // Skills 활성화 토글
  new Setting(containerEl)
    .setName(t('settings.skills.enable'))
    .setDesc(t('settings.skills.enableDesc'))
    .addToggle(toggle => toggle
      .setValue(this.plugin.settings.enableSkills ?? false)
      .onChange(async value => {
        this.plugin.settings.enableSkills = value;
        await this.plugin.saveSettings();
        this.display(); // UI 갱신
      })
    );

  if (!this.plugin.settings.enableSkills) {
    return;
  }

  // Skills 목록
  const listContainer = containerEl.createDiv('sage-skills-list');
  this.renderSkillsList(listContainer);

  // 생성 버튼들
  const buttonContainer = containerEl.createDiv('sage-skills-buttons');

  new Setting(buttonContainer)
    .addButton(btn => btn
      .setButtonText(t('settings.skills.createTemplate'))
      .onClick(() => this.openSkillNamePrompt()))
    .addButton(btn => btn
      .setButtonText(t('settings.skills.createWizard'))
      .setCta()
      .onClick(() => this.openSkillCreatorModal()));
}
```

---

### Phase 4: SDK 통합

**파일**: `src/AgentService.ts`

```typescript
// buildQueryOptions() 확장
private buildQueryOptions(): QueryOptions {
  const settings = this.plugin.settings;
  const options: QueryOptions = {
    cwd: this.app.vault.adapter.basePath,
    // ... 기존 옵션
  };

  // Skills 활성화
  if (settings.enableSkills) {
    options.settingSources = ['user', 'project'];
    options.allowedTools = [
      ...(options.allowedTools || []),
      'Skill'
    ];
  }

  return options;
}
```

---

## 테스트

### 단위 테스트

```typescript
// tests/unit/skills/SkillsManager.test.ts
import { describe, it, expect } from 'vitest';

describe('SkillsManager', () => {
  describe('parseMetadata', () => {
    it('should parse valid YAML frontmatter', () => {
      const content = `---
name: test-skill
description: Test description
---

# Content`;

      // 파싱 테스트
    });

    it('should throw error for missing name', () => {
      // 오류 케이스 테스트
    });
  });
});
```

### 수동 테스트

1. `.claude/skills/test-skill/SKILL.md` 생성
2. 설정 탭에서 Skills 활성화
3. Skills 목록에 표시 확인
4. 토글 ON/OFF 테스트
5. 빠른 생성 테스트
6. 마법사 생성 테스트
7. 삭제 테스트

---

## 체크리스트

- [ ] `src/types.ts` - 타입 정의
- [ ] `src/skills/SkillsManager.ts` - 핵심 로직
- [ ] `src/skills/SkillDetailModal.ts` - 상세 보기
- [ ] `src/skills/SkillCreatorModal.ts` - 마법사 UI
- [ ] `src/SettingsTab.ts` - 설정 UI
- [ ] `src/AgentService.ts` - SDK 통합
- [ ] `src/i18n/locales/*.ts` - 11개 언어 번역
- [ ] `src/styles/main.css` - 스타일
- [ ] `tests/unit/skills/*.test.ts` - 테스트
