import type {
  CourseEvaluationSummary,
  ImprovementPlan,
  ProgramReview,
  QualityEvidence,
  QualityKpi,
  QualityReport,
  QualityStats,
} from "@/types/quality";

export const QUALITY_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/quality" },
  { id: "kpis", label: "KPIs", href: "/quality/kpis" },
  { id: "program-reviews", label: "Program Reviews", href: "/quality/program-reviews" },
  { id: "course-evaluations", label: "Course Evaluations", href: "/quality/course-evaluations" },
  { id: "improvement-plans", label: "Improvement Plans", href: "/quality/improvement-plans" },
  { id: "evidence", label: "Evidence", href: "/quality/evidence" },
  { id: "reports", label: "Reports", href: "/quality/reports" },
];

export const qualityStats: QualityStats = {
  overallScore: 87.4,
  programReviewsDue: 6,
  courseEvaluationsOpen: 42,
  studentSatisfaction: 4.2,
  facultyFeedbackScore: 4.0,
  attendanceCompliance: 78.6,
  graduationRate: 82.3,
  improvementPlansActive: 14,
};

export const mockQualityKpis: QualityKpi[] = [
  { id: "kpi-001", code: "QEC-01", name: "Student–Teacher Ratio", category: "Academic", target: 25, current: 22, unit: ":1", status: "exceeding", department: "All Departments", lastUpdated: "2026-02-20" },
  { id: "kpi-002", code: "QEC-02", name: "Course Evaluation Response Rate", category: "Teaching", target: 75, current: 68, unit: "%", status: "at_risk", department: "QEC", lastUpdated: "2026-02-22" },
  { id: "kpi-003", code: "QEC-03", name: "Graduate Employment Rate (6 mo)", category: "Outcomes", target: 70, current: 74, unit: "%", status: "exceeding", department: "Career Office", lastUpdated: "2026-01-15" },
  { id: "kpi-004", code: "QEC-04", name: "Research Publications per Faculty", category: "Research", target: 1.5, current: 1.2, unit: "papers", status: "below_target", department: "R&D", lastUpdated: "2026-02-10" },
  { id: "kpi-005", code: "QEC-05", name: "Student Attendance Compliance", category: "Academic", target: 85, current: 78.6, unit: "%", status: "at_risk", department: "All Departments", lastUpdated: "2026-02-23" },
  { id: "kpi-006", code: "QEC-06", name: "Faculty with PhD", category: "Faculty", target: 60, current: 58, unit: "%", status: "on_track", department: "HR", lastUpdated: "2026-02-01" },
  { id: "kpi-007", code: "QEC-07", name: "Library Resources per Student", category: "Resources", target: 15, current: 18, unit: "titles", status: "exceeding", department: "Library", lastUpdated: "2026-02-18" },
  { id: "kpi-008", code: "QEC-08", name: "Student Satisfaction (Overall)", category: "Satisfaction", target: 4.0, current: 4.2, unit: "/5", status: "exceeding", department: "QEC", lastUpdated: "2026-02-15" },
];

export const mockProgramReviews: ProgramReview[] = [
  { id: "pr-001", reviewId: "PR-2026-CS", program: "BS Computer Science", department: "Computer & Info Systems", cycle: "2024–2026", leadReviewer: "Dr. Farhan Ahmed", scheduledDate: "2026-03-10", status: "scheduled" },
  { id: "pr-002", reviewId: "PR-2026-EE", program: "BS Electrical Engineering", department: "Electrical Engineering", cycle: "2024–2026", leadReviewer: "Prof. Saima Rizvi", scheduledDate: "2026-02-28", status: "in_progress", score: 86 },
  { id: "pr-003", reviewId: "PR-2026-CE", program: "BS Civil Engineering", department: "Civil Engineering", cycle: "2023–2025", leadReviewer: "Dr. Kamran Hashmi", scheduledDate: "2026-01-20", status: "completed", score: 91 },
  { id: "pr-004", reviewId: "PR-2026-ME", program: "BS Mechanical Engineering", department: "Mechanical Engineering", cycle: "2024–2026", leadReviewer: "Engr. Bilal Sheikh", scheduledDate: "2026-04-05", status: "scheduled" },
  { id: "pr-005", reviewId: "PR-2026-MBA", program: "MBA Executive", department: "Management Sciences", cycle: "2023–2025", leadReviewer: "Dr. Ayesha Malik", scheduledDate: "2026-02-15", status: "follow_up", score: 78 },
];

