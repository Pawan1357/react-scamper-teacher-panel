import { LearningDetailsRow, OverviewBody } from 'modules/TeacherLearning/TeacherLearning.styled';

import { formatDate } from 'utils/constants/day';

import { LabeledTitle } from 'components/common/LabeledTitle';
import { OverviewCard } from 'components/common/OverviewSection/OverviewSection.styled';

interface LearningDetailsCardProps {
  chapterName: string;
  totalActivities: number;
  chapterId: string;
  totalLessons: number;
  createdDate: string;
}

export const LearningDetailsCard: React.FC<LearningDetailsCardProps> = ({
  chapterName,
  totalActivities,
  totalLessons,
  createdDate
}) => {
  return (
    <OverviewCard bordered={false}>
      <OverviewBody>
        <h3 className="learning-details-title">Learning Details</h3>
        <LearningDetailsRow>
          <LabeledTitle label="Chapter" title={chapterName || '-'} />
          {/* <div className="detail-item">
            <span className="detail-label">Link</span>

            <Button
              disabled
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {}}
              className="view-link-btn"
            >
              View
            </Button>
          </div> */}

          <LabeledTitle label="Total Lessons" title={String(totalLessons) || '-'} />
          <LabeledTitle label="Total Skill Checks" title={String(totalActivities) || '-'} />
          <LabeledTitle label="Created Date" title={formatDate(createdDate, 'MM/DD/YY HH:mm')} />
        </LearningDetailsRow>
      </OverviewBody>
    </OverviewCard>
  );
};
