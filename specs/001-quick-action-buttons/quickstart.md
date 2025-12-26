# Quickstart: Quick Action Buttons Customization

**Date**: 2025-12-26
**Feature**: 001-quick-action-buttons

## Overview

이 기능은 채팅 입력창 위의 빠른 액션 버튼(요약, 개선, 분석, 번역)을 커스터마이징할 수 있게 합니다.

## Implementation Steps

### Step 1: types.ts 수정

`src/types.ts`에 새로운 인터페이스와 상수를 추가합니다:

```typescript
// Quick Action 설정 인터페이스
export interface QuickActionConfig {
  id: string;
  enabled: boolean;
  customPrompt?: string;
}

// Quick Action 정의 (정적)
export interface QuickActionDefinition {
  id: string;
  icon: string;
  labelKey: string;
  promptKey: string;
}

// 빠른 액션 정의 목록
export const QUICK_ACTION_DEFINITIONS: QuickActionDefinition[] = [
  { id: 'summarize', icon: 'file-text', labelKey: 'quickAction.summarize', promptKey: 'quickAction.summarizePrompt' },
  { id: 'improve', icon: 'edit', labelKey: 'quickAction.improve', promptKey: 'quickAction.improvePrompt' },
  { id: 'analyze', icon: 'search', labelKey: 'quickAction.analyze', promptKey: 'quickAction.analyzePrompt' },
  { id: 'translate', icon: 'languages', labelKey: 'quickAction.translate', promptKey: 'quickAction.translatePrompt' },
];

// NoteSageSettings에 quickActions 필드 추가
interface NoteSageSettings {
  // ... 기존 필드 ...
  quickActions?: QuickActionConfig[];
}

// DEFAULT_SETTINGS에 기본값 추가
const DEFAULT_SETTINGS: NoteSageSettings = {
  // ... 기존 값 ...
  quickActions: QUICK_ACTION_DEFINITIONS.map(def => ({
    id: def.id,
    enabled: true,
    customPrompt: undefined,
  })),
};
```

### Step 2: ChatView.ts 수정

`createQuickActions()` 메서드를 settings 기반으로 수정합니다:

```typescript
private createQuickActions(): void {
  const quickActionsEl = this.inputContainer.createEl('div', { cls: 'sage-quick-actions' });

  // 활성화된 버튼만 필터링
  const enabledActions = QUICK_ACTION_DEFINITIONS.filter(def => {
    const config = this.settings.quickActions?.find(c => c.id === def.id);
    return config?.enabled !== false;
  });

  // 모든 버튼이 비활성화되면 컨테이너 숨김
  if (enabledActions.length === 0) {
    quickActionsEl.addClass('hidden');
    return;
  }

  for (const action of enabledActions) {
    const config = this.settings.quickActions?.find(c => c.id === action.id);
    const prompt = config?.customPrompt || t(action.promptKey);

    // 버튼 생성 (기존 로직과 동일, prompt 변수 사용)
    const button = quickActionsEl.createEl('button', { ... });
    // ...
  }
}
```

### Step 3: SettingsTab.ts 수정

"Quick Actions" 설정 섹션을 추가합니다:

```typescript
// Quick Actions 섹션
new Setting(containerEl)
  .setName(t('settings.quickActions'))
  .setHeading();

for (const def of QUICK_ACTION_DEFINITIONS) {
  const config = this.plugin.settings.quickActions?.find(c => c.id === def.id)
    || { id: def.id, enabled: true, customPrompt: undefined };

  // 토글 + 프롬프트 편집
  const setting = new Setting(containerEl)
    .setName(t(def.labelKey))
    .addToggle(toggle => toggle
      .setValue(config.enabled)
      .onChange(async (value) => {
        // enabled 업데이트 로직
      }))
    .addTextArea(text => text
      .setPlaceholder(t(def.promptKey))
      .setValue(config.customPrompt || '')
      .onChange(async (value) => {
        // customPrompt 업데이트 로직
      }))
    .addExtraButton(button => button
      .setIcon('reset')
      .setTooltip(t('settings.resetToDefault'))
      .onClick(async () => {
        // customPrompt 초기화 로직
      }));
}
```

### Step 4: i18n 업데이트

`src/i18n/locales/en.ts`와 `ko.ts`에 새 번역 키 추가:

```typescript
settings: {
  // ... 기존 ...
  quickActions: 'Quick Actions',
  quickActionsDesc: 'Configure quick action buttons above the chat input',
  resetToDefault: 'Reset to default',
}
```

## Testing Checklist

- [ ] 각 버튼 개별 비활성화 시 채팅 뷰에서 사라짐
- [ ] 모든 버튼 비활성화 시 Quick Actions 영역 숨김
- [ ] 커스텀 프롬프트 저장 및 버튼 클릭 시 적용 확인
- [ ] 리셋 버튼 클릭 시 기본 프롬프트로 복원
- [ ] Obsidian 재시작 후 설정 유지 확인
- [ ] 한국어/영어 언어 전환 시 기본 프롬프트 언어 변경 확인
