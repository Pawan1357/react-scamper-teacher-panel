import { useEffect, useMemo, useState } from 'react';

import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Image, Tabs, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';

import { IMAGE_URL, TITLES } from 'utils/constants';
import { formatDate } from 'utils/constants/day';
import { ImageTypeEnum } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import { capitalizeFirst, showToaster } from 'utils/functions';

import { classroomHooks } from 'services/classroom';
import { manageStudentHooks } from 'services/manageStudent';
import {
  Creator,
  StudentAssignedChapters,
  StudentAssignedClassroom
} from 'services/manageStudent/types';

import HeaderToolbar from 'components/common/HeaderToolbar';
import { Loader } from 'components/common/Loader';
import Meta from 'components/common/Meta';
import RenderActionCell from 'components/common/RenderActionCell';
import { StatusTag } from 'components/common/StatusTag';
import { STATUS_TAG_COLOR } from 'components/common/StatusTag/types';
import { CommonTable } from 'components/common/Table';
import EmptyState from 'components/common/Table/EmptyState';
import { ClassroomViewIcon } from 'components/svg';

import {
  ActionButtonsWrapper,
  ChapterProgressCard,
  ClassroomSectionCard,
  ProfileInfoText,
  ProfileName,
  ProfileWrapper,
  TableCellText,
  TopSectionWrapper,
  UserEmail,
  UserInfoContent,
  UserInfoWrapper,
  UserName,
  ViewStudentWrapper
} from './ViewStudent.styled';

