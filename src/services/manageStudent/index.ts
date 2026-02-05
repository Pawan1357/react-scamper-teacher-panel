import { UseMutationOptions } from '@tanstack/react-query';

import { IApiError, IApiSuccess } from 'utils/Types';
import { defaultQueryOptions } from 'utils/constants';

import apiInstance from 'services/interceptor';
import { useApiMutation, useApiQuery } from 'services/masterHook';

import * as Types from './types';

const ApiEndPoints = {
  createStudent: () => `teacher-classroom/student/add`,
  updateStudent: () => `teacher-classroom/student/update`,
  getStudentById: (studentId: string) => `teacher-classroom/student/${studentId}`,
  deleteStudent: `teacher-classroom/student/remove`
};

export const manageStudentQueryKeys = {
  all: ['manageStudent'] as const,
  createStudent: () => ['createStudent'],
  updateStudent: () => ['updateStudent'],
  deleteStudent: ['deleteStudent'],
  getStudentById: (studentId: string) => [
    ...manageStudentQueryKeys.all,
    'getStudentById',
    studentId
  ]
};

export const manageStudentApi = {
  async createStudent(
    data: Types.ICreateStudentReq
  ): Promise<IApiSuccess<Types.ICreateStudentRes>> {
    return apiInstance
      .post(ApiEndPoints.createStudent(), data)
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async updateStudent(
    data: Types.IUpdateStudentReq
  ): Promise<IApiSuccess<Types.IUpdateStudentRes>> {
    return apiInstance
      .patch(ApiEndPoints.updateStudent(), data)
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async getStudentById(studentId: string): Promise<IApiSuccess<Types.IGetStudentByIdRes>> {
    return apiInstance
      .get(ApiEndPoints.getStudentById(studentId))
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async studentDelete(data: {
    classroom_id: number;
    student_id: number;
  }): Promise<IApiSuccess<Record<string, never>>> {
    return apiInstance
      .delete(ApiEndPoints.deleteStudent, { data: data })
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};

export const manageStudentHooks = {
  useCreateStudent: (
    mutationOptions?: UseMutationOptions<
      IApiSuccess<Types.ICreateStudentRes>,
      IApiError,
      Types.ICreateStudentReq
    >
  ) => {
    return useApiMutation({
      mutationKey: manageStudentQueryKeys.createStudent(),
      mutationFn: (data: Types.ICreateStudentReq) => manageStudentApi.createStudent(data),
      mutationOptions
    });
  },

  useUpdateStudent: (
    mutationOptions?: UseMutationOptions<
      IApiSuccess<Types.IUpdateStudentRes>,
      IApiError,
      Types.IUpdateStudentReq
    >
  ) => {
    return useApiMutation({
      mutationKey: manageStudentQueryKeys.updateStudent(),
      mutationFn: (data: Types.IUpdateStudentReq) => manageStudentApi.updateStudent(data),
      mutationOptions
    });
  },

  useGetStudentById: (studentId: string) => {
    return useApiQuery({
      queryKey: manageStudentQueryKeys.getStudentById(studentId),
      queryFn: () => manageStudentApi.getStudentById(studentId),
      queryOptions: {
        ...defaultQueryOptions,
        enabled: Boolean(studentId)
      }
    });
  },

  useDeleteStudent: (
    mutationOptions?: UseMutationOptions<
      IApiSuccess<Record<string, never>>,
      IApiError,
      {
        classroom_id: number;
        student_id: number;
      }
    >
  ) => {
    return useApiMutation({
      mutationKey: manageStudentQueryKeys.deleteStudent,
      mutationFn: (data) => manageStudentApi.studentDelete(data),
      mutationOptions
    });
  }
};
