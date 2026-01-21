import { Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from 'utils/constants/routes';

import { STATUS_TAG_COLOR } from 'components/common/StatusTag/types';
import { CommonTable } from 'components/common/Table';

import { ActivityTableWrapper } from './ActivityTable.styled';

interface ActivityTableProps {
  activities: any;
  teacherLearningId?: string;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ activities, teacherLearningId }) => {
  const navigate = useNavigate();

  const handleStartActivity = (activityId: number, status: string) => {
    if (teacherLearningId) {
      navigate(
        ROUTES.teacherLearning.viewTLActivity({
          teacherLearningId,
          activityId: String(activityId)
        }),
        {
          state: { activityStatus: status }
        }
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return '#FCB21D';
      case 'pending':
        return STATUS_TAG_COLOR.DANGER;
      case 'completed':
        return '#68A729';
      default:
        return 'default';
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In progress';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  const getTitleFromStatus = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'Resume Skill Check';
      case 'pending':
        return 'Start Skill Check';
      case 'completed':
        return 'View Skill Check';
      default:
        return 'View Skill Check';
    }
  };

  const columns = [
    {
      title: 'Skill Check Title',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name || '-'}</span>
    },

    {
      title: 'Score',
      key: 'score',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <span>
            {record?.total_questions > 0
              ? `${record?.correct_answers}/${record?.total_questions}`
              : '-'}
          </span>
        );
      }
    },
    {
      title: 'Total Questions',
      key: 'total_questions',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record?.total_questions > 0 ? record?.total_questions : '-'}</span>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => (
        <Tag
          style={{
            color: '#ffffff',
            borderRadius: '11px',
            padding: '1px 8px',
            backgroundColor: getStatusColor(status)
          }}
        >
          {status ? getStatusTitle(status) : '-'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_: any, record: any) => (
        <Button
          className="learning-action-btn"
          type="primary"
          size="small"
          onClick={() => handleStartActivity(record.id, record?.status)}
        >
          {getTitleFromStatus(record?.status)}
        </Button>
      )
    }
  ];

  return (
    <ActivityTableWrapper>
      <CommonTable
        columns={columns as ColumnsType<any>}
        dataSource={activities}
        rowKey="id"
        pagination={false}
        bordered={false}
      />
    </ActivityTableWrapper>
  );
};
