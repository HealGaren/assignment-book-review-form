# CLAUDE.md

## 프로젝트 개요

`assignment-book-review-form` — 에프랩 멘토링 08회차(2026-05-27) 과제. 독서 기록 멀티스텝 폼을 구현한다.

- 단계: **도서 정보 → 추천/별점 → 독후감 → 인용구 → 공개 여부**
- 하나의 FormProvider가 전체 퍼널을 감싸고, 단계별 `trigger()`로 부분 검증한다.
- 크로스스텝 밸리데이션: 별점(2단계) ↔ 독후감 길이(3단계), 도서 페이지수(1단계) ↔ 인용구 페이지(4단계)
- 새로고침 시 폼 상태 보존 (sessionStorage), 실시간 미리보기 패널 (500ms debounce)

### 문서 구조

- **README.md** — 사용법 (실행/빌드 명령)
- **FRONTEND_ARCHITECTURE.md** — 프론트엔드 설계 철학, 판단 기준
- **DECISIONS.md** — 주요 기술/설계 결정 (선택지 비교 + 근거)
- **CLAUDE.md** — AI/개발 컨벤션, 코드 스타일, 구조 규칙 (이 문서)

새 세션 시작 전에 README.md → FRONTEND_ARCHITECTURE.md 순서로 읽고 맥락을 잡을 것.

## 기술 스택

- **프레임워크**: Next.js (Page Router) + TypeScript (strict)
- **서버 상태**: TanStack Query (`useSuspenseQuery` 우선)
- **폼**: react-hook-form + zod (`@hookform/resolvers/zod`)
- **스타일**: Emotion (`@emotion/styled` + `@emotion/react`)
- **클라이언트 상태**: jotai (필요할 때만)
- **에러 경계**: react-error-boundary (`SuspenseBoundary` 공용 컴포넌트)

### 의도적으로 빼둔 것

- ~~Tailwind, CSS Modules~~ — 과제 기술스택이 Emotion
- ~~App Router~~ — 과제 기술스택이 Page Router
- ~~zustand~~ — 필요 시 jotai, 그 전에 RHF + sessionStorage로 해결되는지 먼저 확인

## 코드 컨벤션

