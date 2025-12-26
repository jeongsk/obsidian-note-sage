# Obsidian AI Agent 신규 기능 기획서

> 작성일: 2025-12-25
> 버전: 0.2.0 기준
> 작성자: Claude AI

---

## 1. 개요

현재 obsidian-ai-agent 플러그인은 Obsidian 내에서 Claude AI와 채팅할 수 있는 기본 기능을 제공합니다. 본 기획서는 사용자 경험을 크게 향상시킬 수 있는 핵심 신규 기능들을 제안합니다.

### 현재 상태 요약
- ✅ Claude AI 채팅 인터페이스
- ✅ 실시간 스트리밍 응답
- ✅ 세션 관리
- ✅ 파일 경로 컨텍스트 포함
- ✅ 다중 모델 지원

### 개선 필요 영역
- ❌ 실제 파일 내용 읽기 불가
- ❌ 대화 기록 저장 기능 없음
- ❌ 컨텍스트 메뉴 통합 없음
- ❌ 다중 파일 컨텍스트 미지원

---

## 2. 제안 기능 목록

### 2.1 🔥 핵심 기능 (Priority: High)

#### 기능 A: 파일 내용 컨텍스트 (File Content Context)

**문제점**
현재는 파일 경로만 전달되어 Claude가 실제 파일 내용을 알 수 없습니다.

**제안 솔루션**
```typescript
interface FileContextOptions {
  includeContent: boolean;      // 파일 내용 포함 여부
  maxContentLength: number;     // 최대 문자 수 (기본: 10000)
  includeSelection: boolean;    // 선택된 텍스트만 포함
  includeFrontmatter: boolean;  // YAML 프론트매터 포함
}
```

**구현 범위**
1. 현재 활성 노트의 전체/부분 내용 읽기
2. 텍스트 선택 영역만 컨텍스트로 포함하는 옵션
3. 파일 크기 제한 설정 (토큰 절약)
4. 설정 탭에 옵션 추가

**예상 효과**
- Claude가 실제 문서 내용 기반으로 답변 가능
- "이 문서 요약해줘", "오타 찾아줘" 등 실질적 작업 가능

**예상 작업량**: 중간 (2-3일)

---

#### 기능 B: 대화 기록 저장 (Conversation Persistence)

**문제점**
채팅 기록이 세션 종료 시 사라지며, 이전 대화를 참조할 수 없습니다.

**제안 솔루션**
```typescript
interface ConversationStorage {
  saveToVault: boolean;           // 볼트에 마크다운으로 저장
  savePath: string;               // 저장 경로 (예: "AI-Chats/")
  autoSave: boolean;              // 자동 저장 여부
  saveFormat: 'markdown' | 'json'; // 저장 형식
}
```

**구현 범위**
1. 대화를 마크다운 파일로 내보내기
2. 자동 저장 옵션 (대화 종료 시)
3. 저장된 대화 목록 보기
4. 이전 대화 불러오기/이어가기

**저장 파일 형식 예시**
```markdown
---
date: 2025-12-25
model: claude-sonnet-4
session_id: abc123
---

# AI Chat - 2025-12-25 14:30

## User
문서 구조 개선 방법을 알려줘

## Assistant
문서 구조를 개선하기 위해 다음을 제안합니다...

---
```

**예상 효과**
- 중요 대화 영구 보존
- 이전 대화 검색 및 참조
- 노트와 대화 간 링크 연결

**예상 작업량**: 중간 (3-4일)

---

#### 기능 C: 다중 파일 컨텍스트 (Multi-File Context)

**문제점**
현재 단일 파일만 컨텍스트로 포함 가능합니다.

**제안 솔루션**
```typescript
interface MultiFileContext {
  files: string[];              // 선택된 파일 경로들
  maxTotalSize: number;         // 총 최대 크기
  includeLinkedNotes: boolean;  // 링크된 노트 자동 포함
}
```

**구현 범위**
1. 파일 탐색기에서 여러 파일 선택
2. "AI 컨텍스트에 추가" 컨텍스트 메뉴
3. 컨텍스트 파일 목록 UI
4. 링크된 노트 자동 감지

