import type {
  ActivityType,
  ClubAchievement,
  ClubApplication,
  ClubEvent,
  ClubMember,
  ClubsStats,
  House,
  HouseCompetition,
  HousePoint,
  Organization,
  StudentClubsSummary,
} from "@/types/clubs";

export const CLUBS_TABS_UNIVERSITY = [
  { id: "dashboard", label: "Dashboard", href: "/clubs" },
  { id: "organizations", label: "Organizations", href: "/clubs/organizations" },
  { id: "members", label: "Members", href: "/clubs/members" },
  { id: "events", label: "Events", href: "/clubs/events" },
  { id: "applications", label: "Applications", href: "/clubs/applications" },
  { id: "achievements", label: "Achievements", href: "/clubs/achievements" },
];

export const CLUBS_TABS_SCHOOL = [
  ...CLUBS_TABS_UNIVERSITY,
  { id: "houses", label: "Houses", href: "/clubs/houses" },
  { id: "points", label: "House Points", href: "/clubs/points" },
];

export function getClubsTabs(institutionMode: "university" | "school") {
  return institutionMode === "school" ? CLUBS_TABS_SCHOOL : CLUBS_TABS_UNIVERSITY;
}

export const clubsStats: ClubsStats = {
  totalOrganizations: 42,
  activeMembers: 2840,
  upcomingEvents: 18,
  pendingApplications: 24,
  achievementsThisYear: 56,
  houses: 4,
  housePointsTotal: 12480,
};

export const mockOrganizations: Organization[] = [
  { id: "org-001", name: "IEEE NED Student Branch", code: "IEEE-NED", type: "society", category: "Technical", facultyAdvisor: "Dr. Farhan Ahmed", president: "Ahmed Hassan Siddiqui", members: 186, founded: "2010", status: "active", description: "IEEE student chapter for electrical and computer engineering students at NED University.", meetingDay: "Thursday", venue: "Block 7, Room 301" },
  { id: "org-002", name: "Robotics Society", code: "ROBO-NED", type: "club", category: "Technical", facultyAdvisor: "Engr. Saba Tariq", president: "Muhammad Usman Khan", members: 92, founded: "2015", status: "active", description: "Design and build robots for national competitions including NERC and IEEE competitions.", meetingDay: "Wednesday", venue: "Robotics Lab, Block 16" },
  { id: "org-003", name: "Debating Society", code: "DEB-NED", type: "society", category: "Literary", facultyAdvisor: "Prof. Ayesha Malik", president: "Fatima Zahra Ali", members: 64, founded: "2008", status: "active", description: "Parliamentary debating, Model UN, and public speaking competitions across Pakistan.", meetingDay: "Tuesday", venue: "Auditorium Block 1" },
  { id: "org-004", name: "Cricket Team", code: "CRI-NED", type: "sport", category: "Sports", facultyAdvisor: "Mr. Kamran Butt", president: "Hassan Raza Jaffery", members: 22, founded: "1977", status: "active", description: "NED University cricket team — inter-university and HEC tournaments.", venue: "University Ground, University Road" },
  { id: "org-005", name: "Music & Arts Club", code: "MAC-NED", type: "club", category: "Cultural", facultyAdvisor: "Dr. Hina Abbas", president: "Zainab Sheikh", members: 48, founded: "2012", status: "active", description: "Music performances, art exhibitions, and cultural events at NED.", meetingDay: "Friday", venue: "Student Centre" },
  { id: "org-006", name: "Entrepreneurship Cell", code: "E-CELL", type: "student_org", category: "Professional", facultyAdvisor: "Dr. Asif Raza", president: "Bilal Ahmed Qureshi", members: 120, founded: "2018", status: "active", description: "Startup incubation, pitch competitions, and industry mentorship for NED students.", meetingDay: "Monday", venue: "Innovation Hub, Block 9" },
  { id: "org-007", name: "Photography Club", code: "PHOTO-NED", type: "club", category: "Arts", facultyAdvisor: "Engr. Tariq Mehmood", president: "Sana Iqbal", members: 35, founded: "2019", status: "pending_approval", description: "Campus photography, photo walks around Karachi, and annual exhibition.", meetingDay: "Saturday", venue: "Student Centre" },
  { id: "org-008", name: "Football Team", code: "FTB-NED", type: "sport", category: "Sports", facultyAdvisor: "Mr. Omar Farooq", president: "Syed Ali Raza", members: 28, founded: "1985", status: "active", description: "Inter-university football — HEC and Karachi league participation.", venue: "University Ground" },
];

