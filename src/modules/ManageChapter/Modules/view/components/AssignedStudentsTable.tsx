import { useMemo } from 'react';

import { EyeOutlined } from '@ant-design/icons';
import { Avatar, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { formatDate } from 'utils/constants/day';

import RenderActionCell from 'components/common/RenderActionCell';
import { StatusTag } from 'components/common/StatusTag';
import { STATUS_TAG_COLOR } from 'components/common/StatusTag/types';
import { CommonTable } from 'components/common/Table';

import { AssignedStudentsTableWrapper } from '../ViewChapter.styled';
import type { AssignedStudentData } from '../types';

interface AssignedStudentsTableProps {
  students?: AssignedStudentData[];
  loading?: boolean;
  onViewStudent?: (studentId: string) => void;
}

export const AssignedStudentsTable: React.FC<AssignedStudentsTableProps> = ({
  students = [],
  loading = false,
  onViewStudent
}) => {
  const columns: ColumnsType<AssignedStudentData> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'student_id',
        key: 'student_id',
        align: 'center',
        sorter: true,
        render: (id: string) => <span>{id || '-'}</span>
      },
      {
        title: 'Student',
        key: 'student',
        align: 'center',
        render: (_: any, record: AssignedStudentData) => (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}
          >
            <Avatar src={record.avatar} size={40} style={{ flexShrink: 0 }}>
              {record.name?.charAt(0)?.toUpperCase() || 'S'}
            </Avatar>
            <div style={{ textAlign: 'left', minWidth: 0 }}>
              <div style={{ fontWeight: 500, color: '#0f1b53', marginBottom: '4px' }}>
                {record.name || '-'}
              </div>
              <div style={{ fontSize: '12px', color: '#6d7bad' }}>{record.email || '-'}</div>
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
        render: (status: string) => {
          if (status === 'Complete') {
            return <StatusTag color={STATUS_TAG_COLOR.SUCCESS_PRIMARY} status="Complete" />;
          } else if (status === 'Pending') {
            return <StatusTag color="#FA751C" status="Pending" />;
          }
          return <StatusTag color={STATUS_TAG_COLOR.GRAY} status={status || '-'} />;
        }
      },
      {
        title: 'Updated At',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center',
        sorter: true,
        render: (date: string) => (date ? formatDate(date, 'MM/DD/YY HH:mm') : '-')
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (_: any, record: AssignedStudentData) => (
          <RenderActionCell>
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewStudent?.(record.id)}
            />
          </RenderActionCell>
        )
      }
    ],
    [onViewStudent]
  );

  return (
    <AssignedStudentsTableWrapper>
      <CommonTable
        columns={columns}
        dataSource={students}
        loading={loading}
        pagination={{
          current: 1,
          pageSize: 10,
          total: students.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} items`
        }}
        rowKey="id"
        bordered={false}
      />
    </AssignedStudentsTableWrapper>
  );
};
