export const attendanceStats = {
  present: 7912,
  absent: 384,
  late: 86,
  excused: 44,
  rate: 93.9,
  total: 8426,
};

export const mockDailyAttendance = [
  { student: "Ahmed Khan", id: "STU-2024-1024", program: "BS Computer Science", grade: "Semester 6", section: "A", course: "CS-301", status: "present", time: "09:02", method: "QR", remarks: "" },
  { student: "Fatima Sheikh", id: "STU-2024-0891", program: "BS Software Engineering", grade: "Semester 4", section: "B", course: "CS-302", status: "present", time: "09:05", method: "Biometric", remarks: "" },
  { student: "Hassan Raza", id: "STU-2023-0456", program: "BS Electrical Engineering", grade: "Semester 5", section: "A", course: "EE-210", status: "late", time: "09:18", method: "Manual", remarks: "Traffic delay" },
  { student: "Ayesha Malik", id: "STU-2024-1156", program: "BS Computer Science", grade: "Semester 6", section: "A", course: "CS-301", status: "present", time: "08:58", method: "RFID", remarks: "" },
  { student: "Bilal Ahmed", id: "STU-2023-0567", program: "BS Physics", grade: "Semester 3", section: "C", course: "PHY-101", status: "absent", time: "—", method: "—", remarks: "On leave" },
  { student: "Sana Iqbal", id: "STU-2024-1203", program: "BS Computer Science", grade: "Semester 2", section: "B", course: "CS-101", status: "present", time: "09:01", method: "QR", remarks: "" },
  { student: "Fahad Mirza", id: "STU-2023-0345", program: "BS Software Engineering", grade: "Semester 5", section: "A", course: "CS-302", status: "excused", time: "—", method: "Manual", remarks: "Medical certificate" },
  { student: "Ali Khan", id: "STU-2025-0012", program: "Primary Section", grade: "Grade 3", section: "A", course: "Homeroom", status: "absent", time: "—", method: "—", remarks: "Not present" },
  { student: "Ayesha Khan", id: "STU-2025-0018", program: "Primary Section", grade: "Grade 5", section: "B", course: "Homeroom", status: "present", time: "08:50", method: "Manual", remarks: "" },
  { student: "Omar Siddiqui", id: "STU-2021-0089", program: "BS Computer Science", grade: "Semester 8", section: "A", course: "CS-401", status: "present", time: "09:00", method: "QR", remarks: "" },
];

export const mockCorrections = [
  { id: "corr-001", student: "Ahmed Khan", date: "2026-08-20", course: "CS-301", current: "absent", requested: "present", status: "pending", reason: "Marked absent incorrectly — was present in lab." },
  { id: "corr-002", student: "Hassan Raza", date: "2026-08-19", course: "EE-210", current: "absent", requested: "late", status: "approved", reason: "Arrived 15 minutes late due to campus shuttle delay." },
  { id: "corr-003", student: "Fatima Sheikh", date: "2026-08-18", course: "CS-302", current: "absent", requested: "present", status: "rejected", reason: "No supporting evidence provided." },
];

export const mockLeaveRequests = [
  { id: "leave-001", name: "Ahmed Khan", type: "Medical Leave", start: "2026-08-25", end: "2026-08-27", status: "pending", balance: "8 days" },
  { id: "leave-002", name: "Bilal Ahmed", type: "Personal Leave", start: "2026-08-22", end: "2026-08-30", status: "approved", balance: "4 days" },
  { id: "leave-003", name: "Sana Iqbal", type: "Emergency Leave", start: "2026-08-21", end: "2026-08-21", status: "approved", balance: "12 days" },
];

export const ATTENDANCE_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/attendance" },
  { id: "students", label: "Student Attendance", href: "/attendance/students" },
  { id: "teachers", label: "Teacher Attendance", href: "/attendance/teachers" },
  { id: "corrections", label: "Corrections", href: "/attendance/corrections" },
  { id: "leave", label: "Leave", href: "/attendance/leave" },
];
