export const mockDepartments = [
  { id: "dept-cs", name: "Computer Science", code: "CS", programs: 4, faculty: 42, students: 1240, hod: "Dr. Kamran Hussain" },
  { id: "dept-ee", name: "Electrical Engineering", code: "EE", programs: 3, faculty: 38, students: 980, hod: "Dr. Farah Naz" },
  { id: "dept-ba", name: "Business Administration", code: "BA", programs: 2, faculty: 28, students: 720, hod: "Dr. Imran Malik" },
  { id: "dept-me", name: "Mechanical Engineering", code: "ME", programs: 2, faculty: 34, students: 860, hod: "Dr. Saima Qureshi" },
  { id: "dept-arch", name: "Architecture", code: "ARCH", programs: 1, faculty: 18, students: 420, hod: "Dr. Nabeel Ahmed" },
  { id: "dept-math", name: "Mathematics", code: "MTH", programs: 2, faculty: 22, students: 380, hod: "Dr. Asma Siddiqui" },
  { id: "dept-phy", name: "Physics", code: "PHY", programs: 2, faculty: 20, students: 310, hod: "Dr. Tariq Javed" },
  { id: "dept-ss", name: "Social Sciences", code: "SS", programs: 2, faculty: 16, students: 280, hod: "Dr. Hina Shah" },
];

export const mockPrograms = [
  { id: "prog-bscs", name: "BS Computer Science", department: "Computer Science", duration: "4 years", credits: 130, students: 680, type: "undergraduate" },
  { id: "prog-bsse", name: "BS Software Engineering", department: "Computer Science", duration: "4 years", credits: 132, students: 420, type: "undergraduate" },
  { id: "prog-bsee", name: "BS Electrical Engineering", department: "Electrical Engineering", duration: "4 years", credits: 138, students: 580, type: "undergraduate" },
  { id: "prog-bba", name: "BBA", department: "Business Administration", duration: "4 years", credits: 124, students: 480, type: "undergraduate" },
  { id: "prog-mba", name: "MBA", department: "Business Administration", duration: "2 years", credits: 66, students: 240, type: "graduate" },
  { id: "prog-bsme", name: "BS Mechanical Engineering", department: "Mechanical Engineering", duration: "4 years", credits: 136, students: 520, type: "undergraduate" },
];

export const mockCourses = [
  { id: "cs-301", code: "CS-301", name: "Data Structures", credits: 3, department: "Computer Science", instructor: "Sana Iqbal", section: "A", students: 42 },
  { id: "cs-302", code: "CS-302", name: "Database Systems", credits: 3, department: "Computer Science", instructor: "Dr. Kamran Hussain", section: "B", students: 38 },
  { id: "ee-210", code: "EE-210", name: "Circuit Analysis", credits: 3, department: "Electrical Engineering", instructor: "Dr. Farah Naz", section: "A", students: 45 },
  { id: "mth-201", code: "MTH-201", name: "Linear Algebra", credits: 3, department: "Mathematics", instructor: "Dr. Asma Siddiqui", section: "A", students: 52 },
  { id: "ba-101", code: "BA-101", name: "Principles of Management", credits: 3, department: "Business Administration", instructor: "Dr. Imran Malik", section: "C", students: 60 },
];

export const mockSections = [
  { id: "sec-cs301-a", course: "CS-301", section: "A", teacher: "Sana Iqbal", room: "Lab Block A · 204", students: 42, schedule: "Mon/Wed 10:00" },
  { id: "sec-cs301-b", course: "CS-301", section: "B", teacher: "Sana Iqbal", room: "Lab Block A · 205", students: 38, schedule: "Tue/Thu 10:00" },
  { id: "sec-ee210-a", course: "EE-210", section: "A", teacher: "Dr. Farah Naz", room: "Eng Block · 112", students: 45, schedule: "Mon/Wed 14:00" },
];

export const timetableSlots = [
  { day: "Monday", time: "10:00", course: "CS-301 Data Structures", teacher: "Sana Iqbal", room: "Lab A-204", section: "A" },
  { day: "Monday", time: "14:00", course: "EE-210 Circuit Analysis", teacher: "Dr. Farah Naz", room: "Eng-112", section: "A" },
  { day: "Tuesday", time: "10:00", course: "MTH-201 Linear Algebra", teacher: "Dr. Asma Siddiqui", room: "Sci-301", section: "A" },
  { day: "Wednesday", time: "10:00", course: "CS-301 Data Structures", teacher: "Sana Iqbal", room: "Lab A-204", section: "A" },
  { day: "Thursday", time: "11:00", course: "CS-302 Database Systems", teacher: "Dr. Kamran Hussain", room: "Lab A-206", section: "B" },
  { day: "Friday", time: "09:00", course: "BA-101 Management", teacher: "Dr. Imran Malik", room: "City-102", section: "C" },
];

export const ACADEMICS_TABS = [
  { id: "overview", label: "Overview", href: "/academics" },
  { id: "departments", label: "Departments", href: "/academics/departments" },
  { id: "programs", label: "Programs", href: "/academics/programs" },
  { id: "courses", label: "Courses", href: "/academics/courses" },
  { id: "sections", label: "Sections", href: "/academics/sections" },
  { id: "timetable", label: "Timetable", href: "/academics/timetable" },
];
