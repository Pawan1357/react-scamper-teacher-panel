import { Radio } from 'antd';

import { IMAGE_URL } from 'utils/constants';
import { ImageTypeEnum } from 'utils/constants/enum';

import { OptionItem } from '../ActivityView.styled';
import { OptionContentWrapper, OptionImage } from './RadioOption.styled';

export const RadioOption = ({ option, selectedOptionId }: any) => {
  // const pairItem = isPairItem ? (option as any) : null;
  // const questionOption = !isPairItem ? (option as any) : null;

  return (
    <OptionItem
      key={option?.id}
      $isSelected={option?.id === selectedOptionId}
      $isCorrect={option?.id === selectedOptionId}
      $isPairItem={false}
    >
      <Radio value={option.id?.toString()} disabled>
        <div className="d-flex justify-content-between ">
          <OptionContentWrapper>
            {option?.option_image && (
              <OptionImage
                src={`${IMAGE_URL}scamper/${ImageTypeEnum.QUESTION}/${option?.option_image}`}
                alt={option?.option_text}
                width={40}
                height={40}
                preview={false}
                className="option-image"
              />
            )}
            <span className="option-label">{option?.option_text}</span>
          </OptionContentWrapper>
        </div>
      </Radio>
    </OptionItem>
  );
};
