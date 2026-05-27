import { useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';

import { FormField } from '@/components/ui/FormField';
import { RHFStarRating } from '@/components/rhf/RHFStarRating';
import type { BookFormValues } from '../schema';

export const RatingStep = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BookFormValues>();

  const recommended = watch('recommended');

  return (
    <div>
      <StepTitle>추천/별점</StepTitle>

      <FormField label="추천 여부" error={errors.recommended?.message}>
        <ToggleGroup>
          <ToggleButton
            type="button"
            $active={recommended}
            onClick={() => setValue('recommended', true)}
          >
            추천
          </ToggleButton>
          <ToggleButton
            type="button"
            $active={!recommended}
            onClick={() => setValue('recommended', false)}
          >
            비추천
          </ToggleButton>
        </ToggleGroup>
      </FormField>

      <FormField label="별점" error={errors.rating?.message}>
        <RHFStarRating name="rating" />
      </FormField>
    </div>
  );
};

const StepTitle = styled.h2`
  margin: 0 0 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ToggleGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.25rem;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: 0.375rem;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.background)};
  color: ${({ $active }) => ($active ? '#fff' : 'inherit')};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;