**UI 디자인**
```
┌─────────────────────────────┐
│ 📁 Context Files (3)    [x] │
├─────────────────────────────┤
│ • Project-Plan.md      [−]  │
│ • Meeting-Notes.md     [−]  │
│ • Requirements.md      [−]  │
├─────────────────────────────┤
│ [+ Add File]                │
└─────────────────────────────┘
```

**예상 효과**
- 프로젝트 전체 맥락 파악
- 관련 문서 간 연결 분석
- 복잡한 질문에 정확한 답변

**예상 작업량**: 높음 (4-5일)

---

### 2.2 ⚡ 생산성 기능 (Priority: Medium)

#### 기능 D: 명령어 팔레트 통합 (Command Palette)

**제안 기능**
- `AI: 새 채팅` - 새 대화 시작
- `AI: 선택 영역 설명` - 선택 텍스트 설명 요청
- `AI: 문서 요약` - 현재 문서 요약
- `AI: 오류 검토` - 현재 문서 검토

**구현 방식**
```typescript
this.addCommand({
  id: 'ai-summarize-document',
  name: 'AI: 현재 문서 요약',
  callback: () => this.sendQuickPrompt('이 문서를 요약해줘')
});
```

**예상 작업량**: 낮음 (1일)

---

#### 기능 E: 시스템 프롬프트 커스터마이징

**문제점**
현재 사용자가 Claude의 기본 행동을 설정할 수 없습니다.

**제안 솔루션**
```typescript
interface SystemPromptSettings {
  enabled: boolean;
  prompt: string;
  presets: SystemPromptPreset[];
}

interface SystemPromptPreset {
  name: string;
  prompt: string;
}
```

**프리셋 예시**
- **Technical Writer**: "기술 문서 작성에 특화된 어시스턴트로 행동해줘"
- **Korean Tutor**: "한국어로 답변하고, 문법 오류를 지적해줘"
- **Code Reviewer**: "코드 리뷰어 관점에서 분석해줘"

**UI 위치**: 설정 탭에 텍스트 영역 추가

**예상 작업량**: 낮음 (1일)

---

#### 기능 F: 빠른 액션 버튼

**제안 기능**
자주 사용하는 프롬프트를 버튼으로 제공

**UI 디자인**
```
┌────────────────────────────────┐
│ [📝 요약] [✏️ 수정] [🔍 분석] │
└────────────────────────────────┘
```

**구현 방식**
```typescript
const quickActions = [
  { icon: 'file-text', label: '요약', prompt: '이 문서를 요약해줘' },
  { icon: 'edit', label: '수정', prompt: '문법과 맞춤법을 검토해줘' },
  { icon: 'search', label: '분석', prompt: '이 문서를 분석해줘' },
];
```

**예상 작업량**: 낮음 (1일)

---

### 2.3 🎨 UX 개선 (Priority: Medium-Low)

#### 기능 G: 코드 블록 복사 버튼

**문제점**
코드 블록을 수동으로 선택하여 복사해야 합니다.

**제안 솔루션**
```
┌──────────────────────────────────────┐
│ ```javascript              [📋 Copy] │
│ function hello() {                   │
│   console.log("Hello!");             │
│ }                                    │
│ ```                                  │
└──────────────────────────────────────┘
```

**예상 작업량**: 낮음 (0.5일)

---

#### 기능 H: 메시지 타임스탬프 표시

**현재 상태**: 일부 메시지에만 타임스탬프 표시

**제안**: 모든 메시지에 상대적 시간 표시 (예: "2분 전")

**예상 작업량**: 낮음 (0.5일)

---

#### 기능 I: 테마 커스터마이징

**제안 기능**
- 사용자/어시스턴트 메시지 색상 변경
- 폰트 크기 조절
- 컴팩트/확장 뷰 모드

**예상 작업량**: 중간 (2일)

---

### 2.4 🔧 고급 기능 (Priority: Low)

#### 기능 J: 도구 실행 상세 표시

**문제점**
Claude가 도구를 사용할 때 무엇을 했는지 명확하지 않습니다.

