import type {
  LmsAnnouncement,
  LmsAssignment,
  LmsAttendanceRow,
  LmsCourse,
  LmsDiscussion,
  LmsGradeRow,
  LmsLesson,
  LmsMaterial,
  LmsQuiz,
  LmsStats,
} from "@/types/lms";

export const LMS_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/lms" },
  { id: "courses", label: "Courses", href: "/lms/courses" },
];

export const lmsStats: LmsStats = {
  activeCourses: 86,
  totalStudents: 4120,
  pendingGrading: 128,
  openQuizzes: 24,
  materialsUploaded: 1860,
  discussionPosts: 942,
};

export const mockLmsCourses: LmsCourse[] = [
  {
    id: "lms-001",
    code: "CS-301",
    title: "Data Structures & Algorithms",
    department: "Computer Science",
    instructor: "Dr. Sana Iqbal",
    instructorId: "FAC-CS-014",
    semester: "Fall 2026",
    section: "A",
    students: 48,
    credits: 3,
    status: "active",
    progress: 62,
    description: "Arrays, trees, graphs, hashing, and algorithm analysis for BS CS.",
    schedule: "Mon/Wed 09:00–10:30 · Lab Thu 14:00",
  },
  {
    id: "lms-002",
    code: "CS-302",
    title: "Operating Systems",
    department: "Computer Science",
    instructor: "Dr. Imran Malik",
    instructorId: "FAC-CS-008",
    semester: "Fall 2026",
    section: "B",
    students: 42,
    credits: 3,
    status: "active",
    progress: 55,
    description: "Process management, memory, file systems, and concurrency.",
    schedule: "Tue/Thu 11:00–12:30",
  },
  {
    id: "lms-003",
    code: "EE-201",
    title: "Digital Logic Design",
    department: "Electrical Engineering",
    instructor: "Engr. Bilal Hussain",
    instructorId: "FAC-EE-021",
    semester: "Fall 2026",
    section: "A",
    students: 55,
    credits: 4,
    status: "active",
    progress: 48,
    description: "Boolean algebra, combinational & sequential circuits, HDL intro.",
    schedule: "Mon/Wed 14:00–15:30 · Lab Fri 09:00",
  },
  {
    id: "lms-004",
    code: "ME-301",
    title: "Thermodynamics II",
    department: "Mechanical Engineering",
    instructor: "Dr. Asad Rehman",
    instructorId: "FAC-ME-011",
    semester: "Fall 2026",
    section: "A",
    students: 38,
    credits: 3,
    status: "active",
    progress: 40,
    description: "Gas power cycles, refrigeration, and psychrometrics.",
    schedule: "Tue/Thu 09:00–10:30",
  },
  {
    id: "lms-005",
    code: "CS-452",
    title: "Network Security",
    department: "Computer Science",
    instructor: "Dr. Sana Iqbal",
    instructorId: "FAC-CS-014",
    semester: "Fall 2026",
    section: "A",
    students: 28,
    credits: 3,
    status: "active",
    progress: 35,
    description: "Cryptography, secure protocols, and threat modelling.",
    schedule: "Wed 16:00–19:00",
  },
  {
    id: "lms-006",
    code: "MT-101",
    title: "Calculus I",
    department: "Mathematics",
    instructor: "Ms. Nadia Farooq",
    instructorId: "FAC-MT-003",
    semester: "Fall 2026",
    section: "C",
    students: 60,
    credits: 3,
    status: "active",
    progress: 70,
    description: "Limits, derivatives, and applications for first-year engineers.",
    schedule: "Mon/Wed/Fri 08:00–09:00",
  },
];

export const mockAnnouncements: LmsAnnouncement[] = [
  { id: "an-001", courseId: "lms-001", title: "Midterm syllabus confirmed", body: "Chapters 1–8 inclusive. Bring student ID card to the exam hall.", author: "Dr. Sana Iqbal", pinned: true, createdAt: "2026-08-18" },
  { id: "an-002", courseId: "lms-001", title: "Lab 5 submission extended", body: "Deadline moved to Friday 23:59 due to power outage in Lab Block B.", author: "Dr. Sana Iqbal", pinned: false, createdAt: "2026-08-20" },
  { id: "an-003", courseId: "lms-002", title: "Guest lecture: Linux Kernel", body: "Engr. from Systems Limited will join Thu class online.", author: "Dr. Imran Malik", pinned: true, createdAt: "2026-08-19" },
];

