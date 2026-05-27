import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { STEPS, type Step } from '../constants';

export function useStepGuard(step: Step | null) {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    if (!step) {
      router.replace(`/steps/${STEPS[0]}`);
    }
  }, [step, router]);
}
