# Frontend Architecture Guide

## 설계 방향

이 프로젝트의 프론트엔드 설계는 **변경 응집도(co-location)**를 우선한다.
"기능이 바뀔 때 고쳐야 할 곳이 몇 군데인가"가 설계 판단의 중요한 질문이다.

## 단일 FormProvider 아키텍처

이 과제의 핵심 설계 결정은 **전체 퍼널을 하나의 FormProvider로 감싸는 것**이다.

이유:
- 크로스스텝 밸리데이션(별점 ↔ 독후감, 페이지수 ↔ 인용구)이 핵심 요구사항
- 하나의 zod 스키마에서 `.refine()`으로 크로스필드 규칙을 선언적으로 정의 가능
- `watch()`로 폼 전체 값을 구독해 실시간 미리보기에 바로 활용
- 새로고침 대비 sessionStorage 직렬화도 한 번에 처리

대신 shallow routing이 필수다 — `router.push(url, undefined, { shallow: true })`로 URL만 변경하고 페이지 컴포넌트는 unmount하지 않아야 FormProvider가 살아 있다.

## 데이터 페칭: 사용하는 곳이 요청한다

서버 데이터는 leaf 우선. 데이터를 렌더링하는 컴포넌트가 해당 데이터를 직접 요청한다.
TanStack Query 캐시가 중복 요청을 제거하므로 여러 컴포넌트가 같은 훅을 호출해도 성능 문제 없음.

폼 데이터는 다름 — FormProvider가 전체를 소유하고, 각 단계 컴포넌트는 `useFormContext()`로 자기 필드에 접근한다.

## 밸리데이션 전략: 스키마 중심

밸리데이션 규칙은 가능한 **zod 스키마에 응집**한다.

- 단순 규칙 (required, min, max 등): 필드별 zod 타입 선언
- 같은 단계 내 크로스필드 (독서 상태 ↔ 날짜): `.refine()` / `.superRefine()`
- 크로스스텝 (별점 ↔ 독후감): 최상위 `.superRefine()`

JSX 레벨에서 직접 밸리데이션 규칙을 넣는 것은 위 방법으로 해결 안 될 때만.
이 원칙은 코드만 봐도 밸리데이션 규칙의 전체 그림을 파악할 수 있게 해준다.

## 추상화와 레이어를 나누는 시점

다음 중 하나에 해당하면 분리를 검토한다:

- 같은 조합 로직이 2곳 이상에서 실제로 반복될 때
- 데이터 변환이 복잡해서 컴포넌트 가독성을 해칠 때
- 테스트에서 격리가 실제로 필요할 때

해당하지 않으면 나누지 않는다.

## RHF 프리픽스 컴포넌트의 위치

`RHFTextInput`, `RHFStarRating`, `RHFCommaSeparatedInput` 같은 RHF 래퍼는:

- 2곳 이상에서 쓰이면 `components/ui/` (순수 UI) + `components/rhf/` (RHF 래퍼)로 분리
- 한 곳에서만 쓰이면 해당 feature 안에 배치
- 순수 UI 컴포넌트(`StarRating`)와 RHF 래퍼(`RHFStarRating`)는 항상 분리 — 순수 UI는 RHF를 몰라야 한다
