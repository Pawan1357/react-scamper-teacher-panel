import { Radio, Space } from 'antd';

import { OptionList as OptionListStyled } from '../ActivityView.styled';
import { PointsTag } from './PointsTag';
import { RadioOption } from './RadioOption';

export const OptionList = ({ options, selectedOptionId }: any) => {
  return (
    <OptionListStyled>
      <Radio.Group className="w-100" value={selectedOptionId?.toString()} disabled>
        <Space className="w-100" direction="vertical" size="middle">
          {options?.map((option: any) => {
            return (
              <div key={option?.id} className="mcq-option-item">
                <RadioOption
                  option={option}
                  selectedOptionId={selectedOptionId}
                  isCorrect={selectedOptionId?.toString() === option?.id?.toString()}
                />
                <PointsTag points={option?.total_points} />
              </div>
            );
          })}
        </Space>
      </Radio.Group>
    </OptionListStyled>
  );
};
