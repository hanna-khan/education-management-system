import type {
  Advisee,
  AdvisingAppointment,
  AdvisingNote,
  AdvisingRecommendation,
  AdvisingRequest,
  AdvisingStats,
  Advisor,
} from "@/types/advising";

export const ADVISING_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/advising" },
  { id: "advisees", label: "Advisees", href: "/advising/students" },
  { id: "appointments", label: "Appointments", href: "/advising/appointments" },
  { id: "requests", label: "Requests", href: "/advising/requests" },
];

export const advisingStats: AdvisingStats = {
  totalAdvisees: 42,
  meetingsThisWeek: 11,
  openRequests: 7,
  atRiskStudents: 5,
  pendingRecommendations: 9,
};

export const mockAdvisors: Advisor[] = [
  { id: "adv-001", name: "Dr. Sana Iqbal", department: "Computer Science", title: "Associate Professor & Academic Advisor", email: "sana.iqbal@neduet.edu.pk", office: "CS Block, Room 214", adviseeCount: 42, availableSlots: 6 },
  { id: "adv-002", name: "Dr. Imran Malik", department: "Computer Science", title: "Assistant Professor", email: "imran.malik@neduet.edu.pk", office: "CS Block, Room 208", adviseeCount: 35, availableSlots: 3 },
  { id: "adv-003", name: "Engr. Bilal Hussain", department: "Electrical Engineering", title: "Lecturer & Advisor", email: "bilal.hussain@neduet.edu.pk", office: "EE Block, Room 112", adviseeCount: 28, availableSlots: 8 },
];

export const mockAdvisees: Advisee[] = [
  { id: "ade-001", studentId: "CS-2022-0421", name: "Ahmed Khan", program: "BS Computer Science", semester: 7, cgpa: 3.38, credits: 103, warning: "none", lastMeeting: "2026-08-10", advisorId: "adv-001" },
  { id: "ade-002", studentId: "CS-2020-0310", name: "Ayesha Malik", program: "BS Computer Science", semester: 8, cgpa: 2.15, credits: 110, warning: "probation", lastMeeting: "2026-08-05", advisorId: "adv-001" },
  { id: "ade-003", studentId: "EE-2021-0188", name: "Fatima Sheikh", program: "BS Electrical Engineering", semester: 6, cgpa: 3.55, credits: 92, warning: "none", lastMeeting: "2026-07-28", advisorId: "adv-003" },
  { id: "ade-004", studentId: "CS-2023-0112", name: "Usman Ali", program: "BS Computer Science", semester: 5, cgpa: 2.65, credits: 68, warning: "academic", lastMeeting: "2026-08-15", advisorId: "adv-001" },
  { id: "ade-005", studentId: "ME-2023-0092", name: "Hassan Raza", program: "BS Mechanical Engineering", semester: 5, cgpa: 3.10, credits: 72, warning: "attendance", lastMeeting: "2026-08-01", advisorId: "adv-002" },
  { id: "ade-006", studentId: "CS-2022-0555", name: "Maryam Hussain", program: "BS Computer Science", semester: 7, cgpa: 3.72, credits: 108, warning: "none", lastMeeting: "2026-08-12", advisorId: "adv-001" },
];

export const mockAdvisingNotes: AdvisingNote[] = [
  { id: "note-001", studentId: "CS-2022-0421", author: "Dr. Sana Iqbal", createdAt: "2026-08-10", category: "academic", body: "Discussed retake of CS-350 Database Systems. Student will register in Fall 2026. On track for Spring 2027 graduation.", private: false },
  { id: "note-002", studentId: "CS-2022-0421", author: "Dr. Sana Iqbal", createdAt: "2026-05-02", category: "career", body: "Interested in Systems Limited internship. Shared alumni contacts in Karachi.", private: false },
  { id: "note-003", studentId: "CS-2020-0310", author: "Dr. Sana Iqbal", createdAt: "2026-08-05", category: "academic", body: "On academic probation. Must clear 3 backlog courses. Weekly check-ins scheduled.", private: true },
  { id: "note-004", studentId: "CS-2023-0112", author: "Dr. Sana Iqbal", createdAt: "2026-08-15", category: "general", body: "Attendance dipped below 75% in MT-201. Issued formal warning.", private: false },
];

