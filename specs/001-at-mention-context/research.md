# Research: @ 멘션 컨텍스트 추가

**Date**: 2025-12-31
**Feature**: 001-at-mention-context

## Research Topics

### 1. Obsidian API - 파일/폴더 접근

**Decision**: Obsidian의 `Vault` API를 사용하여 파일 시스템에 접근

**Rationale**:
- `vault.getFiles()`: 모든 파일 목록 반환 (TFile[])
- `vault.getAllLoadedFiles()`: 파일 + 폴더 포함 (TAbstractFile[])
- `vault.read(file)`: 파일 내용 읽기 (Promise<string>)
- `vault.getAbstractFileByPath(path)`: 경로로 파일/폴더 조회
- 직접 파일 시스템 접근보다 Obsidian API가 캐싱과 이벤트 시스템을 제공

**Alternatives considered**:
- Node.js fs 모듈 직접 사용: Obsidian의 추상화 계층 우회 필요, 캐싱 미지원
- obsidian-dataview 플러그인 API: 외부 의존성 추가, 설치 필수

### 2. 자동완성 UI 패턴

**Decision**: Custom DOM 기반 드롭다운 + 키보드 탐색

**Rationale**:
- Obsidian은 React/Vue 없이 vanilla DOM 사용
- 기존 ChatView.ts의 패턴 따름 (createEl, registerDomEvent)
- 키보드 접근성: ArrowUp/Down, Enter, Escape 지원
- 절대 위치 지정으로 입력창 아래에 드롭다운 배치

**Alternatives considered**:
- Obsidian의 SuggestModal 사용: 전체 화면 모달, 인라인 자동완성에 부적합
- 외부 라이브러리 (Floating UI): 추가 의존성, 번들 크기 증가

### 3. 멘션 파싱 전략

**Decision**: 정규식 기반 실시간 파싱 + 상태 머신

**Rationale**:
- `@` 문자 감지 후 다음 공백/특수문자까지 추출
- 정규식: `/@([^\s@]+)/g` 또는 상태 머신으로 커서 위치 추적
- 선택 완료된 멘션은 특수 마커로 감싸서 구분 (예: `\u200B@path\u200B`)
- 복잡한 파싱이 필요 없음 (마크다운 문법 아님)

**Alternatives considered**:
- ProseMirror/CodeMirror 에디터: 과도한 복잡성
- contenteditable div: 브라우저 호환성 이슈, 기존 textarea 유지가 더 안정적

### 4. 파일 필터링 성능 최적화

**Decision**: 디바운스 + 사전 인덱싱 + 퍼지 매칭

**Rationale**:
- 입력 디바운스 (50-100ms): 과도한 필터링 방지
- 파일 목록 캐싱: vault 변경 시에만 갱신 (vault.on('create'/'delete'/'rename'))
- 단순 포함 검색 (includes) 우선, 필요시 퍼지 매칭 추가
- 결과 50개 제한으로 렌더링 부하 최소화

**Alternatives considered**:
- Fuse.js 라이브러리: 번들 크기 증가, 간단한 검색에 과도함
- Web Worker: 1000개 파일 수준에서는 불필요한 복잡성

### 5. 멘션 UI 표현 (칩/태그)

**Decision**: span 요소 + CSS 스타일링 + zero-width space 경계

**Rationale**:
- textarea 내부에서는 스타일 적용 불가
- 선택된 멘션을 시각화하려면 별도 영역 필요 (입력창 상단/하단)
- 또는 contenteditable로 전환 (복잡도 증가)
- 간단한 방식: 멘션 목록을 입력창 상단에 칩 형태로 표시

**Alternatives considered**:
- textarea 유지 + 텍스트만: 시각적 구분 어려움
- contenteditable div 전환: 기존 코드 대폭 수정 필요

### 6. 컨텍스트 포맷

**Decision**: XML-like 태그로 구조화된 컨텍스트 전달

**Rationale**:
```text
<mentioned_file path="notes/readme.md">
파일 내용...
</mentioned_file>

<mentioned_folder path="src/">
- src/main.ts (file)
- src/types.ts (file)
- src/utils/ (folder)
</mentioned_folder>
```
- 구조화된 포맷으로 AI가 컨텍스트 구분 용이
- 기존 `buildFinalMessage` 패턴 확장

**Alternatives considered**:
- JSON 포맷: 가독성 낮음, AI 처리에 불리
- 마크다운 코드블록: 파일 경로 메타데이터 표현 불명확

## Implementation Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| 파일 접근 | Obsidian Vault API | 캐싱, 이벤트 시스템 내장 |
| UI 컴포넌트 | Custom DOM 드롭다운 | 기존 패턴 일관성, 경량 |
| 멘션 파싱 | 정규식 + 상태 추적 | 단순성, 성능 |
| 필터링 | 디바운스 + 캐싱 | 성능 최적화 |
| 멘션 시각화 | 별도 칩 영역 | textarea 제약 회피 |
| 컨텍스트 포맷 | XML-like 태그 | AI 친화적 구조화 |

## Technical Risks

| Risk | Mitigation |
|------|------------|
| 대용량 vault 성능 | 결과 50개 제한, 디바운스, 캐싱 |
| 바이너리 파일 읽기 오류 | 확장자 기반 사전 필터링 |
| 메모리 누수 (이벤트 리스너) | 컴포넌트 해제 시 정리 |
| 한글 IME 입력 이슈 | compositionstart/end 이벤트 처리 |

## Open Questions (Resolved)

모든 기술적 결정사항이 확정되었습니다. Phase 1 설계로 진행합니다.
