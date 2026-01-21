export type ActivityType = 'MCQ';

export interface ActivityDetails {
  chapterName: string;
  lessonName: string;
  totalQuestions: number;
  activityName: string;
  activityType: ActivityType;
  publishedAt?: string;
  reviewedAt?: string;
  description: string;
  images: string[];
}

export interface MediaItem {
  id: string;
  imageSrc: string;
  title?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  icon?: string;
  points: number;
  isCorrect?: boolean;
  isSelected?: boolean;
}

export interface MCQQuestion {
  id: string;
  type: 'mcq';
  questionText: string;
  questionDescription: string;
  images: string[];
  options: QuestionOption[];
}

export type Question = MCQQuestion;

export interface ActivityViewData {
  activityDetails: ActivityDetails;
  questions: Question[];
}

export interface RadioOptionProps {
  option: QuestionOption;
  selectedOptionId?: string;
}

export interface OptionListProps {
  options: QuestionOption[];
  selectedOptionId?: string;
  onOptionSelect?: (optionId: string) => void;
}

export interface QuestionCardProps {
  questionText?: string;
  questionDescription?: string;
  instruction?: string;
  images?: any;
}

export interface ActivityDetailsProps {
  activityDetails: ActivityDetails;
}

export interface QuestionTabsProps {
  totalQuestions: number;
  activeIndex: number;
  onTabChange: (index: number) => void;
}

export interface ProgressIndicatorProps {
  totalQuestions: number;
  activeIndex: number;
  submittedQuestions: Set<number>;
  onClick?: (index: number) => void;
}
