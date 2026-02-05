import { useCallback, useMemo, useState } from 'react';

import { FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import { useSearchParams } from 'react-router-dom';

import { PAGE_LIMIT } from 'utils/constants/enum';
import { buildSearchParams, getSortOrder } from 'utils/functions';

import { classroomHooks } from 'services/classroom';
import { IChapterListItem } from 'services/classroom/types';

interface IAssignChaptersTableArgs {
  classroom_id: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}

export const useAssignChaptersTable = (classroomId: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // const [searchVal, setSearchVal] = useState(searchParams.get('search') ?? '');

  const initialArgs: IAssignChaptersTableArgs = useMemo(
    () => ({
      classroom_id: Number(classroomId) || 0,
      page: Number(searchParams.get('page')) || PAGE_LIMIT.PAGE,
      limit: Number(searchParams.get('limit')) || PAGE_LIMIT.LIMIT,
      search: '',
      sort_by: searchParams.get('sort_by') || '',
      sort_order: searchParams.get('sort_order') || ''
    }),
    [searchParams, classroomId]
  );

  const [args, setArgs] = useState<IAssignChaptersTableArgs>(initialArgs);

  const { data, isLoading } = classroomHooks.useGetChaptersList(classroomId, args);

  const isEmpty = !data?.chapters?.length;

  /** ----------------------------
   * Update Args + URL Query Params
   * ---------------------------- */
  const updateParamsAndArgs = useCallback(
    (newArgs: Partial<IAssignChaptersTableArgs>) => {
      const merged = {
        ...args,
        ...newArgs
      };

      setArgs(merged);
      setSearchParams(buildSearchParams(merged), { replace: true });
    },
    [args, setSearchParams]
  );

  /** ----------------------------
   * Table Sorting / Pagination
   * ---------------------------- */
  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IChapterListItem> | SorterResult<IChapterListItem>[]
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
  // const debouncedSearch = useRef(
  //   debounce((value: string) => {
  //     updateParamsAndArgs({ search: value.trim(), page: 1 });
  //   })
  // ).current;

  // const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setSearchVal(value);
  //   debouncedSearch(value);
  // };

  return {
    args,
    data,
    isLoading,
    isEmpty,
    // searchVal,
    // handleSearchChange,
    handleTableChange
  };
};
