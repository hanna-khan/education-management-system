export type AuditStatus = "COMPLETE" | "PARTIAL" | "MISSING" | "NEEDS_IMPROVEMENT";

export interface AuditFeature {
  module: string;
  feature: string;
  status: AuditStatus;
  notes: string;
}

export const PHASE1_AUDIT: AuditFeature[] = [
  // A. Multi-tenancy
  { module: "Multi-tenancy", feature: "Institution/tenant management", status: "COMPLETE", notes: "Platform Institutions table with tenant list" },
  { module: "Multi-tenancy", feature: "Tenant isolation concept", status: "PARTIAL", notes: "Institution switcher exists; data not scoped per tenant" },
  { module: "Multi-tenancy", feature: "Institution profile", status: "COMPLETE", notes: "Settings general form" },
  { module: "Multi-tenancy", feature: "Institution logo", status: "PARTIAL", notes: "Initials avatar only; no upload UI" },
  { module: "Multi-tenancy", feature: "Institution branding", status: "COMPLETE", notes: "Branding + theme settings pages" },
  { module: "Multi-tenancy", feature: "Institution type", status: "COMPLETE", notes: "university | school with mode switcher" },
  { module: "Multi-tenancy", feature: "Campus management", status: "PARTIAL", notes: "Campus field + onboarding; no campus CRUD" },
  { module: "Multi-tenancy", feature: "Academic year", status: "PARTIAL", notes: "Semester fields only; no year entity UI" },
  { module: "Multi-tenancy", feature: "Semester/term configuration", status: "PARTIAL", notes: "Academic settings form fields" },
  { module: "Multi-tenancy", feature: "Tenant-specific settings", status: "PARTIAL", notes: "Settings UI exists; not enforced per tenant" },
  { module: "Multi-tenancy", feature: "Tenant-specific enabled modules", status: "PARTIAL", notes: "Modules settings page added; mock toggles only" },
  { module: "Multi-tenancy", feature: "Subscription information", status: "COMPLETE", notes: "Institution + platform subscription views" },
  { module: "Multi-tenancy", feature: "Trial period", status: "COMPLETE", notes: "TrialBanner + trial UI" },
  { module: "Multi-tenancy", feature: "Plan information", status: "COMPLETE", notes: "Platform plans + plan cards" },
  { module: "Multi-tenancy", feature: "Billing status", status: "PARTIAL", notes: "Status badges; no invoice history" },

  // B. Auth & access
  { module: "Authentication & Access", feature: "Login", status: "PARTIAL", notes: "Login UI; demo link to dashboard" },
  { module: "Authentication & Access", feature: "Logout", status: "PARTIAL", notes: "Sign out menu item; no session clear" },
  { module: "Authentication & Access", feature: "Forgot password", status: "PARTIAL", notes: "Form exists; mock submit only" },
  { module: "Authentication & Access", feature: "Password reset", status: "PARTIAL", notes: "Reset password page added (mock)" },
  { module: "Authentication & Access", feature: "Role-based access", status: "PARTIAL", notes: "Nav by role; no route guards" },
  { module: "Authentication & Access", feature: "Permission management", status: "PARTIAL", notes: "Roles matrix UI; not enforced" },
  { module: "Authentication & Access", feature: "Admin roles", status: "COMPLETE", notes: "Demo admin / principal / HOD personas" },
  { module: "Authentication & Access", feature: "Teacher roles", status: "COMPLETE", notes: "Teacher portal + demo user" },
  { module: "Authentication & Access", feature: "Student roles", status: "COMPLETE", notes: "Student portal + demo user" },
  { module: "Authentication & Access", feature: "Parent roles", status: "COMPLETE", notes: "Parent portal + child switcher" },
  { module: "Authentication & Access", feature: "Staff roles", status: "PARTIAL", notes: "HR/accountant typed; weak demo personas" },
  { module: "Authentication & Access", feature: "Profile", status: "PARTIAL", notes: "Student/teacher profiles; account profile page added" },
  { module: "Authentication & Access", feature: "Account settings", status: "PARTIAL", notes: "Account settings page added (mock)" },
  { module: "Authentication & Access", feature: "Notification preferences", status: "PARTIAL", notes: "Preferences page added (mock channels)" },

  // C. Students
  { module: "Student Management", feature: "Student dashboard", status: "COMPLETE", notes: "Admin + student portal dashboards" },
  { module: "Student Management", feature: "Student profile", status: "COMPLETE", notes: "Admin profile + portal profile" },
  { module: "Student Management", feature: "Personal information", status: "COMPLETE", notes: "Overview tab fields" },
  { module: "Student Management", feature: "Contact information", status: "COMPLETE", notes: "Email/phone on profile" },
  { module: "Student Management", feature: "Address", status: "COMPLETE", notes: "Address/city sections" },
  { module: "Student Management", feature: "Guardian/parent information", status: "COMPLETE", notes: "Guardian name/relation/phone" },
  { module: "Student Management", feature: "Student ID", status: "COMPLETE", notes: "studentId + digital ID card" },
  { module: "Student Management", feature: "Student photo", status: "PARTIAL", notes: "Initials avatar; photo doc stub" },
  { module: "Student Management", feature: "Admission information", status: "COMPLETE", notes: "Full admissions module" },
  { module: "Student Management", feature: "Enrollment information", status: "PARTIAL", notes: "Enrollment list; limited depth" },
  { module: "Student Management", feature: "Department", status: "COMPLETE", notes: "On model + filters" },
  { module: "Student Management", feature: "Program", status: "COMPLETE", notes: "On model + filters" },
  { module: "Student Management", feature: "Class/section", status: "COMPLETE", notes: "Section/semester fields" },
  { module: "Student Management", feature: "Academic status", status: "PARTIAL", notes: "Status badges; some tabs stubbed" },
  { module: "Student Management", feature: "Documents", status: "PARTIAL", notes: "Vault + portal upload (demo)" },
  { module: "Student Management", feature: "Emergency contact", status: "PARTIAL", notes: "Guardian used as emergency contact" },
  { module: "Student Management", feature: "Student history", status: "PARTIAL", notes: "Activity timeline tab" },
  { module: "Student Management", feature: "Profile update request", status: "PARTIAL", notes: "Application type; limited self-serve form" },
  { module: "Student Management", feature: "Student status", status: "PARTIAL", notes: "active/inactive/graduated/suspended/on_leave; withdrawn/transferred/alumni partial" },

  // D. Parents
  { module: "Parent Management", feature: "Parent profile", status: "PARTIAL", notes: "Account settings covers basic profile" },
  { module: "Parent Management", feature: "Multiple children", status: "COMPLETE", notes: "Children list with metrics" },
  { module: "Parent Management", feature: "Child switching", status: "COMPLETE", notes: "ChildSwitcher in context" },
  { module: "Parent Management", feature: "Child information", status: "COMPLETE", notes: "Children page with GPA/fees" },
  { module: "Parent Management", feature: "Child attendance", status: "COMPLETE", notes: "/parent/attendance" },
  { module: "Parent Management", feature: "Child results", status: "COMPLETE", notes: "/parent/results" },
  { module: "Parent Management", feature: "Child timetable", status: "PARTIAL", notes: "Parent timetable page added" },
  { module: "Parent Management", feature: "Child fees", status: "COMPLETE", notes: "Interactive pay dialog" },
  { module: "Parent Management", feature: "Child notices", status: "COMPLETE", notes: "/parent/notices" },
  { module: "Parent Management", feature: "Child assignments", status: "PARTIAL", notes: "Phase 2 assignments; parent view linked" },
  { module: "Parent Management", feature: "Child applications", status: "COMPLETE", notes: "/parent/applications" },
  { module: "Parent Management", feature: "Parent complaints", status: "COMPLETE", notes: "/parent/complaints" },
  { module: "Parent Management", feature: "Parent feedback", status: "COMPLETE", notes: "/parent/feedback" },
  { module: "Parent Management", feature: "Parent notifications", status: "COMPLETE", notes: "/parent/alerts" },

  // E. Teacher / Staff
  { module: "Teacher / Staff", feature: "Teacher profile", status: "COMPLETE", notes: "Rich /teachers/[id] tabs" },
  { module: "Teacher / Staff", feature: "Staff profile", status: "PARTIAL", notes: "HR employee list; no detail page" },
  { module: "Teacher / Staff", feature: "Department", status: "COMPLETE", notes: "On teacher/employee records" },
  { module: "Teacher / Staff", feature: "Designation", status: "COMPLETE", notes: "Teacher + HR tables" },
  { module: "Teacher / Staff", feature: "Courses", status: "COMPLETE", notes: "Teacher My Classes" },
  { module: "Teacher / Staff", feature: "Classes", status: "COMPLETE", notes: "/teacher/classes" },
  { module: "Teacher / Staff", feature: "Attendance", status: "COMPLETE", notes: "Mark attendance dialog" },
  { module: "Teacher / Staff", feature: "Leave", status: "COMPLETE", notes: "Teacher leave + HR leave" },
  { module: "Teacher / Staff", feature: "Payroll", status: "COMPLETE", notes: "/hr/payroll" },
  { module: "Teacher / Staff", feature: "Salary", status: "COMPLETE", notes: "Basic/net columns" },
  { module: "Teacher / Staff", feature: "Allowances", status: "COMPLETE", notes: "Payroll column" },
  { module: "Teacher / Staff", feature: "Deductions", status: "COMPLETE", notes: "Payroll column" },
  { module: "Teacher / Staff", feature: "Documents", status: "COMPLETE", notes: "Teacher profile documents tab" },
  { module: "Teacher / Staff", feature: "Employee status", status: "COMPLETE", notes: "Active / on leave badges" },
  { module: "Teacher / Staff", feature: "Teacher dashboard", status: "COMPLETE", notes: "/teacher/dashboard" },

  // F. Academic
  { module: "Academic Management", feature: "Academic years", status: "MISSING", notes: "No dedicated academic-year manager" },
  { module: "Academic Management", feature: "Semesters", status: "PARTIAL", notes: "Settings fields + display" },
  { module: "Academic Management", feature: "Departments", status: "COMPLETE", notes: "/academics/departments" },
  { module: "Academic Management", feature: "Faculties", status: "MISSING", notes: "No faculty org-unit CRUD" },
  { module: "Academic Management", feature: "Programs", status: "COMPLETE", notes: "/academics/programs" },
  { module: "Academic Management", feature: "Courses", status: "COMPLETE", notes: "/academics/courses" },
  { module: "Academic Management", feature: "Subjects", status: "PARTIAL", notes: "Used on classes; no subjects catalog" },
  { module: "Academic Management", feature: "Classes", status: "PARTIAL", notes: "Covered via sections" },
  { module: "Academic Management", feature: "Sections", status: "COMPLETE", notes: "/academics/sections" },
  { module: "Academic Management", feature: "Batches", status: "MISSING", notes: "No batch entity/UI" },
  { module: "Academic Management", feature: "Credit hours", status: "COMPLETE", notes: "On programs/courses" },
  { module: "Academic Management", feature: "Course prerequisites", status: "MISSING", notes: "Not modeled in Phase 1 UI" },
  { module: "Academic Management", feature: "Course registration", status: "MISSING", notes: "No add/drop registration UI" },
  { module: "Academic Management", feature: "Enrollment", status: "PARTIAL", notes: "Admissions enrollment + read-only courses" },
  { module: "Academic Management", feature: "Student-course relationship", status: "PARTIAL", notes: "mockStudentCourses display only" },

  // G. Attendance
  { module: "Attendance", feature: "Student attendance", status: "COMPLETE", notes: "Admin + portals" },
  { module: "Attendance", feature: "Teacher attendance", status: "COMPLETE", notes: "/attendance/teachers" },
  { module: "Attendance", feature: "Staff attendance", status: "COMPLETE", notes: "/hr/attendance" },
  { module: "Attendance", feature: "Daily attendance", status: "COMPLETE", notes: "Daily tables + KPIs" },
  { module: "Attendance", feature: "Attendance by course", status: "PARTIAL", notes: "Course column; no deep report" },
  { module: "Attendance", feature: "Attendance by class", status: "PARTIAL", notes: "Filters by grade/section" },
  { module: "Attendance", feature: "Attendance reports", status: "PARTIAL", notes: "Reports hub card only" },
  { module: "Attendance", feature: "Attendance percentage", status: "COMPLETE", notes: "Rates on dashboards/profiles" },
  { module: "Attendance", feature: "Late / Absent / Present / Leave", status: "COMPLETE", notes: "Status badges + marking UI" },
  { module: "Attendance", feature: "Attendance correction", status: "COMPLETE", notes: "/attendance/corrections" },
  { module: "Attendance", feature: "Attendance approval", status: "PARTIAL", notes: "Status shown; limited actions" },
  { module: "Attendance", feature: "Attendance dashboard", status: "COMPLETE", notes: "/attendance KPIs" },

  // H. Timetable
  { module: "Timetable", feature: "Class timetable", status: "COMPLETE", notes: "Academics weekly grid" },
  { module: "Timetable", feature: "Teacher timetable", status: "COMPLETE", notes: "/teacher/timetable" },
  { module: "Timetable", feature: "Room allocation", status: "PARTIAL", notes: "Room on slots; no allocator" },
  { module: "Timetable", feature: "Course schedule", status: "COMPLETE", notes: "Slots with course/teacher/room" },
  { module: "Timetable", feature: "Weekly view", status: "COMPLETE", notes: "Day columns grid" },
  { module: "Timetable", feature: "Daily view", status: "PARTIAL", notes: "Implied by weekly columns" },
  { module: "Timetable", feature: "Calendar view", status: "PARTIAL", notes: "/calendar is events calendar" },
  { module: "Timetable", feature: "Conflict detection UI", status: "MISSING", notes: "None" },
  { module: "Timetable", feature: "Room availability", status: "MISSING", notes: "None" },

  // I. Exams & Results
  { module: "Exams & Results", feature: "Exam creation", status: "PARTIAL", notes: "Schedule exam mock dialog" },
  { module: "Exams & Results", feature: "Exam schedule", status: "COMPLETE", notes: "/exams/schedules" },
  { module: "Exams & Results", feature: "Exam timetable", status: "PARTIAL", notes: "Table schedule, not grid" },
  { module: "Exams & Results", feature: "Exam types", status: "COMPLETE", notes: "Midterm/Final badges" },
  { module: "Exams & Results", feature: "Subjects", status: "PARTIAL", notes: "Course-based" },
  { module: "Exams & Results", feature: "Marks", status: "COMPLETE", notes: "/exams/marks + teacher marks" },
  { module: "Exams & Results", feature: "Grades", status: "COMPLETE", notes: "Grade badges on results" },
  { module: "Exams & Results", feature: "Grade configuration", status: "PARTIAL", notes: "Single grading scale input" },
  { module: "Exams & Results", feature: "Result calculation UI", status: "PARTIAL", notes: "Precomputed mock totals" },
  { module: "Exams & Results", feature: "Student result", status: "COMPLETE", notes: "Admin + portals" },
  { module: "Exams & Results", feature: "Report card", status: "MISSING", notes: "No report-card UI" },
  { module: "Exams & Results", feature: "Transcript", status: "PARTIAL", notes: "Download toast only" },
  { module: "Exams & Results", feature: "GPA", status: "COMPLETE", notes: "Shown on results" },
  { module: "Exams & Results", feature: "CGPA", status: "COMPLETE", notes: "Shown on results/profiles" },
  { module: "Exams & Results", feature: "Result publishing", status: "MISSING", notes: "No publish workflow" },
  { module: "Exams & Results", feature: "Result approval", status: "MISSING", notes: "No result-approval UI" },
  { module: "Exams & Results", feature: "Result reports", status: "PARTIAL", notes: "Reports category cards" },

  // J. Fees
  { module: "Fees & Finance", feature: "Fee structure", status: "COMPLETE", notes: "Fee breakdown heads" },
  { module: "Fees & Finance", feature: "Fee categories", status: "COMPLETE", notes: "Tuition/Lab/Library/etc." },
  { module: "Fees & Finance", feature: "Student fee invoice", status: "COMPLETE", notes: "/fees/invoices" },
  { module: "Fees & Finance", feature: "Parent fee view", status: "COMPLETE", notes: "/parent/fees" },
  { module: "Fees & Finance", feature: "Payment status", status: "COMPLETE", notes: "Paid/partial/overdue/waived" },
  { module: "Fees & Finance", feature: "Paid / Pending / Overdue", status: "COMPLETE", notes: "Status badges across fees" },
  { module: "Fees & Finance", feature: "Discounts", status: "MISSING", notes: "No discount UI" },
  { module: "Fees & Finance", feature: "Scholarships", status: "COMPLETE", notes: "/fees/scholarships" },
  { module: "Fees & Finance", feature: "Concessions", status: "PARTIAL", notes: "Application type only" },
  { module: "Fees & Finance", feature: "Online payment UI", status: "COMPLETE", notes: "Parent pay dialog (demo)" },
  { module: "Fees & Finance", feature: "Payment history", status: "COMPLETE", notes: "Payments table" },
  { module: "Fees & Finance", feature: "Receipts", status: "PARTIAL", notes: "Receipt codes; no viewer" },
  { module: "Fees & Finance", feature: "Finance dashboard", status: "COMPLETE", notes: "/fees KPIs" },
  { module: "Fees & Finance", feature: "Finance reports", status: "PARTIAL", notes: "Reports category only" },

  // K. Applications
  { module: "Applications & Workflow", feature: "Application submission", status: "COMPLETE", notes: "Mock forms + portals" },
  { module: "Applications & Workflow", feature: "Application list", status: "COMPLETE", notes: "Dashboard table" },
  { module: "Applications & Workflow", feature: "Application detail", status: "COMPLETE", notes: "Timeline + form + audit" },
  { module: "Applications & Workflow", feature: "Approval / Rejection / Pending", status: "COMPLETE", notes: "Approve/Reject/Request changes" },
  { module: "Applications & Workflow", feature: "Workflow stages", status: "COMPLETE", notes: "Timeline + workflow detail" },
  { module: "Applications & Workflow", feature: "Comments", status: "PARTIAL", notes: "Request-changes textarea" },
  { module: "Applications & Workflow", feature: "Attachments", status: "PARTIAL", notes: "Mentioned; limited file UI" },
  { module: "Applications & Workflow", feature: "Approval history", status: "COMPLETE", notes: "Audit history card" },
  { module: "Applications & Workflow", feature: "Request tracking", status: "COMPLETE", notes: "Stage/SLA/status" },
  { module: "Applications & Workflow", feature: "Status tracking", status: "COMPLETE", notes: "Full status badges" },
  { module: "Applications & Workflow", feature: "Notifications", status: "PARTIAL", notes: "Bell items; not event-driven" },

  // L. Notices
  { module: "Notices & Communication", feature: "Notice board", status: "COMPLETE", notes: "Admin + portal lists" },
  { module: "Notices & Communication", feature: "Notice creation", status: "COMPLETE", notes: "Create notice mock form" },
  { module: "Notices & Communication", feature: "Notice categories", status: "PARTIAL", notes: "Audience/status; weak taxonomy" },
  { module: "Notices & Communication", feature: "Target audience", status: "COMPLETE", notes: "Students/faculty/parents/all" },
  { module: "Notices & Communication", feature: "Publish date", status: "COMPLETE", notes: "Published column" },
  { module: "Notices & Communication", feature: "Expiry date", status: "COMPLETE", notes: "Expiry column" },
  { module: "Notices & Communication", feature: "Attachments", status: "MISSING", notes: "No notice attachment UI" },
  { module: "Notices & Communication", feature: "Announcements", status: "COMPLETE", notes: "Notices as announcements" },
  { module: "Notices & Communication", feature: "Notifications", status: "COMPLETE", notes: "Channels + notification log" },
  { module: "Notices & Communication", feature: "Events", status: "COMPLETE", notes: "/events + calendar" },
  { module: "Notices & Communication", feature: "Calendar", status: "COMPLETE", notes: "/calendar" },
  { module: "Notices & Communication", feature: "Push notification concept", status: "PARTIAL", notes: "Channel KPI demo" },
  { module: "Notices & Communication", feature: "Email notification concept", status: "PARTIAL", notes: "Channel KPI demo" },
  { module: "Notices & Communication", feature: "In-app notifications", status: "COMPLETE", notes: "Bell feed + alerts" },

  // M. Documents
  { module: "Documents", feature: "Student documents", status: "PARTIAL", notes: "Vault + student portal" },
  { module: "Documents", feature: "Teacher documents", status: "COMPLETE", notes: "Teacher profile documents" },
  { module: "Documents", feature: "Staff documents", status: "PARTIAL", notes: "Folder only" },
  { module: "Documents", feature: "Document upload", status: "COMPLETE", notes: "Mock upload dialogs" },
  { module: "Documents", feature: "Document verification", status: "COMPLETE", notes: "Verified/Pending badges" },
  { module: "Documents", feature: "Document status", status: "COMPLETE", notes: "Verified/pending" },
  { module: "Documents", feature: "Document download", status: "PARTIAL", notes: "Toast actions only" },
  { module: "Documents", feature: "Document request", status: "PARTIAL", notes: "Via application types" },
  { module: "Documents", feature: "Certificate request", status: "PARTIAL", notes: "App type; Phase 2 expands" },
  { module: "Documents", feature: "ID card", status: "COMPLETE", notes: "StudentIdCard component" },
  { module: "Documents", feature: "Transcript", status: "PARTIAL", notes: "Template + download toast" },

  // N. HR
  { module: "HR & Payroll", feature: "Employee management", status: "COMPLETE", notes: "/hr/employees" },
  { module: "HR & Payroll", feature: "Employee attendance", status: "COMPLETE", notes: "/hr/attendance" },
  { module: "HR & Payroll", feature: "Leave", status: "COMPLETE", notes: "/hr/leave" },
  { module: "HR & Payroll", feature: "Leave types", status: "PARTIAL", notes: "Shown as strings; no config" },
  { module: "HR & Payroll", feature: "Payroll", status: "COMPLETE", notes: "Payroll run action" },
  { module: "HR & Payroll", feature: "Salary", status: "COMPLETE", notes: "Basic/net columns" },
  { module: "HR & Payroll", feature: "Allowances", status: "COMPLETE", notes: "Column present" },
  { module: "HR & Payroll", feature: "Deductions", status: "COMPLETE", notes: "Column present" },
  { module: "HR & Payroll", feature: "Payroll period", status: "PARTIAL", notes: "Hard-coded period label" },
  { module: "HR & Payroll", feature: "Payslip", status: "MISSING", notes: "No payslip view" },
  { module: "HR & Payroll", feature: "Payroll reports", status: "PARTIAL", notes: "HR reports category only" },

  // O. Reports
  { module: "Reports & Dashboards", feature: "Admin dashboard", status: "COMPLETE", notes: "/dashboard" },
  { module: "Reports & Dashboards", feature: "Student dashboard", status: "COMPLETE", notes: "/student/dashboard" },
  { module: "Reports & Dashboards", feature: "Parent dashboard", status: "COMPLETE", notes: "/parent/dashboard" },
  { module: "Reports & Dashboards", feature: "Teacher dashboard", status: "COMPLETE", notes: "/teacher/dashboard" },
  { module: "Reports & Dashboards", feature: "Finance dashboard", status: "COMPLETE", notes: "Fees module" },
  { module: "Reports & Dashboards", feature: "Attendance dashboard", status: "COMPLETE", notes: "Attendance module" },
  { module: "Reports & Dashboards", feature: "Academic dashboard", status: "COMPLETE", notes: "Academics overview" },
  { module: "Reports & Dashboards", feature: "HR dashboard", status: "COMPLETE", notes: "/hr" },
  { module: "Reports & Dashboards", feature: "Reports", status: "PARTIAL", notes: "Category cards; limited drill-down" },
  { module: "Reports & Dashboards", feature: "Charts", status: "COMPLETE", notes: "Recharts on dashboards" },
  { module: "Reports & Dashboards", feature: "Filters", status: "PARTIAL", notes: "Strong on lists; weak on reports" },
  { module: "Reports & Dashboards", feature: "Export UI", status: "PARTIAL", notes: "Export toasts" },
  { module: "Reports & Dashboards", feature: "PDF export concept", status: "PARTIAL", notes: "Implied by toasts" },
  { module: "Reports & Dashboards", feature: "Excel export concept", status: "PARTIAL", notes: "Implied by import/export" },
];

