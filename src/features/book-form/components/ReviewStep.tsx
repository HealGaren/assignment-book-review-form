import { useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';

import { FormField } from '@/components/ui/FormField';
import type { BookFormValues } from '../schema';

export const ReviewStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookFormValues>();

  return (
    <div>
      <StepTitle>독후감</StepTitle>

      <FormField label="독후감" error={errors.review?.message}>
        <Textarea {...register('review')} placeholder="독후감을 작성해주세요" rows={8} />
      </FormField>
    </div>
  );
};

const StepTitle = styled.h2`
  margin: 0 0 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
