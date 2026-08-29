import type { InstitutionType, UserRole } from "@/types";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  tone: "purple" | "coral" | "teal" | "orange" | "blue" | "mint";
  icon: "users" | "faculty" | "events" | "finance" | "forms" | "hostel" | "transport" | "attendance" | "applications";
}

/** Institution-type KPI packs for the admin/institution dashboard. */
export function getInstitutionDashboardStats(
  type: InstitutionType,
  studentCount: number,
  staffCount: number,
  eventCount: number,
): DashboardStat[] {
  if (type === "university") {
    return [
      {
        id: "students",
        label: "Enrolled students",
        value: String(studentCount),
        change: "+1.2%",
        changeType: "up",
        tone: "purple",
        icon: "users",
      },
      {
        id: "faculty",
        label: "Faculty & staff",
        value: String(staffCount),
        change: "+0.4%",
        changeType: "up",
        tone: "coral",
        icon: "faculty",
      },
      {
        id: "forms",
        label: "Forms pending",
        value: "186",
        change: "Convocation + degree",
        changeType: "neutral",
        tone: "orange",
        icon: "forms",
      },
      {
        id: "finance",
        label: "Fee recovery",
        value: "92%",
        change: "+3%",
        changeType: "up",
        tone: "teal",
        icon: "finance",
      },
    ];
  }

  return [
    {
      id: "students",
      label: "Total students",
      value: String(studentCount),
      change: "+0.5%",
      changeType: "up",
      tone: "purple",
      icon: "users",
    },
    {
      id: "faculty",
      label: "Total teachers",
      value: String(staffCount),
      change: "-3%",
      changeType: "down",
      tone: "coral",
      icon: "faculty",
    },
    {
      id: "events",
      label: "Events",
      value: String(Math.max(eventCount, 8)),
      change: "+6%",
      changeType: "up",
      tone: "teal",
      icon: "events",
    },
    {
      id: "finance",
      label: "Invoice status",
      value: "1,397",
      change: "+2%",
      changeType: "up",
      tone: "orange",
      icon: "finance",
    },
  ];
}

/** Extra KPIs when viewing as Registrar / VC-style roles. */
export function getRoleDashboardExtras(role: UserRole, type: InstitutionType): DashboardStat[] {
  if (role === "registrar") {
    return [
      {
        id: "convocation",
        label: "Convocation queue",
        value: "126",
        change: "Needs review",
        changeType: "down",
        tone: "orange",
        icon: "forms",
      },
      {
        id: "degree",
        label: "Degree requests",
        value: "38",
        change: "Exam desk",
        changeType: "neutral",
        tone: "blue",
        icon: "applications",
      },
      {
        id: "passes",
        label: "Passes issued",
        value: "921",
        change: "+48 today",
        changeType: "up",
        tone: "teal",
        icon: "forms",
      },
      {
        id: "clearance",
        label: "Clearance pending",
        value: "54",
        change: "Library / finance",
        changeType: "neutral",
        tone: "coral",
        icon: "applications",
      },
    ];
  }

  if (role === "principal" && type === "university") {
    return [
      {
        id: "students",
        label: "Active enrollments",
        value: "8,426",
        change: "All campuses",
        changeType: "up",
        tone: "purple",
        icon: "users",
      },
      {
        id: "attendance",
        label: "Campus attendance",
        value: "91%",
        change: "Today",
        changeType: "up",
        tone: "teal",
        icon: "attendance",
      },
      {
        id: "hostel",
        label: "Hostel occupancy",
        value: "87%",
        change: "1,240 beds",
        changeType: "neutral",
        tone: "coral",
        icon: "hostel",
      },
      {
        id: "transport",
        label: "Transport riders",
        value: "842",
        change: "Monthly + tokens",
        changeType: "up",
        tone: "orange",
        icon: "transport",
      },
    ];
  }

  return [];
}

export const universityPrograms = [
  "All Programmes",
  "BE Computer Systems",
  "BE Electrical",
  "BE Civil",
  "BE Mechanical",
  "BBA / Management",
  "MS Computer Science",
];

export const universityStarWeekly = [
  { rank: 1, id: "u-1", name: "Ahmed Khan", className: "BE Computer Systems", section: "CS-6A", marks: 96, gpa: 3.85, subject: "Algorithms", avatarInitials: "AK", avatarColor: "#6B58F6", trend: "up" as const, change: "+2" },
  { rank: 2, id: "u-2", name: "Hira Ali", className: "BE Electrical", section: "EE-5B", marks: 94, gpa: 3.78, subject: "Power Systems", avatarInitials: "HA", avatarColor: "#1BD0B4", trend: "up" as const, change: "+1" },
  { rank: 3, id: "u-3", name: "Bilal Hussain", className: "BE Civil", section: "CE-7A", marks: 93, gpa: 3.72, subject: "Structures", avatarInitials: "BH", avatarColor: "#F4901F", trend: "same" as const, change: "0" },
  { rank: 4, id: "u-4", name: "Sana Raza", className: "BBA / Management", section: "MS-2A", marks: 92, gpa: 3.68, subject: "Finance", avatarInitials: "SR", avatarColor: "#3B82F6", trend: "up" as const, change: "+3" },
  { rank: 5, id: "u-5", name: "Usama Farooq", className: "BE Mechanical", section: "ME-4A", marks: 91, gpa: 3.65, subject: "Thermo", avatarInitials: "UF", avatarColor: "#8C4AF2", trend: "down" as const, change: "-1" },
];