export const mockAppointments: AdvisingAppointment[] = [
  { id: "apt-001", studentId: "CS-2022-0421", studentName: "Ahmed Khan", advisorId: "adv-001", advisorName: "Dr. Sana Iqbal", datetime: "2026-08-25T10:00:00", durationMin: 30, mode: "in_person", status: "scheduled", topic: "Semester course plan", location: "CS Block 214" },
  { id: "apt-002", studentId: "CS-2020-0310", studentName: "Ayesha Malik", advisorId: "adv-001", advisorName: "Dr. Sana Iqbal", datetime: "2026-08-24T14:00:00", durationMin: 45, mode: "in_person", status: "scheduled", topic: "Probation recovery plan", location: "CS Block 214" },
  { id: "apt-003", studentId: "CS-2022-0421", studentName: "Ahmed Khan", advisorId: "adv-001", advisorName: "Dr. Sana Iqbal", datetime: "2026-08-10T11:00:00", durationMin: 30, mode: "online", status: "completed", topic: "Database retake", location: "Zoom" },
  { id: "apt-004", studentId: "CS-2023-0112", studentName: "Usman Ali", advisorId: "adv-001", advisorName: "Dr. Sana Iqbal", datetime: "2026-08-18T09:30:00", durationMin: 30, mode: "in_person", status: "no_show", topic: "Attendance warning", location: "CS Block 214" },
  { id: "apt-005", studentId: "ME-2023-0092", studentName: "Hassan Raza", advisorId: "adv-002", advisorName: "Dr. Imran Malik", datetime: "2026-08-26T15:00:00", durationMin: 30, mode: "online", status: "requested", topic: "Elective selection" },
];

export const mockRecommendations: AdvisingRecommendation[] = [
  { id: "rec-001", studentId: "CS-2022-0421", title: "Retake CS-350 this semester", type: "course", detail: "Priority retake to clear failed Database Systems before FYP.", status: "accepted", createdAt: "2026-08-10" },
  { id: "rec-002", studentId: "CS-2022-0421", title: "Take CS-370 AI elective", type: "elective", detail: "Strong math background; AI aligns with career interest.", status: "pending", createdAt: "2026-08-10" },
  { id: "rec-003", studentId: "CS-2022-0421", title: "Systems Limited summer internship", type: "internship", detail: "Apply before 15 Sep for Karachi SE track.", status: "pending", createdAt: "2026-08-12" },
  { id: "rec-004", studentId: "CS-2020-0310", title: "Reduce load to 12 credit hours", type: "course", detail: "Probation recovery — focus on clearing backlogs.", status: "accepted", createdAt: "2026-08-05" },
];

export const mockAdvisingRequests: AdvisingRequest[] = [
  { id: "areq-001", studentId: "CS-2022-0421", studentName: "Ahmed Khan", type: "meeting", subject: "Course add/drop advice for Fall", status: "open", createdAt: "2026-08-20" },
  { id: "areq-002", studentId: "CS-2020-0310", studentName: "Ayesha Malik", type: "petition", subject: "Request for semester overload exception", status: "in_progress", createdAt: "2026-08-18" },
  { id: "areq-003", studentId: "CS-2022-0555", studentName: "Maryam Hussain", type: "letter", subject: "Recommendation letter for HEC scholarship", status: "resolved", createdAt: "2026-08-01" },
  { id: "areq-004", studentId: "CS-2023-0112", studentName: "Usman Ali", type: "course_change", subject: "Switch elective from CS-380 to CS-370", status: "open", createdAt: "2026-08-21" },
];

export function getAdvisee(id: string) {
  return mockAdvisees.find((a) => a.id === id || a.studentId === id) ?? null;
}
