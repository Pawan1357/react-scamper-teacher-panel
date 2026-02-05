import { TITLES } from 'utils/constants';

import StudentForm from '../../components/StudentForm';
import HeaderToolbar from 'components/common/HeaderToolbar';
import Meta from 'components/common/Meta';

const AddStudent = () => {
  return (
    <>
      <Meta title={`${TITLES.COMMON} - ${TITLES.CLASSROOM.ADD_STUDENT}`} />
      <HeaderToolbar backBtn title={TITLES.CLASSROOM.ADD_STUDENT} />
      <StudentForm isEditMode={false} />
    </>
  );
};

export default AddStudent;
