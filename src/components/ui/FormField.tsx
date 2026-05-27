import type { ReactNode } from 'react';
import styled from '@emotion/styled';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export const FormField = ({ label, error, children }: FormFieldProps) => (
  <Wrapper>
    <Label>{label}</Label>
    {children}
    {error && <ErrorText>{error}</ErrorText>}
  </Wrapper>
);

const Wrapper = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.375rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorText = styled.p`
  margin: 0.25rem 0 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`;
