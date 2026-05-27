import { useController, useFormContext } from 'react-hook-form';

import { StarRating } from '@/components/ui/StarRating';

interface RHFStarRatingProps {
  name: string;
}

export const RHFStarRating = ({ name }: RHFStarRatingProps) => {
  const { control } = useFormContext();
  const { field } = useController({ name, control });

  return <StarRating value={field.value} onChange={field.onChange} />;
};
