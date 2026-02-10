import React, { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Space, Spin, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useNavigate, useParams } from 'react-router-dom';

import { TITLES } from 'utils/constants';
import { ROUTES } from 'utils/constants/routes';
import { showToaster } from 'utils/functions';

import { classroomHooks, classroomQueryKeys } from 'services/classroom';

import HeaderToolbar from 'components/common/HeaderToolbar';
import { CommonTable } from 'components/common/Table';

import { ImportSummaryWrapper } from './ImportSummary.styled';
import SkippedStudentModal from './SkippedStudentModal';

interface ExcelRowData {
  'First Name'?: string;
  'Last Name'?: string;
  Email?: string;
  [key: string]: any;
}

interface ProcessedStudentData {
  id: string;
  student: string;
  studentEmail: string;
  key: string;
  first_name: string;
  last_name: string;
  email: string;
}

const ImportSummary: React.FC = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<ProcessedStudentData[]>([]);
  const [className, setClassName] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isSkippedStudentsModalOpen, setIsSkippedStudentsModalOpen] = useState(false);
  const [skippedStudents, setSkippedStudents] = useState<any[]>([]);

  const { mutate: importClassroomAction, isPending: isImporting } =
    classroomHooks.useImportExcelClassrooms();

  useEffect(() => {
    const loadExcelData = () => {
      setLoading(true);
      try {
        // Retrieve parsed data and class name from sessionStorage
        const storedData = sessionStorage.getItem('studentImportData');
        const storedClassName = sessionStorage.getItem('studentImportClassName');

        if (storedClassName) {
          setClassName(storedClassName);
        }

        if (storedData) {
          const parsedData: ExcelRowData[] = JSON.parse(storedData);

          // Process the data: merge first_name and last_name, extract email
          const processedData: ProcessedStudentData[] = parsedData
            .filter((row) => {
              // Filter out rows that don't have required fields
              return row['First Name'] || row['Last Name'] || row['Email'];
            })
            .map((row, index) => {
              const firstName = row['First Name'] || '';
              const lastName = row['Last Name'] || '';
              const studentName = `${firstName} ${lastName}`.trim() || 'N/A';
              const email = row['Email'] || 'N/A';

              // Generate ID in format HBK1006, HBK1007, etc.
              const idNumber = 1006 + index;
              const id = `HBK${idNumber}`;

              return {
                id,
                student: studentName,
                studentEmail: email,
                key: `student-${index}`,
                first_name: firstName,
                last_name: lastName,
                email: row['Email'] || ''
              };
            });

          setStudentData(processedData);
        } else {
          showToaster('error', 'No import data found. Please upload the file again.');
          navigate(ROUTES.classroom.list);
        }
      } catch (error) {
        console.error('Error loading Excel data:', error);
        showToaster('error', 'Failed to load import data. Please try again.');
        navigate(ROUTES.classroom.list);
      } finally {
        setLoading(false);
      }
    };

    if (fileName) {
      loadExcelData();
    }
  }, [fileName, navigate]);

  const handleBack = () => {
    // Clear sessionStorage when navigating back
    if (isSkippedStudentsModalOpen) {
      return;
    }
    sessionStorage.removeItem('studentImportData');
    sessionStorage.removeItem('studentImportFile');
    sessionStorage.removeItem('studentImportFileName');
    sessionStorage.removeItem('studentImportClassName');
    navigate(ROUTES.classroom.list, { replace: true });
  };

  const handleCancel = () => {
    // Clear sessionStorage when canceling
    if (isSkippedStudentsModalOpen) {
      return;
    }
    sessionStorage.removeItem('studentImportData');
    sessionStorage.removeItem('studentImportFile');
    sessionStorage.removeItem('studentImportFileName');
    sessionStorage.removeItem('studentImportClassName');
    navigate(ROUTES.classroom.list, { replace: true });
  };

  const handleImport = () => {
    const base64File = sessionStorage.getItem('studentImportFile');
    const storedFileName = sessionStorage.getItem('studentImportFileName');

    if (!base64File || !storedFileName) {
      showToaster('error', 'File not found. Please upload the file again.');
      navigate(ROUTES.classroom.list);
      return;
    }
    // Get selected rows data - selectedRowKeys contains the 'key' values
    const selectedStudents = studentData?.filter((student) =>
      selectedRowKeys?.includes(student.key)
    );

    // Map selected students to the required format
    const students = selectedStudents?.map((student) => ({
      first_name: student?.first_name,
      last_name: student?.last_name,
      email: student?.email
    }));

    const payload = {
      classroom_name: className,
      students: students
    };

    importClassroomAction(payload, {
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });

        // Check if there are skipped teachers in the data object
        if (response.data?.skipped_students && response.data.skipped_students?.length > 0) {
          setSkippedStudents(response?.data?.skipped_students);
          setIsSkippedStudentsModalOpen(true);
        } else {
          // Clear sessionStorage and navigate only if no skipped teachers
          sessionStorage.removeItem('studentImportData');
          sessionStorage.removeItem('studentImportFile');
          sessionStorage.removeItem('studentImportFileName');
          sessionStorage.removeItem('studentImportClassName');
          navigate(ROUTES.classroom.list, { replace: true });
        }

        if (response?.data?.students_linked?.toString() && response?.data?.students_linked > 0) {
          showToaster('success', response?.message || 'Students imported successfully');
        }
      },
      onError: (error) => {
        showToaster('error', error?.message);
      }
    });
  };

  const rowSelection: TableRowSelection<ProcessedStudentData> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const columns: ColumnsType<ProcessedStudentData> = [
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      align: 'center'
    },
    {
      title: "Student's Email",
      dataIndex: 'studentEmail',
      key: 'studentEmail',
      align: 'center'
    }
  ];

  return (
    <>
      <ImportSummaryWrapper>
        <HeaderToolbar
          backBtn
          backButtonHandler={handleBack}
          title={TITLES.CLASSROOM.IMPORT_SUMMARY || 'Students - Import Summary'}
          button={
            <Space size={12}>
              <Button
                type="text"
                danger
                onClick={handleCancel}
                style={{ color: '#ff4d4f' }}
                disabled={loading || isImporting}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleImport}
                disabled={loading || isImporting || selectedRowKeys?.length === 0}
                loading={isImporting}
              >
                Import
              </Button>
            </Space>
          }
        />

        <div className="shadow-paper">
          <Spin spinning={loading}>
            {studentData?.length > 0 ? (
              <CommonTable
                dataSource={studentData}
                columns={columns}
                rowKey="key"
                pagination={false}
                rowSelection={rowSelection}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Typography.Text type="secondary">
                  {loading
                    ? 'Loading Excel data...'
                    : 'No data available. Please check the uploaded file.'}
                </Typography.Text>
              </div>
            )}
          </Spin>
        </div>
      </ImportSummaryWrapper>
      <SkippedStudentModal
        open={isSkippedStudentsModalOpen}
        onClose={() => {
          setIsSkippedStudentsModalOpen(false);
          // Clear sessionStorage and navigate after closing modal
          sessionStorage.removeItem('studentImportData');
          sessionStorage.removeItem('studentImportFile');
          sessionStorage.removeItem('studentImportFileName');
          navigate(ROUTES.classroom.list);
        }}
        skippedStudents={skippedStudents}
      />
    </>
  );
};

export default ImportSummary;
