export interface IChapterBase {
  id: number;
  name: string;
  link: string;
  description: string;
  thumbnail: string;
  lesson_count: number;
  activity_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  media: any[];
}

export interface IGetChaptersListRes {
  chapters_list: IChapterBase[];
  total_records: number;
}

export interface ILessonBase {
  id: number;
  name: string;
  description: string;
  sequence: number;
  is_active: boolean;
  created_at: string;
  activities_count: string;
}

export interface IActivityBase {
  id: number;
  lesson_id: number;
  name: string;
  description: string;
  sequence: number;
  type: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface IMediaItem {
  name: string;
  media_type: number;
  size?: number;
  originalname?: string;
}

export interface IDownloadableContent {
  name: string;
  type: number;
  is_downloadable: boolean;
  size?: number;
  originalname?: string;
}

export interface IRubricItem {
  parameter: string;
  exemplary: string;
  effective: string;
  acceptable: string;
  developing: string;
  incomplete: string;
  max_score: number;
}

export interface IGetChapterByIdReq {
  id: string;
}

export interface IGetChapterByIdRes {
  id: number;
  name: string;
  link: string;
  description: string;
  thumbnail: string;
  lesson_count: number;
  activity_count: number;
  is_published: boolean;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  media: {
    id: number;
    parent_type: string;
    media_url: string;
    media_type: number;
    thumbnail: any;
    is_downloadable: boolean;
    is_downloadable_content: boolean;
    originalname?: string;
    size?: number;
  }[];
  downloadable_content: {
    id: number;
    parent_type: string;
    media_url: string;
    media_type: number;
    thumbnail: string | null;
    is_downloadable: boolean;
    is_downloadable_content: boolean;
    originalname?: string;
    size?: number;
  }[];
  rubrics: {
    id: number;
    chapter_id: number;
    parameter: string;
    max_score: number;
    exemplary: string;
    effective: string;
    acceptable: string;
    developing: string;
    incomplete: string;
  }[];
  course_ids: number[];
  lessons: ILessonBase[];
}

export interface IListChaptersReq {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type IListChaptersRes = IListResponse<IChapterBase>;

// Lesson
export interface ISpinConfig {
  section_number: number;
  points: number;
  title: string;
  description: string;
  media_url: string;
}

export interface ITeacherGuidelineItemReq {
  title: string;
  description: string;
  media: IMediaItem[];
  downloadable_content: IDownloadableContent[];
}

export interface ITeacherGuidelineItemRes {
  title: string;
  description: string;
  media: {
    id: number;
    parent_type: string;
    media_url: string;
    media_type: number;
    thumbnail: string | null;
    is_downloadable: boolean;
    is_downloadable_content: boolean;
  }[];
  downloadable_content: {
    id: number;
    parent_type: string;
    media_url: string;
    media_type: number;
    thumbnail: string | null;
    is_downloadable: boolean;
    is_downloadable_content: boolean;
  }[];
}

export interface IGetLessonsListRes {
  id: number;
  name: string;
  description: string;
  sequence: number;
  is_active: boolean;
  created_at: string;
}

export interface IGetLessonByIdRes {
  id: number;
  chapter_id: number;
  name: string;
  description: string;
  sequence: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  activities: any[];
  spin_configs: SpinConfig[];
  media: Medum[];
  downloadable_content: DownloadableContent[];
  teacher_guidelines: TeacherGuidelines;
}

export interface SpinConfig {
  id: number;
  lesson_id: number;
  section_number: number;
  points: number;
  title: string;
  description: string;
  media_url: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Medum {
  id: number;
  parent_type: string;
  parent_id: number;
  media_url: string;
  media_type: number;
  thumbnail: any;
  size?: number;
  originalname?: string;
  is_downloadable: boolean;
  is_downloadable_content: boolean;
}

export interface DownloadableContent {
  id: number;
  parent_type: string;
  parent_id: number;
  media_url: string;
  media_type: number;
  thumbnail: any;
  is_downloadable: boolean;
  is_downloadable_content: boolean;
  originalname?: string;
  size?: number;
}

export interface TeacherGuidelines {
  id: number;
  lesson_id: number;
  title: string;
  description: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  media: Medum2[];
  downloadable_content: DownloadableContent2[];
}

export interface Medum2 {
  id: number;
  parent_type: string;
  parent_id: number;
  media_url: string;
  media_type: number;
  thumbnail: any;
  is_downloadable: boolean;
  is_downloadable_content: boolean;
  originalname?: string;
  size?: number;
}

export interface DownloadableContent2 {
  id: number;
  parent_type: string;
  parent_id: number;
  media_url: string;
  media_type: number;
  thumbnail: any;
  is_downloadable: boolean;
  is_downloadable_content: boolean;
  originalname?: string;
  size?: number;
}

export type IListLessonsRes = IListResponse<ILessonBase>;

export interface MediaItem {
  name: string;
  media_type: number;
  size: number;
  originalname: string;
}

export interface IQuestion {
  id?: number;
  title: string;
  description: string;
  sequence: number;
  no_of_rows: number;
  no_of_columns: number;
  fictitious_wallet_points: string;
  wallet_value?: number;
  mcq_options?: McqOption[];
  match_pair_options?: MatchPairOption[];
  drag_drop_bases?: DragDropBase[];
  drag_drop_options?: DragDropOption[];
  media?: MediaItem[];
}

export interface QuestionItem {
  id: number;
  title: string;
  description: string;
  media: MediaItem[];

  mcq_options?: McqOption[];
  match_pair_options?: MatchPairOption[];

  no_of_rows?: number;
  no_of_columns?: number;
  fictitious_wallet_points?: string;
  wallet_value?: number;

  drag_drop_bases?: DragDropBase[];
  drag_drop_options?: DragDropOption[];
}

export interface McqOption {
  id?: number;
  option_text: string;
  option_image?: string;
  is_correct: boolean;
  total_points: number;
  sequence: number;
}

export interface MatchPairOption {
  id?: number;
  left_text?: string;
  left_image?: string;
  right_text?: string;
  right_image?: string;
  total_points: number;
  sequence: number;
}

export interface DragDropBase {
  id?: number;
  position: string;
  base_text?: string;
  base_image?: string;
  sequence: number;
}

export interface DragDropOption {
  id?: number;
  option_text?: string;
  option_image?: string;
  total_points: number;
  correct_positions: DragDropCorrectPosition[];
  sequence: number;
}

export interface DragDropCorrectPosition {
  position: string;
}

export interface IGetActivityByIdRes {
  id: number;
  lesson_id: number;
  name: string;
  description: string;
  sequence: number;
  type: string;
  chapter_name?: string;
  lesson_name?: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  media: Medum[];
  questions: Question[];
}

export interface Question {
  id: number;
  activity_id: number;
  title: string;
  description: string;
  sequence: number;
  no_of_rows: any;
  no_of_columns: any;
  fictitious_wallet_points: any;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  drag_drop_bases?: any;
  drag_drop_options?: any;
  updated_at: string;
  media: any[];
  options: any[];
}

export interface IListActivitiesRes {
  created_at: string;
  description: string;
  id: number;
  is_active: boolean;
  lesson_id: number;
  name: string;
  sequence: number;
  type: 'mcq' | 'match_pair' | 'drag_and_drop' | string;
}
