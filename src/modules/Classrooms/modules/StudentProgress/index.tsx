import { useCallback, useEffect, useMemo, useState } from 'react';

import { UserOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { theme } from 'style/Theme';

import { IMAGE_URL, TITLES } from 'utils/constants';
import { ImageTypeEnum } from 'utils/constants/enum';
import { showToaster } from 'utils/functions';

import { chapterHooks } from 'services/chapter';
import { classroomHooks, classroomQueryKeys } from 'services/classroom';

import { LedgerModal } from './components/LedgerModal';
import { SubmitFinalScoreModal } from './components/SubmitFinalScoreModal';
import HeaderToolbar from 'components/common/HeaderToolbar';
import { Loader } from 'components/common/Loader';
import Meta from 'components/common/Meta';
import { StatusTag } from 'components/common/StatusTag';
import { CommonTable } from 'components/common/Table';
import EmptyState from 'components/common/Table/EmptyState';
import { InfoIcon, LockIcon } from 'components/svg';

import {
  ChapterSelectorWrapper,
  InfoIconWrapper,
  StudentProgressWrapper
} from './StudentProgress.styled';

// Types for student progress data
interface StudentProgressData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lessons: {
    [lessonId: string]: {
      status: string;
      score: number | null;
      points: number | null;
      isLocked: boolean;
    };
  };
  finalScore: string | number;
  profile_photo?: string;
}

