import { useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';

import { FormField } from '@/components/ui/FormField';
import type { BookFormValues } from '../schema';

interface QuoteItemProps {
  index: number;
  showPageNumber: boolean;
  onRemove: () => void;
}

export const QuoteItem = ({ index, showPageNumber, onRemove }: QuoteItemProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookFormValues>();

  const quoteErrors = errors.quotes?.[index];

  return (
    <Wrapper>
      <Header>
        <Title>인용구 {index + 1}</Title>
        <RemoveButton type="button" onClick={onRemove}>
          삭제
        </RemoveButton>
      </Header>

      <FormField label="인용구 내용" error={quoteErrors?.text?.message}>
        <Textarea
          {...register(`quotes.${index}.text`)}
          placeholder="인용구를 입력해주세요"
          rows={3}
        />
      </FormField>

      {showPageNumber && (
        <FormField label="페이지 번호" error={quoteErrors?.pageNumber?.message}>
          <Input
            type="number"
            {...register(`quotes.${index}.pageNumber`, {
              setValueAs: (v: string) => (v === '' ? undefined : Number(v)),
            })}
            placeholder="0"
            min={1}
          />
        </FormField>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const RemoveButton = styled.button`
  padding: 0.375rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 0.375rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
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

const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
