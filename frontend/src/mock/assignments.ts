import type { AssignmentItem, AssignmentStats, AssignmentSubmission } from "@/types/assignments";

export const ASSIGNMENTS_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/assignments" },
  { id: "create", label: "Create", href: "/assignments/create" },
];

export const assignmentStats: AssignmentStats = {
  total: 142,
  published: 98,
  dueThisWeek: 18,
  pendingGrading: 64,
  avgCompletion: 82,
  lateRate: 11,
};

export const mockAssignments: AssignmentItem[] = [
  {
    id: "hw-001",
    title: "Graph Algorithms Implementation",
    courseCode: "CS-301",
    courseTitle: "Data Structures & Algorithms",
    instructor: "Dr. Sana Iqbal",
    section: "A",
    dueAt: "2026-08-28T23:59:00",
    maxScore: 100,
    status: "published",
    submissionsCount: 36,
    gradedCount: 12,
    missingCount: 8,
    lateCount: 4,
    allowLate: true,
    latePenaltyPct: 10,
    description: "Implement BFS, DFS, and Dijkstra. Submit a zip with source and a 2-page PDF report.",
    createdAt: "2026-08-10",
  },
  {
    id: "hw-002",
    title: "Process Synchronisation Lab",
    courseCode: "CS-302",
    courseTitle: "Operating Systems",
    instructor: "Dr. Imran Malik",
    section: "B",
    dueAt: "2026-08-25T23:59:00",
    maxScore: 50,
    status: "published",
    submissionsCount: 28,
    gradedCount: 0,
    missingCount: 14,
    lateCount: 0,
    allowLate: false,
    latePenaltyPct: 0,
    description: "Mutex and semaphore experiments on Ubuntu lab machines. Attach screenshots.",
    createdAt: "2026-08-12",
  },
  {
    id: "hw-003",
    title: "Boolean Algebra Worksheet",
    courseCode: "EE-201",
    courseTitle: "Digital Logic Design",
    instructor: "Engr. Bilal Hussain",
    section: "A",
    dueAt: "2026-08-22T17:00:00",
    maxScore: 30,
    status: "grading",
    submissionsCount: 52,
    gradedCount: 30,
    missingCount: 3,
    lateCount: 6,
    allowLate: true,
    latePenaltyPct: 5,
    description: "Simplify expressions and draw Karnaugh maps for the given circuits.",
    createdAt: "2026-08-05",
  },
  {
    id: "hw-004",
    title: "Rankine Cycle Analysis",
    courseCode: "ME-301",
    courseTitle: "Thermodynamics II",
    instructor: "Dr. Asad Rehman",
    section: "A",
    dueAt: "2026-09-02T23:59:00",
    maxScore: 100,
    status: "published",
    submissionsCount: 10,
    gradedCount: 0,
    missingCount: 28,
    lateCount: 0,
    allowLate: true,
    latePenaltyPct: 15,
    description: "Analyse a steam power plant cycle with regenerator. Use SI units throughout.",
    createdAt: "2026-08-18",
  },
  {
    id: "hw-005",
    title: "Limits & Continuity Practice",
    courseCode: "MT-101",
    courseTitle: "Calculus I",
    instructor: "Ms. Nadia Farooq",
    section: "C",
    dueAt: "2026-08-20T23:59:00",
    maxScore: 40,
    status: "closed",
    submissionsCount: 58,
    gradedCount: 58,
    missingCount: 2,
    lateCount: 5,
    allowLate: true,
    latePenaltyPct: 10,
    description: "Problem set covering limits, continuity, and intermediate value theorem.",
    createdAt: "2026-08-01",
  },
  {
    id: "hw-006",
    title: "Threat Modelling Mini-project",
    courseCode: "CS-452",
    courseTitle: "Network Security",
    instructor: "Dr. Sana Iqbal",
    section: "A",
    dueAt: "2026-09-10T23:59:00",
    maxScore: 100,
    status: "draft",
    submissionsCount: 0,
    gradedCount: 0,
    missingCount: 28,
    lateCount: 0,
    allowLate: true,
    latePenaltyPct: 10,
    description: "STRIDE analysis of a campus Wi-Fi portal. Draft not yet published.",
    createdAt: "2026-08-21",
  },
];

export const mockSubmissions: AssignmentSubmission[] = [
  { id: "sub-001", assignmentId: "hw-001", studentId: "CS-2022-0421", studentName: "Ahmed Khan", rollNo: "CS-2022-0421", submittedAt: "2026-08-21T18:40:00", status: "submitted", score: null, maxScore: 100, files: ["graphs.py", "report.pdf"] },
  { id: "sub-002", assignmentId: "hw-001", studentId: "EE-2021-0188", studentName: "Fatima Sheikh", rollNo: "EE-2021-0188", submittedAt: "2026-08-20T21:10:00", status: "graded", score: 88, maxScore: 100, feedback: "Strong Dijkstra implementation. Deducted for missing complexity analysis.", files: ["dijkstra.zip", "report.pdf"] },
  { id: "sub-003", assignmentId: "hw-001", studentId: "ME-2023-0092", studentName: "Hassan Raza", rollNo: "ME-2023-0092", submittedAt: "2026-08-29T01:05:00", status: "late", score: null, maxScore: 100, lateByHours: 1, files: ["graphs.cpp"] },
  { id: "sub-004", assignmentId: "hw-001", studentId: "CS-2020-0310", studentName: "Ayesha Malik", rollNo: "CS-2020-0310", status: "missing", score: null, maxScore: 100, files: [] },
  { id: "sub-005", assignmentId: "hw-001", studentId: "CS-2022-0555", studentName: "Usman Ali", rollNo: "CS-2022-0555", submittedAt: "2026-08-27T16:00:00", status: "returned", score: 74, maxScore: 100, feedback: "Please resubmit with corrected BFS parent pointers.", files: ["graphs.py"] },
  { id: "sub-006", assignmentId: "hw-002", studentId: "CS-2022-0421", studentName: "Ahmed Khan", rollNo: "CS-2022-0421", submittedAt: "2026-08-24T20:00:00", status: "submitted", score: null, maxScore: 50, files: ["lab-sync.pdf"] },
  { id: "sub-007", assignmentId: "hw-003", studentId: "EE-2021-0188", studentName: "Fatima Sheikh", rollNo: "EE-2021-0188", submittedAt: "2026-08-21T12:00:00", status: "graded", score: 28, maxScore: 30, feedback: "Excellent K-maps.", files: ["worksheet.pdf"] },
];

export function getAssignment(id: string) {
  return mockAssignments.find((a) => a.id === id) ?? null;
}

export function getSubmissionsFor(assignmentId: string) {
  return mockSubmissions.filter((s) => s.assignmentId === assignmentId);
}

export function getSubmission(id: string) {
  return mockSubmissions.find((s) => s.id === id) ?? null;
}
