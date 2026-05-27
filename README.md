# 독서 기록 멀티스텝 폼

에프랩 멘토링 08회차 과제 — 5단계 독서 기록 폼.

## 단계

1. **도서 정보** — 기본 정보, 독서 상태, 기간
2. **추천/별점** — 추천 여부, 0~5점 (0.5 스케일)
3. **독후감** — 자유 텍스트 (별점 1/5일 때 최소 100자)
4. **인용구** — 여러 개 등록/삭제 가능 (useFieldArray)
5. **공개 여부** — 공개/비공개 선택 후 제출

## 기술 스택

Next.js (Page Router) · TypeScript · React Query · react-hook-form + zod · Emotion · jotai

## 실행

```bash
pnpm install
pnpm dev          # localhost:3000
pnpm build
pnpm typecheck    # tsc --noEmit
pnpm lint
```

## 문서

- [CLAUDE.md](./CLAUDE.md) — AI/개발 컨벤션
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) — 설계 철학
- [DECISIONS.md](./DECISIONS.md) — 기술/설계 결정
