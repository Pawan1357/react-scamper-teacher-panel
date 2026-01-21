import { useState } from 'react';

import type { TabsProps } from 'antd';
import { Carousel, Divider, Empty, Tabs } from 'antd';
import { useParams } from 'react-router-dom';

import { TITLES } from 'utils/constants';
import { ImageTypeEnum } from 'utils/constants/enum';

import { ActivityTable } from './components/ActivityTable';
import { ContentTabsWrapper, HiddenHeading } from './components/ContentTabsSection.styled';
import { LearningDetailsCard } from './components/LearningDetailsCard';
import { LessonContentSection } from './components/LessonContentSection';
import { LessonTabs } from './components/LessonTabs';
import { ContentSection } from './components/ViewTeacherLearning.styled';
import HeaderToolbar from 'components/common/HeaderToolbar';
import { Loader } from 'components/common/Loader';
import CommonMedia from 'components/common/Media/CommonMedia';
import { defaultCarouselSettings } from 'components/common/Media/carouselSettings';
import Meta from 'components/common/Meta';

import { LessonListWrapper } from '../TeacherLearning.styled';
import { useViewTeacherLearning } from './hooks/useViewTeacherLearning';

const ViewTeacherLearning: React.FC = () => {
  const { teacherLearningId, chapterId } = useParams<{
    teacherLearningId: string;
    chapterId: string;
  }>();
  const {
    isLoading,

    chapterData,
    lessons,
    selectedLessonId,
    onLessonChange,
    lessonData,
    activities,
    isLessonDataLoading,
    totalLessons,
    totalActivities
  } = useViewTeacherLearning();

  const [contentTab, setContentTab] = useState<
    'activities' | 'imagesVideos' | 'downloadableContent'
  >('activities');

  const handleContentTabChange: TabsProps['onChange'] = (key) => {
    if (key === 'activities' || key === 'imagesVideos' || key === 'downloadableContent') {
      setContentTab(key);
    }
  };

  const getMediaUrlName = () => {
    return ImageTypeEnum.TL_LESSON;
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Meta title={`${TITLES.COMMON} - ${TITLES.TEACHER_LEARNING.VIEW_TEACHER_LEARNING_DETAILS}`} />
      <HeaderToolbar
        title={TITLES.TEACHER_LEARNING.VIEW_TEACHER_LEARNING_DETAILS}
        isMultipleBtn
        backBtn
      />

      <ContentSection role="main">
        <LearningDetailsCard
          chapterName={chapterData?.name || ''}
          chapterId={chapterId as string}
          totalActivities={totalActivities}
          totalLessons={totalLessons}
          createdDate={chapterData?.created_at || ''}
        />

        {lessons.length > 0 && (
          <LessonListWrapper className="shadow-paper">
            <LessonTabs
              lessons={lessons}
              activeLessonId={selectedLessonId || undefined}
              onLessonChange={onLessonChange}
            />

            {isLessonDataLoading ? (
              <Loader />
            ) : (
              <>
                <LessonContentSection lesson={lessonData} />

                <Divider className="m-0-imp" />

                <ContentTabsWrapper>
                  <HiddenHeading id="content-tabs">Content tabs</HiddenHeading>
                  <Tabs
                    animated
                    aria-labelledby="content-tabs"
                    activeKey={contentTab}
                    items={[
                      {
                        key: 'activities',
                        label: 'Skill Check',
                        children: (
                          <section aria-label="Activities list">
                            <ActivityTable
                              activities={activities}
                              teacherLearningId={teacherLearningId}
                            />
                          </section>
                        )
                      },
                      {
                        key: 'imagesVideos',
                        label: 'Images and Videos',
                        children:
                          lessonData?.media && lessonData.media.length > 0 ? (
                            <CommonMedia
                              mode="gallery"
                              urlName={getMediaUrlName()}
                              Carousel={Carousel}
                              data={lessonData.media}
                              itemsPerSlide={4}
                              carouselSettings={defaultCarouselSettings}
                            />
                          ) : (
                            <Empty description="No media available" />
                          )
                      },
                      {
                        key: 'downloadableContent',
                        label: 'Downloadable Content',
                        children:
                          lessonData?.downloadable_content &&
                          lessonData.downloadable_content.length > 0 ? (
                            <CommonMedia
                              mode="resources"
                              urlName={getMediaUrlName()}
                              Carousel={Carousel}
                              data={
                                lessonData.downloadable_content.filter(
                                  (val: any) => val?.is_downloadable
                                ) || []
                              }
                              itemsPerSlide={4}
                              carouselSettings={defaultCarouselSettings}
                            />
                          ) : (
                            <Empty description="No downloadable content available" />
                          )
                      }
                    ]}
                    onChange={handleContentTabChange}
                  />
                </ContentTabsWrapper>
              </>
            )}
          </LessonListWrapper>
        )}
      </ContentSection>
    </>
  );
};

export default ViewTeacherLearning;
