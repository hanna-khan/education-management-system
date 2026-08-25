export type SurveyAudience =
  | "student"
  | "parent"
  | "teacher"
  | "course_evaluation"
  | "event_feedback"
  | "staff";

export type SurveyStatus = "draft" | "published" | "closed" | "archived";
export type QuestionType =
  | "rating"
  | "multiple_choice"
  | "checkbox"
  | "text"
  | "yes_no"
  | "scale";

export interface SurveysStats {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  avgResponseRate: number;
  avgRating: number;
  pendingReviews: number;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
}

export interface Survey {
  id: string;
  surveyId: string;
  title: string;
  description: string;
  audience: SurveyAudience;
  status: SurveyStatus;
  questions: SurveyQuestion[];
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  closesAt?: string;
  targetCount: number;
  responseCount: number;
}

export interface SurveyResponse {
  id: string;
  respondentId: string;
  respondentName: string;
  submittedAt: string;
  answers: Record<string, string | number | string[]>;
  comment?: string;
}

export interface SurveyAnalytics {
  surveyId: string;
  responseCount: number;
  responseRate: number;
  avgRating: number;
  questionBreakdown: {
    questionId: string;
    questionText: string;
    type: QuestionType;
    avgRating?: number;
    distribution?: Record<string, number>;
    sampleComments?: string[];
  }[];
}

export interface StudentSurveySummary {
  pending: Survey[];
  completed: string[];
}
