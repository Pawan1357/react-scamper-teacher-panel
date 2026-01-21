import { IDownloadableContentItem, IMedia } from 'components/common/Media/types';

export interface IGetTeacherLearningListRes {
  teacher_learning_list: TeacherLearningList[];
  total_records: number;
}

export interface TeacherLearningList {
  id: number;
  chapter_id: number;
  lesson_count: number;
  activity_count: number;
  is_active: boolean;
  is_deleted: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  chapter: Chapter;
  total_question?: number | null;
  correct_question?: number | null;
  status: string | null;
}

export interface Chapter {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  link: string;
}

export interface IGetTeacherLearningByIdRes {
  id: number;
  chapter_id: number;
  lesson_count: number;
  activity_count: number;
  is_active: boolean;
  is_deleted: boolean;
  is_published: boolean;
  publish_date: any;
  created_at: string;
  updated_at: string;
  lessons: ILesson[];
  chapter: IChapter;
}

export interface ILesson {
  id: number;
  chapter_id: number;
  teacher_learning_id: number;
  name: string;
  description: string;
  sequence: number;
  is_active: boolean;
  is_deleted: boolean;
  is_published: boolean;
  publish_date: any;
  created_at: string;
  updated_at: string;
  activities: Activity[];
  media: IMedia[];
  downloadable_content: IDownloadableContentItem[];
}

export interface Activity {
  id: number;
  tl_lesson_id: number;
  name: string;
  description: string;
  sequence: number;
  type: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  total_score: number;
  total_questions: number;
  status: string;
  correct_answers: number;
}

export interface IChapter {
  id: number;
  name: string;
  link: any;
  description: string;
  thumbnail: string;
}

export interface IGetTLActivityByIdRes {
  id: number;
  name: string;
  description: string;
  is_deleted: boolean;
  is_active: boolean;
  type: string;
  created_at: string;
  updated_at: string;
  sequence: number;
  lesson_id: number;
  lesson_name: string;
  chapter_id: number;
  chapter_name: string;
  media: IMedia[];
  questions: Question[];
}

export interface Question {
  id: number;
  tl_activity_id: number;
  title: string;
  description: string;
  sequence: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  media: IMedia[];
  options: Option[];
}

export interface Option {
  id: number;
  question_id: number;
  option_text: string;
  option_image: string;
  is_correct: boolean;
  total_points: number;
  sequence: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// Activity Progress API Types
export interface IStartActivityProgressRes {
  statusCode: number;
  message: string;
  data: any;
}

export interface IActivityQuestionOption {
  id: number;
  option_text: string;
  option_image: string | null;
  sequence: number;
  is_correct: boolean;
}

export interface IActivityQuestion {
  id: number;
  title: string;
  description: string;
  sequence: number;
  media: IMedia[];
  options: IActivityQuestionOption[];
}

export interface IStepperItem {
  question_id: number;
  sequence: number;
  is_answered: boolean;
  is_current: boolean;
  step_number: number;
}

export interface IProgress {
  current_question: number;
  total_questions: number;
  answered_questions: number;
  status: string;
}

export interface IAnswer {
  selected_option_id: number;
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
}

export interface ICorrectAnswer {
  option_id: number;
  option_text: string;
  option_image: string | null;
}

export interface IGetActivityQuestionRes {
  question: IActivityQuestion;
  stepper: IStepperItem[];
  progress: IProgress;
  answer?: IAnswer;
  correct_answer?: ICorrectAnswer;
}

export interface ISubmitAnswerReq {
  question_id: number;
  selected_option_id: number;
  duration_seconds?: number; // Time in seconds from question render to submit
}

export interface ISubmitAnswerProgress {
  correct_answers: number;
  total_questions: number;
  score: string;
  status: string;
}

export interface ISubmitAnswerRes {
  answer_id: number;
  is_correct: boolean;
  points_earned: number;
  correct_answer: ICorrectAnswer;
  progress: ISubmitAnswerProgress;
}
