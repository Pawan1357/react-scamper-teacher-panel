import { TITLES } from 'utils/constants';

import StudentForm from '../../components/StudentForm';
import HeaderToolbar from 'components/common/HeaderToolbar';
import Meta from 'components/common/Meta';

const EditStudent = () => {
  return (
    <>
      <Meta title={`${TITLES.COMMON} - ${TITLES.CLASSROOM.EDIT_STUDENT}`} />
      <HeaderToolbar backBtn title={TITLES.CLASSROOM.EDIT_STUDENT} />
      <StudentForm isEditMode={true} />
    </>
  );
};

export default EditStudent;
