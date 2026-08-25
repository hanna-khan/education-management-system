export type AlumniEmploymentStatus = "employed" | "self_employed" | "studying" | "seeking" | "retired";
export type MentorshipStatus = "pending" | "accepted" | "active" | "completed" | "declined";
export type DonationStatus = "pledged" | "received" | "processing";
export type AlumniEventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface AlumniStats {
  totalAlumni: number;
  activeProfiles: number;
  employedPct: number;
  mentorshipRequests: number;
  activeMentorships: number;
  eventsThisYear: number;
  donationsThisYear: number;
}

export interface AlumniProfile {
  id: string;
  alumniId: string;
  name: string;
  email: string;
  phone: string;
  graduationYear: number;
  program: string;
  department: string;
  currentCompany?: string;
  currentRole?: string;
  city: string;
  employmentStatus: AlumniEmploymentStatus;
  linkedIn?: string;
  mentorshipAvailable: boolean;
}

export interface AlumniEvent {
  id: string;
  title: string;
  type: "reunion" | "networking" | "seminar" | "fundraising" | "workshop";
  date: string;
  venue: string;
  city: string;
  registrations: number;
  capacity: number;
  status: AlumniEventStatus;
}

export interface MentorshipRequest {
  id: string;
  requestId: string;
  studentId: string;
  studentName: string;
  studentProgram: string;
  alumniId: string;
  alumniName: string;
  topic: string;
  message: string;
  requestedAt: string;
  status: MentorshipStatus;
  response?: string;
  respondedAt?: string;
}

export interface AlumniDonation {
  id: string;
  donationId: string;
  alumniName: string;
  alumniId: string;
  amount: number;
  purpose: string;
  donatedAt: string;
  status: DonationStatus;
  receiptNo?: string;
}

export interface AlumniDirectoryEntry {
  id: string;
  name: string;
  graduationYear: number;
  program: string;
  company?: string;
  role?: string;
  city: string;
  mentorshipAvailable: boolean;
}

export interface StudentAlumniMentorshipSummary {
  pendingRequests: number;
  activeMentorships: number;
  availableMentors: number;
}
