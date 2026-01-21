import { Activity } from 'services/teacherLearning/types';

import { IDownloadableContentItem, IMedia } from 'components/common/Media/types';

import { LessonTextContent } from './LessonContentSection.styled';

interface LessonContentSectionProps {
  lesson: {
    id: number;
    chapter_id: number;
    name: string;
    description: string;
    sequence: number;
    is_active: boolean;
    is_deleted: boolean;
    is_published: boolean;
    publish_date: any;
    created_at: string;
    updated_at: string;
    activities: Activity[];
    media: IMedia[];
    downloadable_content: IDownloadableContentItem[];
  } | null;
}

export const LessonContentSection: React.FC<LessonContentSectionProps> = ({ lesson }) => {
  if (!lesson) {
    return null;
  }

  return (
    <LessonTextContent>
      <h3 className="lesson-title">{lesson.name || ''}</h3>
      <div
        className="lesson-description tiptap-content-view"
        dangerouslySetInnerHTML={{ __html: lesson.description || '' }}
      />
    </LessonTextContent>
  );
};
