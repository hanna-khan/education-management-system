export type QualityMetricStatus = "on_track" | "at_risk" | "below_target" | "exceeding";
export type ImprovementPlanStatus = "draft" | "in_progress" | "completed" | "overdue";
export type EvidenceType = "document" | "survey" | "report" | "meeting_minutes" | "data_export";

export interface QualityStats {
  overallScore: number;
  programReviewsDue: number;
  courseEvaluationsOpen: number;
  studentSatisfaction: number;
  facultyFeedbackScore: number;
  attendanceCompliance: number;
  graduationRate: number;
  improvementPlansActive: number;
}

export interface QualityKpi {
  id: string;
  code: string;
  name: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  status: QualityMetricStatus;
  department: string;
  lastUpdated: string;
}

export interface ProgramReview {
  id: string;
  reviewId: string;
  program: string;
  department: string;
  cycle: string;
  leadReviewer: string;
  scheduledDate: string;
  status: "scheduled" | "in_progress" | "completed" | "follow_up";
  score?: number;
}

export interface CourseEvaluationSummary {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  department: string;
  semester: string;
  responseRate: number;
  avgRating: number;
  status: "open" | "closed" | "published";
}

export interface ImprovementPlan {
  id: string;
  planId: string;
  title: string;
  department: string;
  owner: string;
  dueDate: string;
  status: ImprovementPlanStatus;
  linkedKpi: string;
  progress: number;
}

export interface QualityEvidence {
  id: string;
  evidenceId: string;
  title: string;
  type: EvidenceType;
  module: string;
  uploadedBy: string;
  uploadedAt: string;
  linkedTo: string;
}

export interface QualityReport {
  id: string;
  reportId: string;
  title: string;
  type: "annual" | "semester" | "hec" | "internal";
  period: string;
  generatedAt: string;
  status: "draft" | "published" | "submitted";
}
