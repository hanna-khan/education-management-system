export interface ParentChild {
  id: string;
  name: string;
  grade: string;
  program: string;
  section: string;
  attendanceToday: "present" | "absent" | "late";
  gpa: number;
  feeStatus: string;
  classTeacher: string;
  classTeacherTitle: string;
}

export const mockParentChildren: ParentChild[] = [
  {
    id: "stu-2024-1024",
    name: "Ahmed Khan",
    grade: "Semester 6",
    program: "BS Computer Science",
    section: "A",
    attendanceToday: "present",
    gpa: 3.42,
    feeStatus: "paid",
    classTeacher: "Sana Iqbal",
    classTeacherTitle: "Class Adviser · Year 3",
  },
  {
    id: "child-ayesha",
    name: "Ayesha Khan",
    grade: "Grade 5",
    program: "Primary Section",
    section: "B",
    attendanceToday: "present",
    gpa: 3.8,
    feeStatus: "paid",
    classTeacher: "Ms. Nadia Rizvi",
    classTeacherTitle: "Class Teacher",
  },
  {
    id: "child-ali",
    name: "Ali Khan",
    grade: "Grade 3",
    program: "Primary Section",
    section: "A",
    attendanceToday: "absent",
    gpa: 3.5,
    feeStatus: "partial",
    classTeacher: "Ms. Hina Tariq",
    classTeacherTitle: "Class Teacher",
  },
];

export interface TeacherClass {
  id: string;
  course: string;
  subject: string;
  section: string;
  students: number;
  time: string;
  room: string;
  attendancePending: boolean;
  isClassTeacher: boolean;
  cohort: string;
}

export const mockTeacherClasses: TeacherClass[] = [
  {
    id: "cls-cs301-a",
    course: "CS-301 Data Structures",
    subject: "Mathematics",
    section: "A",
    students: 42,
    time: "Mon/Wed 10:00",
    room: "Lab A-204",
    attendancePending: true,
    isClassTeacher: true,
    cohort: "BS CS · Semester 6 · Section A",
  },
  {
    id: "cls-cs301-b",
    course: "CS-301 Data Structures",
    subject: "Mathematics",
    section: "B",
    students: 38,
    time: "Tue/Thu 10:00",
    room: "Lab A-205",
    attendancePending: false,
    isClassTeacher: false,
    cohort: "BS CS · Semester 6 · Section B",
  },
  {
    id: "cls-cs301-c",
    course: "CS-301 Data Structures",
    subject: "Mathematics",
    section: "C",
    students: 40,
    time: "Mon/Wed 11:30",
    room: "Lab A-207",
    attendancePending: true,
    isClassTeacher: false,
    cohort: "BS CS · Semester 6 · Section C",
  },
  {
    id: "cls-sci-a",
    course: "SCI-201 General Science",
    subject: "Science",
    section: "A",
    students: 36,
    time: "Tue/Thu 14:00",
    room: "Lab B-101",
    attendancePending: true,
    isClassTeacher: false,
    cohort: "Grade 7 · Section A",
  },
  {
    id: "cls-sci-b",
    course: "SCI-201 General Science",
    subject: "Science",
    section: "B",
    students: 34,
    time: "Wed/Fri 14:00",
    room: "Lab B-102",
    attendancePending: false,
    isClassTeacher: false,
    cohort: "Grade 7 · Section B",
  },
  {
    id: "cls-cs401",
    course: "CS-401 Algorithms",
    subject: "Computer Science",
    section: "A",
    students: 35,
    time: "Mon/Wed 14:00",
    room: "Lab A-206",
    attendancePending: true,
    isClassTeacher: false,
    cohort: "BS CS · Semester 7 · Section A",
  },
];

export const mockTeacherSchedule = [
  {
    day: "Monday",
    slots: [
      { time: "10:00", course: "CS-301 Section A", room: "Lab A-204" },
      { time: "11:30", course: "CS-301 Section C", room: "Lab A-207" },
      { time: "14:00", course: "CS-401 Section A", room: "Lab A-206" },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { time: "10:00", course: "CS-301 Section B", room: "Lab A-205" },
      { time: "14:00", course: "SCI-201 Section A", room: "Lab B-101" },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      { time: "10:00", course: "CS-301 Section A", room: "Lab A-204" },
      { time: "14:00", course: "SCI-201 Section B", room: "Lab B-102" },
    ],
  },
];

export interface AttendanceRosterStudent {
  id: string;
  name: string;
  status: "present" | "absent" | "late" | "excused";
}

