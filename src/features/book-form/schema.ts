import { z } from 'zod/v4';

import type { Step } from './constants';

export const READING_STATUS = ['want-to-read', 'reading', 'completed', 'on-hold'] as const;
export type ReadingStatus = (typeof READING_STATUS)[number];

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  'want-to-read': '읽고 싶은 책',
  reading: '읽는 중',
  completed: '읽음',
  'on-hold': '보류 중',
};

export const bookFormSchema = z
  .object({
    title: z.string().min(1, '도서명을 입력해주세요'),
    author: z.string().min(1, '저자를 입력해주세요'),
    totalPages: z.number().min(1, '총 페이지 수를 입력해주세요'),
    publishDate: z.string().min(1, '출판일을 입력해주세요'),
    readingStatus: z.enum(READING_STATUS),
    startDate: z.string().optional(),
    endDate: z.string().optional(),

    recommended: z.boolean(),
    rating: z.number(),

    review: z.string(),

    quotes: z.array(
      z.object({
        text: z.string(),
        pageNumber: z.number().optional(),
      }),
    ),

    isPublic: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.readingStatus === 'want-to-read') {
      if (data.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['startDate'],
          message: '"읽고 싶은 책"에는 시작일을 입력할 수 없습니다',
        });
      }
      if (data.endDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: '"읽고 싶은 책"에는 종료일을 입력할 수 없습니다',
        });
      }
      return;
    }

    if (data.readingStatus === 'reading' || data.readingStatus === 'on-hold') {
      if (!data.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['startDate'],
          message: '시작일을 입력해주세요',
        });
      }
      if (data.endDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: `"${READING_STATUS_LABELS[data.readingStatus]}"에는 종료일을 입력할 수 없습니다`,
        });
      }
    }

    if (data.readingStatus === 'completed') {
      if (!data.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['startDate'],
          message: '시작일을 입력해주세요',
        });
      }
      if (!data.endDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: '종료일을 입력해주세요',
        });
      }
    }

    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: '종료일은 시작일 이후여야 합니다',
      });
    }

    if (data.publishDate && data.startDate && data.startDate < data.publishDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: '시작일은 출판일 이후여야 합니다',
      });
    }
  });

export type BookFormValues = z.infer<typeof bookFormSchema>;

export const STEP_FIELDS: Record<Step, (keyof BookFormValues)[]> = {
  'book-info': ['title', 'author', 'totalPages', 'publishDate', 'readingStatus', 'startDate', 'endDate'],
  rating: ['recommended', 'rating'],
  review: ['review'],
  quotes: ['quotes'],
  visibility: ['isPublic'],
};
