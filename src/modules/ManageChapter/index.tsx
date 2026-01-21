import { TITLES } from 'utils/constants';

import ChapterTable from './components/ChapterTable';
import HeaderToolbar from 'components/common/HeaderToolbar';

import { ManageChapterWrapper } from './style';

const ViewChaptersList = () => {
  return (
    <ManageChapterWrapper>
      <HeaderToolbar title={TITLES.CHAPTER.LIST} />

      <ChapterTable />
    </ManageChapterWrapper>
  );
};

export default ViewChaptersList;
