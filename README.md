# Note Sage

[한국어](README.md) | [English](README_EN.md) | [简体中文](README_ZH.md) | [日本語](README_JA.md) | [Deutsch](README_DE.md) | [Français](README_FR.md) | [Español](README_ES.md) | [Português](README_PT.md) | [Русский](README_RU.md) | [हिन्दी](README_HI.md) | [العربية](README_AR.md)

https://github.com/user-attachments/assets/3b251604-cf52-4f38-8c9d-fba67e280b64

Obsidian에서 AI 에이전트를 직접 사용할 수 있는 플러그인입니다. Claude Code CLI를 Obsidian과 통합하여 터미널 없이도 AI와 대화하고, 파일을 편집하고, 지식 베이스를 관리할 수 있습니다.

## 왜 만들었나요?

AI 작업 중에 흐름이 끊기거나 vault 컨텍스트를 잃어버리는 것은 생산성을 저하시킵니다.

이 플러그인은 Obsidian 환경을 인식하면서 Claude와 대화할 수 있게 해주며, 터미널 전환 없이 작업 공간 안에서 모든 것을 처리할 수 있습니다. 또한 컨텍스트를 효과적으로 관리할 수 있는 기능들을 제공합니다.

## 주요 기능

- **AI 직접 통합**: Obsidian 인터페이스에서 Claude Code와 직접 대화
- **파일 우선 접근**: AI가 vault의 파일을 읽고, 편집하고, 생성 가능
- **컨텍스트 인식**: 현재 노트의 내용을 자동으로 대화에 포함
- **실시간 협업**: AI의 편집 내용을 실시간으로 확인
- **빠른 액션**: 미리 정의된 프롬프트로 빠르게 작업 실행 (요약, 개선, 분석, 번역)
- **MCP 서버 통합**: 외부 도구 및 리소스를 AI 에이전트에 연결
- **다국어 UI 지원**: 11개 언어 지원 (한국어, 영어, 일본어, 중국어, 독일어, 프랑스어, 스페인어, 포르투갈어, 러시아어, 힌디어, 아랍어)
- **세션 관리**: 대화 연속성 유지 및 저장

## 설치

### 사전 요구사항

