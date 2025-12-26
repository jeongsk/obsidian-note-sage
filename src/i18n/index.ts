// Internationalization (i18n) module for Note Sage
import { en, TranslationKeys } from './locales/en';
import { ko } from './locales/ko';

export type SupportedLanguage = 'en' | 'ko' | 'auto';

const translations: Record<string, TranslationKeys> = {
	en,
	ko,
};

let currentLanguage: SupportedLanguage = 'auto';

/**
 * Detect the system/browser language
 */
function detectSystemLanguage(): string {
	// Try navigator.language first
	const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en';

	// Extract the language code (e.g., 'ko-KR' -> 'ko')
	const langCode = browserLang.split('-')[0].toLowerCase();

	return langCode;
}

/**
 * Get the effective language (resolves 'auto' to actual language)
 */
function getEffectiveLanguage(): string {
	if (currentLanguage === 'auto') {
		const detected = detectSystemLanguage();
		// Return detected language if we have translations for it, otherwise fall back to English
		return translations[detected] ? detected : 'en';
	}
	return currentLanguage;
}

/**
 * Set the current language
 */
export function setLanguage(lang: SupportedLanguage): void {
	currentLanguage = lang;
}

/**
 * Get the current language setting
 */
export function getLanguage(): SupportedLanguage {
	return currentLanguage;
}

/**
 * Get the current translations object
 */
export function getTranslations(): TranslationKeys {
	const lang = getEffectiveLanguage();
	return translations[lang] || translations.en;
}

/**
 * Translation function - gets a translation by key path
 *
 * Usage:
 *   t('appTitle') -> 'Note Sage'
 *   t('settings.apiKey') -> 'Anthropic API Key'
 *   t('quickAction.summarize') -> 'Summarize'
 */
export function t(keyPath: string): string {
	const trans = getTranslations();
	const keys = keyPath.split('.');

	let result: unknown = trans;
	for (const key of keys) {
		if (result && typeof result === 'object' && key in result) {
			result = (result as Record<string, unknown>)[key];
		} else {
			// Key not found, return the key path as fallback
			console.warn(`[i18n] Translation key not found: ${keyPath}`);
			return keyPath;
		}
	}

	if (typeof result === 'string') {
		return result;
	}

	// If result is not a string (e.g., an object), return the key path
	console.warn(`[i18n] Translation value is not a string: ${keyPath}`);
	return keyPath;
}

/**
 * List of available languages with their labels
 */
export const AVAILABLE_LANGUAGES: Array<{ value: SupportedLanguage; label: string }> = [
	{ value: 'auto', label: 'Auto (System)' },
	{ value: 'en', label: 'English' },
	{ value: 'ko', label: '한국어' },
];

// Re-export types
export type { TranslationKeys };
