# Feature Specification: Skills 관리 기능

**Feature Branch**: `001-skills-management`
**Created**: 2025-12-31
**Status**: Draft
**Input**: User description: "Claude Agent SDK Skills 기능을 Note Sage에 추가 - 사용자가 Skills를 쉽게 관리하고 활용할 수 있도록 구현"

---

## 개요

Claude Agent SDK의 Skills 기능을 Note Sage 플러그인에 통합하여, 사용자가 전문화된 AI 기능(Skills)을 손쉽게 관리하고 활용할 수 있도록 합니다.

### Skills란?

- `.claude/skills/SKILL.md` 파일로 정의되는 전문화된 기능 패키지
- Claude가 문맥에 따라 자동으로 호출
- YAML frontmatter + Markdown 형식으로 구성

---

## Clarifications

### Session 2025-12-31

- Q: 마법사 UI에서 입력 가능한 SKILL.md 필드는? → A: 핵심 필드만 (name, description)
- Q: 빠른 생성 시 Skill 이름 입력 방식은? → A: 간단한 이름 입력 프롬프트 (Obsidian 기본 모달)
- Q: Skill 삭제 기능 제공 여부는? → A: 삭제 버튼 제공 + 확인 다이얼로그
- Q: 비활성화된 Skill의 UI 표시 방식은? → A: 흐린(dimmed) 스타일 + 토글 OFF 상태로 표시

---

## User Scenarios & Testing

### User Story 1 - Skills 활성화/비활성화 (Priority: P1)

사용자가 Note Sage 설정에서 Skills 기능을 활성화하거나 비활성화할 수 있습니다. Skills가 활성화되면 Claude가 대화 중 적절한 시점에 자동으로 Skills를 호출합니다.

**Why this priority**: Skills 기능의 기본 토글은 모든 하위 기능의 전제조건이며, 사용자가 원치 않을 때 비활성화할 수 있어야 합니다.

**Independent Test**: 설정에서 Skills 토글을 켜고/끄면 Claude 응답에서 Skill 사용 여부가 달라지는지 확인

**Acceptance Scenarios**:

1. **Given** 사용자가 설정 탭에 있을 때, **When** "Skills 활성화" 토글을 켜면, **Then** Claude SDK에 `allowed_tools`에 "Skill"이 추가됨
2. **Given** Skills가 활성화된 상태에서, **When** 사용자가 관련 질문을 하면, **Then** Claude가 적절한 Skill을 자동으로 호출함
3. **Given** Skills가 비활성화된 상태에서, **When** 사용자가 질문을 하면, **Then** Skills가 호출되지 않음

---

### User Story 2 - 프로젝트 Skills 자동 탐지 (Priority: P1)

현재 Vault의 `.claude/skills/` 디렉토리에 있는 Skills를 자동으로 탐지하고 목록으로 표시합니다.

**Why this priority**: 사용자가 수동으로 Skills 경로를 입력하지 않아도 자동으로 탐지되어야 편의성이 높아집니다.

**Independent Test**: `.claude/skills/`에 SKILL.md 파일을 추가하면 설정에서 자동으로 목록에 표시되는지 확인

**Acceptance Scenarios**:

1. **Given** Vault에 `.claude/skills/my-skill/SKILL.md`가 있을 때, **When** 설정 탭을 열면, **Then** "my-skill"이 Skills 목록에 표시됨
2. **Given** Skills 목록이 표시될 때, **When** 각 Skill을 보면, **Then** 이름, 설명(description)이 표시됨
3. **Given** `.claude/skills/` 디렉토리가 없을 때, **When** 설정 탭을 열면, **Then** "Skills 없음" 메시지와 생성 가이드가 표시됨

---

### User Story 3 - 개별 Skill 활성화/비활성화 (Priority: P2)

탐지된 Skills 중에서 개별적으로 활성화하거나 비활성화할 수 있습니다.

**Why this priority**: 모든 Skills가 아닌 필요한 Skills만 사용하고 싶을 수 있습니다.

**Independent Test**: 특정 Skill만 비활성화하면 해당 Skill이 호출되지 않는지 확인

**Acceptance Scenarios**:

1. **Given** 여러 Skills가 탐지된 상태에서, **When** 특정 Skill의 토글을 끄면, **Then** 해당 Skill은 Claude에 전달되지 않음
2. **Given** 비활성화된 Skill이 있을 때, **When** Skills 목록을 보면, **Then** 해당 Skill은 흐린(dimmed) 스타일 + 토글 OFF 상태로 표시됨
3. **Given** 비활성화된 Skill이 있을 때, **When** 설정을 저장하고 재시작해도, **Then** 비활성화 상태가 유지됨

---

### User Story 4 - Skill 상세 정보 보기 (Priority: P2)

Skill을 클릭하면 전체 내용(SKILL.md)을 볼 수 있습니다.

**Why this priority**: 사용자가 Skill이 어떤 역할을 하는지 이해해야 올바르게 사용할 수 있습니다.

**Independent Test**: Skill 항목을 클릭하면 모달에서 SKILL.md 내용이 표시되는지 확인

**Acceptance Scenarios**:

1. **Given** Skills 목록이 표시될 때, **When** Skill 이름을 클릭하면, **Then** 모달에서 SKILL.md 전체 내용이 표시됨
2. **Given** 모달이 열려 있을 때, **When** 닫기 버튼이나 ESC를 누르면, **Then** 모달이 닫힘

---

### User Story 5 - 새 Skill 생성 (Priority: P2)

사용자가 새로운 Skill을 생성할 수 있는 두 가지 방식을 제공합니다:
1. **빠른 생성**: 기본 SKILL.md 템플릿을 즉시 생성하여 직접 편집
2. **마법사 UI**: 폼을 통해 이름, 설명 등을 입력하고 생성

**Why this priority**: 사용자 편의성 우선 - 숙련된 사용자는 빠른 생성으로 즉시 템플릿을 편집하고, 초보자는 마법사를 통해 단계별로 생성할 수 있습니다.

**Independent Test**: 두 가지 생성 방식 모두 올바른 SKILL.md 파일이 생성되는지 확인

**Acceptance Scenarios - 빠른 생성**:

1. **Given** 설정의 Skills 섹션에서, **When** "템플릿으로 생성" 버튼을 클릭하면, **Then** Obsidian 기본 모달로 Skill 이름 입력 프롬프트가 표시됨
2. **Given** 이름 입력 프롬프트에서, **When** 유효한 Skill 이름을 입력하면, **Then** `.claude/skills/{skill-name}/SKILL.md` 경로에 기본 템플릿 파일 생성
3. **Given** 템플릿이 생성되면, **When** 생성이 완료되면, **Then** Obsidian 편집기에서 해당 파일이 자동으로 열림

**Acceptance Scenarios - 마법사 UI**:

1. **Given** 설정의 Skills 섹션에서, **When** "마법사로 생성" 버튼을 클릭하면, **Then** Skill 생성 마법사 모달이 열림
2. **Given** 마법사에서, **When** Skill 이름과 설명을 입력하면, **Then** 실시간 미리보기로 생성될 SKILL.md 내용이 표시됨
3. **Given** 마법사에서 필수 정보 입력 후, **When** "생성" 버튼을 클릭하면, **Then** `.claude/skills/{skill-name}/SKILL.md` 파일이 생성되고 목록에 추가됨
4. **Given** 마법사에서, **When** 이미 존재하는 Skill 이름을 입력하면, **Then** 경고 메시지가 표시됨

---

### Edge Cases

