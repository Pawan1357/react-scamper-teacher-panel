import { TITLES } from 'utils/constants';
import { QUESTION_TYPE } from 'utils/constants/enum';

import { IGetActivityByIdRes } from 'services/chapter/types';

import { ActivityDetails } from './components/ActivityDetails';
import { DragDropArea } from './components/DragDropArea';
import { OptionList } from './components/OptionList';
import { PairMatching } from './components/PairMatching';
import { QuestionCard } from './components/QuestionCard';
import { QuestionTabs } from './components/QuestionTabs';
import HeaderToolbar from 'components/common/HeaderToolbar';
import { Loader } from 'components/common/Loader';
import Meta from 'components/common/Meta';

import { ContentSection, QuestionCardWrapper, QuestionSectionCard } from './ActivityView.styled';
import { useActivityView } from './hooks/useActivityView';

const ActivityViewPage = () => {
  const { activityDetails, isLoading, activeQuestionIndex, onQuestionChange, currentQuestion } =
    useActivityView();

  const renderQuestionContent = () => {
    if (!activityDetails?.data?.type) return null;

    switch (activityDetails?.data?.type) {
      case QUESTION_TYPE.MCQ: {
        const mcqQuestion = currentQuestion;
        const correctOption = mcqQuestion?.options?.find((opt) => opt?.is_correct);
        const correctAnswerId = correctOption?.id;
        return (
          <>
            <QuestionCard
              questionText={mcqQuestion?.title}
              questionDescription={mcqQuestion?.description}
              images={mcqQuestion?.media}
            />
            <OptionList
              options={mcqQuestion?.options || []}
              selectedOptionId={correctAnswerId}
              onOptionSelect={() => {}}
              isSubmitted={true}
              correctAnswerId={correctAnswerId}
              isViewMode={true}
            />
          </>
        );
      }
      case QUESTION_TYPE.MATCH_PAIR: {
        const pairQuestion = currentQuestion;
        return (
          <>
            <QuestionCard
              questionText={pairQuestion?.title}
              questionDescription={pairQuestion?.description}
              images={pairQuestion?.media}
            />
            <PairMatching leftItems={pairQuestion?.options} rightItems={pairQuestion?.options} />
          </>
        );
      }
      case QUESTION_TYPE.DRAG_AND_DROP: {
        const dragDropQuestion = currentQuestion;
        return (
          <>
            <QuestionCard
              questionText={dragDropQuestion?.title}
              questionDescription={dragDropQuestion?.description}
              images={dragDropQuestion?.media}
            />
            <DragDropArea
              targets={dragDropQuestion?.drag_drop_bases}
              draggableItems={dragDropQuestion?.drag_drop_options}
              rows={dragDropQuestion?.no_of_rows}
              cols={dragDropQuestion?.no_of_columns}
            />
          </>
        );
      }
      default:
        return null;
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Meta title={`${TITLES.COMMON} - ${TITLES.CLASSROOM.VIEW_ACTIVITY}`} />
      <HeaderToolbar title={TITLES.CLASSROOM.VIEW_ACTIVITY} backBtn />

      <ContentSection role="main">
        <ActivityDetails activityDetails={activityDetails?.data as IGetActivityByIdRes} />

        <QuestionSectionCard>
          <QuestionTabs
            totalQuestions={activityDetails?.data?.questions?.length || 0}
            activeIndex={activeQuestionIndex}
            onTabChange={onQuestionChange}
          />
          <QuestionCardWrapper>{renderQuestionContent()}</QuestionCardWrapper>
        </QuestionSectionCard>
      </ContentSection>
    </>
  );
};

export { ActivityViewPage as Activity };
export default ActivityViewPage;
