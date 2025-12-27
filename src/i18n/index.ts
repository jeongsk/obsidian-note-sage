// Internationalization (i18n) module for Note Sage
import { en, TranslationKeys } from './locales/en';
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

const translations: Record<string, TranslationKeys> = {
	en,
	es,
	fr,
	de,
	pt,
	ja,
	ko,
	zh,
	ar,
	ru,
	hi,
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
 * Language option with text direction
 */
interface LanguageOption {
	value: SupportedLanguage;
	label: string;
	direction: 'ltr' | 'rtl';
}

/**
 * List of available languages with their labels and text direction
 */
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

/**
 * Get the text direction for the current language
 */
export function getTextDirection(): 'ltr' | 'rtl' {
	const lang = getEffectiveLanguage();
	const langOption = AVAILABLE_LANGUAGES.find(l => l.value === lang);
	return langOption?.direction || 'ltr';
}

/**
 * Check if the current language is RTL
 */
export function isRtlLanguage(): boolean {
	return getTextDirection() === 'rtl';
}

// Re-export types
export type { TranslationKeys };
