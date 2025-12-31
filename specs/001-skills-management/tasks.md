# Tasks: Skills 관리 기능

**Feature**: 001-skills-management
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Date**: 2025-12-31

---

## Progress Legend

- `[ ]` 미완료
- `[x]` 완료
- `[TaskID]` 작업 고유 식별자
- `[P]` 병렬 실행 가능
- `[Story]` 관련 User Story (US1-US5)

---

## Phase 0: Setup & Types

타입 정의 및 프로젝트 구조 설정. 다른 모든 Phase의 기반이 됩니다.

- [x] [T001] 타입 인터페이스 정의
  - `src/types.ts`에 `SkillMetadata`, `SkillEntry` 인터페이스 추가
  - 참조: [data-model.md](./data-model.md)
  ```typescript
  interface SkillMetadata {
    name: string;
    description: string;
  }

  interface SkillEntry {
    id: string;
    path: string;
    metadata: SkillMetadata;
    enabled: boolean;
    hasError: boolean;
    errorMessage?: string;
  }
  ```

- [x] [T002] [P] 설정 타입 확장
  - `src/types.ts`의 `NoteSageSettings`에 Skills 관련 필드 추가
  ```typescript
  enableSkills?: boolean;
  disabledSkills?: string[];
  ```

- [x] [T003] [P] 기본값 설정
  - `src/types.ts`의 `DEFAULT_SETTINGS` 업데이트
  ```typescript
  enableSkills: false,
  disabledSkills: []
  ```

- [x] [T004] Skills 디렉토리 구조 생성
  - `src/skills/` 디렉토리 생성
  - 빈 `index.ts` 파일 생성 (모듈 export용)

---

## Phase 1: SkillsManager Core

Skills 탐지 및 파싱을 담당하는 핵심 모듈. US1, US2의 기반입니다.

- [x] [T005] SkillsManager 클래스 생성
  - 파일: `src/skills/SkillsManager.ts`
  - 기본 클래스 구조 및 생성자
  - FR-003: Vault의 `.claude/skills/` 디렉토리 스캔

- [x] [T006] [P] YAML frontmatter 파싱 구현
  - `parseMetadata(content: string): SkillMetadata` 메서드
  - FR-004: name, description 추출
  - 정규식 기반 파싱 (외부 의존성 없음)
  - 참조: [research.md](./research.md) - YAML 파싱 섹션

- [x] [T007] Skills 스캔 메서드 구현
  - `scanSkills(): Promise<SkillEntry[]>` 메서드
  - TFolder, TFile API 사용
  - 에러 처리: YAML 파싱 오류 시 hasError=true 설정

- [x] [T008] [P] 디렉토리 자동 생성
  - `ensureSkillsDirectory(): Promise<void>` 메서드
  - FR-010: `.claude/skills/` 디렉토리가 없으면 자동 생성

---

## Phase 2: US1 - Skills 전체 활성화/비활성화 (P1)

**User Story**: 사용자가 Note Sage 설정에서 Skills 기능을 활성화하거나 비활성화

- [x] [T009] [US1] 설정 UI 섹션 추가
  - 파일: `src/SettingsTab.ts`
  - `renderSkillsSettings(containerEl: HTMLElement)` 메서드 추가
  - FR-005: Skills 활성화 토글 UI

- [x] [T010] [US1] SDK 옵션 확장 - settingSources
  - 파일: `src/AgentService.ts`
  - `buildQueryOptions()` 메서드 수정
  - FR-001: `settingSources: ["user", "project"]` 조건부 추가

- [x] [T011] [US1] SDK 옵션 확장 - allowedTools
  - 파일: `src/AgentService.ts`
  - FR-002: `allowedTools`에 "Skill" 조건부 추가
  - Skills 비활성화 시 Skill 도구 제외

---

## Phase 3: US2 - Skills 자동 탐지 (P1)

**User Story**: `.claude/skills/` 디렉토리의 Skills 자동 탐지 및 목록 표시

- [x] [T012] [US2] Skills 목록 렌더링
  - 파일: `src/SettingsTab.ts`
  - `renderSkillsList(containerEl: HTMLElement)` 메서드
  - FR-008: 각 Skill의 이름, 설명 표시
  - 비동기 스캔 후 UI 업데이트

- [x] [T013] [US2] [P] 빈 목록 처리
  - Skills 없음 메시지 표시
  - 생성 가이드 링크 제공

- [x] [T014] [US2] [P] 에러 상태 표시
  - YAML 파싱 오류 Skill은 에러 아이콘과 함께 표시
  - 에러 메시지 툴팁

---

## Phase 4: US3 - 개별 Skill 토글 (P2)

**User Story**: 개별 Skill 활성화/비활성화

- [x] [T015] [US3] 개별 토글 UI
  - 파일: `src/SettingsTab.ts`
  - 각 Skill 항목에 토글 스위치 추가
  - FR-006: 개별 Skill 활성화/비활성화

- [x] [T016] [US3] 비활성화 상태 저장
  - FR-007: `disabledSkills` 배열에 ID 추가/제거
  - 플러그인 설정 자동 저장

- [x] [T017] [US3] [P] 비활성화 Skill 스타일
  - 흐린(dimmed) 스타일 적용
  - 파일: `src/styles/main.css`
  - TailwindCSS 클래스: `tw-opacity-50`

---

## Phase 5: US4 - Skill 상세 보기 (P2)

**User Story**: Skill 클릭 시 전체 내용 표시

- [x] [T018] [US4] SkillDetailModal 클래스 생성
  - 파일: `src/skills/SkillDetailModal.ts`
  - Obsidian Modal 확장
  - FR-009: SKILL.md 전체 내용 표시