export const mockCourseEvaluations: CourseEvaluationSummary[] = [
  { id: "ce-001", courseCode: "CS-301", courseName: "Data Structures & Algorithms", instructor: "Dr. Hassan Raza", department: "CIS", semester: "Spring 2026", responseRate: 72, avgRating: 4.3, status: "open" },
  { id: "ce-002", courseCode: "EE-402", courseName: "Power Systems Analysis", instructor: "Prof. Nadia Khan", department: "EE", semester: "Spring 2026", responseRate: 65, avgRating: 3.9, status: "open" },
  { id: "ce-003", courseCode: "CE-205", courseName: "Structural Mechanics", instructor: "Dr. Omar Siddiqui", department: "CE", semester: "Spring 2026", responseRate: 81, avgRating: 4.5, status: "closed" },
  { id: "ce-004", courseCode: "ME-310", courseName: "Thermodynamics II", instructor: "Engr. Zainab Qureshi", department: "ME", semester: "Fall 2025", responseRate: 88, avgRating: 4.1, status: "published" },
  { id: "ce-005", courseCode: "MTH-201", courseName: "Linear Algebra", instructor: "Dr. Imran Jaffery", department: "Basic Sciences", semester: "Spring 2026", responseRate: 58, avgRating: 3.7, status: "open" },
];

export const mockImprovementPlans: ImprovementPlan[] = [
  { id: "ip-001", planId: "IP-2026-001", title: "Increase course evaluation response rate", department: "QEC", owner: "Dr. Samina Khursheed", dueDate: "2026-06-30", status: "in_progress", linkedKpi: "QEC-02", progress: 45 },
  { id: "ip-002", planId: "IP-2026-002", title: "Attendance monitoring in large sections", department: "All Departments", owner: "Registrar Office", dueDate: "2026-04-15", status: "in_progress", linkedKpi: "QEC-05", progress: 60 },
  { id: "ip-003", planId: "IP-2026-003", title: "Faculty research output enhancement", department: "R&D", owner: "Dr. Asif Raza", dueDate: "2026-12-31", status: "draft", linkedKpi: "QEC-04", progress: 10 },
  { id: "ip-004", planId: "IP-2025-018", title: "Lab equipment modernization — EE Dept", department: "Electrical Engineering", owner: "Prof. Saima Rizvi", dueDate: "2026-02-28", status: "overdue", linkedKpi: "QEC-01", progress: 85 },
  { id: "ip-005", planId: "IP-2025-022", title: "Student feedback loop in advising", department: "Student Affairs", owner: "Dr. Hina Abbas", dueDate: "2026-01-31", status: "completed", linkedKpi: "QEC-08", progress: 100 },
];

export const mockQualityEvidence: QualityEvidence[] = [
  { id: "ev-001", evidenceId: "QE-2026-001", title: "Spring 2026 Student Satisfaction Survey Results", type: "survey", module: "Surveys", uploadedBy: "Dr. Samina Khursheed", uploadedAt: "2026-02-15", linkedTo: "QEC-08" },
  { id: "ev-002", evidenceId: "QE-2026-002", title: "EE Program Review Self-Assessment Report", type: "report", module: "Program Reviews", uploadedBy: "Prof. Saima Rizvi", uploadedAt: "2026-02-20", linkedTo: "PR-2026-EE" },
  { id: "ev-003", evidenceId: "QE-2026-003", title: "QEC Steering Committee Minutes — Jan 2026", type: "meeting_minutes", module: "Governance", uploadedBy: "QEC Secretariat", uploadedAt: "2026-01-28", linkedTo: "Governance" },
  { id: "ev-004", evidenceId: "QE-2026-004", title: "Faculty PhD Qualification Data Export", type: "data_export", module: "HR", uploadedBy: "HR Office", uploadedAt: "2026-02-01", linkedTo: "QEC-06" },
  { id: "ev-005", evidenceId: "QE-2026-005", title: "HEC Quality Assurance Policy Document", type: "document", module: "Policies", uploadedBy: "Registrar", uploadedAt: "2025-12-10", linkedTo: "HEC Compliance" },
];

export const mockQualityReports: QualityReport[] = [
  { id: "qr-001", reportId: "QR-2025-ANNUAL", title: "Annual Quality Enhancement Report 2025", type: "annual", period: "2025", generatedAt: "2026-01-15", status: "submitted" },
  { id: "qr-002", reportId: "QR-2026-S1", title: "Semester Quality Report — Spring 2026", type: "semester", period: "Spring 2026", generatedAt: "2026-02-22", status: "draft" },
  { id: "qr-003", reportId: "QR-HEC-2025", title: "HEC Self-Assessment Report", type: "hec", period: "2024–2025", generatedAt: "2025-11-30", status: "submitted" },
  { id: "qr-004", reportId: "QR-INT-2026-02", title: "Internal Audit — Course Evaluation Process", type: "internal", period: "Feb 2026", generatedAt: "2026-02-18", status: "published" },
];

export const programPerformance = [
  { program: "BS Computer Science", enrollment: 420, satisfaction: 4.3, graduation: 85, employment: 78 },
  { program: "BS Electrical Engineering", enrollment: 380, satisfaction: 4.0, graduation: 80, employment: 82 },
  { program: "BS Civil Engineering", enrollment: 350, satisfaction: 4.1, graduation: 83, employment: 75 },
  { program: "BS Mechanical Engineering", enrollment: 310, satisfaction: 3.9, graduation: 79, employment: 71 },
  { program: "MBA Executive", enrollment: 85, satisfaction: 4.4, graduation: 92, employment: 88 },
];

export function getQualityKpi(id: string) {
  return mockQualityKpis.find((k) => k.id === id) ?? null;
}
