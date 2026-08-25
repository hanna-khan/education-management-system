export type CourseRequirementStatus = "completed" | "in_progress" | "failed" | "remaining" | "waived";
export type CourseRequirementType = "core" | "elective" | "general" | "lab" | "project";

export interface DegreeProgress {
  studentId: string;
  studentName: string;
  program: string;
  batch: string;
  creditsEarned: number;
  creditsRequired: number;
  percentComplete: number;
  gpa: number;
  cgpa: number;
  expectedGraduation: string;
  standing: "good" | "probation" | "warning";
}

export interface DegreeRequirement {
  id: string;
  code: string;
  title: string;
  credits: number;
  type: CourseRequirementType;
  status: CourseRequirementStatus;
  grade?: string;
  semester?: string;
  prerequisites: string[];
  category: string;
}

export interface PlannerCourse {
  id: string;
  code: string;
  title: string;
  credits: number;
  type: CourseRequirementType;
  eligible: boolean;
  recommended: boolean;
  prereqMet: boolean;
  prereqMissing: string[];
  offered: boolean;
  seatsLeft: number;
}

export interface DegreeStats {
  studentsOnTrack: number;
  studentsBehind: number;
  avgCompletion: number;
  avgCgpa: number;
}
