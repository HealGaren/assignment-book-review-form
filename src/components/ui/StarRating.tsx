import { useState } from 'react';
import styled from '@emotion/styled';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

const FILLED_COLOR = '#f59e0b';
const EMPTY_COLOR = '#d1d5db';

export const StarRating = ({ value, onChange, max = 5, step = 0.5 }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;
  const halfStep = step < 1;

  return (
    <Container onMouseLeave={() => setHoverValue(null)}>
      {Array.from({ length: max }, (_, i) => {
        const fillRatio = Math.min(Math.max(displayValue - i, 0), 1);

        return (
          <StarWrapper key={i}>
            <EmptyStar>★</EmptyStar>
            <FilledStar $ratio={fillRatio}>★</FilledStar>
            {halfStep && (
              <HitArea
                $position="left"
                onMouseEnter={() => setHoverValue(i + step)}
                onClick={() => onChange(i + step)}
              />
            )}
            <HitArea
              $position={halfStep ? 'right' : 'full'}
              onMouseEnter={() => setHoverValue(i + 1)}
              onClick={() => onChange(i + 1)}
            />
          </StarWrapper>
        );
      })}
      {displayValue > 0 && <ValueText>{displayValue.toFixed(1)}</ValueText>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StarWrapper = styled.span`
  position: relative;
  display: inline-block;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
`;

const EmptyStar = styled.span`
  color: ${EMPTY_COLOR};
`;

const FilledStar = styled.span<{ $ratio: number }>`
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: ${({ $ratio }) => $ratio * 100}%;
  color: ${FILLED_COLOR};
  pointer-events: none;
`;

const HitArea = styled.span<{ $position: 'left' | 'right' | 'full' }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $position }) => ($position === 'right' ? '50%' : '0')};
  width: ${({ $position }) => ($position === 'full' ? '100%' : '50%')};
`;

const ValueText = styled.span`
  margin-left: 0.5rem;
  font-size: 1rem;
  color: #6b7280;
`;
