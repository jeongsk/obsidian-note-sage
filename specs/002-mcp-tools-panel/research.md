# Research: MCP Tools Panel

**Date**: 2025-12-27
**Feature**: 002-mcp-tools-panel

## Research Topics

### 1. Obsidian 드롭다운/팝오버 패널 구현 패턴

**Decision**: 커스텀 드롭다운 패널을 직접 구현

**Rationale**:
- Obsidian은 내장 드롭다운 컴포넌트를 제공하지 않음
- `Menu` 클래스는 컨텍스트 메뉴용으로 토글/확장 등 복잡한 UI에 부적합
- 기존 프로젝트의 `McpSettingsUI`와 유사한 패턴으로 직접 DOM 조작
- `createEl()` 메서드로 구조화된 HTML 생성

**Alternatives considered**:
- Obsidian `Menu` 클래스: 단순 메뉴만 지원, 토글/확장 불가
- 외부 라이브러리: 번들 사이즈 증가, Obsidian 스타일 불일치

### 2. 외부 클릭 감지 (Click Outside to Close)

**Decision**: `document.addEventListener('click')` 패턴 사용

**Rationale**:
- 표준 웹 패턴으로 모든 브라우저에서 안정적
- 패널 컨테이너의 `contains()` 메서드로 내/외부 클릭 구분
- 이벤트 리스너는 패널 열림 시 등록, 닫힘 시 해제하여 성능 최적화

**Implementation Pattern**:
```typescript
private handleDocumentClick = (event: MouseEvent) => {
  if (this.panelEl && !this.panelEl.contains(event.target as Node)) {
    this.close();
  }
};

open() {
  // ... render panel
  document.addEventListener('click', this.handleDocumentClick);
}

close() {
  // ... cleanup
  document.removeEventListener('click', this.handleDocumentClick);
}
```

**Alternatives considered**:
- `focusout` 이벤트: 키보드 포커스에만 반응, 마우스 클릭 미감지
- Obsidian 이벤트 시스템: 이 용도의 내장 이벤트 없음

### 3. 아코디언 확장/축소 (서버별 도구 목록)

**Decision**: CSS `max-height` 트랜지션 + 상태 관리

**Rationale**:
- 부드러운 애니메이션 효과
- JavaScript 상태와 CSS 클래스 토글로 구현
- 기존 `McpSettingsUI`의 폼 토글 패턴과 유사

**Implementation Pattern**:
```typescript
// 서버 항목 클릭 시 (토글 영역 제외)
serverItemEl.addEventListener('click', (e) => {
  if (!toggleEl.contains(e.target as Node)) {
    this.toggleExpand(server.name);
  }
});
```

**Alternatives considered**:
- `<details>` 태그: 스타일링 제한, Obsidian 테마 불일치

### 4. 토스트 알림 (에러 메시지)

**Decision**: Obsidian `Notice` 클래스 사용

**Rationale**:
- Obsidian 내장 기능으로 일관된 UX
- 자동 사라짐, 스타일링 자동 적용
- `new Notice('에러 메시지', 5000)` 형태로 간단 사용

**Implementation Pattern**:
```typescript
try {
  await this.onSave(servers);
} catch (error) {
  // 토글 롤백
  server.enabled = !server.enabled;
  this.render();
  // 토스트 알림
  new Notice(t('panel.toggleError'), 5000);
}
```

### 5. 실시간 상태 업데이트

**Decision**: 기존 `McpServerManager.onStatusChange()` 구독 활용

**Rationale**:
- 이미 구현된 옵저버 패턴 활용
- `ChatView`에서 동일 패턴 사용 중
- 패널 열림 시 구독, 닫힘 시 해제

### 6. 설정 페이지로 이동

**Decision**: `this.app.setting.open()` + `openTabById()` 사용

**Rationale**:
- Obsidian 내장 API로 설정 페이지 열기
- 플러그인 설정 탭 ID로 직접 이동 가능

**Implementation Pattern**:
```typescript
// 설정 페이지 열기
(this.app as any).setting.open();
(this.app as any).setting.openTabById('note-sage');
```

## Technology Stack Decisions

| Component | Technology | Reason |
|-----------|------------|--------|
| UI 렌더링 | Obsidian `createEl()` | 일관된 패턴, 타입 안전성 |
| 스타일링 | CSS (styles.css) | 기존 `sage-` prefix 유지 |
| 상태 관리 | 클래스 멤버 변수 | 단순 UI 상태, 추가 라이브러리 불필요 |
| 이벤트 처리 | DOM 이벤트 + `McpServerManager` | 기존 인프라 활용 |
| 알림 | Obsidian `Notice` | 내장 기능, 일관된 UX |
| 번역 | 기존 i18n 시스템 | `t()` 함수 활용 |

## Key Implementation Notes

1. **패널 위치**: 아이콘 바로 아래에 드롭다운 형태로 표시
2. **z-index**: Obsidian 모달보다 낮게, 일반 컨텐츠보다 높게 설정
3. **스크롤**: 서버 목록이 길 경우 패널 내부 스크롤 허용
4. **키보드 접근성**: Esc 키로 패널 닫기 지원

## Unresolved Questions

없음 - 모든 기술적 결정 완료
