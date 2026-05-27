export const STEPS = ['book-info', 'rating', 'review', 'quotes', 'visibility'] as const;
export type Step = (typeof STEPS)[number];

export const STEP_LABELS: Record<Step, string> = {
  'book-info': '도서 정보',
  rating: '추천/별점',
  review: '독후감',
  quotes: '인용구',
  visibility: '공개 여부',
};

export function isValidStep(value: string): value is Step {
  return (STEPS as readonly string[]).includes(value);
}

export function getStepIndex(step: Step): number {
  return STEPS.indexOf(step);
}

export function getNextStep(step: Step): Step | null {
  const i = getStepIndex(step);
  return i < STEPS.length - 1 ? STEPS[i + 1] : null;
}

export function getPrevStep(step: Step): Step | null {
  const i = getStepIndex(step);
  return i > 0 ? STEPS[i - 1] : null;
}

export function hasPassedStep(current: Step, target: Step): boolean {
  return getStepIndex(current) > getStepIndex(target);
}
