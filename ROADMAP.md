# PR 로드맵

## 진행 순서

| PR | 제목 | 예상 규모 | 내용 |
|---|---|---|---|
| **#1** | 퍼널 인프라 | ~400줄 | `pages/steps/[step].tsx` + step enum/constants + shallow routing + 스텝 레이아웃(progress bar) + 스텝 가드 + FormProvider 설치 + zod 전체 스키마 뼈대 |
| **#2** | 1단계 — 도서 정보 + 독서 상태 | ~400줄 | BookInfoStep 컴포넌트, 독서 상태 select, 날짜 입력, **크로스필드 밸리데이션** (status ↔ dates, startDate < endDate, startDate ≥ publishDate) |
| **#3** | 2-3단계 — 추천/별점 + 독후감 | ~400줄 | StarRating 컴포넌트(0.5 스케일), RHFStarRating, 독후감 textarea, **크로스스텝 밸리데이션** (rating 1/5 → min 100자) |
| **#4** | 4단계 — 인용구 (useFieldArray) | ~450줄 | 인용구 추가/삭제, `useFieldArray`, 동적 pageNumber (≥2개면 required), 페이지번호 밸리데이션 (숫자만, ≤ totalPages) |
| **#5** | 5단계 — 공개 여부 + 최종 제출 | ~250줄 | 공개/비공개 토글, 최종 전체 밸리데이션, submit handler |
| **#6** | 폼 상태 보존 + 밸리데이션 UX | ~400줄 | sessionStorage 직렬화(watch + debounce), 마운트 시 복원, focus 첫 에러 필드, 붉은 아웃라인, 에러 메시지 |
| **#7** | 실시간 미리보기 + 반응형 | ~350줄 | watch + 500ms debounce 미리보기 패널, window resize 이벤트, viewport < 1024px 조건부 렌더링 |
| **#8** | 고급 컴포넌트 | ~450줄 | CommaSeparatedInput + RHFCommaSeparatedInput, Suspense AutoComplete + RHFAutoComplete (로딩바/에러/정상) |

## 진행 순서 근거

- **#1~#5**: 기본 플로우를 먼저 완성. 각 PR이 동작하는 단계를 하나씩 추가
- **#6**: 기본 플로우가 돌아간 뒤 보존/UX 레이어 추가
- **#7**: 미리보기는 전체 폼이 있어야 의미 있으므로 후순위
- **#8**: 독립적인 고급 컴포넌트, 다른 PR에 의존하지 않음

## 주요 설계 결정 요약

- **단일 FormProvider** — 크로스스텝 밸리데이션 + watch + 보존이 모두 자연스러움
- **shallow routing** — FormProvider unmount 방지
- **단계별 trigger + 최종 전체 검증** — UX와 데이터 무결성 모두 확보
- **zod 스키마 중심 밸리데이션** — 규칙 전체 그림이 한 파일에

상세 결정은 [DECISIONS.md](./DECISIONS.md) 참고.
