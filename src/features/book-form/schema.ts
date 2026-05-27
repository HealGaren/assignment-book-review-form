import { z } from 'zod/v4';

import type { Step } from './constants';

export const bookFormSchema = z.object({
  title: z.string(),
  author: z.string(),
  totalPages: z.number(),
  publishDate: z.string(),
  readingStatus: z.enum(['reading', 'completed', 'want-to-read']),
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
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

export const STEP_FIELDS: Record<Step, (keyof BookFormValues)[]> = {
  'book-info': ['title', 'author', 'totalPages', 'publishDate', 'readingStatus', 'startDate', 'endDate'],
  rating: ['recommended', 'rating'],
  review: ['review'],
  quotes: ['quotes'],
  visibility: ['isPublic'],
};
