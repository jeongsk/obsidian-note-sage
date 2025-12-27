# Implementation Plan: Multi-Language Support

**Branch**: `003-multi-language-support` | **Date**: 2025-12-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-multi-language-support/spec.md`

## Summary

Extend the existing i18n system (currently supporting English and Korean) to support 11 languages total: English, Spanish, French, German, Portuguese, Japanese, Korean, Chinese (Simplified), Arabic, Russian, and Hindi. The implementation includes adding 9 new locale files, updating the language selector, and adding RTL support for Arabic.

## Technical Context

**Language/Version**: TypeScript 5.7+
**Primary Dependencies**: Obsidian API, @anthropic-ai/claude-agent-sdk ^0.1.5
**Storage**: Obsidian Plugin Settings (data.json)
**Testing**: Manual testing in Obsidian
**Target Platform**: Obsidian Desktop (macOS, Windows, Linux)
**Project Type**: Single Obsidian plugin
**Performance Goals**: Language changes apply within 1 second (no perceivable delay)
**Constraints**: Must integrate with existing i18n system in `src/i18n/`
**Scale/Scope**: 11 languages, ~370 translation strings per language

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No constitution violations detected. This feature:
- Extends existing functionality without architectural changes
- Uses standard localization patterns
- Maintains existing code conventions (TypeScript, CSS prefixed with `sage-`)

## Project Structure

### Documentation (this feature)

```text
specs/003-multi-language-support/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── i18n/
│   ├── index.ts              # i18n module (update SupportedLanguage type, AVAILABLE_LANGUAGES)
│   └── locales/
│       ├── en.ts             # English (existing, serves as template)
│       ├── ko.ts             # Korean (existing)
│       ├── es.ts             # Spanish (NEW)
│       ├── fr.ts             # French (NEW)
│       ├── de.ts             # German (NEW)
│       ├── pt.ts             # Portuguese (NEW)
│       ├── ja.ts             # Japanese (NEW)
│       ├── zh.ts             # Chinese Simplified (NEW)
│       ├── ar.ts             # Arabic (NEW)
│       ├── ru.ts             # Russian (NEW)
│       └── hi.ts             # Hindi (NEW)
├── types.ts                  # SupportedLanguage type import
├── SettingsTab.ts            # Language selector UI
├── ChatView.ts               # RTL support for Arabic
└── main.ts                   # Plugin entry point

styles.css                    # RTL styles for Arabic (NEW)
```

**Structure Decision**: Single project structure. New locale files added to existing `src/i18n/locales/` directory. CSS RTL support added to existing `styles.css`.

## Complexity Tracking

> No violations requiring justification.

