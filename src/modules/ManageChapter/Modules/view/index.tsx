import { useMemo } from 'react';

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

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
import type { AssignedStudentData } from './types';

const ViewChapterPage: React.FC = () => {
  const { isLoading, detailTab, onDetailTabChange, contentTab, onContentTabChange, chapterData } =
    useViewChapter();

  // Mock data for assigned students - TODO: Replace with actual API call
  const assignedStudents: AssignedStudentData[] = useMemo(
    () => [
      {
        id: '1',
        student_id: 'HBK1006',
        name: 'Dori Doreau',
        email: 'dori01@gmail.com',
        status: 'Complete',
        updated_at: '2024-04-18T15:00:00Z'
      },
      {
        id: '2',
        student_id: 'HBK1007',
        name: 'B.A. Baracus',
        email: 'byron.b@gmail.com',
        status: 'Complete',
        updated_at: '2024-04-17T17:30:00Z'
      },
      {
        id: '3',
        student_id: 'HBK1008',
        name: 'Devon Miles',
        email: 'devon.m@gmail.com',
        status: 'Complete',
        updated_at: '2024-04-16T10:00:00Z'
      },
      {
        id: '4',
        student_id: 'HBK1009',
        name: 'Peter Thornton',
        email: 'peter.t@gmail.com',
        status: 'Complete',
        updated_at: '2024-04-15T14:20:00Z'
      },
      {
        id: '5',
        student_id: 'HBK1010',
        name: 'Sledge Hammer',
        email: 'sledge.h@gmail.com',
        status: 'Complete',
        updated_at: '2024-04-14T09:15:00Z'
      },
      {
        id: '6',
        student_id: 'HBK1011',
        name: 'Thomas Magnum',
        email: 'thomas.m@gmail.com',
        status: 'Complete',
        updated_at: '2024-04-13T16:30:00Z'
      },
      {
        id: '7',
        student_id: 'HBK1012',
        name: 'Bonnie Barstow',
        email: 'bonnie.b@gmail.com',
        status: 'Complete',
        updated_at: '2024-04-12T11:45:00Z'
      },
      {
        id: '8',
        student_id: 'HBK1013',
        name: 'Rick Wright',
        email: 'rick.w@gmail.com',
        status: 'Pending',
        updated_at: '2024-04-11T13:20:00Z'
      },
      {
        id: '9',
        student_id: 'HBK1014',
        name: 'T.C. Calvin',
        email: 'tc.c@gmail.com',
        status: 'Pending',
        updated_at: '2024-04-10T08:10:00Z'
      },
      {
        id: '10',
        student_id: 'HBK1015',
        name: 'Higgins',
        email: 'higgins@gmail.com',
        status: 'Pending',
        updated_at: '2024-04-09T10:00:00Z'
      }
    ],
    []
  );

  const handleViewStudent = (studentId: string) => {
    // TODO: Implement navigation to student detail page
    console.log('View student:', studentId);
  };

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
      children: (
        <AssignedStudentsTable students={assignedStudents} onViewStudent={handleViewStudent} />
      )
    }
  ];

  if (isLoading) return <Loader />;

  return (
    <>
      <Meta title={`${TITLES.COMMON} - ${TITLES.CLASSROOM.VIEW_CHAPTER}`} />
      <HeaderToolbar title={TITLES.CLASSROOM.VIEW_CHAPTER} isMultipleBtn backBtn />

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
