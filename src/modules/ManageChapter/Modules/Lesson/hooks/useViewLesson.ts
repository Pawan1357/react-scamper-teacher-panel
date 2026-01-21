import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { showToaster } from 'utils/functions';

import { chapterHooks } from 'services/chapter';

import type { ContentTabKey, DetailTabKey } from 'components/common/Lesson';

export const useViewLesson = () => {
  const [detailTab, setDetailTab] = useState<DetailTabKey>('overview');
  const [contentTab, setContentTab] = useState<ContentTabKey>('activities');

  const { lessonId } = useParams<{ lessonId: string }>();

  const {
    data: lessonData,
    isLoading,
    isError,
    error
  } = chapterHooks.useGetLessonById(lessonId as string);

  useEffect(() => {
    if (isError) {
      showToaster('error', error?.message);
    }
  }, [isError, error]);

  // Automatically set child tab when parent tab changes
  useEffect(() => {
    if (detailTab === 'teacherGuidelines') {
      setContentTab('imagesVideos');
    } else if (detailTab === 'overview') {
      setContentTab('activities');
    }
  }, [detailTab]);

  const onDetailTabChange = (tab: DetailTabKey) => {
    setDetailTab(tab);
    console.log('Detail tab changed:', tab);
  };

  const onContentTabChange = (tab: ContentTabKey) => {
    setContentTab(tab);
    console.log('Content tab changed:', tab);
  };

  return {
    detailTab,
    isLoading,
    onDetailTabChange,
    contentTab,
    onContentTabChange,
    lessonData: lessonData?.data
  };
};
