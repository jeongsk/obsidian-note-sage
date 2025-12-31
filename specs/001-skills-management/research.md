# Research: Skills 관리 기능

**Feature**: 001-skills-management
**Date**: 2025-12-31
**Status**: Complete

---

## 1. Claude Agent SDK Skills 통합 방식

### Decision
SDK의 `settingSources`와 `allowedTools` 옵션을 사용하여 Skills를 활성화합니다.

### Rationale
- `settingSources`는 파일시스템에서 Skills를 로드하기 위한 필수 설정
- `allowedTools`에 "Skill"을 추가해야 Claude가 Skills를 사용할 수 있음
- 공식 문서에서 권장하는 표준 방식

### Implementation

```typescript
// AgentService.ts - buildQueryOptions() 확장
const options = {
  cwd: this.app.vault.adapter.basePath,  // Vault 경로
  settingSources: ["user", "project"],    // Skills 로드 활성화
  allowedTools: [...existingTools, "Skill"]  // Skill 도구 추가
};
```

### Alternatives Considered
1. **Skills 경로 직접 지정**: SDK가 직접 경로 지정을 지원하지 않음
2. **환경 변수 사용**: 복잡하고 플랫폼 의존적

---

## 2. YAML Frontmatter 파싱

### Decision
Obsidian의 내장 YAML 파서(`parseYaml`) 또는 직접 정규식 파싱을 사용합니다.

### Rationale
- Obsidian API에 `parseYaml` 함수가 존재할 수 있음
- 없을 경우 간단한 정규식으로 frontmatter 추출 가능
- 외부 라이브러리 의존성 최소화

### Implementation

```typescript
// SkillsManager.ts
function parseSkillMetadata(content: string): SkillMetadata | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const lines = frontmatter.split('\n');
  const metadata: Record<string, string> = {};

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      metadata[match[1]] = match[2].trim();
    }
  }

  return {
    name: metadata.name || '',
    description: metadata.description || ''
  };
}
```

### SKILL.md 표준 형식

```markdown
---
name: skill-name
description: 이 Skill이 언제 사용되는지 설명
---

# Skill Title

## Instructions

Claude가 따라야 할 단계별 지침...

## Examples

- Example 1: ...
- Example 2: ...
```

### Alternatives Considered
1. **js-yaml 라이브러리**: 번들 크기 증가
2. **gray-matter 라이브러리**: 과도한 기능

---

## 3. Obsidian Modal API

### Decision
- **빠른 생성**: `obsidian.TextInputModal` 또는 커스텀 간단 모달
- **마법사 UI**: `obsidian.Modal` 확장 클래스

### Rationale
- Obsidian의 기본 모달 API가 충분히 유연함
- 기존 MCP 서버 설정 모달 패턴 활용 가능

### Implementation

```typescript
// 빠른 생성 - 이름 입력 프롬프트
import { Modal, TextComponent, Setting } from 'obsidian';

class SkillNamePrompt extends Modal {
  private result: string | null = null;
  private onSubmit: (name: string) => void;

  constructor(app: App, onSubmit: (name: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
	this.setTitle(t('skills.createTemplate'));

    new Setting(contentEl)
      .setName(t('skills.name'))
      .addText(text => {
        text.setPlaceholder('my-skill');
        text.onChange(value => this.result = value);
      });

    new Setting(contentEl)
      .addButton(btn => btn
        .setButtonText(t('common.create'))
        .setCta()
        .onClick(() => {
          if (this.result) {
            this.onSubmit(this.result);
            this.close();
          }
        }));
  }
}
```

```typescript
// 마법사 UI - 상세 입력 폼
class SkillCreatorModal extends Modal {
  private name: string = '';
  private description: string = '';
  private previewEl: HTMLElement;

  onOpen() {
    // 이름 입력
    // 설명 입력
    // 실시간 미리보기
    // 생성 버튼
  }

  private updatePreview() {
    const content = this.generateSkillContent();
    this.previewEl.setText(content);
  }

  private generateSkillContent(): string {
    return `---
name: ${this.name}
description: ${this.description}
---

# ${this.name}

## Instructions

<!-- Add your instructions here -->

## Examples

<!-- Add examples here -->
`;
  }
}
```

### Alternatives Considered
1. **HTML 폼 직접 구현**: Obsidian 스타일과 불일치
2. **외부 UI 라이브러리**: 불필요한 복잡성

---

## 4. 기존 코드베이스 패턴 분석

### MCP 서버 관리 패턴 (src/mcp/)

| 파일 | 역할 | Skills 대응 |
|------|------|------------|
| McpServerManager.ts | 서버 상태 관리 | SkillsManager.ts |
| McpSettingsUI.ts | 설정 UI 렌더링 | SettingsTab 내 통합 |
| McpToolsPanel.ts | 도구 패널 | 불필요 (Skills는 자동 호출) |

### SettingsTab.ts 패턴

```typescript
// 기존 패턴 (참고용)
private renderMcpSettings(containerEl: HTMLElement): void {
  containerEl.createEl('h3', { text: t('settings.mcp.title') });
  // 토글, 목록, 버튼 렌더링
}

// Skills 섹션도 동일 패턴 적용
private renderSkillsSettings(containerEl: HTMLElement): void {
  containerEl.createEl('h3', { text: t('settings.skills.title') });
  // Skills 활성화 토글
  // Skills 목록 렌더링
  // 생성 버튼들
}
```

---

## 5. 핵심 결정 사항 요약

| 항목 | 결정 | 비고 |
|------|------|------|
| SDK 통합 | `settingSources` + `allowedTools` | 공식 권장 방식 |
| YAML 파싱 | 정규식 기반 직접 파싱 | 외부 의존성 없음 |
| 이름 입력 | Obsidian Modal 확장 | 기존 패턴 활용 |
| 마법사 UI | Modal 확장 + 실시간 미리보기 | UX 향상 |
| 파일 생성 | `vault.create()` API | 표준 Obsidian 방식 |
| 파일 삭제 | `vault.delete()` + 확인 다이얼로그 | 안전성 확보 |

---

## 참고 자료

- [Claude Agent SDK Skills 문서](https://platform.claude.com/docs/en/agent-sdk/skills)
- [Obsidian API 문서](https://docs.obsidian.md/Reference/TypeScript+API)
- 기존 코드: `src/mcp/McpSettingsUI.ts`
