export const mockNotices = [
  { id: "notice-001", title: "Fall 2026 Course Registration Opens Sep 1", audience: "All students", published: "2026-08-20", expiry: "2026-09-15", status: "published" },
  { id: "notice-002", title: "Midterm Examination Schedule Published", audience: "Faculty & students", published: "2026-08-19", expiry: "2026-09-30", status: "published" },
  { id: "notice-003", title: "Scholarship Application Deadline — Sep 15", audience: "Eligible students", published: "2026-08-18", expiry: "2026-09-15", status: "published" },
  { id: "notice-004", title: "Independence Day Holiday — Campus Closed", audience: "All", published: "2026-08-10", expiry: "2026-08-14", status: "expired" },
  { id: "notice-005", title: "Faculty Development Workshop", audience: "Faculty", published: "2026-08-22", expiry: "2026-08-28", status: "draft" },
];

export const mockEvents = [
  { id: "evt-001", title: "Midterm Exams Begin", type: "Exam", date: "2026-08-28", campus: "All" },
  { id: "evt-002", title: "Faculty Senate Meeting", type: "Meeting", date: "2026-08-25", campus: "Main Campus" },
  { id: "evt-003", title: "Admission Interview Week", type: "Admissions", date: "2026-09-02", campus: "City Campus" },
  { id: "evt-004", title: "Independence Day Holiday", type: "Holiday", date: "2026-08-14", campus: "All" },
];

export const COMM_TABS = [
  { id: "notices", label: "Notices", href: "/communication/notices" },
  { id: "notifications", label: "Notifications", href: "/communication/notifications" },
];
