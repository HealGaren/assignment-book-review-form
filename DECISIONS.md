# 설계 결정 사항

과제 구현 전 확정이 필요한 기술/설계 결정을 나열한다.

---

## 1. 라우팅 전략

**질문**: 5단계 퍼널의 단계를 어떻게 URL에 매핑할지

**선택지**:
- A) path segment + shallow routing (`/steps/book-info`, `/steps/rating`, ...)
- B) query param, 단일 라우트 (`/steps?step=book-info`)
- C) 단일 페이지, 라우팅 없이 상태로 관리

| | A) path segment | B) query param | C) 상태만 |
|---|---|---|---|
| 장점 | URL이 의미적으로 명확, 뒤로가기 자연스러움 | 라우터 설정 단순, 컴포넌트 remount 없음 | 가장 단순, 라우팅 없음 |
| 단점 | shallow routing 필요 (FormProvider unmount 방지) | URL이 덜 직관적 | 뒤로가기·링크 공유 불가 |

**결정**: A) path segment + shallow routing

**근거**: 각 단계가 별개 화면이므로 URL이 의미적으로 명확한 편이 낫다. Next.js Page Router의 `router.push(url, undefined, { shallow: true })`로 페이지 전환 없이 URL만 변경하면 FormProvider가 unmount되지 않아 폼 상태가 유지된다. `pages/steps/[step].tsx` 하나로 모든 단계를 처리한다.

---

## 2. 폼 아키텍처

**질문**: 전체 퍼널을 하나의 FormProvider로 감쌀지, 단계별 독립 폼으로 갈지

**배경**:
- 크로스스텝 밸리데이션이 있다: 별점(2단계) ↔ 독후감 길이(3단계), 도서 페이지수(1단계) ↔ 인용구 페이지(4단계)
- 최종 제출 시 모든 필드를 한 번에 모아야 한다
- 실시간 미리보기가 전체 폼 값을 watch해야 한다
- 새로고침 시 전체 폼 상태 보존 필요

**선택지**:
- A) 단일 FormProvider — 전체를 감싸고 단계별 `trigger()`로 부분 검증
- B) 단계별 독립 폼 + 통합 퍼널 스토어

| | A) 단일 FormProvider | B) 단계별 독립 폼 + 스토어 |
|---|---|---|
| 장점 | 크로스스텝 검증 자연스러움, `watch()` 한 번으로 미리보기, 최종 제출 간단 | 단계 독립성 높음, 단계 추가/제거 쉬움 |
| 단점 | 스키마가 크고 복잡해질 수 있음, FormProvider unmount 방지 필요 | 크로스스텝 검증을 별도 로직으로 처리해야 함, 미리보기에 별도 통합 필요 |

**결정**: A) 단일 FormProvider

**근거**: 크로스스텝 밸리데이션(별점 ↔ 독후감, 페이지수 ↔ 인용구)이 핵심 요구사항이므로, 하나의 zod 스키마에서 `.refine()`으로 처리하는 것이 가장 자연스럽다. `watch()`로 전체 폼 값을 한 번에 구독해 실시간 미리보기도 간단하다. shallow routing으로 FormProvider unmount를 방지하면 단점이 해소된다.

### 2-1. 단계별 필드 매핑

| 단계 | 필드 | 비고 |
|---|---|---|
| 1. 도서 정보 | title, author, totalPages, publishDate, readingStatus, startDate, endDate | readingStatus ↔ dates 크로스필드 |
| 2. 추천/별점 | recommended, rating | |
| 3. 독후감 | review | rating 1/5일 때 min 100자 |
| 4. 인용구 | quotes[] (text, pageNumber?) | useFieldArray, ≥2개면 pageNumber required |
| 5. 공개 여부 | isPublic | |

---

## 3. 밸리데이션 전략

**질문**: 유효성 검증을 각 단계에서 할까, 마지막 단계에서 할까

**선택지**:
- A) 단계 이동 시 해당 단계만 검증 + 최종 전체 검증
- B) 마지막 단계에서만 전체 검증
- C) 모든 단계에서 항상 전체 검증

**결정**: A) 단계 이동 시 해당 단계만 검증 + 최종 전체 검증

**근거**: 유저가 현재 단계를 완성하지 않고 넘어가면 뒤에서 문제가 생긴다. "다음" 버튼 클릭 시 `trigger(currentStepFields)`로 현재 단계 필드만 검증하고, 통과해야 다음 단계로 이동한다. 최종 제출 시 전체 스키마로 한 번 더 검증해 크로스스텝 규칙(별점 ↔ 독후감)을 포함한 모든 규칙을 확인한다.

### 3-1. 크로스스텝 밸리데이션 시점

- **별점 ↔ 독후감**: 3단계(독후감) "다음" 클릭 시 검증. 별점 1/5인데 독후감 100자 미만이면 에러.
- **도서 페이지수 ↔ 인용구 페이지**: 4단계(인용구) "다음" 클릭 시 검증. 인용구 페이지 > 전체 페이지면 에러.
- 최종 제출에서도 전체 재검증.

---

## 4. 상태 보존

**결정**: URL(현재 단계) + sessionStorage(폼 전체 값) + 메모리(RHF)

| 저장소 | 대상 | write 시점 | read 시점 |
|---|---|---|---|
| URL path | 현재 단계 | 단계 이동 시 (shallow routing) | 페이지 마운트 |
| sessionStorage | 폼 전체 값 | watch + debounce (500ms~1s) | 폼 초기화 시 reset(savedValues) |
| 메모리 (RHF) | 입력 중인 값 | 실시간 | - |

**clear 시점**: 최종 제출 성공 시 `sessionStorage.removeItem()`.

---

## 5. 실시간 미리보기

**결정**: `watch()` + 500ms debounce → 미리보기 상태

- 폼 값이 변경될 때마다 watch가 발화하지만, 미리보기 UI 업데이트는 500ms debounce 후
- viewport < 1024px이면 미리보기 패널 자체를 렌더링하지 않음
- `window.addEventListener('resize', ...)` + debounce로 반응형 처리

---

## 6. 인용구 동적 필드

**결정**: `useFieldArray` + 조건부 pageNumber required

- `quotes` 배열을 `useFieldArray`로 관리 (추가/삭제)
- `quotes.length >= 2`이면 모든 인용구의 `pageNumber`가 required
- `quotes.length < 2`이면 `pageNumber`는 optional
- `pageNumber` 밸리데이션: 숫자만 허용, 도서 전체 페이지수보다 작아야 함
- 동적 required는 zod `.superRefine()` 또는 `watch('quotes')` 길이에 따라 스키마를 분기

---

## 7. AutoComplete 컴포넌트

**결정**: Suspense + ErrorBoundary 래핑 + RHF Controller

- API 응답으로 옵션 목록 구성
- resolve 전: 로딩바
- 에러: rejectedFallback + 서버 에러 메시지
- 정상: AutoComplete UI 노출
- `RHFAutoComplete`로 래핑해 name만 받고 Controller로 연결