**제안 솔루션**
```
┌─────────────────────────────────────┐
│ 🔧 Tool: Read                       │
│ ├─ File: /notes/project.md          │
│ ├─ Duration: 0.2s                   │
│ └─ Status: ✅ Success               │
└─────────────────────────────────────┘
```

**예상 작업량**: 중간 (2일)

---

#### 기능 K: 토큰 사용량 표시

**제안 기능**
- 현재 대화 토큰 사용량 표시
- 예상 비용 계산 (선택 사항)
- 컨텍스트 크기 경고

**예상 작업량**: 중간 (2일)

---

## 3. 구현 우선순위 로드맵

### Phase 1: 핵심 가치 (1-2주)
| 순서 | 기능 | 중요도 | 예상 기간 |
|------|------|--------|-----------|
| 1 | 파일 내용 컨텍스트 (A) | 🔥🔥🔥 | 2-3일 |
| 2 | 명령어 팔레트 통합 (D) | 🔥🔥 | 1일 |
| 3 | 시스템 프롬프트 (E) | 🔥🔥 | 1일 |

### Phase 2: 생산성 향상 (2-3주)
| 순서 | 기능 | 중요도 | 예상 기간 |
|------|------|--------|-----------|
| 4 | 대화 기록 저장 (B) | 🔥🔥🔥 | 3-4일 |
| 5 | 빠른 액션 버튼 (F) | 🔥🔥 | 1일 |
| 6 | 코드 블록 복사 (G) | 🔥 | 0.5일 |

### Phase 3: 확장 기능 (3-4주)
| 순서 | 기능 | 중요도 | 예상 기간 |
|------|------|--------|-----------|
| 7 | 다중 파일 컨텍스트 (C) | 🔥🔥🔥 | 4-5일 |
| 8 | 도구 실행 상세 (J) | 🔥 | 2일 |
| 9 | 토큰 사용량 (K) | 🔥 | 2일 |

### Phase 4: 폴리싱 (4주+)
| 순서 | 기능 | 중요도 | 예상 기간 |
|------|------|--------|-----------|
| 10 | 타임스탬프 (H) | ⭐ | 0.5일 |
| 11 | 테마 커스터마이징 (I) | ⭐ | 2일 |

---

## 4. 기술적 고려사항

### 4.1 Obsidian API 활용
```typescript
// 파일 내용 읽기
const content = await this.app.vault.read(file);

// 선택 영역 가져오기
const selection = this.app.workspace.activeEditor?.editor?.getSelection();

// 컨텍스트 메뉴 등록
this.registerEvent(
  this.app.workspace.on('file-menu', (menu, file) => {
    menu.addItem((item) => {
      item.setTitle('AI 컨텍스트에 추가');
      item.onClick(() => this.addToContext(file));
    });
  })
);
```

### 4.2 성능 고려사항
- 대용량 파일 처리 시 청킹 필요
- 다중 파일 컨텍스트 시 토큰 제한 관리
- 대화 기록 저장 시 비동기 처리

### 4.3 보안 고려사항
- 민감한 파일 내용 전송 경고
- API 키 암호화 저장 검토
- 권한 관리 세분화

---

## 5. 성공 지표

| 지표 | 현재 | 목표 |
|------|------|------|
| 일일 활성 사용 | - | 측정 시작 |
| 평균 대화 길이 | - | 10+ 메시지 |
| 파일 컨텍스트 사용률 | 0% | 50%+ |
| 대화 저장률 | 0% | 30%+ |
| 사용자 만족도 | - | 4.5/5 |

---

## 6. 결론

본 기획서에서 제안한 11개의 신규 기능 중, **파일 내용 컨텍스트(A)**, **대화 기록 저장(B)**, **다중 파일 컨텍스트(C)**가 가장 높은 가치를 제공합니다.

Phase 1부터 순차적으로 구현하면서 사용자 피드백을 수집하고, 이를 바탕으로 우선순위를 조정하는 것을 권장합니다.

---

## 부록: 참고 자료

- [Obsidian Plugin API](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk)
- [현재 로드맵](../README.md#roadmap)