const ViewStudent = () => {
  const navigate = useNavigate();
  const { classroomId, studentId } = useParams<{ classroomId: string; studentId: string }>();
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    data: studentData,
    isLoading,
    isError,
    error
  } = manageStudentHooks.useGetStudentById(studentId || '');

  const { data: classroomData } = classroomHooks.useGetTeacherClassroomById(classroomId || '');

  useEffect(() => {
    if (isError) {
      showToaster('error', error?.message);
    }
  }, [error?.message, isError]);

  // Use mock student data if API data is not available
  const student = useMemo(() => {
    if (studentData?.data) {
      return studentData.data;
    }
  }, [studentData]);

  const fullName = useMemo(() => {
    return `${student?.first_name || ''} ${student?.last_name || ''}`.trim();
  }, [student]);

  const profilePhotoUrl = useMemo(() => {
    if (!student?.profile_photo) return undefined;
    return `${IMAGE_URL}scamper/${ImageTypeEnum.STUDENT}/${student?.profile_photo}`;
  }, [student]);

  // Transform classrooms data - using mock data for now
  const classroomsData = useMemo<StudentAssignedClassroom[]>(() => {
    // Use API data if available, otherwise use mock data
    if (
      studentData?.data?.assigned_classrooms &&
      studentData?.data?.assigned_classrooms?.length > 0
    ) {
      return studentData?.data?.assigned_classrooms;
    }
    return [];
  }, [studentData?.data?.assigned_classrooms]);

  // Transform chapters data - using mock data for now
  const chaptersData = useMemo<StudentAssignedChapters[]>(() => {
    // Use API data if available, otherwise use mock data
    if (studentData?.data?.assigned_chapters && studentData?.data?.assigned_chapters?.length > 0) {
      return studentData?.data?.assigned_chapters;
    }
    return [];
  }, [studentData?.data?.assigned_chapters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#68A729';
      case 'archived':
        return '#FF0000';
      case 'unarchived':
        return '#FF0000';
      case 'inactive':
        return '#FF0000';
      default:
        return 'default';
    }
  };

  // Classrooms table columns
  const classroomsColumns: ColumnsType<StudentAssignedClassroom> = useMemo(
    () => [
      {
        title: 'Classroom',
        dataIndex: 'classroom_name',
        key: 'classroom_name',
        align: 'center',
        render: (name: string) => <TableCellText>{name || '-'}</TableCellText>
      },
      {
        title: <div style={{ textAlign: 'center' }}>Creator</div>,
        key: 'creator',
        dataIndex: 'creator',
        render: (record: Creator) => {
          const creator = record;
          const creatorName = `${creator?.first_name || ''} ${creator?.last_name || ''}`.trim();
          const creatorPhoto = creator?.profile_photo
            ? `${IMAGE_URL}scamper/${ImageTypeEnum.TEACHER}/${creator.profile_photo}`
            : undefined;

          return (
            <UserInfoWrapper>
              <Avatar src={creatorPhoto} size={32}>
                <UserOutlined />
              </Avatar>
              <UserInfoContent>
                <UserName>{creatorName || '-'}</UserName>
                <UserEmail>{creator?.email || '-'}</UserEmail>
              </UserInfoContent>
            </UserInfoWrapper>
          );
        }
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
              marginRight: '0',
              backgroundColor: getStatusColor(status)
            }}
          >
            {status ? capitalizeFirst(status === 'active' ? 'Active' : 'archived') : '-'}
          </Tag>
        )
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (_, record: StudentAssignedClassroom) => (
          <RenderActionCell>
            <Tooltip title="View Classroom">
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  navigate(ROUTES.classroom.view(String(record?.classroom_id)));
                }}
              />
            </Tooltip>
          </RenderActionCell>
        )
      }
    ],
    [navigate]
  );

  // Chapters table columns
  const chaptersColumns: ColumnsType<StudentAssignedChapters> = useMemo(
    () => [
      {
        title: 'Chapter',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (name: string) => <TableCellText>{name || '-'}</TableCellText>
      },
      {
        title: <div style={{ textAlign: 'center' }}>Assigned By</div>,
        key: 'assigned_by',
        render: (_: any, record: StudentAssignedChapters) => {
          const assignedBy = record?.assigned_by;
          const assignedByName =
            `${assignedBy?.first_name || ''} ${assignedBy?.last_name || ''}`.trim();
          const assignedByPhoto = assignedBy?.profile_photo
            ? `${IMAGE_URL}scamper/${ImageTypeEnum.TEACHER}/${assignedBy?.profile_photo}`
            : undefined;

          return (
            <UserInfoWrapper>
              <Avatar src={assignedByPhoto} size={32}>
                <UserOutlined />
              </Avatar>
              <UserInfoContent>
                <UserName>{assignedByName || '-'}</UserName>
                <UserEmail>{assignedBy?.email || '-'}</UserEmail>
              </UserInfoContent>
            </UserInfoWrapper>
          );
        }
      },
      {
        title: 'Assigned Date',
        dataIndex: 'assigned_date',
        key: 'assigned_date',
        align: 'center',
        render: (date: string) => (date ? formatDate(date, 'MM/DD/YYYY HH:mm') : '-')
      },
      {
        title: 'Lessons',
        dataIndex: 'lesson_count',
        key: 'lesson_count',
        align: 'center',
        width: 120,
        render: (lessons: number) => <span>{lessons || 0}</span>
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (status: string) => {
          if (status === 'Complete' || status === 'complete') {
            return <StatusTag color={STATUS_TAG_COLOR.SUCCESS_PRIMARY} status="Complete" />;
          } else if (status === 'In progress' || status === 'in_progress') {
            return <StatusTag color={STATUS_TAG_COLOR.WARNING} status="In progress" />;
          } else if (status === 'Assigned' || status === 'assigned') {
            return <StatusTag color={STATUS_TAG_COLOR.GRAY} status="Assigned" />;
          } else if (status === 'In Complete' || status === 'in_complete') {
            return <StatusTag color={STATUS_TAG_COLOR.DANGER} status="In Complete" />;
          }
          return <StatusTag color={STATUS_TAG_COLOR.GRAY} status={status || '-'} />;
        }
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        width: 120,
        render: (_, record: StudentAssignedChapters) => (
          <RenderActionCell>
            <Tooltip title="View Chapter">
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  navigate(ROUTES.chapter.viewChapter(String(record?.id)));
                }}
              />
            </Tooltip>
          </RenderActionCell>
        )
      }
    ],
    [navigate]
  );

  const hasClassroomsData = classroomsData && classroomsData.length > 0;
  const hasChaptersData = chaptersData && chaptersData.length > 0;

  // Don't show loader if we have mock data
  if (isLoading && !studentData) return <Loader />;

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <>
          {/* Top Section: Profile and Classrooms */}
          <TopSectionWrapper>
            <div className="flex-gap-20 align-items-center profile-info-container">
              <ProfileWrapper>
                {profilePhotoUrl ? (
                  <Image
                    className="border-full"
                    wrapperClassName="image-container"
                    src={profilePhotoUrl}
                    preview={{
                      visible: isPreviewVisible,
                      onVisibleChange: (visible) => setIsPreviewVisible(visible)
                    }}
                  />
                ) : (
                  <Avatar
                    size={185}
                    icon={<UserOutlined />}
                    className="border-4 border-white shadow-lg cursor-pointer"
                  />
                )}
              </ProfileWrapper>

              {/* Student Profile Section */}
              <div className="shadow-paper profile-info">
                <ProfileName>
                  {fullName || '-'}
                  {student?.is_active !== undefined && (
                    <StatusTag
                      color={
                        student.is_active
                          ? STATUS_TAG_COLOR.SUCCESS_PRIMARY
                          : STATUS_TAG_COLOR.DANGER
                      }
                      status={student.is_active ? 'Active' : 'Inactive'}
                    />
                  )}
                  {student?.google_student_id && <ClassroomViewIcon />}
                </ProfileName>

                <ProfileInfoText>{student?.email || '-'}</ProfileInfoText>
                <ProfileInfoText>
                  {student?.updated_at ? formatDate(student.updated_at, 'MM/DD/YY HH:mm') : '-'}
                </ProfileInfoText>
              </div>
            </div>

            {/* Classrooms Section */}
            <ChapterProgressCard className="shadow-paper">
              <CommonTable
                bordered
                scroll={hasClassroomsData ? { y: 185 } : undefined}
                columns={classroomsColumns}
                dataSource={classroomsData || []}
                pagination={false}
                rowKey="id"
                emptyText={
                  <EmptyState isEmpty={true} defaultDescription="No classrooms assigned" />
                }
              />
            </ChapterProgressCard>
          </TopSectionWrapper>

          {/* Chapters Section */}
          <ClassroomSectionCard className="shadow-paper">
            <CommonTable
              bordered
              scroll={
                hasChaptersData
                  ? { x: 'max-content', y: 'calc(100vh - 420px)' }
                  : { x: 'max-content' }
              }
              columns={chaptersColumns}
              dataSource={chaptersData}
              pagination={{
                current: 1,
                pageSize: 10,
                total: chaptersData?.length,
                showTotal: (total) => `Total ${total} items`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100']
              }}
              rowKey="id"
              emptyText={<EmptyState isEmpty={true} defaultDescription="No chapters assigned" />}
            />
          </ClassroomSectionCard>
        </>
      )
    }
  ];

  return (
    <>
      <Meta title={`${TITLES.COMMON} - ${TITLES.CLASSROOM.VIEW_STUDENT}`} />
      <HeaderToolbar
        backBtn
        title={TITLES.CLASSROOM.VIEW_STUDENT}
        isMultipleBtn
        button={
          classroomData?.data?.status == 'active' && (
            <ActionButtonsWrapper>
              <Button
                type="primary"
                shape="round"
                onClick={() => {
                  if (classroomId && studentId) {
                    navigate(ROUTES.classroom.editStudent(classroomId, studentId));
                  }
                }}
              >
                Edit
              </Button>
            </ActionButtonsWrapper>
          )
        }
      />

      <ViewStudentWrapper role="main">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </ViewStudentWrapper>
    </>
  );
};

export default ViewStudent;
