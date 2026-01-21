import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import { LessonTabsWrapper } from './LessonTabs.styled';

interface LessonTabsProps {
  lessons: {
    id: number;
    name: string;
    description: string;
    sequence: number;
  }[];
  activeLessonId?: number;
  onLessonChange: (lessonId: number) => void;
}

export const LessonTabs: React.FC<LessonTabsProps> = ({
  lessons,
  activeLessonId,
  onLessonChange
}) => {
  const handleTabChange = (key: string) => {
    const lessonId = parseInt(key, 10);
    if (!isNaN(lessonId)) {
      onLessonChange(lessonId);
    }
  };

  const tabItems: TabsProps['items'] = lessons.map((lesson) => ({
    key: String(lesson.id),
    label: `Lesson ${lesson.sequence}`
  }));

  return (
    <LessonTabsWrapper>
      <Tabs
        activeKey={activeLessonId ? String(activeLessonId) : undefined}
        items={tabItems}
        onChange={handleTabChange}
      />
    </LessonTabsWrapper>
  );
};
