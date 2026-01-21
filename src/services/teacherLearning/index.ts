import { UseMutationOptions } from '@tanstack/react-query';

import { ICommonPagination } from 'utils/Types';
import { IApiError } from 'utils/Types';
import { defaultQueryOptions } from 'utils/constants';

import apiInstance from 'services/interceptor';
import { useApiMutation, useApiQuery } from 'services/masterHook';

import * as Types from './types';

export const ApiEndPoints = {
  teacherLearningList: `teacher-learning/list`,
  getTeacherLearningById: (teacherLearningId: string) =>
    `teacher-learning/view/${teacherLearningId}`,

  getTLActivityById: (activityId: string) => `teacher-learning/activity/${activityId}`,
  startActivityProgress: (activityId: string) => `teacher-activity-progress/${activityId}/start`,
  getActivityQuestion: (activityId: string, questionId?: number) => {
    const baseUrl = `teacher-activity-progress/${activityId}/question`;
    return questionId ? `${baseUrl}?question_id=${Number(questionId)}` : baseUrl;
  },
  submitAnswer: (activityId: string) => `teacher-activity-progress/${activityId}/submit-answer`
};

export const teacherLearningQueryKey = {
  all: ['teacherLearning'] as const,

  teacherLearningList: (args: ICommonPagination) => [
    ...teacherLearningQueryKey.all,
    'teacherLearningList',
    args
  ],
  getTeacherLearningById: (teacherLearningId: string) => [
    ...teacherLearningQueryKey.all,
    'getTeacherLearningById',
    teacherLearningId
  ],
  getTLActivityById: (activityId: string) => [
    ...teacherLearningQueryKey.all,
    'getTLActivityById',
    activityId
  ],
  getActivityQuestion: (activityId: string, questionId?: number) => [
    ...teacherLearningQueryKey.all,
    'getActivityQuestion',
    activityId,
    questionId
  ]
};

export const teacherLearningApi = {
  async getTeacherLearningList(data: ICommonPagination): Promise<Types.IGetTeacherLearningListRes> {
    return apiInstance
      .post(ApiEndPoints.teacherLearningList, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getTeacherLearningById(
    teacherLearningId: string
  ): Promise<Types.IGetTeacherLearningByIdRes> {
    return apiInstance
      .post(ApiEndPoints.getTeacherLearningById(teacherLearningId))
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getTLActivityById(activityId: string): Promise<Types.IGetTLActivityByIdRes> {
    return apiInstance
      .get(ApiEndPoints.getTLActivityById(activityId))
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async startActivityProgress(activityId: string): Promise<Types.IStartActivityProgressRes> {
    return apiInstance
      .post(ApiEndPoints.startActivityProgress(activityId))
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getActivityQuestion(
    activityId: string,
    questionId?: number
  ): Promise<Types.IGetActivityQuestionRes> {
    return apiInstance
      .get(ApiEndPoints.getActivityQuestion(activityId, questionId))
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async submitAnswer(
    activityId: string,
    data: Types.ISubmitAnswerReq
  ): Promise<Types.ISubmitAnswerRes> {
    return apiInstance
      .post(ApiEndPoints.submitAnswer(activityId), data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};

export const teacherLearningHooks = {
  TeacherLearningList: (args: ICommonPagination) => {
    return useApiQuery({
      queryKey: teacherLearningQueryKey.teacherLearningList(args),
      queryFn: () => teacherLearningApi.getTeacherLearningList(args),
      queryOptions: { ...defaultQueryOptions }
    });
  },

  useGetTeacherLearningById: (teacherLearningId: string) => {
    return useApiQuery({
      queryKey: teacherLearningQueryKey.getTeacherLearningById(teacherLearningId),
      queryFn: () => teacherLearningApi.getTeacherLearningById(teacherLearningId),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(teacherLearningId) }
    });
  },

  useGetTLActivityById: (activityId: string) => {
    return useApiQuery({
      queryKey: teacherLearningQueryKey.getTLActivityById(activityId),
      queryFn: () => teacherLearningApi.getTLActivityById(activityId),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(activityId) }
    });
  },

  useGetActivityQuestion: (activityId: string, enabled: boolean = true, questionId?: number) => {
    return useApiQuery({
      queryKey: teacherLearningQueryKey.getActivityQuestion(activityId, questionId),
      queryFn: () => teacherLearningApi.getActivityQuestion(activityId, questionId),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(activityId) && enabled }
    });
  },

  useStartActivityProgress: (
    mutationOptions?: UseMutationOptions<Types.IStartActivityProgressRes, IApiError, string>
  ) => {
    return useApiMutation({
      mutationKey: [...teacherLearningQueryKey.all, 'startActivityProgress'],
      mutationFn: (activityId: string) => teacherLearningApi.startActivityProgress(activityId),
      mutationOptions
    });
  },

  useSubmitAnswer: (
    mutationOptions?: UseMutationOptions<
      Types.ISubmitAnswerRes,
      IApiError,
      { activityId: string; data: Types.ISubmitAnswerReq }
    >
  ) => {
    return useApiMutation({
      mutationKey: [...teacherLearningQueryKey.all, 'submitAnswer'],
      mutationFn: ({ activityId, data }: { activityId: string; data: Types.ISubmitAnswerReq }) =>
        teacherLearningApi.submitAnswer(activityId, data),
      mutationOptions
    });
  }
};
