import { PairMatchingContainer } from '../ActivityView.styled';
import { PointsTag } from './PointsTag';
import { RadioOption } from './RadioOption';

export const PairMatching = ({ leftItems, rightItems }: any) => {
  const maxLength = Math.max(leftItems?.length, rightItems?.length);

  return (
    <div>
      {Array.from({ length: maxLength }).map((_, index) => {
        const leftItem = leftItems?.[index];
        const rightItem = rightItems?.[index];

        if (!leftItem || !rightItem) return null;

        return (
          <PairMatchingContainer key={`pair-${index}`}>
            <RadioOption
              option={{
                id: leftItem?.id,
                option_image: leftItem?.left_image,
                option_text: leftItem?.left_text
              }}
            />
            <RadioOption
              option={{
                id: rightItem?.id,
                option_image: rightItem?.option_image,
                option_text: rightItem?.option_text
              }}
            />
            <PointsTag points={rightItem?.total_points} />
          </PairMatchingContainer>
        );
      })}
    </div>
  );
};
