# Data Model: Skills 관리 기능

**Feature**: 001-skills-management
**Date**: 2025-12-31

---

## Entities

### 1. SkillMetadata

SKILL.md 파일의 YAML frontmatter에서 추출한 메타데이터입니다.

```typescript
/**
 * SKILL.md 파일의 YAML frontmatter에서 추출한 메타데이터
 */
interface SkillMetadata {
  /** Skill 식별자 (kebab-case, 예: "processing-pdfs") */
  name: string;

  /** Skill 설명 - Claude가 자동 호출 판단에 사용 */
  description: string;
}
```

### 2. SkillEntry

Vault 내 탐지된 Skill의 전체 정보입니다.

```typescript
/**
 * Vault 내 탐지된 Skill
 */
interface SkillEntry {
  /** Skill 디렉토리명 (예: "my-skill") */
  id: string;

  /** SKILL.md 파일의 절대 경로 */
  path: string;

  /** SKILL.md에서 추출한 메타데이터 */
  metadata: SkillMetadata;

  /** 활성화 상태 (기본값: true) */
  enabled: boolean;

  /** 파싱 오류 여부 */
  hasError: boolean;

  /** 오류 메시지 (hasError가 true일 때) */
  errorMessage?: string;
}
```

### 3. SkillsSettings (NoteSageSettings 확장)

플러그인 설정에 추가되는 Skills 관련 설정입니다.

```typescript
/**
 * NoteSageSettings에 추가되는 Skills 관련 필드
 */
interface SkillsSettings {
  /** Skills 기능 전체 활성화 여부 (기본값: false) */
  enableSkills: boolean;

  /** 비활성화된 Skill ID 목록 */
  disabledSkills: string[];
}
```

---

## Relationships

```text
NoteSageSettings
    │
    ├── enableSkills: boolean
    └── disabledSkills: string[]
            │
            ▼
    ┌───────────────────┐
    │   SkillEntry[]    │  (런타임 - 파일시스템에서 스캔)
    │   - id            │
    │   - path          │
    │   - enabled       │◄─── disabledSkills.includes(id) ? false : true
    │   - metadata      │
    │       └── SkillMetadata
    │           - name
    │           - description
    └───────────────────┘
```

---

## State Transitions

### Skill 상태

```text
                    ┌──────────────┐
                    │   DETECTED   │  (파일시스템에서 발견)
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │  ENABLED  │   │ DISABLED  │   │   ERROR   │
    │           │   │           │   │           │
    │ (활성화)  │   │ (비활성화)│   │ (파싱오류)│
    └─────┬─────┘   └─────┬─────┘   └───────────┘
          │               │
          └───────┬───────┘
                  ▼
          ┌───────────┐
          │  DELETED  │  (파일 삭제됨)
          └───────────┘
```

### 상태 전환 트리거

| From | To | Trigger |
|------|-----|---------|
| - | DETECTED | 설정 탭 진입 시 스캔 |
| DETECTED | ENABLED | 정상 파싱 + disabledSkills에 없음 |
| DETECTED | DISABLED | 정상 파싱 + disabledSkills에 있음 |
| DETECTED | ERROR | YAML 파싱 실패 |
| ENABLED | DISABLED | 사용자가 토글 OFF |
| DISABLED | ENABLED | 사용자가 토글 ON |
| * | DELETED | 삭제 버튼 클릭 + 확인 |

---

## Validation Rules

### Skill 이름 (id)

```typescript
const SKILL_NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validateSkillName(name: string): { valid: boolean; error?: string } {
  if (!name || name.length === 0) {
    return { valid: false, error: 'Skill 이름은 필수입니다' };
  }

  if (name.length > 50) {
    return { valid: false, error: 'Skill 이름은 50자 이하여야 합니다' };
  }

  if (!SKILL_NAME_REGEX.test(name)) {
    return {
      valid: false,
      error: '영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다'
    };
  }

  return { valid: true };
}
```

### 중복 검사

```typescript
function checkDuplicate(name: string, existingSkills: SkillEntry[]): boolean {
  return existingSkills.some(skill => skill.id === name);
}
```

---

## File System Structure

```text
{vault}/
└── .claude/
    └── skills/
        ├── my-first-skill/
        │   └── SKILL.md
        ├── another-skill/
        │   └── SKILL.md
        └── broken-skill/
            └── SKILL.md  (파싱 오류 시 ERROR 상태)
```

---

## Default Values

```typescript
const DEFAULT_SKILLS_SETTINGS: SkillsSettings = {
  enableSkills: false,
  disabledSkills: []
};

const SKILL_TEMPLATE = `---
name: {{skillName}}
description: {{skillDescription}}
---

# {{skillName}}

## Instructions

<!-- Add your instructions here -->

## Examples

<!-- Add examples here -->
`;
```

---

## Integration Points

### AgentService.ts

```typescript
// buildQueryOptions() 메서드 확장
if (settings.enableSkills) {
  options.settingSources = ['user', 'project'];
  options.allowedTools = [...(options.allowedTools || []), 'Skill'];
}
```

### SettingsTab.ts

```typescript
// 새 섹션 추가
private renderSkillsSettings(containerEl: HTMLElement): void {
  // enableSkills 토글
  // Skills 목록 (SkillEntry[])
  // 생성 버튼 (템플릿, 마법사)
}
```
