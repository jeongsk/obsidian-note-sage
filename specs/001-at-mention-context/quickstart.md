# Quickstart: @ 멘션 컨텍스트 추가

**Date**: 2025-12-31
**Feature**: 001-at-mention-context

## Prerequisites

- Node.js 22+
- Obsidian Desktop 설치
- 개발용 vault 준비

## Setup

```bash
# 의존성 설치
npm install

# 개발 모드 시작
npm run dev

# 테스트 실행
npm run test
```

## Quick Implementation Guide

### 1. 타입 정의 추가 (src/mention/types.ts)

```typescript
// data-model.md의 타입 정의를 복사
export type MentionType = 'file' | 'folder';

export interface Mention {
  id: string;
  type: MentionType;
  path: string;
  displayName: string;
  icon: string;
}

// ... 나머지 타입들
```

### 2. MentionService 구현 (src/mention/MentionService.ts)

```typescript
import { App, TFile, TFolder, TAbstractFile } from 'obsidian';
import type { Mention, AutocompleteSuggestion, ContextAttachment } from './types';
import { MENTION_CONSTANTS } from './types';

export class MentionService {
  private app: App;
  private cache: AutocompleteSuggestion[] = [];

  constructor(app: App) {
    this.app = app;
    this.refreshCache();
  }

  async search(query: string): Promise<AutocompleteSuggestion[]> {
    const lowerQuery = query.toLowerCase();
    return this.cache
      .filter(item => item.displayName.toLowerCase().includes(lowerQuery))
      .slice(0, MENTION_CONSTANTS.MAX_SUGGESTIONS);
  }

  refreshCache(): void {
    this.cache = this.buildSuggestionList();
  }

  private buildSuggestionList(): AutocompleteSuggestion[] {
    const suggestions: AutocompleteSuggestion[] = [];
    const files = this.app.vault.getAllLoadedFiles();

    for (const file of files) {
      // 숨김 파일 제외
      if (file.name.startsWith('.')) continue;

      if (file instanceof TFile) {
        suggestions.push(this.fileToSuggestion(file));
      } else if (file instanceof TFolder && file.path !== '/') {
        suggestions.push(this.folderToSuggestion(file));
      }
    }

    return suggestions;
  }

  // ... 나머지 메서드 구현
}
```

### 3. AutocompletePopup 구현 (src/mention/AutocompletePopup.ts)

```typescript
import { setIcon } from 'obsidian';
import type { AutocompleteSuggestion } from './types';

export class AutocompletePopup {
  private containerEl: HTMLElement;
  private suggestions: AutocompleteSuggestion[] = [];
  private selectedIndex: number = 0;

  constructor(parentEl: HTMLElement, callbacks: { onSelect: Function }) {
    this.containerEl = parentEl.createDiv({ cls: 'sage-autocomplete-popup' });
    this.containerEl.style.display = 'none';
    // ... 초기화
  }

  show(x: number, y: number): void {
    this.containerEl.style.left = `${x}px`;
    this.containerEl.style.top = `${y}px`;
    this.containerEl.style.display = 'block';
    this.render();
  }

  hide(): void {
    this.containerEl.style.display = 'none';
  }

  // ... 나머지 메서드 구현
}
```

### 4. ChatView 통합 (src/ChatView.ts)

```typescript
// 기존 createInputField 메서드에 추가
private createInputField(): void {
  // 멘션 칩 컨테이너 추가
  this.mentionChipsContainer = this.inputContainer.createEl('div', {
    cls: 'sage-mention-chips'
  });

  // ... 기존 코드

  // MentionInput 초기화
  this.mentionInput = new MentionInput({
    inputEl: this.inputField,
    mentionChipsContainer: this.mentionChipsContainer,
    mentionService: new MentionService(this.app),
    // ... callbacks
  });
}
```

## File Structure

```text
src/
├── mention/
│   ├── types.ts                # 타입 정의
│   ├── MentionService.ts       # 핵심 서비스
│   ├── AutocompletePopup.ts    # 드롭다운 UI
│   ├── MentionInput.ts         # 입력 통합
│   └── index.ts                # 모듈 export
└── ChatView.ts                 # 통합 지점

tests/unit/mention/
├── MentionService.test.ts
├── AutocompletePopup.test.ts
└── MentionInput.test.ts
```

## CSS Classes

```css
/* 자동완성 드롭다운 */
.sage-autocomplete-popup { /* ... */ }
.sage-autocomplete-item { /* ... */ }
.sage-autocomplete-item.selected { /* ... */ }

/* 멘션 칩 */
.sage-mention-chips { /* ... */ }
.sage-mention-chip { /* ... */ }
.sage-mention-chip-icon { /* ... */ }
.sage-mention-chip-text { /* ... */ }
.sage-mention-chip-remove { /* ... */ }
```

## Testing

```bash
# 단위 테스트
npm run test

# 특정 테스트 파일
npm run test -- MentionService

# 커버리지
npm run test:coverage
```

## Key Test Cases

1. **검색 기능**: 빈 검색어, 부분 일치, 대소문자 구분 없음
2. **필터링**: 숨김 파일 제외, 결과 50개 제한
3. **키보드 탐색**: 위/아래 화살표, Enter, Escape
4. **파일 컨텍스트**: 텍스트 파일 내용 읽기, 바이너리 파일 처리
5. **폴더 컨텍스트**: 파일 목록 생성, 깊이 제한

## Common Issues

### IME 입력 문제 (한글)

```typescript
// compositionstart/end 이벤트 처리
inputEl.addEventListener('compositionstart', () => {
  this.isComposing = true;
});
inputEl.addEventListener('compositionend', () => {
  this.isComposing = false;
  this.handleInput();
});
```

### 드롭다운 위치 계산

```typescript
// 입력창 기준 상대 위치
const rect = inputEl.getBoundingClientRect();
const caretPos = this.getCaretCoordinates(inputEl, inputEl.selectionStart);
popup.show(caretPos.left, rect.bottom);
```

## Next Steps

구현 완료 후:

1. `/speckit.tasks` 명령으로 작업 목록 생성
2. 각 작업을 순서대로 구현
3. 테스트 작성 및 검증
4. PR 생성 및 리뷰
