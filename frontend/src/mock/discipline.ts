import type {
  BehaviourHistoryEntry,
  DisciplinaryAction,
  DisciplineFollowUp,
  DisciplineIncident,
  DisciplineStats,
  DisciplineWarning,
  IncidentTimelineEntry,
  ParentDisciplineNotification,
} from "@/types/discipline";

export const DISCIPLINE_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/discipline" },
  { id: "incidents", label: "Incidents", href: "/discipline/incidents" },
  { id: "warnings", label: "Warnings", href: "/discipline/warnings" },
  { id: "actions", label: "Actions", href: "/discipline/actions" },
];

export const disciplineStats: DisciplineStats = {
  totalIncidents: 48,
  openIncidents: 12,
  pendingReview: 5,
  actionsThisMonth: 8,
  parentNotificationsSent: 22,
  resolvedThisMonth: 14,
};

export const mockIncidents: DisciplineIncident[] = [
  { id: "inc-001", incidentId: "DIS-2026-0048", studentId: "CS-2023-0245", studentName: "Omar Hassan", program: "BS Computer Science", category: "academic_dishonesty", severity: "major", description: "Caught using unauthorized notes during midterm exam — CS-301 Data Structures", location: "Exam Hall B, Block A", reportedAt: "2026-02-20 10:45", reportedBy: "Dr. Imran Qureshi", reporterRole: "teacher", status: "under_review", witnesses: ["Proctor — Sister Amina"], evidence: ["Exam paper copy", "Unauthorized notes"] },
  { id: "inc-002", incidentId: "DIS-2026-0045", studentId: "ME-2022-0094", studentName: "Hassan Raza Jaffery", program: "BS Mechanical Engineering", category: "misconduct", severity: "moderate", description: "Disruptive behaviour in lab — refused to follow safety instructions", location: "Mechanical Workshop, Block C", reportedAt: "2026-02-18 14:30", reportedBy: "Engr. Tariq Mehmood", reporterRole: "teacher", status: "action_pending", witnesses: ["Lab Assistant — Ali Ahmed"] },
  { id: "inc-003", incidentId: "DIS-2026-0042", studentId: "EE-2024-0156", studentName: "Bilal Ahmed Qureshi", program: "BS Electrical Engineering", category: "bullying", severity: "major", description: "Verbal harassment reported by fellow student in hostel common area", location: "Quaid-e-Azam Boys Hostel — Common Room", reportedAt: "2026-02-15 20:00", reportedBy: "Hostel Warden — Dr. Asif Raza", reporterRole: "admin", status: "parent_notified", witnesses: ["CS-2024-0088 — Syed Ali Raza"] },
  { id: "inc-004", incidentId: "DIS-2026-0038", studentId: "CE-2024-0021", studentName: "Ayesha Malik", program: "BS Civil Engineering", category: "dress_code", severity: "minor", description: "Incomplete lab safety gear during site visit", location: "Civil Engineering Lab", reportedAt: "2026-02-12 09:15", reportedBy: "Prof. Samina Khursheed", reporterRole: "teacher", status: "resolved" },
  { id: "inc-005", incidentId: "DIS-2026-0035", studentId: "CS-2024-0199", studentName: "Zainab Sheikh", program: "BS Software Engineering", category: "attendance", severity: "minor", description: "Chronic absenteeism — below 75% attendance in 3 courses", location: "N/A — Academic record", reportedAt: "2026-02-10 11:00", reportedBy: "HOD Computer Science", reporterRole: "admin", status: "action_taken" },
];

export const mockWarnings: DisciplineWarning[] = [
  { id: "wrn-001", warningId: "WRN-2026-012", incidentId: "inc-004", studentId: "CE-2024-0021", studentName: "Ayesha Malik", level: "verbal", reason: "Incomplete lab safety gear", issuedAt: "2026-02-12", issuedBy: "Prof. Samina Khursheed", status: "active" },
  { id: "wrn-002", warningId: "WRN-2026-010", incidentId: "inc-005", studentId: "CS-2024-0199", studentName: "Zainab Sheikh", level: "first_written", reason: "Chronic absenteeism warning", issuedAt: "2026-02-11", issuedBy: "HOD Computer Science", expiresAt: "2026-08-11", status: "active" },
  { id: "wrn-003", warningId: "WRN-2026-008", incidentId: "inc-002", studentId: "ME-2022-0094", studentName: "Hassan Raza Jaffery", level: "first_written", reason: "Lab safety violation", issuedAt: "2026-02-19", issuedBy: "Engr. Tariq Mehmood", status: "active" },
];