- **디렉토리 없음**: Skills 활성화 시 `.claude/skills/` 디렉토리를 **자동 생성**
- **YAML 파싱 오류**: 에러 메시지와 함께 해당 Skill을 "오류" 상태로 표시, 비활성화 처리
- **특수문자 처리**: Skill 이름에서 영문, 숫자, 하이픈(-)만 허용, 공백은 하이픈으로 변환
- **중복 이름**: 마법사에서 실시간 중복 검사, 생성 차단
- **삭제 확인**: 삭제 버튼 클릭 시 확인 다이얼로그 표시, 취소 가능

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST SDK의 `setting_sources` 옵션에 `["user", "project"]`를 전달하여 Skills 로드 활성화
- **FR-002**: System MUST `allowed_tools`에 "Skill"을 추가하여 Skill 도구 활성화
- **FR-003**: System MUST Vault의 `.claude/skills/` 디렉토리를 스캔하여 SKILL.md 파일 탐지
- **FR-004**: System MUST 각 SKILL.md의 YAML frontmatter를 파싱하여 name, description 추출
- **FR-005**: Users MUST be able to 전체 Skills 기능 활성화/비활성화 토글
- **FR-006**: Users MUST be able to 개별 Skill 활성화/비활성화
- **FR-007**: System MUST 비활성화된 Skills 설정을 플러그인 데이터에 저장
- **FR-008**: System MUST Skills 목록을 설정 UI에서 표시
- **FR-009**: Users MUST be able to Skill 상세 내용(SKILL.md) 보기
- **FR-010**: System MUST `.claude/skills/` 디렉토리가 없으면 Skills 활성화 시 자동 생성
- **FR-011**: System MUST Skill 생성 마법사 UI 제공 (핵심 필드만: name, description 입력 폼)
- **FR-012**: System MUST 마법사에서 실시간 SKILL.md 미리보기 표시
- **FR-013**: System MUST Skill 이름 유효성 검사 (영문, 숫자, 하이픈만 허용)
- **FR-014**: System MUST 중복 Skill 이름 생성 시 경고 및 차단
- **FR-015**: Users MUST be able to Skill 삭제 (확인 다이얼로그 표시 후 파일 시스템에서 삭제)
- **FR-016**: System MUST 빠른 생성 시 Obsidian 기본 모달로 Skill 이름 입력 프롬프트 표시

### Key Entities

- **SkillEntry**: Vault 내 탐지된 Skill (경로, 이름, 설명, 활성화 상태)
- **SkillMetadata**: SKILL.md에서 추출한 메타데이터 (name, description, etc.)
- **SkillSettings**: Skills 관련 설정 (enableSkills, disabledSkills[])

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 사용자가 설정에서 Skills 토글을 3초 이내에 찾고 조작할 수 있음
- **SC-002**: `.claude/skills/`에 Skill을 추가하면 설정 재진입 시 5초 이내에 목록에 반영됨
- **SC-003**: Skill 상세 정보 모달이 클릭 후 1초 이내에 표시됨
- **SC-004**: Skills 활성화 상태에서 Claude가 관련 질문에 적절한 Skill을 호출함
- **SC-005**: 기존 설정 UI 패턴과 일관된 디자인으로 사용자 학습 곡선 최소화

---

## 수정 대상 파일

### Phase 1: 타입 및 설정

1. **src/types.ts**
   - `NoteSageSettings`에 `enableSkills`, `disabledSkills` 추가
   - `SkillEntry`, `SkillMetadata` 인터페이스 정의
   - `DEFAULT_SETTINGS` 업데이트

### Phase 2: Skills 서비스

2. **src/skills/SkillsManager.ts** (신규)
   - Skills 디렉토리 스캔
   - SKILL.md 파싱 (YAML frontmatter)
   - Skill 메타데이터 추출

### Phase 3: 설정 UI

3. **src/SettingsTab.ts**
   - `renderSkillsSettings()` 메서드 추가
   - Skills 목록 렌더링
   - 개별 토글 UI
   - "새 Skill 만들기" 버튼

4. **src/skills/SkillDetailModal.ts** (신규)
   - Skill 상세 보기 모달

5. **src/skills/SkillCreatorModal.ts** (신규)
   - Skill 생성 마법사 모달
   - 이름, 설명 입력 폼
   - 실시간 미리보기
   - 유효성 검사

### Phase 4: SDK 통합

6. **src/AgentService.ts**
   - `buildQueryOptions()`에 `setting_sources` 추가
   - `allowed_tools`에 "Skill" 조건부 추가
   - Skills 경로 설정

### Phase 5: i18n

7. **src/i18n/locales/*.ts** (11개 파일)
   - Skills 관련 번역 키 추가

### Phase 6: 스타일

8. **src/styles/main.css**
   - Skills UI 컴포넌트 스타일
