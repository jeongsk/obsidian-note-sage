# Feature Specification: Agent Options

**Feature Branch**: `005-agent-options`
**Created**: 2025-12-28
**Status**: Draft
**Input**: User description: "Claude Agent SDK 옵션 기능 추가 - maxTurns, maxBudgetUsd, Extended Thinking 등 SDK에서 제공하는 고급 옵션들을 사용자가 설정할 수 있게 UI 제공"

## Overview

Note Sage 플러그인 사용자가 Claude Agent SDK의 고급 옵션들을 설정 UI를 통해 제어할 수 있도록 합니다. 이를 통해 사용자는 대화 비용을 관리하고, 턴 수를 제한하며, Extended Thinking 모드를 활성화할 수 있습니다.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 비용 관리 설정 (Priority: P1)

> **조건**: 이 기능은 API 키가 설정된 사용자에게만 적용됩니다. Claude Code 구독자(월정액)는 사용량 기반 과금이 아니므로 이 기능이 표시되지 않습니다.

API 키를 사용하는 사용자가 비용이 과도하게 발생하는 것을 방지하기 위해 세션당 최대 비용 한도를 설정합니다. 설정된 한도에 도달하면 세션이 종료되고 사용자에게 알림이 표시됩니다.

**Why this priority**: API 비용 관리는 사용자의 재정적 손실을 직접적으로 방지하는 핵심 기능입니다. 예상치 못한 비용 발생은 사용자 신뢰를 심각하게 손상시킬 수 있습니다.

**Independent Test**: API 키가 설정된 상태에서 비용 한도를 $1.00로 설정한 후 대화를 진행하여 한도 도달 시 세션이 올바르게 종료되고 알림이 표시되는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** API 키가 설정되어 있고 사용자가 최대 비용을 $1.00로 설정했을 때, **When** 대화 진행 중 누적 비용이 $1.00에 도달하면, **Then** 세션이 자동으로 종료되고 "비용 한도 도달" 알림이 표시됩니다.
2. **Given** API 키가 설정되어 있고 비용 한도를 설정하지 않았을 때, **When** 대화를 진행하면, **Then** 비용 제한 없이 정상적으로 대화가 진행됩니다.
3. **Given** API 키가 설정되어 있고 대화가 진행 중일 때, **When** 각 응답이 완료되면, **Then** 현재까지 누적된 비용이 UI에 표시됩니다.
4. **Given** API 키가 설정되지 않았을 때, **When** 설정 화면을 열면, **Then** 비용 한도 설정 UI가 표시되지 않습니다.

---

### User Story 2 - 대화 턴 수 제한 (Priority: P2)

사용자가 무한 루프나 과도하게 긴 대화를 방지하기 위해 최대 대화 턴 수를 설정합니다. 설정된 턴 수에 도달하면 세션이 종료됩니다.

**Why this priority**: 무한 루프 방지는 리소스 보호에 중요하지만, 비용 관리만큼 직접적인 재정적 영향은 없습니다.

**Independent Test**: 최대 턴 수를 5로 설정한 후 대화를 진행하여 5턴 후 세션이 종료되는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 사용자가 최대 턴 수를 10으로 설정했을 때, **When** 대화가 10턴에 도달하면, **Then** 세션이 자동으로 종료되고 "최대 턴 수 도달" 알림이 표시됩니다.
2. **Given** 사용자가 최대 턴 수를 설정하지 않았을 때, **When** 대화를 진행하면, **Then** 기본값(20턴)으로 제한됩니다.

---

### User Story 3 - Extended Thinking 모드 활성화 (Priority: P3)

사용자가 복잡한 문제에 대해 Claude가 더 깊이 생각하도록 Extended Thinking 모드를 활성화합니다. 이 모드에서는 Claude가 더 많은 토큰을 사용하여 심층 분석을 수행합니다.

**Why this priority**: 고급 기능으로 특정 사용자에게만 필요하며, 핵심 기능이 먼저 안정화되어야 합니다.

**Independent Test**: Extended Thinking을 활성화한 후 복잡한 질문을 하여 Claude의 응답에 사고 과정이 포함되는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 사용자가 Extended Thinking을 활성화했을 때, **When** 복잡한 질문을 하면, **Then** Claude의 응답에 사고 과정(thinking) 블록이 포함됩니다.
2. **Given** 사용자가 최대 사고 토큰 수를 10000으로 설정했을 때, **When** Claude가 응답하면, **Then** 사고 토큰 사용량이 10000을 초과하지 않습니다.
3. **Given** Extended Thinking이 비활성화되어 있을 때, **When** 질문을 하면, **Then** 기존 방식대로 응답하며 사고 블록이 표시되지 않습니다.

---

### User Story 4 - 권한 모드 선택 (Priority: P4)

사용자가 Claude의 파일 및 시스템 접근 권한 수준을 선택합니다. 보안에 민감한 사용자는 더 제한적인 모드를 선택할 수 있습니다.

**Why this priority**: 현재 bypassPermissions로 하드코딩되어 작동하고 있어 기본 기능은 이미 충족됩니다. 추가 옵션은 보안에 민감한 고급 사용자를 위한 것입니다.

**Independent Test**: 권한 모드를 'acceptEdits'로 변경한 후 파일 편집 요청 시 자동 승인되는지 확인할 수 있습니다.

**Acceptance Scenarios**:

