# TODO: Agent Options 미완료 태스크

**Feature**: Agent Options (001-agent-options)
**Status**: 핵심 기능 구현 완료, ChatView 통합 미완료
**Last Updated**: 2025-12-28

---

## 미완료 태스크

### ChatView 통합 (Priority: Medium)

| ID | 설명 | 파일 | 비고 |
|----|------|------|------|
| T011 | 결과 메시지에 세션 비용 표시 | `src/ChatView.ts` | `total_cost_usd` 필드 활용 |
| T012 | 비용 한도 도달 알림 핸들러 | `src/ChatView.ts` | SDK가 세션 종료 시 알림 표시 |
| T015 | 턴 한도 도달 알림 핸들러 | `src/ChatView.ts` | SDK가 세션 종료 시 알림 표시 |
| T018 | Thinking 블록 렌더링 지원 확인 | `src/ChatView.ts` | Extended Thinking 응답 렌더링 |

### 검증 (Priority: Low)

| ID | 설명 | 비고 |
|----|------|------|
| T023 | 플러그인 리로드 후 설정 지속성 검증 | 수동 테스트 필요 |
| T024 | quickstart.md 기반 전체 기능 테스트 | 4개 User Story 테스트 |

---

## 구현 가이드

### T011: 세션 비용 표시

`ResultChatMessage`에서 `total_cost_usd` 필드를 읽어 표시:

```typescript
// ChatView.ts - renderResultMessage 또는 유사 함수에서
if (message.total_cost_usd !== undefined) {
    const costText = t('settings.agentOptions.costDisplay')
        .replace('${cost}', message.total_cost_usd.toFixed(4));
    // costText를 UI에 표시
}
```

### T012, T015: 한도 도달 알림

SDK가 한도 도달 시 자동으로 세션을 종료합니다. `result` 메시지의 `is_error` 또는 `result` 텍스트를 확인하여 알림 표시:

```typescript
// 비용 한도 도달 감지
if (message.result?.includes('budget') || message.result?.includes('cost')) {
    new Notice(t('settings.agentOptions.costLimitReached'));
}

// 턴 한도 도달 감지
if (message.result?.includes('turn') || message.result?.includes('limit')) {
    new Notice(t('settings.agentOptions.turnLimitReached'));
}
```

### T018: Thinking 블록 렌더링

Extended Thinking 응답에 `thinking` 타입 콘텐츠 블록이 포함됩니다. 기존 렌더링 로직 확인 필요.

---

## 관련 파일

- `specs/001-agent-options/tasks.md` - 전체 태스크 목록
- `specs/001-agent-options/quickstart.md` - 사용자 가이드
- `src/i18n/locales/*.ts` - 번역 키 (costDisplay, costLimitReached, turnLimitReached)

---

## 참고

- 현재 구현된 기능만으로도 Agent Options가 정상 작동함
- ChatView 통합은 UX 개선을 위한 부가 기능
- SDK가 한도 도달 시 자동으로 세션을 종료하므로 핵심 기능에는 영향 없음
