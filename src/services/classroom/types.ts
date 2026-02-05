export interface IClassroomBase {
  id: number;
  teacher_id: number;
  school_id: number;
  name: string;
  google_classroom_id: string;
  description: any;
  section: string;
  room: string;
  enrollment_code: string;
  sync_enabled: boolean;
  last_synced_at: string;
  economy: boolean;
  status: string;
  add_via: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  student_count: number;
  assigned_chapters?: number;
}

export interface ITeacherFolder {
  id: string;
  title: string;
  alternateLink: string;
}

export interface IGoogleClassroom {
  classroom_id: string;
  class_name: string;
  description: string;
  section: string;
  room: string;
  enrollment_code: string;
  number_of_students: number;
  last_updated: string;
  alternate_link: string;
  teacher_folder: ITeacherFolder;
}

export interface IGoogleClassroomsListRes {
  data: IGoogleClassroom[];
}

export interface IImportGoogleClassroomsReq {
  classroom_ids: string[];
}

export interface IImportClassrooms {
  classroom_id?: string;
  class_name?: string;
  description?: string;
  section?: string;
  room?: string;
  enrollment_code?: string;
}

export interface IGetClassroomsListRes {
  classroom_list: IClassroomBase[];
  total_records: number;
}

export interface IGetClassroomView {
  id: number;
  teacher_id: number;
  school_id: number;
  name: string;
  google_classroom_id: string;
  description: any;
  section: string;
  room: string;
  enrollment_code: string;
  sync_enabled: boolean;
  last_synced_at: string;
  economy: boolean;
  status: string;
  assigned_chapters?: AssignedChapters[];
  add_via: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  classroom_students: ClassroomStudent[];
}

export interface AssignedChapters {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  link: string;
  lesson_count: number;
  activity_count: number;
  assigned_at: string;
}

export interface ClassroomStudent {
  id: number;
  classroom_id: number;
  student_id: number;
  google_student_id: string;
  enrollment_status: string;
  added_via: string;
  last_synced_at: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface IClassroomStudentListReq {
  classroom_id: number;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface IStudentListItem {
  id: number;
  school_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_photo: any;
  google_student_id: string;
  student_school_id: any;
  password: any;
  reset_token: string;
  reset_expires: string;
  is_onboarded: boolean;
  last_login: any;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface IGetClassroomStudentsListRes {
  student_list: IStudentListItem[];
  total_records: number;
}

export interface IImportExcelClassrooms {
  first_name: string;
  last_name: string;
  email: string;
}

export interface IChapterListItem {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  link: string;
  lesson_count: number;
  activity_count: number;
  status: string;
}

export interface IGetChaptersListRes {
  chapters: IChapterListItem[];
  total_records: number;
}

export interface IChaptersListReq {
  classroom_id: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}

export interface IChapterAssignUnassignItem {
  id: number;
  status: 'assigned' | 'unassigned';
}

export interface IAssignUnassignChaptersReq {
  classroom_id: number;
  chapters: IChapterAssignUnassignItem[];
}
