import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';

import { FormField } from '@/components/ui/FormField';
import type { BookFormValues } from '../schema';
import { READING_STATUS, READING_STATUS_LABELS } from '../schema';

export const BookInfoStep = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BookFormValues>();

  const readingStatus = watch('readingStatus');
  const showStartDate = readingStatus !== 'want-to-read';
  const showEndDate = readingStatus === 'completed';

  useEffect(() => {
    if (readingStatus === 'want-to-read') {
      setValue('startDate', '');
      setValue('endDate', '');
    } else if (readingStatus === 'reading' || readingStatus === 'on-hold') {
      setValue('endDate', '');
    }
  }, [readingStatus, setValue]);

  return (
    <div>
      <StepTitle>도서 정보</StepTitle>

      <FormField label="도서명" error={errors.title?.message}>
        <Input {...register('title')} placeholder="도서명을 입력해주세요" />
      </FormField>

      <FormField label="저자" error={errors.author?.message}>
        <Input {...register('author')} placeholder="저자를 입력해주세요" />
      </FormField>

      <FormField label="총 페이지 수" error={errors.totalPages?.message}>
        <Input
          type="number"
          {...register('totalPages', { valueAsNumber: true })}
          placeholder="0"
          min={1}
        />
      </FormField>

      <FormField label="출판일" error={errors.publishDate?.message}>
        <Input type="date" {...register('publishDate')} />
      </FormField>

      <FormField label="독서 상태" error={errors.readingStatus?.message}>
        <Select {...register('readingStatus')}>
          {READING_STATUS.map((status) => (
            <option key={status} value={status}>
              {READING_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      </FormField>

      {showStartDate && (
        <FormField label="시작일" error={errors.startDate?.message}>
          <Input type="date" {...register('startDate')} />
        </FormField>
      )}

      {showEndDate && (
        <FormField label="종료일" error={errors.endDate?.message}>
          <Input type="date" {...register('endDate')} />
        </FormField>
      )}
    </div>
  );
};

const StepTitle = styled.h2`
  margin: 0 0 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const inputStyles = `
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid;
  border-radius: 0.375rem;
  font-size: 1rem;
  box-sizing: border-box;
`;

const Input = styled.input`
  ${inputStyles}
  border-color: ${({ theme }) => theme.colors.border};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  ${inputStyles}
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