export const mockMaterials: LmsMaterial[] = [
  { id: "mat-001", courseId: "lms-001", title: "Week 1 — Arrays & Complexity.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "2026-08-01", week: 1, downloadable: true },
  { id: "mat-002", courseId: "lms-001", title: "Week 3 — Trees lecture slides", type: "slides", size: "8.1 MB", uploadedAt: "2026-08-08", week: 3, downloadable: true },
  { id: "mat-003", courseId: "lms-001", title: "BST demo (Python)", type: "code", size: "14 KB", uploadedAt: "2026-08-10", week: 4, downloadable: true },
  { id: "mat-004", courseId: "lms-001", title: "Graph algorithms — recorded lecture", type: "video", size: "420 MB", uploadedAt: "2026-08-15", week: 5, downloadable: false },
  { id: "mat-005", courseId: "lms-001", title: "CLRS Chapter 12 reading", type: "link", uploadedAt: "2026-08-12", week: 4, downloadable: false },
  { id: "mat-006", courseId: "lms-002", title: "Process scheduling notes", type: "pdf", size: "1.1 MB", uploadedAt: "2026-08-05", week: 2, downloadable: true },
];

export const mockLessons: LmsLesson[] = [
  { id: "les-001", courseId: "lms-001", week: 1, title: "Asymptotic analysis", duration: "90 min", completed: true, type: "lecture" },
  { id: "les-002", courseId: "lms-001", week: 2, title: "Linked lists & stacks", duration: "90 min", completed: true, type: "lecture" },
  { id: "les-003", courseId: "lms-001", week: 3, title: "Trees lab", duration: "120 min", completed: true, type: "lab" },
  { id: "les-004", courseId: "lms-001", week: 4, title: "Binary search trees", duration: "90 min", completed: false, type: "lecture" },
  { id: "les-005", courseId: "lms-001", week: 5, title: "Graph traversal", duration: "90 min", completed: false, type: "lecture" },
  { id: "les-006", courseId: "lms-001", week: 5, title: "Tutorial: Dijkstra", duration: "60 min", completed: false, type: "tutorial" },
];

export const mockLmsAssignments: LmsAssignment[] = [
  { id: "asg-001", courseId: "lms-001", title: "Assignment 3 — Graph Algorithms", description: "Implement BFS, DFS, and Dijkstra on a Karachi metro graph dataset.", dueAt: "2026-08-28T23:59:00", maxScore: 100, status: "published", submissionsCount: 36, gradedCount: 12, allowLate: true, latePenaltyPct: 10 },
  { id: "asg-002", courseId: "lms-001", title: "Assignment 2 — BST Operations", description: "Insert, delete, and traverse BST with unit tests.", dueAt: "2026-08-14T23:59:00", maxScore: 100, status: "grading", submissionsCount: 48, gradedCount: 40, allowLate: true, latePenaltyPct: 10 },
  { id: "asg-003", courseId: "lms-002", title: "Lab Report — Process Sync", description: "Mutex and semaphore experiments on Ubuntu lab PCs.", dueAt: "2026-08-25T23:59:00", maxScore: 50, status: "published", submissionsCount: 28, gradedCount: 0, allowLate: false, latePenaltyPct: 0 },
];

export const mockQuizzes: LmsQuiz[] = [
  { id: "qz-001", courseId: "lms-001", title: "Quiz 2 — Trees", questions: 15, durationMin: 30, dueAt: "2026-08-22T17:00:00", status: "open", attemptsAllowed: 1, avgScore: 72 },
  { id: "qz-002", courseId: "lms-001", title: "Quiz 1 — Complexity", questions: 10, durationMin: 20, dueAt: "2026-08-08T17:00:00", status: "closed", attemptsAllowed: 1, avgScore: 78 },
  { id: "qz-003", courseId: "lms-003", title: "Quiz — Boolean Algebra", questions: 12, durationMin: 25, dueAt: "2026-08-24T12:00:00", status: "open", attemptsAllowed: 2, avgScore: 0 },
];

export const mockDiscussions: LmsDiscussion[] = [
  { id: "disc-001", courseId: "lms-001", title: "Clarification on Dijkstra edge weights", author: "Ahmed Khan", replies: 8, lastActivity: "2026-08-21", pinned: true },
  { id: "disc-002", courseId: "lms-001", title: "Study group for midterm — CS Block Room 4", author: "Fatima Sheikh", replies: 14, lastActivity: "2026-08-20", pinned: false },
  { id: "disc-003", courseId: "lms-002", title: "Deadlock example from lecture", author: "Hassan Raza", replies: 5, lastActivity: "2026-08-19", pinned: false },
];

export const mockLmsAttendance: LmsAttendanceRow[] = [
  { id: "att-001", courseId: "lms-001", date: "2026-08-18", present: 44, absent: 3, late: 1, total: 48 },
  { id: "att-002", courseId: "lms-001", date: "2026-08-20", present: 46, absent: 2, late: 0, total: 48 },
  { id: "att-003", courseId: "lms-001", date: "2026-08-21", present: 42, absent: 4, late: 2, total: 48 },
];

export const mockLmsGrades: LmsGradeRow[] = [
  { id: "gr-001", studentId: "CS-2022-0421", studentName: "Ahmed Khan", assignment: "Assignment 3 — Graph Algorithms", score: null, maxScore: 100, status: "submitted", submittedAt: "2026-08-21T18:40:00" },
  { id: "gr-002", studentId: "EE-2021-0188", studentName: "Fatima Sheikh", assignment: "Assignment 3 — Graph Algorithms", score: 88, maxScore: 100, status: "graded", submittedAt: "2026-08-20T21:10:00" },
  { id: "gr-003", studentId: "ME-2023-0092", studentName: "Hassan Raza", assignment: "Assignment 3 — Graph Algorithms", score: null, maxScore: 100, status: "late", submittedAt: "2026-08-29T01:05:00" },
  { id: "gr-004", studentId: "CS-2020-0310", studentName: "Ayesha Malik", assignment: "Assignment 3 — Graph Algorithms", score: null, maxScore: 100, status: "missing" },
  { id: "gr-005", studentId: "CS-2022-0555", studentName: "Usman Ali", assignment: "Assignment 2 — BST Operations", score: 92, maxScore: 100, status: "graded", submittedAt: "2026-08-13T20:00:00" },
];

export function getLmsCourse(id: string) {
  return mockLmsCourses.find((c) => c.id === id) ?? null;
}
