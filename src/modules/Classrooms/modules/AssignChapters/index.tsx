import { useEffect, useMemo, useState } from 'react';

import { EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';

import { TITLES } from 'utils/constants';
import { PAGE_LIMIT } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import { getAntDSortOrder, showToaster } from 'utils/functions';

import { chapterQueryKey } from 'services/chapter';
import { classroomHooks, classroomQueryKeys } from 'services/classroom';
import { IChapterListItem } from 'services/classroom/types';
import { manageStudentQueryKeys } from 'services/manageStudent';
import { teacherLearningQueryKey } from 'services/teacherLearning';

import HeaderToolbar from 'components/common/HeaderToolbar';
import Meta from 'components/common/Meta';
import RenderActionCell from 'components/common/RenderActionCell';
import { StatusTag } from 'components/common/StatusTag';
import { CHAPTER_TAG_COLOR } from 'components/common/StatusTag/types';
import { CommonTable } from 'components/common/Table';
import EmptyState from 'components/common/Table/EmptyState';

import { AssignChaptersWrapper } from './AssignChapters.styled';
import { useAssignChaptersTable } from './hooks/useAssignChaptersTable';

const AssignChapters = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { args, data, isLoading, isEmpty, handleTableChange } = useAssignChaptersTable(
    classroomId || ''
  );

  // Initialize selected rows with assigned chapters
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // Track original state to detect changes
  const [originalAssignedIds, setOriginalAssignedIds] = useState<Set<string>>(new Set());

  const { mutate: assignUnassignChapters, isPending: isSaving } =
    classroomHooks.useAssignUnassignChapters();

  // Update selected rows when data loads - select chapters that are already assigned
  useEffect(() => {
    if (data?.chapters) {
      const assignedChapters = data?.chapters
        ?.filter((chapter) => chapter?.status === 'assigned')
        ?.map((chapter) => chapter?.id);
      const originalAssignedChapters = data?.chapters
        ?.filter((chapter) => chapter?.status === 'assigned')
        ?.map((chapter) => String(chapter?.id));
      setSelectedRowKeys(assignedChapters);
      // Store original assigned IDs for comparison
      setOriginalAssignedIds(new Set(originalAssignedChapters));
    }
  }, [data?.chapters]);

  const handleSave = () => {
    if (!classroomId || !data?.chapters) return;

    // Find chapters that have changed status
    const changedChapters: Array<{ id: number; status: 'assigned' | 'unassigned' }> = [];

    data?.chapters?.forEach((chapter) => {
      const chapterId = String(chapter?.id);
      const wasAssigned = originalAssignedIds.has(chapterId);
      const isNowAssigned = selectedRowKeys?.includes(Number(chapterId));

      // Only include if status changed
      if (wasAssigned !== isNowAssigned) {
        changedChapters.push({
          id: chapter?.id,
          status: isNowAssigned ? 'assigned' : 'unassigned'
        });
      }
    });

    // Only call API if there are changes
    if (changedChapters?.length === 0) {
      navigate(ROUTES.classroom.view(classroomId));
      return;
    }

    assignUnassignChapters(
      {
        classroom_id: Number(classroomId),
        chapters: changedChapters
      },
      {
        onSuccess: (response) => {
          showToaster('success', response?.message || 'Chapters assigned/unassigned successfully');
          queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
          queryClient.invalidateQueries({ queryKey: manageStudentQueryKeys.all });
          queryClient.invalidateQueries({ queryKey: chapterQueryKey.all });
          queryClient.invalidateQueries({ queryKey: teacherLearningQueryKey.all });
          navigate(ROUTES.classroom.view(classroomId));
        },
        onError: (error) => {
          showToaster('error', error?.message || 'Failed to assign/unassign chapters');
        }
      }
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
    preserveSelectedRowKeys: true
  };

  const columns: ColumnsType<IChapterListItem> = useMemo(
    () => [
      {
        title: <div style={{ textAlign: 'center' }}>Chapter Name</div>,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(args?.sort_by, args?.sort_order, 'name'),
        render: (name: string) => <span style={{ fontWeight: 500 }}>{name || '-'}</span>
      },
      {
        title: 'Lessons',
        dataIndex: 'lesson_count',
        key: 'lesson_count',
        align: 'center',
        render: (lesson_count: number) => (
          <StatusTag
            color={CHAPTER_TAG_COLOR.LESSON}
            status={lesson_count > 0 ? lesson_count?.toString() : '0'}
          />
        )
      },
      {
        title: 'Skill Checks',
        dataIndex: 'activity_count',
        key: 'activity_count',
        align: 'center',
        render: (activity_count: number) => (
          <StatusTag
            color={CHAPTER_TAG_COLOR.ACTIVITY}
            status={activity_count > 0 ? activity_count?.toString() : '0'}
          />
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
          if (status === 'assigned') {
            return <StatusTag status="Assigned" color="#68A729" />;
          } else {
            return <StatusTag status="Unassigned" color="#FF4D4F" />;
          }
        }
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (_: any, record: IChapterListItem) => (
          <RenderActionCell>
            <Tooltip title="View Chapter">
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  navigate(ROUTES.chapter.viewChapter(record.id.toString()));
                }}
              />
            </Tooltip>
          </RenderActionCell>
        )
      }
    ],
    [args?.sort_by, args?.sort_order, navigate]
  );

  return (
    <>
      <Meta title={`${TITLES.COMMON} - Assign Chapters`} />
      <HeaderToolbar
        backBtn
        title="Assign Chapters"
        button={
          <Button type="primary" onClick={handleSave} loading={isSaving}>
            Save
          </Button>
        }
      />

      <AssignChaptersWrapper role="main">
        {/* <RenderSearchInput
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
        /> */}

        <div className="shadow-paper">
          <CommonTable
            bordered
            scroll={{ x: 'max-content' }}
            columns={columns}
            dataSource={data?.chapters || []}
            rowSelection={rowSelection}
            pagination={{
              current: args.page ?? PAGE_LIMIT.PAGE,
              pageSize: args.limit ?? PAGE_LIMIT.LIMIT,
              total: data?.total_records ?? 0
            }}
            onChange={handleTableChange}
            loading={isLoading}
            rowKey="id"
            emptyText={
              <EmptyState
                isEmpty={isEmpty}
                search={args.search}
                defaultDescription="No chapters available"
                searchDescription="No chapters found"
              />
            }
          />
        </div>
      </AssignChaptersWrapper>
    </>
  );
};

export default AssignChapters;
