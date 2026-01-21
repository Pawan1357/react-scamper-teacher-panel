import { useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import { showToaster } from 'utils/functions';

import { chapterHooks } from 'services/chapter';

export const useActivityView = () => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const { activityId } = useParams<{ activityId: string }>();

  const {
    data: activityDetails,
    isLoading,
    isError,
    error
  } = chapterHooks.useGetActivityById(activityId as string);

  useEffect(() => {
    if (isError) {
      showToaster('error', error?.message);
    }
  }, [isError, error]);

  const questions = useMemo(
    () => activityDetails?.data?.questions,
    [activityDetails?.data?.questions]
  );

  const currentQuestion = useMemo(
    () => questions?.[activeQuestionIndex] || null,
    [questions, activeQuestionIndex]
  );

  const onQuestionChange = (index: number) => {
    setActiveQuestionIndex(index);
  };

  return {
    activityDetails,
    isLoading,
    questions,
    activeQuestionIndex,
    onQuestionChange,
    currentQuestion
  };
};
