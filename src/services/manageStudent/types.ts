export interface ICreateStudentReq {
  classroom_id: number;
  first_name: string;
  last_name: string;
  email: string;
  student_school_id?: string;
  profile_photo?: string;
}

export interface IUpdateStudentReq {
  first_name: string;
  last_name: string;
  student_school_id?: string;
  profile_photo?: string;
  student_id: number;
}

export interface ICreateStudentRes {
  id: number;
  message: string;
}

export interface IUpdateStudentRes {
  message: string;
}

export interface IGetStudentByIdRes {
  id: number;
  school_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_photo: string;
  google_student_id: any;
  student_school_id: string;
  password: any;
  reset_token: string;
  reset_expires: string;
  is_onboarded: boolean;
  last_login: any;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  classroom_students: ClassroomStudent[];
  classrooms: Classroom2[];
  assigned_classrooms?: StudentAssignedClassroom[];
  assigned_chapters?: StudentAssignedChapters[];
}

export interface StudentAssignedChapters {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  link: string;
  lesson_count: number;
  activity_count: number;
  assigned_by: AssignedBy;
  assigned_date: string;
  progress_percentage: number;
  is_completed: boolean;
  status: string;
  started_at: any;
  completed_at: any;
  last_accessed_at: any;
}

export interface AssignedBy {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_photo: string;
}

export interface StudentAssignedClassroom {
  classroom_id: number;
  classroom_name: string;
  enrollment_status: string;
  added_via: string;
  created_at: string;
  creator: Creator;
  status: string;
}

export interface Creator {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_photo: string;
}

export interface ClassroomStudent {
  id: number;
  classroom_id: number;
  student_id: number;
  google_student_id: any;
  enrollment_status: string;
  added_via: string;
  last_synced_at: any;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  classroom: Classroom;
}

export interface Classroom {
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
}

export interface Classroom2 {
  classroom_id: number;
  classroom_name: string;
  enrollment_status: string;
  added_via: string;
  created_at: string;
}

export interface IStudentClassroom {
  id: number;
  classroom_name: string;
  creator: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_photo?: string;
  };
  status: string;
  created_from: string;
  updated_at: string;
}

export interface IStudentChapter {
  id: number;
  chapter_id: number;
  chapter_name: string;
  assigned_by: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_photo?: string;
  };
  assigned_date: string;
  lessons: number;
  status: string;
}
