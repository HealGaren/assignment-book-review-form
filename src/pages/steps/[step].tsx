import type { ComponentType } from 'react';
import { useRouter } from 'next/router';

import { isValidStep, type Step } from '@/features/book-form/constants';
import { StepLayout } from '@/features/book-form/components/StepLayout';
import { BookInfoStep } from '@/features/book-form/components/BookInfoStep';
import { RatingStep } from '@/features/book-form/components/RatingStep';
import { ReviewStep } from '@/features/book-form/components/ReviewStep';
import { QuotesStep } from '@/features/book-form/components/QuotesStep';
import { VisibilityStep } from '@/features/book-form/components/VisibilityStep';
import { useStepGuard } from '@/features/book-form/hooks/useStepGuard';

const STEP_COMPONENTS: Record<Step, ComponentType> = {
  'book-info': BookInfoStep,
  rating: RatingStep,
  review: ReviewStep,
  quotes: QuotesStep,
  visibility: VisibilityStep,
};

export default function StepPage() {
  const router = useRouter();
  const stepParam = router.query.step as string | undefined;
  const currentStep = stepParam && isValidStep(stepParam) ? stepParam : null;

  useStepGuard(currentStep);

  if (!router.isReady || !currentStep) return null;

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <StepLayout currentStep={currentStep}>
      <StepComponent />
    </StepLayout>
  );
}
