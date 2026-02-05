import { useCallback, useMemo, useState } from 'react';

import {
  EyeOutlined,
  InboxOutlined,
  MoreOutlined,
  SearchOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Dropdown, MenuProps, Switch, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useClassroomTable } from 'modules/Classrooms/hooks/useClassroomTable';
import { useNavigate } from 'react-router-dom';
import { IconWrapper } from 'style/Common/common';

import { INPUTS } from 'utils/constants';
import { formatDate } from 'utils/constants/day';
import { PAGE_LIMIT } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import { capitalizeFirst, getAntDSortOrder, showToaster } from 'utils/functions';

import { classroomHooks, classroomQueryKeys } from 'services/classroom';
import { IClassroomBase } from 'services/classroom/types';
import { manageStudentQueryKeys } from 'services/manageStudent';

import { RenderSearchInput } from 'components/common/FormField';
import { Loader } from 'components/common/Loader';
import ConfirmModal from 'components/common/Modal/components/ConfirmModal';
import RenderActionCell from 'components/common/RenderActionCell';
import { CommonTable } from 'components/common/Table';
import EmptyState from 'components/common/Table/EmptyState';
import { TruncatedTextWithTooltip } from 'components/common/TruncatedTextWithTooltip';

const ClassroomTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { args, searchVal, data, isLoading, isEmpty, handleTableChange, handleSearchChange } =
    useClassroomTable();

  const { mutate: toggleEconomy, isPending: isTogglePending } = classroomHooks.useToggleEconomy();
  const { mutate: toggleArchiveStatus, isPending: isArchivePending } =
    classroomHooks.useToggleArchiveStatus();
  const { mutate: syncAction, isPending: isSyncPending } = classroomHooks.useSyncClassroom();

  const [archiveModalState, setArchiveModalState] = useState<{
    open: boolean;
    classroomId: string;
    status: string;
  }>({
    open: false,
    classroomId: '',
    status: ''
  });

  const [toggleId, setToggleId] = useState<number | null>(null);

  const handleEconomyToggle = useCallback(
    (record: IClassroomBase) => {
      setToggleId(record.id);
      toggleEconomy(String(record.id), {
        onSuccess: (response) => {
          showToaster(
            'success',
            response?.message || 'Classroom archive status updated successfully'
          );
          // Invalidate the list query to refresh the table
          queryClient.invalidateQueries({
            queryKey: classroomQueryKeys.getTeacherClassroomsList(args)
          });
          queryClient.invalidateQueries({
            queryKey: classroomQueryKeys.all
          });
          setToggleId(null);
        },
        onError: (error) => {
          showToaster('error', error?.message || 'Failed to update classroom archive status');
          setToggleId(null);
        }
      });
    },
    [toggleEconomy, queryClient, args]
  );

  // const handleViewStudentProgress = (record: IClassroomBase) => {
  //   navigate(ROUTES.classroom.studentProgress(String(record.id)));
  // };

  const handleArchiveClass = useCallback((record: IClassroomBase) => {
    setArchiveModalState({
      open: true,
      classroomId: String(record.id),
      status: record.status || ''
    });
  }, []);

  const handleSyncStudents = useCallback(
    (record: IClassroomBase) => {
      syncAction(
        { classroom_id: Number(record?.id) },
        {
          onSuccess: (response) => {
            showToaster('success', response?.message || 'Classroom sync successfully');
            queryClient.invalidateQueries({ queryKey: classroomQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: manageStudentQueryKeys.all });
          },
          onError: (error) => {
            showToaster('error', error?.message || 'Failed to update classroom archive status');
          }
        }
      );
    },
    [queryClient, syncAction]
  );

  const handleArchiveConfirm = useCallback(() => {
    toggleArchiveStatus(archiveModalState?.classroomId, {
      onSuccess: (response) => {
        showToaster(
          'success',
          response?.message || 'Classroom archive status updated successfully'
        );
        queryClient.invalidateQueries({
          queryKey: classroomQueryKeys.getTeacherClassroomsList(args)
        });
        queryClient.invalidateQueries({
          queryKey: classroomQueryKeys.all
        });
        setArchiveModalState({ open: false, classroomId: '', status: '' });
      },
      onError: (error) => {
        showToaster('error', error?.message || 'Failed to update classroom archive status');
      }
    });
  }, [toggleArchiveStatus, archiveModalState.classroomId, queryClient, args]);

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

  const columns: ColumnsType<IClassroomBase> = useMemo(
    () => [
      {
        title: <div style={{ textAlign: 'center' }}>Classroom Name</div>,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(args?.sort_by, args?.sort_order, 'name'),
        render: (name: string) => <TruncatedTextWithTooltip text={name || '-'} maxLength={40} />
      },
      {
        title: 'Students',
        dataIndex: 'student_count',
        key: 'student_count',
        align: 'center',

        render: (student_count: number) => student_count ?? 0
      },
      {
        title: 'Assigned Chapters',
        dataIndex: 'assigned_chapters',
        key: 'assigned_chapters',
        align: 'center',

        render: (chapters: number) => chapters ?? 0
      },
      {
        title: 'Classroom Economy',
        dataIndex: 'economy',
        key: 'economy',
        align: 'center',

        render: (enabled: boolean, record: IClassroomBase) => (
          <Tooltip
            title={record.status != 'active' ? 'Classroom must be active to update economy.' : ''}
          >
            <Switch
              checked={!!enabled}
              checkedChildren="Yes"
              unCheckedChildren="No"
              onChange={() => handleEconomyToggle(record)}
              disabled={isTogglePending || record.status != 'active'}
              style={{ backgroundColor: enabled ? '#389E0D' : undefined }}
              loading={isTogglePending && toggleId === record.id}
            />
          </Tooltip>
        )
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
            {status ? capitalizeFirst(status === 'active' ? 'Active' : 'archived') : '-'}
          </Tag>
        )
      },
      {
        title: 'Created from',
        dataIndex: 'add_via',
        key: 'add_via',
        align: 'center',

        render: (add_via: string) => (add_via ? capitalizeFirst(add_via) : '-')
      },
      {
        title: 'Updated At',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center',
        sorter: true,
        sortOrder: getAntDSortOrder(args?.sort_by, args?.sort_order, 'updated_at'),
        render: (date: string) => formatDate(date)
      },
      {
        title: 'Action',
        key: 'actions',
        align: 'center',
        render: (_, record: IClassroomBase) => {
          const menuItems: MenuProps['items'] = [
            {
              key: 'view-student-progress',
              label: 'View Student Progress',
              icon: <EyeOutlined />
            }
          ];
          if (record?.add_via === 'google') {
            menuItems.push({
              key: 'sync-students',
              label: 'Sync from Google Classroom',
              icon: <SyncOutlined />
            });
          }
          menuItems.push({
            key: 'archive-class',
            label: record.status === 'active' ? 'Archive Class' : 'Unarchive Class',
            icon: <InboxOutlined />
          });

          const handleMenuClick = ({ key }: { key: string }) => {
            if (key === 'archive-class') {
              handleArchiveClass(record);
            } else if (key === 'sync-students') {
              handleSyncStudents(record);
            }
          };

          return (
            <RenderActionCell>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  navigate(ROUTES.classroom.view(String(record.id)));
                }}
              />
              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<MoreOutlined />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            </RenderActionCell>
          );
        }
      }
    ],
    [
      args?.sort_by,
      args?.sort_order,
      isTogglePending,
      handleEconomyToggle,
      handleArchiveClass,
      handleSyncStudents,
      navigate
    ]
  );

  return (
    <>
      {isSyncPending && <Loader />}
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
          columns={columns}
          dataSource={data?.classroom_list || []}
          pagination={{
            current: args.page ?? PAGE_LIMIT.PAGE,
            pageSize: args.limit ?? PAGE_LIMIT.LIMIT,
            total: data?.total_records ?? 0
          }}
          onChange={handleTableChange}
          loading={isLoading}
          emptyText={
            <EmptyState
              isEmpty={isEmpty}
              search={args.search}
              defaultDescription="No Classrooms available"
              searchDescription="No Classrooms Found"
            />
          }
        />
      </div>

      <ConfirmModal
        modalProps={{
          open: archiveModalState.open,
          onOpenChange: (open) =>
            !open && setArchiveModalState({ open: false, classroomId: '', status: '' }),
          question: `Are you sure you want to ${
            archiveModalState.status === 'active' ? 'archive' : 'unarchive'
          } this classroom?`,
          description: `This classroom will be ${
            archiveModalState.status === 'active' ? 'archive' : 'unarchive'
          }.`,
          onOk: handleArchiveConfirm,
          onCancel: () => setArchiveModalState({ open: false, classroomId: '', status: '' }),
          cancelText: 'No',
          okText: 'Yes',
          okButtonProps: { loading: isArchivePending, disabled: isArchivePending },
          cancelButtonProps: { disabled: isArchivePending }
        }}
      />
    </>
  );
};

export default ClassroomTable;
