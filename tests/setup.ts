/**
 * Vitest 테스트 셋업 파일
 * 모든 테스트 전에 실행됩니다.
 */

import { vi, beforeEach, afterEach } from 'vitest';

// Obsidian 모듈 모킹
vi.mock('obsidian', async () => {
	const mockModule = await import('./mocks/obsidian');
	return mockModule;
});

// 전역 DOM 관련 설정
beforeEach(() => {
	// 각 테스트 전에 DOM 초기화
	document.body.innerHTML = '';
});

afterEach(() => {
	// 각 테스트 후에 모든 타이머와 모킹 정리
	vi.clearAllMocks();
	vi.clearAllTimers();
});
