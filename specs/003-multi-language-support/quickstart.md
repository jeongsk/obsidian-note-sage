# Quickstart: Multi-Language Support

**Branch**: `003-multi-language-support` | **Date**: 2025-12-27

## Prerequisites

- Node.js 18+
- npm
- Obsidian (for testing)

## Development Setup

```bash
# Clone and checkout feature branch
git checkout 003-multi-language-support

# Install dependencies
npm install

# Start development mode
npm run dev
```

## Key Files to Modify

| Priority | File | Changes |
|----------|------|---------|
| 1 | `src/i18n/index.ts` | Update `SupportedLanguage` type, add new imports, update `AVAILABLE_LANGUAGES` |
| 2 | `src/i18n/locales/*.ts` | Create 9 new locale files (es, fr, de, pt, ja, zh, ar, ru, hi) |
| 3 | `src/ChatView.ts` | Add RTL support for Arabic |
| 4 | `styles.css` | Add RTL CSS overrides |

## Creating a New Locale File

1. Copy `src/i18n/locales/en.ts` as template
2. Rename to `{lang-code}.ts` (e.g., `es.ts`)
3. Update the export name and translations:

```typescript
// src/i18n/locales/es.ts
import type { TranslationKeys } from './en';

export const es: TranslationKeys = {
  appTitle: 'Note Sage',
  examples: 'Ejemplos',
  // ... translate all strings
};
```

4. Register in `src/i18n/index.ts`:

```typescript
import { es } from './locales/es';

const translations: Record<string, TranslationKeys> = {
  en, ko, es, // ... add new language
};
```

## Testing

### Manual Testing Checklist

- [ ] Language selector shows all 11 languages
- [ ] Selecting each language updates UI immediately
- [ ] Language preference persists after Obsidian restart
- [ ] Arabic RTL layout displays correctly
- [ ] Fallback to English for missing translations works
- [ ] System language auto-detection works

### Test Each Language

1. Open Obsidian > Settings > Note Sage
2. Change language to each of the 11 options
3. Verify:
   - Chat interface text is translated
   - Settings panel text is translated
   - Quick action buttons are translated
   - Error messages are translated

### Test RTL (Arabic)

1. Select Arabic (`العربية`)
2. Verify:
   - Text aligns right
   - Chat bubbles align correctly
   - Settings layout mirrors

## Build

```bash
# Production build
npm run build

# Output files
# - main.js
# - styles.css
# - manifest.json
```

## Translation Guidelines

### Do's
- Keep `Note Sage` as the brand name (don't translate)
- Keep technical terms: API, MCP, Claude, JSON, etc.
- Match formal/informal tone consistently per language
- Test UI rendering (some translations may be longer)

### Don'ts
- Don't use machine translation without review
- Don't change translation key structure
- Don't leave any TranslationKeys unimplemented

## File Structure Reference

```
src/i18n/
├── index.ts                 # i18n module
└── locales/
    ├── en.ts               # English (source/template)
    ├── ko.ts               # Korean (existing)
    ├── es.ts               # Spanish (NEW)
    ├── fr.ts               # French (NEW)
    ├── de.ts               # German (NEW)
    ├── pt.ts               # Portuguese (NEW)
    ├── ja.ts               # Japanese (NEW)
    ├── zh.ts               # Chinese Simplified (NEW)
    ├── ar.ts               # Arabic (NEW)
    ├── ru.ts               # Russian (NEW)
    └── hi.ts               # Hindi (NEW)
```

## Common Issues

### TypeScript Error: Missing Translation Key

**Problem**: `Property 'newKey' is missing in type...`

**Solution**: Ensure all locale files implement every key from `TranslationKeys` interface.

### UI Text Overflow

**Problem**: Translated text is too long for UI element.

**Solution**: Use shorter translation or abbreviation. Test in narrowest sidebar width.

### RTL Not Applying

**Problem**: Arabic text displays LTR.

**Solution**: Ensure `dir="rtl"` attribute is set on container and CSS rules use `[dir="rtl"]` selector.
