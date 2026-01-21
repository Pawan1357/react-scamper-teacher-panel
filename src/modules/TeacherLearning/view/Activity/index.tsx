import { Button, Spin } from 'antd';

import { IGetTLActivityByIdRes } from 'services/teacherLearning/types';

import { ActivityDetails } from './components/ActivityDetails';
import { AnswerResultModal } from './components/AnswerResultModal';
import { OptionList } from './components/OptionList';
import { ProgressIndicator } from './components/ProgressIndicator';
import { QuestionCard } from './components/QuestionCard';
import HeaderToolbar from 'components/common/HeaderToolbar';
import { Loader } from 'components/common/Loader';
import Meta from 'components/common/Meta';

import {
  ContentSection,
  QuestionCardWrapper,
  QuestionSectionCard,
  SubmitButtonWrapper
} from './ActivityView.styled';
import { useViewTLActivity } from './hooks/useViewTLActivity';

const ViewTLActivityPage = () => {
  const {
    activityDetails,
    isLoading,
    isQuestionLoading,
    currentQuestion,
    stepper,
    progress,
    selectedOptionId,
    onOptionSelect,
    onSubmitQuestion,
    isViewMode,
    isModalOpen,
    modalData,
    isLastQuestion,
    handleModalClose,
    isSubmitting,
    questionData,
    areAllQuestionsSubmitted,
    navigateToQuestion
  } = useViewTLActivity();

  const renderQuestionContent = () => {
    if (!currentQuestion) return null;

    // Get correct answer ID from API response if available (for view mode or after submission)
    // Check both questionData response and modalData (after submission)
    const correctAnswerId =
      modalData?.correctAnswer?.option_id || questionData?.correct_answer?.option_id;

    return (
      <>
        <QuestionCard
          questionText={currentQuestion?.title}
          questionDescription={currentQuestion?.description}
          images={currentQuestion?.media}
        />
        <OptionList
          options={currentQuestion?.options || []}
          selectedOptionId={selectedOptionId}
          onOptionSelect={onOptionSelect}
          isSubmitted={isViewMode || isModalOpen}
          correctAnswerId={correctAnswerId}
          isViewMode={isViewMode}
        />
        <SubmitButtonWrapper>
          <Button
            type="primary"
            htmlType="button"
            size="large"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSubmitQuestion(e);
            }}
            disabled={(!selectedOptionId && !isViewMode) || isSubmitting}
            loading={isSubmitting}
          >
            {isViewMode ? (isLastQuestion ? 'Finish' : 'Next') : 'Submit Answer'}
          </Button>
        </SubmitButtonWrapper>
      </>
    );
  };

  // Show full page loader only for initial activity details loading
  if (isLoading) return <Loader />;

  const totalQuestions = progress?.total_questions || activityDetails?.questions?.length || 0;

  return (
    <>
      <Meta title="Skill Check Overview" />
      <HeaderToolbar title="Skill Check Overview" backBtn />

      <ContentSection role="main">
        <ActivityDetails activityDetails={activityDetails as IGetTLActivityByIdRes} />

        <QuestionSectionCard>
          {totalQuestions > 1 &&
            (stepper && stepper.length > 0 ? (
              <ProgressIndicator
                stepper={stepper}
                totalQuestions={totalQuestions}
                onClick={navigateToQuestion}
                areAllQuestionsSubmitted={areAllQuestionsSubmitted}
                isViewMode={isViewMode}
              />
            ) : (
              <ProgressIndicator
                totalQuestions={totalQuestions}
                activeIndex={0}
                submittedQuestions={new Set()}
              />
            ))}
          <QuestionCardWrapper>
            {isQuestionLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '200px'
                }}
              >
                <Spin size="large" />
              </div>
            ) : (
              renderQuestionContent()
            )}
          </QuestionCardWrapper>
        </QuestionSectionCard>
      </ContentSection>

      {modalData && (
        <AnswerResultModal
          open={isModalOpen}
          isCorrect={modalData.isCorrect}
          correctAnswer={modalData.correctAnswer}
          pointsEarned={modalData.pointsEarned}
          isLastQuestion={isLastQuestion}
          onNext={handleModalClose}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default ViewTLActivityPage;
