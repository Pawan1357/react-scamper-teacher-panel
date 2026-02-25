import { useCallback, useMemo, useState } from 'react';

import { FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';

import { PAGE_LIMIT } from 'utils/constants/enum';
import { getSortOrder } from 'utils/functions';

import { classroomHooks } from 'services/classroom';
import { IChapterStudentListItem } from 'services/classroom/types';

interface IChapterStudentsTableArgs {
  chapter_id: number;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}

export const useChapterStudentsTable = (chapterId: string) => {
  const initialArgs: IChapterStudentsTableArgs = useMemo(
    () => ({
      chapter_id: Number(chapterId) || 0,
      page: PAGE_LIMIT.PAGE,
      limit: PAGE_LIMIT.LIMIT,
      search: '',
      sort_by: '',
      sort_order: ''
    }),
    [chapterId]
  );

  const [args, setArgs] = useState<IChapterStudentsTableArgs>(initialArgs);

  const { data, isLoading } = classroomHooks.useGetChapterStudentsList(chapterId, args);

  const isEmpty = !data?.student_list?.length;

  /** ----------------------------
   * Update Args
   * ---------------------------- */
  const updateParamsAndArgs = useCallback(
    (newArgs: Partial<IChapterStudentsTableArgs>) => {
      const merged = {
        ...args,
        ...newArgs,
        chapter_id: Number(chapterId) || 0
      };

      setArgs(merged);
    },
    [args, chapterId]
  );

  /** ----------------------------
   * Table Sorting / Pagination
   * ---------------------------- */
  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IChapterStudentListItem> | SorterResult<IChapterStudentListItem>[]
  ) => {
    if (Array.isArray(sorter)) return;

    updateParamsAndArgs({
      page: pagination.current ?? 1,
      limit: pagination.pageSize ?? 10,
      sort_by: sorter.order ? String(sorter.field) : '',
      sort_order: getSortOrder(sorter.order) || ''
    });
  };

  return {
    args,
    data,
    isLoading,
    isEmpty,
    handleTableChange
  };
};