1. **Given** 사용자가 권한 모드를 'bypassPermissions'로 설정했을 때, **When** Claude가 파일을 수정하면, **Then** 확인 없이 즉시 수정됩니다.
2. **Given** 사용자가 권한 모드를 'acceptEdits'로 설정했을 때, **When** Claude가 파일을 수정하면, **Then** 편집만 자동 승인되고 다른 작업은 확인이 필요합니다.
3. **Given** 사용자가 권한 모드를 'default'로 설정했을 때, **When** Claude가 작업을 수행하면, **Then** 모든 작업에 대해 사용자 확인이 필요합니다.

---

### Edge Cases

- 비용 한도가 0으로 설정된 경우 어떻게 처리할 것인가? → 0은 "제한 없음"으로 처리됩니다.
- 턴 수가 1로 설정된 경우 최소한의 대화가 가능한가? → 최소값 1은 허용되며, 단일 질문-응답 후 세션 종료됩니다.
- Extended Thinking 활성화 시 비용이 급증하면 어떻게 되는가? → maxBudgetUsd 한도가 우선 적용됩니다.
- 네트워크 오류로 비용 정보를 받지 못한 경우? → 마지막으로 알려진 비용을 표시하고, 비용 추적 불가 상태를 사용자에게 알립니다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST API 키가 설정된 경우에만 최대 비용 한도(maxBudgetUsd) 입력 필드를 표시해야 합니다. (범위: $0.01 ~ $100.00)
- **FR-002**: System MUST 설정 UI에서 최대 턴 수(maxTurns) 입력 필드를 제공해야 합니다. (범위: 1 ~ 100)
- **FR-003**: System MUST 설정 UI에서 Extended Thinking 활성화 토글을 제공해야 합니다.
- **FR-004**: System MUST Extended Thinking 활성화 시 최대 사고 토큰 수(maxThinkingTokens) 슬라이더를 제공해야 합니다. (범위: 1,000 ~ 100,000)
- **FR-005**: System MUST 설정 UI에서 권한 모드(permissionMode) 드롭다운을 제공해야 합니다.
- **FR-006**: System MUST API 키가 설정된 경우, 대화 완료 후 세션 비용을 UI에 표시해야 합니다.
- **FR-007**: System MUST API 키가 설정되고 비용 한도가 도달한 경우, 세션을 종료하고 사용자에게 알림을 표시해야 합니다.
- **FR-008**: System MUST 턴 수 한도 도달 시 세션을 종료하고 사용자에게 알림을 표시해야 합니다.
- **FR-009**: System MUST 설정된 옵션들을 Claude Agent SDK query() 함수에 올바르게 전달해야 합니다.
- **FR-010**: System MUST 모든 설정값을 플러그인 설정에 영구 저장해야 합니다.
- **FR-011**: System MUST API 키 설정 여부에 따라 비용 관련 UI 요소의 표시/숨김을 동적으로 처리해야 합니다.

### Key Entities

- **AgentOptions**: 사용자가 설정 가능한 Agent SDK 옵션들의 집합
  - maxBudgetUsd: 세션당 최대 비용 한도
  - maxTurns: 세션당 최대 대화 턴 수
  - enableExtendedThinking: Extended Thinking 모드 활성화 여부
  - maxThinkingTokens: Extended Thinking 시 최대 사고 토큰 수
  - permissionMode: 권한 모드 ('bypassPermissions' | 'acceptEdits' | 'default' | 'plan')

- **SessionCost**: 세션 비용 추적 정보
  - currentCost: 현재까지 누적된 비용
  - limitReached: 한도 도달 여부

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자가 3클릭 이내에 비용 한도 설정을 완료할 수 있어야 합니다.
- **SC-002**: 비용 한도 도달 시 1초 이내에 세션이 종료되고 알림이 표시되어야 합니다.
- **SC-003**: 모든 설정 변경이 다음 세션부터 즉시 적용되어야 합니다.
- **SC-004**: Extended Thinking 활성화 시 응답 품질이 사용자 만족도 측면에서 향상되어야 합니다.
- **SC-005**: 새 설정 UI가 기존 설정 패널과 시각적으로 일관성을 유지해야 합니다.

## Assumptions

- 사용자는 Anthropic API 비용 체계에 대한 기본적인 이해가 있습니다.
- Claude Agent SDK가 maxBudgetUsd, maxTurns, maxThinkingTokens 옵션을 안정적으로 지원합니다.
- Extended Thinking 기능은 특정 모델(Claude Opus 등)에서만 완전히 지원될 수 있습니다.
- 비용 정보는 SDK의 ResultMessage에서 total_cost_usd 필드로 제공됩니다.
- **Claude Code 구독자(Max 플랜 등)는 월정액 기반이므로 maxBudgetUsd 옵션이 적용되지 않습니다.** 비용 관련 기능은 API 키를 직접 사용하는 사용자에게만 의미가 있습니다.
- API 키 설정 여부로 구독자와 API 사용자를 구분합니다. (API 키가 비어있으면 구독자로 간주)

## Out of Scope

- 파일 체크포인팅 (enableFileCheckpointing) 기능
- 커스텀 도구 정의 (tool() 함수)
- Hooks 시스템 (PreToolUse, PostToolUse 등)
- 샌드박스 설정 (sandbox)
- 실시간 비용 추적 (각 메시지별 증분 비용)
