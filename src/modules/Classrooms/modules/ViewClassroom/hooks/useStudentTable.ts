import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';

import { FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';

import { ICommonPagination } from 'utils/Types';
import { PAGE_LIMIT } from 'utils/constants/enum';
import { debounce, getSortOrder } from 'utils/functions';

import { classroomHooks } from 'services/classroom';
import { IStudentListItem } from 'services/classroom/types';

interface IStudentTableArgs extends ICommonPagination {
  classroom_id: number;
}

export const useStudentTable = (classroomId: string) => {
  const [searchVal, setSearchVal] = useState('');

  const initialArgs: IStudentTableArgs = useMemo(
    () => ({
      classroom_id: Number(classroomId) || 0,
      page: PAGE_LIMIT.PAGE,
      limit: PAGE_LIMIT.LIMIT,
      search: '',
      sort_by: '',
      sort_order: ''
    }),
    [classroomId]
  );

  const [args, setArgs] = useState<IStudentTableArgs>(initialArgs);

  const { data, isLoading } = classroomHooks.useGetClassroomStudentsList(classroomId, args);

  const isEmpty = !data?.student_list?.length;

  /** ----------------------------
   * Update Args + URL Query Params
   * ---------------------------- */
  const updateParamsAndArgs = useCallback(
    (newArgs: Partial<IStudentTableArgs>) => {
      const merged = {
        ...args,
        ...newArgs,
        classroom_id: Number(classroomId) || 0
      };

      setArgs(merged);
    },
    [args, classroomId]
  );

  /** ----------------------------
   * Table Sorting / Pagination
   * ---------------------------- */
  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IStudentListItem> | SorterResult<IStudentListItem>[]
  ) => {
    if (Array.isArray(sorter)) return;

    updateParamsAndArgs({
      page: pagination.current ?? 1,
      limit: pagination.pageSize ?? 10,
      sort_by: sorter.order ? String(sorter.field) : '',
      sort_order: getSortOrder(sorter.order) || ''
    });
  };

  /** ----------------------------
   * Debounced Search
   * ---------------------------- */
  const debouncedSearch = useRef(
    debounce((value: string) => {
      updateParamsAndArgs({ search: value.trim(), page: 1 });
    })
  ).current;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchVal(value);
    debouncedSearch(value);
  };

  return {
    args,
    data,
    isLoading,
    isEmpty,
    searchVal,
    handleSearchChange,
    handleTableChange
  };
};
