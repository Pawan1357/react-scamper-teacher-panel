import React, { useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { TITLES } from 'utils/constants';
import { formatDate } from 'utils/constants/day';
import { ROUTES } from 'utils/constants/routes';
import { showToaster } from 'utils/functions';

import { classroomHooks, classroomQueryKeys } from 'services/classroom';
import * as Types from 'services/classroom/types';

import HeaderToolbar from 'components/common/HeaderToolbar';
import { Loader } from 'components/common/Loader';
import Meta from 'components/common/Meta';
import { CommonTable } from 'components/common/Table';
import { ErrorClassroomIcon } from 'components/svg';

import {
  ErrorContent,
  ErrorDescription,
  ErrorIcon,
  ErrorMessage,
  ImportPageWrapper,
  TableWrapper
} from './GoogleClassroomImport.styled';

const SESSION_KEY = 'google_classroom_import_allowed';

const GoogleClassroomImport: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  console.log('🚀 ~ GoogleClassroomImport ~ selectedRowKeys:', selectedRowKeys);

  const [isApiFlowAllowed, setIsApiFlowAllowed] = useState(
    sessionStorage.getItem(SESSION_KEY) === 'true'
  );
  const [isCheckingFlow, setIsCheckingFlow] = useState<boolean>(true);

  const { mutate: importClassroomAction, isPending: isImporting } =
    classroomHooks.useImportClassrooms();

  const { mutate: getGoogleAuthUrl, isPending: isGoogleLoading } =
    classroomHooks.useGetGoogleClassroomAuthUrl({
      onSuccess: (response) => {
        const authUrl = response?.data?.auth_url;

        if (authUrl && typeof authUrl === 'string') {
          window.location.href = authUrl;
          sessionStorage.removeItem('GOOGLE_IMPORT_USED');
        } else {
          showToaster('error', 'Failed to get authentication URL');
        }
      },
      onError: (error) => {
        const errorMessage = error?.message || 'Failed to get authentication URL';
        showToaster('error', errorMessage);
      }
    });

  useEffect(() => {
    const isUsed = sessionStorage.getItem('GOOGLE_IMPORT_USED') === 'true';

    if (isUsed) {
      navigate(ROUTES.classroom.list, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (!success && !error && sessionStorage.getItem(SESSION_KEY) !== 'true') {
      navigate(ROUTES.classroom.list, { replace: true });
      return;
    }

    if (success === 'true') {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsApiFlowAllowed(true);
    } else if (error) {
      sessionStorage.removeItem(SESSION_KEY);
      setIsApiFlowAllowed(false);
      showToaster('error', error || 'Failed to fetch Google Classrooms');
    }

    setIsCheckingFlow(false);

    // 🧹 When user leaves this page → permanently disable it
    return () => {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.setItem('GOOGLE_IMPORT_USED', 'true');
    };
  }, [navigate, searchParams]);

  const { data, isLoading } = classroomHooks.useGetGoogleClassroomsList({
    enabled: isApiFlowAllowed
  });

  const handleBack = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.setItem('GOOGLE_IMPORT_USED', 'true');
    navigate(ROUTES.classroom.list, { replace: true });
  };

  const handleCancel = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.setItem('GOOGLE_IMPORT_USED', 'true');
    navigate(ROUTES.classroom.list, { replace: true });
  };

  const handleImport = () => {
    if (selectedRowKeys?.length === 0) {
      showToaster('error', 'Please select at least one classroom to import');
      return;
    }

    // Get full row data for selected rows
    // Convert selectedRowKeys to strings for comparison
    const selectedKeysSet = new Set(selectedRowKeys?.map((key) => String(key)));
    const selectedClassrooms = data?.filter((classroom) =>
      selectedKeysSet?.has(String(classroom?.classroom_id))
    );

    const payload = {
      classrooms:
        selectedClassrooms?.map((data) => {
          return {
            classroom_id: data?.classroom_id,
            class_name: data?.class_name,
            description: data?.description,
            section: data?.section,
            room: data?.room,
            enrollment_code: data?.enrollment_code
          };
        }) || []
    };

    importClassroomAction(payload, {
      onSuccess: (response) => {
        showToaster('success', response?.message || 'Success!');
        queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
        navigate(ROUTES.classroom.list, { replace: true });
      },
      onError: (error) => {
        showToaster('error', error?.message);
      }
    });
  };

  const handleRetry = () => {
    sessionStorage.removeItem(SESSION_KEY);
    getGoogleAuthUrl();
  };

  const rowSelection: TableRowSelection<Types.IGoogleClassroom> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const columns: ColumnsType<Types.IGoogleClassroom> = useMemo(
    () => [
      {
        title: 'Classroom Id',
        dataIndex: 'classroom_id',
        key: 'classroom_id',
        align: 'center',
        render: (classroom_id: string) => classroom_id || '-'
      },
      {
        title: 'Class Name',
        dataIndex: 'class_name',
        key: 'class_name',
        align: 'center',
        render: (text: string) => text || '-'
      },
      {
        title: 'Number of Students',
        dataIndex: 'number_of_students',
        key: 'number_of_students',
        align: 'center',
        render: (number_of_students: number) => number_of_students ?? '-'
      },
      {
        title: 'Last Updated',
        dataIndex: 'last_updated',
        key: 'last_updated',
        align: 'center',
        render: (date: string) => (date ? formatDate(date, 'MM/DD/YY') : '-')
      }
    ],
    []
  );

  if (isCheckingFlow) {
    return <Loader />;
  }

  if (!isApiFlowAllowed) {
    return (
      <>
        <Meta title={`${TITLES.COMMON} - Import from Google Classroom`} />
        <HeaderToolbar
          backBtn
          backButtonHandler={handleBack}
          title="Import from Google Classroom"
        />

        <ImportPageWrapper>
          <div style={{ color: '#8c8c8c', fontSize: '14px' }}>
            Select one or more classes and click "Import" to import them into SCAMPER.
          </div>

          <ErrorContent>
            <ErrorIcon>
              <ErrorClassroomIcon />
            </ErrorIcon>
            <ErrorMessage>We couldn't fetch your Google Classrooms."</ErrorMessage>
            <ErrorDescription>
              Please make sure you’re signed in with the correct Google account and have granted
              access to Google Classroom.
            </ErrorDescription>
            <Button
              style={{ width: '50%' }}
              loading={isGoogleLoading}
              type="primary"
              size="middle"
              onClick={handleRetry}
            >
              Retry
            </Button>
          </ErrorContent>
        </ImportPageWrapper>
      </>
    );
  }

  return (
    <>
      <Meta title={`${TITLES.COMMON} - Import from Google Classroom`} />
      <HeaderToolbar
        backBtn
        backButtonHandler={handleBack}
        title="Import from Google Classroom"
        button={
          <Space size={12}>
            <Button
              type="text"
              danger
              onClick={handleCancel}
              style={{ color: '#ff4d4f' }}
              disabled={isLoading || isImporting}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleImport}
              disabled={isLoading || selectedRowKeys.length === 0}
              loading={isImporting}
            >
              Import
            </Button>
          </Space>
        }
      />
      <ImportPageWrapper>
        <div style={{ color: '#8c8c8c', fontSize: '14px' }}>
          Select one or more classes and click "Import" to import them into SCAMPER.
        </div>

        <TableWrapper>
          <CommonTable
            dataSource={data || []}
            columns={columns}
            loading={isLoading}
            pagination={false}
            rowKey="classroom_id"
            rowSelection={rowSelection}
          />
        </TableWrapper>
      </ImportPageWrapper>
    </>
  );
};

export default GoogleClassroomImport;
