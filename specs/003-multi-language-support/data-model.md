# Data Model: Multi-Language Support

**Branch**: `003-multi-language-support` | **Date**: 2025-12-27

## Overview

This document defines the data structures and types for the multi-language support feature.

---

## 1. Type Definitions

### 1.1 SupportedLanguage (Updated)

**File**: `src/i18n/index.ts`

```typescript
// Current (2 languages)
export type SupportedLanguage = 'en' | 'ko' | 'auto';

// Updated (11 languages)
export type SupportedLanguage =
  | 'en'   // English
  | 'es'   // Spanish
  | 'fr'   // French
  | 'de'   // German
  | 'pt'   // Portuguese
  | 'ja'   // Japanese
  | 'ko'   // Korean
  | 'zh'   // Chinese (Simplified)
  | 'ar'   // Arabic
  | 'ru'   // Russian
  | 'hi'   // Hindi
  | 'auto'; // System detection
```

### 1.2 LanguageOption

**File**: `src/i18n/index.ts`

```typescript
interface LanguageOption {
  value: SupportedLanguage;
  label: string;        // Native language name for display
  direction: 'ltr' | 'rtl';  // Text direction (NEW)
}
```

### 1.3 TranslationKeys (Existing - No Changes)

**File**: `src/i18n/locales/en.ts`

The `TranslationKeys` interface remains unchanged. All new locale files must implement this interface completely.

---

## 2. Configuration Data

### 2.1 AVAILABLE_LANGUAGES (Updated)

**File**: `src/i18n/index.ts`

```typescript
export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { value: 'auto', label: 'Auto (System)', direction: 'ltr' },
  { value: 'en', label: 'English', direction: 'ltr' },
  { value: 'es', label: 'Español', direction: 'ltr' },
  { value: 'fr', label: 'Français', direction: 'ltr' },
  { value: 'de', label: 'Deutsch', direction: 'ltr' },
  { value: 'pt', label: 'Português', direction: 'ltr' },
  { value: 'ja', label: '日本語', direction: 'ltr' },
  { value: 'ko', label: '한국어', direction: 'ltr' },
  { value: 'zh', label: '简体中文', direction: 'ltr' },
  { value: 'ar', label: 'العربية', direction: 'rtl' },
  { value: 'ru', label: 'Русский', direction: 'ltr' },
  { value: 'hi', label: 'हिन्दी', direction: 'ltr' },
];
```

### 2.2 Translation Registry (Updated)

**File**: `src/i18n/index.ts`

```typescript
import { en } from './locales/en';
import { ko } from './locales/ko';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { pt } from './locales/pt';
import { ja } from './locales/ja';
import { zh } from './locales/zh';
import { ar } from './locales/ar';
import { ru } from './locales/ru';
import { hi } from './locales/hi';

const translations: Record<string, TranslationKeys> = {
  en, ko, es, fr, de, pt, ja, zh, ar, ru, hi
};
```

---

## 3. Settings Integration

### 3.1 NoteSageSettings (No Changes)

**File**: `src/types.ts`

The `language` field type is already imported from `SupportedLanguage`:

```typescript
import type { SupportedLanguage } from './i18n';

export interface NoteSageSettings {
  // ... existing fields
  language?: SupportedLanguage;  // Already supports the updated type
  // ...
}
```

---

## 4. New Helper Functions

### 4.1 getTextDirection

**File**: `src/i18n/index.ts`

```typescript
/**
 * Get the text direction for the current language
 */
export function getTextDirection(): 'ltr' | 'rtl' {
  const lang = getEffectiveLanguage();
  const langOption = AVAILABLE_LANGUAGES.find(l => l.value === lang);
  return langOption?.direction || 'ltr';
}
```

### 4.2 isRtlLanguage

**File**: `src/i18n/index.ts`

```typescript
/**
 * Check if the current language is RTL
 */
export function isRtlLanguage(): boolean {
  return getTextDirection() === 'rtl';
}
```

---

## 5. Locale File Structure

Each locale file follows this structure (example for Spanish):

**File**: `src/i18n/locales/es.ts`

```typescript
import type { TranslationKeys } from './en';

export const es: TranslationKeys = {
  // App title
  appTitle: 'Note Sage',  // Keep brand name

  // Header buttons
  examples: 'Ejemplos',
  pluginSettings: 'Configuración del plugin',
  newChat: 'Nuevo chat',
  selectModel: 'Seleccionar modelo Claude',

  // Quick actions
  quickAction: {
    summarize: 'Resumir',
    summarizePrompt: 'Por favor, resume este documento de forma concisa.',
    // ... all nested keys
  },

  // ... all other TranslationKeys
};
```

---

## 6. CSS Data Attributes

### 6.1 RTL Container Attribute

The chat container will use a `dir` attribute for RTL support:

```html
<!-- LTR (most languages) -->
<div class="sage-chat-container" dir="ltr">

<!-- RTL (Arabic) -->
<div class="sage-chat-container" dir="rtl">
```

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│  NoteSageSettings   │
├─────────────────────┤
│ language: string    │──────┐
└─────────────────────┘      │
                              │
         ┌────────────────────▼───────────────────┐
         │           SupportedLanguage            │
         ├────────────────────────────────────────┤
         │ 'en'|'es'|'fr'|'de'|'pt'|'ja'|'ko'|   │
         │ 'zh'|'ar'|'ru'|'hi'|'auto'            │
         └────────────────────────────────────────┘
                              │
         ┌────────────────────▼───────────────────┐
         │          translations (Map)             │
         ├────────────────────────────────────────┤
         │ Key: language code                      │
         │ Value: TranslationKeys object           │
         └────────────────────────────────────────┘
                              │
         ┌────────────────────▼───────────────────┐
         │          TranslationKeys                │
         ├────────────────────────────────────────┤
         │ appTitle: string                        │
         │ examples: string                        │
         │ quickAction: QuickActionTranslations    │
         │ settings: SettingsTranslations          │
         │ commands: CommandsTranslations          │
         │ ... (370+ fields total)                 │
         └────────────────────────────────────────┘
```

---

## Validation Rules

1. **Complete Translations**: Every locale file must implement all keys from `TranslationKeys` interface
2. **Type Safety**: TypeScript compiler enforces completeness at build time
3. **Fallback**: Missing translations fall back to English at runtime
4. **Direction**: Only Arabic (`ar`) uses RTL direction
5. **Persistence**: Language setting stored in Obsidian's plugin data.json
