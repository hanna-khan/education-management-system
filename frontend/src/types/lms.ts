export type LmsCourseStatus = "active" | "archived" | "draft";
export type AssignmentStatus = "draft" | "published" | "closed" | "grading";
export type SubmissionStatus = "not_submitted" | "submitted" | "late" | "graded" | "returned" | "missing";
export type QuizStatus = "draft" | "open" | "closed";
export type MaterialType = "pdf" | "video" | "link" | "slides" | "code" | "other";

export interface LmsCourse {
  id: string;
  code: string;
  title: string;
  department: string;
  instructor: string;
  instructorId: string;
  semester: string;
  section: string;
  students: number;
  credits: number;
  status: LmsCourseStatus;
  progress: number;
  description: string;
  schedule: string;
}

export interface LmsAnnouncement {
  id: string;
  courseId: string;
  title: string;
  body: string;
  author: string;
  pinned: boolean;
  createdAt: string;
}

export interface LmsMaterial {
  id: string;
  courseId: string;
  title: string;
  type: MaterialType;
  size?: string;
  uploadedAt: string;
  week: number;
  downloadable: boolean;
}

export interface LmsLesson {
  id: string;
  courseId: string;
  week: number;
  title: string;
  duration: string;
  completed: boolean;
  type: "lecture" | "lab" | "tutorial";
}

export interface LmsAssignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueAt: string;
  maxScore: number;
  status: AssignmentStatus;
  submissionsCount: number;
  gradedCount: number;
  allowLate: boolean;
  latePenaltyPct: number;
}

export interface LmsQuiz {
  id: string;
  courseId: string;
  title: string;
  questions: number;
  durationMin: number;
  dueAt: string;
  status: QuizStatus;
  attemptsAllowed: number;
  avgScore: number;
}

export interface LmsDiscussion {
  id: string;
  courseId: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  pinned: boolean;
}

export interface LmsAttendanceRow {
  id: string;
  courseId: string;
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

export interface LmsGradeRow {
  id: string;
  studentId: string;
  studentName: string;
  assignment: string;
  score: number | null;
  maxScore: number;
  status: SubmissionStatus;
  submittedAt?: string;
}

export interface LmsStats {
  activeCourses: number;
  totalStudents: number;
  pendingGrading: number;
  openQuizzes: number;
  materialsUploaded: number;
  discussionPosts: number;
}