const StudentProgress = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedChapterId, setSelectedChapterId] = useState<number | undefined>(undefined);
  const [unlockedLessonIds, setUnlockedLessonIds] = useState<Set<number>>(new Set());
  const [modalState, setModalState] = useState<{
    open: boolean;
    studentId: string | null;
    studentName: string;
  }>({
    open: false,
    studentId: null,
    studentName: ''
  });
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);

  // Mutation for saving lesson assignment
  const { mutate: saveLessonAssignment, isPending: isSaving } =
    classroomHooks.useSaveLessonAssignment();

  // Fetch student progress data
  // Only pass chapterId if it's explicitly set by user (not undefined)
  const {
    data: studentProgressData,
    isLoading,
    isError,
    error
  } = classroomHooks.useGetStudentProgress(
    classroomId || '',
    selectedChapterId === undefined ? undefined : selectedChapterId
  );

  // Get the effective selected chapter ID (from state or API response)
  const effectiveSelectedChapterId =
    selectedChapterId ||
    studentProgressData?.data?.selected_chapter_id ||
    studentProgressData?.data?.chapters?.[0]?.id;

  // Handle API errors
  useEffect(() => {
    if (isError && error) {
      showToaster('error', error.message || 'Failed to fetch student progress');
    }
  }, [isError, error]);

  // Get chapter data for rubrics (using effective selected chapter)
  const selectedChapterIdForRubrics = effectiveSelectedChapterId;
  const { data: chapterData } = chapterHooks.useGetChapterById(
    selectedChapterIdForRubrics?.toString() || ''
  );
  const rubrics = chapterData?.data?.rubrics || [];

  // Get chapters from API response
  const chapters = useMemo(() => {
    return studentProgressData?.data?.chapters || [];
  }, [studentProgressData]);

  // Get lessons from API response
  const lessons = useMemo(() => {
    return studentProgressData?.data?.lessons || [];
  }, [studentProgressData]);

  // Map API data to table format with local unlock state
  const studentsData = useMemo<StudentProgressData[]>(() => {
    if (!studentProgressData?.data) {
      return [];
    }

    const { students, progress_data, lessons: lessonsData } = studentProgressData.data;

    return students.map((student) => {
      // Find progress data for this student
      const studentProgress = progress_data.find((p) => p.student_id === student.id);

      // Create lessons object with progress data
      const lessonsObj: StudentProgressData['lessons'] = {};
      lessonsData.forEach((lesson) => {
        const isUnlocked = unlockedLessonIds.has(lesson.id);
        const progressItem = studentProgress?.progress.find((p) => p.lesson_id === lesson.id);

        // If lesson is unlocked locally, set status to 'assigned', otherwise use API status
        const lessonStatus = isUnlocked ? 'assigned' : progressItem?.status || 'pending';

        lessonsObj[lesson.id.toString()] = {
          status: lessonStatus,
          score: progressItem?.score || null,
          points: progressItem?.points || null,
          isLocked: lesson.is_locked && !isUnlocked // Locked if originally locked and not unlocked locally
        };
      });

      return {
        id: student.id.toString(),
        name: `${student.first_name} ${student.last_name}`,
        email: student.email,
        profile_photo: student.profile_photo || undefined,
        lessons: lessonsObj,
        finalScore: '-'
      };
    });
  }, [studentProgressData, unlockedLessonIds]);

  // Check if a lesson can be unlocked (all previous lessons must be unlocked)
  const canUnlockLesson = useCallback(
    (lesson: { id: number; sequence: number; is_locked: boolean }) => {
      // If lesson is already unlocked, return false
      if (unlockedLessonIds.has(lesson.id) || !lesson.is_locked) {
        return false;
      }

      // Get all lessons sorted by sequence
      const sortedLessons = [...lessons].sort((a, b) => a.sequence - b.sequence);

      // Find the current lesson's index
      const currentLessonIndex = sortedLessons.findIndex((l) => l.id === lesson.id);

      // Check if all previous lessons (with lower sequence) are either:
      // 1. Not locked originally, OR
      // 2. Already unlocked
      for (let i = 0; i < currentLessonIndex; i++) {
        const prevLesson = sortedLessons[i];
        const isPrevUnlocked = unlockedLessonIds.has(prevLesson.id);

        // If previous lesson is locked and not unlocked, can't unlock current lesson
        if (prevLesson.is_locked && !isPrevUnlocked) {
          return false;
        }
      }

      return true;
    },
    [lessons, unlockedLessonIds]
  );

  // Handle lesson unlock
  const handleLessonUnlock = useCallback(
    (lessonId: number) => {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (!lesson) return;

      // Check if lesson can be unlocked (sequential order)
      if (!canUnlockLesson(lesson)) {
        showToaster(
          'warning',
          'Please unlock lessons in sequential order. Previous lessons must be unlocked first.'
        );
        return;
      }

      setUnlockedLessonIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(lessonId);
        return newSet;
      });
    },
    [lessons, canUnlockLesson]
  );

  const handleSave = () => {
    if (!classroomId || unlockedLessonIds.size === 0) {
      showToaster('info', 'No lessons to save');
      return;
    }

    saveLessonAssignment(
      {
        classroom_id: Number(classroomId),
        lesson_ids: Array.from(unlockedLessonIds)
      },
      {
        onSuccess: (response) => {
          showToaster('success', response?.message || 'Lesson assignment saved successfully');
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({
            queryKey: classroomQueryKeys.all
          });
          // Reset unlocked lessons after successful save and data refresh
          setUnlockedLessonIds(new Set());
          navigate(-1);
        },
        onError: (error) => {
          showToaster('error', error?.message || 'Failed to save lesson assignment');
        }
      }
    );
  };

  // Handle chapter selection
  const handleChapterSelect = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    // Reset unlocked lessons when chapter changes
    setUnlockedLessonIds(new Set());
  };

  // // Check if all non-locked lessons are completed for a student
  // const areAllLessonsCompleted = (record: StudentProgressData) => {
  //   const unlockedLessons = Object.keys(record.lessons).filter((lessonId) => {
  //     return !record.lessons[lessonId]?.isLocked;
  //   });

  //   return unlockedLessons.every((lessonId) => {
  //     const lesson = record.lessons[lessonId];
  //     return lesson?.status === 'completed';
  //   });
  // };

  // const handleOpenModal = (record: StudentProgressData) => {
  //   setModalState({
  //     open: true,
  //     studentId: record.id,
  //     studentName: record.name
  //   });
  // };

  const handleCloseModal = () => {
    setModalState({
      open: false,
      studentId: null,
      studentName: ''
    });
  };

  const handleSaveFinalScore = (scores: Record<number, string>) => {
    // TODO: Implement API call to save final score
    console.log('Saving final score for student:', modalState.studentId, scores);
    handleCloseModal();
  };

  const renderLessonStatus = (lesson: StudentProgressData['lessons'][string]) => {
    // If lesson is locked, show lock icon (unlock happens from header)
    if (lesson.isLocked) {
      return (
        <span className="anticon ant-menu-item-icon lock-icon-medium">
          <LockIcon />
        </span>
      );
    }

    switch (lesson.status) {
      case 'completed':
        return (
          <StatusTag
            status={lesson.points ? `${lesson.points} Points` : 'Completed'}
            color={theme.color.success}
          />
        );
      case 'in_progress':
        return <StatusTag status="Work in Progress" color="#FFEF44" />;
      case 'need_attention':
        return <StatusTag status="Need Attention" color={theme.color.danger} />;
      case 'assigned':
        return <StatusTag status="Assigned" color="#999999" />;
      case 'pending':
        return <StatusTag status="Pending" color="#999999" />;
      default:
        return '-';
    }
  };

  const columns: ColumnsType<StudentProgressData> = useMemo(() => {
    // Sort lessons by sequence
    const sortedLessons = [...lessons].sort((a, b) => a.sequence - b.sequence);

    const lessonColumns: ColumnsType<StudentProgressData> = sortedLessons?.map((lesson) => {
      const isUnlocked = unlockedLessonIds.has(lesson.id);
      const isLocked = lesson.is_locked && !isUnlocked;
      const canUnlock = canUnlockLesson(lesson);
      const isClickable = isLocked && canUnlock;

      return {
        title: (
          <div
            className="flex-gap-8 align-items-center justify-content-center"
            style={
              isClickable
                ? { cursor: 'pointer' }
                : isLocked
                  ? { cursor: 'not-allowed', opacity: 0.5 }
                  : {}
            }
            onClick={isClickable ? () => handleLessonUnlock(lesson.id) : undefined}
            title={
              isLocked
                ? canUnlock
                  ? 'Click to unlock lesson'
                  : 'Unlock previous lessons first (sequential order required)'
                : ''
            }
          >
            <span>{lesson.name}</span>
            {isLocked && (
              <span className="anticon ant-menu-item-icon lock-icon-small">
                <LockIcon />
              </span>
            )}
          </div>
        ),
        key: lesson.id.toString(),
        align: 'center' as const,
        render: (_: any, record: StudentProgressData) => {
          const lessonData = record.lessons[lesson.id.toString()];
          if (!lessonData) {
            // If lesson is locked, show lock icon (not clickable in cell)
            return isLocked ? (
              <span className="anticon ant-menu-item-icon lock-icon-medium">
                <LockIcon />
              </span>
            ) : (
              '-'
            );
          }
          return renderLessonStatus(lessonData);
        }
      };
    });

    return [
      {
        title: 'Student',
        key: 'student',
        width: 250,
        render: (_: any, record: StudentProgressData) => (
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
                {record?.name}{' '}
              </div>
              <div style={{ fontSize: '12px', color: '#6d7bad' }}>{record?.email || '-'}</div>
            </div>
          </div>
        )
      },
      ...lessonColumns,
      {
        title: 'Final Score',
        key: 'finalScore',
        align: 'center' as const,
        render: () => '-'
        // render: (_: any, record: StudentProgressData) => {
        //   const allCompleted = areAllLessonsCompleted(record);

        //   if (allCompleted && record.finalScore === '-') {
        //     return (
        //       <Button
        //         type="primary"
        //         size="small"
        //         onClick={() => handleOpenModal(record)}
        //         style={{
        //           background: '#1d3c63',
        //           borderColor: '#1d3c63',
        //           borderRadius: '8px',
        //           fontWeight: 500
        //         }}
        //       >
        //         Submit Final Score
        //       </Button>
        //     );
        //   }

        //   return <span style={{ fontWeight: 500 }}>{record.finalScore || '-'}</span>;
        //         }
      }
    ];
  }, [lessons, unlockedLessonIds, canUnlockLesson, handleLessonUnlock]);

  return (
    <>
      {isLoading && <Loader />}
      <Meta title={`${TITLES.COMMON} - Students Progress`} />
      <div className="flex-gap-16 flex-column">
        <HeaderToolbar
          backBtn
          title="Students Progress"
          button={
            <Button
              type="primary"
              onClick={handleSave}
              loading={isSaving}
              disabled={unlockedLessonIds.size === 0}
            >
              Save
            </Button>
          }
        />

        <StudentProgressWrapper role="main" className="shadow-paper">
          <ChapterSelectorWrapper>
            <div className="flex-gap-12 flex-wrap">
              {chapters?.map((chapter) => (
                <StatusTag
                  key={chapter.id}
                  color={
                    effectiveSelectedChapterId === chapter.id ? theme.color.primary : 'default'
                  }
                  status={chapter.name}
                  onClick={() => handleChapterSelect(chapter.id)}
                />
              ))}
            </div>
            <InfoIconWrapper onClick={() => setLedgerModalOpen(true)}>
              <span className="anticon ant-menu-item-icon">
                <InfoIcon />
              </span>
            </InfoIconWrapper>
          </ChapterSelectorWrapper>

          <div>
            <CommonTable
              bordered
              scroll={{ x: 'max-content' }}
              columns={columns}
              dataSource={studentsData}
              pagination={false}
              rowKey="id"
              emptyText={
                <EmptyState
                  isEmpty={!isLoading && studentsData.length === 0}
                  defaultDescription="No student progress data available"
                />
              }
            />
          </div>
        </StudentProgressWrapper>
      </div>

      <SubmitFinalScoreModal
        open={modalState.open}
        onCancel={handleCloseModal}
        onSave={handleSaveFinalScore}
        rubrics={rubrics}
        studentName={modalState.studentName}
      />

      <LedgerModal open={ledgerModalOpen} onCancel={() => setLedgerModalOpen(false)} />
    </>
  );
};

export default StudentProgress;