- 언어: TypeScript strict mode
- 프론트엔드 데이터 페칭: `useSuspenseQuery` 사용, Suspense/ErrorBoundary 경계 적극 활용
- 폼: react-hook-form + zod resolver, **단일 FormProvider가 전체 퍼널을 감쌈** (DECISIONS.md #2 참고)
  - 독립적·단순한 밸리데이션 → zod schema (resolver에서 처리)
  - 크로스필드 의존성 (독서 상태 ↔ 기간, 별점 ↔ 독후감 길이) → zod `.refine()`/`.superRefine()`
  - JSX 레벨 밸리데이션은 위 둘로 해결 안 될 때만 사용
- 상태:
  - 서버 상태 → TanStack Query
  - 폼 입력값 → react-hook-form (FormProvider)
  - 현재 단계 → URL path segment (`/steps/book-info`, `/steps/rating` 등)
  - 입력값 보존 (새로고침 대비) → sessionStorage (폼 전체 값 직렬화)
- 퍼널 step: raw string 대신 enum으로 타입화. `isStepCompleted(step)` 같은 유틸로 인덱스 비교를 감춤
- 이슈/커밋/문서: 한국어
- 컴포넌트: 직접 구현, `components/ui/`에 누적 자산화

### 코드 품질 원칙 (모든 코드에 적용)

코드 한 줄마다 다음 질문에 답할 수 있어야 한다:

- 이 코드는 지금 필요한 기능인가? (불필요한 코드, 미래 대비 코드 금지)
- 너무 복잡하지는 않은가? 읽기 어렵지는 않은가? (가독성 우선)
- 이 코드가 여기에 있는게 맞는가? (적절한 위치, 적절한 추상화 레벨)

## 프론트엔드 컨벤션

### 폴더 구조 (`src/`)

```
src/
  pages/                # Next.js Page Router
    _app.tsx            # 글로벌 프로바이더 (QueryClient, FormProvider, Global styles)
    _document.tsx       # Emotion SSR 설정
    index.tsx           # 인트로 (→ /steps/book-info로 이동)
    steps/
      [step].tsx        # 퍼널 메인 (shallow routing으로 단계 전환)
  components/           # 공용 UI 컴포넌트
    ui/                 # 직접 구현한 UI 프리미티브 (Button, Input, StarRating, ...)
    SuspenseBoundary.tsx
  features/             # 기능 단위 모듈
    book-form/          # 도서 폼 전체
      components/       # 단계별 컴포넌트 (BookInfoStep, RatingStep, ...)
      hooks/            # useBookForm, useFormPersistence, usePreviewDebounce
      schema.ts         # zod 전체 스키마 + 단계별 서브스키마
      types.ts          # 폼 타입 정의
      constants.ts      # step enum, step 순서 배열
    preview/            # 실시간 미리보기 패널
  hooks/                # 공용 훅
  lib/                  # 유틸리티
  styles/               # Emotion 테마, 글로벌 스타일
  types/                # 프론트엔드 전용 타입
```

### 폴더 구조 규칙

- 특정 기능에만 쓰이면 `features/{기능명}/` 하위
- 2곳 이상에서 쓰이면 `components/` 또는 `hooks/`로 승격
- 페이지 컴포넌트는 `pages/`에만
- 직접 구현한 UI 프리미티브는 `components/ui/`
- feature 모듈에서 공개 API를 정리하는 용도의 barrel export는 허용

### 컴포넌트 설계 원칙

- 한 파일에 한 컴포넌트 (named export만, `export default`는 pages만 허용)
- 컴포넌트 150줄 넘으면 분리 신호
- Props는 컴포넌트 바로 위에 interface 정의, `{컴포넌트명}Props` 네이밍

#### 부수 흐름(모달 등) 추출

컴포넌트가 **본연의 비즈니스 흐름 + 모달/팝오버 렌더**를 함께 갖고 있으면 단일 책임 위반 신호. 모달을 래핑 훅으로 추출해 메인 컴포넌트는 결과만 await.

#### 계산 로직 분리

JSX 대비 계산(날짜 비교·할인·문자열 변환)이 길면 순수 함수로 추출. 테스트 가능성 + 엣지 케이스 방어를 한곳에서.

#### Prop drilling 허용 기준

- 2단계까지 허용, 3단계 이상이면 훅/Context 분리 신호

### 데이터 소유권

이 과제에서는 **단일 FormProvider**가 모든 폼 데이터를 소유한다. 각 단계 컴포넌트는 `useFormContext()`로 자기 필드에 직접 접근하고, 상위가 값을 꺼내 props로 내려주지 않는다.

서버 데이터(TanStack Query)는 leaf 우선 — 데이터를 사용하는 컴포넌트가 직접 요청한다.

| 저장소 | leaf의 접근 방식 | 상위의 역할 |
|---|---|---|
| TanStack Query 캐시 | `useBooks()` 등 커스텀 훅 | QueryClientProvider 설치 |
| 폼 상태 | `useFormContext()` | FormProvider 설치 (`_app.tsx` 또는 퍼널 레이아웃) |
| sessionStorage | 커스텀 훅 (`useFormPersistence`) | 없음 |

> **예외**: `components/ui/`의 UI 프리미티브(Button, Input, StarRating 등)는 props로 받는다.

### 커스텀 훅 패턴

- TanStack Query는 커스텀 훅으로 래핑 (`useBooks` 등)
- Query key는 factory 패턴으로 중앙 관리
- 조합/변환 훅은 2곳 이상에서 반복될 때만 만든다

#### use{Domain}Form 패턴

서버 데이터 → 폼 defaultValues 변환이 복잡해지면 `useBookForm` 같은 훅으로 분리한다.

- 데이터 페칭(Suspense)은 훅 바깥 컴포넌트에서 — 훅 시그니처는 RHF useForm과 동일 유지
- 변환 함수는 훅 파일에 정의하되 호출은 외부에서

### RHF 폼 패턴

#### RHF 프리픽스 컴포넌트

register/Controller 패턴이 반복되면 RHF 전용 래퍼 컴포넌트를 만든다:

- 네이밍: `RHFTextInput`, `RHFStarRating`, `RHFCommaSeparatedInput` 등
- `name`(필드 키)을 주 props로 받고, 내부에서 `useController`를 처리
- 네이티브가 지원 안 되는 커스텀 UI(StarRating, CommaSeparatedInput 등)는 Controller 래핑 필수

> **원칙**: 커스텀 컴포넌트 props에 서드파티 라이브러리 타입을 그대로 노출하지 말 것. 필요한 만큼만 자체 인터페이스로 정의.

#### CommaSeparatedInput 패턴

- 순수 UI 컴포넌트: `value: number`, `onChange: (v: number) => void` — 내부에서 콤마 포맷팅
- RHF 래퍼: `RHFCommaSeparatedInput` — `name`만 받고 Controller로 연결
- 숫자 외 입력 차단, 1000단위 콤마 자동 삽입, 외부에서는 number로 주고받음

### API 레이어

- `features/{기능}/api/`에 API 함수 분리
- 흐름: API 함수 → 커스텀 훅(useSuspenseQuery 래핑) → 컴포넌트

#### mutation 캐시 갱신 위치

onSuccess 로직이 단순하면 훅 내부에, 복잡해지면 호출측으로 빼기. 프로젝트 내에서 일관성 유지.

### Suspense/ErrorBoundary 배치

- 페이지 단위로 ErrorBoundary 배치
- 독립적으로 로딩 가능한 영역마다 Suspense 배치
- `SuspenseBoundary` 공용 컴포넌트로 통일 — **fallback을 props로 받아** 사용처마다 다른 로딩 UI 제공
- API가 resolve 안 됐을 때 로딩바, 에러 시 rejectedFallback + 에러 메시지 표시

### 폼 상태 보존 전략

#### 저장소별 책임

| 저장소 | 책임 | 예시 |
|---|---|---|
| URL path segment | 현재 단계 식별 | `/steps/book-info`, `/steps/rating` |
| sessionStorage | 폼 전체 값 직렬화 (새로고침 대비) | 도서명, 별점, 독후감, 인용구 전부 |
| 메모리 (react-hook-form) | 입력 중인 값, 검증 상태 | 현재 타이핑 중인 필드 |

#### 규칙

- **현재 단계는 URL로**: path segment. 뒤로가기/링크 공유 자연스러움
- **폼 값은 sessionStorage**: `watch()` + debounce로 주기적 저장, 마운트 시 `reset(savedValues)`로 복원
- **storage scope**: `book-review-form:` prefix로 키 충돌 방지
- **clear 시점**: 최종 제출 성공 시

### 실시간 미리보기

- `watch()`로 폼 전체 값을 구독, **500ms debounce** 후 미리보기 상태 업데이트
- viewport width < 1024px이면 미리보기 패널 숨김 (window resize 이벤트)
- 미리보기 컴포넌트는 `features/preview/`에 배치

### Emotion 스타일 컨벤션

- `@emotion/styled`로 스타일드 컴포넌트 작성
- 테마는 `styles/theme.ts`에 정의, `ThemeProvider`로 주입
- 전역 스타일은 `Global` 컴포넌트로 `_app.tsx`에 배치
- `_document.tsx`에서 Emotion SSR 캐시 설정 필수

### 밸리데이션 UX

- 밸리데이션 실패 시 **순서상 첫 번째 에러 필드로 focus**
- 실패한 모든 필드의 아웃라인을 붉은색으로 처리
- 인풋 하단에 에러 메시지 표시
- `formState.errors`를 활용해 필드별 에러 상태 렌더링

### import 규칙

- 절대경로(`@/`) 사용, 같은 feature 내부만 상대경로 허용
- 순서: 외부 패키지 → `@/` → 상대경로
- type import는 `import type` 사용

### 파일 네이밍

- 컴포넌트: PascalCase (`BookInfoStep.tsx`)
- 훅: camelCase, use 접두사 (`useBookForm.ts`)
- 유틸/타입/API: camelCase (`formatDate.ts`, `bookApi.ts`)
- 스키마: camelCase (`bookFormSchema.ts`)
- 페이지: Next.js 규칙 (`[step].tsx`, `index.tsx`)

## 개발 명령어

```bash
pnpm install              # 의존성 설치
pnpm dev                  # 개발 서버 (localhost:3000)
pnpm build                # 빌드
pnpm typecheck            # TypeScript 타입 체크 (tsc --noEmit)
pnpm lint                 # ESLint 실행
```

## PR 사이즈

- **권장 ≤ 500줄**, **>1000줄은 자동 컷오프** — 멘토 기준.
- 테스트/스냅샷 등 부수 변경이 부풀어도 같은 룰 적용. 분리 가능하면 별도 PR.

## PR 올리기 전 셀프 체크리스트

- [ ] PR diff 줄 수가 **500줄 이하**인가? (1000줄 초과 시 분리)
- [ ] `useFormContext()`로 필드에 직접 접근하는가? 상위에서 watch해서 props로 내려주는 곳은 없는가?
- [ ] 서버 데이터를 leaf가 직접 조회하는가?
- [ ] `Suspense` + `ErrorBoundary`는 `SuspenseBoundary`로 통일했는가?
- [ ] 새로고침 시 폼 상태가 복원되는가?
- [ ] 커스텀 컴포넌트 props에 RHF/서드파티 타입이 그대로 노출되지 않는가?
- [ ] `pnpm typecheck`, `pnpm lint` 통과하는가?
- [ ] 함수/변수명이 6개월 뒤에도 읽기 쉬운가?
