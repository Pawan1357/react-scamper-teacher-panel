import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useParams } from 'react-router-dom';

import { TITLES } from 'utils/constants';

import { AssignedStudentsTable } from './components/AssignedStudentsTable';
import { ContentTabsSection } from './components/ContentTabsSection';
import { OverviewSection } from './components/OverviewSection';
import HeaderToolbar from 'components/common/HeaderToolbar';
import { Loader } from 'components/common/Loader';
import Meta from 'components/common/Meta';

import {
  ContentSection,
  DetailTabsWrapper,
  HiddenHeading,
  OverviewTabContent
} from './ViewChapter.styled';
import { useViewChapter } from './hooks/useViewChapter';

const ViewChapterPage: React.FC = () => {
  const { isLoading, detailTab, onDetailTabChange, contentTab, onContentTabChange, chapterData } =
    useViewChapter();
  const { chapterId } = useParams<{ chapterId: string }>();

  const handleTabChange: TabsProps['onChange'] = (key) => {
    if (key === 'overview' || key === 'assigned') {
      onDetailTabChange(key);
    }
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <OverviewTabContent>
          <OverviewSection overview={chapterData} />
          <ContentTabsSection
            activeTab={contentTab}
            onTabChange={onContentTabChange}
            lessons={chapterData?.lessons || []}
            gallery={chapterData?.media || []}
            resources={chapterData?.downloadable_content || []}
            rubrics={chapterData?.rubrics || []}
          />
        </OverviewTabContent>
      )
    },
    {
      key: 'assigned',
      label: 'Assigned Students',
      children: <AssignedStudentsTable chapterId={chapterId || ''} />
    }
  ];

  if (isLoading) return <Loader />;

  return (
    <>
      <Meta title={`${TITLES.COMMON} - ${TITLES.CHAPTER.VIEW_CHAPTER}`} />
      <HeaderToolbar title={TITLES.CHAPTER.VIEW_CHAPTER} isMultipleBtn backBtn />

      <ContentSection role="main">
        <DetailTabsWrapper>
          <HiddenHeading id="chapter-detail-tabs">Chapter detail tabs</HiddenHeading>
          <Tabs
            animated
            aria-labelledby="chapter-detail-tabs"
            activeKey={detailTab}
            items={tabItems}
            onChange={handleTabChange}
          />
        </DetailTabsWrapper>
      </ContentSection>
    </>
  );
};

export default ViewChapterPage;
