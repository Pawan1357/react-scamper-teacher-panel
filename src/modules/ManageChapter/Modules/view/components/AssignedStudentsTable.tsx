import { useMemo } from 'react';

import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { IMAGE_URL } from 'utils/constants';
import { formatDate } from 'utils/constants/day';
import { ImageTypeEnum, PAGE_LIMIT } from 'utils/constants/enum';
import { getAntDSortOrder } from 'utils/functions';

import { IChapterStudentListItem } from 'services/classroom/types';

import RenderActionCell from 'components/common/RenderActionCell';
import { StatusTag } from 'components/common/StatusTag';
import { STATUS_TAG_COLOR } from 'components/common/StatusTag/types';
import { CommonTable } from 'components/common/Table';
import EmptyState from 'components/common/Table/EmptyState';
import { ClassroomIcon } from 'components/svg';

import { AssignedStudentsTableWrapper } from '../ViewChapter.styled';
import { useChapterStudentsTable } from '../hooks/useChapterStudentsTable';

interface AssignedStudentsTableProps {
  chapterId: string;
}

export const AssignedStudentsTable: React.FC<AssignedStudentsTableProps> = ({ chapterId }) => {
  const { args, data, isLoading, isEmpty, handleTableChange } = useChapterStudentsTable(chapterId);

  const columns: ColumnsType<IChapterStudentListItem> = useMemo(
    () => [
      {
        title: 'Student',
        key: 'student',
        align: 'center',
        render: (_: any, record: IChapterStudentListItem) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar
              src={
                record?.profile_photo
                  ? `${IMAGE_URL}scamper/${ImageTypeEnum.STUDENT}/${record?.profile_photo}`
                  : null
              }
              size={40}
              style={{ flexShrink: 0 }}
            >
              {<UserOutlined />}
            </Avatar>
            <div style={{ textAlign: 'left', minWidth: 0 }}>
              <div style={{ fontWeight: 500, color: '#0f1b53', marginBottom: '4px' }}>
                {record?.first_name + ' ' + record?.last_name}{' '}
                {record?.google_student_id?.trim() && (
                  <span>
                    <ClassroomIcon />
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#6d7bad' }}>{record?.email || '-'}</div>
            </div>
          </div>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(args?.sort_by, args?.sort_order, 'status'),
        render: (status: string) => {
          if (status === 'completed' || status === 'complete') {
            return <StatusTag color={STATUS_TAG_COLOR.SUCCESS_PRIMARY} status="Completed" />;
          } else if (status === 'in_progress') {
            return <StatusTag color={STATUS_TAG_COLOR.WARNING} status="In progress" />;
          } else if (status === 'pending') {
            return <StatusTag color={STATUS_TAG_COLOR.DANGER} status="Pending" />;
          }
          return status || '-';
        }
      },
      {
        title: 'Updated At',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(args?.sort_by, args?.sort_order, 'updated_at'),
        render: (date: string) => (date ? formatDate(date, 'MM/DD/YY HH:mm') : '-')
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: () => (
          <RenderActionCell>
            <Tooltip title="View Student">
              <Button type="primary" size="small" icon={<EyeOutlined />} disabled />
            </Tooltip>
          </RenderActionCell>
        )
      }
    ],
    [args?.sort_by, args?.sort_order]
  );

  return (
    <AssignedStudentsTableWrapper>
      <CommonTable
        columns={columns}
        dataSource={data?.student_list || []}
        loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          current: args?.page ?? PAGE_LIMIT.PAGE,
          pageSize: args?.limit ?? PAGE_LIMIT.LIMIT,
          total: data?.total_records ?? 0
        }}
        rowKey="id"
        bordered={false}
        emptyText={
          <EmptyState
            isEmpty={isEmpty}
            search={args?.search}
            defaultDescription="No students assigned yet"
            searchDescription="No students found"
          />
        }
      />
    </AssignedStudentsTableWrapper>
  );
};
