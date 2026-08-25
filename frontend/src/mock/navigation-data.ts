import type { NotificationItem, SearchResult } from "@/types";

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "18 applications awaiting approval",
    message: "Leave and scholarship requests need your review in the Applications module.",
    category: "application",
    read: false,
    createdAt: "2026-08-22T09:15:00",
    href: "/applications",
  },
  {
    id: "notif-2",
    title: "Attendance correction approved",
    message: "Ahmed Khan's attendance for CS-301 has been updated to Present.",
    category: "attendance",
    read: false,
    createdAt: "2026-08-22T08:42:00",
    href: "/attendance/corrections",
  },
  {
    id: "notif-3",
    title: "Fee payment received",
    message: "PKR 85,000 received from Fatima Sheikh for Fall 2026 semester.",
    category: "fees",
    read: true,
    createdAt: "2026-08-21T16:20:00",
    href: "/fees/payments",
  },
  {
    id: "notif-4",
    title: "Midterm schedule published",
    message: "Fall 2026 midterm examination schedule is now available.",
    category: "exams",
    read: true,
    createdAt: "2026-08-21T11:00:00",
    href: "/exams/schedules",
  },
  {
    id: "notif-5",
    title: "Campus closure notice",
    message: "Independence Day holiday — campus closed on August 14.",
    category: "notices",
    read: true,
    createdAt: "2026-08-20T14:30:00",
    href: "/communication/notices",
  },
];

/** Parent-role bell feed (fee due, visit requests, teacher concerns). */
export const mockParentNotifications: NotificationItem[] = [
  {
    id: "p-notif-1",
    title: "Fee overdue — Ali Khan",
    message: "July fee has PKR 4,000 outstanding. Pay from Fees to clear late dues.",
    category: "fees",
    read: false,
    createdAt: "2026-08-22T08:00:00",
    href: "/parent/fees",
  },
  {
    id: "p-notif-2",
    title: "School visit requested",
    message: "Class teacher Ms. Hina Tariq asked you to visit regarding Ali Khan.",
    category: "visit",
    read: false,
    createdAt: "2026-08-22T09:30:00",
    href: "/parent/alerts",
  },
  {
    id: "p-notif-3",
    title: "Teacher concern filed",
    message: "A concern was recorded about repeated late arrivals for Ali Khan.",
    category: "complaint",
    read: false,
    createdAt: "2026-08-20T14:00:00",
    href: "/parent/complaints",
  },
  {
    id: "p-notif-4",
    title: "August fee due",
    message: "Ali Khan's August monthly fee is due. You may pay one or more months.",
    category: "fees",
    read: true,
    createdAt: "2026-08-21T10:00:00",
    href: "/parent/fees",
  },
];

export const mockSearchResults: SearchResult[] = [
  {
    id: "sr-1",
    type: "student",
    title: "Ahmed Khan",
    subtitle: "BS Computer Science · Semester 6",
    meta: "STU-2024-1024",
    href: "/students/stu-2024-1024",
  },
  {
    id: "sr-2",
    type: "teacher",
    title: "Ahmed Khan",
    subtitle: "Electrical Engineering · Assistant Professor",
    meta: "EMP-2019-044",
    href: "/hr/employees/emp-2019-044",
  },
  {
    id: "sr-3",
    type: "course",
    title: "CS-301 Data Structures",
    subtitle: "Computer Science · 3 Credit Hours",
    meta: "Section A",
    href: "/academics/courses/cs-301",
  },
  {
    id: "sr-4",
    type: "application",
    title: "Leave Application — Ayesha Sheikh",
    subtitle: "Submitted Aug 20 · Pending HOD review",
    meta: "APP-2026-1842",
    href: "/applications/app-2026-1842",
  },
  {
    id: "sr-5",
    type: "notice",
    title: "Fall 2026 Course Registration Opens",
    subtitle: "Published Aug 18 · All students",
    href: "/communication/notices",
  },
];

export const mockRecentSearches = [
  "Ahmed Khan",
  "CS-301",
  "scholarship applications",
  "attendance corrections",
];
