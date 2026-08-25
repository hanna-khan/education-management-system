export type OrganizationType = "club" | "society" | "sport" | "student_org";
export type OrganizationStatus = "active" | "inactive" | "pending_approval" | "suspended";
export type MemberRole = "president" | "vice_president" | "secretary" | "treasurer" | "member" | "coach";
export type MemberStatus = "active" | "inactive" | "pending";
export type ClubApplicationStatus = "submitted" | "under_review" | "approved" | "rejected";
export type EventStatus = "scheduled" | "ongoing" | "completed" | "cancelled";
export type AchievementLevel = "university" | "provincial" | "national" | "international";

export interface ClubsStats {
  totalOrganizations: number;
  activeMembers: number;
  upcomingEvents: number;
  pendingApplications: number;
  achievementsThisYear: number;
  houses?: number;
  housePointsTotal?: number;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: OrganizationType;
  category: string;
  facultyAdvisor: string;
  president: string;
  members: number;
  founded: string;
  status: OrganizationStatus;
  description: string;
  meetingDay?: string;
  venue?: string;
}

export interface ClubMember {
  id: string;
  studentId: string;
  studentName: string;
  organizationId: string;
  organizationName: string;
  role: MemberRole;
  joinedAt: string;
  status: MemberStatus;
  program: string;
}

export interface ClubEvent {
  id: string;
  eventId: string;
  title: string;
  organizationName: string;
  date: string;
  time: string;
  venue: string;
  expectedAttendees: number;
  status: EventStatus;
  budget: number;
}

export interface ClubApplication {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  organizationName: string;
  organizationType: OrganizationType;
  reason: string;
  submittedAt: string;
  status: ClubApplicationStatus;
  reviewedBy?: string;
}

export interface ClubAchievement {
  id: string;
  title: string;
  organizationName: string;
  studentName?: string;
  level: AchievementLevel;
  date: string;
  description: string;
  award?: string;
}

export interface House {
  id: string;
  name: string;
  code: string;
  color: string;
  houseMaster: string;
  students: number;
  totalPoints: number;
  rank: number;
}

export interface HousePoint {
  id: string;
  houseId: string;
  houseName: string;
  studentName: string;
  points: number;
  reason: string;
  category: string;
  awardedBy: string;
  date: string;
}

export interface HouseCompetition {
  id: string;
  name: string;
  date: string;
  participatingHouses: string[];
  winner?: string;
  status: "upcoming" | "ongoing" | "completed";
}

export interface ActivityType {
  id: string;
  name: string;
  category: string;
  requiresApproval: boolean;
  maxBudget: number;
}

export interface StudentClubsSummary {
  memberships: { organizationName: string; role: MemberRole; since: string }[];
  pendingApplications: number;
  upcomingEvents: ClubEvent[];
  house?: { name: string; points: number; rank: number };
}
