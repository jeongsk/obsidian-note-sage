/** @type {import('tailwindcss').Config} */
module.exports = {
	// 모든 Tailwind 유틸리티 클래스에 'tw-' 접두사 적용
	prefix: 'tw-',

	// Tailwind preflight(리셋 스타일) 비활성화 - scoped preflight 사용
	corePlugins: {
		preflight: false,
	},

	// TypeScript 파일에서 클래스 스캔
	content: ['./src/**/*.{ts,tsx}'],

	theme: {
		extend: {
			// Obsidian CSS 변수를 Tailwind 색상으로 매핑
			colors: {
				// 배경 색상
				'obs-bg': 'var(--background-primary)',
				'obs-bg-secondary': 'var(--background-secondary)',
				'obs-bg-tertiary': 'var(--background-secondary-alt)',
				'obs-bg-hover': 'var(--background-modifier-hover)',
				'obs-bg-active': 'var(--background-modifier-active-hover)',

				// 테두리 색상
				'obs-border': 'var(--background-modifier-border)',
				'obs-border-hover': 'var(--background-modifier-border-hover)',
				'obs-border-focus': 'var(--background-modifier-border-focus)',

				// 텍스트 색상
				'obs-text': 'var(--text-normal)',
				'obs-text-muted': 'var(--text-muted)',
				'obs-text-faint': 'var(--text-faint)',
				'obs-text-error': 'var(--text-error)',
				'obs-text-success': 'var(--text-success)',
				'obs-text-warning': 'var(--text-warning)',
				'obs-text-on-accent': 'var(--text-on-accent)',

				// 인터랙티브 색상
				'obs-accent': 'var(--interactive-accent)',
				'obs-accent-hover': 'var(--interactive-accent-hover)',
				'obs-success': 'var(--interactive-success)',

				// 상태 색상
				'obs-green': 'var(--color-green)',
				'obs-red': 'var(--color-red)',
				'obs-orange': 'var(--color-orange)',
				'obs-yellow': 'var(--color-yellow)',
				'obs-blue': 'var(--color-blue)',
				'obs-purple': 'var(--color-purple)',
				'obs-pink': 'var(--color-pink)',
				'obs-cyan': 'var(--color-cyan)',
			},

			// 테두리 반경
			borderRadius: {
				obs: 'var(--radius-s)',
				'obs-m': 'var(--radius-m)',
				'obs-l': 'var(--radius-l)',
			},

			// 폰트 크기
			fontSize: {
				'obs-smallest': 'var(--font-smallest)',
				'obs-smaller': 'var(--font-smaller)',
				'obs-small': 'var(--font-small)',
				'obs-ui-smaller': 'var(--font-ui-smaller)',
				'obs-ui-small': 'var(--font-ui-small)',
				'obs-ui-medium': 'var(--font-ui-medium)',
				'obs-ui-large': 'var(--font-ui-large)',
			},

			// 폰트 패밀리
			fontFamily: {
				'obs-interface': 'var(--font-interface)',
				'obs-text': 'var(--font-text)',
				'obs-mono': 'var(--font-monospace)',
			},

			// 그림자
			boxShadow: {
				obs: 'var(--shadow)',
				'obs-s': 'var(--shadow-s)',
				'obs-l': 'var(--shadow-l)',
			},

			// 간격 (Obsidian 표준 간격)
			spacing: {
				'obs-xs': 'var(--size-2-1)',
				'obs-sm': 'var(--size-2-2)',
				'obs-md': 'var(--size-4-1)',
				'obs-lg': 'var(--size-4-2)',
				'obs-xl': 'var(--size-4-3)',
			},
		},
	},

	plugins: [],
};
