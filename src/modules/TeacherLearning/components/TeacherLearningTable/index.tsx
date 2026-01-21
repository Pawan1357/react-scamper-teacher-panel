import { useMemo } from 'react';

import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTeacherLearning } from 'modules/TeacherLearning/hooks/useTeacherLearning';
import { useNavigate } from 'react-router-dom';

import { INPUTS } from 'utils/constants';
import { ROUTES } from 'utils/constants/routes';

import { TeacherLearningList } from 'services/teacherLearning/types';

import { RenderSearchInput } from 'components/common/FormField';
import RenderActionCell from 'components/common/RenderActionCell';
import { STATUS_TAG_COLOR } from 'components/common/StatusTag/types';
import { CommonTable } from 'components/common/Table';
import EmptyState from 'components/common/Table/EmptyState';
import { TruncatedTextWithTooltip } from 'components/common/TruncatedTextWithTooltip';

import { IconWrapper } from './style';

const TeacherLearningTable = () => {
  const navigate = useNavigate();
  const {
    args,
    searchVal,
    totalRecords,
    teacherLearningList,
    isLoading,
    isEmpty,
    handleSearchChange,
    handleTableChange
  } = useTeacherLearning();

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
  const columns = useMemo(
    () => [
      {
        title: <div style={{ textAlign: 'center' }}>Chapter</div>,
        dataIndex: 'chapter_name',
        key: 'chapter_name',
        align: 'center',
        render: (name: string) => <TruncatedTextWithTooltip text={name || '-'} maxLength={40} />
      },
      {
        title: 'Lessons',
        dataIndex: 'lesson_count',
        align: 'center',
        render: (val: number) => (val > 0 ? val.toString() : '0')
      },
      {
        title: 'Skill Checks',
        dataIndex: 'activity_count',
        align: 'center',
        render: (val: number) => (val > 0 ? val.toString() : '0')
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
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
        title: 'Score',
        dataIndex: 'score',
        align: 'center',
        render: (_: any, record: TeacherLearningList) =>
          `${record?.correct_question || 0}/${record?.total_question || 0}`
      },
      {
        title: 'Action',
        key: 'actions',
        align: 'center',
        render: (record: any) => {
          return (
            <RenderActionCell>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  navigate(
                    ROUTES.teacherLearning.viewTeacherLearning({ teacherLearningId: record.id })
                  );
                }}
              />
            </RenderActionCell>
          );
        }
      }
    ],
    [args?.sort_by, args?.sort_order, navigate]
  );

  return (
    <>
      <RenderSearchInput
        inputProps={{
          value: searchVal,
          size: 'large',
          onChange: handleSearchChange,
          placeholder: INPUTS.PLACEHOLDER.SEARCH,
          prefix: (
            <IconWrapper>
              <SearchOutlined />
            </IconWrapper>
          )
        }}
      />

      <div className="shadow-paper">
        <CommonTable
          bordered
          scroll={{ x: 'max-content' }}
          columns={columns as ColumnsType<any>}
          dataSource={teacherLearningList}
          pagination={{
            current: args.page,
            pageSize: args.limit,
            total: totalRecords
          }}
          onChange={handleTableChange}
          loading={isLoading}
          emptyText={
            <EmptyState
              isEmpty={isEmpty}
              search={args.search}
              defaultDescription="No Teacher Learnings available"
              searchDescription="No Teacher Learning Found"
            />
          }
        />
      </div>
    </>
  );
};

export default TeacherLearningTable;
