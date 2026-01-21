import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import { HiddenHeading, LessonBody, LessonCard } from '../Lesson.styled';
import type { OverviewSectionProps } from '../types';

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  detailTab,
  onDetailTabChange,
  lesson,
  showTeacherGuidelines = true
}) => {
  const handleTabChange: TabsProps['onChange'] = (key) => {
    if (key === 'overview' || key === 'teacherGuidelines') {
      onDetailTabChange(key);
    }
  };

  const hasTeacherGuidelines = showTeacherGuidelines && lesson?.teacher_guidelines;

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <LessonBody>
          <h2>{lesson?.name || '-'}</h2>
          <p
            className="tiptap-content-view"
            dangerouslySetInnerHTML={{ __html: lesson?.description || '' }}
          />
        </LessonBody>
      )
    },
    ...(hasTeacherGuidelines
      ? [
          {
            key: 'teacherGuidelines',
            label: 'Teacher Guidelines',
            children: (
              <LessonBody>
                <h2>{lesson?.teacher_guidelines?.title || ''}</h2>
                <p
                  className="tiptap-content-view"
                  dangerouslySetInnerHTML={{
                    __html: lesson?.teacher_guidelines?.description || ''
                  }}
                />
              </LessonBody>
            )
          }
        ]
      : [])
  ];

  return (
    <LessonCard bordered={false}>
      <HiddenHeading id="lesson-detail-tabs">Lesson detail tabs</HiddenHeading>
      <Tabs
        animated
        aria-labelledby="lesson-detail-tabs"
        activeKey={detailTab}
        items={tabItems}
        onChange={handleTabChange}
      />
    </LessonCard>
  );
};
