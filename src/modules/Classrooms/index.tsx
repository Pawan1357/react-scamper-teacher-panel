import { useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { IMAGE_URL, TITLES } from 'utils/constants';
import { ImageTypeEnum } from 'utils/constants/enum';

import AddClassNameModal from './components/AddClassNameModal';
import ClassroomTable from './components/ClassroomTable';
import CreateClassModal from './components/CreateClassModal';
import HeaderToolbar from 'components/common/HeaderToolbar';

const ViewClassroomsList = () => {
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [isAddClassNameModalOpen, setIsAddClassNameModalOpen] = useState(false);

  const handleCreateClassroomClick = () => {
    setIsCreateClassModalOpen(true);
  };

  const handleCreateClassModalCancel = () => {
    setIsCreateClassModalOpen(false);
  };

  const handleSelectOption = () => {
    setIsCreateClassModalOpen(false);
    setIsAddClassNameModalOpen(true);
  };

  const handleAddClassNameModalCancel = () => {
    setIsAddClassNameModalOpen(false);
  };

  const handleAddClassNameSubmit = () => {
    setIsAddClassNameModalOpen(false);
  };

  return (
    <div className="flex-gap-16 flex-column">
      <HeaderToolbar
        title={TITLES.CLASSROOM.LIST}
        button={
          <Button icon={<PlusOutlined />} type="primary" onClick={handleCreateClassroomClick}>
            Create Classroom
          </Button>
        }
      />

      <ClassroomTable />

      <CreateClassModal
        open={isCreateClassModalOpen}
        onCancel={handleCreateClassModalCancel}
        onSelectOption={handleSelectOption}
      />

      <AddClassNameModal
        open={isAddClassNameModalOpen}
        onCancel={handleAddClassNameModalCancel}
        onSubmit={handleAddClassNameSubmit}
        downloadTemplatePath={`${IMAGE_URL}scamper/${ImageTypeEnum.TEACHER}/ClassroomImport.xlsx`}
      />
    </div>
  );
};

export default ViewClassroomsList;