export const mockAttendanceRosters: Record<string, AttendanceRosterStudent[]> = {
  "cls-cs301-a": [
    { id: "STU-1024", name: "Ahmed Khan", status: "present" },
    { id: "STU-0891", name: "Fatima Sheikh", status: "present" },
    { id: "STU-0456", name: "Hassan Raza", status: "late" },
    { id: "STU-1156", name: "Ayesha Malik", status: "present" },
    { id: "STU-0567", name: "Bilal Ahmed", status: "absent" },
    { id: "STU-1203", name: "Omar Siddiqui", status: "present" },
  ],
  "cls-cs301-b": [
    { id: "STU-2001", name: "Zainab Qureshi", status: "present" },
    { id: "STU-2002", name: "Fahad Mirza", status: "present" },
    { id: "STU-2003", name: "Maryam Hussain", status: "present" },
  ],
  "cls-cs301-c": [
    { id: "STU-3001", name: "Sara Ahmed", status: "present" },
    { id: "STU-3002", name: "Usman Ali", status: "absent" },
    { id: "STU-3003", name: "Noor Fatima", status: "present" },
  ],
  "cls-sci-a": [
    { id: "STU-4001", name: "Ali Khan", status: "absent" },
    { id: "STU-4002", name: "Hira Shah", status: "present" },
    { id: "STU-4003", name: "Rayan Malik", status: "present" },
  ],
  "cls-sci-b": [
    { id: "STU-5001", name: "Ayesha Khan", status: "present" },
    { id: "STU-5002", name: "Daniyal Iqbal", status: "late" },
  ],
  "cls-cs401": [
    { id: "STU-6001", name: "Ahmed Khan", status: "present" },
    { id: "STU-6002", name: "Sana Iqbal", status: "present" },
    { id: "STU-6003", name: "Hassan Raza", status: "present" },
  ],
};

export type FeeInstallmentStatus = "paid" | "due" | "overdue" | "upcoming";

export interface ParentFeeInstallment {
  id: string;
  studentId: string;
  student: string;
  month: string;
  dueDate: string;
  amount: number;
  paid: number;
  status: FeeInstallmentStatus;
}

export const mockParentFeeInstallments: ParentFeeInstallment[] = [
  { id: "fee-ahmed-jun", studentId: "stu-2024-1024", student: "Ahmed Khan", month: "June 2026", dueDate: "2026-06-10", amount: 14000, paid: 14000, status: "paid" },
  { id: "fee-ahmed-jul", studentId: "stu-2024-1024", student: "Ahmed Khan", month: "July 2026", dueDate: "2026-07-10", amount: 14000, paid: 14000, status: "paid" },
  { id: "fee-ahmed-aug", studentId: "stu-2024-1024", student: "Ahmed Khan", month: "August 2026", dueDate: "2026-08-10", amount: 14000, paid: 14000, status: "paid" },
  { id: "fee-ayesha-jun", studentId: "child-ayesha", student: "Ayesha Khan", month: "June 2026", dueDate: "2026-06-05", amount: 8500, paid: 8500, status: "paid" },
  { id: "fee-ayesha-jul", studentId: "child-ayesha", student: "Ayesha Khan", month: "July 2026", dueDate: "2026-07-05", amount: 8500, paid: 8500, status: "paid" },
  { id: "fee-ayesha-aug", studentId: "child-ayesha", student: "Ayesha Khan", month: "August 2026", dueDate: "2026-08-05", amount: 8500, paid: 8500, status: "paid" },
  { id: "fee-ali-jun", studentId: "child-ali", student: "Ali Khan", month: "June 2026", dueDate: "2026-06-05", amount: 8000, paid: 8000, status: "paid" },
  { id: "fee-ali-jul", studentId: "child-ali", student: "Ali Khan", month: "July 2026", dueDate: "2026-07-05", amount: 8000, paid: 4000, status: "overdue" },
  { id: "fee-ali-aug", studentId: "child-ali", student: "Ali Khan", month: "August 2026", dueDate: "2026-08-05", amount: 8000, paid: 0, status: "due" },
  { id: "fee-ali-sep", studentId: "child-ali", student: "Ali Khan", month: "September 2026", dueDate: "2026-09-05", amount: 8000, paid: 0, status: "upcoming" },
];

export type VisitRequestStatus = "pending" | "scheduled" | "completed" | "cancelled";

export interface ParentVisitRequest {
  id: string;
  studentId: string;
  student: string;
  requestedBy: string;
  role: "teacher" | "principal" | "class_teacher";
  reason: string;
  preferredDate: string;
  status: VisitRequestStatus;
  createdAt: string;
}

