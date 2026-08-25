import type {
  DegreeProgress,
  DegreeRequirement,
  DegreeStats,
  PlannerCourse,
} from "@/types/degree-planning";

export const DEGREE_TABS = [
  { id: "dashboard", label: "Progress", href: "/degree-planning" },
  { id: "planner", label: "Semester Planner", href: "/degree-planning/planner" },
];

export const degreeStats: DegreeStats = {
  studentsOnTrack: 3180,
  studentsBehind: 640,
  avgCompletion: 61,
  avgCgpa: 3.12,
};

export const mockDegreeProgress: DegreeProgress = {
  studentId: "CS-2022-0421",
  studentName: "Ahmed Khan",
  program: "BS Computer Science",
  batch: "2022",
  creditsEarned: 103,
  creditsRequired: 132,
  percentComplete: 78,
  gpa: 3.42,
  cgpa: 3.38,
  expectedGraduation: "Spring 2027",
  standing: "good",
};

export const mockRequirements: DegreeRequirement[] = [
  { id: "req-001", code: "CS-101", title: "Programming Fundamentals", credits: 3, type: "core", status: "completed", grade: "A-", semester: "Fall 2022", prerequisites: [], category: "Computing Core" },
  { id: "req-002", code: "CS-201", title: "Object-Oriented Programming", credits: 3, type: "core", status: "completed", grade: "B+", semester: "Spring 2023", prerequisites: ["CS-101"], category: "Computing Core" },
  { id: "req-003", code: "CS-301", title: "Data Structures & Algorithms", credits: 3, type: "core", status: "in_progress", prerequisites: ["CS-201"], category: "Computing Core" },
  { id: "req-004", code: "CS-302", title: "Operating Systems", credits: 3, type: "core", status: "in_progress", prerequisites: ["CS-201"], category: "Computing Core" },
  { id: "req-005", code: "CS-401", title: "Computer Networks", credits: 3, type: "core", status: "remaining", prerequisites: ["CS-302"], category: "Computing Core" },
  { id: "req-006", code: "CS-452", title: "Network Security", credits: 3, type: "elective", status: "remaining", prerequisites: ["CS-401"], category: "Electives" },
  { id: "req-007", code: "MT-101", title: "Calculus I", credits: 3, type: "general", status: "completed", grade: "A", semester: "Fall 2022", prerequisites: [], category: "Mathematics" },
  { id: "req-008", code: "MT-201", title: "Linear Algebra", credits: 3, type: "general", status: "completed", grade: "B", semester: "Spring 2023", prerequisites: ["MT-101"], category: "Mathematics" },
  { id: "req-009", code: "EE-201", title: "Digital Logic Design", credits: 4, type: "lab", status: "completed", grade: "A-", semester: "Fall 2023", prerequisites: [], category: "Supporting" },
  { id: "req-010", code: "CS-499", title: "Final Year Project", credits: 6, type: "project", status: "remaining", prerequisites: ["CS-301", "CS-302"], category: "Capstone" },
  { id: "req-011", code: "HS-101", title: "Pakistan Studies", credits: 2, type: "general", status: "completed", grade: "A", semester: "Fall 2022", prerequisites: [], category: "Humanities" },
  { id: "req-012", code: "CS-350", title: "Database Systems", credits: 3, type: "core", status: "failed", grade: "F", semester: "Spring 2025", prerequisites: ["CS-201"], category: "Computing Core" },
  { id: "req-013", code: "CS-350", title: "Database Systems (Retake)", credits: 3, type: "core", status: "remaining", prerequisites: ["CS-201"], category: "Computing Core" },
  { id: "req-014", code: "CS-360", title: "Software Engineering", credits: 3, type: "core", status: "completed", grade: "B+", semester: "Fall 2024", prerequisites: ["CS-201"], category: "Computing Core" },
];

export const mockPlannerCourses: PlannerCourse[] = [
  { id: "pl-001", code: "CS-401", title: "Computer Networks", credits: 3, type: "core", eligible: false, recommended: true, prereqMet: false, prereqMissing: ["CS-302"], offered: true, seatsLeft: 12 },
  { id: "pl-002", code: "CS-350", title: "Database Systems (Retake)", credits: 3, type: "core", eligible: true, recommended: true, prereqMet: true, prereqMissing: [], offered: true, seatsLeft: 8 },
  { id: "pl-003", code: "CS-370", title: "Artificial Intelligence", credits: 3, type: "elective", eligible: true, recommended: true, prereqMet: true, prereqMissing: [], offered: true, seatsLeft: 15 },
  { id: "pl-004", code: "CS-452", title: "Network Security", credits: 3, type: "elective", eligible: false, recommended: false, prereqMet: false, prereqMissing: ["CS-401"], offered: true, seatsLeft: 20 },
  { id: "pl-005", code: "MT-301", title: "Probability & Statistics", credits: 3, type: "general", eligible: true, recommended: true, prereqMet: true, prereqMissing: [], offered: true, seatsLeft: 25 },
  { id: "pl-006", code: "CS-380", title: "Mobile App Development", credits: 3, type: "elective", eligible: true, recommended: false, prereqMet: true, prereqMissing: [], offered: true, seatsLeft: 5 },
  { id: "pl-007", code: "EE-450", title: "Embedded Systems", credits: 3, type: "elective", eligible: true, recommended: false, prereqMet: true, prereqMissing: [], offered: false, seatsLeft: 0 },
  { id: "pl-008", code: "CS-499", title: "Final Year Project", credits: 6, type: "project", eligible: false, recommended: false, prereqMet: false, prereqMissing: ["CS-301", "CS-302"], offered: true, seatsLeft: 40 },
];

export const creditBreakdown = [
  { label: "Computing Core", earned: 54, required: 72 },
  { label: "Electives", earned: 9, required: 18 },
  { label: "Mathematics", earned: 12, required: 15 },
  { label: "Supporting / Labs", earned: 16, required: 15 },
  { label: "Humanities", earned: 8, required: 6 },
  { label: "Capstone", earned: 0, required: 6 },
];
