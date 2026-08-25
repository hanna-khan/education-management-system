export type JobType = "full_time" | "part_time" | "contract" | "internship";
export type OpportunityStatus = "draft" | "pending_approval" | "published" | "closed" | "rejected";
export type ApplicationStatus = "applied" | "under_review" | "shortlisted" | "interview" | "offered" | "accepted" | "rejected" | "withdrawn";
export type InterviewStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type PlacementStatus = "seeking" | "placed" | "not_seeking";

export interface CareerStats {
  totalApplications: number;
  activeInternships: number;
  activeJobs: number;
  upcomingInterviews: number;
  offersExtended: number;
  placementsThisYear: number;
}

export interface CareerCompany {
  id: string;
  name: string;
  industry: string;
  city: string;
  website: string;
  contactPerson: string;
  contactEmail: string;
  activeOpportunities: number;
  partnershipSince: string;
}

export interface CareerJob {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  type: JobType;
  location: string;
  salaryRange: string;
  deadline: string;
  status: OpportunityStatus;
  postedAt: string;
  applications: number;
  skills: string[];
  description: string;
}

export interface CareerInternship {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  duration: string;
  stipend: string;
  location: string;
  deadline: string;
  status: OpportunityStatus;
  postedAt: string;
  applications: number;
  department: string;
  description: string;
}

export interface CareerApplication {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  program: string;
  opportunityType: "job" | "internship";
  opportunityTitle: string;
  companyName: string;
  appliedAt: string;
  status: ApplicationStatus;
  cvUploaded: boolean;
}

export interface CareerInterview {
  id: string;
  applicationId: string;
  studentName: string;
  companyName: string;
  opportunityTitle: string;
  scheduledAt: string;
  mode: "in_person" | "online" | "phone";
  location: string;
  interviewer: string;
  status: InterviewStatus;
}

export interface CareerEvent {
  id: string;
  title: string;
  type: "workshop" | "seminar" | "networking" | "career_fair";
  date: string;
  time: string;
  venue: string;
  organizer: string;
  registrations: number;
  capacity: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface CareerFair {
  id: string;
  name: string;
  date: string;
  venue: string;
  companies: number;
  expectedStudents: number;
  status: "planning" | "confirmed" | "completed";
}

export interface CareerPlacement {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  graduationYear: number;
  companyName: string;
  role: string;
  salary: string;
  placedAt: string;
  status: PlacementStatus;
}

export interface StudentCareerSummary {
  applications: number;
  interviews: number;
  offers: number;
  cvUploaded: boolean;
  profileComplete: number;
}
