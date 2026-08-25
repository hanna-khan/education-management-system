export const mockDocuments = [
  { id: "doc-001", name: "Ahmed Khan — CNIC Copy", folder: "Student Documents", type: "CNIC", uploaded: "2026-08-15", verified: true, expiry: "2030-03-15" },
  { id: "doc-002", name: "Fall 2026 Transcript Template", folder: "Academic Documents", type: "Template", uploaded: "2026-08-10", verified: true, expiry: "" },
  { id: "doc-003", name: "Dr. Kamran Hussain — Appointment Letter", folder: "Employee Documents", type: "Contract", uploaded: "2026-01-20", verified: true, expiry: "2027-01-20" },
  { id: "doc-004", name: "Merit Scholarship Certificate — Maryam Hussain", folder: "Certificates", type: "Certificate", uploaded: "2026-08-18", verified: false, expiry: "" },
  { id: "doc-005", name: "Annual Enrollment Report 2025", folder: "Reports", type: "Report", uploaded: "2026-07-01", verified: true, expiry: "" },
];

export const documentFolders = [
  { name: "Student Documents", count: 8426, icon: "GraduationCap" },
  { name: "Employee Documents", count: 386, icon: "Briefcase" },
  { name: "Academic Documents", count: 1240, icon: "BookOpen" },
  { name: "Certificates", count: 890, icon: "Award" },
  { name: "Reports", count: 156, icon: "BarChart3" },
];

export const reportCategories = [
  { id: "academic", name: "Academic", reports: 12, description: "Enrollment, performance, and curriculum reports" },
  { id: "attendance", name: "Attendance", reports: 8, description: "Daily, course-wise, and department attendance" },
  { id: "finance", name: "Finance", reports: 10, description: "Fee collection, defaulters, and revenue" },
  { id: "students", name: "Students", reports: 14, description: "Demographics, retention, and growth" },
  { id: "faculty", name: "Faculty", reports: 6, description: "Faculty workload and performance" },
  { id: "applications", name: "Applications", reports: 7, description: "Workflow turnaround and SLA reports" },
  { id: "hr", name: "HR", reports: 9, description: "Payroll, leave, and employee analytics" },
];
