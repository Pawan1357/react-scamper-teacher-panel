import { useMemo, useState } from 'react';

import { Avatar, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { theme } from 'style/Theme';

import { TITLES } from 'utils/constants';

import { chapterHooks } from 'services/chapter';

import { LedgerModal } from './components/LedgerModal';
import { SubmitFinalScoreModal } from './components/SubmitFinalScoreModal';
import HeaderToolbar from 'components/common/HeaderToolbar';
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
    [lessonName: string]: 'completed' | 'in-progress' | 'need-attention' | 'assigned' | 'locked';
  };
  finalScore: string | number;
}

const StudentProgress = () => {
  const [selectedChapter, setSelectedChapter] = useState('Garden to Market');
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

  // Get chapter ID from selected chapter - TODO: Replace with actual chapter ID mapping
  // For now, using a mock chapter ID. In production, this should come from the selected chapter
  const chapterId = '1'; // Mock chapter ID - should be fetched based on selectedChapter

  // Fetch chapter data to get rubrics
  const { data: chapterData } = chapterHooks.useGetChapterById(chapterId);
  const rubrics = chapterData?.data?.rubrics || [];

  // Mock data for chapters - TODO: Replace with actual API data
  const chapters = useMemo(
    () => [
      'Garden to Market',
      'Shapes and Angles',
      'Lines and Circles',
      'Circles and Lines',
      'The Art Lines',
      'Garden Design'
    ],
    []
  );

  // Mock data for student progress - TODO: Replace with actual API data
  const studentsData = useMemo<StudentProgressData[]>(() => {
    return [
      {
        id: '1',
        name: 'Dori Doreau',
        email: 'dori01@gmail.com',
        lessons: {
          'What is Semi Circle': 'completed',
          'Lines and Circles': 'in-progress',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      },
      {
        id: '2',
        name: 'B.A. Baracus',
        email: 'byron.b@gmail.com',
        lessons: {
          'What is Semi Circle': 'completed',
          'Lines and Circles': 'in-progress',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      },
      {
        id: '3',
        name: 'Devon Miles',
        email: 'dev.077@gmail.com',
        lessons: {
          'What is Semi Circle': 'need-attention',
          'Lines and Circles': 'completed',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      },
      {
        id: '4',
        name: 'Peter Thornton',
        email: 'peter1@gmail.com',
        lessons: {
          'What is Semi Circle': 'completed',
          'Lines and Circles': 'completed',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      },
      {
        id: '5',
        name: 'Devon Miles',
        email: 'devon15@gmail.com',
        lessons: {
          'What is Semi Circle': 'assigned',
          'Lines and Circles': 'need-attention',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      },
      {
        id: '6',
        name: 'Sledge Hammer',
        email: 's.hammer@gmail.com',
        lessons: {
          'What is Semi Circle': 'completed',
          'Lines and Circles': 'completed',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      },
      {
        id: '7',
        name: 'B.A. Baracus',
        email: 'b.a.b@gmail.com',
        lessons: {
          'What is Semi Circle': 'completed',
          'Lines and Circles': 'in-progress',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      },
      {
        id: '8',
        name: 'Thomas Magnum',
        email: 'thomas.m00@gmail.com',
        lessons: {
          'What is Semi Circle': 'need-attention',
          'Lines and Circles': 'in-progress',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      },
      {
        id: '9',
        name: 'Thomas Magnum',
        email: 'thomas.m00@gmail.com',
        lessons: {
          'What is Semi Circle': 'completed',
          'Lines and Circles': 'in-progress',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      },
      {
        id: '10',
        name: 'Thomas Magnum',
        email: 'thomas.m00@gmail.com',
        lessons: {
          'What is Semi Circle': 'completed',
          'Lines and Circles': 'completed',
          'Circles and Lines': 'locked',
          'The Art Lines': 'locked'
        },
        finalScore: '-'
      }
    ];
  }, []);

  const handleSave = () => {
    // TODO: Implement API call to save student progress
    console.log('Saving student progress');
  };

  // Check if all non-locked lessons are completed for a student
  const areAllLessonsCompleted = (record: StudentProgressData) => {
    const lessonNames = [
      'What is Semi Circle',
      'Lines and Circles',
      'Circles and Lines',
      'The Art Lines'
    ];
    const unlockedLessons = lessonNames.filter((lesson) => {
      const lessonData = [
        { name: 'What is Semi Circle', isLocked: false },
        { name: 'Lines and Circles', isLocked: false },
        { name: 'Circles and Lines', isLocked: true },
        { name: 'The Art Lines', isLocked: true }
      ].find((l) => l.name === lesson);
      return !lessonData?.isLocked;
    });

    return unlockedLessons.every((lesson) => {
      const status = record.lessons[lesson] || 'locked';
      return status === 'completed';
    });
  };

  const handleOpenModal = (record: StudentProgressData) => {
    setModalState({
      open: true,
      studentId: record.id,
      studentName: record.name
    });
  };

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

  const renderLessonStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return <StatusTag status="10 Points" color={theme.color.success} />;
      case 'in-progress':
        return <StatusTag status="Work in Progress" color={theme.color.warning} />;
      case 'need-attention':
        return <StatusTag status="Need Attention" color={theme.color.danger} />;
      case 'assigned':
        return <StatusTag status="Assigned" color={theme.color.gray} />;
      case 'locked':
        return (
          <span className="anticon ant-menu-item-icon lock-icon-medium">
            <LockIcon />
          </span>
        );
      default:
        return '-';
    }
  };

  const columns: ColumnsType<StudentProgressData> = useMemo(() => {
    const lessonColumns: ColumnsType<StudentProgressData> = [
      { name: 'What is Semi Circle', isLocked: false },
      { name: 'Lines and Circles', isLocked: false },
      { name: 'Circles and Lines', isLocked: true },
      { name: 'The Art Lines', isLocked: true }
    ].map((lesson) => ({
      title: (
        <div className="flex-gap-8 align-items-center justify-content-center">
          <span>{lesson.name}</span>
          {lesson.isLocked && (
            <span className="anticon ant-menu-item-icon lock-icon-small">
              <LockIcon />
            </span>
          )}
        </div>
      ),
      key: lesson.name,
      align: 'center' as const,
      render: (_: any, record: StudentProgressData) => {
        const status = record.lessons[lesson.name] || 'locked';
        return renderLessonStatus(status);
      }
    }));

    return [
      {
        title: 'Student',
        key: 'student',
        width: 250,
        render: (_: any, record: StudentProgressData) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
      ...lessonColumns,
      {
        title: 'Final Score',
        key: 'finalScore',
        align: 'center' as const,
        render: (_: any, record: StudentProgressData) => {
          const allCompleted = areAllLessonsCompleted(record);

          if (allCompleted && record.finalScore === '-') {
            return (
              <Button
                type="primary"
                size="small"
                onClick={() => handleOpenModal(record)}
                style={{
                  background: '#1d3c63',
                  borderColor: '#1d3c63',
                  borderRadius: '8px',
                  fontWeight: 500
                }}
              >
                Submit Final Score
              </Button>
            );
          }

          return <span style={{ fontWeight: 500 }}>{record.finalScore || '-'}</span>;
        }
      }
    ];
  }, []);

  return (
    <>
      <Meta title={`${TITLES.COMMON} - Students Progress`} />
      <div className="flex-gap-16 flex-column">
        <HeaderToolbar
          backBtn
          title="Students Progress"
          button={
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          }
        />

        <StudentProgressWrapper role="main" className="shadow-paper">
          <ChapterSelectorWrapper>
            <div className="flex-gap-12 flex-wrap">
              {chapters.map((chapter, index) => (
                <StatusTag
                  key={`${chapter}-${index}`}
                  color={selectedChapter === chapter ? theme.color.primary : 'default'}
                  status={chapter}
                  onClick={() => setSelectedChapter(chapter)}
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
                  isEmpty={true}
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
