#!/usr/bin/env python3
"""
Note Sage 플러그인 i18n 번역 검증 스크립트

기능:
- 모든 언어 파일에서 누락된 키 탐지
- 영어 기준 키 불일치 확인
- 번역 완성도 보고

사용법:
    python validate_translations.py [--verbose] [--lang LANG]
"""

import os
import re
import sys
import argparse
from pathlib import Path
from typing import Dict, Set, List, Tuple

# 지원 언어 목록
LANGUAGES = ['en', 'ko', 'ja', 'es', 'fr', 'de', 'pt', 'zh', 'ar', 'ru', 'hi']

# 프로젝트 루트 기준 locales 경로
LOCALES_DIR = Path(__file__).parent.parent.parent.parent.parent / 'src' / 'i18n' / 'locales'


def extract_keys_from_ts(file_path: Path) -> Set[str]:
    """
    TypeScript 파일에서 번역 키를 추출합니다.
    중첩된 객체 키를 점(.) 표기법으로 평탄화합니다.
    """
    if not file_path.exists():
        print(f"파일을 찾을 수 없음: {file_path}")
        return set()

    content = file_path.read_text(encoding='utf-8')
    keys = set()

    # export const XX: TranslationKeys = { 이후의 객체 부분 추출
    match = re.search(r'export\s+const\s+\w+:\s*TranslationKeys\s*=\s*\{', content)
    if not match:
        print(f"TranslationKeys 객체를 찾을 수 없음: {file_path}")
        return set()

    # 객체 시작 위치부터 끝까지 파싱
    start_idx = match.end() - 1  # '{' 포함

    # 간단한 키 추출 (완벽하지 않지만 대부분의 경우 작동)
    # 정규식으로 key: 'value' 또는 key: { 패턴 찾기

    def extract_nested_keys(text: str, prefix: str = '') -> Set[str]:
        """재귀적으로 중첩된 키 추출"""
        result = set()

        # 단순 문자열 키: value 패턴
        simple_pattern = r"(\w+):\s*['\"]([^'\"]*)['\"]"
        for match in re.finditer(simple_pattern, text):
            key = match.group(1)
            full_key = f"{prefix}{key}" if prefix else key
            result.add(full_key)

        # 중첩 객체 키: { 패턴
        nested_pattern = r"(\w+):\s*\{"
        for match in re.finditer(nested_pattern, text):
            key = match.group(1)
            full_key = f"{prefix}{key}" if prefix else key

            # 해당 중첩 객체의 내용 추출 (간단한 방식)
            start = match.end()
            brace_count = 1
            end = start

            while end < len(text) and brace_count > 0:
                if text[end] == '{':
                    brace_count += 1
                elif text[end] == '}':
                    brace_count -= 1
                end += 1

            nested_content = text[start:end-1]
            nested_keys = extract_nested_keys(nested_content, f"{full_key}.")
            result.update(nested_keys)

        return result

    keys = extract_nested_keys(content[start_idx:])
    return keys


def compare_keys(en_keys: Set[str], lang_keys: Set[str], lang: str) -> Tuple[Set[str], Set[str]]:
    """
    영어 키와 다른 언어 키를 비교합니다.

    Returns:
        (누락된 키, 추가된 키)
    """
    missing = en_keys - lang_keys  # 영어에는 있지만 해당 언어에 없는 키
    extra = lang_keys - en_keys    # 해당 언어에는 있지만 영어에 없는 키
    return missing, extra


def generate_report(all_results: Dict[str, Dict]) -> str:
    """번역 완성도 보고서 생성"""
    lines = []
    lines.append("=" * 60)
    lines.append("Note Sage i18n 번역 검증 보고서")
    lines.append("=" * 60)
    lines.append("")

    en_count = all_results.get('en', {}).get('count', 0)
    lines.append(f"기준 언어 (영어) 키 수: {en_count}")
    lines.append("")

    lines.append("-" * 60)
    lines.append(f"{'언어':<8} {'키 수':<10} {'누락':<10} {'추가':<10} {'완성도':<10}")
    lines.append("-" * 60)

    for lang in LANGUAGES:
        if lang == 'en':
            lines.append(f"{'en':<8} {en_count:<10} {'-':<10} {'-':<10} {'100%':<10}")
            continue

        result = all_results.get(lang, {})
        count = result.get('count', 0)
        missing = len(result.get('missing', set()))
        extra = len(result.get('extra', set()))

        if en_count > 0:
            completeness = ((en_count - missing) / en_count) * 100
        else:
            completeness = 0

        lines.append(f"{lang:<8} {count:<10} {missing:<10} {extra:<10} {completeness:.1f}%")

    lines.append("-" * 60)
    lines.append("")

    return "\n".join(lines)


def print_details(all_results: Dict[str, Dict], lang: str = None):
    """상세 정보 출력"""
    languages = [lang] if lang else [l for l in LANGUAGES if l != 'en']

    for lang in languages:
        result = all_results.get(lang, {})
        missing = result.get('missing', set())
        extra = result.get('extra', set())

        if missing:
            print(f"\n[{lang}] 누락된 키 ({len(missing)}개):")
            for key in sorted(missing)[:20]:  # 최대 20개만 출력
                print(f"  - {key}")
            if len(missing) > 20:
                print(f"  ... 외 {len(missing) - 20}개")

        if extra:
            print(f"\n[{lang}] 추가된 키 ({len(extra)}개):")
            for key in sorted(extra)[:10]:
                print(f"  + {key}")
            if len(extra) > 10:
                print(f"  ... 외 {len(extra) - 10}개")


def main():
    parser = argparse.ArgumentParser(description='Note Sage i18n 번역 검증')
    parser.add_argument('--verbose', '-v', action='store_true', help='상세 정보 출력')
    parser.add_argument('--lang', '-l', type=str, help='특정 언어만 검사')
    args = parser.parse_args()

    if not LOCALES_DIR.exists():
        print(f"오류: locales 디렉토리를 찾을 수 없습니다: {LOCALES_DIR}")
        print("프로젝트 루트에서 실행하세요.")
        sys.exit(1)

    print(f"검사 경로: {LOCALES_DIR}")
    print("")

    # 영어 키 추출 (기준)
    en_file = LOCALES_DIR / 'en.ts'
    en_keys = extract_keys_from_ts(en_file)

    all_results = {
        'en': {'count': len(en_keys), 'keys': en_keys}
    }

    # 각 언어 검사
    languages_to_check = [args.lang] if args.lang and args.lang != 'en' else [l for l in LANGUAGES if l != 'en']

    has_issues = False
    for lang in languages_to_check:
        lang_file = LOCALES_DIR / f'{lang}.ts'
        lang_keys = extract_keys_from_ts(lang_file)

        missing, extra = compare_keys(en_keys, lang_keys, lang)

        all_results[lang] = {
            'count': len(lang_keys),
            'keys': lang_keys,
            'missing': missing,
            'extra': extra
        }

        if missing or extra:
            has_issues = True

    # 보고서 출력
    print(generate_report(all_results))

    if args.verbose:
        print_details(all_results, args.lang)

    # 종료 코드
    if has_issues:
        print("\n⚠️  일부 언어에 누락되거나 추가된 키가 있습니다.")
        print("   --verbose 옵션으로 상세 정보를 확인하세요.")
        sys.exit(1)
    else:
        print("\n✅ 모든 번역이 완전합니다!")
        sys.exit(0)


if __name__ == '__main__':
    main()
