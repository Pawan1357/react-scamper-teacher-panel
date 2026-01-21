import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';

import { TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useSearchParams } from 'react-router-dom';

import { ICommonPagination } from 'utils/Types';
import { PAGE_LIMIT } from 'utils/constants/enum';
import { buildSearchParams, debounce, getSortOrder } from 'utils/functions';

import { teacherLearningHooks } from 'services/teacherLearning';
import { IGetTeacherLearningListRes } from 'services/teacherLearning/types';

export const useTeacherLearning = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchVal, setSearchVal] = useState('');

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
  const { data, isLoading } = teacherLearningHooks.TeacherLearningList(args);

  const teacherLearningList = useMemo(() => {
    return data?.teacher_learning_list?.map((item) => {
      return {
        id: item.id,
        chapter_id: item.chapter.id,
        chapter_name: item.chapter.name,
        lesson_count: item.lesson_count,
        activity_count: item.activity_count,
        is_published: item.is_published,
        created_at: item.created_at,
        status: item?.status,
        total_question: item?.total_question,
        correct_question: item?.correct_question
      };
    });
  }, [data]);

  const isEmpty = !data?.teacher_learning_list?.length;

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
    sorter: SorterResult<IGetTeacherLearningListRes> | SorterResult<IGetTeacherLearningListRes>[]
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
    handleTableChange,
    teacherLearningList,
    totalRecords: data?.total_records
  };
};
