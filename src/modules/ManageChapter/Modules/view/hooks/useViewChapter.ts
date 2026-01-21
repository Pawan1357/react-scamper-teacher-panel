import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { showToaster } from 'utils/functions';

import { chapterHooks } from 'services/chapter';

import type { ContentTabKey, DetailTabKey } from '../types';

export const useViewChapter = () => {
  const [detailTab, setDetailTab] = useState<DetailTabKey>('overview');
  const [contentTab, setContentTab] = useState<ContentTabKey>('lessons');

  const { chapterId } = useParams<{ chapterId: string }>();

  const {
    data: chapterData,
    isError,
    error,
    isLoading
  } = chapterHooks.useGetChapterById(chapterId as string);

  useEffect(() => {
    if (isError) {
      showToaster('error', error?.message || 'Failed to fetch chapter details.');
    }
  }, [isError, error]);

  const onDetailTabChange = (tab: DetailTabKey) => {
    setDetailTab(tab);
  };

  const onContentTabChange = (tab: ContentTabKey) => {
    setContentTab(tab);
  };

  return {
    isLoading,
    detailTab,
    onDetailTabChange,
    contentTab,
    onContentTabChange,
    chapterData: chapterData?.data || undefined
  };
};
