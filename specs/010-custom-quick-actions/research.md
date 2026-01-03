# Research: Custom Quick Actions

**Feature**: 010-custom-quick-actions  
**Date**: 2025-01-03

## Research Summary

이 기능은 기존 Quick Actions 시스템의 확장으로, 새로운 기술 도입 없이 기존 패턴을 따릅니다.

## Decisions

### 1. 데이터 구조

**Decision**: `CustomQuickAction` 인터페이스를 별도로 정의하고 `NoteSageSettings.customQuickActions` 배열로 저장

**Rationale**: 
- 기존 `QuickActionConfig`는 고정된 4개 액션의 설정(enabled, customPrompt)만 저장
- 커스텀 액션은 이름, 프롬프트, 순서 등 추가 필드가 필요
- 별도 배열로 분리하여 기본 액션과 커스텀 액션을 명확히 구분

**Alternatives Considered**:
- 기존 `QuickActionConfig` 확장: 기본/커스텀 구분 어려움, 마이그레이션 복잡
- 단일 통합 배열: 기본 액션의 i18n 처리 복잡해짐

### 2. ID 생성 방식

**Decision**: `crypto.randomUUID()` 사용

**Rationale**:
- Obsidian은 Electron 기반으로 Node.js `crypto` 모듈 사용 가능
- 충돌 가능성 극히 낮음
- 순서 변경 시에도 안정적인 식별자 유지

**Alternatives Considered**:
- 타임스탬프 기반: 동시 생성 시 충돌 가능
- 인덱스 기반: 순서 변경 시 참조 깨짐

### 3. 순서 변경 UI

**Decision**: 위/아래 버튼 방식 (드래그 앤 드롭은 후순위)

**Rationale**:
- Obsidian Setting API와 호환
- 구현 복잡도 낮음
- 접근성 우수 (키보드 사용 가능)

**Alternatives Considered**:
- 드래그 앤 드롭: 구현 복잡, 추가 라이브러리 필요 가능
- 숫자 입력: 사용자 경험 저하

### 4. 아이콘 선택

**Decision**: 모든 커스텀 액션에 기본 아이콘 `zap` 사용

**Rationale**:
- Lucide 아이콘 세트에서 "빠른 동작" 의미 전달
- MVP 범위 유지
- 아이콘 선택 UI 복잡도 회피

**Alternatives Considered**:
- 아이콘 선택 드롭다운: 구현 복잡도 증가, 후속 기능으로 고려
- 아이콘 없음: 시각적 일관성 저하

### 5. 삭제 확인

**Decision**: Obsidian `Modal` 클래스를 사용한 확인 다이얼로그

**Rationale**:
- 기존 Skills 삭제와 동일한 패턴 (`SkillDeleteModal` 참조)
- Obsidian 네이티브 UI 일관성
- 실수로 인한 데이터 손실 방지

**Alternatives Considered**:
- `confirm()` 브라우저 다이얼로그: Obsidian 스타일과 불일치
- 확인 없이 즉시 삭제: 데이터 손실 위험

### 6. 렌더링 순서

**Decision**: 기본 액션(요약, 개선, 분석, 번역) → 커스텀 액션 (order 순)

**Rationale**:
- 기본 액션은 고정 위치로 예측 가능성 제공
- 커스텀 액션은 사용자 정의 순서
- 스펙 요구사항 FR-013 충족

**Alternatives Considered**:
- 모두 통합 정렬: 기본 액션 위치 변경 가능성으로 혼란
- 커스텀 먼저: 일반적 사용 패턴과 불일치

## Technical Patterns

### 기존 코드베이스에서 참조할 패턴

| 패턴 | 참조 파일 | 적용 |
|------|----------|------|
| 설정 CRUD | `SettingsTab.ts` - `renderQuickActionsSettings()` | 커스텀 액션 설정 UI |
| 삭제 모달 | `skills/SkillDeleteModal.ts` | 삭제 확인 다이얼로그 |
| 버튼 렌더링 | `ChatView.ts` - `renderQuickActions()` | 커스텀 액션 버튼 |
| 타입 정의 | `types.ts` - `QuickActionConfig` | 새 인터페이스 구조 |
| i18n | `i18n/locales/*.ts` | 번역 키 추가 |

## Dependencies

이 기능은 새로운 외부 의존성이 필요하지 않습니다:
- ✅ Obsidian API (기존)
- ✅ TailwindCSS (기존)
- ✅ Lucide Icons (기존, Obsidian 내장)
