import { TITLES } from 'utils/constants';

import TeacherLearningTable from './components/TeacherLearningTable';
import HeaderToolbar from 'components/common/HeaderToolbar';

import { TeacherLearningWrapper } from './TeacherLearning.styled';

const TeacherLearning = () => {
  return (
    <TeacherLearningWrapper>
      <HeaderToolbar title={TITLES.TEACHER_LEARNING.LIST} />

      <TeacherLearningTable />
    </TeacherLearningWrapper>
  );
};

export default TeacherLearning;
