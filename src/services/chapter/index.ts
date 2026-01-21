import { IApiSuccess, ICommonPagination } from 'utils/Types';
import { defaultQueryOptions } from 'utils/constants';

import apiInstance from 'services/interceptor';
import { useApiQuery } from 'services/masterHook';

import * as Types from './types';

const ApiEndPoints = {
  getChaptersList: `chapter/findAll`,
  getLessonsList: `lesson/findAll`,
  getActivitiesList: (lessonId: number) => `activity/findAll?lesson_id=${lessonId}`,

  getChapterById: (chapterId: string) => `/chapter/view/${chapterId}`,
  getLessonById: (lessonId: string) => `/lesson/view/${lessonId}`,
  getActivityById: (activityId: string) => `/activity/${activityId}`
};

export const chapterQueryKey = {
  all: ['chapter'] as const,
  getChaptersList: (args: ICommonPagination) => [...chapterQueryKey.all, `getChaptersList`, args],
  getLessonsList: (chapterId: string) => [...chapterQueryKey.all, `getLessonsList`, chapterId],
  getActivitiesList: (lessonId: number) => [...chapterQueryKey.all, `getActivitiesList`, lessonId],

  getChapterById: (chapterId: string) => [...chapterQueryKey.all, `getChapterById`, chapterId],
  getLessonById: (lessonId: string) => [...chapterQueryKey.all, `getLessonById`, lessonId],
  getActivityById: (id: string) => [...chapterQueryKey.all, `getActivityById`, id]
};

// API
export const chapterApi = {
  async getChaptersList(data: ICommonPagination): Promise<Types.IGetChaptersListRes> {
    return apiInstance
      .post(ApiEndPoints.getChaptersList, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getLessonsList(data: { chapter_id: number | null }): Promise<Types.IGetLessonsListRes[]> {
    return apiInstance
      .post(ApiEndPoints.getLessonsList, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  // get activities list type remaining to change
  async getActivitiesList(lessonId: number): Promise<Types.IListActivitiesRes[]> {
    return apiInstance
      .get(ApiEndPoints.getActivitiesList(lessonId))
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  // Get by ID
  async getChapterById(chapterId: string): Promise<IApiSuccess<Types.IGetChapterByIdRes>> {
    return apiInstance
      .get(ApiEndPoints.getChapterById(chapterId))
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getLessonById(lessonId: string): Promise<IApiSuccess<Types.IGetLessonByIdRes>> {
    return apiInstance
      .get(ApiEndPoints.getLessonById(lessonId))
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getActivityById(id: string): Promise<IApiSuccess<Types.IGetActivityByIdRes>> {
    return apiInstance
      .get(ApiEndPoints.getActivityById(id))
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};

// hooks
export const chapterHooks = {
  ChapterList: (args: ICommonPagination) => {
    return useApiQuery({
      queryKey: chapterQueryKey.getChaptersList(args),
      queryFn: () => chapterApi.getChaptersList(args),
      queryOptions: { ...defaultQueryOptions }
    });
  },

  LessonList: (chapterId: string) => {
    return useApiQuery({
      queryKey: chapterQueryKey.getLessonsList(chapterId),
      queryFn: () =>
        chapterApi.getLessonsList({ chapter_id: chapterId ? Number(chapterId) : null }),
      queryOptions: { ...defaultQueryOptions }
    });
  },

  ActivityList: (lessonId: number) => {
    return useApiQuery({
      queryKey: chapterQueryKey.getActivitiesList(lessonId),
      queryFn: () => chapterApi.getActivitiesList(Number(lessonId)),
      queryOptions: { ...defaultQueryOptions }
    });
  },

  useGetChapterById: (chapterId: string) => {
    return useApiQuery({
      queryKey: chapterQueryKey.getChapterById(chapterId),
      queryFn: () => chapterApi.getChapterById(chapterId),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(chapterId) }
    });
  },

  useGetLessonById: (lessonId: string) => {
    return useApiQuery({
      queryKey: chapterQueryKey.getLessonById(lessonId),
      queryFn: () => chapterApi.getLessonById(lessonId),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(lessonId) }
    });
  },

  useGetActivityById: (id: string) => {
    return useApiQuery({
      queryKey: chapterQueryKey.getActivityById(id),
      queryFn: () => chapterApi.getActivityById(id),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(id) }
    });
  }
};
