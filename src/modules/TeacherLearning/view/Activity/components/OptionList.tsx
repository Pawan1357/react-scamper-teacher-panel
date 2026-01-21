import { Radio, Space } from 'antd';

import { OptionList as OptionListStyled } from '../ActivityView.styled';
import { RadioOption } from './RadioOption';

interface OptionListProps {
  options: any[];
  selectedOptionId: string | null;
  onOptionSelect: (optionId: number) => void;
  isSubmitted?: boolean;
  correctAnswerId?: number;
  isViewMode?: boolean;
}

export const OptionList = ({
  options,
  selectedOptionId,
  onOptionSelect,
  isSubmitted = false,
  correctAnswerId,
  isViewMode = false
}: OptionListProps) => {
  return (
    <OptionListStyled>
      <Radio.Group
        className="w-100"
        value={selectedOptionId}
        onChange={(e) => onOptionSelect?.(Number(e.target.value))}
        disabled={isSubmitted || isViewMode}
      >
        <Space className="w-100" direction="vertical" size="middle">
          {options?.map((option: any) => {
            const isSelected = option?.id?.toString() === selectedOptionId;
            const isCorrect = option?.id === correctAnswerId;
            const showAsIncorrect = isSelected && !isCorrect && (isSubmitted || isViewMode);

            return (
              <div key={option?.id} className="mcq-option-item">
                <RadioOption
                  option={option}
                  selectedOptionId={selectedOptionId}
                  isCorrect={isCorrect}
                  showAsIncorrect={showAsIncorrect}
                  isViewMode={isViewMode}
                  isSubmitted={isSubmitted}
                  onOptionSelect={onOptionSelect}
                />
                {/* <PointsTag points={option?.total_points} /> */}
              </div>
            );
          })}
        </Space>
      </Radio.Group>
    </OptionListStyled>
  );
};