export const PHASE1_AUDIT_SUMMARY = {
  generatedAt: "2026-08-23",
  total: PHASE1_AUDIT.length,
  complete: PHASE1_AUDIT.filter((f) => f.status === "COMPLETE").length,
  partial: PHASE1_AUDIT.filter((f) => f.status === "PARTIAL").length,
  missing: PHASE1_AUDIT.filter((f) => f.status === "MISSING").length,
  needsImprovement: PHASE1_AUDIT.filter((f) => f.status === "NEEDS_IMPROVEMENT").length,
  /** Weighted: COMPLETE=1, PARTIAL=0.5, NEEDS_IMPROVEMENT=0.4, MISSING=0 */
  completionPercent: Math.round(
    (PHASE1_AUDIT.reduce((sum, f) => {
      if (f.status === "COMPLETE") return sum + 1;
      if (f.status === "PARTIAL") return sum + 0.5;
      if (f.status === "NEEDS_IMPROVEMENT") return sum + 0.4;
      return sum;
    }, 0) /
      PHASE1_AUDIT.length) *
      100,
  ),
};

export const PHASE1_FINDINGS = {
  missingFeatures: PHASE1_AUDIT.filter((f) => f.status === "MISSING").map(
    (f) => `${f.module} → ${f.feature}: ${f.notes}`,
  ),
  partialFeatures: PHASE1_AUDIT.filter((f) => f.status === "PARTIAL").map(
    (f) => `${f.module} → ${f.feature}: ${f.notes}`,
  ),
  uiInconsistencies: [
    "Student/teacher profiles use custom purple accents (#6B58F6) vs theme tokens elsewhere",
    "Some student profile tabs are ContentStub link-outs rather than embedded data",
    "Events at /events while notices under /communication/*",
    "Dense SimpleTables lack mobile card layouts on some modules",
  ],
  navigationInconsistencies: [
    "Settings sub-routes (theme, import, modules) not all in main sidebar",
    "Communication notifications not in main sidebar",
    "Accountant/HR roles share institution shell inconsistently",
  ],
  missingRoutes: [
    "/admissions/applicants/[id] (linked but missing)",
    "Previously missing: /reset-password, /parent/timetable, /settings/modules, /account/* (addressed in Phase 1 fixes)",
  ],
  missingComponents: [
    "Report card generator",
    "Payslip viewer",
    "Timetable conflict detection",
    "Room availability allocator",
    "Faculty / batch / academic-year managers",
  ],
  missingMockData: [
    "Academic years, faculties, batches, prerequisites",
    "Room inventory",
    "Payslips, grade-scale tables, report cards",
    "Parent profile model",
  ],
  permissionGaps: [
    "Role switcher only — any URL reachable regardless of role",
    "Permission matrix is display-only",
    "Demo users omit strong accountant/hr/exam_officer personas",
  ],
  responsiveIssues: [
    "Timetable 5-column grid cramped on small screens",
    "Horizontal scroll on profile tab bars",
    "Tables often rely on overflow-x-auto without card fallbacks",
  ],
};
