import { UseMutationOptions } from '@tanstack/react-query';

import { IApiError, IApiSuccess, ICommonPagination } from 'utils/Types';
import { defaultQueryOptions } from 'utils/constants';

import apiInstance from 'services/interceptor';
import { useApiMutation, useApiQuery } from 'services/masterHook';

import * as Types from './types';

export const classroomApiEndPoints = {
  getClassroomsList: `classroom/list`,
  getTeacherClassroomsList: `teacher-classroom/list`,
  getClassroomById: (id: string) => `classroom/view/${id}`,
  getTeacherClassroomById: (id: string) => `teacher-classroom/${id}`,
  getClassroomStudentsList: `teacher-classroom/students/list`,
  getChaptersList: `teacher-classroom/chapters/list`,
  assignUnassignChapters: `teacher-classroom/chapters/assign-unassign`,
  toggleArchive: (id: string) => `teacher-classroom/${id}/toggle-economy`,
  toggleArchiveStatus: (id: string) => `teacher-classroom/${id}/toggle-archive`,
  getGoogleClassroomAuthUrl: `teacher-classroom/google-classroom/auth-url`,
  getGoogleClassroomsList: `teacher-classroom/google/fetch`,
  importClassrooms: `teacher-classroom/google-classroom/import`,
  importExcelClassrooms: `teacher-classroom/excel/import`,
  syncClassroom: `teacher-classroom/sync`
};

export const classroomQueryKeys = {
  all: ['classroom'] as const,
  getClassroomsList: (args: ICommonPagination) => [
    ...classroomQueryKeys.all,
    `getClassroomsList`,
    args
  ],
  getTeacherClassroomsList: (args: ICommonPagination) => [
    ...classroomQueryKeys.all,
    `getTeacherClassroomsList`,
    args
  ],
  getClassroomById: (id: string) => [...classroomQueryKeys.all, `getClassroomById`, id],
  getTeacherClassroomById: (id: string) => [
    ...classroomQueryKeys.all,
    `getTeacherClassroomById`,
    id
  ],
  getClassroomStudentsList: (classroomId: string, args: ICommonPagination) => [
    ...classroomQueryKeys.all,
    `getClassroomStudentsList`,
    classroomId,
    args
  ],
  getChaptersList: (classroomId: string, args: Types.IChaptersListReq) => [
    ...classroomQueryKeys.all,
    `getChaptersList`,
    classroomId,
    args
  ],
  assignUnassignChapters: () => [...classroomQueryKeys.all, 'assignUnassignChapters'],
  toggleArchive: () => [...classroomQueryKeys.all, 'toggleArchive'],
  toggleArchiveStatus: () => [...classroomQueryKeys.all, 'toggleArchiveStatus'],
  getGoogleClassroomAuthUrl: () => [...classroomQueryKeys.all, 'getGoogleClassroomAuthUrl'],
  getGoogleClassroomsList: () => ['getGoogleClassroomsList'],
  importClassrooms: ['importClassrooms'],
  importExcelClassrooms: ['importExcelClassrooms'],
  syncClassroom: ['syncClassroom']
};

