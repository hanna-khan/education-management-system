export const examStats = {
  upcoming: 24,
  completed: 156,
  resultsPending: 8,
  rooms: 42,
  invigilators: 86,
};

export const mockExamSchedule = [
  { id: "exam-001", course: "CS-301 Data Structures", type: "Midterm", date: "2026-08-28", time: "10:00 AM", room: "Lab Block A · Hall 1", invigilator: "Dr. Kamran Hussain" },
  { id: "exam-002", course: "EE-210 Circuit Analysis", type: "Midterm", date: "2026-08-29", time: "10:00 AM", room: "Engineering Block · 112", invigilator: "Dr. Farah Naz" },
  { id: "exam-003", course: "MTH-201 Linear Algebra", type: "Midterm", date: "2026-08-30", time: "02:00 PM", room: "Science Block · 301", invigilator: "Dr. Asma Siddiqui" },
  { id: "exam-004", course: "CS-302 Database Systems", type: "Midterm", date: "2026-09-02", time: "10:00 AM", room: "Lab Block A · Hall 2", invigilator: "Sana Iqbal" },
];

export const mockMarksEntry = [
  { student: "Ahmed Khan", id: "STU-2024-1024", assignment: 18, midterm: 32, final: 0, total: 50, grade: "—" },
  { student: "Fatima Sheikh", id: "STU-2024-0891", assignment: 20, midterm: 35, final: 0, total: 55, grade: "—" },
  { student: "Sana Iqbal", id: "STU-2024-1203", assignment: 19, midterm: 38, final: 0, total: 57, grade: "—" },
  { student: "Nadia Farooq", id: "STU-2024-0876", assignment: 17, midterm: 28, final: 0, total: 45, grade: "—" },
  { student: "Waqas Javed", id: "STU-2023-0412", assignment: 12, midterm: 22, final: 0, total: 34, grade: "—" },
];

export const mockStudentResults = {
  semester: "Fall 2025",
  gpa: 3.42,
  cgpa: 3.38,
  courses: [
    { code: "CS-301", name: "Data Structures", credits: 3, marks: 82, grade: "A-", points: 3.7 },
    { code: "CS-302", name: "Database Systems", credits: 3, marks: 78, grade: "B+", points: 3.3 },
    { code: "MTH-201", name: "Linear Algebra", credits: 3, marks: 85, grade: "A", points: 4.0 },
    { code: "EE-210", name: "Circuit Analysis", credits: 3, marks: 72, grade: "B", points: 3.0 },
    { code: "SS-101", name: "Pakistan Studies", credits: 2, marks: 88, grade: "A", points: 4.0 },
  ],
};

export const EXAMS_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/exams" },
  { id: "schedules", label: "Schedules", href: "/exams/schedules" },
  { id: "marks", label: "Marks Entry", href: "/exams/marks" },
  { id: "results", label: "Results", href: "/exams/results" },
];
