export type HomeworkStatus = "draft" | "published" | "closed" | "grading";
export type HwSubmissionStatus = "not_submitted" | "submitted" | "late" | "graded" | "returned" | "missing";

export interface AssignmentItem {
  id: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  section: string;
  dueAt: string;
  maxScore: number;
  status: HomeworkStatus;
  submissionsCount: number;
  gradedCount: number;
  missingCount: number;
  lateCount: number;
  allowLate: boolean;
  latePenaltyPct: number;
  description: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  submittedAt?: string;
  status: HwSubmissionStatus;
  score: number | null;
  maxScore: number;
  feedback?: string;
  files: string[];
  lateByHours?: number;
}

export interface AssignmentStats {
  total: number;
  published: number;
  dueThisWeek: number;
  pendingGrading: number;
  avgCompletion: number;
  lateRate: number;
}