export const mockClubMembers: ClubMember[] = [
  { id: "cm-001", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", organizationId: "org-001", organizationName: "IEEE NED Student Branch", role: "president", joinedAt: "2024-09-01", status: "active", program: "BS Computer Systems" },
  { id: "cm-002", studentId: "EE-2022-0188", studentName: "Muhammad Usman Khan", organizationId: "org-002", organizationName: "Robotics Society", role: "president", joinedAt: "2024-08-15", status: "active", program: "BS Electrical Engineering" },
  { id: "cm-003", studentId: "CS-2023-0112", studentName: "Fatima Zahra Ali", organizationId: "org-003", organizationName: "Debating Society", role: "president", joinedAt: "2025-01-10", status: "active", program: "BS Computer Science" },
  { id: "cm-004", studentId: "ME-2021-0094", studentName: "Hassan Raza Jaffery", organizationId: "org-004", organizationName: "Cricket Team", role: "president", joinedAt: "2023-08-20", status: "active", program: "BS Mechanical Engineering" },
  { id: "cm-005", studentId: "CS-2024-0088", studentName: "Syed Ali Raza", organizationId: "org-001", organizationName: "IEEE NED Student Branch", role: "member", joinedAt: "2025-09-01", status: "active", program: "BS Computer Science" },
  { id: "cm-006", studentId: "CE-2024-0021", studentName: "Ayesha Malik", organizationId: "org-005", organizationName: "Music & Arts Club", role: "secretary", joinedAt: "2025-09-01", status: "active", program: "BS Civil Engineering" },
  { id: "cm-007", studentId: "EE-2024-0156", studentName: "Bilal Ahmed Qureshi", organizationId: "org-006", organizationName: "Entrepreneurship Cell", role: "president", joinedAt: "2024-09-01", status: "active", program: "BS Electrical Engineering" },
  { id: "cm-008", studentId: "CS-2024-0199", studentName: "Zainab Sheikh", organizationId: "org-005", organizationName: "Music & Arts Club", role: "member", joinedAt: "2026-02-01", status: "pending", program: "BS Software Engineering" },
];

export const mockClubEvents: ClubEvent[] = [
  { id: "ev-001", eventId: "CLB-EVT-042", title: "IEEE Tech Talk: AI in Power Systems", organizationName: "IEEE NED Student Branch", date: "2026-03-05", time: "14:00", venue: "Auditorium Block 1", expectedAttendees: 200, status: "scheduled", budget: 45000 },
  { id: "ev-002", eventId: "CLB-EVT-039", title: "Robotics Workshop — Arduino & Sensors", organizationName: "Robotics Society", date: "2026-03-08", time: "10:00", venue: "Robotics Lab, Block 16", expectedAttendees: 40, status: "scheduled", budget: 28000 },
  { id: "ev-003", eventId: "CLB-EVT-035", title: "Inter-University Debate Championship", organizationName: "Debating Society", date: "2026-02-28", time: "09:00", venue: "Auditorium Block 1", expectedAttendees: 150, status: "ongoing", budget: 65000 },
  { id: "ev-004", eventId: "CLB-EVT-031", title: "NED vs IBA Cricket Match", organizationName: "Cricket Team", date: "2026-03-12", time: "08:00", venue: "University Ground", expectedAttendees: 500, status: "scheduled", budget: 85000 },
  { id: "ev-005", eventId: "CLB-EVT-028", title: "Startup Pitch Day 2026", organizationName: "Entrepreneurship Cell", date: "2026-02-15", time: "13:00", venue: "Innovation Hub", expectedAttendees: 120, status: "completed", budget: 120000 },
  { id: "ev-006", eventId: "CLB-EVT-025", title: "Annual Music Night", organizationName: "Music & Arts Club", date: "2026-04-20", time: "18:00", venue: "Open Air Theatre", expectedAttendees: 800, status: "scheduled", budget: 95000 },
];

export const mockClubApplications: ClubApplication[] = [
  { id: "ca-001", applicationId: "CLB-APP-088", studentId: "CS-2024-0199", studentName: "Zainab Sheikh", organizationName: "Music & Arts Club", organizationType: "club", reason: "Passionate about vocal music and want to perform at campus events", submittedAt: "2026-02-18", status: "submitted" },
  { id: "ca-002", applicationId: "CLB-APP-085", studentId: "ME-2024-0033", studentName: "Omar Farooq", organizationName: "Robotics Society", organizationType: "club", reason: "Mechanical engineering background with interest in mechatronics", submittedAt: "2026-02-15", status: "under_review", reviewedBy: "Engr. Saba Tariq" },
  { id: "ca-003", applicationId: "CLB-APP-082", studentId: "CE-2024-0077", studentName: "Sana Iqbal", organizationName: "Photography Club", organizationType: "club", reason: "Portfolio of campus and Karachi street photography", submittedAt: "2026-02-10", status: "approved", reviewedBy: "Dr. Hina Abbas" },
  { id: "ca-004", applicationId: "CLB-APP-079", studentId: "EE-2024-0022", studentName: "Usama Khan", organizationName: "IEEE NED Student Branch", organizationType: "society", reason: "Want to participate in IEEE competitions and workshops", submittedAt: "2026-02-05", status: "rejected", reviewedBy: "Dr. Farhan Ahmed" },
];

export const mockAchievements: ClubAchievement[] = [
  { id: "ach-001", title: "1st Place — NERC 2025", organizationName: "Robotics Society", studentName: "Muhammad Usman Khan", level: "national", date: "2025-12-15", description: "Line follower robot competition at National Engineering Robotics Competition, Lahore.", award: "Gold Medal" },
  { id: "ach-002", title: "Best Delegate — LUMS MUN", organizationName: "Debating Society", studentName: "Fatima Zahra Ali", level: "national", date: "2025-11-20", description: "Outstanding delegate representing Pakistan at LUMS Model United Nations.", award: "Best Delegate" },
  { id: "ach-003", title: "HEC Inter-University Cricket Champions", organizationName: "Cricket Team", level: "national", date: "2025-10-08", description: "NED University won the HEC Sindh Zone inter-university cricket tournament.", award: "Trophy" },
  { id: "ach-004", title: "IEEE Pakistan Student Branch Award", organizationName: "IEEE NED Student Branch", level: "national", date: "2025-09-12", description: "Recognized as outstanding IEEE student branch in Pakistan region.", award: "Certificate" },
  { id: "ach-005", title: "Startup Bootcamp Winner", organizationName: "Entrepreneurship Cell", studentName: "Bilal Ahmed Qureshi", level: "provincial", date: "2025-08-22", description: "Won Sindh Innovation Challenge with agri-tech startup pitch.", award: "PKR 500,000 seed grant" },
];

export const mockHouses: House[] = [
  { id: "hse-001", name: "Jinnah House", code: "JIN", color: "#1e40af", houseMaster: "Mr. Rashid Ahmed", students: 420, totalPoints: 3420, rank: 1 },
  { id: "hse-002", name: "Iqbal House", code: "IQB", color: "#15803d", houseMaster: "Ms. Nadia Hussain", students: 415, totalPoints: 3180, rank: 2 },
  { id: "hse-003", name: "Liaquat House", code: "LIA", color: "#b45309", houseMaster: "Mr. Faisal Mahmood", students: 408, totalPoints: 2950, rank: 3 },
  { id: "hse-004", name: "Fatima House", code: "FAT", color: "#7c3aed", houseMaster: "Ms. Samina Khursheed", students: 412, totalPoints: 2930, rank: 4 },
];

export const mockHousePoints: HousePoint[] = [
  { id: "hp-001", houseId: "hse-001", houseName: "Jinnah House", studentName: "Ali Hassan", points: 10, reason: "1st place in inter-house quiz", category: "Academics", awardedBy: "Mr. Rashid Ahmed", date: "2026-02-20" },
  { id: "hp-002", houseId: "hse-002", houseName: "Iqbal House", studentName: "Maryam Khan", points: 15, reason: "Winner — inter-house debate", category: "Literary", awardedBy: "Ms. Nadia Hussain", date: "2026-02-18" },
  { id: "hp-003", houseId: "hse-001", houseName: "Jinnah House", studentName: "Hamza Siddiqui", points: 8, reason: "Sports day 100m sprint — 2nd place", category: "Sports", awardedBy: "Mr. Kamran Butt", date: "2026-02-15" },
  { id: "hp-004", houseId: "hse-003", houseName: "Liaquat House", studentName: "Amina Qureshi", points: 5, reason: "Perfect attendance — February", category: "Discipline", awardedBy: "Mr. Faisal Mahmood", date: "2026-02-28" },
  { id: "hp-005", houseId: "hse-004", houseName: "Fatima House", studentName: "Sara Ahmed", points: 12, reason: "Science fair project — outstanding", category: "Academics", awardedBy: "Ms. Samina Khursheed", date: "2026-02-22" },
];

export const mockHouseCompetitions: HouseCompetition[] = [
  { id: "hc-001", name: "Inter-House Cricket", date: "2026-03-15", participatingHouses: ["Jinnah House", "Iqbal House", "Liaquat House", "Fatima House"], status: "upcoming" },
  { id: "hc-002", name: "Annual Sports Day", date: "2026-02-15", participatingHouses: ["Jinnah House", "Iqbal House", "Liaquat House", "Fatima House"], winner: "Jinnah House", status: "completed" },
  { id: "hc-003", name: "Inter-House Quiz Competition", date: "2026-02-20", participatingHouses: ["Jinnah House", "Iqbal House", "Liaquat House", "Fatima House"], winner: "Jinnah House", status: "completed" },
];

export const mockActivityTypes: ActivityType[] = [
  { id: "at-001", name: "Technical Workshop", category: "Technical", requiresApproval: true, maxBudget: 50000 },
  { id: "at-002", name: "Sports Tournament", category: "Sports", requiresApproval: true, maxBudget: 100000 },
  { id: "at-003", name: "Cultural Event", category: "Cultural", requiresApproval: true, maxBudget: 150000 },
  { id: "at-004", name: "Guest Lecture", category: "Academic", requiresApproval: false, maxBudget: 30000 },
  { id: "at-005", name: "Community Service", category: "Social", requiresApproval: true, maxBudget: 25000 },
  { id: "at-006", name: "Inter-House Competition", category: "School", requiresApproval: false, maxBudget: 20000 },
];

export const studentClubsSummary: StudentClubsSummary = {
  memberships: [
    { organizationName: "IEEE NED Student Branch", role: "member", since: "2025-09-01" },
    { organizationName: "Robotics Society", role: "member", since: "2025-09-01" },
  ],
  pendingApplications: 0,
  upcomingEvents: mockClubEvents.filter((e) => e.status === "scheduled").slice(0, 2),
};

export function getOrganization(id: string) {
  return mockOrganizations.find((o) => o.id === id);
}

export function getClubApplication(id: string) {
  return mockClubApplications.find((a) => a.id === id);
}
