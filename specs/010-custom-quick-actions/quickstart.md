# Quickstart: Custom Quick Actions

**Feature**: 010-custom-quick-actions  
**Date**: 2025-01-03

## Overview

이 기능을 통해 사용자는 설정에서 자신만의 빠른 액션 버튼을 추가할 수 있습니다. 커스텀 빠른 액션은 기본 액션(요약, 개선, 분석, 번역) 다음에 표시됩니다.

## Implementation Steps

### Step 1: 타입 정의 추가

**File**: `src/types.ts`

```typescript
// Quick Actions 섹션에 추가

/**
 * 사용자 정의 빠른 액션
 */
export interface CustomQuickAction {
  id: string;
  name: string;
  prompt: string;
  enabled: boolean;
  order: number;
}

// NoteSageSettings에 필드 추가
export interface NoteSageSettings {
  // ... 기존 필드 ...
  customQuickActions?: CustomQuickAction[];
}

// DEFAULT_SETTINGS에 기본값 추가
export const DEFAULT_SETTINGS: NoteSageSettings = {
  // ... 기존 값 ...
  customQuickActions: [],
};
```

### Step 2: 설정 UI 구현

**File**: `src/SettingsTab.ts`

```typescript
// renderQuickActionsSettings() 메서드 확장

// 커스텀 빠른 액션 섹션 추가
private renderCustomQuickActionsSettings(containerEl: HTMLElement): void {
  const customActions = this.plugin.settings.customQuickActions || [];
  
  // 각 커스텀 액션 렌더링
  for (const action of customActions) {
    // 이름 입력, 프롬프트 입력, 토글, 순서 버튼, 삭제 버튼
  }
  
  // "커스텀 빠른 액션 추가" 버튼
  new Setting(containerEl)
    .addButton(button => {
      button
        .setButtonText(t('settings.customQuickActions.add'))
        .onClick(() => this.addCustomQuickAction());
    });
}

private addCustomQuickAction(): void {
  const newAction: CustomQuickAction = {
    id: crypto.randomUUID(),
    name: '',
    prompt: '',
    enabled: true,
    order: (this.plugin.settings.customQuickActions?.length || 0),
  };
  // 배열에 추가 후 UI 갱신
}
```

### Step 3: ChatView 렌더링 수정

**File**: `src/ChatView.ts`

```typescript
// renderQuickActions() 수정

private renderQuickActions(): void {
  this.quickActionsContainer.empty();

  // 1. 기본 액션 렌더링 (기존 로직)
  const enabledDefaultActions = QUICK_ACTION_DEFINITIONS.filter(def => {
    const config = this.getQuickActionConfig(def.id);
    return config.enabled;
  });

  for (const action of enabledDefaultActions) {
    // 기존 버튼 생성 로직
  }

  // 2. 커스텀 액션 렌더링 (새로 추가)
  const customActions = (this.settings.customQuickActions || [])
    .filter(a => a.enabled)
    .sort((a, b) => a.order - b.order);

  for (const action of customActions) {
    const button = this.quickActionsContainer.createEl('button', {
      cls: 'sage-quick-action-button',
      attr: { 'aria-label': action.name }
    });

    const iconEl = button.createEl('span', { cls: 'sage-quick-action-icon' });
    setIcon(iconEl, 'zap'); // 기본 아이콘

    button.createEl('span', { text: action.name, cls: 'sage-quick-action-label' });

    this.registerDomEvent(button, 'click', () => {
      if (!this.isProcessing) {
        this.sendMessage(action.prompt);
      }
    });
  }

  // 모든 액션이 없으면 컨테이너 숨김
  if (enabledDefaultActions.length === 0 && customActions.length === 0) {
    this.quickActionsContainer.addClass('hidden');
  } else {
    this.quickActionsContainer.removeClass('hidden');
  }
}
```

### Step 4: i18n 키 추가

**File**: `src/i18n/locales/en.ts` (및 다른 언어 파일들)

```typescript
// settings 섹션에 추가
'settings.customQuickActions.add': 'Add Custom Quick Action',
'settings.customQuickActions.name': 'Name',
'settings.customQuickActions.namePlaceholder': 'e.g., Code Review',
'settings.customQuickActions.prompt': 'Prompt',
'settings.customQuickActions.promptPlaceholder': 'Enter the prompt to send...',
'settings.customQuickActions.delete': 'Delete',
'settings.customQuickActions.deleteConfirm': 'Are you sure you want to delete "{name}"?',
'settings.customQuickActions.moveUp': 'Move Up',
'settings.customQuickActions.moveDown': 'Move Down',
```

### Step 5: 삭제 확인 모달 (선택)

기존 `SkillDeleteModal` 패턴을 참조하여 `CustomQuickActionDeleteModal` 생성하거나, 인라인 확인 다이얼로그 사용.

## Testing Checklist

- [ ] 커스텀 빠른 액션 추가 (이름, 프롬프트 입력)
- [ ] 저장 후 채팅 뷰에 버튼 표시 확인
- [ ] 버튼 클릭 시 프롬프트 전송 확인
- [ ] 이름/프롬프트 수정 후 반영 확인
- [ ] 비활성화 시 채팅 뷰에서 숨김 확인
- [ ] 순서 변경 후 채팅 뷰 순서 확인
- [ ] 삭제 후 목록에서 제거 확인
- [ ] Obsidian 재시작 후 데이터 유지 확인
- [ ] 빈 이름/프롬프트 저장 방지 확인

## Key Files to Modify

| File | Changes |
|------|---------|
| `src/types.ts` | `CustomQuickAction` 인터페이스, `NoteSageSettings` 확장 |
| `src/SettingsTab.ts` | 커스텀 액션 설정 UI (CRUD) |
| `src/ChatView.ts` | `renderQuickActions()` 확장 |
| `src/i18n/locales/*.ts` | 11개 언어 번역 키 추가 |
