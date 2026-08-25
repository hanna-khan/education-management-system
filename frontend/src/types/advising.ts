export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show" | "requested";
export type AdvisingWarningLevel = "none" | "academic" | "attendance" | "conduct" | "probation";
export type RecommendationStatus = "pending" | "accepted" | "declined";

export interface Advisor {
  id: string;
  name: string;
  department: string;
  title: string;
  email: string;
  office: string;
  adviseeCount: number;
  availableSlots: number;
}

export interface Advisee {
  id: string;
  studentId: string;
  name: string;
  program: string;
  semester: number;
  cgpa: number;
  credits: number;
  warning: AdvisingWarningLevel;
  lastMeeting?: string;
  advisorId: string;
}

export interface AdvisingNote {
  id: string;
  studentId: string;
  author: string;
  createdAt: string;
  category: "academic" | "career" | "personal" | "general";
  body: string;
  private: boolean;
}

export interface AdvisingAppointment {
  id: string;
  studentId: string;
  studentName: string;
  advisorId: string;
  advisorName: string;
  datetime: string;
  durationMin: number;
  mode: "in_person" | "online";
  status: AppointmentStatus;
  topic: string;
  location?: string;
}

export interface AdvisingRecommendation {
  id: string;
  studentId: string;
  title: string;
  type: "course" | "elective" | "internship" | "career";
  detail: string;
  status: RecommendationStatus;
  createdAt: string;
}

export interface AdvisingRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: "meeting" | "course_change" | "petition" | "letter";
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
}

export interface AdvisingStats {
  totalAdvisees: number;
  meetingsThisWeek: number;
  openRequests: number;
  atRiskStudents: number;
  pendingRecommendations: number;
}
