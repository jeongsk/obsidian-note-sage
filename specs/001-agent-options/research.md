# Research: Agent Options

**Date**: 2025-12-28
**Feature**: Agent Options (001-agent-options)

## Research Tasks

### 1. Claude Agent SDK query() 옵션 조사

**Task**: maxTurns, maxBudgetUsd, maxThinkingTokens, permissionMode 옵션의 정확한 사용법 조사

**Findings**:

#### maxTurns
- **타입**: `number`
- **설명**: 최대 대화 턴 수 제한
- **기본값**: SDK 기본값 (무제한 또는 내부 기본값)
- **사용법**: `query({ prompt, options: { maxTurns: 10 } })`

#### maxBudgetUsd
- **타입**: `number`
- **설명**: USD 기반 세션당 최대 비용 한도
- **기본값**: 무제한
- **사용법**: `query({ prompt, options: { maxBudgetUsd: 1.0 } })`
- **에러 타입**: `error_max_budget_usd` - 예산 초과 시 반환
- **비용 정보**: `SDKResultMessage.total_cost_usd`에서 조회 가능

#### maxThinkingTokens (Extended Thinking)
- **타입**: `number`
- **설명**: Extended Thinking 모드 활성화 및 사고 토큰 제한
- **범위**: 1,000 ~ 100,000 (추정)
- **사용법**: `query({ prompt, options: { maxThinkingTokens: 10000 } })`
- **참고**: 값을 설정하면 Extended Thinking이 자동 활성화됨

#### permissionMode
- **타입**: `'default' | 'acceptEdits' | 'bypassPermissions' | 'plan'`
- **설명**: 권한 모드 설정
- **현재 값**: 'bypassPermissions' (하드코딩)
- **각 모드 설명**:
  - `default`: 모든 작업에 사용자 확인 필요
  - `acceptEdits`: 파일 편집만 자동 승인
  - `bypassPermissions`: 모든 권한 우회
  - `plan`: 계획 모드 (실행 없이 계획만)

---

### 2. 현재 AgentService 구현 분석

**Task**: 기존 buildQueryOptions 함수 분석 및 확장 방안

**Findings**:

현재 `AgentService.ts`의 `buildQueryOptions` 메서드:
```typescript
private buildQueryOptions(workingDirectory: string, sessionId: string | null | undefined, claudePath: string): Record<string, unknown> {
    const options: Record<string, unknown> = {
        model: this.settings.model || 'claude-sonnet-4-5',
        cwd: workingDirectory,
        permissionMode: 'bypassPermissions' as const,  // 하드코딩됨
        allowDangerouslySkipPermissions: true,
        pathToClaudeCodeExecutable: claudePath,
    };
    // ... 기존 옵션들
}
```

**확장 방안**:
- `permissionMode`: settings에서 가져오도록 변경
- `maxTurns`: settings.maxTurns 추가
- `maxBudgetUsd`: settings.apiKey가 있을 때만 settings.maxBudgetUsd 추가
- `maxThinkingTokens`: settings.enableExtendedThinking이 true일 때만 추가

---

### 3. 비용 표시 UI 구현 방안

**Task**: ResultMessage에서 비용 정보를 추출하여 UI에 표시하는 방법

**Findings**:

`SDKResultMessage` 타입 (types.ts):
```typescript
interface ResultChatMessage {
    type: 'result';
    total_cost_usd?: number;  // 이미 존재!
    // ...
}
```

**구현 방안**:
1. `ChatView.ts`에서 `result` 메시지 수신 시 `total_cost_usd` 추출
2. API 키가 설정된 경우에만 비용 표시 UI 렌더링
3. 비용 표시 위치: 채팅 하단 또는 세션 정보 영역

---

### 4. 설정 UI 패턴 분석

**Task**: 기존 SettingsTab.ts 패턴 분석

**Findings**:

기존 패턴:
- `new Setting(containerEl)` 사용
- `.setName()`, `.setDesc()` 메서드 체이닝
- `.addToggle()`, `.addDropdown()`, `.addText()`, `.addTextArea()` 컴포넌트
- 다국어: `t('settings.xxx')` 함수 사용
- 값 변경: `onChange(async (value) => { ... await this.plugin.saveSettings(); })`

**새 설정 추가 위치**:
- "Agent 옵션" 섹션 신규 생성 (기존 섹션들 사이)
- 비용 관련 설정은 API 키가 있을 때만 표시

---

## Decisions

### D1: maxBudgetUsd 조건부 표시
- **Decision**: API 키가 설정된 경우에만 maxBudgetUsd 설정 UI 표시
- **Rationale**: Claude Code 구독자(월정액)에게는 의미 없는 옵션
- **Alternatives Considered**:
  - 항상 표시 (혼란 유발)
  - 별도 탭 (과도한 복잡성)

### D2: Extended Thinking 활성화 방식
- **Decision**: 토글 + maxThinkingTokens 슬라이더 조합
- **Rationale**: 토글로 기능 on/off, 슬라이더로 토큰 수 조절
- **Alternatives Considered**:
  - 토큰 수만 입력 (0이면 비활성화) - 직관적이지 않음

### D3: permissionMode 기본값
- **Decision**: 기본값 'bypassPermissions' 유지
- **Rationale**: 기존 동작과 호환성 유지, 대부분의 사용자가 편의성 선호
- **Alternatives Considered**:
  - 기본값 'default' (보안 우선) - 사용성 저하

### D4: maxTurns 기본값
- **Decision**: 기본값 0 (제한 없음)
- **Rationale**: SDK 기본 동작 유지, 사용자가 필요시 설정
- **Alternatives Considered**:
  - 기본값 20 (안전) - 일부 사용자에게 불편

### D5: 비용 표시 위치
- **Decision**: 세션 완료 후 결과 메시지에 비용 표시
- **Rationale**: 실시간 추적은 Out of Scope, 결과 메시지에 이미 total_cost_usd 포함
- **Alternatives Considered**:
  - 실시간 비용 표시 - 복잡성 증가, 별도 기능으로 분리

---

## Resolved Clarifications

| Item | Resolution |
|------|------------|
| Extended Thinking 토큰 범위 | 1,000 ~ 100,000 (SDK 문서 기준) |
| permissionMode 옵션 목록 | 4개: default, acceptEdits, bypassPermissions, plan |
| 비용 정보 출처 | SDKResultMessage.total_cost_usd |
| API 키 유무 판단 | settings.apiKey 문자열 존재 및 비어있지 않음 |