export const mockActions: DisciplinaryAction[] = [
  { id: "act-001", actionId: "ACT-2026-008", incidentId: "inc-005", studentId: "CS-2024-0199", studentName: "Zainab Sheikh", type: "counseling", description: "Mandatory academic counseling sessions — 3 sessions with advisor", startDate: "2026-02-15", endDate: "2026-03-15", issuedBy: "Dean of Students", status: "active" },
  { id: "act-002", actionId: "ACT-2026-006", incidentId: "inc-003", studentId: "EE-2024-0156", studentName: "Bilal Ahmed Qureshi", type: "written_warning", description: "Formal written warning — bullying policy violation", startDate: "2026-02-17", issuedBy: "Dean of Students", status: "active" },
  { id: "act-003", actionId: "ACT-2026-004", incidentId: "inc-001", studentId: "CS-2023-0245", studentName: "Omar Hassan", type: "suspension", description: "Exam suspension pending disciplinary committee review", startDate: "2026-02-21", endDate: "2026-03-07", issuedBy: "Examination Branch", status: "pending" },
];

export const mockParentNotifications: ParentDisciplineNotification[] = [
  { id: "pdn-001", incidentId: "inc-003", studentName: "Bilal Ahmed Qureshi", title: "Disciplinary incident notification", message: "Your son has been involved in a bullying incident reported on 15 Feb 2026. A formal written warning has been issued. Please contact the Dean of Students office.", sentAt: "2026-02-17 16:00", read: true, requiresAcknowledgment: true, acknowledged: true },
  { id: "pdn-002", incidentId: "inc-001", studentName: "Omar Hassan", title: "Academic dishonesty — under review", message: "An incident of suspected academic dishonesty during CS-301 midterm has been reported. The case is under review by the Examination Branch.", sentAt: "2026-02-20 14:30", read: false, requiresAcknowledgment: true, acknowledged: false },
];

export const mockFollowUps: DisciplineFollowUp[] = [
  { id: "fu-001", incidentId: "inc-005", studentName: "Zainab Sheikh", scheduledAt: "2026-02-28 10:00", assignedTo: "Dr. Fatima Noor (Counselor)", notes: "Review attendance improvement plan", status: "scheduled" },
  { id: "fu-002", incidentId: "inc-003", studentName: "Bilal Ahmed Qureshi", scheduledAt: "2026-02-25 14:00", assignedTo: "Dean of Students", notes: "Follow-up on written warning compliance", status: "scheduled" },
];

export const mockBehaviourHistory: BehaviourHistoryEntry[] = [
  { id: "bh-001", studentId: "CS-2024-0199", studentName: "Zainab Sheikh", date: "2026-02-11", type: "warning", summary: "First written warning — chronic absenteeism", points: -5 },
  { id: "bh-002", studentId: "EE-2024-0156", studentName: "Bilal Ahmed Qureshi", date: "2026-02-17", type: "action", summary: "Written warning — bullying policy violation", points: -10 },
  { id: "bh-003", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", date: "2025-11-20", type: "positive", summary: "Dean's honour roll — academic excellence", points: 10 },
];

export const incidentTimelines: Record<string, IncidentTimelineEntry[]> = {
  "inc-001": [
    { at: "2026-02-20 10:45", actor: "Dr. Imran Qureshi", action: "Incident reported", note: "Unauthorized notes found during CS-301 midterm" },
    { at: "2026-02-20 11:30", actor: "Examination Branch", action: "Case logged", note: "Evidence secured" },
    { at: "2026-02-21 09:00", actor: "HOD Computer Science", action: "Under review", note: "Awaiting student statement" },
  ],
  "inc-003": [
    { at: "2026-02-15 20:00", actor: "Dr. Asif Raza", action: "Incident reported", note: "Bullying in hostel common room" },
    { at: "2026-02-16 10:00", actor: "Dean of Students", action: "Investigation started" },
    { at: "2026-02-17 14:00", actor: "Dean of Students", action: "Written warning issued" },
    { at: "2026-02-17 16:00", actor: "System", action: "Parent notified", note: "SMS and portal notification sent" },
  ],
};

export function getIncident(id: string) {
  return mockIncidents.find((i) => i.id === id);
}

export function getIncidentTimeline(id: string): IncidentTimelineEntry[] {
  return incidentTimelines[id] ?? [
    { at: "2026-02-20 10:00", actor: "System", action: "Incident logged" },
  ];
}
