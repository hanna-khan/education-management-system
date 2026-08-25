export const feeStats = {
  totalBilled: 142000000,
  collected: 128000000,
  outstanding: 14000000,
  overdue: 4200000,
};

export const mockInvoices = [
  { id: "INV-2026-8421", student: "Ahmed Khan", program: "BS Computer Science", semester: "Fall 2026", total: 85000, paid: 85000, outstanding: 0, status: "paid" },
  { id: "INV-2026-8422", student: "Fatima Sheikh", program: "BS Software Engineering", semester: "Fall 2026", total: 85000, paid: 42500, outstanding: 42500, status: "partial" },
  { id: "INV-2026-8423", student: "Hassan Raza", program: "BS Electrical Engineering", semester: "Fall 2026", total: 88000, paid: 0, outstanding: 88000, status: "overdue" },
  { id: "INV-2026-8424", student: "Maryam Hussain", program: "BS Physics", semester: "Fall 2026", total: 82000, paid: 0, outstanding: 0, status: "waived" },
];

export const mockPayments = [
  { id: "PAY-2026-1201", student: "Ahmed Khan", amount: 85000, method: "Bank Transfer", date: "2026-08-21", receipt: "RCP-2026-1201" },
  { id: "PAY-2026-1202", student: "Fatima Sheikh", amount: 42500, method: "Online Payment", date: "2026-08-20", receipt: "RCP-2026-1202" },
  { id: "PAY-2026-1203", student: "Ayesha Malik", amount: 85000, method: "Cash", date: "2026-08-19", receipt: "RCP-2026-1203" },
];

export const mockScholarships = [
  { id: "sch-001", student: "Maryam Hussain", type: "Merit Scholarship", amount: 82000, status: "awarded", semester: "Fall 2026" },
  { id: "sch-002", student: "Ahmed Khan", type: "Need-Based Scholarship", amount: 40000, status: "under_review", semester: "Fall 2026" },
  { id: "sch-003", student: "Sana Iqbal", type: "Merit Scholarship", amount: 85000, status: "approved", semester: "Fall 2026" },
  { id: "sch-004", student: "Hassan Raza", type: "Sports Scholarship", amount: 30000, status: "rejected", semester: "Fall 2026" },
];

export const scholarshipStats = {
  applications: 186,
  underReview: 42,
  approved: 68,
  rejected: 24,
  awardedAmount: 4200000,
};

export const FEES_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/fees" },
  { id: "students", label: "Student Fees", href: "/fees/students" },
  { id: "invoices", label: "Invoices", href: "/fees/invoices" },
  { id: "payments", label: "Payments", href: "/fees/payments" },
  { id: "scholarships", label: "Scholarships", href: "/fees/scholarships" },
];

export const feeBreakdown = [
  { head: "Tuition Fee", amount: 65000 },
  { head: "Lab Fee", amount: 8000 },
  { head: "Library Fee", amount: 3000 },
  { head: "Transport Fee", amount: 5000 },
  { head: "Other Charges", amount: 4000 },
];
