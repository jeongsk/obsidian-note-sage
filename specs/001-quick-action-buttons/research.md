# Research: Quick Action Buttons Customization

**Date**: 2025-12-26
**Feature**: 001-quick-action-buttons

## Research Topics

### 1. Obsidian Settings API Patterns

**Decision**: Obsidian의 `Setting` 클래스와 `PluginSettingTab` 확장 패턴 사용

**Rationale**:
- 기존 SettingsTab.ts에서 이미 동일한 패턴 사용 중
- `new Setting(containerEl).setName().setDesc().addToggle()` 체인 패턴이 표준
- 사용자에게 일관된 설정 경험 제공

**Alternatives considered**:
- Custom modal: 불필요한 복잡성, 사용자 경험 불일치
- Inline settings in ChatView: 설정 UI와 기능 UI 분리 원칙 위반

### 2. Settings Data Structure

**Decision**: `NoteSageSettings`에 `quickActions` 배열 추가

**Rationale**:
- 기존 설정 구조와 일관성 유지
- 각 버튼별 `enabled`와 `customPrompt` 저장
- DEFAULT_SETTINGS에서 초기값 관리로 신규 사용자 기본값 보장

**Alternatives considered**:
- 별도 JSON 파일: 불필요한 파일 I/O, 설정 동기화 복잡성
- localStorage: Obsidian 플러그인 표준이 아님

### 3. Default Prompt Management

**Decision**: i18n 시스템의 promptKey를 기본값으로 사용, customPrompt가 비어있으면 기본값 적용

**Rationale**:
- 다국어 기본 프롬프트 지원 (한국어 사용자는 한국어 기본 프롬프트)
- 리셋 시 customPrompt만 비우면 됨
- 기존 i18n 인프라 재활용

**Alternatives considered**:
- 하드코딩된 기본값: 다국어 지원 불가
- 별도 defaults 객체: 불필요한 중복

### 4. UI Update Mechanism

**Decision**: 기존 `updateSettings()` 메서드를 통한 설정 전파

**Rationale**:
- 기존 패턴 (`this.app.workspace.getLeavesOfType()`)으로 모든 뷰 업데이트
- 플러그인 재시작 없이 즉시 반영
- 이미 검증된 메커니즘

**Alternatives considered**:
- Event emitter: 과도한 설계, 기존 패턴으로 충분
- View 재생성: 불필요한 성능 비용

### 5. Quick Action Button Visibility

**Decision**: `createQuickActions()`에서 settings.quickActions를 필터링하여 enabled된 버튼만 렌더링

**Rationale**:
- 렌더링 시점에 필터링으로 단순한 구현
- 모든 버튼 비활성화 시 컨테이너 자체를 숨김
- DOM 조작 최소화

**Alternatives considered**:
- CSS visibility: DOM에 불필요한 요소 유지
- 동적 토글: 복잡성 증가, 이점 없음

## Key Implementation Decisions

| Area | Decision | Reason |
|------|----------|--------|
| Settings Storage | Plugin settings JSON | 기존 패턴, 자동 저장 |
| Default Values | i18n keys | 다국어 지원 |
| UI Pattern | Obsidian Setting API | 일관된 UX |
| Update Mechanism | updateSettings() 전파 | 기존 검증된 패턴 |
| Reset Function | customPrompt 초기화 | 심플한 구현 |

## No NEEDS CLARIFICATION Items

기술적 컨텍스트에서 모든 결정이 명확하게 해결되었습니다.
