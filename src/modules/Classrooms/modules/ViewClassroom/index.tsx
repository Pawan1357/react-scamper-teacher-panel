import { useEffect, useMemo, useState } from 'react';

import {
  CloseOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Input, Spin, Switch, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { IconWrapper } from 'style/Common/common';

import { IMAGE_URL, TITLES } from 'utils/constants';
import { formatDate } from 'utils/constants/day';
import { ImageTypeEnum, PAGE_LIMIT } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import { capitalizeFirst, getAntDSortOrder, showToaster } from 'utils/functions';

import { chapterQueryKey } from 'services/chapter';
import { classroomHooks, classroomQueryKeys } from 'services/classroom';
import { AssignedChapters, IStudentListItem } from 'services/classroom/types';
import { manageStudentHooks, manageStudentQueryKeys } from 'services/manageStudent';
import { teacherLearningQueryKey } from 'services/teacherLearning';

import HeaderToolbar from 'components/common/HeaderToolbar';
import { LabeledTitle } from 'components/common/LabeledTitle';
import Meta from 'components/common/Meta';
import ConfirmModal from 'components/common/Modal/components/ConfirmModal';
import RenderActionCell from 'components/common/RenderActionCell';
import { StatusTag } from 'components/common/StatusTag';
import { CHAPTER_TAG_COLOR, STATUS_TAG_COLOR } from 'components/common/StatusTag/types';
import { CommonTable } from 'components/common/Table';
import EmptyState from 'components/common/Table/EmptyState';
import { ClassroomIcon } from 'components/svg';

import {
  ActionButtonsWrapper,
  ChapterCardContent,
  ChapterCardHeader,
  ChapterDetailsCard,
  ChaptersSectionCard,
  SectionHeader,
  StudentsSectionCard,
  ViewClassroomWrapper
} from './ViewClassroom.styled';
import { useStudentTable } from './hooks/useStudentTable';

const { Text } = Typography;

const ViewClassroom = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [unAssignModalState, setUnAssignModalState] = useState({
    open: false,
    chapterId: ''
  });

  const [removeStudentModalState, setRemoveStudentModalState] = useState({
    open: false,
    studentId: ''
  });

  const [archiveModalState, setArchiveModalState] = useState({
    open: false
  });

  const {
    data: classroomData,
    isLoading,
    isError,
    error
  } = classroomHooks.useGetTeacherClassroomById(classroomId || '');

  const { mutate: mutateDeleteStudent, isPending: isDeleting } =
    manageStudentHooks.useDeleteStudent();

  const { mutate: toggleArchiveStatus, isPending: isArchivePending } =
    classroomHooks.useToggleArchiveStatus();

  const { mutate: assignUnassignChapters, isPending: isSaving } =
    classroomHooks.useAssignUnassignChapters();

  const { mutate: syncClassroom, isPending: isSyncPending } = classroomHooks.useSyncClassroom();

  const {
    args: studentArgs,
    data: studentsData,
    isLoading: isStudentsLoading,
    isEmpty: isStudentsEmpty,
    searchVal: studentSearchVal,
    handleSearchChange: handleStudentSearchChange,
    handleTableChange: handleStudentTableChange
  } = useStudentTable(classroomId || '');

  useEffect(() => {
    if (isError && error) {
      showToaster('error', error.message);
    }
  }, [isError, error]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#68A729';
      case 'archived':
        return '#FF0000';
      case 'unarchived':
        return '#68A729';
      case 'inactive':
        return '#FF0000';
      default:
        return 'default';
    }
  };

  // Chapters table columns
  const chaptersColumns: ColumnsType<AssignedChapters> = useMemo(
    () => [
      {
        title: 'Chapter',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (name: string) => <span style={{ fontWeight: 500 }}>{name || '-'}</span>
      },
      {
        title: 'Lessons',
        dataIndex: 'lesson_count',
        key: 'lesson_count',
        align: 'center',
        render: (val) => <StatusTag color={CHAPTER_TAG_COLOR.LESSON} status={val > 0 ? val : 0} />
      },
      {
        title: 'Skill Checks',
        dataIndex: 'activity_count',
        key: 'activity_count',
        align: 'center',
        render: (val) => <StatusTag color={CHAPTER_TAG_COLOR.ACTIVITY} status={val > 0 ? val : 0} />
      },
      {
        title: 'Assigned At',
        dataIndex: 'assigned_at',
        key: 'assigned_at',
        align: 'center',
        render: (date: string) => (date ? formatDate(date, 'MM/DD/YY HH:mm') : '-')
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (_, record) => (
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
            {classroomData?.data?.status == 'active' && (
              <Tooltip title="Unassign Chapter">
                <Button
                  type="primary"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setUnAssignModalState({ open: true, chapterId: record.id.toString() });
                  }}
                />
              </Tooltip>
            )}
          </RenderActionCell>
        )
      }
    ],
    [navigate, classroomData?.data?.status]
  );

  // Students table columns
  const studentsColumns: ColumnsType<IStudentListItem> = useMemo(
    () => [
      {
        title: <div style={{ textAlign: 'center' }}>Student</div>,
        key: 'student',
        render: (_: any, record: IStudentListItem) => (
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
        title: 'Jobs',
        dataIndex: 'jobs',
        key: 'jobs',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(studentArgs?.sort_by, studentArgs?.sort_order, 'jobs'),
        render: (jobs: number | string) => <span>{jobs || '-'}</span>
      },
      {
        title: 'Chapters',
        dataIndex: 'assigned_chapters',
        key: 'assigned_chapters',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(
          studentArgs?.sort_by,
          studentArgs?.sort_order,
          'assigned_chapters'
        ),
        render: (chapters: number) => <span>{chapters || 0}</span>
      },
      {
        title: 'Status',
        dataIndex: 'is_active',
        key: 'is_active',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(studentArgs?.sort_by, studentArgs?.sort_order, 'is_active'),
        render: (is_active: boolean) => {
          if (is_active) {
            return <StatusTag color={STATUS_TAG_COLOR.SUCCESS_PRIMARY} status="Active" />;
          } else {
            return <StatusTag color={STATUS_TAG_COLOR.DANGER} status="Inactive" />;
          }
        }
      },
      {
        title: 'Last logged in',
        dataIndex: 'last_login',
        key: 'last_login',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(studentArgs?.sort_by, studentArgs?.sort_order, 'last_login'),
        render: (date: string) => (date ? formatDate(date, 'MM/DD/YY HH:mm') : '-')
      },
      {
        title: 'Updated At',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(studentArgs?.sort_by, studentArgs?.sort_order, 'updated_at'),
        render: (date: string) => formatDate(date, 'MM/DD/YY HH:mm')
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (_, record) => (
          <RenderActionCell>
            <Tooltip title="View Student Details">
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  if (classroomId) {
                    navigate(ROUTES.classroom.viewStudent(classroomId, record.id.toString()));
                  }
                }}
              />
            </Tooltip>
            {classroomData?.data?.status == 'active' && (
              <Tooltip title="Remove Student">
                <Button
                  type="primary"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setRemoveStudentModalState({ open: true, studentId: record.id.toString() });
                  }}
                />
              </Tooltip>
            )}
          </RenderActionCell>
        )
      }
    ],
    [
      classroomId,
      navigate,
      studentArgs?.sort_by,
      studentArgs?.sort_order,
      classroomData?.data?.status
    ]
  );

  const deleteStudent = () => {
    const payload = {
      classroom_id: classroomId ? Number(classroomId) : 0,
      student_id: removeStudentModalState?.studentId
        ? Number(removeStudentModalState?.studentId)
        : 0
    };
    mutateDeleteStudent(payload, {
      onSuccess: (response) => {
        showToaster('success', response?.message || 'Contacts deleted successfully');
        queryClient.invalidateQueries({ queryKey: manageStudentQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
        setRemoveStudentModalState({ open: false, studentId: '' });
      },
      onError: (error) => {
        showToaster('error', error?.message || 'Failed to delete contacts');
      }
    });
  };

  const handleArchiveConfirm = () => {
    if (!classroomId) return;

    toggleArchiveStatus(classroomId, {
      onSuccess: (response) => {
        showToaster(
          'success',
          response?.message || 'Classroom archive status updated successfully'
        );
        queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
        setArchiveModalState({ open: false });
      },
      onError: (error) => {
        showToaster('error', error?.message || 'Failed to update classroom archive status');
      }
    });
  };

  const unassignedChapter = () => {
    assignUnassignChapters(
      {
        classroom_id: Number(classroomId),
        chapters: [
          {
            id: unAssignModalState?.chapterId ? Number(unAssignModalState.chapterId) : 0,
            status: 'unassigned'
          }
        ]
      },
      {
        onSuccess: (response) => {
          showToaster('success', response?.message || 'Chapters assigned/unassigned successfully');
          queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
          queryClient.invalidateQueries({ queryKey: manageStudentQueryKeys.all });
          queryClient.invalidateQueries({ queryKey: chapterQueryKey.all });
          queryClient.invalidateQueries({ queryKey: teacherLearningQueryKey.all });
          setUnAssignModalState({ open: false, chapterId: '' });
        },
        onError: (error) => {
          showToaster('error', error?.message || 'Failed to assign/unassign chapters');
        }
      }
    );
  };

  const handleArchiveClick = () => {
    setArchiveModalState({ open: true });
  };

  const handleSyncClick = () => {
    if (!classroomId) {
      showToaster('error', 'Classroom ID is required for syncing');
      return;
    }

    syncClassroom(
      { classroom_id: Number(classroomId) },
      {
        onSuccess: (response) => {
          showToaster('success', response?.message || 'Classroom synced successfully');
          queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
          queryClient.invalidateQueries({ queryKey: manageStudentQueryKeys.all });
        },
        onError: (error) => {
          showToaster('error', error?.message || 'Failed to sync classroom');
        }
      }
    );
  };

  const isArchived = classroomData?.data?.status === 'archived';

  return (
    <>
      <Meta title={`${TITLES.COMMON} - ${TITLES.CLASSROOM.VIEW}`} />
      <HeaderToolbar
        backBtn
        title={TITLES.CLASSROOM.VIEW}
        isMultipleBtn
        responsive
        button={
          <ActionButtonsWrapper>
            <Button
              type="primary"
              shape="round"
              onClick={() => navigate(ROUTES.classroom.studentProgress(classroomId || ''))}
            >
              Student Progress
            </Button>
            {classroomData?.data?.add_via === 'google' && (
              <Button
                type="primary"
                shape="round"
                icon={<SyncOutlined />}
                onClick={handleSyncClick}
                loading={isSyncPending}
                disabled={isSyncPending}
              >
                Sync
              </Button>
            )}
            <Button type="primary" shape="round" onClick={handleArchiveClick}>
              {isArchived ? 'Unarchive' : 'Archive'}
            </Button>
          </ActionButtonsWrapper>
        }
      />

      <ViewClassroomWrapper role="main">
        {/* Top Section: Classroom Details and Chapters */}
        <div className="w-100 top-section-wrapper">
          {/* Left Panel: Classroom Details */}
          <div className="left-section">
            <ChapterDetailsCard
              className="shadow-paper"
              style={{ position: 'relative', minHeight: '300px' }}
            >
              {isLoading ? (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                >
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <ChapterCardHeader>
                    <div className="chapter-title-section">
                      <h3 className="chapter-title">{classroomData?.data?.name || '-'}</h3>
                    </div>
                  </ChapterCardHeader>

                  <ChapterCardContent isEconomy={classroomData?.data?.economy ?? false}>
                    <LabeledTitle
                      label="Students"
                      title={String(classroomData?.data?.classroom_students?.length ?? 0)}
                    />
                    <LabeledTitle
                      label="Assigned Chapters"
                      title={String(classroomData?.data?.assigned_chapters?.length || 0)}
                    />
                    <LabeledTitle label="Classroom Economy">
                      <Switch
                        className="classroom-economy-switch"
                        checked={classroomData?.data?.economy ?? false}
                        disabled
                        size="small"
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                      />
                    </LabeledTitle>
                    <LabeledTitle
                      label="Created From"
                      title={
                        classroomData?.data?.add_via
                          ? String(capitalizeFirst(classroomData?.data?.add_via))
                          : '-'
                      }
                    />
                    <LabeledTitle
                      label="Status"
                      tag={
                        classroomData?.data?.status
                          ? String(
                              capitalizeFirst(
                                classroomData?.data?.status === 'active' ? 'active' : 'archived'
                              )
                            )
                          : '-'
                      }
                      tagBgColor={
                        classroomData?.data?.status
                          ? String(getStatusColor(classroomData?.data?.status))
                          : ''
                      }
                    />
                    <LabeledTitle
                      label="Updated On"
                      title={
                        classroomData?.data?.updated_at
                          ? formatDate(classroomData?.data?.updated_at, 'MM/DD/YY HH:mm')
                          : '-'
                      }
                    />
                  </ChapterCardContent>
                </>
              )}
            </ChapterDetailsCard>
          </div>
          {/* Right Panel: Chapters */}
          <div className="right-section">
            <ChaptersSectionCard className="shadow-paper mt-0-imp">
              <SectionHeader>
                <h3>Chapters</h3>
                {classroomData?.data?.status == 'active' && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      if (classroomId) {
                        navigate(ROUTES.classroom.assignChapters(classroomId));
                      }
                    }}
                  >
                    Assign Chapter
                  </Button>
                )}
              </SectionHeader>
              <CommonTable
                bordered
                scroll={{ x: 'max-content' }}
                columns={chaptersColumns}
                dataSource={classroomData?.data?.assigned_chapters || []}
                pagination={false}
                loading={isLoading}
                rowKey="id"
                emptyText={
                  <EmptyState
                    className="pb-0-imp pt-0-imp"
                    isEmpty={true}
                    defaultDescription="No chapters assigned"
                  />
                }
              />
            </ChaptersSectionCard>
          </div>
        </div>

        {/* Students Section */}
        <StudentsSectionCard className="shadow-paper">
          <SectionHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <Text style={{ fontSize: '18px', fontWeight: 600 }}>Students</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Input
                placeholder="Search"
                value={studentSearchVal}
                onChange={handleStudentSearchChange}
                prefix={
                  <IconWrapper>
                    <SearchOutlined />
                  </IconWrapper>
                }
                style={{ maxWidth: '300px' }}
              />
              {classroomData?.data?.status == 'active' && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    if (classroomId) {
                      navigate(ROUTES.classroom.addStudent(classroomId));
                    }
                  }}
                >
                  Add Student
                </Button>
              )}
            </div>
          </SectionHeader>
          <CommonTable
            bordered
            scroll={{ x: 'max-content' }}
            columns={studentsColumns}
            dataSource={studentsData?.student_list || []}
            pagination={{
              current: studentArgs?.page ?? PAGE_LIMIT.PAGE,
              pageSize: studentArgs?.limit ?? PAGE_LIMIT.LIMIT,
              total: studentsData?.total_records ?? 0
            }}
            onChange={handleStudentTableChange}
            loading={isStudentsLoading}
            emptyText={
              <EmptyState
                isEmpty={isStudentsEmpty}
                search={studentArgs.search}
                defaultDescription="No students found"
                searchDescription="No students found"
              />
            }
          />
        </StudentsSectionCard>
      </ViewClassroomWrapper>

      <ConfirmModal
        modalProps={{
          open: unAssignModalState.open,
          onOpenChange: (open) => !open && setUnAssignModalState({ open: false, chapterId: '' }),
          question: `Are you sure you want to unassign this chapter?`,
          description: `This chapter will be unassigned to all students.`,
          onOk: unassignedChapter,
          onCancel: () => setUnAssignModalState({ open: false, chapterId: '' }),
          cancelText: 'No',
          okText: 'Yes',
          okButtonProps: { loading: isSaving, disabled: isSaving },
          cancelButtonProps: { disabled: isSaving }
        }}
      />
      <ConfirmModal
        modalProps={{
          open: removeStudentModalState.open,
          onOpenChange: (open) =>
            !open && setRemoveStudentModalState({ open: false, studentId: '' }),
          question: `Are you sure you want to remove this student?`,
          description: `If the student is removed, all of the assigned chapters in that classroom will also be revoked.`,
          onOk: deleteStudent,
          onCancel: () => setRemoveStudentModalState({ open: false, studentId: '' }),
          cancelText: 'No',
          okText: 'Yes',
          okButtonProps: { loading: isDeleting, disabled: isDeleting },
          cancelButtonProps: { disabled: isDeleting }
        }}
      />
      <ConfirmModal
        modalProps={{
          open: archiveModalState.open,
          onOpenChange: (open) => !open && setArchiveModalState({ open: false }),
          question: `Are you sure you want to ${
            isArchived ? 'unarchive' : 'archive'
          } this classroom?`,
          description: `This classroom will be ${isArchived ? 'unarchived' : 'archived'}.`,
          onOk: handleArchiveConfirm,
          onCancel: () => setArchiveModalState({ open: false }),
          cancelText: 'No',
          okText: 'Yes',
          okButtonProps: { loading: isArchivePending, disabled: isArchivePending },
          cancelButtonProps: { disabled: isArchivePending }
        }}
      />
    </>
  );
};

export default ViewClassroom;
