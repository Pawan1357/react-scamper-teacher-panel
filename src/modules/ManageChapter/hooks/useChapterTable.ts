import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';

import { FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import { useSearchParams } from 'react-router-dom';

import { ICommonPagination } from 'utils/Types';
import { PAGE_LIMIT } from 'utils/constants/enum';
import { buildSearchParams, debounce, getSortOrder } from 'utils/functions';

import { chapterHooks } from 'services/chapter';
import { IChapterBase } from 'services/chapter/types';

export const useChapterTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchVal, setSearchVal] = useState(searchParams.get('search') ?? '');

  const initialArgs: ICommonPagination = useMemo(
    () => ({
      page: Number(searchParams.get('page')) || PAGE_LIMIT.PAGE,
      limit: Number(searchParams.get('limit')) || PAGE_LIMIT.LIMIT,
      search: searchParams.get('search') || '',
      sort_by: searchParams.get('sort_by') || '',
      sort_order: searchParams.get('sort_order') || ''
    }),
    [searchParams]
  );

  const [args, setArgs] = useState<ICommonPagination>(initialArgs);

  const { data, isLoading } = chapterHooks.ChapterList(args);

  const isEmpty = !data?.chapters_list?.length;

  /** ----------------------------
   * Update Args + URL Query Params
   * ---------------------------- */
  const updateParamsAndArgs = useCallback(
    (newArgs: Partial<ICommonPagination>) => {
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
    sorter: SorterResult<IChapterBase> | SorterResult<IChapterBase>[]
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

  /** ----------------------------
   * Modal
   * ---------------------------- */

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
