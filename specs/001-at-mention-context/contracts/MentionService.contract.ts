/**
 * MentionService Contract
 *
 * 멘션 기능의 핵심 서비스 인터페이스를 정의합니다.
 * 파일/폴더 검색, 컨텍스트 생성 등의 기능을 제공합니다.
 *
 * @module contracts/MentionService
 */

import type { App } from 'obsidian';
import type {
  Mention,
  AutocompleteSuggestion,
  ContextAttachment,
} from '../data-model';

/**
 * MentionService 인터페이스
 *
 * @description
 * 멘션 관련 비즈니스 로직을 처리하는 서비스입니다.
 * Obsidian의 Vault API를 사용하여 파일 시스템에 접근합니다.
 */
export interface IMentionService {
  /**
   * 자동완성 제안 목록을 검색합니다.
   *
   * @param query - 검색어 (@ 뒤의 문자열)
   * @returns 검색 결과 목록 (최대 50개, 점수 내림차순)
   *
   * @example
   * ```typescript
   * const suggestions = await mentionService.search('read');
   * // [{ type: 'file', path: 'README.md', displayName: 'README.md', ... }]
   * ```
   *
   * @requirements
   * - FR-002: vault 내 파일과 폴더 표시
   * - FR-003: 실시간 필터링
   * - 숨김 파일/폴더 제외 (.으로 시작)
   */
  search(query: string): Promise<AutocompleteSuggestion[]>;

  /**
   * 자동완성 제안을 Mention으로 변환합니다.
   *
   * @param suggestion - 선택된 자동완성 제안
   * @returns Mention 객체
   *
   * @example
   * ```typescript
   * const mention = mentionService.createMention(suggestion);
   * ```
   */
  createMention(suggestion: AutocompleteSuggestion): Mention;

  /**
   * Mention을 ContextAttachment로 변환합니다.
   * 파일은 내용을, 폴더는 파일 목록을 포함합니다.
   *
   * @param mention - 변환할 멘션
   * @returns 컨텍스트 첨부 객체
   *
   * @example
   * ```typescript
   * const context = await mentionService.createContext(mention);
   * if (context.type === 'file') {
   *   console.log(context.content);
   * }
   * ```
   *
   * @requirements
   * - FR-005: 파일 내용 컨텍스트 포함
   * - FR-006: 폴더 파일 목록 포함
   * - FR-012: 바이너리 파일은 정보만 포함
   */
  createContext(mention: Mention): Promise<ContextAttachment>;

  /**
   * 여러 Mention을 하나의 컨텍스트 문자열로 변환합니다.
   * 중복 멘션은 제거됩니다.
   *
   * @param mentions - 멘션 목록
   * @returns 포맷된 컨텍스트 문자열
   *
   * @example
   * ```typescript
   * const contextString = await mentionService.buildContextString(mentions);
   * // `<mentioned_file path="...">...</mentioned_file>`
   * ```
   *
   * @requirements
   * - Edge Case: 동일 파일 중복 멘션 시 한 번만 포함
   */
  buildContextString(mentions: Mention[]): Promise<string>;

  /**
   * 파일 크기가 대용량인지 확인합니다.
   *
   * @param path - 파일 경로
   * @returns 100KB 초과 여부
   *
   * @requirements
   * - Edge Case: 매우 큰 파일 처리
   */
  isLargeFile(path: string): Promise<boolean>;

  /**
   * 파일/폴더 존재 여부를 확인합니다.
   *
   * @param path - 파일/폴더 경로
   * @returns 존재 여부
   *
   * @requirements
   * - FR-011: 존재하지 않는 파일/폴더 오류 알림
   */
  exists(path: string): boolean;

  /**
   * 파일 캐시를 갱신합니다.
   * vault 변경 이벤트 발생 시 호출됩니다.
   */
  refreshCache(): void;
}

/**
 * MentionService 생성자 타입
 */
export interface MentionServiceConstructor {
  new (app: App): IMentionService;
}
