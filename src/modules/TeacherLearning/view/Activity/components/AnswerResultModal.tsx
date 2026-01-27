import React from 'react';

import ConfirmModal from 'components/common/Modal/components/ConfirmModal';
import { CheckCircleIcon, ExclamationIcon } from 'components/svg';

import {
  AnswerResultModalContent,
  CorrectAnswerBox,
  RightAnswerLabel
} from './AnswerResultModal.styled';

interface AnswerResultModalProps {
  open: boolean;
  isCorrect: boolean;
  correctAnswer?: {
    option_id: number;
    option_text: string;
    option_image: string | null;
  };
  pointsEarned?: number;
  isLastQuestion: boolean;
  onNext: () => void;
  onClose: () => void;
}

export const AnswerResultModal: React.FC<AnswerResultModalProps> = ({
  open,
  isCorrect,
  correctAnswer,
  isLastQuestion,
  onNext,
  onClose
}) => {
  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLastQuestion) {
      onClose();
    } else {
      onNext();
    }
  };

  const renderDescription = () => {
    if (isCorrect) {
      return null;
    }

    if (!correctAnswer) {
      return undefined;
    }

    return (
      <>
        {/* <p>You have given incorrect answer. You may move to the next question.</p> */}
        <AnswerResultModalContent>
          <RightAnswerLabel>Right Answer:</RightAnswerLabel>
          <CorrectAnswerBox>{correctAnswer?.option_text}</CorrectAnswerBox>
        </AnswerResultModalContent>
      </>
    );
  };

  return (
    <ConfirmModal
      modalProps={{
        open,
        onCancel: onClose,
        onOk: handleButtonClick,
        title: isCorrect ? 'Correct Answer' : 'Incorrect Answer',
        description: renderDescription(),
        icon: isCorrect ? <CheckCircleIcon /> : <ExclamationIcon />,
        okText: isLastQuestion ? 'Finish' : 'Next Question',
        cancelButtonProps: { style: { display: 'none' } },
        className: 'answer-result-modal'
      }}
      buttonProps={{}}
    />
  );
};
