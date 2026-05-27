import { useFormContext, useFieldArray } from 'react-hook-form';
import styled from '@emotion/styled';

import type { BookFormValues } from '../schema';
import { QuoteItem } from './QuoteItem';

export const QuotesStep = () => {
  const { control, watch } = useFormContext<BookFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quotes',
  });

  const quotes = watch('quotes');
  const showPageNumber = quotes.length >= 2;

  const handleAdd = () => {
    append({ text: '', pageNumber: undefined });
  };

  return (
    <div>
      <StepTitle>인용구</StepTitle>

      {fields.map((field, index) => (
        <QuoteItem
          key={field.id}
          index={index}
          showPageNumber={showPageNumber}
          onRemove={() => remove(index)}
        />
      ))}

      <AddButton type="button" onClick={handleAdd}>
        + 인용구 추가
      </AddButton>
    </div>
  );
};

const StepTitle = styled.h2`
  margin: 0 0 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const AddButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.md};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
