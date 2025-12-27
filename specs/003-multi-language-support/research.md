# Research: Multi-Language Support

**Branch**: `003-multi-language-support` | **Date**: 2025-12-27

## Research Summary

This document consolidates research findings for extending the Note Sage plugin from 2 languages (English, Korean) to 11 languages.

---

## 1. Existing i18n Architecture Analysis

### Decision: Extend current architecture (no migration needed)

**Rationale**: The existing i18n system in `src/i18n/` is well-designed and follows standard patterns:
- Type-safe translation keys via `TranslationKeys` interface
- Fallback to English for missing translations
- Auto-detection of system language
- Simple `t('key.path')` function for translations

**Current Implementation**:
- `SupportedLanguage` type: `'en' | 'ko' | 'auto'`
- `translations` object: Maps language codes to translation objects
- `AVAILABLE_LANGUAGES` array: Display labels for language selector

**Alternatives Considered**:
- i18next library: Overkill for this use case, adds bundle size
- obsidian-i18n-plugin: Not applicable (for plugin authors)

---

## 2. Language Code Standards

### Decision: Use ISO 639-1 two-letter codes

| Language | Code | Native Name | Text Direction |
|----------|------|-------------|----------------|
| English | `en` | English | LTR |
| Spanish | `es` | Español | LTR |
| French | `fr` | Français | LTR |
| German | `de` | Deutsch | LTR |
| Portuguese | `pt` | Português | LTR |
| Japanese | `ja` | 日本語 | LTR |
| Korean | `ko` | 한국어 | LTR |
| Chinese (Simplified) | `zh` | 简体中文 | LTR |
| Arabic | `ar` | العربية | **RTL** |
| Russian | `ru` | Русский | LTR |
| Hindi | `hi` | हिन्दी | LTR |

**Rationale**: ISO 639-1 codes are standard, widely recognized, and match browser `navigator.language` output.

**Alternatives Considered**:
- BCP 47 tags (e.g., `zh-CN`): More specific but unnecessary complexity for this feature

---

## 3. RTL (Right-to-Left) Support for Arabic

### Decision: CSS-based RTL with `dir="rtl"` attribute

**Implementation Approach**:
1. Add `dir` attribute to chat container when Arabic is selected
2. Use CSS logical properties where possible (`margin-inline-start` vs `margin-left`)
3. Add specific RTL overrides in `styles.css`

**Key CSS Considerations**:
```css
/* RTL Support */
.sage-chat-container[dir="rtl"] {
  text-align: right;
}

.sage-chat-container[dir="rtl"] .sage-chat-header {
  flex-direction: row-reverse;
}

.sage-chat-container[dir="rtl"] .sage-file-context-toggle {
  flex-direction: row-reverse;
}
```

**Rationale**: CSS-based approach is lightweight and doesn't require JavaScript runtime checks.

**Alternatives Considered**:
- JS-based direction switching: More complex, unnecessary for this use case
- Separate RTL stylesheet: Increases bundle size, harder to maintain

---

## 4. Translation File Structure

### Decision: One TypeScript file per language implementing `TranslationKeys` interface

**File Naming Convention**: `{language-code}.ts` (e.g., `es.ts`, `fr.ts`)

**Template Structure** (from existing `en.ts`):
```typescript
import type { TranslationKeys } from './en';

export const es: TranslationKeys = {
  appTitle: 'Note Sage',
  examples: 'Ejemplos',
  // ... all keys from TranslationKeys interface
};
```

**Rationale**:
- Type safety: TypeScript compiler enforces all keys are present
- IDE support: Autocompletion and error checking
- Maintainability: Easy to compare with English source

**Alternatives Considered**:
- JSON files: No type safety, requires runtime loading
- YAML files: Adds dependency, no IDE type support

---

## 5. Language Detection and Fallback Strategy

### Decision: Hierarchical fallback system

**Priority Order**:
1. User-selected language (from settings)
2. System/browser language detection
3. English (ultimate fallback)

**String-level Fallback**:
- If a specific translation key is missing in the selected language, fall back to English
- Log warning in development mode (existing behavior)

**Rationale**: Matches existing implementation pattern while ensuring no broken UI.

---

## 6. Translation Content Strategy

### Decision: Professional-quality translations with technical accuracy

**Translation Sources**:
1. AI-generated translations (initial draft)
2. Native speaker review (recommended for production)
3. Community contributions (post-launch)

**Translation Guidelines**:
- Preserve technical terms (API, MCP, Claude, etc.)
- Maintain consistent tone across languages
- Keep translations concise for UI space constraints
- Test RTL rendering for Arabic

**Total Translation Effort**:
- ~370 strings per language
- 9 new languages × 370 strings = ~3,330 translations

---

## 7. Performance Considerations

### Decision: Static imports (no lazy loading)

**Rationale**:
- Total translation file size is small (~10-15KB per language)
- All languages bundled = ~150KB additional bundle size
- Acceptable for desktop Obsidian plugin
- Simplifies implementation (no async loading logic)

**Alternatives Considered**:
- Dynamic imports: Adds complexity, negligible benefit for small files
- Lazy loading: Introduces loading states, not worth the complexity

---

## 8. UI/UX Considerations

### Decision: Native language names in selector

**Language Selector Display**:
```typescript
const AVAILABLE_LANGUAGES = [
  { value: 'auto', label: 'Auto (System)' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '简体中文' },
  { value: 'ar', label: 'العربية' },
  { value: 'ru', label: 'Русский' },
  { value: 'hi', label: 'हिन्दी' },
];
```

**Rationale**: Users can identify their language regardless of current UI language.

---

## Summary of Key Decisions

| Decision Area | Choice | Impact |
|---------------|--------|--------|
| Architecture | Extend existing i18n | Minimal code changes |
| Language Codes | ISO 639-1 | Standard, compatible |
| RTL Support | CSS-based | Lightweight |
| Translation Files | TypeScript | Type-safe |
| Fallback | English | Robust UX |
| Loading | Static imports | Simple |
| UI Labels | Native names | User-friendly |
