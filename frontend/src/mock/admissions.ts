export const admissionsStats = {
  totalApplications: 1842,
  underReview: 312,
  accepted: 486,
  rejected: 198,
  pendingDocuments: 89,
  enrollmentConversion: "72.4%",
};

export const mockApplicants = [
  { id: "app-2026-001", name: "Hamza Siddiqui", program: "BS Computer Science", cycle: "Fall 2026", status: "under_review", score: 82, submitted: "2026-08-18" },
  { id: "app-2026-002", name: "Amina Tariq", program: "BS Electrical Engineering", cycle: "Fall 2026", status: "accepted", score: 91, submitted: "2026-08-15" },
  { id: "app-2026-003", name: "Rashid Mehmood", program: "BBA", cycle: "Fall 2026", status: "pending_documents", score: 74, submitted: "2026-08-20" },
  { id: "app-2026-004", name: "Hina Akbar", program: "BS Software Engineering", cycle: "Fall 2026", status: "interview", score: 88, submitted: "2026-08-12" },
  { id: "app-2026-005", name: "Danish Ali", program: "BS Architecture", cycle: "Fall 2026", status: "rejected", score: 58, submitted: "2026-08-10" },
  { id: "app-2026-006", name: "Sadia Noor", program: "BS Mathematics", cycle: "Fall 2026", status: "enrolled", score: 86, submitted: "2026-08-08" },
];

export const admissionCycles = [
  { id: "cycle-f26", name: "Fall 2026", status: "open", applications: 1842, deadline: "2026-09-30" },
  { id: "cycle-s26", name: "Spring 2026", status: "closed", applications: 1420, deadline: "2026-02-28" },
];

export const meritLists = [
  { id: "merit-cs", program: "BS Computer Science", published: "2026-08-15", seats: 120, filled: 98 },
  { id: "merit-ee", program: "BS Electrical Engineering", published: "2026-08-14", seats: 100, filled: 87 },
];

export const ADMISSIONS_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/admissions" },
  { id: "applicants", label: "Applicants", href: "/admissions/applicants" },
  { id: "programs", label: "Programs", href: "/admissions/programs" },
  { id: "cycles", label: "Admission Cycles", href: "/admissions/cycles" },
  { id: "merit", label: "Merit Lists", href: "/admissions/merit-lists" },
  { id: "interviews", label: "Interviews", href: "/admissions/interviews" },
  { id: "offers", label: "Offers", href: "/admissions/offers" },
  { id: "enrollment", label: "Enrollment", href: "/admissions/enrollment" },
];