export const classroomApi = {
  getClassroomsList: (args: ICommonPagination) => {
    return apiInstance
      .post(classroomApiEndPoints.getClassroomsList, args)
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  getTeacherClassroomsList: (args: ICommonPagination): Promise<Types.IGetClassroomsListRes> => {
    return apiInstance
      .post(classroomApiEndPoints.getTeacherClassroomsList, args)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  getClassroomById: (id: string) => {
    return apiInstance
      .get(classroomApiEndPoints.getClassroomById(id))
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  getTeacherClassroomById: (id: string): Promise<IApiSuccess<Types.IGetClassroomView>> => {
    return apiInstance
      .get(classroomApiEndPoints.getTeacherClassroomById(id))
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  getClassroomStudentsList: (
    args: Types.IClassroomStudentListReq
  ): Promise<Types.IGetClassroomStudentsListRes> => {
    return apiInstance
      .post(classroomApiEndPoints.getClassroomStudentsList, args)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  getChaptersList: (args: Types.IChaptersListReq): Promise<Types.IGetChaptersListRes> => {
    return apiInstance
      .post(classroomApiEndPoints.getChaptersList, args)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  assignUnassignChapters: (
    args: Types.IAssignUnassignChaptersReq
  ): Promise<IApiSuccess<Record<string, never>>> => {
    return apiInstance
      .post(classroomApiEndPoints.assignUnassignChapters, args)
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  toggleArchive: (id: string): Promise<IApiSuccess<Record<string, never>>> => {
    return apiInstance
      .patch(classroomApiEndPoints.toggleArchive(id))
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  toggleArchiveStatus: (id: string): Promise<IApiSuccess<Record<string, never>>> => {
    return apiInstance
      .patch(classroomApiEndPoints.toggleArchiveStatus(id))
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  getGoogleClassroomAuthUrl: async (): Promise<IApiSuccess<{ auth_url: string }>> => {
    return apiInstance
      .get(classroomApiEndPoints.getGoogleClassroomAuthUrl)
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  getGoogleClassroomsList: async (): Promise<Types.IGoogleClassroom[]> => {
    return apiInstance
      .get(classroomApiEndPoints.getGoogleClassroomsList)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  importClassroomList: async (data: {
    classrooms: Types.IImportClassrooms[];
  }): Promise<IApiSuccess<Record<string, never>>> => {
    return apiInstance
      .post(classroomApiEndPoints.importClassrooms, data)
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  importClassroomExcelList: async (data: {
    classroom_name: string;
    students: Types.IImportExcelClassrooms[];
  }): Promise<IApiSuccess<any>> => {
    return apiInstance
      .post(classroomApiEndPoints.importExcelClassrooms, data)
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  },
  syncClassroom: async (data: {
    classroom_id: number;
  }): Promise<IApiSuccess<Record<string, never>>> => {
    return apiInstance
      .post(classroomApiEndPoints.syncClassroom, data)
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};

export const classroomHooks = {
  useGetClassroomsList: (args: ICommonPagination) => {
    return useApiQuery({
      queryKey: classroomQueryKeys.getClassroomsList(args),
      queryFn: () => classroomApi.getClassroomsList(args),
      queryOptions: { ...defaultQueryOptions }
    });
  },
  TeacherClassroomList: (args: ICommonPagination) => {
    return useApiQuery({
      queryKey: classroomQueryKeys.getTeacherClassroomsList(args),
      queryFn: () => classroomApi.getTeacherClassroomsList(args),
      queryOptions: { ...defaultQueryOptions }
    });
  },
  useGetClassroomById: (id: string) => {
    return useApiQuery({
      queryKey: classroomQueryKeys.getClassroomById(id),
      queryFn: () => classroomApi.getClassroomById(id),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(id) }
    });
  },
  useGetTeacherClassroomById: (id: string, enabled: boolean = true) => {
    return useApiQuery({
      queryKey: classroomQueryKeys.getTeacherClassroomById(id),
      queryFn: () => classroomApi.getTeacherClassroomById(id),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(id) && enabled }
    });
  },
  useGetClassroomStudentsList: (classroomId: string, args: Types.IClassroomStudentListReq) => {
    return useApiQuery({
      queryKey: classroomQueryKeys.getClassroomStudentsList(classroomId, args),
      queryFn: () => classroomApi.getClassroomStudentsList(args),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(classroomId) }
    });
  },
  useGetChaptersList: (classroomId: string, args: Types.IChaptersListReq) => {
    return useApiQuery({
      queryKey: classroomQueryKeys.getChaptersList(classroomId, args),
      queryFn: () => classroomApi.getChaptersList(args),
      queryOptions: { ...defaultQueryOptions, enabled: Boolean(classroomId) }
    });
  },
  useAssignUnassignChapters: () => {
    return useApiMutation({
      mutationKey: classroomQueryKeys.assignUnassignChapters(),
      mutationFn: (args: Types.IAssignUnassignChaptersReq) =>
        classroomApi.assignUnassignChapters(args)
    });
  },
  useGetGoogleClassroomAuthUrl: (
    mutationOptions?: UseMutationOptions<IApiSuccess<{ auth_url: string }>, IApiError, void>
  ) => {
    return useApiMutation({
      mutationKey: classroomQueryKeys.getGoogleClassroomAuthUrl(),
      mutationFn: () => classroomApi.getGoogleClassroomAuthUrl(),
      mutationOptions: mutationOptions as Omit<
        UseMutationOptions<IApiSuccess<{ auth_url: string }>, IApiError, void>,
        'mutationFn' | 'mutationKey'
      >
    });
  },
  useGetGoogleClassroomsList: (queryOptions?: { enabled?: boolean }) => {
    return useApiQuery({
      queryKey: classroomQueryKeys.getGoogleClassroomsList(),
      queryFn: () => classroomApi.getGoogleClassroomsList(),
      queryOptions: { ...defaultQueryOptions, ...queryOptions }
    });
  },

  useImportClassrooms: () => {
    return useApiMutation({
      mutationKey: classroomQueryKeys.importClassrooms,
      mutationFn: (data: { classrooms: Types.IImportClassrooms[] }) =>
        classroomApi.importClassroomList(data)
    });
  },
  useImportExcelClassrooms: () => {
    return useApiMutation({
      mutationKey: classroomQueryKeys.importExcelClassrooms,
      mutationFn: (data: { classroom_name: string; students: Types.IImportExcelClassrooms[] }) =>
        classroomApi.importClassroomExcelList(data)
    });
  },
  useSyncClassroom: () => {
    return useApiMutation({
      mutationKey: classroomQueryKeys.syncClassroom,
      mutationFn: (data: { classroom_id: number }) => classroomApi.syncClassroom(data)
    });
  },

  useToggleEconomy: () => {
    return useApiMutation({
      mutationKey: classroomQueryKeys.toggleArchive(),
      mutationFn: (id: string) => classroomApi.toggleArchive(id)
    });
  },
  useToggleArchiveStatus: () => {
    return useApiMutation({
      mutationKey: classroomQueryKeys.toggleArchiveStatus(),
      mutationFn: (id: string) => classroomApi.toggleArchiveStatus(id)
    });
  }
};
