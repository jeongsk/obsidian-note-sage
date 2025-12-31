# Implementation Plan: Skills 관리 기능

**Branch**: `001-skills-management` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-skills-management/spec.md`

## Summary

Claude Agent SDK의 Skills 기능을 Note Sage 플러그인에 통합하여 사용자가 `.claude/skills/` 디렉토리의 Skills를 관리하고 활용할 수 있도록 합니다. 두 가지 Skill 생성 방식(빠른 생성 + 마법사 UI)을 제공하며, SDK의 `setting_sources`와 `allowed_tools` 옵션을 활용하여 Skills를 활성화합니다.

## Technical Context

**Language/Version**: TypeScript 5.9+
**Primary Dependencies**: Obsidian API, @anthropic-ai/claude-agent-sdk ^0.1.76, TailwindCSS 3.4.19
**Storage**: Obsidian Vault 파일 시스템 (`.claude/skills/` 디렉토리), 플러그인 데이터 (settings)
**Testing**: Vitest
**Target Platform**: Obsidian Desktop (Node.js >=22.0.0, isDesktopOnly: true)
**Project Type**: Obsidian Plugin (single project)
**Performance Goals**: Skills 목록 로드 5초 이내, 모달 열기 1초 이내
**Constraints**: Obsidian API 호환성, Claude SDK 버전 호환성
**Scale/Scope**: 단일 Vault 내 10-50개 Skills 관리

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 상태 | 비고 |
|------|------|------|
| 기존 패턴 준수 | ✅ Pass | MCP 서버 관리 UI 패턴 활용 |
| 타입 안정성 | ✅ Pass | TypeScript 인터페이스 정의 |
| i18n 지원 | ✅ Pass | 11개 언어 번역 추가 계획 |
| TailwindCSS 규칙 | ✅ Pass | `tw-` 접두사, `obs-*` 색상 사용 |

## Project Structure

### Documentation (this feature)

```text
specs/001-skills-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no external API)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── skills/                      # 신규 디렉토리
│   ├── SkillsManager.ts         # Skills 탐지 및 파싱
│   ├── SkillDetailModal.ts      # 상세 보기 모달
│   └── SkillCreatorModal.ts     # 마법사 생성 모달
├── types.ts                     # SkillEntry, SkillMetadata 타입 추가
├── AgentService.ts              # SDK 옵션 확장
├── SettingsTab.ts               # Skills 설정 UI 섹션
├── i18n/
│   └── locales/*.ts             # 11개 언어 번역
└── styles/
    └── main.css                 # Skills UI 스타일

tests/
└── unit/
    └── skills/
        ├── SkillsManager.test.ts
        └── SkillCreatorModal.test.ts
```

**Structure Decision**: 기존 `src/mcp/` 디렉토리 패턴을 따라 `src/skills/` 디렉토리 생성. MCP 서버 관리와 유사한 구조로 일관성 유지.

## Complexity Tracking

> 위반 사항 없음 - 기존 아키텍처 패턴 준수

---

## Phase 0: Research

### Research Tasks

1. **Claude Agent SDK Skills 통합 방식**
   - `setting_sources` 옵션 사용법
   - `allowed_tools`에 "Skill" 추가 방법
   - Skills 경로 설정

2. **YAML Frontmatter 파싱**
   - Obsidian에서 사용 가능한 YAML 파싱 라이브러리
   - SKILL.md 파일 형식 표준

3. **Obsidian Modal API**
   - 기본 이름 입력 프롬프트 구현
   - 커스텀 마법사 모달 구현

---

## Phase 1: Design

### Data Model

→ [data-model.md](./data-model.md) 참조

### API Contracts

이 기능은 외부 API가 아닌 플러그인 내부 구현이므로, contracts/ 디렉토리 대신 TypeScript 인터페이스로 정의합니다.

### Quickstart

→ [quickstart.md](./quickstart.md) 참조
