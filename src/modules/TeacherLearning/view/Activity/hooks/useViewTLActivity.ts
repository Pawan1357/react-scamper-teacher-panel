import { useCallback, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { ROUTES } from 'utils/constants/routes';
import { showToaster } from 'utils/functions';

import { classroomQueryKeys } from 'services/classroom';
import { manageStudentQueryKeys } from 'services/manageStudent';
import { teacherLearningHooks, teacherLearningQueryKey } from 'services/teacherLearning';
import * as Types from 'services/teacherLearning/types';

export const useViewTLActivity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const activityStatus =
    (location.state as { activityStatus?: string })?.activityStatus || 'pending';
  const lessonIdFromUrl = searchParams.get('lessonId');

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    isCorrect: boolean;
    correctAnswer?: Types.ICorrectAnswer;
    pointsEarned?: number;
  } | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | undefined>(undefined);
  const [visitedQuestionIds, setVisitedQuestionIds] = useState<Set<number>>(new Set());
  console.log('🚀 ~ useViewTLActivity ~ visitedQuestionIds:', visitedQuestionIds);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);

  const { activityId, teacherLearningId } = useParams<{
    activityId: string;
    teacherLearningId: string;
  }>();

  // Get activity details (for display purposes)
  const { data: activityDetails, isLoading: isActivityDetailsLoading } =
    teacherLearningHooks.useGetTLActivityById(activityId as string);

  // Get first question ID for view mode (completed status)
  const firstQuestionId = useMemo(() => {
    if (
      activityStatus === 'completed' &&
      activityDetails?.questions &&
      activityDetails?.questions?.length > 0
    ) {
      // Get the question with the lowest sequence number
      const sortedQuestions = [...(activityDetails.questions || [])].sort(
        (a, b) => a.sequence - b.sequence
      );
      return sortedQuestions[0]?.id;
    }
    return undefined;
  }, [activityDetails, activityStatus]);

  useEffect(() => {
    if (teacherLearningId) {
      queryClient.invalidateQueries({ queryKey: teacherLearningQueryKey.all });
      queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: manageStudentQueryKeys.all });
    }
  }, [queryClient, teacherLearningId]);

  // Determine which questionId to use for the API call
  // For completed status, ALWAYS pass questionId (never call without it)
  const questionIdForApi = useMemo(() => {
    if (activityStatus === 'completed') {
      // In view mode, always use questionId - use currentQuestionId if set, otherwise use firstQuestionId
      // Never return undefined for completed status
      return currentQuestionId !== undefined ? currentQuestionId : firstQuestionId;
    }
    // For pending or in_progress, don't pass questionId
    return undefined;
  }, [activityStatus, currentQuestionId, firstQuestionId]);

  // Start activity mutation (only for pending status)
  const startActivityMutation = teacherLearningHooks.useStartActivityProgress({
    onSuccess: () => {
      setHasStarted(true);
      // After starting, fetch the question
      refetchQuestion();
    },
    onError: (error) => {
      showToaster('error', error?.message || 'Failed to start activity');
    }
  });

  // Get question query
  // For completed status, only enable when we have a questionId (from activityDetails)
  const shouldEnableQuestionQuery = useMemo(() => {
    if (activityStatus === 'completed') {
      // Only enable when we have activityDetails loaded and a questionId to use
      return Boolean(activityDetails && questionIdForApi);
    }
    return hasStarted || activityStatus === 'in_progress';
  }, [activityStatus, hasStarted, activityDetails, questionIdForApi]);

  const {
    data: questionData,
    isLoading: isQuestionLoading,
    refetch: refetchQuestion
  } = teacherLearningHooks.useGetActivityQuestion(
    activityId as string,
    shouldEnableQuestionQuery,
    questionIdForApi
  );

  // Submit answer mutation
  const submitAnswerMutation = teacherLearningHooks.useSubmitAnswer({
    onSuccess: (response) => {
      setModalData({
        isCorrect: response?.is_correct,
        correctAnswer: response?.correct_answer,
        pointsEarned: response?.points_earned
      });
      setIsModalOpen(true);
      // Don't navigate automatically - wait for user to click modal button
      // The navigation will happen in handleModalClose when user clicks Next
    },
    onError: (error) => {
      showToaster('error', error?.message || 'Failed to submit answer');
    }
  });

  // Define isViewMode early so it can be used in useEffects
  const isViewMode = activityStatus === 'completed';

  // Handle initial load based on status
  useEffect(() => {
    if (activityStatus === 'pending' && !hasStarted && activityId) {
      // For pending status, start the activity first
      startActivityMutation.mutate(activityId);
    } else if (
      (activityStatus === 'in_progress' || activityStatus === 'completed') &&
      !hasStarted
    ) {
      // For in_progress or completed, directly fetch question
      setHasStarted(true);
    }
  }, [activityStatus, activityId, hasStarted]);

  // Set initial question based on API response
  useEffect(() => {
    if (questionData) {
      // Set selected option if answer exists (for view mode or resumed questions)
      if (questionData?.answer) {
        setSelectedOptionId(questionData?.answer?.selected_option_id);
      } else {
        // Reset selection for new questions
        setSelectedOptionId(null);
      }

      // Track visited questions in view mode
      if (isViewMode && questionData?.question?.id) {
        setVisitedQuestionIds((prev) => new Set([...prev, questionData?.question.id]));
      }

      // Track question start time for pending/in_progress flows (not view mode)
      if (!isViewMode && questionData?.question?.id) {
        setQuestionStartTime(Date.now());
      } else {
        // Reset start time for view mode
        setQuestionStartTime(null);
      }
    }
  }, [questionData, isViewMode]);

  // Initialize currentQuestionId for view mode
  useEffect(() => {
    if (activityStatus === 'completed' && firstQuestionId && currentQuestionId === undefined) {
      setCurrentQuestionId(firstQuestionId);
      // Mark first question as visited (merge with existing set)
      if (firstQuestionId) {
        setVisitedQuestionIds((prev) => new Set([...prev, firstQuestionId]));
      }
    }
  }, [activityStatus, firstQuestionId, currentQuestionId]);

  const currentQuestion = useMemo(() => {
    return questionData?.question || null;
  }, [questionData]);

  const stepper = useMemo(() => {
    if (!questionData?.stepper) return [];

    // In view mode, only mark the current/active question as answered (to show tick icon)
    if (isViewMode) {
      return questionData?.stepper.map((step) => ({
        ...step,
        is_answered: currentQuestionId === step.question_id,
        is_current: currentQuestionId === step.question_id
      }));
    }

    // For non-view mode, use the stepper data as-is from API
    return questionData?.stepper;
  }, [questionData, isViewMode, currentQuestionId]);

  const progress = useMemo(() => {
    return questionData?.progress || null;
  }, [questionData]);

  // Get next question ID for view mode navigation
  const getNextQuestionId = useCallback(() => {
    if (!isViewMode || !currentQuestion || !activityDetails?.questions) {
      return undefined;
    }

    // Find current question's sequence
    const currentSequence = currentQuestion.sequence;

    // Find next question with sequence + 1
    const nextQuestion = activityDetails.questions.find((q) => q.sequence === currentSequence + 1);

    return nextQuestion?.id;
  }, [isViewMode, currentQuestion, activityDetails]);

  const onOptionSelect = useCallback(
    (optionId: number) => {
      if (!isViewMode) {
        setSelectedOptionId(optionId);
      }
    },
    [isViewMode]
  );

  const getSelectedOptionId = useCallback(() => {
    return selectedOptionId?.toString() || null;
  }, [selectedOptionId]);

  const isLastQuestion = useMemo(() => {
    if (isViewMode && currentQuestion && activityDetails?.questions) {
      // In view mode, check if current question is the last one by sequence
      const sortedQuestions = [...activityDetails.questions].sort(
        (a, b) => a.sequence - b.sequence
      );
      const maxSequence = Math.max(...sortedQuestions.map((q) => q.sequence));
      return currentQuestion.sequence >= maxSequence;
    }
    if (!progress) return false;
    return progress.current_question >= progress.total_questions;
  }, [progress, isViewMode, currentQuestion, activityDetails]);

  const handleNextQuestion = useCallback(
    (e?: React.MouseEvent) => {
      // Prevent default behavior and scrolling
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      setIsModalOpen(false);
      setSelectedOptionId(null);
      setModalData(null);
      // Reset start time when moving to next question
      setQuestionStartTime(null);

      if (isViewMode) {
        // In view mode, get next question ID and update state
        const nextQuestionId = getNextQuestionId();
        if (nextQuestionId) {
          setCurrentQuestionId(nextQuestionId);
          // The query will automatically refetch when currentQuestionId changes
          return;
        } else {
          // No more questions, redirect back with lessonId preserved
          if (teacherLearningId) {
            const lessonId = lessonIdFromUrl || (location.state as { lessonId?: number })?.lessonId;
            const returnUrl = ROUTES.teacherLearning.viewTeacherLearning({ teacherLearningId });
            const searchParams = new URLSearchParams();
            if (lessonId) {
              searchParams.set('lessonId', String(lessonId));
            }
            const finalUrl = searchParams.toString()
              ? `${returnUrl}?${searchParams.toString()}`
              : returnUrl;
            navigate(finalUrl);
          }
          return;
        }
      }

      // For non-view mode, refetch to get next question after modal is closed
      refetchQuestion();
    },
    [refetchQuestion, isViewMode, getNextQuestionId, teacherLearningId, navigate, location.state]
  );

  const onSubmitQuestion = useCallback(
    (e?: React.MouseEvent) => {
      // Prevent default form submission and scrolling
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (isViewMode) {
        // In view mode, check if it's the last question
        if (isLastQuestion) {
          // If last question, redirect back with lessonId preserved
          if (teacherLearningId) {
            const lessonId = lessonIdFromUrl || (location.state as { lessonId?: number })?.lessonId;
            const returnUrl = ROUTES.teacherLearning.viewTeacherLearning({ teacherLearningId });
            const searchParams = new URLSearchParams();
            if (lessonId) {
              searchParams.set('lessonId', String(lessonId));
            }
            const finalUrl = searchParams.toString()
              ? `${returnUrl}?${searchParams.toString()}`
              : returnUrl;
            navigate(finalUrl);
          }
          return;
        }
        // Otherwise, move to next question
        handleNextQuestion(e);
        return;
      }

      if (!selectedOptionId || !currentQuestion || !activityId) {
        showToaster('warning', 'Please select an option before submitting');
        return;
      }

      // Calculate time taken in seconds (only for pending/in_progress flows)
      let timeTaken: number | undefined;
      if (questionStartTime) {
        const timeElapsed = Date.now() - questionStartTime;
        timeTaken = Math.floor(timeElapsed / 1000); // Convert to seconds
      }

      // Submit answer
      submitAnswerMutation.mutate({
        activityId,
        data: {
          question_id: currentQuestion.id,
          selected_option_id: Number(selectedOptionId),
          ...(timeTaken !== undefined && { duration_seconds: timeTaken })
        }
      });

      // Reset start time after submission
      setQuestionStartTime(null);
    },
    [
      isViewMode,
      selectedOptionId,
      currentQuestion,
      activityId,
      questionStartTime,
      submitAnswerMutation,
      isLastQuestion,
      handleNextQuestion,
      teacherLearningId,
      navigate,
      location.state,
      lessonIdFromUrl
    ]
  );

  const handleModalClose = useCallback(() => {
    if (progress?.status === 'completed' || isLastQuestion) {
      // Activity completed, redirect back with lessonId preserved
      if (teacherLearningId) {
        const lessonId = lessonIdFromUrl || (location.state as { lessonId?: number })?.lessonId;
        const returnUrl = ROUTES.teacherLearning.viewTeacherLearning({ teacherLearningId });
        const searchParams = new URLSearchParams();
        if (lessonId) {
          searchParams.set('lessonId', String(lessonId));
        }
        const finalUrl = searchParams.toString()
          ? `${returnUrl}?${searchParams.toString()}`
          : returnUrl;
        navigate(finalUrl);
      }
    } else {
      handleNextQuestion();
    }
  }, [
    progress,
    teacherLearningId,
    navigate,
    handleNextQuestion,
    isLastQuestion,
    location.state,
    lessonIdFromUrl
  ]);

  // Check if all questions are submitted (use original API data, not modified stepper)
  const areAllQuestionsSubmitted = useMemo(() => {
    if (!questionData?.stepper || questionData.stepper.length === 0) return false;
    return questionData.stepper.every((step) => step.is_answered);
  }, [questionData?.stepper]);

  // Navigate to specific question by question_id
  const navigateToQuestion = useCallback(
    (questionId: number) => {
      // Allow navigation if all questions are submitted or in view mode
      if (areAllQuestionsSubmitted || isViewMode) {
        setCurrentQuestionId(questionId);
        // The query will automatically refetch when currentQuestionId changes
      }
    },
    [areAllQuestionsSubmitted, isViewMode]
  );

  const isLoading = isActivityDetailsLoading || startActivityMutation.isPending;
  const isQuestionLoadingState = isQuestionLoading;

  return {
    activityDetails,
    isLoading,
    isQuestionLoading: isQuestionLoadingState,
    currentQuestion,
    stepper,
    progress,
    selectedOptionId: getSelectedOptionId(),
    onOptionSelect,
    onSubmitQuestion,
    getSelectedOptionId,
    isViewMode,
    isModalOpen,
    modalData,
    isLastQuestion,
    handleModalClose,
    isSubmitting: submitAnswerMutation.isPending,
    questionData,
    areAllQuestionsSubmitted,
    navigateToQuestion
  };
};