export const mockVisitRequests: ParentVisitRequest[] = [
  {
    id: "visit-001",
    studentId: "child-ali",
    student: "Ali Khan",
    requestedBy: "Ms. Hina Tariq",
    role: "class_teacher",
    reason: "Please visit school to discuss recent absences and class performance.",
    preferredDate: "2026-08-25",
    status: "pending",
    createdAt: "2026-08-22",
  },
  {
    id: "visit-002",
    studentId: "stu-2024-1024",
    student: "Ahmed Khan",
    requestedBy: "Dr. Hassan Raza",
    role: "principal",
    reason: "Meeting regarding scholarship documentation.",
    preferredDate: "2026-08-27",
    status: "scheduled",
    createdAt: "2026-08-21",
  },
];

export interface ParentAlert {
  id: string;
  title: string;
  message: string;
  type: "fee_due" | "fee_overdue" | "complaint" | "visit" | "notice";
  student?: string;
  createdAt: string;
  href: string;
  read: boolean;
}

export const mockParentAlerts: ParentAlert[] = [
  {
    id: "alert-1",
    title: "Fee overdue — Ali Khan",
    message: "July 2026 fee has an outstanding balance of PKR 4,000.",
    type: "fee_overdue",
    student: "Ali Khan",
    createdAt: "2026-08-22T08:00:00",
    href: "/parent/fees",
    read: false,
  },
  {
    id: "alert-2",
    title: "Fee due — Ali Khan",
    message: "August 2026 monthly fee is due. You can pay one month or multiple months.",
    type: "fee_due",
    student: "Ali Khan",
    createdAt: "2026-08-21T10:00:00",
    href: "/parent/fees",
    read: false,
  },
  {
    id: "alert-3",
    title: "School visit requested",
    message: "Ms. Hina Tariq asked you to visit regarding Ali Khan.",
    type: "visit",
    student: "Ali Khan",
    createdAt: "2026-08-22T09:30:00",
    href: "/parent/alerts",
    read: false,
  },
  {
    id: "alert-4",
    title: "Teacher concern",
    message: "Class teacher noted repeated late arrivals for Ali Khan.",
    type: "complaint",
    student: "Ali Khan",
    createdAt: "2026-08-20T14:00:00",
    href: "/parent/complaints",
    read: true,
  },
];

export const mockStudentCourses = [
  { code: "CS-301", name: "Data Structures", instructor: "Sana Iqbal", credits: 3, attendance: 94 },
  { code: "CS-302", name: "Database Systems", instructor: "Dr. Kamran Hussain", credits: 3, attendance: 92 },
  { code: "MTH-201", name: "Linear Algebra", instructor: "Dr. Asma Siddiqui", credits: 3, attendance: 96 },
  { code: "EE-210", name: "Circuit Analysis", instructor: "Dr. Farah Naz", credits: 3, attendance: 88 },
];

export const mockSubjectGradeMix = [
  { name: "A", value: 2, color: "#1BD0B4" },
  { name: "B+", value: 1, color: "#6B58F6" },
  { name: "B", value: 1, color: "#F4901F" },
];

export const mockRoles = [
  "Super Admin", "Institution Admin", "Campus Admin", "Principal", "Dean", "HOD",
  "Teacher", "Student", "Parent", "Accountant", "HR", "Exam Officer", "Admission Officer",
];

export const mockPermissions = [
  { module: "Students", view: true, create: true, edit: true, delete: false, approve: false, export: true },
  { module: "Admissions", view: true, create: true, edit: true, delete: false, approve: true, export: true },
  { module: "Applications", view: true, create: false, edit: true, delete: false, approve: true, export: true },
  { module: "Fees", view: true, create: true, edit: true, delete: false, approve: true, export: true },
  { module: "Settings", view: true, create: false, edit: true, delete: false, approve: false, export: false },
];

export const SETTINGS_TABS = [
  { id: "general", label: "General", href: "/settings" },
  { id: "branding", label: "Branding", href: "/settings/branding" },
  { id: "theme", label: "Appearance", href: "/settings/theme" },
  { id: "academic", label: "Academic", href: "/settings/academic" },
  { id: "modules", label: "Modules", href: "/settings/modules" },
  { id: "users", label: "Users", href: "/settings/users" },
  { id: "staff", label: "Staff & invites", href: "/settings/staff" },
  { id: "roles", label: "Roles", href: "/settings/roles" },
  { id: "import", label: "Import Data", href: "/settings/import" },
  { id: "subscription", label: "Subscription", href: "/settings/subscription" },
];
