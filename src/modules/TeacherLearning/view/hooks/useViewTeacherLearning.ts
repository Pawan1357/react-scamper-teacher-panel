import { useEffect, useMemo, useRef, useState } from 'react';

import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import { showToaster } from 'utils/functions';

import { teacherLearningHooks } from 'services/teacherLearning';

export const useViewTeacherLearning = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const hasInitializedFromUrl = useRef(false);
  const previousUrlLessonId = useRef<string | null>(null);

  const { teacherLearningId } = useParams<{
    teacherLearningId: string;
    chapterId: string;
  }>();

  const {
    data: teacherLearningData,
    isError,
    error,
    isLoading: isTeacherLearningLoading
  } = teacherLearningHooks.useGetTeacherLearningById(teacherLearningId as string);

  const isLoading = isTeacherLearningLoading;
  const isLessonDataLoading = false; // Data is already loaded from the main API

  // Extract data from the API response - using the separate view API
  const chapterData = teacherLearningData?.chapter;
  const lessons = useMemo(() => {
    return teacherLearningData?.lessons?.sort((a, b) => a.sequence - b.sequence) ?? [];
  }, [teacherLearningData?.lessons]);
  const totalLessons = teacherLearningData?.lesson_count || 0;
  const totalActivities = teacherLearningData?.activity_count || 0;

  // Get the selected lesson data
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId);

  const lessonData = selectedLesson
    ? {
        id: selectedLesson.id,
        chapter_id: selectedLesson.chapter_id,
        name: selectedLesson.name,
        description: selectedLesson.description,
        sequence: selectedLesson.sequence,
        is_active: selectedLesson.is_active,
        is_deleted: selectedLesson.is_deleted,
        is_published: selectedLesson.is_published,
        publish_date: selectedLesson.publish_date,
        created_at: selectedLesson.created_at,
        updated_at: selectedLesson.updated_at,
        activities: selectedLesson.activities || [],
        media: selectedLesson.media || [],
        downloadable_content: selectedLesson.downloadable_content || []
      }
    : null;

  const activities = selectedLesson
    ? (selectedLesson.activities || []).map((activity) => ({
        id: activity.id,
        tl_lesson_id: activity.tl_lesson_id,
        correct_answers: activity.correct_answers,
        name: activity.name,
        description: activity.description,
        sequence: activity.sequence,
        type: activity.type,
        is_active: activity.is_active,
        created_at: activity.created_at,
        score: activity.total_score,
        total_questions: activity.total_questions,
        status: activity?.status
      }))
    : [];

  const lessonsForTabs = lessons.map((lesson) => ({
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    sequence: lesson.sequence,
    is_active: lesson.is_active,
    created_at: lesson.created_at,
    activities_count: lesson.activities?.length || 0
  }));

  // Initialize lesson selection from URL params or location state
  // Only restore when: initial load OR URL param changed (indicating navigation back from activity)
  useEffect(() => {
    if (lessons && lessons.length > 0) {
      const lessonIdFromUrl = searchParams.get('lessonId');
      const urlParamChanged = lessonIdFromUrl !== previousUrlLessonId.current;

      // Always restore from URL if it exists and changed (this handles navigation back from activity)
      // OR if we haven't initialized yet (initial load)
      if (lessonIdFromUrl && (urlParamChanged || !hasInitializedFromUrl.current)) {
        const lessonId = parseInt(lessonIdFromUrl, 10);
        if (!isNaN(lessonId)) {
          // Verify the lesson exists in the lessons array
          const lessonExists = lessons.some((lesson) => lesson.id === lessonId);
          if (lessonExists) {
            // Always update to match URL param when it changes (navigation back)
            setSelectedLessonId(lessonId);
            previousUrlLessonId.current = lessonIdFromUrl;
            hasInitializedFromUrl.current = true;
            return;
          }
        }
      }

      // Update ref to track current URL param (even if null)
      // This must happen after we check for changes, so we can detect the next change
      if (!urlParamChanged) {
        previousUrlLessonId.current = lessonIdFromUrl;
      }

      // Fallback: check if there's a lessonId in location state (from navigation back)
      // Only use this if URL param doesn't exist and we haven't initialized yet
      if (!lessonIdFromUrl && !hasInitializedFromUrl.current) {
        const lessonIdFromState = (location.state as { lessonId?: number })?.lessonId;
        if (lessonIdFromState) {
          // Verify the lesson exists in the lessons array
          const lessonExists = lessons.some((lesson) => lesson.id === lessonIdFromState);
          if (lessonExists) {
            setSelectedLessonId(lessonIdFromState);
            hasInitializedFromUrl.current = true;
            return;
          }
        }
      }

      // If no lessonId from URL/state or it doesn't exist, and we haven't initialized yet, default to first lesson
      if (!selectedLessonId && !hasInitializedFromUrl.current) {
        const firstLesson = lessons[0];
        if (firstLesson) {
          setSelectedLessonId(firstLesson.id);
        }
        hasInitializedFromUrl.current = true;
      }
    }
  }, [lessons, location.state, searchParams]);

  // Update URL param when user manually changes tabs (but don't trigger navigation)
  // This keeps the URL in sync with the selected tab
  useEffect(() => {
    if (selectedLessonId && hasInitializedFromUrl.current && teacherLearningId) {
      const currentUrlLessonId = searchParams.get('lessonId');
      const selectedLessonIdStr = String(selectedLessonId);

      // Only update URL if it's different (user manually changed tab)
      // This ensures URL always reflects the current tab selection
      if (currentUrlLessonId !== selectedLessonIdStr) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('lessonId', selectedLessonIdStr);
        // Use replace to avoid adding to history when user manually changes tabs
        setSearchParams(newSearchParams, { replace: true });
        // Update the ref immediately so the first effect doesn't think URL changed
        previousUrlLessonId.current = selectedLessonIdStr;
      }
    }
  }, [selectedLessonId, teacherLearningId, searchParams, setSearchParams]);

  useEffect(() => {
    if (isError) {
      showToaster('error', error?.message || 'Failed to fetch teacher learning details.');
    }
  }, [isError, error]);

  const onLessonChange = (lessonId: number) => {
    setSelectedLessonId(lessonId);
  };

  return {
    isLoading,

    chapterData: chapterData
      ? {
          id: chapterData.id,
          name: chapterData.name,
          description: chapterData.description,
          thumbnail: chapterData.thumbnail,
          link: chapterData.link,
          lesson_count: totalLessons,
          activity_count: totalActivities,
          is_published: teacherLearningData?.is_published || false,
          created_at: teacherLearningData?.created_at || ''
        }
      : undefined,
    lessons: lessonsForTabs,
    selectedLessonId,
    onLessonChange,
    lessonData,
    activities,
    isLessonDataLoading,
    totalLessons,
    totalActivities
  };
};
