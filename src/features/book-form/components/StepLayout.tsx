import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';

import { STEPS, STEP_LABELS, type Step, getNextStep, getPrevStep } from '../constants';
import { STEP_FIELDS } from '../schema';
import type { BookFormValues } from '../schema';

interface StepLayoutProps {
  currentStep: Step;
  children: ReactNode;
}

export const StepLayout = ({ currentStep, children }: StepLayoutProps) => {
  const { trigger } = useFormContext<BookFormValues>();
  const router = useRouter();
  const currentIndex = STEPS.indexOf(currentStep);
  const nextStep = getNextStep(currentStep);
  const prevStep = getPrevStep(currentStep);

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (valid && nextStep) {
      router.push(`/steps/${nextStep}`, undefined, { shallow: true });
    }
  };

  const handlePrev = () => {
    if (prevStep) {
      router.push(`/steps/${prevStep}`, undefined, { shallow: true });
    }
  };

  return (
    <Container>
      <ProgressBar>
        {STEPS.map((step, i) => (
          <ProgressItem key={step} $active={i <= currentIndex}>
            {STEP_LABELS[step]}
          </ProgressItem>
        ))}
      </ProgressBar>
      <Content>{children}</Content>
      <Nav>
        {prevStep && <NavButton onClick={handlePrev}>이전</NavButton>}
        <Spacer />
        {nextStep && <NavButton onClick={handleNext}>다음</NavButton>}
      </Nav>
    </Container>
  );
};

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProgressBar = styled.ol`
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const ProgressItem = styled.li<{ $active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  border-bottom: 3px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  font-size: 0.875rem;
`;

const Content = styled.main`
  min-height: 200px;
  margin-bottom: 2rem;
`;

const Nav = styled.nav`
  display: flex;
`;

const Spacer = styled.div`
  flex: 1;
`;

const NavButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    opacity: 0.9;
  }
`;