- **Anthropic 계정** - Claude API 접근용 ([console.anthropic.com](https://console.anthropic.com))
- **Node.js** - 플러그인 실행에 필요
- **Claude Code CLI** - [Anthropic's Claude Code](https://www.anthropic.com/claude-code)에서 설치

### 설치 방법

*Obsidian 커뮤니티 플러그인 스토어 등록 예정*

1. **CLI 접근 확인**: 터미널에서 `claude` 명령어가 실행되는지 확인
2. **다운로드**: [릴리즈 페이지](../../releases)에서 최신 버전(`obsidian-note-sage.zip`) 다운로드
3. **설치**: 압축 해제 후 `[vault 경로]/.obsidian/plugins/obsidian-note-sage` 폴더에 복사
4. **활성화**: Obsidian 설정 > 커뮤니티 플러그인에서 Note Sage 활성화
5. **사용 시작**: 오른쪽 사이드바의 Note Sage 패널에서 채팅 시작

> [!WARNING]
> **프리뷰 버전 안내**
>
> 이 플러그인은 현재 개발 중이며 vault의 파일을 수정할 수 있습니다. 완전한 기능을 위해 높은 권한(`--permission-mode bypassPermissions`, `dangerously-skip-permissions`)을 사용합니다.
>
> **권장사항**: 사용 전 vault를 백업하세요. 세부 권한 제어 기능은 향후 릴리즈에서 추가될 예정입니다.

## 사용법

### 기본 사용법

1. 오른쪽 사이드바에서 Note Sage 아이콘 클릭
2. 채팅 입력창에 메시지 입력
3. Enter로 전송 (Shift+Enter로 줄바꿈)
4. "현재 페이지" 버튼으로 현재 노트 컨텍스트 포함/제외 선택

### 빠른 액션

채팅 입력창 위의 빠른 액션 버튼으로 자주 사용하는 작업을 빠르게 실행할 수 있습니다:

- **요약**: 현재 문서를 간결하게 요약
- **개선**: 문체 개선 및 오류 수정
- **분석**: 문서 분석 및 인사이트 제공
- **번역**: 한국어↔영어 번역

설정에서 각 버튼의 프롬프트를 커스터마이징할 수 있습니다.

## 설정

### 기본 설정

| 설정 | 설명 |
|------|------|
| 모델 | 사용할 Claude 모델 선택 (opus-4-5, sonnet-4-5, haiku-4-5) |
| 언어 | 인터페이스 언어 (자동 또는 11개 언어 중 선택) |

### 파일 컨텍스트

| 설정 | 설명 |
|------|------|
| 파일 내용 포함 | 현재 파일 내용을 컨텍스트에 포함 |
| 선택된 텍스트 우선 | 선택 영역이 있으면 전체 파일 대신 선택 부분만 포함 |
| 최대 내용 길이 | 포함할 최대 문자 수 (토큰 절약용) |

### 빠른 액션

설정에서 각 빠른 액션 버튼의 프롬프트를 커스터마이징할 수 있습니다. 기본값을 사용하려면 비워두세요.

### MCP 서버

MCP (Model Context Protocol) 서버를 연결하여 AI 에이전트의 기능을 확장할 수 있습니다.

| 설정 | 설명 |
|------|------|
| 서버 추가 | stdio, SSE, HTTP 타입의 MCP 서버 연결 |
| 서버 활성화/비활성화 | 개별 서버 토글 |
| 도구 패널 | 연결된 MCP 서버의 사용 가능한 도구 확인 |

### 고급 설정

| 설정 | 설명 |
|------|------|
| API 키 | Anthropic API 키 (선택사항) |
| Claude CLI 경로 | claude 실행 파일 경로 (자동 탐지 가능) |
| 사용자 지정 시스템 프롬프트 | Claude에 대한 사용자 지정 지시사항 |
| 디버그 모드 | 문제 해결을 위한 디버그 로깅 활성화 |

## 문제 해결

### CLI 문제

**Node.js 또는 Claude CLI를 찾을 수 없나요?**

1. **설치 확인**: 터미널에서 `node --version`과 `claude --version` 실행
2. **수동 설정**: 자동 탐지 실패 시 **설정 > 커뮤니티 플러그인 > Note Sage**에서 경로 직접 설정

**실행 파일 경로 찾기:**
```bash
# Node.js 경로
which node

# Claude CLI 경로
echo "$(sed -n 's/^exec "\([^"]*\)".*/\1/p' $(which claude))"
```

**Windows 사용자**: Claude는 WSL에 설치해야 합니다. Windows 네이티브 지원은 테스트 중입니다.

### 디버그 모드

**상세 로깅 활성화:**
1. **설정 > 커뮤니티 플러그인 > Note Sage**로 이동
2. "디버그 모드" 활성화
3. 개발자 콘솔 열기: `Cmd+Opt+I` (Mac) 또는 `Ctrl+Shift+I` (Windows/Linux)

## 로드맵

### 완료된 기능
- [x] **MCP 서버 통합** - 외부 도구 및 리소스 연결
- [x] **다국어 지원** - 11개 언어 및 RTL 지원
- [x] **빠른 액션 커스터마이징** - 버튼별 프롬프트 설정
- [x] **Obsidian 플러그인 관리 도구** - AI를 통한 플러그인 관리

### 예정된 기능
- [ ] **상호작용 모드** - Write 모드, Plan 모드, 커스텀 워크플로우
- [ ] **권한 제어** - 세부적인 파일 접근 및 편집 권한
- [ ] **크로스 플랫폼 지원** - Windows/WSL 호환성 개선
- [ ] **컨텍스트 메뉴 통합** - 파일 탐색기에서 "AI 컨텍스트에 추가"
- [ ] **파일 연결** - 모델이 읽거나 편집한 파일 열기
- [ ] **향상된 복사/붙여넣기** - 스마트 컨텍스트 복사/붙여넣기

## 개인정보 및 데이터 처리

### 외부 서비스

이 플러그인은 **Anthropic Claude API**를 사용하여 요청을 처리합니다. 메시지 전송 시:
- 프롬프트 텍스트가 Anthropic 서버로 전송됩니다
- "현재 페이지" 컨텍스트가 활성화되면 파일 내용도 전송됩니다
- 데이터는 [Anthropic 개인정보 보호정책](https://www.anthropic.com/privacy)에 따라 처리됩니다

### 계정 요구사항

- **Anthropic API 키**: API 접근에 필요
  - [console.anthropic.com](https://console.anthropic.com)에서 발급
  - vault의 플러그인 데이터에 로컬 저장 (암호화되지 않음)

### 파일 시스템 접근

이 플러그인은 Obsidian vault 외부 위치에 접근합니다:
- **Claude CLI 탐지**: Claude 실행 파일 찾기 위해 시스템 경로 검색
  - macOS/Linux: `~/.local/bin/`, `/usr/local/bin/`, `/opt/homebrew/bin/`
  - Windows: `%USERPROFILE%\AppData\`, `C:\Program Files\`
- **에이전트 권한**: 높은 권한(`bypassPermissions`)을 사용하여 AI가 vault의 파일을 읽고 편집 가능

### 로컬 데이터 저장

- 채팅 메시지는 메모리에만 저장 (재시작 시 초기화)
- 설정은 `.obsidian/plugins/obsidian-note-sage/data.json`에 저장
- 대화는 마크다운 파일로 vault에 수동 저장 가능

## 라이선스

MIT License
