import React from 'react';

import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import CommonModal from 'components/common/Modal/components/CommonModal';

interface SkippedStudentsModalProps {
  open: boolean;
  onClose: () => void;
  skippedStudents: any;
}

const SkippedStudentModal: React.FC<SkippedStudentsModalProps> = ({
  open,
  onClose,
  skippedStudents
}) => {
  const columns: ColumnsType<any> = [
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 300,
      render: (text: string) => <span style={{ color: '#ff4d4f' }}>{text}</span>
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      render: (_: any, record: any) =>
        record ? `${record?.first_name ?? ''}` + ' ' + `${record?.last_name ?? ''}` : 'N/A'
    },
    {
      title: `Student's Email`,
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => text || 'N/A'
    }
  ];

  return (
    <CommonModal
      open={open}
      onCancel={onClose}
      title="Invalid Students"
      width={1200}
      footer={
        <Button type="primary" onClick={onClose} size="small">
          OK
        </Button>
      }
      centered
    >
      <Table
        dataSource={skippedStudents || []}
        columns={columns}
        rowKey={(_, index) => `skipped-student-${index}`}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </CommonModal>
  );
};

export default SkippedStudentModal;
