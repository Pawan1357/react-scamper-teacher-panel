import { useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import { showToaster } from 'utils/functions';

import { teacherLearningHooks } from 'services/teacherLearning';

export const useViewTeacherLearning = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

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

  useEffect(() => {
    if (lessons && lessons.length > 0 && !selectedLessonId) {
      const firstLesson = lessons[0];
      if (firstLesson) {
        setSelectedLessonId(firstLesson.id);
      }
    }
  }, [lessons, selectedLessonId]);

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