- [x] [T019] [US4] 마크다운 렌더링
  - `MarkdownRenderer.render()` API 사용
  - 코드 하이라이팅 지원

- [x] [T020] [US4] [P] 모달 트리거
  - Skill 이름 클릭 시 모달 열기
  - ESC 키 닫기 지원

---

## Phase 6: US5 - 새 Skill 생성 (P2)

**User Story**: 두 가지 방식의 Skill 생성 (빠른 생성 + 마법사 UI)

### 6-1: 빠른 생성 (템플릿)

- [x] [T021] [US5] 이름 입력 프롬프트
  - 파일: `src/skills/SkillNamePrompt.ts`
  - FR-016: Obsidian Modal로 이름 입력
  - 이름 유효성 검사 (영문, 숫자, 하이픈)

- [x] [T022] [US5] 템플릿 생성 로직
  - `SkillsManager.createSkillFromTemplate(name)` 메서드
  - 기본 SKILL.md 템플릿 생성
  - 생성 후 Obsidian 편집기에서 파일 열기

- [x] [T023] [US5] [P] 빠른 생성 버튼
  - 설정 UI에 "템플릿으로 생성" 버튼 추가
  - 클릭 시 SkillNamePrompt 열기

### 6-2: 마법사 UI

- [x] [T024] [US5] SkillCreatorModal 클래스 생성
  - 파일: `src/skills/SkillCreatorModal.ts`
  - FR-011: 이름, 설명 입력 폼
  - Obsidian Setting API 사용

- [x] [T025] [US5] 실시간 미리보기
  - FR-012: SKILL.md 미리보기 영역
  - 입력값 변경 시 실시간 업데이트

- [x] [T026] [US5] 유효성 검사
  - FR-013: Skill 이름 유효성 검사
  - FR-014: 중복 이름 검사 및 경고

- [x] [T027] [US5] 마법사 생성 버튼
  - 설정 UI에 "마법사로 생성" 버튼 추가 (CTA 스타일)
  - 클릭 시 SkillCreatorModal 열기

### 6-3: Skill 삭제

- [x] [T028] [US5] 삭제 기능
  - `SkillsManager.deleteSkill(id)` 메서드
  - FR-015: 확인 다이얼로그 후 삭제
  - `vault.delete(folder, true)` 사용

- [x] [T029] [US5] [P] 삭제 버튼 UI
  - 각 Skill 항목에 삭제 버튼 (아이콘)
  - 확인 모달 연동

---

## Phase 7: i18n (11개 언어)

- [ ] [T030] 번역 키 정의
  - 파일: `src/i18n/locales/en.ts`
  - Skills 관련 모든 UI 텍스트
  ```typescript
  settings: {
    skills: {
      title: 'Skills',
      enable: 'Enable Skills',
      enableDesc: 'Allow Claude to use Skills from .claude/skills/',
      createTemplate: 'Create from Template',
      createWizard: 'Create with Wizard',
      noSkills: 'No Skills found',
      // ...
    }
  }
  ```

- [ ] [T031] [P] 10개 언어 번역
  - ko, ja, es, fr, de, pt, zh, ar, ru, hi
  - `/i18n-translator` 스킬 활용 권장

---

## Phase 8: Styles

- [ ] [T032] Skills UI 스타일
  - 파일: `src/styles/main.css`
  - TailwindCSS `tw-` 접두사 사용
  - Obsidian 색상 `obs-*` 사용

- [ ] [T033] [P] 컴포넌트 스타일
  - `.sage-skills-list` - 목록 컨테이너
  - `.sage-skill-item` - 개별 항목
  - `.sage-skill-item--disabled` - 비활성화 상태
  - `.sage-skill-item--error` - 에러 상태

---

## Phase 9: Testing

- [ ] [T034] SkillsManager 단위 테스트
  - 파일: `tests/unit/skills/SkillsManager.test.ts`
  - YAML 파싱 테스트
  - 스캔 로직 테스트

- [ ] [T035] [P] SkillCreatorModal 테스트
  - 파일: `tests/unit/skills/SkillCreatorModal.test.ts`
  - 유효성 검사 테스트
  - 중복 이름 검사 테스트

---

## Dependencies Graph

```text
T001 ─┬─→ T005 ─→ T006/T007/T008 ─→ T012
T002 ─┤
T003 ─┤
T004 ─┘

T009 ─→ T010/T011 (US1 완료)
T012 ─→ T013/T014 (US2 완료)
T015 ─→ T016/T017 (US3 완료)
T018 ─→ T019/T020 (US4 완료)
T021 ─→ T022/T023 ─┐
T024 ─→ T025/T026/T027 ─┼─→ T028/T029 (US5 완료)
                       │
T030 ─→ T031 (i18n 완료)
T032 ─→ T033 (Styles 완료)
T034/T035 (Testing)
```

---

## Summary

| Phase | Tasks | Stories | Priority |
|-------|-------|---------|----------|
| 0 | T001-T004 | - | Setup |
| 1 | T005-T008 | - | Core |
| 2 | T009-T011 | US1 | P1 |
| 3 | T012-T014 | US2 | P1 |
| 4 | T015-T017 | US3 | P2 |
| 5 | T018-T020 | US4 | P2 |
| 6 | T021-T029 | US5 | P2 |
| 7 | T030-T031 | - | i18n |
| 8 | T032-T033 | - | Styles |
| 9 | T034-T035 | - | Testing |

**Total Tasks**: 35
**P1 Stories (US1, US2)**: 6 tasks
**P2 Stories (US3, US4, US5)**: 15 tasks
**Support Tasks**: 14 tasks (Setup, Core, i18n, Styles, Testing)
