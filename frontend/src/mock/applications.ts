export type ApplicationStatus = "pending" | "in_review" | "approved" | "rejected" | "changes_requested";
export type ApplicationType = "leave" | "scholarship" | "fee_concession" | "certificate" | "transcript" | "course_withdrawal" | "attendance_correction" | "profile_update" | "id_card_replacement" | "general";

export interface Application {
  id: string;
  applicant: string;
  applicantId: string;
  type: ApplicationType;
  submitted: string;
  stage: string;
  assignedTo: string;
  sla: string;
  slaBreached: boolean;
  status: ApplicationStatus;
}

export const applicationStats = {
  all: 156,
  pending: 42,
  inReview: 38,
  approved: 58,
  rejected: 12,
  slaBreached: 8,
};

export const mockApplications: Application[] = [
  { id: "APP-2026-1842", applicant: "Ayesha Sheikh", applicantId: "stu-2024-1156", type: "leave", submitted: "2026-08-20", stage: "HOD Review", assignedTo: "Dr. Imran Malik", sla: "2 days left", slaBreached: false, status: "in_review" },
  { id: "APP-2026-1838", applicant: "Ahmed Khan", applicantId: "stu-2024-1024", type: "scholarship", submitted: "2026-08-19", stage: "Finance Verification", assignedTo: "Finance Dept", sla: "Breached", slaBreached: true, status: "in_review" },
  { id: "APP-2026-1835", applicant: "Fatima Sheikh", applicantId: "stu-2024-0891", type: "fee_concession", submitted: "2026-08-18", stage: "Principal Approval", assignedTo: "Dr. Hassan Raza", sla: "1 day left", slaBreached: false, status: "in_review" },
  { id: "APP-2026-1830", applicant: "Hassan Raza", applicantId: "stu-2023-0456", type: "attendance_correction", submitted: "2026-08-17", stage: "Teacher Review", assignedTo: "Sana Iqbal", sla: "3 days left", slaBreached: false, status: "pending" },
  { id: "APP-2026-1825", applicant: "Maryam Hussain", applicantId: "stu-2024-0912", type: "transcript", submitted: "2026-08-16", stage: "Completed", assignedTo: "Exam Office", sla: "—", slaBreached: false, status: "approved" },
  { id: "APP-2026-1820", applicant: "Omar Siddiqui", applicantId: "stu-2021-0089", type: "certificate", submitted: "2026-08-15", stage: "Document Verification", assignedTo: "Admin Office", sla: "4 days left", slaBreached: false, status: "in_review" },
  { id: "APP-2026-1815", applicant: "Zainab Qureshi", applicantId: "stu-2024-0789", type: "profile_update", submitted: "2026-08-14", stage: "Admin Review", assignedTo: "Ayesha Malik", sla: "Completed", slaBreached: false, status: "approved" },
  { id: "APP-2026-1810", applicant: "Fahad Mirza", applicantId: "stu-2023-0345", type: "course_withdrawal", submitted: "2026-08-12", stage: "Rejected", assignedTo: "Dr. Kamran Hussain", sla: "—", slaBreached: false, status: "rejected" },
];

export const applicationWorkflowSteps = [
  { step: "Submitted", status: "completed", date: "2026-08-20 10:30" },
  { step: "Teacher Review", status: "completed", date: "2026-08-21 14:15" },
  { step: "HOD Review", status: "current", date: "In progress" },
  { step: "Finance", status: "pending", date: "" },
  { step: "Principal", status: "pending", date: "" },
  { step: "Completed", status: "pending", date: "" },
];

export const mockWorkflows = [
  { id: "wf-leave", name: "Student Leave Request", trigger: "Application submitted", steps: 4, status: "active", sla: "5 days" },
  { id: "wf-scholarship", name: "Scholarship Application", trigger: "Application submitted", steps: 5, status: "active", sla: "14 days" },
  { id: "wf-fee", name: "Fee Concession Request", trigger: "Application submitted", steps: 4, status: "active", sla: "7 days" },
  { id: "wf-transcript", name: "Transcript Request", trigger: "Application submitted", steps: 3, status: "active", sla: "3 days" },
  { id: "wf-profile", name: "Profile Update Request", trigger: "Application submitted", steps: 2, status: "draft", sla: "2 days" },
];

export const workflowDetail = {
  id: "wf-leave",
  name: "Student Leave Request",
  description: "Multi-step approval for student leave applications.",
  trigger: "When a student submits a leave application",
  form: "Leave Application Form",
  status: "active",
  steps: [
    { order: 1, name: "Teacher Approval", role: "Teacher", sla: "2 days", required: true },
    { order: 2, name: "HOD Approval", role: "HOD", sla: "2 days", required: true },
    { order: 3, name: "Finance Verification", role: "Accountant", sla: "1 day", required: false },
    { order: 4, name: "Principal Approval", role: "Principal", sla: "1 day", required: true },
  ],
};
